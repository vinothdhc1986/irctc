import React from "react";
import pl from "../../images/pinelabs-logo.png";
import "../../css/style.css";
import { connect } from "react-redux";
import Navigation from "../Navigation/Navigation";
import MerchantPaymentDataUtils from "../../utils/MerchantPaymentDataUtils";
import Loader from "react-loader-spinner";
import PopUp from "../HOC/PopUp";
class GloablLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalToggle: false };
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
    this.error = null;
    this.loading = null;
    this.merchant_payment_data = null;
  }
  modalHandler = e => {
    e.preventDefault();
    this.setState({
      modalToggle: !this.state.modalToggle
    });
  };
  render() {
    const { error, loading, merchant_payment_data } = this.props;

    if (loading) {
      //alert("dasdasfsf");
      return (
        <div className="loader">
          {" "}
          <Loader
            type="Puff"
            color="#328f3a"
            height={100}
            width={100}
            timeout={60000}
          />{" "}
        </div>
      );
    }

    return (
      <>
        <div></div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    merchant_payment_data:
      state.merchantPaymentDataFetchingReducer.merchantPaymentData,
    error: state.merchantPaymentDataFetchingReducer.error,
    loading: state.merchantPaymentDataFetchingReducer.loading,
    paymentAmountUI: state.merchantPaymentDataFetchingReducer.paymentAmountUI
  };
};

export default connect(mapStateToProps)(GloablLoader);
