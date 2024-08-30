var socket = io();
var user = {};

window.onload = LoadUser;

async function LoadUser()  
{
  if (checkCookieValidity())
  {

    let accessToken = getCookie().access_token;
    let tokenType = getCookie().token_type;

    let result = await fetch('https://discord.com/api/users/@me', {headers: {authorization: `${tokenType} ${accessToken}`}});
    let response = await result.json();

    socket.emit('update_profile', response);

    let dbUser = await fetch("/api/user", { headers: {authorization: response.id}});
    user = await dbUser.json();

    document.getElementById('user-nick').setAttribute( "data-text", `${response.global_name}` );    
    document.getElementById('user-name').setAttribute( "data-text", `${response.username}` );    
    document.getElementById('user-avatar').style.display = 'inline';

    document.getElementById('user-avatar').src = response.avatar 
    ? `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.jpg` 
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

    document.getElementById("discord-login-button").remove();
    document.getElementById('user-frame').style.display = 'inline';

    document.getElementById('banner-color').textContent = `${response.banner_color}`;
    document.getElementById('user-id').textContent = `${response.id}`;

    let user_nick_width = document.getElementById('user-nick').getBoundingClientRect().width;
    let user_name_width = document.getElementById('user-name').getBoundingClientRect().width;

    document.getElementById('user-frame').style.width = `${Math.max(user_nick_width, user_name_width) + 120}px`;   
  }
  else
  {
    document.getElementById('user-name').style.display = 'none';
  }


  setTimeout(function(){
    document.getElementById('loader').classList.add('done');
  }, 400);
}
