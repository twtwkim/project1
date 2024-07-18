const { validate } = require('../../modules/post');
const User = require('../../modules/user');
const Joi = require('joi')
const axios = require('axios');

exports.register = async ctx => {
    const schema = Joi.object().keys({
        username: Joi.string().regex(/^[a-zA-Z0-9!@#$%^*]+$/).min(3).max(20).required(), //최소, 최대 길이
        password: Joi.string().regex(/^[a-zA-Z0-9!@#$%^*]+$/).min(3).max(20).required(),
        telNumber: Joi.string().regex(/^\d{3}-\d{3,4}-\d{4}$/).min(10).max(20).required()
    })
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error.details[0].message;
        return;
    }
    const {username, password, telNumber} = ctx.request.body;
    try {

        // 몽고 DB 명령어
        // User 클래스 정적함수
        const exists = await User.findByUsername(username)        
        if(exists){
            ctx.status = 409 // Conflict
            return;
        }
        // 객체 선언
        const user = new User({
            username,
            telNumber
        })
        // 객체 user 매서드 함수
        await user.setPassword(password)
        await user.save()

        const data = user.toJSON();
        delete data.hashedPassword;
        ctx.body = data; //client(frontend)에게 던져 주는 것(auth)

        // 쿠키 만들기
        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000*60*60*24*7, // 7일
            httpOnly: true, // https를 사용할때는 false로 변경
        })


    } catch (e) {
        throw(500, e)
    }
}

exports.login = async (ctx) => {
    const {username, password} = ctx.request.body;
    if(!username || !password){
        ctx.status = 401 // unauthorized
        return;
    }
    try {
        const user = await User.findByUsername(username);
        if(!user){
            ctx.status = 401; // unauthorized
            return;
        }
        const valid = await user.checkPassword(password);
        if(!valid){
            ctx.status = 401; // unauthorized
            return;
        }
        const data = user.toJSON();
        delete data.hashedPassword;
        ctx.body = data;  //client(frontend)에게 던져 주는 것(auth)


        // 쿠키 만들기(심기)
        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000*60*60*24*7, // 7일
            httpOnly: true, // https를 사용할때는 false로 변경
        })

    } catch (e) {
        throw(500, e)        
    }
}

exports.check = async (ctx) => {
    const {user} = ctx.state;
    if(!user){
        ctx.status = 401; // unauthorized
        return;
    }
    ctx.body = user;
}

exports.logout = async (ctx) => {
    ctx.cookies.set('access_token'); // cookies 삭제
    ctx.status = 204 // No Content
};

exports.callback = async (ctx) => {
    const {code} = ctx.request.body;
    console.log('code : ', code)
    try{
        const tokenResponse = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: '9b7f802008f3c0eb4e70bb5e0b6a035b',
                redirect_uri: "http://localhost:5173/auth/kakao/callback",
                code
            }),
            {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        const accessToken = tokenResponse.data.access_token;

        // 액세스 토큰으로 사용자 정보를 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const userInfo = userResponse.data;
        console.log('token : ', accessToken);
        console.log(userInfo);
        ctx.body = {
            token: accessToken,
            kakaouser: userInfo
        };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { message: '카카오 로그인 실패!'}
    }
}