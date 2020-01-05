const { join } = require('path');

const Router = require('koa-router');

const controllerPath = join(__dirname, '..' , 'controllers', 'login');
const loginController = require(controllerPath);

const router = new Router();

router.get('/login', async (ctx, next) => {
  const message = await loginController.emit('get', ctx);
  await ctx.render('login', {
    msglogin: message,
  });
});

router.post('/login', async (ctx, next) => {
  const isAdmin = await loginController.emit('post', ctx);
  if (isAdmin) {
    return await ctx.redirect('/admin');
  }
  await ctx.redirect('/login');
});

module.exports = router;