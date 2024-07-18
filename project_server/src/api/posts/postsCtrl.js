// 포스트 컨트롤러로 포스트 CRUD 기능을 구현
const Post = require('../../modules/post');
const mongoose = require("mongoose");
const {ObjectId} = mongoose.Types;
const Joi = require("joi");
const fs = require('fs');
const path = require('path');
const util = require('util');
const axios = require('axios');


exports.checkOwnPost = async(ctx, next) =>{
    const {user, post} = ctx.state;
    // console.log(post._id.toString())
    // console.log(user.id)
    if(post.user.id.toString() !== user.id){
        ctx.status = 403; // Forbidden
        return;
    }
    return next();
}

exports.getPostById = async(ctx, next)=>{
    const {id} = ctx.params;
    if(!ObjectId.isValid(id)) {  // 아이디 형태를 검증
        ctx.status = 400; // Bad Request
        return;
    }
    try {
        const post = await Post.findById(id);
        if(!post){  // 아이디가 없다는 것
            ctx.status = 404; //Not Found
            return;
        }
        ctx.state.post = post;
        return next()
    }catch(e){
        ctx.throw(500, 3)
    }
}

// 이미지 업로드
exports.uploadImage = async (ctx) => {
    const { file } = ctx.request;
    if (!file) {
        ctx.status = 400;
        ctx.body = { message: 'No file uploaded' };
        return;
    }
    const IMG_URL = `http://localhost:4000/uploads/${file.filename}`;
    ctx.body = { url: IMG_URL };
    console.log(IMG_URL);
};

// 결제관련
exports.verifyIamport = async (ctx) => {
    const getIamportAccessToken = async () => {
        try {
        const response = await axios.post('https://api.iamport.kr/users/getToken', {
            imp_key: '3463103775655131',
            imp_secret: 'lEcokYaRkv6WGFXXWwjxs2hFE0PAzxPt9TjZhX36NgA7zoiRBBhJuJAR0HpEfPj95V6Fnfk1kBHMJ96V',
        }, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
        return response.data.response.access_token;
        } catch (error) {
        console.error('Error getting Iamport access token:', error.response ? error.response.data : error.message);
        throw error;
        }
    };
    const {imp_uid} = ctx.params;
    console.log('imp_uid:', imp_uid)
    try {
        const accessToken = await getIamportAccessToken();
        console.log('Access token:', accessToken)
        const response = await axios.get(`https://api.iamport.kr/payments/${imp_uid}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        ctx.body = response.data;
    } catch (error) {
        console.error('Error verifying payment : ', error)
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error', error: error.response ? error.response.data : error.message };
    }
};

// 포스트 작성
exports.write = async(ctx, next)=>{
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(),
        
    })
    const result = schema.validate(ctx.request.body) // 프론트에서 오브젝트를 던지면 받을 글러브를 만든다.
    if(result.error){
        ctx.status = 400; // Bad Request
        ctx.body = result.error
        return;
    }
    const {title, body, tags} = ctx.request.body;

    // postCollection
    const post = new Post({
        title,
        body,
        tags,
        
        user: ctx.state.user,
    })
    try{
        await post.save() // 몽고db 명령어
        ctx.body = post;
    }catch(e){
        ctx.throw(500, e)
    }
}

// 포스트 목록 조회
exports.list = async(ctx, next)=>{
    const page = Number(ctx.query.page || '1')
    if(page<1){
        ctx.status = 400;
        return;
    }
    const {tag, username} = ctx.query;
    const query = {
        ...(username ? {'user.username': username} : {}),//db에 user 밑에 username이 twtw2인 것을 찾는다.
        ...(tag ? {tags: tag} : {})
    } // 이 쿼리를 심게되면 프론트가 쿼리 날려준다/ 그 값을 query에 넣어주면 post에서 찾아서 넘겨준다.
    console.log(query);
    try{ //몽고db 명령어, Post는 postcollection이고 그거 다 가져와! 만약 mysql이면 여기 명령어만 바꾸면 된다.
        const showNum = 5;
        const posts = await Post.find(query)
        .sort({_id: -1}).limit(showNum).skip((page-1)*showNum).lean().exec(); //sort는 정렬, limit는 페이지당 개수 제한, limit쓰면 skip은 꼭 쓴다. skip은 앞에꺼 보여준거 스킵하고 보여줘라. lean은 제이슨 구조인지 확인해라. 아니면 넣지마라. exec는 실행해랑
        const postCnt = await Post.countDocuments(query).exec(); // 전체 카운드를 측정한다.
        ctx.set('last-page', Math.ceil(postCnt/showNum) || 1);
        ctx.body = posts.map(post=>({
            ...post,
            body: post.body.length<200 ? post.body : `${post.body.slice(0, 200)}...`,
        }))
    }catch(e){
        ctx.throw(500, e)
    }
}

// 포스트 조회
exports.read = async(ctx)=>{
    const {id} = ctx.params;
    try{
        const post = await Post.findById(id).exec(); // 몽고 db 명령어
        if(!post){
            ctx.status = 404 // Not Found
            return;
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(500, e)
    }
}

// 포스트 삭제
exports.remove = async(ctx, next)=>{
    const {id} = ctx.params;
    try{
        await Post.findByIdAndDelete(id).exec();// 몽고 db 명령어
        ctx.status=204 // No Comment
    }catch(e){
        ctx.throw(500, e)
    }
}

// 포스트 업데이트
exports.update = async(ctx)=>{
    const {id} = ctx.params;
    const schema = Joi.object().keys(
        {
            title: Joi.string(),
            body: Joi.string(),
            tags: Joi.array().items(Joi.string()),
        }        
    )
    const result = schema.validate(ctx.request.body)
    if(result.error){
        ctx.status=400;
        ctx.body=result.error;
        return;
    }
    try{
        const post = await Post.findByIdAndUpdate(id, ctx.request.body,{
            new:true
        }).exec();
        if(!post){
            ctx.status=404; //Not Found
            return;
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(500, e)
    }
}

