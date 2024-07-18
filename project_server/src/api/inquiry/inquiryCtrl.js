// 포스트 컨트롤러로 포스트 CRUD 기능을 구현
const Inquiry = require('../../modules/inquiry');
const mongoose = require("mongoose");
const Joi = require("joi");
const fs = require('fs');
const path = require('path');
const util = require('util');


// 포스트 작성
exports.inquiryStore = async(ctx, next)=>{
    const schema = Joi.object().keys({
        InquiryName: Joi.string().required(),
        InquiryTel: Joi.string().required(),
        InquiryEmail: Joi.string().required(),
        InquiryTitle: Joi.string().required(),
        InquiryContent: Joi.string().required(),
    })
    const result = schema.validate(ctx.request.body) // 프론트에서 오브젝트를 던지면 받을 글러브를 만든다.
    if(result.error){
        ctx.status = 400; // Bad Request
        ctx.body = result.error
        return;
    }
    const {InquiryName, InquiryTel, InquiryEmail, InquiryTitle, InquiryContent} = ctx.request.body;

    // postCollection
    const inquiry = new Inquiry({
        InquiryName,
        InquiryTel,
        InquiryEmail,
        InquiryTitle,
        InquiryContent,
        inquiry: ctx.state.inquiry,
    })
    try{
        await inquiry.save() // 몽고db 명령어
        ctx.body = inquiry;
    }catch(e){
        ctx.throw(500, e)
    }
}

