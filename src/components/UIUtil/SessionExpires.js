import React from "react";
import pl from "../../images/pinelabs-logo.png";
import "../../css/style.css";
import { connect } from "react-redux";
import Navigation from "../Navigation/Navigation";
import MerchantPaymentDataUtils from "../../utils/MerchantPaymentDataUtils";
import Loader from "react-loader-spinner";
import PopUp from "../HOC/PopUp";
import { FETCHING_MERCHANT_PAYMENT_DATA_BEGINS } from "../../stores/actions/CommonAction";
class SessionExpires extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickSessionSubmit = event => {
    event.preventDefault();
    this.props.dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    document.getElementById("SessionExpiresForm").submit();
  };

  render() {
    // const { sessionExpires } = this.props;

    if (this.props.sessionExpires) {

      let actionName =
        process.env.REACT_APP_PG_CONTROLLER +
        "pinepg/v2/session/expires?token=" +
        encodeURIComponent(this.props.token);
      return (
        <PopUp isContinueButtonToBeHide="true">
          <>
            <div class="modal-body clearfix">
              <div class="col-12 cardeligibilityfailuremsg">
                <img src="images/warning.png" alt="not eligible" />
                <p class="text-black mt-3 mb-2">Session expires.</p>
              </div>
              <form
                id="SessionExpiresForm"
                method="post"
                action={actionName}
                onSubmit={this.onHandleSubmit}
              >
                <div class="col-12">
                  <input
                    type="submit"
                    className="btn btn-green"
                    id="onSessionSubmit"
                    name="onSessionSubmit"
                    value="Redirect to merchant page"
                    onClick={this.onClickSessionSubmit}
                  />
                </div>
              </form>
            </div>
          </>
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
    sessionExpires: state.merchantPaymentDataFetchingReducer.sessionExpires,
    token: state.merchantPaymentDataFetchingReducer.token
  };
};

export default connect(mapStateToProps)(SessionExpires);
