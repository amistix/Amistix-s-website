let [accessToken, tokenType] = [document.cookie.split('; ')[0].split('=')[1], document.cookie.split('; ')[1].split('=')[1]]
if (accessToken !='' & accessToken !='null'  & tokenType !='' & tokenType !='null'){
  document.getElementById('denying-text').remove();
  
  //Create entry for messages
  var Entry = document.createElement('input');
  Entry.setAttribute('id', 'entry');
  Entry.setAttribute('type', 'text');
  //Entry.setAttribute('maxlength', '50');
  Entry.setAttribute('placeholder', 'Your message');
  
  document.getElementById('main').appendChild(Entry);
  
  //Create function for sending messages
  Entry.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      if (Entry.value != ''){
        socket.emit('message', {mess: Entry.value, user_obj: user, color:  document.getElementById('banner-color').textContent});
        Entry.value = ''
      }
    }
  });
}


function ShowMessage(name, mess, color){
  var Message = document.createElement('div');
  Message.setAttribute('class', 'message');
  Message.style.background = color;

  // Create elements for user and message
  var userSpan = document.createElement('span');
  userSpan.setAttribute('class', 'user');
  userSpan.textContent = name;

  var messageSpan = document.createElement('span');
  messageSpan.setAttribute('class', 'mess');
  messageSpan.textContent = `: ${mess}`;

  // Append user and message to the Message div
  Message.appendChild(userSpan);
  Message.appendChild(messageSpan);

  //Save scrollbar pos
  let current_scroll_pos = document.getElementById('message-box').scrollTop / (document.getElementById('message-box').scrollHeight - document.getElementById('message-box').clientHeight);

  document.getElementById('message-box').appendChild(Message);

  //Move down if expected
  if (current_scroll_pos >= 0.9)
  {
    document.getElementById('message-box').scrollTo(1, document.getElementById('message-box').scrollHeight);
  }

}

//Message adding
socket.on('message_to_add', msg => {
  ShowMessage(msg.user_obj.name, msg.mess ,msg.color);
});