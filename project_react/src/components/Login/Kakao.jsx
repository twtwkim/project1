import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginSuccess } from '../../modules/auth';
import { kakaoLoginSuccess } from '../../modules/auth';

const Kakao = () => {
    const code = new URL(window.location.href).searchParams.get('code');
    console.log('Authorization Code:', code);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const res = await axios.post('/api/auth/callback', { code });
                const { token, kakaouser } = res.data;
                window.localStorage.setItem('token', token);
                window.localStorage.setItem('kakaouser', JSON.stringify(kakaouser));  // 사용자 정보를 로컬 스토리지에 저장
                dispatch(kakaoLoginSuccess(kakaouser));
                console.log('User Info:', kakaouser);  // 사용자 정보 출력
                alert('카카오 로그인 성공!');
            } catch (e) {
                console.error(e);
                alert('카카오 로그인 실패?!');
                navigate('/main');
            }
            
        };
        fetchToken();
        navigate('/main');
    }, [code, navigate, dispatch]);

    return (
        <div>
            <div>잠시만 기다려 주세요! 로그인 중입니다.</div>    
        </div>
    );
};

export default Kakao;