/*
 * Content script for GitPaid.me - a Chrome extension for GitHub which 
 * helps crowdsource solutions to repository issues 
 *
 * @author Vuk Petrovic
 * Built for HackNY with love! 
*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var issueData = JSON.parse(request);
	var total = 0; var sponsors = "Be the first to fund this GitHub issue!"; 

	if(issueData.exists === "true") {
		sendResponse("Updating UI");
		total = issueData.total;
		sponsors = issueData.sponsorList;
	} 

	//DOM div in which we want to inject HTML
	var insert = document.getElementsByClassName('discussion-timeline js-quote-selection-container');
	insert = insert[0];

	//wrapper for the whole GUI
	var wrapper = document.createElement("div");
	wrapper.id = "appWrapper";

	//request and fund buttons + description
	var leftWrapper = document.createElement("div");
	leftWrapper.id = "leftWrapper";
	leftWrapper.className = "gitPaidWrapper";
	wrapper.appendChild(leftWrapper);

	//fund button 
	var fundWrapper = document.createElement("div");
	var fundTextContainer = document.createElement("h3");
	var fundText = document.createTextNode("Fund this Issue");

	fundWrapper.id = "fundButton";
	fundWrapper.className = "gitPaidButton";
	fundTextContainer.id = "fundLabel";
	fundTextContainer.className = "gitPaidButtonLabel";

	leftWrapper.appendChild(fundWrapper);
	fundWrapper.appendChild(fundTextContainer);
	fundTextContainer.appendChild(fundText);

	//request button
	var requestWrapper = document.createElement("div");
	var requestTextContainer = document.createElement("h3");
	var requestText = document.createTextNode("Request Issue Key");

	requestWrapper.id = "requestButton";
	requestWrapper.className = "gitPaidButton";
	requestTextContainer.id = "requestLabel";
	requestTextContainer.className = "gitPaidButtonLabel";

	leftWrapper.appendChild(requestWrapper);
	requestWrapper.appendChild(requestTextContainer);
	requestTextContainer.appendChild(requestText);

	//description
	var descWrapper = document.createElement("div");
	var descTextContainer = document.createElement("h4");
	var descText = document.createTextNode("Check us out on the web!");

	descWrapper.id = "descArea";
	descTextContainer.id = "descriptionText";

	leftWrapper.appendChild(descWrapper);
	descWrapper.appendChild(descTextContainer);
	descTextContainer.appendChild(descText);

	//total bounty, sponsor list
	var rightWrapper = document.createElement("div");
	rightWrapper.id = "rightWrapper";
	rightWrapper.className = "gitPaidWrapper";
	wrapper.appendChild(rightWrapper);

	//actually generates the UI
	insert.appendChild(wrapper);

	sendResponse("Creating default UI");
});
