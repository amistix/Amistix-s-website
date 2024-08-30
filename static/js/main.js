var socket = io();
let defaultTitleOnFocus = document.title;
let defaultTitleOnBlur = "You've just got AFK";

let isBlur = false;
let missedMessages = 0;

window.addEventListener( 'blur', () => {
  document.title = defaultTitleOnBlur;
  isBlur = true;
});
window.addEventListener( 'focus', () => {
  document.title = defaultTitleOnFocus;
  missedMessages = 0;
  isBlur = false;
});

function isNotEmpty(obj) 
{
  return Object.keys(obj).length !== 0;
}

function getCookie()
{ 
  let documentCookie = document.cookie.split('; ');
  let cookies = {};
  for (let i = 0; i < documentCookie.length; i++)
  {
    let cookie = documentCookie[i].split('=');
    cookies[cookie[0]] = cookie[1];
  }
  return cookies;
}

function checkCookieValidity()
{
  if (document.cookie.includes('access_token') & document.cookie.includes('token_type'))
  {
    let accessToken = getCookie().access_token;
    let tokenType = getCookie().token_type;
    if (accessToken !='' & accessToken !='null' & tokenType !='' & tokenType !='null')
    {
      return true;
    }
  }
  return false;
}

function createElement(type) 
{
  const elem = document.createElement(type);
  return {
    baseElement: elem,
    css: function(key, value) {
      this.baseElement.style[key] = value;
      return this;
    },
    attr: function(key, value) {
      this.baseElement.setAttribute(key, value);
      return this;
    },
    textContent: function(value) {
      this.baseElement.textContent = value;
      return this;
    },
    toDOM: function() {
      return this.baseElement;
    }
  };
}

async function waitTilTrue(test) 
{
  const delayMs = 100;
  while(!test()) await new Promise(resolve => setTimeout(resolve, delayMs));
}

socket.on('message_to_add', msg => {
  if (isBlur)
  {
    missedMessages++;
    document.title = `New messages: ${missedMessages}`;
  }
});