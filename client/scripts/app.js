var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.friends = [];
app.lastCall = '';

app.init = function() {
  app.fetch();
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: 'order=-createdAt',
    success: function(data) {
      app.addMessage(data.results);
    },
    error: function(data) { console.log(data); }
  });
};

app.addMessage = function(messages) {
  var str = '';

  messages.forEach(function(message) {
    str +=
    '<li><a class="username">'+ xssFilters.inHTMLData(message.username) +
    '</a><p>' + xssFilters.inHTMLData(message.text) + '</p></li>';
  });

  $('#chats').prepend(str);
};

app.handleSubmit = function(message) {
  app.send(message);
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(message),
    success: function(resp) {
      app.addMessage(message);
    },
    error: function(data) { console.log(data); }
  });
};


app.clearMessages = function() {
  $('#chats').html('');
};

app.addRoom = function(room) {
  $('#roomSelect').append('<li>' + room + '</li>');
};

app.addFriend = function(friend) {
  app.friends.push(friend);
};

$(function() {
  app.init();

  $('#chats').on('click', '.username', function() {
    app.addFriend($(this).val());
  });

  $('#send').on('click', '.submit', function(e) {
    e.preventDefault();

    var message = {
      'username': xssFilters.inHTMLData(getParameterByName('username')),
      'text': $('#message').val(),
      'roomname': 'bar'
    };

    app.handleSubmit([message]);
  });

  setInterval(function(){}, 5000)
});


//HELPER ZONE//
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
