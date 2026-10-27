// Background service worker for PrivacyLens
chrome.runtime.onInstalled.addListener(() => {
  console.log('PrivacyLens Extension installed successfully.');
});

// Update badge with cookie count when navigating
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    chrome.cookies.getAll({ url: tab.url }, (cookies) => {
      if (chrome.runtime.lastError || !cookies) return;
      const count = cookies.length;
      if (count > 0) {
        chrome.action.setBadgeText({ tabId, text: count > 99 ? '99+' : String(count) });
        chrome.action.setBadgeBackgroundColor({ tabId, color: count > 20 ? '#EF4444' : count > 5 ? '#F59E0B' : '#10B981' });
      } else {
        chrome.action.setBadgeText({ tabId, text: '' });
      }
    });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSiteSettings') {
    chrome.tabs.create({ url: `chrome://settings/content/siteDetails?site=${encodeURIComponent(request.origin)}` });
    sendResponse({ success: true });
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
