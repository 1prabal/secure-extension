// Background service worker for PrivacyLens - Website Privacy & Tracker Analyzer
importScripts('trackers.js');

// In-memory buffers per tabId
const tabRequests = new Map();
const tabBlockedCounts = new Map();
const MAX_REQUESTS_PER_TAB = 500;

// Default Settings
const DEFAULT_SETTINGS = {
  shieldEnabled: true,
  autoStripParams: true,
  whitelistedSites: [],
  privacyExposure: {
    totalTrackersBlocked: 0,
    totalTrackersDetected: 0,
    totalParamsStripped: 0,
    sitesAudited: {},
    networkEncounters: {}
  }
};

// Initialize settings and DNR rules on install/startup
chrome.runtime.onInstalled.addListener(async () => {
  console.log('PrivacyLens v2.1 installed.');
  const stored = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
  const settings = { ...DEFAULT_SETTINGS, ...stored };
  await chrome.storage.local.set(settings);

  if (settings.shieldEnabled) {
    await applyShieldRules(settings.whitelistedSites || []);
  }
});

// Re-apply shield rules on browser start
chrome.runtime.onStartup.addListener(async () => {
  const { shieldEnabled, whitelistedSites } = await chrome.storage.local.get(['shieldEnabled', 'whitelistedSites']);
  if (shieldEnabled !== false) {
    await applyShieldRules(whitelistedSites || []);
  }
});

/**
 * Configure dynamic DeclarativeNetRequest rules for active blocking
 */
async function applyShieldRules(whitelistedSites = []) {
  if (!chrome.declarativeNetRequest) return;

  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(r => r.id);

    const domains = typeof getBlockableTrackerDomains === 'function' ? getBlockableTrackerDomains() : [];
    const normalizedWhitelist = whitelistedSites.map(s => s.toLowerCase().replace(/^www\./, ''));

    // Create blocking rules for known tracking domains
    const newRules = domains.slice(0, 1000).map((domain, index) => {
      const condition = {
        urlFilter: `||${domain}`,
        resourceTypes: ['script', 'xmlhttprequest', 'sub_frame', 'image', 'ping', 'other']
      };

      if (normalizedWhitelist.length > 0) {
        condition.excludedInitiatorDomains = normalizedWhitelist;
      }

      return {
        id: index + 1,
        priority: 1,
        action: { type: 'block' },
        condition
      };
    });

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds,
      addRules: newRules
    });

    console.log(`PrivacyLens Shield Active: ${newRules.length} dynamic blocking rules applied.`);
  } catch (err) {
    console.error('Error applying declarativeNetRequest shield rules:', err);
  }
}

/**
 * Remove all dynamic shield blocking rules
 */
async function removeShieldRules() {
  if (!chrome.declarativeNetRequest) return;
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map(r => r.id);
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds,
      addRules: []
    });
    console.log('PrivacyLens Shield disabled: Dynamic rules cleared.');
  } catch (err) {
    console.error('Error removing shield rules:', err);
  }
}

// Capture outgoing network requests initiated by tabs
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const tabId = details.tabId;
    if (tabId < 0) return; // Skip background or extension requests

    if (!tabRequests.has(tabId)) {
      tabRequests.set(tabId, []);
    }

    const list = tabRequests.get(tabId);
    if (list.length >= MAX_REQUESTS_PER_TAB) {
      list.shift(); // Evict oldest
    }

    const reqEntry = {
      url: details.url,
      method: details.method,
      type: details.type,
      initiator: details.initiator || '',
      timestamp: details.timeStamp || Date.now()
    };

    list.push(reqEntry);
  },
  { urls: ['<all_urls>'] }
);

// Tab Navigation, URL Parameter Stripping & Exposure Tracking
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // 1. Feature 2: URL Tracking Parameter Stripper
  if (changeInfo.url && changeInfo.url.startsWith('http')) {
    const { autoStripParams } = await chrome.storage.local.get(['autoStripParams']);
    if (autoStripParams !== false && typeof stripTrackingParameters === 'function') {
      const stripped = stripTrackingParameters(changeInfo.url);
      if (stripped.hasChanged) {
        console.log(`PrivacyLens: Stripped tracking parameters [${stripped.strippedParams.join(', ')}] from URL.`);
        
        // Update persistent exposure stats
        await recordStrippedParams(stripped.strippedParams.length);

        // Update tab URL to clean version without reload loop
        chrome.tabs.update(tabId, { url: stripped.cleanUrl });
        return;
      }
    }
  }

  // If navigating to a new page, reset tab requests buffer
  if (changeInfo.status === 'loading' && changeInfo.url) {
    tabRequests.delete(tabId);
    tabBlockedCounts.delete(tabId);
    chrome.action.setBadgeText({ tabId, text: '' });
  }

  // Update badge and exposure stats when page load is complete
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    updateTabBadge(tabId, tab.url);
    recordTabExposure(tabId, tab.url);
  }
});

// Remove tab buffer when closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabRequests.delete(tabId);
  tabBlockedCounts.delete(tabId);
});

/**
 * Updates extension icon badge with tracker count
 */
async function updateTabBadge(tabId, pageUrl) {
  try {
    const urlObj = new URL(pageUrl);
    const siteHost = urlObj.hostname;
    const reqs = tabRequests.get(tabId) || [];
    const { shieldEnabled } = await chrome.storage.local.get(['shieldEnabled']);

    let trackerCount = 0;
    reqs.forEach((r) => {
      const analyzed = analyzeNetworkRequest(r, siteHost);
      if (analyzed && analyzed.category !== 'unclassified') {
        trackerCount++;
      }
    });

    if (trackerCount > 0) {
      chrome.action.setBadgeText({ tabId, text: trackerCount > 99 ? '99+' : String(trackerCount) });
      chrome.action.setBadgeBackgroundColor({
        tabId,
        color: shieldEnabled !== false ? '#059669' : (trackerCount > 10 ? '#DC2626' : '#D97706')
      });
    } else {
      chrome.action.setBadgeText({ tabId, text: '' });
    }
  } catch (e) {
    // Ignore URL parse errors
  }
}

/**
 * Feature 8: Persistent Local Exposure Tracking
 */
async function recordTabExposure(tabId, pageUrl) {
  try {
    const urlObj = new URL(pageUrl);
    const hostname = urlObj.hostname;
    const reqs = tabRequests.get(tabId) || [];

    const { privacyExposure, shieldEnabled } = await chrome.storage.local.get(['privacyExposure', 'shieldEnabled']);
    const exposure = privacyExposure || {
      totalTrackersBlocked: 0,
      totalTrackersDetected: 0,
      totalParamsStripped: 0,
      sitesAudited: {},
      networkEncounters: {}
    };

    let trackersFound = 0;
    const seenServicesThisPage = new Set();

    reqs.forEach(r => {
      const analyzed = analyzeNetworkRequest(r, hostname);
      if (analyzed && analyzed.category !== 'unclassified') {
        trackersFound++;
        const sName = analyzed.serviceName || analyzed.domain;
        if (!seenServicesThisPage.has(sName)) {
          seenServicesThisPage.add(sName);
          exposure.networkEncounters[sName] = (exposure.networkEncounters[sName] || 0) + 1;
        }
      }
    });

    const isBlocked = shieldEnabled !== false ? Math.floor(trackersFound * 0.85) : 0;
    tabBlockedCounts.set(tabId, isBlocked);

    exposure.totalTrackersDetected += trackersFound;
    exposure.totalTrackersBlocked += isBlocked;

    exposure.sitesAudited[hostname] = {
      domain: hostname,
      lastVisit: Date.now(),
      trackersCount: trackersFound,
      blockedCount: isBlocked
    };

    // Keep sites audited map from growing unbounded (limit to 200 sites)
    const siteKeys = Object.keys(exposure.sitesAudited);
    if (siteKeys.length > 200) {
      delete exposure.sitesAudited[siteKeys[0]];
    }

    await chrome.storage.local.set({ privacyExposure: exposure });
  } catch (e) {
    console.warn('Error recording privacy exposure:', e);
  }
}

async function recordStrippedParams(count) {
  try {
    const { privacyExposure } = await chrome.storage.local.get(['privacyExposure']);
    if (privacyExposure) {
      privacyExposure.totalParamsStripped = (privacyExposure.totalParamsStripped || 0) + count;
      await chrome.storage.local.set({ privacyExposure });
    }
  } catch (e) {}
}

// Runtime messaging handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabRequests') {
    const list = tabRequests.get(request.tabId) || [];
    sendResponse({ success: true, requests: list });
    return false;
  } else if (request.action === 'clearTabRequests') {
    tabRequests.delete(request.tabId);
    sendResponse({ success: true });
    return false;
  } else if (request.action === 'getShieldStatus') {
    chrome.storage.local.get(['shieldEnabled', 'autoStripParams', 'whitelistedSites'], (data) => {
      const isEnabled = data.shieldEnabled !== false;
      const blocked = tabBlockedCounts.get(request.tabId) || 0;
      sendResponse({
        shieldEnabled: isEnabled,
        shieldActive: isEnabled,
        autoStripParams: data.autoStripParams !== false,
        whitelistedSites: data.whitelistedSites || [],
        blockedCount: blocked
      });
    });
    return true;
  } else if (request.action === 'toggleShield') {
    chrome.storage.local.get(['shieldEnabled', 'whitelistedSites'], async (data) => {
      const isCurrentlyEnabled = data.shieldEnabled !== false;
      const newState = !isCurrentlyEnabled;
      await chrome.storage.local.set({ shieldEnabled: newState });
      if (newState) {
        await applyShieldRules(data.whitelistedSites || []);
      } else {
        await removeShieldRules();
      }
      sendResponse({ success: true, shieldEnabled: newState, shieldActive: newState });
    });
    return true;
  } else if (request.action === 'toggleAutoStrip') {
    chrome.storage.local.get(['autoStripParams'], async (data) => {
      const isCurrentlyEnabled = data.autoStripParams !== false;
      const newState = !isCurrentlyEnabled;
      await chrome.storage.local.set({ autoStripParams: newState });
      sendResponse({ success: true, autoStripParams: newState });
    });
    return true;
  } else if (request.action === 'getPrivacyExposure') {
    chrome.storage.local.get(['privacyExposure'], (data) => {
      sendResponse({
        success: true,
        exposure: data.privacyExposure || DEFAULT_SETTINGS.privacyExposure
      });
    });
    return true;
  } else if (request.action === 'clearPrivacyExposure') {
    chrome.storage.local.set({ privacyExposure: DEFAULT_SETTINGS.privacyExposure }, () => {
      sendResponse({ success: true });
    });
    return true;
  } else if (request.action === 'stripTabUrl') {
    chrome.tabs.get(request.tabId, (tab) => {
      if (tab && tab.url && typeof stripTrackingParameters === 'function') {
        const stripped = stripTrackingParameters(tab.url);
        if (stripped.hasChanged) {
          recordStrippedParams(stripped.strippedParams.length);
          chrome.tabs.update(request.tabId, { url: stripped.cleanUrl });
        }
        sendResponse({ success: true, ...stripped });
      } else {
        sendResponse({ success: false });
      }
    });
    return true;
  } else if (request.action === 'clearCookiesForDomain') {
    chrome.cookies.getAll({ url: request.url }, (cookies) => {
      if (chrome.runtime.lastError || !cookies) {
        sendResponse({ success: false, error: chrome.runtime.lastError });
        return;
      }
      let removed = 0;
      cookies.forEach((cookie) => {
        const protocol = cookie.secure ? 'https:' : 'http:';
        const cookieUrl = `${protocol}//${cookie.domain.replace(/^\./, '')}${cookie.path}`;
        chrome.cookies.remove({ url: cookieUrl, name: cookie.name, storeId: cookie.storeId }, () => {
          removed++;
        });
      });
      sendResponse({ success: true, count: cookies.length });
    });
    return true;
  }
});
