const Router = require("koa-router");
const authCtrl = require("./authCtrl");

const auth = new Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.post("/logout", authCtrl.logout);
auth.post("/callback", authCtrl.callback);
auth.get('/check', authCtrl.check);


module.exports = auth;