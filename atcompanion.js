const SCRIPT_TAG = "[ATC-c]\n";

document.getElementById('floating_game_holder').scrollIntoView(); //scroll the page to get to the game zone
const chatWidth = document.getElementById('chat_container_cell').offsetWidth;
const totalWidth = document.body.offsetWidth;

document.documentElement.style.height = '100%';
document.body.style.height = '100%';
document.documentElement.style.width = '100%';
document.body.style.width = '100%';

//a panel that will contain all add-on elements
const container = $("<div id='atcDiv'></div>");
const containerDefaultLeft = totalWidth - chatWidth;
$(container).css({
    "position": "fixed",
    "top": 0,
    "left": containerDefaultLeft, //basically on top of the chat
    "width": chatWidth,
    "height": "100%",
    "background-color": "rgb(129,2,66)",
    "text-align": "center",
});
$("body").append(container);

//a slider button to toggle the container panel
const slider = $("<img src="+ browser.extension.getURL("img/slide-right.png") +" />");
$(slider).css({
    "position": "fixed",
    "top": 0,
    "bottom": 0,
    "margin": "auto",
    "left": containerDefaultLeft - 20,
    "width": 80
});
$("body").append(slider);
//slider interaction
$(slider).click(function (){
    const currentLeft = $(container).css("left");
    console.log(SCRIPT_TAG + parseInt(currentLeft) + " // " + containerDefaultLeft);
    if(parseInt(currentLeft) <= containerDefaultLeft){
        $(container).animate({
            left: '+='+ (chatWidth - 10)
        });
        $(slider).animate({
            left: '+='+ (chatWidth - 50)
        });
        $(slider).attr("src", browser.extension.getURL("img/slide-left.png"));
    }
    else {
        $(container).animate({
            left: '-='+ (chatWidth - 10)
        });
        $(slider).animate({
            left: '-='+ (chatWidth - 50)
        });
        $(slider).attr("src", browser.extension.getURL("img/slide-right.png"));
    }
});

//the hidden input element that will contain the password key
const pwContent = $("<input id='pwkey'/>");
$(pwContent).hide();
$(container).append(pwContent);

//a button to copy the key to the clipboard
const btn = $("<button type='button'>Copy password key</button>");
$(container).append(btn);
$(btn).hide();

$(btn).click(function(){
    $(pwContent).show();
    $(pwContent)[0].select();
    document.execCommand("copy");
    $(pwContent).hide();
});

//a loading image that is displayed until the password key is extracted
const loadingGif = $("<img src="+ browser.extension.getURL("img/loading.gif") +" />");
$(loadingGif).css({
    "width":"100%",
    "position": "absolute",
    "top": 0,
    "bottom": 0,
    "margin": "auto",
    "left": 0
});
$(container).append(loadingGif);

//Messages handlers to communicate with the background script (runtime API)
browser.runtime.onMessage.addListener(request => {
    handleResponse(request);
    return Promise.resolve({response: ""});
});

const sending = browser.runtime.sendMessage({
    type: "pwrequest"
});
sending.then(handleResponse, handleError);

function handleResponse(response) {
    if(response.password !== ""){
        $(pwContent).val(response.password);
        $(btn).show();
        $(loadingGif).remove();
    }
}

function handleError(error) {
  console.log(`Error: ${error}`);
}