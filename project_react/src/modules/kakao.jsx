const REST_API_KEY = "8f8c507f3b528ca7f84239767fe9e0d6";
const REDIRECT_URI = "http://localhost:5173/main";

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;