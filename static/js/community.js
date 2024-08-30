if (checkCookieValidity())
{
  waitTilTrue(() => isNotEmpty(user))
    .then(() => {
      document.body.style.backgroundImage = `url('/static/users/banners/${user.id}.gif')`
    });
  document.getElementById('denying-text').remove();
  
  var Entry = createElement('input').attr('type', 'text').attr('id', 'entry').attr('placeholder', 'Message').toDOM();
  document.getElementById('main').appendChild(Entry);
  
  Entry.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && Entry.value != '') 
    {
      socket.emit('message', {mess: Entry.value, user_obj: user, color:  document.getElementById('banner-color').textContent});
      Entry.value = ''
    }
  });
}

function getScrollbarPosition(el)
{
  let scrollTop = el.scrollTop;
  let scrollHeight = el.scrollHeight - el.clientHeight;

  return scrollTop / scrollHeight;
}

async function ShowMessage(mess, id)
{
  let scrollbarPos = getScrollbarPosition(document.getElementById('message-box'));
  
  let dbUser = await fetch("/api/user", { headers: {authorization: id}});
  let messageUser = await dbUser.json();
  
  var Message = createElement('li').attr('class', 'message').toDOM();
  
  var messageBody = createElement('div').attr('class', 'message-body').toDOM();

  var userImg = createElement('img').attr('class', 'user-img').attr('src',`${messageUser.icon}`).textContent(name).toDOM();
  var userSpan = createElement('span').attr('class', 'user').attr('onclick',`window.location.href = "/user/${id}";`).textContent(messageUser.name).toDOM();
  var messageSpan = createElement('span').attr('class', 'mess').textContent(`${mess}`).toDOM();

  Message.appendChild(userImg);
  messageBody.appendChild(userSpan);
  messageBody.appendChild(messageSpan);
  Message.appendChild(messageBody);

  document.getElementById('message-box').appendChild(Message);

  if ( scrollbarPos >= 0.9)
  {
    document.getElementById('message-box').scrollTo(0, document.getElementById('message-box').scrollHeight);
  }
}

socket.on('message_to_add', msg => {
  ShowMessage(msg.mess, msg.user_obj.id)
});