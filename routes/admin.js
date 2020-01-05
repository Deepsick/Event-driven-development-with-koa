const { join } = require('path');

const Router = require('koa-router');
const multer = require('@koa/multer');

const upload = multer();

const controllerPath = join(__dirname, '..' , 'controllers', 'admin');
const adminController = require(controllerPath);

const router = new Router();

router.get('/admin', async (ctx, next) => {
  const { productMessage, skillsMessage } = await adminController.emit('get', ctx);
  await ctx.render('admin', {
    msgfile: productMessage,
    msgskill: skillsMessage,
  });
});

router.post('/admin/upload', upload.single('photo'), async (ctx, next) => {
  await adminController.emit('postProduct', ctx);
  await ctx.redirect('/admin');
});

router.post('/admin/skills', async (ctx, next) => {
  await adminController.emit('postSkills', ctx);
  await ctx.redirect('/admin');
});

module.exports = router;