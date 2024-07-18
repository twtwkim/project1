require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
// const { default: mongoose } = require('mongoose');
const mongoose = require('mongoose');
const api = require("./api") //파일이름까지는 생략해도된다.(index 생략된거)
const jwtMiddleware = require('./lib/jwtMiddleware');
const serve = require('koa-static');
const path = require('path');
const cors = require('@koa/cors');
const express = require('express');

//환경 파일 가져오기
const {PORT, MONGO_URI} = process.env;

//몽고 DB 연결
mongoose
.connect(MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB!!")
})
.catch((e)=>{
    console.error(e);
})

//Koa 설정
const app = new Koa();

// Express 설정
const expressApp = express();
expressApp.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

//라우터 설정
const router = new Router();
router.use('/api', api.routes())

//미들웨어 사용
app
.use(bodyParser())
.use(jwtMiddleware) // cookies 가져오기
.use(router.routes())
.use(router.allowedMethods())
// .use(serve(path.join(__dirname, '..', 'uploads')))
.use(cors())
.use(async (ctx, next) => {
    await new Promise((resolve) => {
      expressApp.handle(ctx.req, ctx.res, resolve);
    });
    await next();
  });

const port = PORT || 4000 ;
app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})

