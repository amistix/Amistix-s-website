function deleteAllCookies() 
{
    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
}

function CheckUser() {
    if (isEmpty(user)) 
    {
        window.setTimeout(CheckUser, 100);
    }
    else
    {    
        document.getElementById('edit-frame').style.display = 'inline';
        document.getElementById('edit-form').action = `/me/setbanner/${user.id}`
        document.body.style.backgroundImage = `url('/static/users/banners/${user.id}.gif')`;

        document.getElementById('user-account-icon').src = `${user.icon}`
        document.getElementById('user-account-name').setAttribute( "data-text", user.name );  
        document.getElementById('user-account-nick').setAttribute( "data-text", user.nick );  
        document.getElementById('user-account-description').setAttribute( "data-text", user.about );  
        document.getElementById('about').value = user.about;
    }
}
