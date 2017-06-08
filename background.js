var password = "";

function handleAPICall(requestDetails) {
  console.log("[ATC]\n" + requestDetails.url);
  if(requestDetails.method == "POST"){
	  newPassword = requestDetails.requestBody.formData.password;
	  if(newPassword !== password){ //TODO: should probably only send it once as it won't change
		password = newPassword; 
		
		browser.tabs.query({
			currentWindow: true,
			active: true
		}).then(sendPassword).catch(onError);
	  }  
  }
}

browser.webRequest.onBeforeRequest.addListener(
  handleAPICall,
  {urls: ["*://*.cb-live.synapse-games.com/api.php*"]},
  ['requestBody']
);

function sendPassword(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {password: password}
    );
  }
}

function onError(error) {
  console.error(`[ATC] Error: ${error}`);
}