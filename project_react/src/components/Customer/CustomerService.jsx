import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import palette from '../../common/palette';
import Button from '../../common/Button';
import TermsModal from '../../common/Modal/TermsModal';
import { privacyPolicy } from '../../constants/termsContent';

const FormDiv = styled.div`
    width: 60vw;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20vh auto;
`;

const InputStyle = styled.input`
    font-size: 1rem;
    border: none;
    border-bottom: 1px solid ${palette.Gray[5]};
    padding-bottom: 0.5rem;
    outline: none;
    width: 100%;
    &:focus {
        color: ${palette.Teal[7]};
        border-bottom: 1px solid ${palette.Gray[7]};
    }
    & + & {
        margin-top: 1rem;
    }
`;

const TextAreaStyle = styled.textarea`
    font-size: 1rem;
    border: none;
    border-bottom: 1px solid ${palette.Gray[5]};
    padding-bottom: 0.5rem;
    outline: none;
    width: 100%;
    &:focus {
        color: ${palette.Teal[7]};
        border-bottom: 1px solid ${palette.Gray[7]};
    }
    & + & {
        margin-top: 1rem;
    }
`;

const ButtonStyle = styled(Button)`
    margin-top: 1rem;
`;

const CheckBoxLabel = styled.label`
    display: flex;
    align-items: center;
    margin-top: 1rem;
    width: 100%;
    input {
        margin-right: 0.5rem;
    }
    cursor: pointer;
`;

const StyledHr = styled.hr`
    width: 100%;
    max-width: 600px;
    border: 2px solid black;
    border-radius: 30%;
    margin: 2rem auto;
`;

const StyledH2 = styled.h2`
    color: ${palette.Violet[7]};
    margin-bottom: 0;
`;

const CuntomerService = (props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });
    const [subModalIsOpen, setSubModalIsOpen] = useState(false);
    const {customerError} = props;
    const [customer, setCustomer] = useState({
        InquiryName: '',
        InquiryTel: '',
        InquiryEmail: '',
        InquiryTitle: '',
        InquiryContent: ''
    });
    const {inquiry} = props
    const navigate = useNavigate();

    const openModal = (title, content) => {
        setModalContent({ title, content });
        setModalIsOpen(true);
    };

    const closeModal = () => setModalIsOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubModalIsOpen(true);
    };

    const closeSubModal = () => {
        setSubModalIsOpen(false);
        navigate('/main');
    };

    const onclick = () => {
        const {InquiryName, InquiryTel, InquiryEmail, InquiryTitle, InquiryContent} = customer;
        inquiry(InquiryName, InquiryTel, InquiryEmail, InquiryTitle, InquiryContent);
    }

    return (
        <FormDiv>
            <StyledH2>상담문의</StyledH2>
            <h1>궁금한 사항은 언제든 문의해주세요.</h1>
            <StyledHr />
            <form style={{ maxWidth: "485px" }} onSubmit={handleSubmit}>
                <InputStyle
                    autoComplete="name"
                    name="name"
                    placeholder="이름을 입력하세요"
                    value={customer.InquiryName}
                    onChange={(e) => setCustomer({ ...customer, InquiryName: e.target.value })}
                />
                <InputStyle
                    autoComplete="phoneNum"
                    name="phoneNum"
                    placeholder="연락처를 입력하세요"
                    value={customer.InquiryTel}
                    onChange={(e) => setCustomer({ ...customer, InquiryTel: e.target.value })}
                />
                <InputStyle
                    autoComplete="email"
                    name="email"
                    placeholder="이메일 주소를 입력하세요"
                    value={customer.InquiryEmail}
                    onChange={(e) => setCustomer({ ...customer, InquiryEmail: e.target.value })}
                />
                <InputStyle
                    autoComplete="title"
                    name="title"
                    placeholder="제목을 입력하세요"
                    value={customer.InquiryTitle}
                    onChange={(e) => setCustomer({ ...customer, InquiryTitle: e.target.value })}
                />
                <TextAreaStyle
                    autoComplete="content"
                    name="content"
                    placeholder="문의내용을 입력하세요"
                    type="textarea"
                    value={customer.InquiryContent}
                    onChange={(e) => setCustomer({ ...customer, InquiryContent: e.target.value })}
                />
                <CheckBoxLabel onClick={() => openModal('개인정보처리방침', privacyPolicy)}>
                    <input type="checkbox" name="privacy-policy" />
                    개인정보 취급방침에 동의합니다.
                </CheckBoxLabel>
                <ButtonStyle fullWidth color="Violet" type="submit" onClick={onclick}>문의하기</ButtonStyle>
            </form>
            <TermsModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                title={modalContent.title}
                content={modalContent.content}
            />
            <TermsModal
                isOpen={subModalIsOpen}
                onRequestClose={closeSubModal}
                title="문의 완료"
                content="접수가 완료되었습니다. 곧 연락드리겠습니다!"
            />
        </FormDiv>
    );
};

export default CuntomerService;