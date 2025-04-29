let allowDownloads = false; // Flag to control download blocking
let currentRuleId = 1;  // Unique ID for each blocking rule

// Listen for download attempts
chrome.downloads.onCreated.addListener((downloadItem) => {
  if (!allowDownloads) {
    chrome.downloads.cancel(downloadItem.id, () => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Download Blocked',
        message: 'Download has been blocked. Click "Verify" to allow downloads.'
      });
    });
  }
});

// Listen for messages from the popup to allow downloads or block websites
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "verify") {
    allowDownloads = true;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Downloads Allowed',
      message: 'Downloads are now allowed. You can proceed with downloading files.'
    });

    setTimeout(() => {
      allowDownloads = false;
    }, 60000); // Allow downloads for 60 seconds
  } else if (message.action === 'blockWebsite') {
    let websiteToBlock = message.website;

    // Add website blocking rule using declarativeNetRequest
    addBlockingRule(websiteToBlock, sendResponse);
    return true;  // Keeps the message channel open for async response
  }
});

// Function to add blocking rule for a website
function addBlockingRule(website, sendResponse) {
  let rule = {
    "id": currentRuleId++,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": `*://${website}/*`,
      "resourceTypes": ["main_frame"]
    }
  };

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [rule],
    removeRuleIds: []  // We are not removing any rules here
  }, () => {
    sendResponse({ status: 'Website blocked: ' + website });
  });
}
