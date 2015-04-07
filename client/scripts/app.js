
var app={};
app.set = false;
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.init = function() {

  $('.username').on('click',function(){
    app.addFriend();
  })


  $('.refresh').on('click',function(){
    app.clearMessages()
    app.fetch()
  })

  if(!app.set) {
    $('#send .submit').one("submit",function(){
      app.handleSubmit();
    })
    app.set = true;
  }
  $('.newMessage').on('click',function(){
    var user = window.location.search.replace("?username=","");
    var room = 'some room';
    var text = $('#message').val();

    var obj = {
      'username': user,
      'text': text,
      'roomname': room
    };

    app.send(obj)
  })
};
app.send = function(message) {
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    //data: 'where={"createdAt":{"$gte":"2015-04-07T02:00:10.236Z"}}',
    data: {order:"-updatedAt", limit:"50"},
    //data: 'where={"username":"Anonymous"}',
    contentType: 'application/json',

    success: function (data) {

    for(var i = 0; i < data.results.length   ; i++){
      var createdAt = data.results[i].createdAt;
      var objectId = data.results[i].objectId;
      var roomname = data.results[i].roomname;

      var text = data.results[i]['text'];
      var updatedAt = data.results[i].updatedAt;
      var username = data.results[i].username

      var $newDiv = $('<div></div>');
      var $username = $('<span></span>').text(username).addClass('username '+username);
      var $message = $('<span></span>').text(": "+text);

      $newDiv.append($username).append($message);


      var $container = $("#chats").append($newDiv);
    }
    $('.username').on('click', function() {
      $("." + $(this).text()).css("font-weight", "bold");
    });

    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }

  })
};

app.addFriend = function(){};
app.clearMessages = function(){
  $('#chats').html('')
}
app.addMessage = function(message){
  $message = $('<div></div>').text(message['username']).addClass('username')
  $($message).appendTo('#chats')
}

app.addRoom = function(roomname){
  $room = $('<div></div>').text(roomname)
  $($room).appendTo('#roomSelect')

}

app.handleSubmit = function(){
  console.log('handleSubmit called')
}

$(document).ready(function() {
  app.init();
});


