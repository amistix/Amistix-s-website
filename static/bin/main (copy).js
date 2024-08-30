var socket = io();
let user = {};

//Load user data
window.onload = () => {
  if (document.cookie.includes('access_token') & document.cookie.includes('token_type'))
  {
    let [accessToken, tokenType] = [document.cookie.split('; ')[0].split('=')[1], document.cookie.split('; ')[1].split('=')[1]]
    if (accessToken !='' & accessToken !='null' & tokenType !='' & tokenType !='null')
    {
        //Make response
        fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${tokenType} ${accessToken}`
            }
        })
        .then(result => result.json())
        .then(response => {
    
          //Set user data
          console.log(response);
          socket.emit('update_profile', response);
          socket.emit('get_user', response);
          fetch("/api/user", {
                 headers: {
                     authorization: response.id
                 }
          })

          document.getElementById('user-nick').setAttribute( "data-text", `${response.global_name}` );    
          document.getElementById('user-name').setAttribute( "data-text", `${response.username}` );    
          document.getElementById('user-avatar').style.display = 'inline';
          
          if (response.avatar != null)
          {
            document.getElementById('user-avatar').src = `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.jpg`;
          }
          else
          {
            document.getElementById('user-avatar').src = `https://cdn.discordapp.com/embed/avatars/0.png`;
          }
          document.getElementById("discord-login-button").remove();
          document.getElementById('user-frame').style.display = 'inline';
          
          document.getElementById('banner-color').textContent = `${response.banner_color}`;
          document.getElementById('user-id').textContent = `${response.id}`;

          let user_nick_width = document.getElementById('user-nick').getBoundingClientRect().width;
          let user_name_width = document.getElementById('user-name').getBoundingClientRect().width;

          document.getElementById('user-frame').style.width = `${Math.max(user_nick_width, user_name_width) + 120}px`;     
        })
    
        //Errors
        .catch(console.error);
      }
    else
    {
      document.getElementById('user-name').style.display = 'none';
      
      setTimeout(function(){
        document.getElementById('loader').classList.add('done');
      }, 400)
    }
  }
  else
  {
    setTimeout(function(){
      document.getElementById('loader').classList.add('done');
    }, 400)
  }
};

socket.on('user_data_to_load', function(db_user){
  user = db_user;
  setTimeout(function(){
    document.getElementById('loader').classList.add('done');
  }, 400)
})

//Page's title changing
let title = document.title;
window.addEventListener( 'blur', () => {
  document.title = "You've just got AFK";
})
window.addEventListener( 'focus', () => {
  document.title = title;
})

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}