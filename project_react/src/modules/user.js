import { handleActions } from "redux-actions";
import * as api from "./api/auth"
import { finish_loading, start_loading } from "./loading";

const CHECK_LOADING = 'checkloading';
const CHECK_SUCCESS = 'user/CHECK_SUCCESS';
const CHECK_FAILED = 'user/CHECK_FAILED';
const SET_USER = 'user/SET_USER';
const LOGOUT = 'user/LOGOUT';

const KAKAO_LOGIN_SUCCESS = 'auth/KAKAO_LOGIN_SUCCESS';


export const set_user = (user) => ({type: SET_USER, user});

function check_out(){
    try {
        localStorage.removeItem('user');
    } catch (error) {
        console.log("localStorage is not available")
    }
}

export const check = () => async dispatch =>{
    start_loading(CHECK_LOADING)
    try {
        const response = await api.check();
        dispatch({type: CHECK_SUCCESS, payload:response.data});
    } catch (error) {
        dispatch({type: CHECK_FAILED, payload:error});
        check_out();
    }finally{
        finish_loading(CHECK_FAILED);
    }
}

export const logout = () => async dispatch =>{
    try {
        const response = await api.logout();
        localStorage.removeItem('user');
        localStorage.removeItem('kakaouser');
        dispatch({type: LOGOUT, payload:response.data});
    } catch (error) {
        console.log(error);
        check_out();
    }
}

const initialState = {
    user: null,
    checkError: null,
}

const user = handleActions({
    [SET_USER]: (state, {user})=>({
        ...state,
        user,
        checkError: null
    }),
    [CHECK_SUCCESS]: (state, {payload:user}) => ({
        ...state,
        user,
        checkError: null
    }),
    [CHECK_FAILED]: (state, {payload:checkError}) =>({
        ...state,
        user:null,
        checkError
    }),
    [LOGOUT]: (state) => ({
        ...state,
        user: null,
        checkError: null
    }),
    [KAKAO_LOGIN_SUCCESS]: (state, { payload: kakaouser }) => ({
        ...state,
        user: { ...state.user, ...kakaouser }, // 기존 user 정보에 kakaouser를 병합
    }),
}, initialState)





export default user;