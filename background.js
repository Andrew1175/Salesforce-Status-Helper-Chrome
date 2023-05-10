var disableNotification = "disable-notification";
var backlogNotification = "backlog-notification";
var availableNotification = "available-notification";
var offlineNotification = "offline-notification";
var autoQueueEnabledNotification = "autoQueueEnabled-notification";
var autoQueueDisabledNotification = "autoQueueDisabled-notification";
var omniErrorNotification = "omniError-notification";

function pushEnableAutoQueue(tabs) {
    for (var i = 0; i < tabs.length; ++i) {
        chrome.tabs.sendMessage(tabs[i].id, {
            command: "enableAutoQueue"
        });
    }
}

chrome.tabs.onUpdated.addListener(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var currTabID = tabs[0].id;
        var currTabURL = tabs[0].url;
        if (currTabURL == undefined) {
            currTabURL = "blank";
        }
        if (currTabURL.includes("zscalergov.lightning.force.com" || "zscaler.lightning.force.com")) {
            chrome.scripting.executeScript({
                target: { tabId: currTabID },
                files: ["content_scripts/change_status.js"]
            });
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.message === "allVariablesLoaded") {
                    sendResponse({ response: "allVariablesLoaded message received" });
                    chrome.storage.sync.get({
                        savedSite: "government",
                        savedEnableQueueCheckbox: true
                    }, function (items) {
                        var selectedSite;
                        if (items.savedEnableQueueCheckbox == true) {
                            if (items.savedSite == "government") {
                                selectedSite = "*://zscalergov.lightning.force.com/*";
                            }
                            else {
                                selectedSite = "*://zscaler.lightning.force.com/*";
                            }
                            chrome.tabs.query({
                                url: selectedSite
                            })
                                .then(pushEnableAutoQueue)
                        }
                    });
                }
            });
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "disableNotification") {
        chrome.notifications.create(disableNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Status Helper has been disabled"
        });
        sendResponse({ response: "Disable message received" });
    }
    else if (request.message === "backlogNotification") {
        chrome.notifications.create(backlogNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Your status has been updated to: Backlog"
        });
        sendResponse({ response: "Backlog message received" });
    }
    else if (request.message === "availableNotification") {
        chrome.notifications.create(availableNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Your status has been updated to: Available"
        });
        sendResponse({ response: "Available message received" });
    }
    else if (request.message === "offlineNotification") {
        chrome.notifications.create(offlineNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Your status has been updated to: Offline"
        });
        sendResponse({ response: "Offline message received" });
    }
    else if (request.message === "autoQueueEnabled") {
        chrome.notifications.create(autoQueueEnabledNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Automated Queue has been enabled"
        });
        sendResponse({ response: "autoQueueEnable message received" });
    }
    else if (request.message === "autoQueueDisabled") {
        chrome.notifications.create(autoQueueDisabledNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Automated Queue has been disabled"
        });
        sendResponse({ response: "autoQueueDisabled message received" });
    }
    if (request.message === "omniErrorState") {
        chrome.notifications.create(omniErrorNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Could not connect to Omni-Channel. Refresh the page to try and correct this issue."
        });
        chrome.action.setIcon({ path: "icons/zscaler-icon-24-Error.png" });
    }
    else if (request.message === "changeIconEnable") {
        chrome.action.setIcon({ path: "icons/zscaler-icon-24-running.png" });
        sendResponse({ response: "Change iconEnable message received" });
    }
    else if (request.message === "changeIconDefault") {
        chrome.action.setIcon({ path: "icons/zscaler-icon-24.png" });
        sendResponse({ response: "Change iconDisable message received" });
    }
});