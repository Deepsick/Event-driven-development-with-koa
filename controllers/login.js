const { join } = require('path');

const ee = require('@nauma/eventemitter');
const loginController = new ee.EventEmitter('loginController');

const DATABASE = require(join(__dirname, '..', 'db', 'DATABASE'));

loginController.on('get', response => {
  const message = response.data.flash('status')[0];

  response.reply(message);
});

loginController.on('post', async response => {
  const { data } = response;
  const { email, password } = data.request.body;
  let isAdmin = false;
  if (!email && !password) {
    data.flash('status', 'Login error');
  }

  const admin = await DATABASE.emit('findAdmin');

  if (email === admin.email && password === admin.password) {
    isAdmin = true;
  }
  data.flash('status', `You are not an admin!`);

  response.reply(isAdmin);
});
const post = async (ctx, next) => {

  if (!email && !password) {
    ctx.flash('status', 'Login error');
    return ctx.redirect('/login');
  }

  const admin = await db
    .findRecord('users', 'isAdmin', true);

  if (email === admin.email && password === admin.password) {
    return ctx.redirect('/admin');
  }

  ctx.flash('status', `You are not an admin!`);
  ctx.redirect('/login');
};

module.exports = loginController;