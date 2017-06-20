const SCRIPT_TAG = "[ATC-c]\n";

//Injecting a script in the page itself
/*var s = document.createElement('script');
s.src = browser.extension.getURL('monkeyRequests.js');
s.onload = function (){
    this.remove();
};
(document.head || document.documentElement).appendChild(s);*/


document.getElementById('floating_game_holder').scrollIntoView(); //scroll the page to get to the game zone
const chatWidth = document.getElementById('chat_container_cell').offsetWidth;
const totalWidth = document.body.offsetWidth;

document.documentElement.style.height = '100%';
document.body.style.height = '100%';
document.documentElement.style.width = '100%';
document.body.style.width = '100%';

const div = document.createElement('div');
document.body.appendChild(div);
div.id = 'atcDiv';
div.style.position = 'fixed';
div.style.top = '0';
div.style.left = 100 * (totalWidth - chatWidth) / totalWidth + '%'; //basically on top of the chat
div.style.width = (100 * chatWidth / totalWidth) + '%';
div.style.height = '100%';
div.style.backgroundColor = 'rgb(129,2,66)';
div.style.textAlign = 'center';

const pwContent = document.createElement('input');
pwContent.id = 'pwkey';
pwContent.setAttribute("type", "hidden");
div.appendChild(pwContent);

const btn = document.createElement('button'); //TODO: should probably only appear when the password has been extracted
btn.type = 'button';
btn.innerHTML = 'Copy password key';
div.appendChild(btn);


btn.addEventListener("click", () => {
    const copyText = document.querySelector("#pwkey");
    copyText.removeAttribute("type"); //apparently necessary bs as you can only copy DOM elements to the clipboard
    copyText.select();
    document.execCommand("copy");
    pwContent.setAttribute("type", "hidden");
});

browser.runtime.onMessage.addListener(request => {
    pwContent.value = request.password;
    return Promise.resolve({response: ""});
});