const ee = require('@nauma/eventemitter');
const DATABASE = new ee.EventEmitter('database');

const db = require('./index');


DATABASE.on('add/products', async response => {
  const { name, price, picture } = response.data;

  const product = await db
    .add('products', {
      name,
      price,
      picture,
    });

  response.reply(product);
});

DATABASE.on('add/skills', async response => {
  const { age, concerts, cities, years } = response.data;

  const skill = await db
    .add('skills', {
      age,
      concerts,
      cities,
      years,
    });
  
  response.reply(skill);
});

DATABASE.on('add/messages', async response => {
  const { name, email, message } = response.data;

  const newMessage = await db
    .add('messages', {
      name,
      email,
      message
    });
  
  response.reply(newMessage);
});

DATABASE.on('findAdmin', async response => {
  const admin = await db.findRecord('users', 'isAdmin', true);

  response.reply(admin);
});

module.exports = DATABASE;