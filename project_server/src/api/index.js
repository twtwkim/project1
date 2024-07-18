// 라우터 설정

const Router = require("koa-router");
const posts = require("./posts");
const auth = require("./auth");
const inquiry = require("./inquiry");

const api = new Router();

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());
api.use('/inquiry', inquiry.routes());

module.exports = api;