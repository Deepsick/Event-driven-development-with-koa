const { join } = require('path');

const Router = require('koa-router');

const controllerPath = join(__dirname, '..' , 'controllers', 'index');
const indexController = require(controllerPath);

const router = new Router();

router.get('/', async (ctx, next) => {
  const message = await indexController.emit('get', ctx);
  await ctx.render('index', {
    msgsemail: message,
  });
});

router.post('/', async (ctx, next) => {
  await indexController.emit('post', ctx);
  await ctx.redirect('/');
});

module.exports = router;