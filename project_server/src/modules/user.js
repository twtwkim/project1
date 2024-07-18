const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const UserSchema = new Schema({
    username: String,
    hashedPassword: String,
    telNumber: String,
})

UserSchema.methods.setPassword = async function(password){
    const hash = await bcrypt.hash(password, 10); // 암호화 한다.
    this.hashedPassword = hash
}

UserSchema.methods.checkPassword = async function(password){
    const result = await bcrypt.compare(password, this.hashedPassword) // this 는 userschema를 가리킴
    return result; // ok이면 true, not ok 이면 false
};

UserSchema.statics.findByUsername = function(username){
    return this.findOne({username})
}

UserSchema.methods.generateToken = function(){
    const token = jwt.sign(
        {
            _id: this.id, // this는 위에 있는 userschema
            username: this.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
        }
    )
    return token;
}

const User = mongoose.model("User", UserSchema, "userCollection");

module.exports = User;