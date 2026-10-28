# 🛡️ PrivacyLens - Website Privacy & Advertising Tracker Analyzer (v2.0)

> **A modern, handcrafted Manifest V3 browser extension that analyzes any active website to audit advertising networks, audience analytics, social media pixels, conversion retargeting, tracking beacons, device fingerprinting scripts, permissions, and data breach history.**

---

## 🎯 Key Detection Capabilities

PrivacyLens v2.0 upgrades passive cookie auditing into a comprehensive, real-time **Advertising & Privacy Tracker Analyzer**:

1. **Third-Party Network Request Detection**
   - Captures and inspects all third-party network requests initiated by the current website via `chrome.webRequest` and page resource timing APIs.
   - Distinguishes third-party domains from the current website's root domain using multi-part TLD-aware logic (e.g., `news.google.co.uk` vs. `pay.amazon.co.in`).

2. **Advertising Networks Identification**
   - Identifies requests to known advertising networks (Google Ad Manager / DoubleClick, Amazon Advertising, AppNexus / Xandr, PubMatic, OpenX, Rubicon / Magnite, Taboola, Outbrain, Criteo, Index Exchange, Media.net, etc.).
   - Displays clear indicators explaining the ad network's role in cross-site profiling and real-time bidding.

3. **Analytics & Audience Measurement**
   - Detects audience-measurement services (Google Analytics Universal & GA4, Adobe Experience Cloud / Omniture, Mixpanel, Amplitude, Segment, Heap, Hotjar heatmaps, Microsoft Clarity, Chartbeat, Comscore).
   - Surfaces event recording, session replay, and engagement telemetry.

4. **Social Media Tracking Services**
   - Detects social tracking tags that match off-site browsing to personal social profiles (Meta / Facebook Pixel, TikTok Pixel, Twitter / X Pixel, LinkedIn Insight Tag, Pinterest Tag, Snapchat Pixel, Reddit Pixel).

5. **Retargeting & Conversion Measurement**
   - Flags cross-platform retargeting and intent-measurement platforms (Criteo Dynamic Retargeting, AdRoll / NextRoll, The Trade Desk UID2, Microsoft Bing Ads UET, LiveRamp Identity Resolution, RTB House).

6. **Tracking Pixel & Beacon Detection**
   - Detects 1x1 invisible tracking gifs, `/pixel`, `/tr`, `/collect`, `/p.gif`, and `navigator.sendBeacon` background telemetry endpoints.
   - Inspects in-page DOM for hidden 0x0 or 1x1 `<img>` and `<iframe>` beacon elements.

7. **Rule-Based Device Fingerprinting Detection**
   - Uses transparent, rule-based indicators to detect device fingerprinting:
     - Global fingerprinting libraries present in the page context (`FingerprintJS`, `ClientJS`, `CreepJS`).
     - Script patterns probing HTML5 Canvas readouts (`toDataURL`, `getImageData`).
     - WebGL GPU parameter probing (`WEBGL_debug_renderer_info`).
     - AudioContext oscillator frequency sampling.
   - Highlights in-page fingerprinting alerts with specific evidence.

8. **Unclassified Third-Party Request Detection (Non-Malicious Labeling)**
   - Transparently audits unknown third-party requests that don't match public ad directories.
   - Categorizes them as **"Unclassified Third-Party"** *without automatically labeling them malicious*.
   - Explains transparent reasons (e.g., "Carries long query payload or encoded identifiers", "Loads external cross-origin executable script").

9. **Website Hardware & Browser Permissions Scanner**
   - Real-time audit of Camera, Microphone, Geolocation (GPS), Clipboard Read/Write, Desktop Push Notifications, Motion Sensors, Persistent Storage, Screen Wake Lock, and MIDI.
   - Direct button to open Chrome's native site permissions settings to revoke privileges.

10. **Data Breach & Leak History Monitor**
    - Checks whether the active domain has a documented history of major data breaches (HaveIBeenPwned intelligence).
    - Audits live form submission transport (HTTPS vs. unencrypted HTTP) and external telemetry receivers.

---

## 🎨 User Interface & Navigation

- **Segmented 4-Tab Control:**
  - **Overview:** Executive Safety Verdict ("Is It Safe?"), Privacy Health Score (0–100), Metric Strip, **Tracker Detection Breakdown Matrix**, Breach Monitor, and Plain-English Privacy Guide.
  - **Trackers:** Comprehensive request analyzer with live search, 8 category filter pills, in-page fingerprinting alert callout, URL copy buttons, and transparent rule-based indicators.
  - **Perms:** Hardware & system permissions scanner with status filters (Allowed, Asks First, Blocked).
  - **Cookies:** Cookie categorization, security flag audit (Secure, HttpOnly, SameSite, Lifespan), and 1-click cookie cleaner.
- **Deep-Link Matrix Navigation:** Clicking any category in the Overview Tracker Matrix jumps directly to the Trackers tab with the selected filter pre-activated.
- **Handcrafted Light Theme:** Built with a clean Apple/Linear-grade aesthetic (`#F8FAFC` background, `#FFFFFF` cards, `#E2E8F0` borders, vector SVG icons).

---

## 🚀 How to Install in Google Chrome

1. Open Google Chrome.
2. In the URL address bar, enter:
   ```text
   chrome://extensions
   ```
3. In the top-right corner, toggle **"Developer mode"** to **ON**.
4. In the top-left corner, click **"Load unpacked"**.
5. Select the project folder:
   ```text
   eg -: C:\Users\Downloads\Secure Extension
   ```
6. The extension **"PrivacyLens - Website Privacy & Tracker Analyzer"** will be loaded and pinned to your Chrome toolbar.

---

## 🧪 Testing the Extension

1. Visit any media, shopping, or content site (e.g., `https://cnn.com`, `https://theverge.com`, `https://nytimes.com`, `https://amazon.com`).
2. Click the **PrivacyLens** shield icon in the toolbar.
3. Observe:
   - Live badge counter showing total detected trackers on the active tab icon.
   - In **Overview**: Review the **Tracker Detection Breakdown Matrix** showing live counts for Ad Networks, Analytics, Social Pixels, Retargeting, Fingerprinting, Beacons, and Unclassified third parties.
   - Click any matrix tile or switch to the **Trackers** tab to view individual requests, copy request URLs, and view evidence indicators.
   - Test the category pills (`Ad Networks`, `Analytics`, `Social Pixels`, `Retargeting`, `Fingerprinting`, `Beacons & Pixels`, `Unclassified`) or use the search bar to filter by domain or URL.
   - Click **"Export Audit Report"** in the footer to download a full structured JSON audit of the site's privacy and tracker posture.
