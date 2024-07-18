// MongoDB 스키마 정의 및 모델 생성

const { defaultMaxListeners } = require("koa");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
    title: String,
    body: String,
    
    tags: [String],
    
    publishDate:{ //데이터베이스에는 날짜가 필요해!
        type: Date,
        default: Date.now,
    },
    user: {
        id: mongoose.Types.ObjectId,
        username: String,
    }
})

const Post = mongoose.model("Post", PostSchema, "postCollection") //studio 3t에  collection 밑으로 들어간다.

module.exports = Post;
// 또는 그냥 export.post로 한줄로 끝