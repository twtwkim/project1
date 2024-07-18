import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';

const Payment = () => {
    const location = useLocation();
    const {depositAmount} = location.state || {depositAmount: 0};
    console.log(depositAmount)
    const navigate = useNavigate();
    useEffect(()=>{
        const jquery = document.createElement("script");
        jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);
        return () => {
            document.head.removeChild(jquery);
            document.head.removeChild(iamport);
        }
    }, []);

    const requestPay = () => {
        const {IMP} = window;
        IMP.init('imp40141172');

        IMP.request_pay({
            pg: 'kakaopay',
            pay_method: 'card',
            merchant_uid: new Date().getTime(),
            name: '테스트 결제',
            amount: depositAmount,
            buyer_email: 'alfog23@gmail.com',
            buyer_name: '직관의 맛',
            buyer_tel: '010-1234-5678',
            buyer_addr: '서울특별시',
            buyer_postcode: '123-456',
        }, async(res) =>{
            try {
                const {data} = await axios.post('/api/posts/verifyIamport/' + res.imp_uid);
                if(res.paid_amount === data.response.amount){
                    alert('결제 성공! 곧 연락드리겠습니다.');
                    navigate('/main')
                } else{
                    alert('결제 실패');
                    navigate('/main')
                }
            } catch (error) {
                console.error('Error while verifying payment', error);
                alert('결제 실패!');
                navigate('/main')
            }
        })
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ marginBottom: '20px' }}>아래 버튼을 눌러 예약금 결제를 진행해주세요.</div>
            <img style={{ width: "120px", cursor: 'pointer' }} onClick={requestPay} src='/src/assets/payment_icon_yellow_medium.png' alt="payment icon" />
        </div>
    );
};

export default Payment;