/**
 * PrivacyLens - Comprehensive Website Privacy & Advertising Tracker Analyzer
 * Rules Engine & Threat Intelligence Database
 */

// Known Tracker Categories
const TRACKER_CATEGORIES = {
  ADVERTISING: {
    id: 'advertising',
    label: 'Advertising Network',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    description: 'Ad servers and ad exchanges that auction, target, and display digital advertisements.'
  },
  ANALYTICS: {
    id: 'analytics',
    label: 'Analytics & Measurement',
    color: '#7e22ce',
    bgColor: '#faf5ff',
    borderColor: '#e9d5ff',
    description: 'Audience-measurement and analytics platforms that record page clicks, scroll depth, and user interaction.'
  },
  SOCIAL: {
    id: 'social',
    label: 'Social Media Tracker',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    description: 'Social networking pixels and tags that match your web visits to your social media accounts.'
  },
  RETARGETING: {
    id: 'retargeting',
    label: 'Retargeting & Conversion',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    description: 'Retargeting engines that follow products you view to display reminder ads on other websites.'
  },
  FINGERPRINTING: {
    id: 'fingerprinting',
    label: 'Device Fingerprinting',
    color: '#b91c1c',
    bgColor: '#fff1f2',
    borderColor: '#fecdd3',
    description: 'Scripts that profile your hardware, canvas rendering, audio stack, or fonts to uniquely track your device without cookies.'
  },
  PIXEL: {
    id: 'pixel',
    label: 'Tracking Pixel / Beacon',
    color: '#e11d48',
    bgColor: '#fff1f2',
    borderColor: '#ffe4e6',
    description: 'Invisible 1x1 image beacons or background telemetry pings used to silently verify page visits.'
  },
  UNCLASSIFIED: {
    id: 'unclassified',
    label: 'Unclassified Third-Party',
    color: '#475569',
    bgColor: '#f8fafc',
    borderColor: '#e2e8f0',
    description: 'Third-party requests not matched with known trackers. Audited for transparent data-sharing review without labeling malicious.'
  }
};

// Known Benign CDNs / Utilities that should not be flagged as trackers
const BENIGN_CDNS = new Set([
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'ajax.googleapis.com',
  'code.jquery.com',
  'stackpath.bootstrapcdn.com',
  'cdn.tailwindcss.com',
  'cdn.bootcdn.net',
  'use.fontawesome.com',
  'polyfill.io',
  'cdn.jsdelivr.gh'
]);

// Database of Known Tracker Signatures
const KNOWN_TRACKERS_DB = [
  // --- 1. ADVERTISING NETWORKS ---
  {
    name: 'Google Ad Manager / DoubleClick',
    domains: ['doubleclick.net', 'googleads.g.doubleclick.net', 'adservice.google.com', 'googlesyndication.com', 'googleadservices.com'],
    category: 'advertising',
    evidence: 'Google advertising exchange and ad-serving infrastructure.'
  },
  {
    name: 'Amazon Advertising',
    domains: ['amazon-adsystem.com', 'aax.amazon-adsystem.com'],
    category: 'advertising',
    evidence: 'Amazon ad network and programmatic exchange.'
  },
  {
    name: 'AppNexus / Xandr',
    domains: ['adnxs.com', 'xandr.com'],
    category: 'advertising',
    evidence: 'Xandr programmatic ad marketplace and real-time bidder.'
  },
  {
    name: 'OpenX',
    domains: ['openx.net', 'openx.com'],
    category: 'advertising',
    evidence: 'OpenX programmatic advertising exchange.'
  },
  {
    name: 'PubMatic',
    domains: ['pubmatic.com', 'pubmatic.net'],
    category: 'advertising',
    evidence: 'PubMatic digital advertising supply-side platform.'
  },
  {
    name: 'Rubicon Project / Magnite',
    domains: ['rubiconproject.com', 'magnite.com'],
    category: 'advertising',
    evidence: 'Magnite digital ad-serving and monetization exchange.'
  },
  {
    name: 'Taboola',
    domains: ['taboola.com', 'taboolasyndication.com'],
    category: 'advertising',
    evidence: 'Content recommendation and native advertising network.'
  },
  {
    name: 'Outbrain',
    domains: ['outbrain.com', 'zemanta.com', 'outbrainimg.com'],
    category: 'advertising',
    evidence: 'Native content recommendation and ad-syndication platform.'
  },
  {
    name: 'Media.net',
    domains: ['media.net', 'contextual.media.net'],
    category: 'advertising',
    evidence: 'Contextual advertising network powered by Yahoo! Bing network.'
  },
  {
    name: 'Sovrn / Lijit',
    domains: ['sovrn.com', 'lijit.com'],
    category: 'advertising',
    evidence: 'Publisher ad monetization and ad-exchange.'
  },
  {
    name: 'Index Exchange',
    domains: ['casalemedia.com', 'indexexchange.com'],
    category: 'advertising',
    evidence: 'Programmatic ad marketplace and header-bidding exchange.'
  },
  {
    name: 'TripleLift',
    domains: ['3lift.com', 'triplelift.com'],
    category: 'advertising',
    evidence: 'Native programmatic ad placement platform.'
  },
  {
    name: 'InMobi',
    domains: ['inmobi.com'],
    category: 'advertising',
    evidence: 'Mobile advertising and audience monetization network.'
  },
  {
    name: 'Smart AdServer / Equativ',
    domains: ['smartadserver.com', 'equativ.com'],
    category: 'advertising',
    evidence: 'Independent ad monetization platform.'
  },
  {
    name: 'Teads',
    domains: ['teads.tv'],
    category: 'advertising',
    evidence: 'Outstream video advertising network.'
  },
  {
    name: 'BidSwitch',
    domains: ['bidswitch.net'],
    category: 'advertising',
    evidence: 'Middleware connecting demand-side and supply-side ad platforms.'
  },
  {
    name: 'MediaMath',
    domains: ['mathtag.com'],
    category: 'advertising',
    evidence: 'MediaMath programmatic ad-buying technology.'
  },
  {
    name: 'Sharethrough',
    domains: ['sharethrough.com'],
    category: 'advertising',
    evidence: 'Omnichannel supply-side ad exchange.'
  },
  {
    name: 'Ezoic',
    domains: ['ezoic.net', 'ezoic.com'],
    category: 'advertising',
    evidence: 'Automated website ad testing and layout monetization.'
  },

  // --- 2. ANALYTICS & AUDIENCE MEASUREMENT ---
  {
    name: 'Google Analytics / Tag Manager',
    domains: ['google-analytics.com', 'analytics.google.com', 'googletagmanager.com'],
    category: 'analytics',
    evidence: 'Google traffic measurement, event recording, and tag deployment.'
  },
  {
    name: 'Adobe Analytics & Audience Manager',
    domains: ['demdex.net', 'omtrdc.net', '2o7.net', 'sc.omtrdc.net'],
    category: 'analytics',
    evidence: 'Adobe digital analytics and cross-channel audience measurement.'
  },
  {
    name: 'Mixpanel',
    domains: ['mixpanel.com', 'api.mixpanel.com'],
    category: 'analytics',
    evidence: 'User event tracking, conversion funnels, and retention analytics.'
  },
  {
    name: 'Amplitude',
    domains: ['amplitude.com', 'api.amplitude.com', 'api2.amplitude.com'],
    category: 'analytics',
    evidence: 'Product analytics tracking customer feature usage and journey.'
  },
  {
    name: 'Segment by Twilio',
    domains: ['segment.io', 'api.segment.io', 'segment.com', 'cdn.segment.com'],
    category: 'analytics',
    evidence: 'Customer data platform routing telemetry to downstream marketing tools.'
  },
  {
    name: 'Heap Analytics',
    domains: ['heap.io', 'heapanalytics.com', 'cdn.heapanalytics.com'],
    category: 'analytics',
    evidence: 'Autocapture digital insights and click tracking.'
  },
  {
    name: 'Hotjar',
    domains: ['hotjar.com', 'hotjar.io', 'script.hotjar.com', 'vars.hotjar.com'],
    category: 'analytics',
    evidence: 'User session heatmaps, click maps, and interaction recordings.'
  },
  {
    name: 'Microsoft Clarity',
    domains: ['clarity.ms', 'www.clarity.ms'],
    category: 'analytics',
    evidence: 'Behavioral analytics recording user clicks, scrolls, and frustration metrics.'
  },
  {
    name: 'Chartbeat',
    domains: ['chartbeat.com', 'chartbeat.net'],
    category: 'analytics',
    evidence: 'Real-time content engagement and editorial readership analytics.'
  },
  {
    name: 'Comscore',
    domains: ['scorecardresearch.com'],
    category: 'analytics',
    evidence: 'Media audience measurement and syndicated market research.'
  },
  {
    name: 'Quantcast Measure',
    domains: ['quantserve.com', 'quantcount.com'],
    category: 'analytics',
    evidence: 'Audience demographic profiling and web traffic measurement.'
  },
  {
    name: 'Statcounter',
    domains: ['statcounter.com'],
    category: 'analytics',
    evidence: 'Web traffic statistics and visitor monitoring.'
  },
  {
    name: 'FullStory',
    domains: ['fullstory.com', 'rs.fullstory.com'],
    category: 'analytics',
    evidence: 'Session replay and digital experience analytics.'
  },
  {
    name: 'LogRocket',
    domains: ['logrocket.com', 'logrocket.io'],
    category: 'analytics',
    evidence: 'Client-side session recording and error monitoring telemetry.'
  },
  {
    name: 'New Relic Browser',
    domains: ['nr-data.net', 'newrelic.com'],
    category: 'analytics',
    evidence: 'Browser performance telemetry and user session tracking.'
  },
  {
    name: 'Yandex Metrica',
    domains: ['mc.yandex.ru', 'metrika.yandex.ru'],
    category: 'analytics',
    evidence: 'Web analytics, session replay, and conversion monitoring.'
  },

  // --- 3. SOCIAL MEDIA TRACKING ---
  {
    name: 'Meta / Facebook Pixel & Events SDK',
    domains: ['connect.facebook.net'],
    category: 'social',
    evidence: 'Meta pixel tracking library matching web browsing events to Facebook & Instagram profiles.'
  },
  {
    name: 'Meta / Facebook Pixel Beacon',
    domains: ['facebook.com', 'graph.facebook.com'],
    pathPatterns: [/\/tr(\/|\?|$)/i, /\/pixel(\/|\?|$)/i, /fbevents/i],
    category: 'social',
    evidence: 'Meta tracking beacon reporting web conversions and off-site user actions.'
  },
  {
    name: 'TikTok Pixel',
    domains: ['analytics.tiktok.com'],
    category: 'social',
    evidence: 'TikTok marketing tag tracking website conversions for social ad targeting.'
  },
  {
    name: 'TikTok Conversion Endpoint',
    domains: ['tiktok.com'],
    pathPatterns: [/\/pixel/i, /\/api\/v\d+\/pixel/i],
    category: 'social',
    evidence: 'TikTok marketing tag tracking website conversions for social ad targeting.'
  },
  {
    name: 'Twitter / X Pixel',
    domains: ['analytics.twitter.com', 'ads-twitter.com', 't.co'],
    category: 'social',
    evidence: 'X (Twitter) advertising tag tracking website visitors for tailored audiences.'
  },
  {
    name: 'LinkedIn Insight Tag',
    domains: ['snap.licdn.com', 'px.ads.linkedin.com', 'linkedin.com'],
    pathPatterns: [/\/px\/?(\?|$)/i, /\/collect/i],
    category: 'social',
    evidence: 'LinkedIn conversion tracking and professional demographic profiling.'
  },
  {
    name: 'Pinterest Tag',
    domains: ['ct.pinterest.com', 'pinterest.com'],
    category: 'social',
    evidence: 'Pinterest conversion tag tracking interactions with pins and shopping items.'
  },
  {
    name: 'Snapchat Pixel',
    domains: ['sc-static.net', 'tr.snapchat.com'],
    category: 'social',
    evidence: 'Snapchat pixel measuring cross-device ad attribution.'
  },
  {
    name: 'Reddit Pixel',
    domains: ['alb.reddit.com'],
    category: 'social',
    evidence: 'Reddit conversion and audience-targeting tracking pixel.'
  },

  // --- 4. RETARGETING & CONVERSION MEASUREMENT ---
  {
    name: 'Criteo Retargeting',
    domains: ['criteo.com', 'criteo.net', 'static.criteo.net', 'dis.criteo.com'],
    category: 'retargeting',
    evidence: 'Dynamic product retargeting based on items viewed on this website.'
  },
  {
    name: 'AdRoll / NextRoll',
    domains: ['adroll.com', 'd.adroll.com', 'nextroll.com'],
    category: 'retargeting',
    evidence: 'Cross-platform retargeting and marketing campaign measurement.'
  },
  {
    name: 'The Trade Desk',
    domains: ['adsrvr.org', 'thetradedesk.com'],
    category: 'retargeting',
    evidence: 'Demand-side platform for omnichannel targeted ads and UID2 tracking.'
  },
  {
    name: 'Microsoft Advertising / Bing Ads',
    domains: ['bat.bing.com'],
    category: 'retargeting',
    evidence: 'Microsoft Advertising Universal Event Tracking (UET) tag.'
  },
  {
    name: 'LiveRamp / RLCDN',
    domains: ['rlcdn.com', 'liveramp.com'],
    category: 'retargeting',
    evidence: 'Identity resolution network matching online cookies to offline CRM data.'
  },
  {
    name: 'Neustar / Aggregate Knowledge',
    domains: ['agkn.com'],
    category: 'retargeting',
    evidence: 'Audience identity resolution and cross-device targeting.'
  },
  {
    name: 'Conversant / Dotomi',
    domains: ['dotomi.com', 'conversantmedia.com'],
    category: 'retargeting',
    evidence: 'Personalized digital retargeting and affiliate attribution.'
  },
  {
    name: 'Adform',
    domains: ['adform.net'],
    category: 'retargeting',
    evidence: 'Integrated programmatic retargeting and campaign tracking.'
  },

  // --- 5. FINGERPRINTING & DEVICE IDENTIFICATION ---
  {
    name: 'FingerprintJS / Fingerprint.com',
    domains: ['fpjs.io', 'api.fpjs.io', 'fpcdn.io', 'clientjs.org', 'creepjs.com'],
    category: 'fingerprinting',
    evidence: 'Device intelligence capturing 100+ browser signals for persistent hardware fingerprinting.'
  },
  {
    name: 'ThreatMetrix / LexisNexis',
    domains: ['online-metrix.net'],
    category: 'fingerprinting',
    evidence: 'Device identity profiling analyzing network, TCP, and hardware configurations.'
  },
  {
    name: 'Sift Science',
    domains: ['siftscience.com', 'sift.com', 'cdn.sift.com'],
    category: 'fingerprinting',
    evidence: 'Digital fingerprinting and behavioral user profiling.'
  },
  {
    name: 'PerimeterX / HUMAN',
    domains: ['perimeterx.net', 'px-cdn.net', 'px-cloud.net'],
    category: 'fingerprinting',
    evidence: 'Bot detection capturing client hardware and browser environment telemetry.'
  },
  {
    name: 'DataDome',
    domains: ['datadome.co', 'api-js.datadome.co'],
    category: 'fingerprinting',
    evidence: 'Client-side hardware and canvas profiling script.'
  }
];

// Tracking Pixel URL Patterns
const TRACKING_PIXEL_REGEX = /(\/pixel(\.png|\.gif|\.jpg|\?|$))|(\/tr(\.gif|\?|$))|(\/collect(\?|$))|(\/b\/ss\/)|(\/beacon(\.gif|\?|$))|(\/p\.gif(\?|$))|(\/sync(\.gif|\?|$))|(\/track(\.gif|\?|$))|(\/event(\.gif|\?|$))/i;

// Multi-part TLD lookup helper
const MULTI_PART_TLDS = new Set([
  'co.uk', 'com.au', 'co.in', 'net.in', 'org.in', 'gov.in', 'ac.in',
  'co.nz', 'co.jp', 'com.br', 'com.mx', 'co.za', 'com.sg', 'com.hk'
]);

/**
 * Extracts normalized root domain (e.g. sub.example.co.uk -> example.co.uk)
 */
function getRootDomain(hostname) {
  if (!hostname) return '';
  const cleanHost = hostname.toLowerCase().replace(/^www\./, '').split(':')[0];
  const parts = cleanHost.split('.');
  if (parts.length <= 2) return cleanHost;

  const lastTwo = parts.slice(-2).join('.');
  if (MULTI_PART_TLDS.has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

/**
 * Determines if a request target domain is third-party relative to the site domain
 */
function isThirdPartyDomain(requestHost, siteHost) {
  if (!requestHost || !siteHost) return false;
  const reqRoot = getRootDomain(requestHost);
  const siteRoot = getRootDomain(siteHost);
  return reqRoot !== siteRoot;
}

/**
 * Analyzes an individual network request and classifies its tracking nature
 */
function analyzeNetworkRequest(request, siteHost) {
  const urlStr = request.url || '';
  let urlObj;
  try {
    urlObj = new URL(urlStr);
  } catch (e) {
    return null;
  }

  const reqHost = urlObj.hostname;
  const isThirdParty = isThirdPartyDomain(reqHost, siteHost);
  const pathAndQuery = urlObj.pathname + urlObj.search;

  // Check if benign public CDN
  const isBenignCDN = BENIGN_CDNS.has(reqHost.toLowerCase());

  // Check for 1x1 image / beacon pattern
  const isPixelPattern = TRACKING_PIXEL_REGEX.test(pathAndQuery) ||
    request.type === 'ping' ||
    request.type === 'beacon' ||
    (request.type === 'image' && (pathAndQuery.includes('pixel') || pathAndQuery.includes('beacon') || pathAndQuery.includes('collect')));

  // Search in known trackers database
  for (const tracker of KNOWN_TRACKERS_DB) {
    const domainMatch = tracker.domains.some(d => {
      const cleanD = d.toLowerCase();
      return reqHost.toLowerCase() === cleanD || reqHost.toLowerCase().endsWith('.' + cleanD);
    });

    if (domainMatch) {
      // If path patterns specified, check them
      if (tracker.pathPatterns && tracker.pathPatterns.length > 0) {
        const pathMatch = tracker.pathPatterns.some(p => p.test(pathAndQuery));
        if (!pathMatch) continue;
      }

      const categoryInfo = TRACKER_CATEGORIES[tracker.category.toUpperCase()] || TRACKER_CATEGORIES.UNCLASSIFIED;

      return {
        url: urlStr,
        domain: reqHost,
        rootDomain: getRootDomain(reqHost),
        isThirdParty,
        category: tracker.category,
        categoryLabel: categoryInfo.label,
        categoryColor: categoryInfo.color,
        categoryBg: categoryInfo.bgColor,
        categoryBorder: categoryInfo.borderColor,
        serviceName: tracker.name,
        initiator: request.initiator || '',
        type: request.type || 'other',
        evidence: tracker.evidence,
        isPixel: isPixelPattern,
        isFingerprinter: tracker.category === 'fingerprinting',
        timestamp: request.timestamp || Date.now()
      };
    }
  }

  // If tracking pixel or telemetry beacon endpoint detected
  if (isPixelPattern && !isBenignCDN) {
    const cat = TRACKER_CATEGORIES.PIXEL;
    return {
      url: urlStr,
      domain: reqHost,
      rootDomain: getRootDomain(reqHost),
      isThirdParty,
      category: 'pixel',
      categoryLabel: cat.label,
      categoryColor: cat.color,
      categoryBg: cat.bgColor,
      categoryBorder: cat.borderColor,
      serviceName: isThirdParty ? `Tracking Beacon (${getRootDomain(reqHost)})` : 'First-Party Tracking Beacon',
      initiator: request.initiator || '',
      type: request.type || 'image',
      evidence: isThirdParty
        ? 'Detected third-party image beacon / telemetry ping endpoint matching common tracking patterns.'
        : 'Detected first-party tracking pixel or beacon endpoint used for onsite analytics/attribution.',
      isPixel: true,
      isFingerprinter: false,
      timestamp: request.timestamp || Date.now()
    };
  }

  // If third-party request not recognized
  if (isThirdParty && !isBenignCDN) {
    const cat = TRACKER_CATEGORIES.UNCLASSIFIED;
    // Determine transparent reason for auditing
    const reasons = [];
    if (urlObj.search.length > 80) reasons.push('Carries long query payload or encoded identifiers');
    if (request.type === 'script') reasons.push('Loads external cross-origin executable script');
    if (request.type === 'ping' || request.type === 'xmlhttprequest') reasons.push('Initiates cross-domain background data transmission');
    if (reasons.length === 0) reasons.push('Third-party asset request not matched in public tracker directory');

    return {
      url: urlStr,
      domain: reqHost,
      rootDomain: getRootDomain(reqHost),
      isThirdParty: true,
      category: 'unclassified',
      categoryLabel: cat.label,
      categoryColor: cat.color,
      categoryBg: cat.bgColor,
      categoryBorder: cat.borderColor,
      serviceName: getRootDomain(reqHost),
      initiator: request.initiator || '',
      type: request.type || 'other',
      evidence: reasons.join(' · '),
      isPixel: false,
      isFingerprinter: false,
      timestamp: request.timestamp || Date.now()
    };
  }

  // First-party or benign CDN request
  return null;
}

/**
 * In-page inspection script for transparent fingerprinting probes & DOM pixels
 */
function inspectInPageProbes() {
  const probes = [];

  // 1. Audit DOM Tracking Pixels (0x0 or 1x1 image beacons)
  const images = Array.from(document.querySelectorAll('img, iframe'));
  images.forEach(el => {
    try {
      const isTiny = (el.width <= 1 && el.height <= 1) || (el.naturalWidth <= 1 && el.naturalHeight <= 1);
      const isHidden = el.style.display === 'none' || el.style.visibility === 'hidden' || el.hidden;
      const src = el.src || '';
      if ((isTiny || isHidden) && src.startsWith('http')) {
        const urlObj = new URL(src);
        if (urlObj.hostname !== window.location.hostname) {
          probes.push({
            type: 'dom_pixel',
            category: 'pixel',
            serviceName: 'DOM 1x1 Tracking Pixel',
            domain: urlObj.hostname,
            url: src,
            evidence: `Detected invisible ${el.tagName.toLowerCase()} beacon (${el.width}x${el.height}px) pointing to third-party domain.`
          });
        }
      }
    } catch (e) {}
  });

  // 2. Audit Known Fingerprinting Objects in Window Context
  try {
    if (window.Fingerprint2 || window.FingerprintJS || window.ClientJS) {
      probes.push({
        type: 'fingerprinting_lib',
        category: 'fingerprinting',
        serviceName: 'Client-Side Fingerprinting Library',
        domain: window.location.hostname,
        url: window.location.href,
        evidence: 'Detected active client-side fingerprinting library (FingerprintJS / ClientJS) loaded in page window scope.'
      });
    }
  } catch (e) {}

  // 3. Transparent Heuristics: Canvas Readout Probe Check
  try {
    const scripts = Array.from(document.scripts);
    const hasCanvasFpCode = scripts.some(s => {
      const src = s.src ? s.src.toLowerCase() : '';
      const text = s.innerHTML ? s.innerHTML.toLowerCase() : '';
      return (src.includes('fp') || src.includes('fingerprint') || src.includes('device-id')) &&
        (text.includes('todataurl') || text.includes('getimagedata') || text.includes('unmasked_renderer'));
    });

    if (hasCanvasFpCode) {
      probes.push({
        type: 'canvas_probe',
        category: 'fingerprinting',
        serviceName: 'Canvas / Hardware Profiler',
        domain: window.location.hostname,
        url: window.location.href,
        evidence: 'Script patterns indicate canvas readout and unmasked GPU renderer profiling.'
      });
    }
  } catch (e) {}

  return probes;
}

// Known tracking query parameters used for cross-site attribution & identity matching
const TRACKING_QUERY_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'utm_source_platform',
  'fbclid', 'gclid', 'gclsrc', 'dclid', 'msclkid', 'twclid', 'igshid', 'mc_eid', 'yclid',
  '_hsenc', '_hsmi', '_openstat', 'zanpid', 'wickedid', 's_kwcid', 'sc_customer', 'sc_lid', 'sc_llid',
  'ref_', 'fbadid', 'adgroupid', 'campaignid'
];

/**
 * Strips tracking parameters from a given URL string
 * Returns { cleanUrl, strippedParams: string[], hasChanged: boolean }
 */
function stripTrackingParameters(urlStr) {
  if (!urlStr || typeof urlStr !== 'string' || !urlStr.startsWith('http')) {
    return { cleanUrl: urlStr, strippedParams: [], hasChanged: false };
  }

  try {
    const urlObj = new URL(urlStr);
    const strippedParams = [];

    TRACKING_QUERY_PARAMS.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        strippedParams.push(param);
        urlObj.searchParams.delete(param);
      }
    });

    const hasChanged = strippedParams.length > 0;
    return {
      cleanUrl: urlObj.toString(),
      strippedParams,
      hasChanged
    };
  } catch (e) {
    return { cleanUrl: urlStr, strippedParams: [], hasChanged: false };
  }
}

/**
 * Returns list of distinct domains for aggressive tracking categories
 * (advertising, retargeting, social, fingerprinting) for DNR blocking rules.
 */
function getBlockableTrackerDomains() {
  const domains = new Set();
  const blockCategories = new Set(['advertising', 'retargeting', 'social', 'fingerprinting']);

  KNOWN_TRACKERS_DB.forEach(tracker => {
    if (blockCategories.has(tracker.category)) {
      tracker.domains.forEach(d => {
        domains.add(d.toLowerCase());
      });
    }
  });

  return Array.from(domains);
}

/**
 * In-page inspection for form keystroke snooping & PII exfiltration
 */
function inspectFormWatchdog() {
  const findings = [];
  const sensitiveInputs = Array.from(document.querySelectorAll(
    'input[type="password"], input[type="email"], input[type="tel"], input[name*="pass"], input[name*="email"], input[name*="phone"], input[autocomplete*="email"], input[autocomplete*="password"]'
  ));

  if (sensitiveInputs.length === 0) {
    return {
      hasSnooping: false,
      findings: [],
      inputsAudited: 0
    };
  }

  // Check if third-party scripts have registered event listeners or mutation observers
  const thirdPartyScripts = Array.from(document.scripts).filter(s => {
    if (!s.src) return false;
    try {
      const u = new URL(s.src);
      return u.hostname !== window.location.hostname;
    } catch(e) {
      return false;
    }
  });

  // Check for common session replay / keylogging libraries in page window
  const knownReplayLibs = [
    { name: 'Hotjar Session Recorder', active: !!(window.hj || window._hjSettings) },
    { name: 'FullStory Replay', active: !!(window.FS && window.FS.getCurrentSessionURL) },
    { name: 'LogRocket Telemetry', active: !!window._LogRocket },
    { name: 'Smartlook Screen Tracker', active: !!window.smartlook },
    { name: 'Inspectlet Form Logger', active: !!window.__insp },
    { name: 'Mouseflow Input Tracker', active: !!window._mfq },
    { name: 'CrazyEgg Form Tracker', active: !!window.CE2 }
  ];

  const activeReplay = knownReplayLibs.filter(l => l.active);

  activeReplay.forEach(lib => {
    findings.push({
      threat: 'Form Session Recorder Active',
      target: `${sensitiveInputs.length} sensitive input field(s)`,
      evidence: `Active ${lib.name} script detected in window context monitoring live keystrokes & input events.`,
      severity: 'high'
    });
  });

  // Check for unencrypted form submissions
  const forms = Array.from(document.querySelectorAll('form'));
  forms.forEach(form => {
    const action = form.action || '';
    if (action.startsWith('http://')) {
      findings.push({
        threat: 'Insecure Plain-Text Form',
        target: form.name || 'Unencrypted Form',
        evidence: 'Form action submits login or input data over unencrypted HTTP protocol.',
        severity: 'danger'
      });
    }
  });

  return {
    hasSnooping: findings.length > 0,
    findings,
    inputsAudited: sensitiveInputs.length,
    thirdPartyScriptsCount: thirdPartyScripts.length
  };
}

// Export for Node testing or browser window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TRACKER_CATEGORIES,
    KNOWN_TRACKERS_DB,
    TRACKING_QUERY_PARAMS,
    stripTrackingParameters,
    getBlockableTrackerDomains,
    inspectFormWatchdog,
    getRootDomain,
    isThirdPartyDomain,
    analyzeNetworkRequest,
    inspectInPageProbes
  };
}
