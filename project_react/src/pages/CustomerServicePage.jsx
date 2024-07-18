import Header from "../common/Header";
import CustomerService from '../components/Customer/CustomerService'
import { connect } from "react-redux";
import { inquiry } from "../modules/inquirySave";

const CustomerServicePage = (props) => {
    const {customer, customerError} = props;
    const {inquiry} = props;

    return (
        <>
            <Header isWhiteBackground/>
            <CustomerService
                customer={{
                    InquiryName: '',
                    InquiryTel: '',
                    InquiryEmail: '',
                    InquiryTitle: '',
                    InquiryContent: ''
                }}
                customerError={customerError}
                inquiry={inquiry}
            />
        </>
    );
};

export default connect(
    (state) => ({
        customer: state.inquirySave.customer,
        customerError: state.inquirySave.customerError,
        
    }),
    {
        inquiry,
    }
)(CustomerServicePage);