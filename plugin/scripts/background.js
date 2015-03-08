
/*
 * Background script for GitPaid.me - a Chrome extension for GitHub which 
 * helps crowdsource solutions to repository issues 
 *
 * @author Vuk Petrovic
 * Built for HackNY with love! 
*/

chrome.webNavigation.onCompleted.addListener(function(details) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		//we want to check to see if the page is a valid GitHub issue page 
		var tabURL = tabs[0].url;
		var tabID = tabs[0].id;
		if(typeof tabURL == "string" && tabURL != null && tabURL.indexOf("github") != -1 && tabURL.indexOf("issues") != -1) {
			/*send the back end a request for data on the current issue 
			  example url: https://api.github.com/repos/Shikkic/findthebus/issues/3*/
			var apiURL = "";
			apiURL = splice(tabURL, "api.", 8);
			apiURL = splice(apiURL, "repos/", 23);

			var sock = new XMLHttpRequest(); 
			sock.onreadystatechange = function() {
				if(sock.readyState === 4 && sock.status === 200) {
					//connection established, call content script
					chrome.tabs.sendMessage(tabID, sock.responseText, function(response) {
						alert("response recieved: " + response);	
					});
				}
			}

			var requestDestination = "https://www.gitpayed.me/api?url=" + apiURL;
			sock.open("GET", requestDestination, true);
			sock.send();
		}
	});
});