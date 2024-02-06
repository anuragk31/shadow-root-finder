/*global chrome*/
document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const [currentTab] = tabs;    
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['scripts/highlight.js']
        });
    })
});
