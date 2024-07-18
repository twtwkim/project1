import axios from "axios";
const request = axios.create();

export const inquiry = (InquiryName, InquiryTel, InquiryEmail, InquiryTitle, InquiryContent) => request.post('/api/inquiry', {InquiryName, InquiryTel, InquiryEmail, InquiryTitle, InquiryContent})