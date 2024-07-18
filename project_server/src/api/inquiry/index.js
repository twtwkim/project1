const Router = require("koa-router");
const inquiryCtrl = require("./inquiryCtrl");

const inquiry = new Router();

inquiry.post('/', inquiryCtrl.inquiryStore);

module.exports = inquiry;