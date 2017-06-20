const SCRIPT_TAG = "[ATC-bg]\n";
let password = "";

//Requests handlers to react to API calls (webRequest API)
//This will hopefully be extended with other features
//when a read-access to response bodies will be available (without any hacks)
browser.webRequest.onBeforeRequest.addListener(
    handleAPICall,
    {urls: ["*://*.cb-live.synapse-games.com/api.php*"]},
    ['requestBody']
);

function handleAPICall(requestDetails) {
    console.log(SCRIPT_TAG + requestDetails.url);
    if (requestDetails.method === "POST") {
        const pw = requestDetails.requestBody.formData.password;
        if (password.length <= 0 && !(!pw || 0 === pw.length)) {
            password = pw;
            browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(sendPassword).catch(onError);
        }
    }
}

function onError(error) {
    console.error(`${SCRIPT_TAG} Error: ${error}`);
}


//Messages handlers to communicate with the main (component) script (runtime API)
browser.runtime.onMessage.addListener(handleMessage);

function sendPassword(tabs) {
    for (let tab of tabs) {
        browser.tabs.sendMessage(
            tab.id,
            {password: password}
        );
    }
}

function handleMessage(request, sender, sendResponse) {
    if (request.type === "pwrequest") {
        sendResponse({password: password});
    }
}