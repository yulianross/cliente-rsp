const fbgraph = require('fbgraph');
const socket = require('socket.io-client')('https://urlwebhook.herokuapp.com');
const token = 'EAAbLgWaRp9EBAJsEhiDD9kzBvW5LSWEq5dYc9czMWu7BnBBKyEsZB2REw9qEXJnNKQkyu0J2E8umaQejZCduinZAZBZA4cKYXfxOqk6sI6RSiq5pjLZC6ZBCjqoyEbZA0EEaRYFNM7tewDp6wFOUyiBbISn66ZBAFAJsZD';
const pageId = '285754835153500';
const params = {
    fields: 'country_page_likes'
};
const likes = 0;
const gpio = require('rpi-gpio');

gpio.setup(8, gpio.DIR_OUT, write);

process.on('SIGINT', function() {
  gpio.write(12, true, function() {
    gpio.destroy(function() {
      process.exit();
    });
  });
});

gpio.setup(12, gpio.DIR_OUT, function() {
  gpio.write(12, true);
});

socket.on('connect', () => {
  console.log('connected to a server');

  socket.on('evento', (msg) => {
    console.log(msg);
  });

  socket.on('success', (msg) => {
    console.log(msg);
  });

  socket.on('failed', (msg) => {
    console.log(msg);
  });

  socket.on('post', (msg) => {
    const field = msg.entry[0].changes[0].value.item || null;
    const params = {
      fields: 'country_page_likes'
    };

    if (field === 'like') {
      fbgraph.setAccessToken(token);
      fbgraph.get(pageId, params, (err, res) => {
        console.log(res);
        if (res !== likes) {
          gpio.write(12, true);
          setTimeout(() => {
            gpio.write(12, false);
          }, 3000);
        }
      });
    }
  });
});
