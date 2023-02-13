var disableNotification = "disable-notification";
var backlogNotification = "backlog-notification";
var availableNotification = "available-notification";
var offlineNotification = "offline-notification";
var autoQueueEnabledNotification = "autoQueueEnabled-notification";
var autoQueueDisabledNotification = "autoQueueDisabled-notification";
var omniErrorNotification = "omniError-notification";
var selectedsite;

function listenForClicks() {
    document.addEventListener("click", (e) => {

        function setStatus(statusName) {
            switch (statusName) {
                case "Available":
                    return "Available";
                case "Backlog":
                    return "Backlog";
            }
        }

        function pushStatus(tabs) {
            let status = setStatus(e.target.textContent);
            for (var i = 0; i < tabs.length; ++i) {
                if (status === "Backlog") {
                    chrome.tabs.sendMessage(tabs[i].id, {
                        command: "Backlog"
                    });
                } else if (status === "Available") {
                    chrome.tabs.sendMessage(tabs[i].id, {
                        command: "Available"
                    });
                }
            }

        }

        function disableHelper(tabs) {
            for (var i = 0; i < tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, {
                    command: "Disable"
                });
            }
        }

        function reportError(error) {
            console.error(`Could not set Omni-Channel status: ${error}`);
        }

        if (e.target.classList.contains("available")) {
            selectedsite = document.querySelector("#salesforcesite").value;
            if (selectedsite == "government") {
                selectedsite = "*://zscalergov.lightning.force.com/*"
            }
            else {
                selectedsite = "*://zscaler.lightning.force.com/*"
            }
            chrome.tabs.query({
                url: selectedsite
            })
                .then(pushStatus)
                .catch(reportError);
        }
        else if (e.target.classList.contains("backlog")) {
            selectedsite = document.querySelector("#salesforcesite").value;
            if (selectedsite == "government") {
                selectedsite = "*://zscalergov.lightning.force.com/*";
            }
            else {
                selectedsite = "*://zscaler.lightning.force.com/*";
            }
            chrome.tabs.query({
                url: selectedsite
            })
                .then(pushStatus)
                .catch(reportError);
        }
        else if (e.target.classList.contains("disable")) {
            selectedsite = document.querySelector("#salesforcesite").value;
            if (selectedsite == "government") {
                selectedsite = "*://zscalergov.lightning.force.com/*";
            }
            else {
                selectedsite = "*://zscaler.lightning.force.com/*";
            }
            chrome.tabs.query({
                url: selectedsite
            })
                .then(disableHelper)
                .catch(reportError);
        }

    });

    document.getElementById("queuehours_checkbox").addEventListener('change', function () {
        let queueHoursCheckbox = document.getElementById("queuehours_checkbox");
        var autoQueueBox = document.getElementById("enableQueue_checkbox");
        let statusSection = document.getElementById("status-section");
        let queueSection = document.getElementById("queue-section");
        if (queueHoursCheckbox.checked) {
            queueSection.removeAttribute("hidden");
            statusSection.setAttribute("hidden", "hidden");
        }
        else {
            queueSection.setAttribute("hidden", "hidden");
            statusSection.removeAttribute("hidden");
            if (autoQueueBox.checked) {
                autoQueueBox.click();
            }
        }
    });

    function pushEnableAutoQueue(tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {
                command: "enableAutoQueue"
            });
        }
    }

    function pushDisableAutoQueue(tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {
                command: "disableAutoQueue"
            });
        }
    }

    chrome.storage.sync.get({
        savedEnableQueueCheckbox: true
    }, function (items) {
        if (items.savedEnableQueueCheckbox === true) {
            selectedsite = document.querySelector("#salesforcesite").value;
            if (selectedsite == "government") {
                selectedsite = "*://zscalergov.lightning.force.com/*";
            }
            else {
                selectedsite = "*://zscaler.lightning.force.com/*";
            }
            chrome.tabs.query({
                url: selectedsite
            })
                .then(pushEnableAutoQueue)
        }
    });

    document.getElementById("enableQueue_checkbox").addEventListener('change', function () {
        var enableAutoQueue = document.getElementById("enableQueue_checkbox");
        if (enableAutoQueue.checked) {
            selectedsite = document.querySelector("#salesforcesite").value;
            if (selectedsite == "government") {
                selectedsite = "*://zscalergov.lightning.force.com/*";
            }
            else {
                selectedsite = "*://zscaler.lightning.force.com/*";
            }
            chrome.tabs.query({
                url: selectedsite
            })
                .then(pushEnableAutoQueue)
        }
        else {
            selectedsite = document.querySelector("#salesforcesite").value;
            if (selectedsite == "government") {
                selectedsite = "*://zscalergov.lightning.force.com/*";
            }
            else {
                selectedsite = "*://zscaler.lightning.force.com/*";
            }
            chrome.tabs.query({
                url: selectedsite
            })
                .then(pushDisableAutoQueue)
        }
    });
}

function save_options() {
    var salesforceSite = document.getElementById('salesforcesite').value;
    var queueCheckbox = document.getElementById('queuehours_checkbox').checked;
    var startshift = document.getElementById("startshift").value;
    var endshift = document.getElementById("endshift").value;
    var firstshiftstart = document.getElementById("firstshiftstart").value;
    var firstshiftend = document.getElementById("firstshiftend").value;
    var secondshiftstart = document.getElementById("secondshiftstart").value;
    var secondshiftend = document.getElementById("secondshiftend").value;
    var enableQueueCheckbox = document.getElementById('enableQueue_checkbox').checked;
    chrome.storage.sync.set({
        savedSite: salesforceSite,
        savedCheckbox: queueCheckbox,
        savedStartShift: startshift,
        savedEndShift: endshift,
        savedFirstShiftStart: firstshiftstart,
        savedFirstShiftEnd: firstshiftend,
        savedSecondShiftStart: secondshiftstart,
        savedSecondShiftEnd: secondshiftend,
        savedEnableQueueCheckbox: enableQueueCheckbox,
    }, function () {
        var status = document.getElementById('saveStatus');
        status.textContent = "Settings have been saved";
        setTimeout(function () {
            status.textContent = "";
        }, 2000);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        savedSite: "government",
        savedCheckbox: true,
        savedStartShift: "08:00 PM",
        savedEndShift: "08:00 PM",
        savedFirstShiftStart: "08:00 PM",
        savedFirstShiftEnd: "08:00 PM",
        savedSecondShiftStart: "08:00 PM",
        savedSecondShiftEnd: "08:00 PM",
        savedEnableQueueCheckbox: true
    }, function (items) {
        document.getElementById('salesforcesite').value = items.savedSite;
        document.getElementById('queuehours_checkbox').checked = items.savedCheckbox;
        document.getElementById("startshift").value = items.savedStartShift;
        document.getElementById("endshift").value = items.savedEndShift;
        document.getElementById("firstshiftstart").value = items.savedFirstShiftStart;
        document.getElementById("firstshiftend").value = items.savedFirstShiftEnd;
        document.getElementById("secondshiftstart").value = items.savedSecondShiftStart;
        document.getElementById("secondshiftend").value = items.savedSecondShiftEnd;
        document.getElementById('enableQueue_checkbox').checked = items.savedEnableQueueCheckbox;
        let statusSection = document.getElementById("status-section");
        let queueSection = document.getElementById("queue-section");
        if (items.savedCheckbox === true) {
            queueSection.removeAttribute("hidden");
            statusSection.setAttribute("hidden", "hidden");
        }
        else {
            queueSection.setAttribute("hidden", "hidden");
            statusSection.removeAttribute("hidden");
            document.getElementById("enableQueue_checkbox").checked = false;
        }
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "disableNotification") {
        chrome.notifications.create(disableNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("/icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Status Helper has been disabled"
        });
        sendResponse({ response: "Disable message received" });
    }
    else if (request.message === "backlogNotification") {
        chrome.notifications.create(backlogNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("/icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Your status has been updated to: Backlog"
        });
        sendResponse({ response: "Backlog message received" });
    }
    else if (request.message === "availableNotification") {
        chrome.notifications.create(availableNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("/icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Your status has been updated to: Available"
        });
        sendResponse({ response: "Available message received" });
    }
    else if (request.message === "offlineNotification") {
        chrome.notifications.create(offlineNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("/icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Your status has been updated to: Offline"
        });
        sendResponse({ response: "Offline message received" });
    }
    else if (request.message === "autoQueueEnabled") {
        chrome.notifications.create(autoQueueEnabledNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("/icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Automated Queue has been enabled"
        });
        sendResponse({ response: "autoQueueEnable message received" });
    }
    else if (request.message === "autoQueueDisabled") {
        chrome.notifications.create(autoQueueDisabledNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("/icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Automated Queue has been disabled"
        });
        sendResponse({ response: "autoQueueDisabled message received" });
    }
    if (request.message === "omniErrorState") {
        chrome.notifications.create(omniErrorNotification, {
            type: "basic",
            iconUrl: chrome.runtime.getURL("/icons/zscaler-icon-96.png"),
            title: "Salesforce Status Helper",
            message: "Omni-Channel is in a error state. Refresh the page to correct this issue."
        });
        chrome.action.setIcon({ path: "/icons/zscaler-icon-24-Error.png" });
    }
    else if (request.message === "changeIconEnable") {
        chrome.action.setIcon({ path: "/icons/zscaler-icon-24-running.png" });
        sendResponse({ response: "Change iconEnable message received" });
    }
    else if (request.message === "changeIconDefault") {
        chrome.action.setIcon({ path: "/icons/zscaler-icon-24.png" });
        sendResponse({ response: "Change iconDisable message received" });
    }
});

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("saveSettingsButton").addEventListener('click',
    save_options);
window.onload = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var currTabID = tabs[0].id;
        var currTabURL = tabs[0].url;
        if (currTabURL == undefined) {
            currTabURL = "blank";
        }
        if (currTabURL.includes("zscalergov.lightning.force.com" || "zscaler.lightning.force.com")) {
            chrome.scripting.executeScript({
                target: { tabId: currTabID },
                files: ["/content_scripts/change_status.js"]
            });
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.message === "allVariablesLoaded") {
                    listenForClicks();
                    sendResponse({ response: "allVariablesLoaded message received" });
                }
            });
        }
    });
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
                files: ["/content_scripts/change_status.js"]
            });
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.message === "allVariablesLoaded") {
                    listenForClicks();
                    sendResponse({ response: "allVariablesLoaded message received" });
                }
            });
        }
    });
});