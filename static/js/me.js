function logout() 
{
    document.cookie = `access_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `token_type=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    window.location.href = "/author";
}

$("#file").change(function() {
    document.getElementById('upload-file-text').setAttribute( "data-text",  "Image was given!" );  
});

async function CheckUser() 
{    
    await waitTilTrue(() => isNotEmpty(user));
    document.getElementById('edit-frame').style.display = 'inline';
    document.getElementById('edit-form').action = `/me/setbanner/${user.id}`
    document.body.style.backgroundImage = `url('/static/users/banners/${user.id}.gif')`;
        
    document.getElementById('user-account-icon').src = `${user.icon}`
    document.getElementById('user-account-name').setAttribute( "data-text", user.name );  
    document.getElementById('user-account-nick').setAttribute( "data-text", user.nick );  
    document.getElementById('user-account-description').setAttribute( "data-text", user.about );  
    document.getElementById('about').value = user.about;
}

CheckUser();
