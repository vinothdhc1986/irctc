import React from "react";
import pl from "../../images/pinelabs-logo.png";
import "../../css/style.css";
import { connect } from "react-redux";
import Navigation from "../Navigation/Navigation";
import MerchantPaymentDataUtils from "../../utils/MerchantPaymentDataUtils";
import Loader from "react-loader-spinner";
import PopUp from "../HOC/PopUp";
class GlobalError extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalToggle: true };
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
    this.error = null;
    this.loading = null;
    this.merchant_payment_data = null;
  }

  render() {
    const { error } = this.props;

    if (error) {
      return (
        <PopUp>
          <p>Technical error</p>
        </PopUp>
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
    error: state.merchantPaymentDataFetchingReducer.error
  };
};

export default connect(mapStateToProps)(GlobalError);
