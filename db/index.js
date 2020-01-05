const { join } = require('path');

const Database = require('./db');


const db = new Database(join(__dirname, 'database.json'));
db.setDefaults({
  messages: [],
  skills: [],
  products: [],
  users: [{
    email: 'admin@mail.ru',
    password: 'admin',
    isAdmin: true,
  }],
});

module.exports = db;