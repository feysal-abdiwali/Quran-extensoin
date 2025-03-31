// This background script handles opening the side panel when the extension icon is clicked

// Initialize the side panel settings
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Quran Extension installed/updated');
});

// Listen for when the action button is clicked
chrome.action.onClicked.addListener((tab) => {
  // This will trigger the side panel to open due to the setPanelBehavior above
  console.log('Quran Extension icon clicked');
});
