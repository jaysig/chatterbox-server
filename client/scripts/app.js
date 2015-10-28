var app;
$(document).ready(function() {

//Initialized App
var server1 = 'https://api.parse.com/1/classes/chatterbox'
var server2 = "http://127.0.0.1:3000/classes/chatterbox"
app = {
  server: server2,
  username: window.location.search.substr(10),
  room: 'lobby',
  roomList: ['lobby'],
  friends: {},

  init: function(){
    app.fetch();
    app.$body = $('body');
    app.$body.on('click', '.username', event, app.addFriend);
  },

  send: function(message){
    $.ajax({
      url: server2,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        app.fetch();
        console.log('chatterbox: Message sent. Data: ', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    });
  },

  fetch: function(){
    $.ajax({
      type: 'GET',
      url: server2,
      contentType: 'application/json',
      data: {order: '-createdAt'},
      success: function (data) {
        for (var i = 0; i < data.results.length; i++) {
          if (data.results[i].text !== undefined && data.results[i].text !== '' &&
            data.results[i].username !== undefined) {
            if (data.results[i].roomname === undefined){
              data.results[i].roomname = 'lobby';
            }
            if (app.roomList.indexOf(data.results[i].roomname) < 0) {
                app.addRoom(data.results[i].roomname)
                app.roomList.push(data.results[i].roomname)
            }
            if(data.results[i].roomname === app.room) {
              app.addMessage(data.results[i]);
            }
          }
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    });
  },

  clearMessages: function() {
    $("#chats").html("");
  },

  switchRoom: function(nextRoom){
    app.clearMessages();
    app.room = nextRoom;
    $('.currentRoom').text("Current room: " + nextRoom);
    app.fetch();
  },

  addMessage: function(message) {
    var $chat = $('<div class="chat" />')

    var $username = $('<span class="username" />')
    $username.text(message.username + ": ")
      .attr('data-username', message.username)
      .attr('data-roomname', message.roomname)
      .appendTo($chat);

    var $message = $('<br /><span />');
    $message.text(message.text).appendTo($chat)

    $('#chats').append($chat)

    //$('#chats').append("<div><strong>"+ message.username  + ":</strong></div>")
               //.css('align-text', 'left').append("<div>"+ message.text +"</div>")
               //.addClass(message.roomname);
  },

  addRoom: function(lobby) {
    $('#roomSelect').append("<option>" + lobby + "</option>");
    $('option').last().addClass(lobby);
  },

  addFriend: function(evt) {
    console.log('hello');
    var username = $(evt.currentTarget).attr('data-username');
    if (username !== undefined){
      console.log('chatbox: adding as a friend', username);

      app.friends[username] = true;
    }
  }
}

$( "select" ).change(function() {
  var selection = $( "select option:selected" ).text();
  if (selection === 'New Room') {
    var newRoom = prompt("What would you like to name your room?");
    //set newRoom to app.newRoom.
    app.room = newRoom;
    app.addRoom(newRoom);
    app.switchRoom(newRoom);
  }
  else {
    app.switchRoom(selection);
  }
})
.change();

  $('#details').keypress(function (e) {
    if (e.which == 13) {
      var getMessage = $('#details').val();
      $('#details').val('');
      var newObject = {
        username: app.username,
        text: getMessage,
        roomname: app.room
      }
      app.send(newObject);
    }
  })

  //$('.username').click(function ));

});
//
