document.getElementById("verifyButton").addEventListener("click", function () {
  // Send message to background script to allow downloads
  chrome.runtime.sendMessage({ action: "verify" });
  
  // Display confirmation in the popup
  alert("Downloads are now allowed for 60 seconds.");
});

document.getElementById("blockWebsiteButton").addEventListener("click", function () {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let currentTab = tabs[0];
      let currentUrl = new URL(currentTab.url).hostname;

      // Send message to the background script to block the website
      chrome.runtime.sendMessage({ action: 'blockWebsite', website: currentUrl }, function(response) {
          alert(response.status);
      });
  });
});
