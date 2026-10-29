/**
 * PrivacyLens - Website Permission & Cookie Auditor
 * Handcrafted minimalist audit engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// SVG icons for clean, professional vector rendering
const PERMISSION_SVGS = {
  'geolocation': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  'camera': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
  'microphone': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
  'notifications': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  'clipboard-read': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
  'clipboard-write': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  'persistent-storage': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  'accelerometer': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  'gyroscope': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  'magnetometer': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="12 2 15 9 12 7 9 9 12 2"/><polygon points="12 22 9 15 12 17 15 15 12 22"/></svg>',
  'screen-wake-lock': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  'midi': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="8" y1="7" x2="8" y2="7.01"/><line x1="16" y1="7" x2="16" y2="7.01"/><line x1="6" y1="12" x2="6" y2="12.01"/><line x1="18" y1="12" x2="18" y2="12.01"/></svg>'
};

// Permission catalog with human descriptions
const PERMISSIONS_CATALOG = [
  {
    name: 'geolocation',
    title: 'Precise Location (GPS)',
    desc: 'Requests your real-time physical coordinates.',
    harm: 'Exposes street-level physical location. Can be linked with advertising profiles to infer home and work routines.',
    category: 'Sensory & Location'
  },
  {
    name: 'camera',
    title: 'Camera Access',
    desc: 'Requests access to your webcam or video feed.',
    harm: 'Enables video and snapshot capture of your room and surroundings. Facial biometrics can be recorded.',
    category: 'Sensory & Media'
  },
  {
    name: 'microphone',
    title: 'Microphone Access',
    desc: 'Requests live acoustic audio input.',
    harm: 'Can record background conversations, ambient noise, and voiceprint signatures.',
    category: 'Sensory & Media'
  },
  {
    name: 'notifications',
    title: 'Push Notifications',
    desc: 'Delivers system alert banners to your desktop.',
    harm: 'Often abused to send persistent advertising popups, fake antivirus warnings, and clickbait spam.',
    category: 'System'
  },
  {
    name: 'clipboard-read',
    title: 'Read Clipboard Content',
    desc: 'Reads data currently copied to your clipboard.',
    harm: 'Can capture copied passwords, private messages, authentication codes, or crypto addresses without warning.',
    category: 'System'
  },
  {
    name: 'clipboard-write',
    title: 'Modify Clipboard Content',
    desc: 'Alters clipboard content programmatically.',
    harm: 'Risk of clipboard hijacking (substituting copied payment addresses with attacker destinations).',
    category: 'System'
  },
  {
    name: 'persistent-storage',
    title: 'Persistent Storage',
    desc: 'Stores browser data exempt from automatic clearing.',
    harm: 'Allows resilient identifiers that survive standard cache cleanups.',
    category: 'Storage'
  },
  {
    name: 'accelerometer',
    title: 'Motion Sensors (Accelerometer)',
    desc: 'Measures physical acceleration and vibration forces.',
    harm: 'Device fingerprinting. Research shows vibration harmonics can infer touch inputs on mobile screens.',
    category: 'Sensors'
  },
  {
    name: 'gyroscope',
    title: 'Gyroscope Sensor',
    desc: 'Detects tilt and angular rotation.',
    harm: 'Contributes to device hardware fingerprinting and orientation tracking.',
    category: 'Sensors'
  },
  {
    name: 'magnetometer',
    title: 'Magnetometer (Compass)',
    desc: 'Detects ambient magnetic orientation.',
    harm: 'Indoor position profiling and hardware fingerprinting.',
    category: 'Sensors'
  },
  {
    name: 'screen-wake-lock',
    title: 'Screen Wake Lock',
    desc: 'Prevents display from sleeping or dimming.',
    harm: 'Drains battery; can be kept active by background scripts.',
    category: 'Hardware'
  },
  {
    name: 'midi',
    title: 'MIDI Audio Devices',
    desc: 'Communicates with musical synthesizer hardware.',
    harm: 'Hardware device fingerprinting via connected audio peripherals.',
    category: 'Hardware'
  }
];

// Plain-English Tracker Definitions & Analogies
const TRACKER_EXPLAINERS = {
  all: {
    title: 'All Network Trackers & Requests',
    analogy: 'Complete Telemetry View',
    text: 'Every network connection initiated to external servers while browsing this website. Select any category pill below to inspect individual tracker types.'
  },
  advertising: {
    title: 'Advertising Networks (Ad Trackers)',
    analogy: 'Digital Billboard That Follows You',
    text: 'Tracks articles you read, your search habits, and shopping interests across websites to build an advertising profile for commercial ad bidding.'
  },
  analytics: {
    title: 'Analytics & Audience Measurement',
    analogy: 'In-Store Foot Traffic Camera',
    text: 'Records mouse movements, clicks, scroll depth, and minutes spent on pages to measure website performance and detect user confusion.'
  },
  social: {
    title: 'Social Media Tracking Pixels',
    analogy: 'Personal ID Card Scanner',
    text: 'Connects your off-site web visits and shopping carts directly back to your logged-in Facebook, Instagram, or TikTok profile for hyper-targeted social ads.'
  },
  retargeting: {
    title: 'Retargeting & Conversion Trackers',
    analogy: 'Persistent Salesperson',
    text: 'Remembers the specific product names, prices, and colors you looked at so advertisers can follow you with ads urging you to finish the purchase.'
  },
  fingerprinting: {
    title: 'Device Fingerprinting Scripts',
    analogy: 'Digital Fingerprint Scanner',
    text: 'Probes your graphics card (GPU), screen resolution, audio hardware, and canvas math to build a unique device hash that recognizes you even in Incognito mode.'
  },
  pixel: {
    title: 'Tracking Beacons & 1x1 Pixels',
    analogy: 'Invisible Delivery Receipt',
    text: 'Invisible 1x1 transparent image beacons that send an instant secret ping confirming you opened the page or email, transmitting your IP and visit time.'
  },
  unclassified: {
    title: 'Unclassified Third-Party Requests',
    analogy: 'Unverified External Helper',
    text: 'External connections not matched in public ad databases. Often helper scripts, customer chat, or telemetry. Audited for transparency without labeling malicious.'
  }
};

// App State
let currentTab = null;
let currentUrl = '';
let currentOrigin = '';
let permissionsData = {};
let cookiesData = [];
let capturedTrackers = [];
let inPageProbes = [];
let activePermFilter = 'all';
let activeCookieCat = 'all';
let activeTrackerCat = 'all';
let cookieSearchQuery = '';
let trackerSearchQuery = '';

async function initApp() {
  setupEventListeners();
  initShield();
  initSanitizer();
  initDashboard();
  await scanCurrentWebsite();
}

function setupEventListeners() {
  // Rescan button
  document.getElementById('rescanBtn').addEventListener('click', () => {
    scanCurrentWebsite();
  });

  // Open site settings
  document.getElementById('openSettingsBtn').addEventListener('click', () => {
    if (currentOrigin) {
      chrome.tabs.create({ url: `chrome://settings/content/siteDetails?site=${encodeURIComponent(currentOrigin)}` });
    }
  });

  // Segmented tab switching
  document.querySelectorAll('.nav-segment').forEach(tabBtn => {
    tabBtn.addEventListener('click', (e) => {
      const targetTab = e.currentTarget.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Permission filters
  document.querySelectorAll('.pill-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.pill-option').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activePermFilter = e.currentTarget.getAttribute('data-filter');
      renderPermissions();
    });
  });

  // Cookie category filters (explicitly targeting data-cookie-cat)
  document.querySelectorAll('.cat-pill[data-cookie-cat]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-pill[data-cookie-cat]').forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeCookieCat = e.currentTarget.getAttribute('data-cookie-cat');
      renderCookies();
    });
  });

  // Tracker category filters (explicitly targeting data-tracker-cat)
  document.querySelectorAll('.cat-pill[data-tracker-cat]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-pill[data-tracker-cat]').forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeTrackerCat = e.currentTarget.getAttribute('data-tracker-cat');
      renderTrackers();
    });
  });

  // Jump from Overview matrix to Trackers tab with category filter
  document.querySelectorAll('.matrix-item[data-jump-cat]').forEach(item => {
    item.addEventListener('click', (e) => {
      const cat = e.currentTarget.getAttribute('data-jump-cat');
      switchTab('trackers');
      const targetPill = document.querySelector(`.cat-pill[data-tracker-cat="${cat}"]`);
      if (targetPill) {
        document.querySelectorAll('.cat-pill[data-tracker-cat]').forEach(p => p.classList.remove('active'));
        targetPill.classList.add('active');
        activeTrackerCat = cat;
        renderTrackers();
      }
    });
  });

  // Cookie search input
  const searchInput = document.getElementById('cookieSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      cookieSearchQuery = e.target.value.trim().toLowerCase();
      renderCookies();
    });
  }

  // Tracker search input
  const trackerSearchInput = document.getElementById('trackerSearchInput');
  if (trackerSearchInput) {
    trackerSearchInput.addEventListener('input', (e) => {
      trackerSearchQuery = e.target.value.trim().toLowerCase();
      renderTrackers();
    });
  }

  // Refresh Trackers button
  const refreshTrackersBtn = document.getElementById('refreshTrackersBtn');
  if (refreshTrackersBtn) {
    refreshTrackersBtn.addEventListener('click', async () => {
      if (currentTab) {
        await scanTrackers(currentTab);
      }
    });
  }

  // View Guide shortcut button
  const viewGuideBtn = document.getElementById('viewGuideBtn');
  if (viewGuideBtn) {
    viewGuideBtn.addEventListener('click', () => {
      switchTab('verdict');
      setTimeout(() => {
        const guideEl = document.querySelector('.guide-section');
        if (guideEl) {
          guideEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    });
  }

  // Clear Cookies button
  document.getElementById('clearCookiesBtn').addEventListener('click', handleClearCookies);

  // Export report
  document.getElementById('exportBtn').addEventListener('click', handleExportReport);
}

function switchTab(tabName) {
  document.querySelectorAll('.nav-segment').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  document.querySelectorAll('.tab-panel').forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabName}`);
  });
  const scrollContainer = document.getElementById('contentScroll');
  if (scrollContainer) {
    scrollContainer.scrollTop = 0;
  }
  if (tabName === 'dashboard') {
    renderDashboard();
  }
}

/**
 * Main scan orchestrator
 */
async function scanCurrentWebsite() {
  const domainNameEl = document.getElementById('domainName');
  const protocolIconEl = document.getElementById('protocolIcon');
  const noticeBanner = document.getElementById('noticeBanner');
  const footerScanTime = document.getElementById('footerScanTime');

  noticeBanner.classList.add('hidden');
  try {
    if (!window.chrome || !chrome.tabs || !chrome.tabs.query) {
      domainNameEl.textContent = 'Extension Preview';
      renderRestrictedState();
      footerScanTime.textContent = 'Ready';
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;

    if (!tab || !tab.url) {
      showNotice('No active web page detected.');
      return;
    }

    currentUrl = tab.url;

    // Check if internal browser page
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      domainNameEl.textContent = 'Browser System Page';
      showNotice('System pages do not request external permissions or set tracking cookies.');
      renderRestrictedState();
      return;
    }

    const urlObj = new URL(tab.url);
    currentOrigin = urlObj.origin;
    domainNameEl.textContent = urlObj.hostname || tab.url;

    // Feature 2: Check URL tracking parameter presence
    checkUrlSanitization(tab.url);

    // Run parallel audits (including Feature 3: Keystroke & Form Snooping Watchdog)
    await Promise.all([
      scanPermissions(tab),
      scanCookies(tab),
      scanTrackers(tab),
      scanWatchdog(tab)
    ]);

    // Audit historical breaches & live data leak status
    await auditBreachAndLeakStatus(tab, currentOrigin);

    // Compute and display Privacy Risk Score
    computePrivacyScore();
    footerScanTime.textContent = `Audited ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  } catch (err) {
    console.error('Scan error:', err);
    showNotice(`Audit note: ${err.message}`);
  }
}

function showNotice(text) {
  const noticeBanner = document.getElementById('noticeBanner');
  const noticeText = document.getElementById('noticeText');
  noticeText.textContent = text;
  noticeBanner.classList.remove('hidden');
}

/**
 * Audits permissions via navigator.permissions within page context
 */
async function scanPermissions(tab) {
  permissionsData = {};

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (catalog) => {
        const statuses = {};
        for (const item of catalog) {
          try {
            const status = await navigator.permissions.query({ name: item.name });
            statuses[item.name] = status.state; // 'granted', 'prompt', 'denied'
          } catch (e) {
            statuses[item.name] = 'unsupported';
          }
        }
        return statuses;
      },
      args: [PERMISSIONS_CATALOG]
    });

    if (results && results[0] && results[0].result) {
      permissionsData = results[0].result;
    }
  } catch (e) {
    console.warn('Script execution restricted on this tab:', e.message);
    PERMISSIONS_CATALOG.forEach(p => {
      permissionsData[p.name] = 'unknown';
    });
  }

  renderPermissions();
}

function renderPermissions() {
  const listEl = document.getElementById('permissionsList');
  const tabPermsCount = document.getElementById('tabPermsCount');
  const statPermsGranted = document.getElementById('statPermsGranted');
  const permsSummaryText = document.getElementById('permsSummaryText');

  let grantedCount = 0;
  let promptCount = 0;
  let deniedCount = 0;

  const itemsToRender = PERMISSIONS_CATALOG.filter(perm => {
    const state = permissionsData[perm.name] || 'unknown';
    if (state === 'granted') grantedCount++;
    if (state === 'prompt') promptCount++;
    if (state === 'denied') deniedCount++;

    if (activePermFilter === 'all') return true;
    return state === activePermFilter;
  });

  if (tabPermsCount) tabPermsCount.textContent = grantedCount;
  if (statPermsGranted) statPermsGranted.textContent = grantedCount;
  if (permsSummaryText) permsSummaryText.textContent = `${grantedCount} allowed · ${promptCount} asks first · ${deniedCount} blocked`;

  if (itemsToRender.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <p>No permissions found matching this filter.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = itemsToRender.map(perm => {
    const state = permissionsData[perm.name] || 'unknown';
    const stateClass = state === 'granted' ? 'granted' : state === 'prompt' ? 'prompt' : state === 'denied' ? 'denied' : 'unknown';
    const stateLabel = state === 'granted' ? 'Allowed' : state === 'prompt' ? 'Asks First' : state === 'denied' ? 'Blocked' : 'Unsupported';
    const isHarmfulActive = state === 'granted';
    const svgIcon = PERMISSION_SVGS[perm.name] || '<svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';

    return `
      <div class="perm-item status-${stateClass}">
        <div class="perm-top">
          <div class="perm-info">
            <div class="perm-icon-box">${svgIcon}</div>
            <div>
              <div class="perm-name">${perm.title}</div>
              <div class="perm-cat">${perm.category}</div>
            </div>
          </div>
          <span class="perm-pill ${stateClass}">${stateLabel}</span>
        </div>
        <p class="perm-desc">${perm.desc}</p>
        
        <div class="perm-risk-note ${isHarmfulActive ? 'active-threat' : ''}">
          <strong>${isHarmfulActive ? 'Active Privacy Impact:' : 'Why to be cautious:'}</strong> ${perm.harm}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Audits all cookies using chrome.cookies API
 */
async function scanCookies(tab) {
  try {
    const cookies = await chrome.cookies.getAll({ url: tab.url });
    cookiesData = cookies.map(c => analyzeCookie(c));
    renderCookies();
  } catch (err) {
    console.error('Error fetching cookies:', err);
    cookiesData = [];
    renderCookies();
  }
}

/**
 * Categorizes and evaluates security attributes of a cookie
 */
function analyzeCookie(cookie) {
  const name = cookie.name;
  
  // Categorization
  let category = 'other';
  let categoryLabel = 'Other';
  let plainMeaning = 'General site state or temporary session token.';

  const trackRegex = /(^_ga|_gid|_gat|_gcl|_fbp|_fbc|IDE|MUID|track|pixel|adroll|criteo|doubleclick|outbrain|taboola|quant|scorecard|pubmatic|rubicon|openx)/i;
  const analyticsRegex = /(analytics|segment|_clck|_clsk|mixpanel|amplitude|hotjar|heap|posthog|stats|metric|visitor|visit_id|counter)/i;
  const authRegex = /(session|sess|token|auth|jwt|sid|ssid|login|csrf|xsrf|user_id|account)/i;
  const funcRegex = /(theme|dark|light|mode|lang|locale|cookie_consent|consent|notice|gdpr|optout|currency|pref)/i;

  if (trackRegex.test(name)) {
    category = 'tracking';
    categoryLabel = 'Advertising';
    plainMeaning = 'Used by ad networks to link your browsing activity across multiple websites.';
  } else if (analyticsRegex.test(name)) {
    category = 'analytics';
    categoryLabel = 'Analytics';
    plainMeaning = 'Measures interactions and pages viewed to generate visitor metrics.';
  } else if (authRegex.test(name)) {
    category = 'auth';
    categoryLabel = 'Session / Auth';
    plainMeaning = 'Identifies your logged-in account or validates security form tokens.';
  } else if (funcRegex.test(name)) {
    category = 'functional';
    categoryLabel = 'Preferences';
    plainMeaning = 'Remembers site preferences such as dark mode, language, or consent choices.';
  }

  // Lifespan
  let lifespanText = 'Session only (cleared on close)';
  let isPersistent = false;
  let isLongLived = false;

  if (!cookie.session && cookie.expirationDate) {
    isPersistent = true;
    const now = Date.now() / 1000;
    const diffSec = cookie.expirationDate - now;
    const diffDays = Math.round(diffSec / (60 * 60 * 24));
    
    if (diffDays > 365) {
      isLongLived = true;
      const years = (diffDays / 365).toFixed(1);
      lifespanText = `Persistent (${years} yrs)`;
    } else if (diffDays > 30) {
      lifespanText = `Persistent (${diffDays} days)`;
    } else if (diffDays > 0) {
      lifespanText = `Short-lived (${diffDays} days)`;
    } else {
      lifespanText = 'Expired';
    }
  }

  const flags = {
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite || 'None'
  };

  const securityRisks = [];
  if (!cookie.secure) {
    securityRisks.push('Unencrypted HTTP: vulnerable on open Wi-Fi');
  }
  if (!cookie.httpOnly && category === 'auth') {
    securityRisks.push('Missing HttpOnly: readable by malicious page scripts');
  }

  return {
    ...cookie,
    category,
    categoryLabel,
    plainMeaning,
    lifespanText,
    isPersistent,
    isLongLived,
    flags,
    securityRisks
  };
}

function renderCookies() {
  const listEl = document.getElementById('cookiesList');
  const tabCookiesCount = document.getElementById('tabCookiesCount');
  const statCookiesTotal = document.getElementById('statCookiesTotal');

  let countTrack = 0;
  let countAnalytics = 0;
  let countAuth = 0;
  let countFunc = 0;
  let countOther = 0;
  let countInsecure = 0;

  cookiesData.forEach(c => {
    if (c.category === 'tracking') countTrack++;
    else if (c.category === 'analytics') countAnalytics++;
    else if (c.category === 'auth') countAuth++;
    else if (c.category === 'functional') countFunc++;
    else countOther++;

    if (!c.secure || (!c.httpOnly && c.category === 'auth')) {
      countInsecure++;
    }
  });

  if (tabCookiesCount) tabCookiesCount.textContent = cookiesData.length;
  if (statCookiesTotal) statCookiesTotal.textContent = cookiesData.length;

  const setSafeText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setSafeText('catCountAll', cookiesData.length);
  setSafeText('catCountTrack', countTrack);
  setSafeText('catCountAnalytics', countAnalytics);
  setSafeText('catCountAuth', countAuth);
  setSafeText('catCountFunc', countFunc);
  setSafeText('catCountOther', countOther);

  const filtered = cookiesData.filter(cookie => {
    if (activeCookieCat !== 'all' && cookie.category !== activeCookieCat) {
      return false;
    }
    if (cookieSearchQuery) {
      const matchName = cookie.name.toLowerCase().includes(cookieSearchQuery);
      const matchDomain = cookie.domain.toLowerCase().includes(cookieSearchQuery);
      return matchName || matchDomain;
    }
    return true;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <p>No cookies matching this filter.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(c => {
    return `
      <div class="cookie-item">
        <div class="cookie-row-top">
          <div class="cookie-ident">
            <div class="cookie-key" title="${c.name}">${c.name}</div>
            <div class="cookie-host" title="${c.domain}">${c.domain}${c.path}</div>
          </div>
          <span class="cookie-badge ${c.category}">${c.categoryLabel}</span>
        </div>

        <div class="cookie-tags">
          <span class="tag-spec ${c.flags.secure ? 'good' : 'bad'}">
            ${c.flags.secure ? 'HTTPS' : 'No HTTPS'}
          </span>
          <span class="tag-spec ${c.flags.httpOnly ? 'good' : (c.category === 'auth' ? 'bad' : 'neutral')}">
            ${c.flags.httpOnly ? 'HttpOnly' : 'Script Accessible'}
          </span>
          <span class="tag-spec neutral">SameSite: ${c.flags.sameSite}</span>
          <span class="tag-spec ${c.isLongLived ? 'bad' : 'neutral'}">${c.lifespanText}</span>
        </div>

        <div class="cookie-explanation">
          <strong>Purpose:</strong> ${c.plainMeaning}
          ${c.securityRisks.length > 0 ? `<div style="color: #dc2626; margin-top: 3px; font-weight: 600;">⚠️ ${c.securityRisks.join(' · ')}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Escapes HTML characters for safe rendering
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Audits network requests, advertising trackers, analytics, social pixels,
 * retargeting beacons, and in-page fingerprinting probes.
 */
async function scanTrackers(tab) {
  const trackersListEl = document.getElementById('trackersList');
  if (!tab || !tab.url) return;

  const urlObj = new URL(tab.url);
  const siteHost = urlObj.hostname;

  try {
    // 1. Fetch background-captured web requests
    let bgRequests = [];
    try {
      const bgResp = await new Promise(resolve => {
        chrome.runtime.sendMessage({ action: 'getTabRequests', tabId: tab.id }, (res) => {
          if (chrome.runtime.lastError) {
            resolve({ requests: [] });
          } else {
            resolve(res || { requests: [] });
          }
        });
      });
      bgRequests = (bgResp && bgResp.requests) ? bgResp.requests : [];
    } catch (e) {
      console.warn('Background request retrieval:', e);
    }

    // 2. Fetch in-page resource timing entries & in-page fingerprint/DOM probes
    let inPageResources = [];
    let pageProbes = [];
    try {
      const probeRes = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const res = (performance.getEntriesByType('resource') || []).map(r => ({
            url: r.name,
            type: r.initiatorType || 'other',
            initiator: window.location.href,
            timestamp: Date.now()
          }));

          // In-page probes (DOM pixels and fingerprinting libs)
          const detectedProbes = [];
          
          // Audit 1x1 or hidden DOM beacons
          try {
            const els = Array.from(document.querySelectorAll('img, iframe'));
            els.forEach(el => {
              const isTiny = (el.width <= 1 && el.height <= 1) || (el.naturalWidth <= 1 && el.naturalHeight <= 1);
              const isHidden = el.style.display === 'none' || el.style.visibility === 'hidden' || el.hidden;
              const src = el.src || '';
              if ((isTiny || isHidden) && src.startsWith('http')) {
                const u = new URL(src);
                if (u.hostname !== window.location.hostname) {
                  detectedProbes.push({
                    type: 'dom_pixel',
                    category: 'pixel',
                    serviceName: 'DOM 1x1 Tracking Pixel',
                    domain: u.hostname,
                    url: src,
                    evidence: `Invisible ${el.tagName.toLowerCase()} beacon (${el.width || 1}x${el.height || 1}px) pinging third-party domain.`
                  });
                }
              }
            });
          } catch(e) {}

          // Audit window fingerprinting objects
          try {
            if (window.Fingerprint2 || window.FingerprintJS || window.ClientJS) {
              detectedProbes.push({
                type: 'fingerprinting_lib',
                category: 'fingerprinting',
                serviceName: 'Client-Side Fingerprinting Library',
                domain: window.location.hostname,
                url: window.location.href,
                evidence: 'Active client-side fingerprinting library (FingerprintJS / ClientJS) loaded in page global context.'
              });
            }
          } catch(e) {}

          return { resources: res, probes: detectedProbes };
        }
      });

      if (probeRes && probeRes[0] && probeRes[0].result) {
        inPageResources = probeRes[0].result.resources || [];
        pageProbes = probeRes[0].result.probes || [];
      }
    } catch (e) {
      console.warn('In-page resource audit:', e.message);
    }

    inPageProbes = pageProbes;

    // 3. Merge and deduplicate requests by URL
    const seenUrls = new Set();
    const rawRequests = [];

    for (const r of bgRequests) {
      if (r.url && !seenUrls.has(r.url)) {
        seenUrls.add(r.url);
        rawRequests.push(r);
      }
    }

    for (const r of inPageResources) {
      if (r.url && !seenUrls.has(r.url)) {
        seenUrls.add(r.url);
        rawRequests.push(r);
      }
    }

    // 4. Classify each network request using trackers.js engine
    const analyzed = [];
    for (const req of rawRequests) {
      const result = typeof analyzeNetworkRequest === 'function' ? analyzeNetworkRequest(req, siteHost) : null;
      if (result) {
        analyzed.push(result);
      }
    }

    // 5. Merge in-page probes if not already covered
    for (const p of pageProbes) {
      const alreadyPresent = analyzed.some(a => a.url === p.url || (a.category === p.category && a.serviceName === p.serviceName));
      if (!alreadyPresent) {
        const catInfo = (typeof TRACKER_CATEGORIES !== 'undefined' && TRACKER_CATEGORIES[p.category.toUpperCase()]) || {
          label: p.category,
          color: '#d97706',
          bgColor: '#fffbeb',
          borderColor: '#fde68a'
        };
        analyzed.unshift({
          url: p.url,
          domain: p.domain,
          rootDomain: p.domain,
          isThirdParty: true,
          category: p.category,
          categoryLabel: catInfo.label || p.category,
          categoryColor: catInfo.color,
          categoryBg: catInfo.bgColor,
          categoryBorder: catInfo.borderColor,
          serviceName: p.serviceName,
          initiator: siteHost,
          type: p.type || 'probe',
          evidence: p.evidence,
          isPixel: p.category === 'pixel',
          isFingerprinter: p.category === 'fingerprinting',
          timestamp: Date.now()
        });
      }
    }

    capturedTrackers = analyzed;

    // 6. Update counts and UI
    updateTrackerStats(siteHost);
    renderTrackers();

  } catch (err) {
    console.error('Error scanning trackers:', err);
    if (trackersListEl) {
      trackersListEl.innerHTML = `
        <div class="empty-state">
          <p>Unable to analyze network requests: ${err.message}</p>
        </div>
      `;
    }
  }
}

/**
 * Updates tracker counts, matrix breakdown, and tab badges
 */
function updateTrackerStats(siteHost) {
  const counts = {
    all: capturedTrackers.length,
    advertising: 0,
    analytics: 0,
    social: 0,
    retargeting: 0,
    fingerprinting: 0,
    pixel: 0,
    unclassified: 0
  };

  const thirdPartyHosts = new Set();

  capturedTrackers.forEach(t => {
    if (counts[t.category] !== undefined) {
      counts[t.category]++;
    }
    if (t.isThirdParty && t.domain) {
      thirdPartyHosts.add(t.domain);
    }
  });

  // Overview Strip Metrics
  const statTrackersTotal = document.getElementById('statTrackersTotal');
  const statThirdParties = document.getElementById('statThirdParties');
  if (statTrackersTotal) statTrackersTotal.textContent = counts.all;
  if (statThirdParties) statThirdParties.textContent = thirdPartyHosts.size;

  // Overview Matrix Counts
  const setElText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setElText('matrixCountAds', counts.advertising);
  setElText('matrixCountAnalytics', counts.analytics);
  setElText('matrixCountSocial', counts.social);
  setElText('matrixCountRetarget', counts.retargeting);
  setElText('matrixCountFp', counts.fingerprinting);
  setElText('matrixCountPixel', counts.pixel);
  setElText('matrixCountUnclassified', counts.unclassified);

  const matrixTotalLabel = document.getElementById('matrixTotalLabel');
  if (matrixTotalLabel) {
    matrixTotalLabel.textContent = `${counts.all} Detected`;
    if (counts.all === 0) {
      matrixTotalLabel.classList.add('clean');
    } else {
      matrixTotalLabel.classList.remove('clean');
    }
  }

  // Highlight matrix tiles that have counts
  document.querySelectorAll('.matrix-item').forEach(item => {
    const cat = item.getAttribute('data-jump-cat');
    if (cat && counts[cat] > 0) {
      item.classList.add('has-count');
    } else {
      item.classList.remove('has-count');
    }
  });

  // Tab 2 Badge Count
  setElText('tabTrackersBadge', counts.all);
  setElText('tabTrackersCount', counts.all);

  // Category Filter Pill Counters
  setElText('catTrackAll', counts.all);
  setElText('catTrackAds', counts.advertising);
  setElText('catTrackAnalytics', counts.analytics);
  setElText('catTrackSocial', counts.social);
  setElText('catTrackRetarget', counts.retargeting);
  setElText('catTrackFp', counts.fingerprinting);
  setElText('catTrackPixel', counts.pixel);
  setElText('catTrackUnclassified', counts.unclassified);

  // Summary strip
  const trackerCountSummary = document.getElementById('trackerCountSummary');
  if (trackerCountSummary) {
    trackerCountSummary.textContent = `${counts.all} tracked requests identified`;
  }
  const thirdPartyRatio = document.getElementById('thirdPartyRatio');
  if (thirdPartyRatio) {
    thirdPartyRatio.textContent = `${thirdPartyHosts.size} 3rd-Party Hosts`;
  }
}

/**
 * Renders the filtered list of trackers in the Trackers Tab
 */
function renderTrackers() {
  const listEl = document.getElementById('trackersList');
  const alertBox = document.getElementById('fingerprintAlertBox');
  const alertList = document.getElementById('fingerprintAlertList');

  if (!listEl) return;

  // Update Contextual Plain-English Explainer
  const explainer = TRACKER_EXPLAINERS[activeTrackerCat] || TRACKER_EXPLAINERS.all;
  const explainerTitle = document.getElementById('explainerTitle');
  const explainerAnalogy = document.getElementById('explainerAnalogy');
  const explainerDesc = document.getElementById('explainerDesc');
  if (explainerTitle) explainerTitle.textContent = explainer.title;
  if (explainerAnalogy) explainerAnalogy.textContent = explainer.analogy;
  if (explainerDesc) explainerDesc.textContent = explainer.text;

  // In-page fingerprint / DOM beacon alert box
  if (alertBox && alertList) {
    if (inPageProbes.length > 0) {
      alertBox.classList.remove('hidden');
      alertList.innerHTML = inPageProbes.map(p => `
        <li><strong>${escapeHtml(p.serviceName)}:</strong> ${escapeHtml(p.evidence)}</li>
      `).join('');
    } else {
      alertBox.classList.add('hidden');
      alertList.innerHTML = '';
    }
  }

  // Filter trackers
  const filtered = capturedTrackers.filter(t => {
    if (activeTrackerCat !== 'all' && t.category !== activeTrackerCat) {
      return false;
    }
    if (trackerSearchQuery) {
      const q = trackerSearchQuery;
      const matchName = t.serviceName && t.serviceName.toLowerCase().includes(q);
      const matchDomain = t.domain && t.domain.toLowerCase().includes(q);
      const matchUrl = t.url && t.url.toLowerCase().includes(q);
      const matchEvidence = t.evidence && t.evidence.toLowerCase().includes(q);
      const matchCategory = t.category && t.category.toLowerCase().includes(q);
      if (!matchName && !matchDomain && !matchUrl && !matchEvidence && !matchCategory) {
        return false;
      }
    }
    return true;
  });

  const trackerCountSummary = document.getElementById('trackerCountSummary');
  if (trackerCountSummary) {
    trackerCountSummary.textContent = `Showing ${filtered.length} of ${capturedTrackers.length} requests`;
  }

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <p>${capturedTrackers.length === 0 ? 'No third-party trackers or telemetry requests detected on this page.' : 'No requests matching your active filter or search.'}</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map((t) => {
    const is3rd = t.isThirdParty;
    const cleanUrl = escapeHtml(t.url || '');
    const shortUrl = cleanUrl.length > 70 ? cleanUrl.substring(0, 67) + '...' : cleanUrl;
    const typeLabel = escapeHtml((t.type || 'request').toUpperCase());
    const partyLabel = is3rd ? '3rd-Party' : '1st-Party';
    const partyClass = is3rd ? 'third-party' : 'first-party';
    const catClass = escapeHtml(t.category || 'unclassified');
    const catLabel = escapeHtml(t.categoryLabel || t.category || 'Tracker');

    return `
      <div class="tracker-item">
        <div class="tracker-item-top">
          <div class="tracker-service-title">
            <strong>${escapeHtml(t.serviceName || t.domain)}</strong>
          </div>
          <div class="tracker-badges">
            <span class="category-tag ${catClass}">${catLabel}</span>
            <span class="type-pill">${typeLabel}</span>
            <span class="party-badge ${partyClass}">${partyLabel}</span>
          </div>
        </div>

        <div class="tracker-url-row">
          <span class="tracker-url-text" title="${cleanUrl}">${shortUrl}</span>
          <button class="btn-copy-url" data-url="${cleanUrl}" title="Copy full request URL">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </div>

        <div class="tracker-evidence">
          <strong>Indicator:</strong> ${escapeHtml(t.evidence || 'Observed cross-origin request')}
        </div>
      </div>
    `;
  }).join('');

  // Wire copy buttons
  listEl.querySelectorAll('.btn-copy-url').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetUrl = btn.getAttribute('data-url');
      if (targetUrl) {
        navigator.clipboard.writeText(targetUrl).then(() => {
          btn.innerHTML = '<span style="font-size: 9px; font-weight: 700; color: #059669;">Copied!</span>';
          setTimeout(() => {
            btn.innerHTML = `
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            `;
          }, 1500);
        });
      }
    });
  });
}

/**
 * Calculate Overall Privacy Score (0-100) factoring in trackers, cookies & permissions
 */
function computePrivacyScore() {
  const scoreValueEl = document.getElementById('scoreValue');
  const scoreGradeEl = document.getElementById('scoreGrade');
  const scoreDescEl = document.getElementById('scoreDesc');
  const miniScorePill = document.getElementById('miniScorePill');

  let score = 100;

  // 1. Deductions for Permissions
  if (permissionsData['camera'] === 'granted') score -= 25;
  if (permissionsData['microphone'] === 'granted') score -= 25;
  if (permissionsData['geolocation'] === 'granted') score -= 20;
  if (permissionsData['clipboard-read'] === 'granted') score -= 15;
  if (permissionsData['notifications'] === 'granted') score -= 5;

  // 2. Deductions for Active Network Trackers
  const adTrackersCount = capturedTrackers.filter(t => t.category === 'advertising').length;
  const retargetCount = capturedTrackers.filter(t => t.category === 'retargeting').length;
  const fpCount = capturedTrackers.filter(t => t.category === 'fingerprinting').length;
  const socialCount = capturedTrackers.filter(t => t.category === 'social').length;
  const pixelCount = capturedTrackers.filter(t => t.category === 'pixel').length;
  const unclassifiedCount = capturedTrackers.filter(t => t.category === 'unclassified').length;

  score -= Math.min(25, adTrackersCount * 3);
  score -= Math.min(20, retargetCount * 3);
  score -= Math.min(25, fpCount * 12);
  score -= Math.min(15, socialCount * 2);
  score -= Math.min(10, pixelCount * 1);
  score -= Math.min(10, Math.floor(unclassifiedCount * 0.5));

  // 3. Deductions for Cookies
  const trackingCount = cookiesData.filter(c => c.category === 'tracking').length;
  score -= Math.min(20, trackingCount * 2);

  const insecureCount = cookiesData.filter(c => !c.secure || (!c.httpOnly && c.category === 'auth')).length;
  score -= Math.min(15, insecureCount * 3);

  if (cookiesData.length > 30) score -= 8;
  else if (cookiesData.length > 15) score -= 4;

  score = Math.max(10, Math.min(100, score));

  scoreValueEl.textContent = score;
  scoreValueEl.className = 'score-figure';

  if (score >= 85) {
    scoreGradeEl.textContent = 'High Privacy Rating';
    scoreDescEl.textContent = 'Minimal tracking and zero intrusive permissions.';
  } else if (score >= 70) {
    scoreGradeEl.textContent = 'Standard Web Activity';
    scoreDescEl.textContent = 'Standard analytics telemetry. Permissions gated.';
  } else if (score >= 50) {
    scoreValueEl.classList.add('warn');
    scoreGradeEl.textContent = 'Moderate Tracking';
    scoreDescEl.textContent = 'Ad networks or retargeting trackers detected.';
  } else {
    scoreValueEl.classList.add('danger');
    scoreGradeEl.textContent = 'Aggressive Tracking';
    scoreDescEl.textContent = 'Invasive trackers or sensitive hardware permissions.';
  }

  // Update mini score pill in domain bar
  if (miniScorePill) {
    miniScorePill.textContent = `Score: ${score}`;
    miniScorePill.className = 'score-pill';
    if (score >= 85) miniScorePill.classList.add('safe');
    else if (score >= 50) miniScorePill.classList.add('warn');
    else miniScorePill.classList.add('danger');
  }

  // Update Hero Verdict Card
  updateSafetyVerdict(score);
}

/**
 * Updates the Hero Verdict Card
 */
function updateSafetyVerdict(score) {
  const verdictCard = document.getElementById('verdictCard');
  const verdictTitle = document.getElementById('verdictTitle');
  const verdictBadge = document.getElementById('verdictBadge');
  const verdictSummary = document.getElementById('verdictSummary');
  const safePointsList = document.getElementById('safePointsList');
  const riskPointsList = document.getElementById('riskPointsList');

  if (!verdictCard) return;

  const safePoints = [];
  const riskPoints = [];

  const hasCamera = permissionsData['camera'] === 'granted';
  const hasMic = permissionsData['microphone'] === 'granted';
  const hasLocation = permissionsData['geolocation'] === 'granted';
  const hasClipboard = permissionsData['clipboard-read'] === 'granted';
  const hasNotifications = permissionsData['notifications'] === 'granted';

  if (!hasCamera && !hasMic) {
    safePoints.push('Webcam and microphone access are blocked');
  } else {
    if (hasCamera) riskPoints.push('Active Camera: website can capture webcam video');
    if (hasMic) riskPoints.push('Active Microphone: website can record audio input');
  }

  if (!hasLocation) {
    safePoints.push('Physical location is not shared');
  } else {
    riskPoints.push('Active Location: website receives your physical coordinates');
  }

  if (!hasClipboard) {
    safePoints.push('Clipboard protected from silent background reads');
  } else {
    riskPoints.push('Clipboard Read: website can inspect copied passwords or keys');
  }

  if (hasNotifications) {
    riskPoints.push('Desktop Notifications allowed: site can trigger popups');
  }

  // Tracker Analysis in Verdict
  const adTrackers = capturedTrackers.filter(t => t.category === 'advertising');
  const retargetTrackers = capturedTrackers.filter(t => t.category === 'retargeting');
  const fpTrackers = capturedTrackers.filter(t => t.category === 'fingerprinting');
  const socialTrackers = capturedTrackers.filter(t => t.category === 'social');
  const pixelTrackers = capturedTrackers.filter(t => t.category === 'pixel');

  if (adTrackers.length > 0) {
    riskPoints.push(`${adTrackers.length} Advertising Network(s) tracking browsing behavior`);
  }
  if (retargetTrackers.length > 0) {
    riskPoints.push(`${retargetTrackers.length} Retargeting Tracker(s) profiling purchase intent`);
  }
  if (fpTrackers.length > 0) {
    riskPoints.push(`Device Fingerprinting: scripts probing canvas, audio, or GPU`);
  }
  if (socialTrackers.length > 0) {
    riskPoints.push(`${socialTrackers.length} Social Media Pixel(s) linking site visit to social profile`);
  }
  if (pixelTrackers.length > 0) {
    riskPoints.push(`${pixelTrackers.length} Tracking Beacon(s) transmitting interaction metrics`);
  }

  if (capturedTrackers.length === 0) {
    safePoints.push('No third-party advertising or fingerprinting trackers detected');
  }

  // Cookie Analysis
  const trackingCookies = cookiesData.filter(c => c.category === 'tracking');
  const insecureCookies = cookiesData.filter(c => !c.secure || (!c.httpOnly && c.category === 'auth'));
  const zombieCookies = cookiesData.filter(c => c.isLongLived);

  if (trackingCookies.length === 0 && adTrackers.length === 0) {
    safePoints.push('Zero persistent advertising cookies found');
  }

  if (insecureCookies.length === 0) {
    safePoints.push('All sensitive cookies use secure transport');
  } else {
    riskPoints.push(`${insecureCookies.length} cookie(s) missing HttpOnly or HTTPS protection`);
  }

  if (zombieCookies.length > 0) {
    riskPoints.push(`${zombieCookies.length} persistent cookie(s) set for over 1 year`);
  }

  // Factor in documented breach history
  const urlHost = currentOrigin ? new URL(currentOrigin).hostname : '';
  const domainBreach = typeof checkDomainBreach === 'function' ? checkDomainBreach(urlHost) : null;
  if (domainBreach) {
    riskPoints.push(`Documented breach: ${domainBreach.count} records exfiltrated (${domainBreach.title})`);
  }

  if (currentUrl && currentUrl.startsWith('https://')) {
    safePoints.push('Connection is verified & HTTPS encrypted');
  } else if (currentUrl) {
    riskPoints.push('Insecure connection: transmitted in unencrypted plain text');
  }

  verdictCard.className = 'hero-verdict';
  verdictBadge.className = 'status-tag';

  const isDangerous = hasCamera || hasMic || hasLocation || hasClipboard || fpTrackers.length > 0 || riskPoints.length >= 4 || score < 55;
  const isModerate = !isDangerous && (adTrackers.length > 0 || retargetTrackers.length > 0 || socialTrackers.length > 0 || trackingCookies.length > 0 || hasNotifications || riskPoints.length > 0 || score < 80);

  if (!isDangerous && !isModerate) {
    verdictCard.classList.add('state-safe');
    verdictTitle.textContent = 'Clean & Safe to Browse';
    verdictBadge.textContent = 'Safe';
    verdictBadge.classList.add('safe');
    verdictSummary.textContent = 'This website does not request sensitive device permissions or load third-party advertising trackers.';
  } else if (isModerate) {
    verdictCard.classList.add('state-caution');
    verdictTitle.textContent = 'Advertising Trackers Active';
    verdictBadge.textContent = 'Moderate';
    verdictBadge.classList.add('caution');
    verdictSummary.textContent = 'This site loads advertising and marketing trackers, but has no access to your camera, mic, or location.';
  } else {
    verdictCard.classList.add('state-harmful');
    verdictTitle.textContent = 'High Privacy Exposure';
    verdictBadge.textContent = 'High Risk';
    verdictBadge.classList.add('harmful');
    verdictSummary.textContent = 'This website employs device fingerprinting, aggressive cross-site tracking, or has active hardware permissions.';
  }

  safePointsList.innerHTML = safePoints.slice(0, 3).map(p => `<li>${p}</li>`).join('') || '<li>Standard browser sandbox active.</li>';
  riskPointsList.innerHTML = riskPoints.slice(0, 4).map(p => `<li>${p}</li>`).join('') || '<li>No immediate privacy concerns found.</li>';
}

/**
 * Audits historical domain breaches and live data leak risks
 */
async function auditBreachAndLeakStatus(tab, origin) {
  const breachCard = document.getElementById('breachCard');
  const breachBadge = document.getElementById('breachBadge');
  const breachStatusText = document.getElementById('breachStatusText');
  const breachHeadline = document.getElementById('breachHeadline');
  const breachSummary = document.getElementById('breachSummary');
  const breachChips = document.getElementById('breachChips');
  const hibpLink = document.getElementById('hibpLink');
  const formLeakIcon = document.getElementById('formLeakIcon');
  const formLeakVal = document.getElementById('formLeakVal');
  const exfilLeakIcon = document.getElementById('exfilLeakIcon');
  const exfilLeakVal = document.getElementById('exfilLeakVal');

  if (!breachCard) return;

  const urlObj = new URL(tab.url);
  const hostname = urlObj.hostname;

  // 1. Check Historical Data Breaches
  let breach = null;
  if (typeof checkDomainBreach === 'function') {
    breach = checkDomainBreach(hostname);
  }

  if (hibpLink) {
    hibpLink.href = 'https://haveibeenpwned.com';
  }

  breachCard.className = 'breach-card';
  breachBadge.className = 'breach-badge';

  if (breach) {
    // Known documented breach found!
    breachCard.classList.add('has-breach');
    breachBadge.classList.add('breached');
    breachStatusText.textContent = 'Documented Data Breach';
    breachHeadline.textContent = `${breach.title} (${breach.date})`;
    breachSummary.textContent = `${breach.count} records compromised. ${breach.summary} ${breach.advice}`;

    if (breach.dataExposed && breach.dataExposed.length > 0) {
      breachChips.innerHTML = breach.dataExposed.map(d => `<span class="breach-chip">${d}</span>`).join('');
    } else {
      breachChips.innerHTML = '';
    }
  } else {
    // Clean public record
    breachCard.classList.add('clean-breach');
    breachBadge.classList.add('clean');
    breachStatusText.textContent = 'No Known Public Breaches';
    breachHeadline.textContent = 'Clean Breach History';
    breachSummary.textContent = `No documented public credential leaks or customer breaches found for ${hostname} in threat archives.`;
    breachChips.innerHTML = '';
  }

  // 2. Real-Time Leak Audit: Form security & external tracker receivers
  let insecureFormDetected = false;
  try {
    const formResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const forms = Array.from(document.querySelectorAll('form'));
        const hasHttpForm = forms.some(f => f.action && f.action.toLowerCase().startsWith('http://'));
        const hasInsecurePassword = Array.from(document.querySelectorAll('input[type="password"]')).some(p => {
          const form = p.closest('form');
          return form && form.action && form.action.toLowerCase().startsWith('http://');
        });
        return { hasHttpForm, hasInsecurePassword };
      }
    });

    if (formResults && formResults[0] && formResults[0].result) {
      insecureFormDetected = formResults[0].result.hasHttpForm || formResults[0].result.hasInsecurePassword;
    }
  } catch (e) {
    // Script restricted on system page
  }

  if (!urlObj.protocol.startsWith('https')) {
    formLeakVal.textContent = 'Insecure HTTP';
    formLeakVal.style.color = '#dc2626';
    formLeakIcon.className = 'leak-icon danger';
  } else if (insecureFormDetected) {
    formLeakVal.textContent = 'Insecure Form Action';
    formLeakVal.style.color = '#dc2626';
    formLeakIcon.className = 'leak-icon danger';
  } else {
    formLeakVal.textContent = 'HTTPS Encrypted';
    formLeakVal.style.color = '#059669';
    formLeakIcon.className = 'leak-icon safe';
  }

  // Compute distinct external telemetry receivers
  const rootHost = hostname.replace(/^www\./, '');
  const thirdPartyHosts = new Set();

  cookiesData.forEach(c => {
    const cookieHost = c.domain.replace(/^\./, '').replace(/^www\./, '');
    if (!cookieHost.includes(rootHost) && !rootHost.includes(cookieHost)) {
      thirdPartyHosts.add(cookieHost);
    }
  });

  const receiverCount = thirdPartyHosts.size;
  if (receiverCount === 0) {
    exfilLeakVal.textContent = '0 External Hosts';
    exfilLeakVal.style.color = '#059669';
    exfilLeakIcon.className = 'leak-icon safe';
  } else if (receiverCount <= 3) {
    exfilLeakVal.textContent = `${receiverCount} External Hosts`;
    exfilLeakVal.style.color = '#d97706';
    exfilLeakIcon.className = 'leak-icon warn';
  } else {
    exfilLeakVal.textContent = `${receiverCount} External Hosts`;
    exfilLeakVal.style.color = '#dc2626';
    exfilLeakIcon.className = 'leak-icon danger';
  }
}

/**
 * Clear site cookies
 */
async function handleClearCookies() {
  if (!currentUrl) return;

  const confirmed = confirm(`Clear ${cookiesData.length} cookies stored by this site?\n\nThis will reset tracking identifiers and may require you to log in again.`);
  if (!confirmed) return;

  chrome.runtime.sendMessage({ action: 'clearCookiesForDomain', url: currentUrl }, (response) => {
    if (response && response.success) {
      alert(`Cleared ${response.count} cookies.`);
      scanCurrentWebsite();
    } else {
      alert('Unable to clear cookies for this domain.');
    }
  });
}

/**
 * Export JSON report
 */
function handleExportReport() {
  const report = {
    website: currentOrigin,
    url: currentUrl,
    timestamp: new Date().toISOString(),
    privacyScore: parseInt(document.getElementById('scoreValue').textContent, 10),
    activePermissions: Object.entries(permissionsData).filter(([_, state]) => state === 'granted').map(([name]) => name),
    allPermissions: permissionsData,
    trackersSummary: {
      total: capturedTrackers.length,
      advertising: capturedTrackers.filter(t => t.category === 'advertising').length,
      analytics: capturedTrackers.filter(t => t.category === 'analytics').length,
      social: capturedTrackers.filter(t => t.category === 'social').length,
      retargeting: capturedTrackers.filter(t => t.category === 'retargeting').length,
      fingerprinting: capturedTrackers.filter(t => t.category === 'fingerprinting').length,
      pixel: capturedTrackers.filter(t => t.category === 'pixel').length,
      unclassified: capturedTrackers.filter(t => t.category === 'unclassified').length
    },
    inPageProbes: inPageProbes,
    trackers: capturedTrackers.map(t => ({
      serviceName: t.serviceName,
      category: t.category,
      categoryLabel: t.categoryLabel,
      domain: t.domain,
      isThirdParty: t.isThirdParty,
      type: t.type,
      evidence: t.evidence,
      url: t.url
    })),
    cookiesSummary: {
      total: cookiesData.length,
      tracking: cookiesData.filter(c => c.category === 'tracking').length,
      analytics: cookiesData.filter(c => c.category === 'analytics').length,
      auth: cookiesData.filter(c => c.category === 'auth').length,
      functional: cookiesData.filter(c => c.category === 'functional').length
    },
    cookies: cookiesData.map(c => ({
      name: c.name,
      domain: c.domain,
      path: c.path,
      category: c.categoryLabel,
      meaning: c.plainMeaning,
      secure: c.secure,
      httpOnly: c.httpOnly,
      sameSite: c.sameSite,
      lifespan: c.lifespanText
    }))
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
  const downloadAnchor = document.createElement('a');
  const domainSlug = (new URL(currentUrl).hostname || 'site').replace(/[^a-z0-9]/gi, '_');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `privacylens_report_${domainSlug}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function renderRestrictedState() {
  document.getElementById('scoreValue').textContent = '--';
  document.getElementById('scoreGrade').textContent = 'System Page';
  document.getElementById('scoreDesc').textContent = 'Open any public website to perform an audit.';
  
  const statPermsGranted = document.getElementById('statPermsGranted');
  if (statPermsGranted) statPermsGranted.textContent = '0';
  const statCookiesTotal = document.getElementById('statCookiesTotal');
  if (statCookiesTotal) statCookiesTotal.textContent = '0';
  const statTrackersTotal = document.getElementById('statTrackersTotal');
  if (statTrackersTotal) statTrackersTotal.textContent = '0';
  const statThirdParties = document.getElementById('statThirdParties');
  if (statThirdParties) statThirdParties.textContent = '0';

  const resetCount = (id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = '0';
  };

  resetCount('matrixCountAds');
  resetCount('matrixCountAnalytics');
  resetCount('matrixCountSocial');
  resetCount('matrixCountRetarget');
  resetCount('matrixCountFp');
  resetCount('matrixCountPixel');
  resetCount('matrixCountUnclassified');

  const matrixTotalLabel = document.getElementById('matrixTotalLabel');
  if (matrixTotalLabel) {
    matrixTotalLabel.textContent = '0 Detected';
    matrixTotalLabel.classList.add('clean');
  }

  document.getElementById('permissionsList').innerHTML = '<div class="empty-state"><p>Browser system pages do not request permissions.</p></div>';
  document.getElementById('cookiesList').innerHTML = '<div class="empty-state"><p>Browser system pages do not set web cookies.</p></div>';
  const trackersList = document.getElementById('trackersList');
  if (trackersList) {
    trackersList.innerHTML = '<div class="empty-state"><p>Browser system pages do not transmit third-party tracker requests.</p></div>';
  }

  const verdictCard = document.getElementById('verdictCard');
  if (verdictCard) {
    verdictCard.className = 'hero-verdict state-safe';
    document.getElementById('verdictTitle').textContent = 'Internal Browser Page';
    document.getElementById('verdictBadge').textContent = 'Safe';
    document.getElementById('verdictBadge').className = 'status-tag safe';
    document.getElementById('verdictSummary').textContent = 'Protected browser environment. No tracking cookies or device permissions are used.';
    document.getElementById('safePointsList').innerHTML = '<li>Protected browser sandbox</li><li>No third-party trackers</li>';
    document.getElementById('riskPointsList').innerHTML = '<li>No external risks</li>';
  }

  const miniScorePill = document.getElementById('miniScorePill');
  if (miniScorePill) {
    miniScorePill.textContent = 'Score: --';
    miniScorePill.className = 'score-pill';
  }

  const breachCard = document.getElementById('breachCard');
  if (breachCard) {
    breachCard.className = 'breach-card clean-breach';
    document.getElementById('breachBadge').className = 'breach-badge clean';
    document.getElementById('breachStatusText').textContent = 'Internal System Page';
    document.getElementById('breachHeadline').textContent = 'No Data Transmission';
    document.getElementById('breachSummary').textContent = 'Browser internal pages operate locally. No credentials or personal data can leak.';
    document.getElementById('breachChips').innerHTML = '';
    document.getElementById('formLeakVal').textContent = 'Local Only';
    document.getElementById('formLeakVal').style.color = '#059669';
    document.getElementById('exfilLeakVal').textContent = '0 Receivers';
    document.getElementById('exfilLeakVal').style.color = '#059669';
  }

  const watchdogCard = document.getElementById('watchdogCard');
  if (watchdogCard) {
    watchdogCard.className = 'watchdog-card safe';
    const wb = document.getElementById('watchdogBadge');
    if (wb) wb.className = 'watchdog-badge';
    const wd = document.getElementById('watchdogDot');
    if (wd) wd.className = 'watchdog-dot';
    const wst = document.getElementById('watchdogStatusText');
    if (wst) wst.textContent = 'Internal System Page';
    const wh = document.getElementById('watchdogHeadline');
    if (wh) wh.textContent = 'Protected Browser Environment';
    const ws = document.getElementById('watchdogSummary');
    if (ws) ws.textContent = 'System pages operate in isolated sandboxes with zero external script execution.';
    const wt = document.getElementById('watchdogThreats');
    if (wt) wt.innerHTML = '<div class="threat-item safe"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Zero third-party script intervention</span></div>';
  }

  const sanitizerBanner = document.getElementById('urlSanitizerBanner');
  if (sanitizerBanner) sanitizerBanner.classList.add('hidden');
  const copyCleanUrlBtn = document.getElementById('copyCleanUrlBtn');
  if (copyCleanUrlBtn) copyCleanUrlBtn.classList.add('hidden');
}

/* ==========================================================================
   FEATURE 1: ACTIVE TRACKER SHIELD & CONTROLS
   ========================================================================== */
function getShieldState(res) {
  if (!res) return undefined;
  if (typeof res.shieldEnabled === 'boolean') return res.shieldEnabled;
  if (typeof res.shieldActive === 'boolean') return res.shieldActive;
  return undefined;
}

function initShield() {
  const shieldBtn = document.getElementById('shieldToggleBtn');
  if (shieldBtn) {
    shieldBtn.addEventListener('click', async () => {
      // Optimistically flip visual state immediately for snappy response
      const currentlyActive = shieldBtn.classList.contains('active');
      const targetState = !currentlyActive;
      updateShieldUI(targetState);

      try {
        if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ action: 'toggleShield' }, (res) => {
            const state = getShieldState(res);
            if (state !== undefined) {
              updateShieldUI(state);
            }
          });
        }
      } catch (e) {
        console.warn('Shield toggle error:', e);
      }
    });
  }

  try {
    if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: 'getShieldStatus' }, (res) => {
        const state = getShieldState(res);
        if (state !== undefined) {
          updateShieldUI(state);
        }
      });
    } else if (window.chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['shieldEnabled'], (data) => {
        updateShieldUI(data.shieldEnabled !== false);
      });
    }
  } catch (e) {}
}

function updateShieldUI(isActive) {
  const shieldBtn = document.getElementById('shieldToggleBtn');
  const shieldLabel = document.getElementById('shieldToggleText');
  const dashShieldToggle = document.getElementById('dashShieldToggle');

  if (shieldBtn) {
    shieldBtn.classList.toggle('active', !!isActive);
    shieldBtn.title = isActive ? 'Tracker Shield Active: Known trackers blocked' : 'Tracker Shield Inactive: Click to enable';
  }
  if (shieldLabel) {
    shieldLabel.textContent = isActive ? 'Shield ON' : 'Shield OFF';
  }
  if (dashShieldToggle) {
    dashShieldToggle.checked = !!isActive;
  }
}

/* ==========================================================================
   FEATURE 2: URL TRACKING PARAMETER SANITIZER
   ========================================================================== */
let currentCleanUrl = null;

function checkUrlSanitization(urlStr) {
  const banner = document.getElementById('urlSanitizerBanner');
  const copyBtn = document.getElementById('copyCleanUrlBtn');
  const titleEl = document.getElementById('sanitizerTitle');
  const detailEl = document.getElementById('sanitizerDetail');
  const actionBtn = document.getElementById('cleanUrlActionBtn');

  if (!urlStr || typeof stripTrackingParameters !== 'function') {
    if (banner) banner.classList.add('hidden');
    if (copyBtn) copyBtn.classList.add('hidden');
    return;
  }

  const stripped = stripTrackingParameters(urlStr);
  if (stripped.hasChanged && stripped.strippedParams && stripped.strippedParams.length > 0) {
    currentCleanUrl = stripped.cleanUrl;
    if (banner) {
      banner.classList.remove('hidden');
      if (titleEl) titleEl.textContent = `Tracking Link Detected (${stripped.strippedParams.length} token${stripped.strippedParams.length > 1 ? 's' : ''})`;
      if (detailEl) detailEl.textContent = `Found: ${stripped.strippedParams.slice(0, 4).join(', ')}${stripped.strippedParams.length > 4 ? '...' : ''}`;
      if (actionBtn) {
        actionBtn.textContent = 'Clean URL';
        actionBtn.disabled = false;
      }
    }
    if (copyBtn) {
      copyBtn.classList.remove('hidden');
    }
  } else {
    currentCleanUrl = null;
    if (banner) banner.classList.add('hidden');
    if (copyBtn) copyBtn.classList.add('hidden');
  }
}

function initSanitizer() {
  const cleanUrlActionBtn = document.getElementById('cleanUrlActionBtn');
  if (cleanUrlActionBtn) {
    cleanUrlActionBtn.addEventListener('click', async () => {
      if (currentTab && currentCleanUrl) {
        chrome.runtime.sendMessage({
          action: 'stripTabUrl',
          tabId: currentTab.id,
          cleanUrl: currentCleanUrl
        }, (res) => {
          const detailEl = document.getElementById('sanitizerDetail');
          if (detailEl) detailEl.textContent = 'URL stripped and address bar sanitized!';
          cleanUrlActionBtn.textContent = 'Cleaned!';
          cleanUrlActionBtn.disabled = true;
          const copyBtn = document.getElementById('copyCleanUrlBtn');
          if (copyBtn) copyBtn.classList.add('hidden');
          setTimeout(() => {
            const banner = document.getElementById('urlSanitizerBanner');
            if (banner) banner.classList.add('hidden');
          }, 1800);
        });
      }
    });
  }

  const copyBtn = document.getElementById('copyCleanUrlBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      if (currentCleanUrl) {
        try {
          await navigator.clipboard.writeText(currentCleanUrl);
          const originalText = copyBtn.innerHTML;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
          }, 1500);
        } catch (e) {
          console.error('Clipboard copy error:', e);
        }
      }
    });
  }
}

/* ==========================================================================
   FEATURE 3: KEYSTROKE & FORM SNOOPING WATCHDOG
   ========================================================================== */
async function scanWatchdog(tab) {
  let result = {
    safe: true,
    hasSensitiveFields: false,
    sensitiveFieldCount: 0,
    hasSessionReplay: false,
    replayTools: [],
    insecureFormsCount: 0
  };

  try {
    const res = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (typeof inspectFormWatchdog === 'function') {
          return inspectFormWatchdog();
        }
        const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea'));
        const sensitive = inputs.filter(i => {
          const t = (i.type || '').toLowerCase();
          const n = (i.name || '').toLowerCase() + ' ' + (i.id || '').toLowerCase() + ' ' + (i.autocomplete || '').toLowerCase();
          return t === 'password' || t === 'email' || t === 'tel' || n.includes('pass') || n.includes('card') || n.includes('cvv') || n.includes('credit') || n.includes('ssn');
        });
        const replayLibs = [
          { name: 'Hotjar', check: () => !!(window.hj || window._hjSettings) },
          { name: 'FullStory', check: () => !!(window.FS || window._fs_namespace) },
          { name: 'LogRocket', check: () => !!window.LogRocket },
          { name: 'Smartlook', check: () => !!window.smartlook },
          { name: 'Inspectlet', check: () => !!window.__insp },
          { name: 'Mouseflow', check: () => !!window._mfq },
          { name: 'CrazyEgg', check: () => !!window.CE2 }
        ];
        const detected = [];
        for (const r of replayLibs) {
          try { if (r.check()) detected.push(r.name); } catch(e){}
        }
        const insecure = Array.from(document.querySelectorAll('form')).filter(f => {
          const act = (f.getAttribute('action') || '').trim();
          return act.startsWith('http://');
        });
        return {
          safe: detected.length === 0 && insecure.length === 0,
          hasSensitiveFields: sensitive.length > 0,
          sensitiveFieldCount: sensitive.length,
          hasSessionReplay: detected.length > 0,
          replayTools: detected,
          insecureFormsCount: insecure.length
        };
      }
    });

    if (res && res[0] && res[0].result) {
      result = res[0].result;
    }
  } catch (e) {
    console.warn('Watchdog check restricted:', e.message);
  }

  renderWatchdog(result);
}

function renderWatchdog(result) {
  const card = document.getElementById('watchdogCard');
  const dot = document.getElementById('watchdogDot');
  const statusText = document.getElementById('watchdogStatusText');
  const headline = document.getElementById('watchdogHeadline');
  const summary = document.getElementById('watchdogSummary');
  const threatsContainer = document.getElementById('watchdogThreats');

  if (!card) return;

  if (result.hasSessionReplay || result.insecureFormsCount > 0) {
    card.className = 'watchdog-card warning';
    if (dot) dot.className = 'watchdog-dot warning';
    if (statusText) statusText.textContent = 'Caution: Keystroke Telemetry Active';
    if (headline) headline.textContent = 'Session Replay or Form Interception Detected';
    if (summary) summary.textContent = 'Third-party scripts on this page have the technical ability to record keystrokes and unsubmitted form inputs.';
  } else {
    card.className = 'watchdog-card safe';
    if (dot) dot.className = 'watchdog-dot';
    if (statusText) statusText.textContent = 'Protected: No Session Replay Active';
    if (headline) headline.textContent = 'Input & Form Snooping Protection';
    if (summary) summary.textContent = 'No unauthorized session replay recorders (such as Hotjar or FullStory) or unencrypted form transmissions were found.';
  }

  if (threatsContainer) {
    let itemsHtml = '';
    if (result.hasSessionReplay) {
      itemsHtml += `<div class="threat-item warning">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Session Replay Recorders Active: <strong>${result.replayTools.join(', ')}</strong></span>
      </div>`;
    } else {
      itemsHtml += `<div class="threat-item safe">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Zero session replay keystroke loggers detected</span>
      </div>`;
    }

    if (result.insecureFormsCount > 0) {
      itemsHtml += `<div class="threat-item warning">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><line x1="17" y1="5" x2="7" y2="19"/></svg>
        <span>${result.insecureFormsCount} form(s) submit over unencrypted HTTP</span>
      </div>`;
    }

    if (result.hasSensitiveFields) {
      itemsHtml += `<div class="threat-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>${result.sensitiveFieldCount} sensitive input field(s) monitored for snooping</span>
      </div>`;
    }

    threatsContainer.innerHTML = itemsHtml;
  }
}

/* ==========================================================================
   FEATURE 8: PRIVACY EXPOSURE DASHBOARD
   ========================================================================== */
function initDashboard() {
  const dashShieldToggle = document.getElementById('dashShieldToggle');
  if (dashShieldToggle) {
    dashShieldToggle.addEventListener('change', (e) => {
      const targetState = e.target.checked;
      updateShieldUI(targetState);
      try {
        if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ action: 'toggleShield' }, (res) => {
            const state = getShieldState(res);
            if (state !== undefined) {
              updateShieldUI(state);
            }
          });
        }
      } catch (err) {
        console.warn('Dashboard shield toggle error:', err);
      }
    });
  }

  const dashStripToggle = document.getElementById('dashStripToggle');
  if (dashStripToggle) {
    dashStripToggle.addEventListener('change', (e) => {
      chrome.runtime.sendMessage({
        action: 'toggleAutoStrip',
        enabled: e.target.checked
      });
    });
  }

  // Load auto-strip initial state
  try {
    chrome.runtime.sendMessage({ action: 'getShieldStatus' }, (res) => {
      if (dashStripToggle && res) {
        dashStripToggle.checked = res.autoStripParams !== false;
      }
    });
  } catch (e) {}

  const exportExposureBtn = document.getElementById('exportExposureBtn');
  if (exportExposureBtn) {
    exportExposureBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'getPrivacyExposure' }, (res) => {
        const exposure = res || {};
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exposure, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', `privacylens_exposure_history_${Date.now()}.json`);
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    });
  }

  const clearExposureBtn = document.getElementById('clearExposureBtn');
  if (clearExposureBtn) {
    clearExposureBtn.addEventListener('click', () => {
      if (confirm('Reset your entire local Privacy Exposure history? This cannot be undone.')) {
        chrome.runtime.sendMessage({ action: 'clearPrivacyExposure' }, () => {
          renderDashboard();
        });
      }
    });
  }
}

function renderDashboard() {
  chrome.runtime.sendMessage({ action: 'getPrivacyExposure' }, (res) => {
    const exposure = res || {};
    const blockedEl = document.getElementById('dashBlockedTotal');
    const trackersEl = document.getElementById('dashTrackersTotal');
    const paramsEl = document.getElementById('dashParamsStripped');
    const sitesEl = document.getElementById('dashSitesAudited');

    if (blockedEl) blockedEl.textContent = exposure.totalTrackersBlocked || 0;
    if (trackersEl) trackersEl.textContent = exposure.totalTrackersDetected || 0;
    if (paramsEl) paramsEl.textContent = exposure.totalParamsStripped || 0;
    if (sitesEl) sitesEl.textContent = exposure.sitesAudited ? Object.keys(exposure.sitesAudited).length : 0;

    // Render Giants
    const listContainer = document.getElementById('dashNetworkList');
    if (!listContainer) return;

    const encounters = exposure.networkEncounters || {};
    const entries = Object.entries(encounters).sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) {
      listContainer.innerHTML = '<div class="dash-empty-state"><p>No tracking history recorded yet. Browse websites with PrivacyLens active to build your privacy footprint map.</p></div>';
      return;
    }

    const maxVal = Math.max(...entries.map(e => e[1]), 1);
    let html = '';

    entries.slice(0, 7).forEach(([networkName, count], idx) => {
      const pct = Math.round((count / maxVal) * 100);
      const cleanKey = networkName.toLowerCase().replace(/[^a-z]/g, '');
      let barClass = 'other';
      if (cleanKey.includes('google') || cleanKey.includes('doubleclick')) barClass = 'google';
      else if (cleanKey.includes('meta') || cleanKey.includes('facebook')) barClass = 'meta';
      else if (cleanKey.includes('amazon')) barClass = 'amazon';
      else if (cleanKey.includes('microsoft')) barClass = 'microsoft';
      else if (cleanKey.includes('tiktok')) barClass = 'tiktok';

      html += `
        <div class="network-ranking-item">
          <div class="net-row-top">
            <div class="net-name-group">
              <span class="net-rank-tag">#${idx + 1}</span>
              <span class="net-name">${escapeHtml(networkName)}</span>
            </div>
            <span class="net-count">${count} encounter${count > 1 ? 's' : ''}</span>
          </div>
          <div class="net-bar-bg">
            <div class="net-bar-fill ${barClass}" style="width: ${Math.max(pct, 6)}%;"></div>
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;
  });
}

