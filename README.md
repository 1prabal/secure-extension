# 🛡️ PrivacyLens - Website Privacy & Advertising Tracker Analyzer (v2.0)

> **A modern, handcrafted Manifest V3 browser extension that analyzes any active website to audit advertising networks, audience analytics, social media pixels, conversion retargeting, tracking beacons, device fingerprinting scripts, permissions, and data breach history.**

---

## 🎯 Key Capabilities & New Features

PrivacyLens v2.5 upgrades passive auditing into an active **Privacy Protector & Tracking Defense System**:

### 🛡️ Feature 1: Active Tracker Blocker & Shield (Auditor to Protector)
- **Dynamic DeclarativeNetRequest (DNR) Engine:** Built for Chrome Manifest V3, blocking requests to over 83+ advertising networks, behavioral retargeting systems, social tracking pixels, and fingerprinting scripts before network transmission occurs.
- **Global & Per-Site Control:** Toggle protection on/off with one click via the interactive **Shield Toggle** in the popup header or Dashboard tab.
- **Whitelist Support:** Excludes user-whitelisted websites from blocking rules without disabling protection globally.

### 🧹 Feature 2: URL Tracking Parameter Stripper
- **Attribution Parameter Sanitization:** Automatically strips cross-site attribution query tokens (`utm_source`, `utm_medium`, `utm_campaign`, `fbclid`, `gclid`, `msclkid`, `twclid`, `igshid`, `mc_eid`, etc.) upon page navigation.
- **Interactive Cleaner Alert:** When tracking tokens are detected in the active link, an alert banner appears with a **"Clean URL"** action button and a **"Clean Link"** copy button.
- **Address Bar Sanitization:** Updates the browser address bar with the sanitized URL without causing page reload loops.

### 👁️ Feature 3: Keystroke & Form Snooping Watchdog
- **Unsubmitted Form Input Protection:** Audits active password, email, and phone input fields to ensure third-party scripts do not monitor keystrokes before form submission.
- **Session Replay Script Detection:** Detects aggressive user-session replay tools (`Hotjar`, `FullStory`, `LogRocket`, `Smartlook`, `Inspectlet`, `Mouseflow`, `CrazyEgg`) capable of recording mouse movements and form interactions.
- **Insecure Form Warning:** Flags HTML forms submitting sensitive credentials over unencrypted HTTP endpoints.

### 📊 Feature 8: "My Privacy Exposure" Analytics Dashboard
- **Lifetime Protection Metrics:** Tracks cumulative statistics on your machine:
  - Total trackers blocked
  - Total trackers encountered
  - URL tracking parameters stripped
  - Unique websites protected
- **Top Tracking Giants Footprint:** Identifies and ranks corporate tracking conglomerates profiling you across multiple sites (Alphabet/Google, Meta/Facebook, Amazon, Microsoft, ByteDance/TikTok, Criteo) with percentage exposure bars.
- **100% Local Storage:** All analytics are stored strictly on your device via `chrome.storage.local` with zero telemetry, cloud transmission, or third-party sharing.
- **Data Management:** Export history as JSON or reset exposure statistics at any time.

---

## 🎨 User Interface & Navigation

- **Segmented 5-Tab Control:**
  - **Overview:** Executive Safety Verdict ("Is It Safe?"), Privacy Health Score (0–100), Metric Strip, **Keystroke & Input Watchdog Card**, **Tracker Detection Breakdown Matrix**, Breach Monitor, and Plain-English Privacy Guide.
  - **Trackers:** Comprehensive request analyzer with live search, 8 category filter pills, in-page fingerprinting alert callout, URL copy buttons, and transparent rule-based indicators.
  - **Perms:** Hardware & system permissions scanner with status filters (Allowed, Asks First, Blocked).
  - **Cookies:** Cookie categorization, security flag audit (Secure, HttpOnly, SameSite, Lifespan), and 1-click cookie cleaner.
  - **Dashboard:** Long-term Privacy Exposure analytics, Tracking Giants breakdown, DNR Shield toggle, and Auto-Strip settings.
- **Interactive Header Bar:** Real-time Shield toggle (`Shield ON` / `Shield OFF`), dynamic risk score pill, and Clean Link copy button.
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
   C:\Users\gamin\Downloads\Secure Extension
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
