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

// App State
let currentTab = null;
let currentUrl = '';
let currentOrigin = '';
let permissionsData = {};
let cookiesData = [];
let activePermFilter = 'all';
let activeCookieCat = 'all';
let cookieSearchQuery = '';

async function initApp() {
  setupEventListeners();
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

  // Cookie category filters
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeCookieCat = e.currentTarget.getAttribute('data-cookie-cat');
      renderCookies();
    });
  });

  // Cookie search input
  const searchInput = document.getElementById('cookieSearchInput');
  searchInput.addEventListener('input', (e) => {
    cookieSearchQuery = e.target.value.trim().toLowerCase();
    renderCookies();
  });

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
  footerScanTime.textContent = 'Auditing...';

  try {
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

    // Run parallel audits
    await Promise.all([
      scanPermissions(tab),
      scanCookies(tab)
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

  tabPermsCount.textContent = grantedCount;
  statPermsGranted.textContent = grantedCount;
  permsSummaryText.textContent = `${grantedCount} allowed · ${promptCount} asks first · ${deniedCount} blocked`;

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
  const statTrackers = document.getElementById('statTrackers');
  const statInsecure = document.getElementById('statInsecure');

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

  tabCookiesCount.textContent = cookiesData.length;
  statCookiesTotal.textContent = cookiesData.length;
  statTrackers.textContent = countTrack;
  statInsecure.textContent = countInsecure;

  document.getElementById('catCountAll').textContent = cookiesData.length;
  document.getElementById('catCountTrack').textContent = countTrack;
  document.getElementById('catCountAnalytics').textContent = countAnalytics;
  document.getElementById('catCountAuth').textContent = countAuth;
  document.getElementById('catCountFunc').textContent = countFunc;
  document.getElementById('catCountOther').textContent = countOther;

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
 * Calculate Overall Privacy Score (0-100)
 */
function computePrivacyScore() {
  const scoreValueEl = document.getElementById('scoreValue');
  const scoreGradeEl = document.getElementById('scoreGrade');
  const scoreDescEl = document.getElementById('scoreDesc');
  const miniScorePill = document.getElementById('miniScorePill');

  let score = 100;

  if (permissionsData['camera'] === 'granted') score -= 25;
  if (permissionsData['microphone'] === 'granted') score -= 25;
  if (permissionsData['geolocation'] === 'granted') score -= 20;
  if (permissionsData['clipboard-read'] === 'granted') score -= 15;
  if (permissionsData['notifications'] === 'granted') score -= 5;

  const trackingCount = cookiesData.filter(c => c.category === 'tracking').length;
  score -= Math.min(25, trackingCount * 3);

  const insecureCount = cookiesData.filter(c => !c.secure || (!c.httpOnly && c.category === 'auth')).length;
  score -= Math.min(20, insecureCount * 4);

  if (cookiesData.length > 30) score -= 10;
  else if (cookiesData.length > 15) score -= 5;

  score = Math.max(10, Math.min(100, score));

  scoreValueEl.textContent = score;
  scoreValueEl.className = 'score-figure';

  if (score >= 85) {
    scoreGradeEl.textContent = 'High Privacy Rating';
    scoreDescEl.textContent = 'No invasive permissions or tracking detected.';
  } else if (score >= 70) {
    scoreGradeEl.textContent = 'Standard Web Activity';
    scoreDescEl.textContent = 'Standard analytics telemetry. Permissions gated.';
  } else if (score >= 50) {
    scoreValueEl.classList.add('warn');
    scoreGradeEl.textContent = 'Noticeable Tracking';
    scoreDescEl.textContent = 'Third-party tracking cookies detected.';
  } else {
    scoreValueEl.classList.add('danger');
    scoreGradeEl.textContent = 'Low Privacy Rating';
    scoreDescEl.textContent = 'Sensitive permissions active or aggressive trackers.';
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

  const trackingCookies = cookiesData.filter(c => c.category === 'tracking');
  const insecureCookies = cookiesData.filter(c => !c.secure || (!c.httpOnly && c.category === 'auth'));
  const zombieCookies = cookiesData.filter(c => c.isLongLived);

  if (trackingCookies.length === 0) {
    safePoints.push('No third-party advertising trackers detected');
  } else {
    riskPoints.push(`${trackingCookies.length} advertising tracker(s) profiling page activity`);
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

  const isDangerous = hasCamera || hasMic || hasLocation || hasClipboard || riskPoints.length >= 4 || score < 55;
  const isModerate = !isDangerous && (trackingCookies.length > 0 || hasNotifications || riskPoints.length > 0 || score < 80);

  if (!isDangerous && !isModerate) {
    verdictCard.classList.add('state-safe');
    verdictTitle.textContent = 'Clean & Safe to Browse';
    verdictBadge.textContent = 'Safe';
    verdictBadge.classList.add('safe');
    verdictSummary.textContent = 'This website does not request sensitive device permissions or use third-party tracking cookies.';
  } else if (isModerate) {
    verdictCard.classList.add('state-caution');
    verdictTitle.textContent = 'Advertising Trackers Present';
    verdictBadge.textContent = 'Moderate';
    verdictBadge.classList.add('caution');
    verdictSummary.textContent = 'This site monitors browsing habits with ad cookies, but has no access to your camera, mic, or location.';
  } else {
    verdictCard.classList.add('state-harmful');
    verdictTitle.textContent = 'Sensitive Access Active';
    verdictBadge.textContent = 'High Risk';
    verdictBadge.classList.add('harmful');
    verdictSummary.textContent = 'This website has active hardware permissions or uses aggressive tracking that exposes personal data.';
  }

  safePointsList.innerHTML = safePoints.slice(0, 3).map(p => `<li>${p}</li>`).join('') || '<li>Standard browser sandbox active.</li>';
  riskPointsList.innerHTML = riskPoints.slice(0, 3).map(p => `<li>${p}</li>`).join('') || '<li>No immediate privacy concerns found.</li>';
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
  document.getElementById('statPermsGranted').textContent = '0';
  document.getElementById('statCookiesTotal').textContent = '0';
  document.getElementById('statTrackers').textContent = '0';
  document.getElementById('statInsecure').textContent = '0';
  document.getElementById('permissionsList').innerHTML = '<div class="empty-state"><p>Browser system pages do not request permissions.</p></div>';
  document.getElementById('cookiesList').innerHTML = '<div class="empty-state"><p>Browser system pages do not set web cookies.</p></div>';

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
}
