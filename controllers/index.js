const { join } = require('path');

const ee = require('@nauma/eventemitter');
const indexController = new ee.EventEmitter('indexController');

const DATABASE = require(join(__dirname, '..', 'db', 'DATABASE'));

indexController.on('get', response => {
  const message = response.data.flash('status')[0];

  response.reply(message);
});

indexController.on('post', async response => {
  const { data } = response;
  const { name, email, message } = data.request.body;
  if (name && email && message) {
    const newMessage = {
      name,
      email,
      message,
    };
    await DATABASE.emit('add/messages', newMessage);

    data.flash('status', 'Message was accepted!');
  } else {
    data.flash('status', 'Message was not accepted!');
  }

  response.reply({});
});

module.exports = indexController;