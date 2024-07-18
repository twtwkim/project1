// MongoDB 스키마 정의 및 모델 생성
const { defaultMaxListeners } = require("koa");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const InquirySchema = new Schema({
    InquiryName: String,
    InquiryTel: String,
    InquiryEmail: String,
    InquiryTitle: String,
    InquiryContent: String,
    publishDate:{ //데이터베이스에는 날짜가 필요해!
        type: Date,
        default: Date.now,
    },
})

const Inquiry = mongoose.model("Inquiry", InquirySchema, "inquiryCollection") //studio 3t에  collection 밑으로 들어간다.

module.exports = Inquiry;