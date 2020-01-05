const { join } = require('path');

const combineRouters = require('koa-combine-routers');

const adminRouter = require(join(__dirname, 'admin'));
const loginRouter = require(join(__dirname, 'login'));
const indexPageRouter = require(join(__dirname, 'indexPage'));

const router = combineRouters(indexPageRouter, loginRouter, adminRouter);

module.exports = router;