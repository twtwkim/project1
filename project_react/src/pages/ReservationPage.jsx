import { connect } from "react-redux";
import { reservationStore } from "../modules/reservationSave";
import Reservation from "../components/Reservation/Reservation";

const ReservationPage = (props) => {
    const {reserveInfo, reserveInfoError} = props;
    const {reservationStore} = props;

    return (
        <>
            <Reservation
                reserveInfo={reserveInfo}
                reserveInfoError={reserveInfoError}
                reservationStore={reservationStore}
            />
        </>
    );
};

export default connect(
    (state) => ({
        reserveInfo: state.reservationSave.reserveInfo,
        reserveInfoError: state.reservationSave.reserveInfoError,
        
    }),
    {
        reservationStore,
    }
)(ReservationPage);