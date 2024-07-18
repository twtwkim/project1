// 로그인 여부 확인하는 미들웨어

const checkLoggedIn = (ctx, next) =>{
    if(!ctx.state.user){
        ctx.status = 401;  // Unauthorized
        return;
    }
    return next();
}

module.exports = checkLoggedIn;