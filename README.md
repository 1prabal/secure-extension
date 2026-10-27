# 🛡️ PrivacyLens - Chrome Privacy & Cookie Auditor Extension

> **A handcrafted, light-themed Manifest V3 Chrome Extension that scans any website, audits requested permissions, security risks, and explains stored cookies in clear, simple English.**

---

## ✨ Design & Features

### 1. 🎨 Handcrafted Light Design
- **Clean, Minimalist Aesthetics:** Designed with an Apple/Linear-grade crisp light palette (`#F8FAFC` background, `#FFFFFF` cards, `#E2E8F0` borders).
- **Zero AI-Generated Feel:** Replaced messy emoji soup with crisp vector SVG icons, smooth iOS-style segmented controls, and human copywriting.
- **Always-Visible Status:** Clean top site address bar with live security indicators and quick access to Chrome site settings.

### 2. 🚨 Data Leak & Breach History Monitor
- **Historical Breach Intelligence:** Automatically scans if the domain you are visiting has a documented history of major data breaches (e.g. LinkedIn, Adobe, Canva, Yahoo, Twitter/X, AT&T, Dropbox, Ticketmaster, etc.).
- **Compromised Data Indicators:** Shows exact data types compromised in the breach (e.g. `Passwords`, `Emails`, `Phone numbers`, `Physical addresses`, `Credit card partials`).
- **Real-Time Leak Transmission Checks:**
  - **Form Submission Security:** Audits whether login/password fields submit over encrypted HTTPS or vulnerable plain HTTP.
  - **External Exfiltration Count:** Displays how many external third-party tracker domains are receiving telemetry from this page.
- **One-Click Email Check:** Direct shortcut link to verify whether your personal email address was caught in that specific domain's leaks.

### 3. 🔍 Website Permission Scanner & Threat Analysis
- **Scans Real-Time Permissions:**
  - 📍 **Geolocation (GPS / Coordinates)**
  - 📷 **Camera (Webcam)**
  - 🎙️ **Microphone (Audio)**
  - 🔔 **Desktop Push Notifications**
  - 📋 **Clipboard (Read Access)**
  - 📝 **Clipboard (Write Access)**
  - 📱 **Motion Sensors (Accelerometer, Gyroscope, Magnetometer)**
  - 💾 **Persistent Storage (Resilient Super-Cookies)**
  - ☀️ **Screen Wake Lock**
  - 🎹 **MIDI Audio Devices**
- **State Badges:** Instantly shows whether each permission is `Granted (Active)`, `Prompt (Ask)`, `Denied (Blocked)`, or `Unsupported`.
- **Harmful Impact Breakdown:** Clearly explains how each permission can be abused (e.g., physical surveillance, audio eavesdropping, credential theft, notification spam, clipboard hijacking).
- **One-Click Management:** Direct button to jump straight into Chrome's native site permissions settings to revoke or block privileges.

### 2. 🍪 Simple & Concise Cookie Breakdown
- **Plain-English Explanations:** Translates cryptic cookie names (like `_ga`, `_fbp`, `IDE`) into plain language ("Tracks your identity and ad interactions across multiple partner websites").
- **Smart Categorization:**
  - 🎯 **Tracking & Ads:** Cross-site behavioral advertising and ad attribution.
  - 📊 **Analytics:** Metrics on clicks, time spent, and scroll behavior.
  - 🔑 **Session & Authentication:** Login tokens, security credentials, and CSRF tokens.
  - ⚙️ **Functional & Preferences:** Theme modes, language settings, and consent banner states.
  - ❓ **Other:** Miscellaneous site data.
- **Security & Flag Auditing:**
  - 🔒 **Secure Flag:** Checks if cookies are transmitted over encrypted HTTPS.
  - 🛡️ **HttpOnly Flag:** Checks if sensitive tokens are shielded from malicious JavaScript (XSS attacks).
  - 🛡️ **SameSite Flag:** Protects against Cross-Site Request Forgery (CSRF).
  - ⏱️ **Lifespan Tracker:** Identifies session cookies vs. long-lived persistent "zombie cookies" (> 1 year).
- **🧹 One-Click "Clear Cookies":** Purge all cookies stored by the active site to reset tracking IDs immediately.
- **📥 Audit Export:** Export full JSON report of the site's privacy profile for documentation or reporting.

### 3. ⚖️ Executive Safety Verdict: "Is It Safe or Harmful?"
- **Instant High-Level Decision:** Directly at the top of the popup, gives an immediate answer:
  - 🟢 **SAFE TO BROWSE:** No invasive permissions active and zero third-party ad trackers.
  - 🟡 **CAUTION: TRACKING DETECTED:** Advertising cookies are monitoring your browsing habits, but hardware access is securely locked.
  - 🔴 **HARMFUL / HIGH PRIVACY THREAT:** Invasive hardware permissions (camera/mic/GPS) are granted, or high-risk insecure cookies are exposed.
- **Two-Column Quick Breakdown:**
  - ✅ **What's Safe:** Highlights what protections are in place (e.g., webcam blocked, HTTPS encrypted, session cookies cleared on close).
  - ⚠️ **Harmful Impacts & Risks:** Summarizes exact threats (e.g., ad tracking cookies profiling your shopping/reading, location tracking, missing HttpOnly protection).

### 4. 🎯 Privacy Health Score
- Aggregates permissions, tracker counts, and insecure cookie flags into a real-time **Privacy Score (0–100 / Grades A to F)**.
- Color-coded badges and risk summary alerts.

---

## 🚀 How to Install in Google Chrome

1. Open Google Chrome.
2. In the URL address bar, navigate to:
   ```text
   chrome://extensions
   ```
3. In the top-right corner of the Extensions page, turn **ON** the toggle switch for **"Developer mode"**.
4. In the top-left corner, click the **"Load unpacked"** button.
5. In the file picker dialog, select this folder:
   ```text
   C:\Users\gamin\Downloads\Secure Extension
   ```
6. The extension **"PrivacyLens - Website Permission & Cookie Auditor"** will now appear in your Chrome toolbar.
7. Click the extension puzzle icon in Chrome's top bar and pin **PrivacyLens** to your toolbar for quick access!

---

## 🧪 How to Test It

1. Open any regular website (e.g., `https://wikipedia.org`, `https://github.com`, or any news/shopping website).
2. Click the **PrivacyLens** shield icon in your Chrome toolbar.
3. Observe:
   - **Privacy Score & Grade** in the circular meter.
   - **Active Permissions** in the `Permissions` tab.
   - **Cookies & Trackers** in the `Cookies` tab. Filter by Tracking, Analytics, or Search by name.
   - **Threat Analysis** in the `Threat Analysis` tab for plain-language explanations of privacy risks.
4. Try the **"Clear Cookies"** button to flush tracking cookies and reset your site identity.
5. Click **"Manage Permissions ↗"** to quickly toggle browser permissions for that domain.

---

## 📁 File Structure

```text
Secure Extension/
├── manifest.json         # Chrome Manifest V3 configuration
├── popup.html            # Extension UI structure with tabs & meters
├── popup.css             # Cyber-clean dark theme stylesheet
├── popup.js              # Permission scanning, cookie categorizer & scoring
├── background.js         # Service worker & toolbar badge manager
├── generate_icons.js     # Standalone icon generator
├── icons/
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
└── README.md             # Documentation and usage guide
```
