import { handleActions } from "redux-actions"
import * as api from "./api/inquiry"
import { start_loading, finish_loading } from "./loading";


const INQUIRY_POST_SUCCESS = 'inquiry/INQUIRY_POST_SUCCESS';
const INQUIRY_POST_FAILURE = 'inquiry/INQUIRY_POST_FAILURE';
const WRITE_LOADING = 'writeLoading';

export const inquiry = (InquiryName, InquiryTel, InquiryEmail, InquiryTitle, InquiryContent) => async dispatch => {
    start_loading(WRITE_LOADING)
    try {
        const response = await api.inquiry(InquiryName, InquiryTel, InquiryEmail, InquiryTitle, InquiryContent);
        console.log(response.data);
        dispatch({type: INQUIRY_POST_SUCCESS, payload: response.data});
    } catch (error) {
        dispatch({type: INQUIRY_POST_FAILURE, payload:error})
    }
    finally{
        finish_loading(WRITE_LOADING)
    }
}

const initialState = {
    InquiryName: '',
    InquiryTel: '',
    InquiryEmail: '',
    InquiryTitle: '',
    InquiryContent: '',
    customer: null,
    customerError: null,    
}

const inquirySave = handleActions({
    [INQUIRY_POST_SUCCESS]: (state, {payload:customer}) => ({
        ...state,
        customer,
        customerError:null
    }),
    [INQUIRY_POST_FAILURE]: (state, {payload:customerError}) => ({
        ...state,
        customer:null,
        customerError
    }),
    
}, initialState)

export default inquirySave;
