const { join } = require('path');

const Koa = require('koa');
const serve = require('koa-static');
const KoaBody = require('koa-body');
const Pug = require('koa-pug');
const session = require('koa-session');
var flash = require('koa-connect-flash');

const router = require(join(__dirname, 'routes'));

const app = new Koa();
app.keys = ['some secret key'];
const pug = new Pug({
  viewPath: join(__dirname, 'views', 'pages'),
  basedir: join(__dirname, 'views', 'pages')
});
const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  autoCommit: true, 
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};


app.use(serve(join(__dirname, 'public')));
app.use(KoaBody());
pug.use(app);
app.use(session(CONFIG, app));
app.use(flash());


// app.use('/admin', adminRoutes.routes());
// app.use(indexRoutes.routes());
app.use(router());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
