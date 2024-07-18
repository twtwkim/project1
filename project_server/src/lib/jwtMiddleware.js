// JWT 검증, 사용자 정보를 ctx.state.user에 저장

const jwt = require("jsonwebtoken")

const jwtMiddleware = async(ctx, next) =>{
    const token = ctx.cookies.get('access_token')
    if(!token) return next();
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        ctx.state.user = {
            id: decoded._id,
            username: decoded.username,

        }
        const now = Math.floor(Date.now()/1000);
        if(decoded.exp - now < 60*60*24*3.5){ //3.5일?
            const user = await User.findById(decoded._id);
            const token = user.generateToken();
            ctx.cookies.set('access_token', token, {
                maxAge: 1000*60*60*24*7,  // 7일
                httpOnly: true,
            })
        }
        return next();
    }catch(e){
        return next();
    }
}

module.exports = jwtMiddleware;