/**
 * PrivacyLens - Data Breach & Leak Intelligence Database
 * Curated catalog of documented public domain data breaches
 */

const KNOWN_BREACHES = {
  'linkedin.com': {
    title: 'LinkedIn Data Leak',
    date: 'June 2021 & 2016',
    count: '700,000,000+',
    severity: 'critical',
    dataExposed: ['Email addresses', 'Phone numbers', 'Physical addresses', 'Work history', 'Password hashes'],
    summary: 'A massive database containing 700M LinkedIn user records was scraped and posted on dark web forums, following an earlier 2016 breach of 164M hashed passwords.',
    advice: 'Change your LinkedIn password, enable 2-Factor Authentication (2FA), and watch for targeted phishing emails.'
  },
  'adobe.com': {
    title: 'Adobe Systems Breach',
    date: 'October 2013',
    count: '153,000,000',
    severity: 'critical',
    dataExposed: ['Email addresses', 'Password hints', 'Encrypted passwords', 'User IDs'],
    summary: 'Attackers penetrated Adobe servers, exfiltrating 153 million user records and proprietary software source code.',
    advice: 'Ensure you are not reusing your legacy Adobe password on any other online service.'
  },
  'twitter.com': {
    title: 'Twitter / X API Data Leak',
    date: 'January 2023',
    count: '200,000,000+',
    severity: 'high',
    dataExposed: ['Email addresses', 'Usernames', 'Screen names', 'Account creation dates'],
    summary: 'An API vulnerability was exploited to scrape and compile over 200 million user emails linked to public Twitter profiles.',
    advice: 'Be vigilant against spear-phishing campaigns pretending to originate from Twitter/X support.'
  },
  'x.com': {
    title: 'Twitter / X API Data Leak',
    date: 'January 2023',
    count: '200,000,000+',
    severity: 'high',
    dataExposed: ['Email addresses', 'Usernames', 'Screen names', 'Account creation dates'],
    summary: 'An API vulnerability was exploited to scrape and compile over 200 million user emails linked to public Twitter profiles.',
    advice: 'Be vigilant against spear-phishing campaigns pretending to originate from Twitter/X support.'
  },
  'canva.com': {
    title: 'Canva Security Breach',
    date: 'May 2019',
    count: '137,000,000',
    severity: 'critical',
    dataExposed: ['Email addresses', 'Usernames', 'Real names', 'City/Country', 'Salted bcrypt passwords'],
    summary: 'The hacking group Gitanis breached Canva database systems, downloading 137M customer profiles.',
    advice: 'Change your Canva password and review any linked third-party OAuth logins.'
  },
  'dropbox.com': {
    title: 'Dropbox Cloud Breach',
    date: 'August 2016',
    count: '68,000,000',
    severity: 'high',
    dataExposed: ['Email addresses', 'Salted and hashed passwords'],
    summary: 'Stolen employee credentials allowed attackers to extract 68M user passwords and email addresses.',
    advice: 'Update your Dropbox password and enable cloud two-step verification.'
  },
  'yahoo.com': {
    title: 'Yahoo Historic Breach',
    date: '2013 - 2014',
    count: '3,000,000,000',
    severity: 'critical',
    dataExposed: ['Names', 'Email addresses', 'Telephone numbers', 'Dates of birth', 'Hashed passwords', 'Security Q&A'],
    summary: 'The largest documented data breach in history, compromising all 3 billion Yahoo accounts globally.',
    advice: 'Reset your Yahoo account credentials and ensure security questions are not reused across accounts.'
  },
  'facebook.com': {
    title: 'Facebook / Meta Data Scraping Leak',
    date: 'April 2021',
    count: '533,000,000',
    severity: 'critical',
    dataExposed: ['Phone numbers', 'Full names', 'Locations', 'Email addresses', 'Biographical data'],
    summary: 'Records of 533 million Facebook users across 106 countries were published online for free download.',
    advice: 'Beware of SMS phishing (smishing) and unsolicited verification calls.'
  },
  'quora.com': {
    title: 'Quora Database Breach',
    date: 'November 2018',
    count: '100,000,000',
    severity: 'high',
    dataExposed: ['Names', 'Email addresses', 'Hashed passwords', 'Direct messages', 'Upvotes'],
    summary: 'Unauthorized access to a Quora system allowed extraction of approximately 100 million user accounts.',
    advice: 'Reset your Quora login password if you registered before late 2018.'
  },
  'chegg.com': {
    title: 'Chegg Customer Data Breach',
    date: 'September 2018',
    count: '40,000,000',
    severity: 'high',
    dataExposed: ['Email addresses', 'Usernames', 'Shipping addresses', 'Hashed passwords'],
    summary: 'An unauthorized party gained access to a company database hosting student user information.',
    advice: 'Update your Chegg account password.'
  },
  'myfitnesspal.com': {
    title: 'MyFitnessPal (Under Armour) Breach',
    date: 'February 2018',
    count: '144,000,000',
    severity: 'high',
    dataExposed: ['Usernames', 'Email addresses', 'Hashed passwords'],
    summary: 'Unauthorized party acquired data associated with MyFitnessPal user accounts.',
    advice: 'Change your password and check for reused credentials on health apps.'
  },
  'duolingo.com': {
    title: 'Duolingo Scraped Records',
    date: 'August 2023',
    count: '2,600,000',
    severity: 'medium',
    dataExposed: ['Email addresses', 'Usernames', 'Real names', 'Languages studied'],
    summary: 'User profile records and email addresses were scraped via an exposed API and posted on breach forums.',
    advice: 'Be wary of phishing emails claiming to offer language learning deals or account warnings.'
  },
  'ticketmaster.com': {
    title: 'Ticketmaster / Live Nation Cloud Breach',
    date: 'May 2024',
    count: '560,000,000',
    severity: 'critical',
    dataExposed: ['Names', 'Addresses', 'Email addresses', 'Phone numbers', 'Partial payment card numbers'],
    summary: 'Hackers exfiltrated massive customer databases from Snowflake cloud repositories.',
    advice: 'Monitor your credit card statements for fraudulent ticket purchases.'
  },
  'att.com': {
    title: 'AT&T Dark Web Data Leak',
    date: 'March 2024',
    count: '73,000,000',
    severity: 'critical',
    dataExposed: ['Social Security Numbers (SSNs)', 'Names', 'Email addresses', 'Account passcodes', 'Phone numbers'],
    summary: 'A huge leak containing SSNs and personal data for 7.6M current and 65.4M former account holders surfaced online.',
    advice: 'Reset your AT&T security passcode and place a credit freeze on your credit reports.'
  },
  '23andme.com': {
    title: '23andMe Credential Stuffing & Scraping',
    date: 'October 2023',
    count: '6,900,000',
    severity: 'critical',
    dataExposed: ['Ancestry reports', 'Genetic relatives', 'Birth years', 'Family trees', 'Geographic locations'],
    summary: 'Threat actors used credential stuffing to access accounts, then scraped DNA Relatives data across millions of users.',
    advice: 'Enable 2FA immediately and review account privacy sharing preferences.'
  },
  't-mobile.com': {
    title: 'T-Mobile Repeated Data Breaches',
    date: 'August 2021 & 2023',
    count: '76,000,000+',
    severity: 'critical',
    dataExposed: ['SSNs', 'Names', 'Driver license numbers', 'IMEI/IMSI phone IDs', 'PINs'],
    summary: 'Multiple unauthorized intrusions compromised personal information for tens of millions of postpaid customers.',
    advice: 'Request a SIM swap protection lock on your mobile carrier account.'
  },
  'twitch.tv': {
    title: 'Twitch Source Code & Payout Leak',
    date: 'October 2021',
    count: 'Entire codebase & payouts',
    severity: 'high',
    dataExposed: ['Creator payout figures', 'Source code', 'Internal developer tools', 'Encrypted credentials'],
    summary: 'A misconfigured server allowed an anonymous hacker to leak 128GB of Twitch data on 4chan.',
    advice: 'Reset your Twitch password and rotate your stream keys.'
  },
  'lastpass.com': {
    title: 'LastPass Vault Breach',
    date: 'August - December 2022',
    count: '30,000,000+',
    severity: 'critical',
    dataExposed: ['Encrypted password vaults', 'Customer names', 'Billing addresses', 'Vault metadata'],
    summary: 'Attackers accessed cloud storage environments copying customer password vault backups.',
    advice: 'Change your master password, ensure 2FA is active, and update critical passwords stored in your vault.'
  },
  'uber.com': {
    title: 'Uber Breach & Extortion',
    date: 'November 2017 & 2022',
    count: '57,000,000',
    severity: 'critical',
    dataExposed: ['Names', 'Email addresses', 'Mobile numbers', 'Driver licenses'],
    summary: 'Hackers accessed personal information of 57M riders and drivers globally.',
    advice: 'Review recent trip history and monitor payment cards linked to your account.'
  },
  'discord.com': {
    title: 'Discord Customer Support Agent Breach',
    date: 'May 2023',
    count: 'Customer service tickets',
    severity: 'medium',
    dataExposed: ['Email addresses', 'Support ticket chat logs', 'User-submitted attachments'],
    summary: 'A third-party customer service agent account was compromised, exposing user inquiry tickets.',
    advice: 'Be cautious of phishing messages referencing prior Discord support requests.'
  },
  'roblox.com': {
    title: 'Roblox Developer Conference Data Leak',
    date: 'July 2023',
    count: '4,000+',
    severity: 'medium',
    dataExposed: ['Names', 'Phone numbers', 'Email addresses', 'Dates of birth', 'Physical addresses'],
    summary: 'Personal information of Roblox developer conference attendees from 2012-2020 was leaked online.',
    advice: 'Do not share account recovery information in community forums.'
  },
  'snapchat.com': {
    title: 'Snapchat DB Database Leak',
    date: 'January 2014',
    count: '4,600,000',
    severity: 'medium',
    dataExposed: ['Usernames', 'Phone numbers'],
    summary: 'Security researchers exploited an API vulnerability to dump 4.6 million user phone numbers.',
    advice: 'Enable two-factor login verification in Snapchat app settings.'
  },
  'reddit.com': {
    title: 'Reddit Phishing Incident',
    date: 'February 2023',
    count: 'Internal documents',
    severity: 'low',
    dataExposed: ['Internal documents', 'Source code', 'Advertiser contact data'],
    summary: 'A sophisticated spear-phishing attack targeted Reddit employees, exposing internal documentation.',
    advice: 'Enable Reddit 2FA.'
  },
  'github.com': {
    title: 'OAuth Token Theft Incident',
    date: 'April 2022',
    count: 'Dozens of organizations',
    severity: 'medium',
    dataExposed: ['Private repository source code via stolen Heroku/Travis OAuth keys'],
    summary: 'Attackers leveraged stolen third-party OAuth tokens to download private code from dozens of organizations.',
    advice: 'Regularly audit and revoke unused OAuth applications authorized on your GitHub account.'
  }
};

/**
 * Normalizes a hostname and checks if it matches any known breach
 */
function checkDomainBreach(hostname) {
  if (!hostname) return null;
  
  // Clean hostname (strip www, port, lowercase)
  const cleanHost = hostname.toLowerCase().replace(/^www\./, '').split(':')[0];
  
  // Direct match
  if (KNOWN_BREACHES[cleanHost]) {
    return { domain: cleanHost, ...KNOWN_BREACHES[cleanHost] };
  }

  // Check parent domain (e.g. news.yahoo.com -> yahoo.com)
  const parts = cleanHost.split('.');
  if (parts.length > 2) {
    const rootDomain = parts.slice(-2).join('.');
    if (KNOWN_BREACHES[rootDomain]) {
      return { domain: rootDomain, ...KNOWN_BREACHES[rootDomain] };
    }
  }

  return null;
}
