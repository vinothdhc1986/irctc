import React from "react";
import * as PAYMENT_MODE_CONST from "../../Constants/PaymentModeConstants";
import { NavLink } from "react-router-dom";
export default function OtpModelPopUp(props) {
  return (() => {
    //// let paymentModeId = props.payment_mode_id;
    // let onClickedPaymentMode = props.onClickedPaymentMode;
    return (
      <div
        className="modal fade text-center"
        id="sendOtp"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <button
            type="button"
            className="close text-right"
            data-dismiss="modal"
          >
            &times;
          </button>

          <div className="modal-content">
            <div className="modal-body clearfix">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h2>Enter OTP</h2>
                <p>OTP has been sent to your registered mobile no.</p>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-12  col-centered enterotp mb-3">
                <input
                  className="form-control"
                  type="text"
                  id="otp"
                  required=""
                  maxlength="6"
                />
                <label for="otp">
                  <span className="dot mr-3"></span>
                  <span className="dot mr-3"></span>
                  <span className="dot mr-3"></span>
                  <span className="dot mr-3"></span>
                </label>
              </div>
              <div className="col-12  p-0">
                <button className="btn btn-green">Continue </button>
                <button className="btn btn-grey">Cancel </button>
              </div>
              <div className="mt-4 justify-content-center">
                <p className="note-text">
                  Note: Convenience fee of &#x20B9;99 +GST applicable for EMI
                  transaction for HDFC bank cards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })();
}
