const REST_API_KEY = "9b7f802008f3c0eb4e70bb5e0b6a035b";
const REDIRECT_URI = "http://localhost:5173/auth/kakao/callback";

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;