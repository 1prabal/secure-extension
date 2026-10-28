// Background service worker for PrivacyLens - Website Privacy & Tracker Analyzer
importScripts('trackers.js');

// In-memory request buffer per tabId (capped to prevent memory growth)
const tabRequests = new Map();
const MAX_REQUESTS_PER_TAB = 500;

chrome.runtime.onInstalled.addListener(() => {
  console.log('PrivacyLens Privacy & Tracker Analyzer installed.');
});

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

// Tab cleanup & Badge updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // If navigating to a new page, reset tab requests buffer
  if (changeInfo.status === 'loading' && changeInfo.url) {
    tabRequests.delete(tabId);
    chrome.action.setBadgeText({ tabId, text: '' });
  }

  // Update badge when page load is complete
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    updateTabBadge(tabId, tab.url);
  }
});

// Remove tab buffer when closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabRequests.delete(tabId);
});

function updateTabBadge(tabId, pageUrl) {
  try {
    const urlObj = new URL(pageUrl);
    const siteHost = urlObj.hostname;
    const reqs = tabRequests.get(tabId) || [];

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
        color: trackerCount > 10 ? '#DC2626' : trackerCount > 3 ? '#D97706' : '#2563EB'
      });
    } else {
      chrome.action.setBadgeText({ tabId, text: '' });
    }
  } catch (e) {
    // Ignore URL parse errors
  }
}

// Handle runtime messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabRequests') {
    const list = tabRequests.get(request.tabId) || [];
    sendResponse({ success: true, requests: list });
    return false;
  } else if (request.action === 'clearTabRequests') {
    tabRequests.delete(request.tabId);
    sendResponse({ success: true });
    return false;
  } else if (request.action === 'openSiteSettings') {
    chrome.tabs.create({ url: `chrome://settings/content/siteDetails?site=${encodeURIComponent(request.origin)}` });
    sendResponse({ success: true });
    return false;
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
    return true; // Keep message channel open for async response
  }
});
