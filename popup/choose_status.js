var disableNotification = "disable-notification"
var backlogNotification = "backlog-notification"
var availableNotification = "available-notification"


function listenForClicks() {
	document.addEventListener("click", (e) => {

		/**
		* Replace Omni status with what's selected.
		*/
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
			chrome.tabs.query({})
				.then(pushStatus)
				.catch(reportError);
		}
		else if (e.target.classList.contains("backlog")) {
			chrome.tabs.query({})
				.then(pushStatus)
				.catch(reportError);
		}
		else if (e.target.classList.contains("disable")) {
			chrome.tabs.query({})
				.then(disableHelper)
				.catch(reportError);
		}

	});
}

listenForClicks();

chrome.runtime.onMessage.addListener((message) => {
	if (message.command === "disableNotification") {
		chrome.notifications.create(disableNotification,{
			type: "basic",
			title: "Salesforce Status Helper",
			message: "Status Helper has been disabled"
		});
	}
	else if (message.command === "backlogNotification") {
		chrome.notifications.create(backlogNotification,{
			type: "basic",
			title: "Salesforce Status Helper",
			message: "Your status has been updated to: Backlog"
		});
	}
	else if (message.command === "availableNotification") {
		chrome.notifications.create(availableNotification,{
			type: "basic",
			title: "Salesforce Status Helper",
			message: "Your status has been updated to: Available"
		});
	}
});