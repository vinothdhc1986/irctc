import React from "react";
import { connect } from "react-redux";
import "../../../css/style.css";
import HttpApiUtil from "../../../ApiUtils/HttpApiUtil";
import * as PAYMENT_MODE_CONST from "../../../Constants/PaymentModeConstants";
import {
    postNbfcEmiSubmitOtp
} from "../../../stores/actions/CommonAction";
import { setNbfcTransactionError } from "../../../stores/actions/NbfcPaymentModeAction";


const ObjHttpApiUtil = new HttpApiUtil();

class SubmitOtp extends React.Component {
    constructor(props) {
        super(props);
        let obj = { otp: "" }
        this.state = obj;
        this.error = null;
        this.loading = null;
        this.onPayNowBtnClick = this.onPayNowBtnClick.bind(this);
    };

    nbfcEmiSubmitOTPSuccessCb = (response) => {
        let submittedOTPResp = response && response !== undefined && response !== null ? response : null;
        if (submittedOTPResp.response_code == 1) {
            this.props.onSubmitOtpSuccessCb(submittedOTPResp)
        }
        else {
            this.props.onSubmitOtpFailureCb("OTP_SUBMITTED_FAILURE", "")
        }
    }
    nbfcEmiSubmitOTPFailureCb = (response) => {
        console.log(response);
    }

    submitOtpValidation = () => {
        let OtpVal = this.state.otp.trim();
        if (OtpVal == null || OtpVal == "") {
            this.props.setNbfcTransactionError('Please enter OTP');
            return;
        }
        else if (OtpVal.length < 3) {
            this.props.setNbfcTransactionError("Please enter valid OTP");
            return;
        }
        return true;
    }



    onPayNowBtnClick = () => {
        if (this.submitOtpValidation()) {
            let bflsubmitOtpReq = {
                otp: this.state.otp,
            }
            const submitOtpUrl = this.props.generatedOtpState.apiUrl
            this.props.postNbfcEmiSubmitOtp(submitOtpUrl, bflsubmitOtpReq, this.nbfcEmiSubmitOTPSuccessCb, this.nbfcEmiSubmitOTPFailureCb)

        }
    };

    onTextChange = (event) => {
        this.props.setNbfcTransactionError("");
        // if value is not blank, then test the regex

        if (PAYMENT_MODE_CONST.NUMBERS_ONLY_REGEX.test(event.target.value)) {
            this.setState({
                otp: event.target.value,
            })

        }
    }



    render() {
        return (
            <>
                <div class="bdr-top nbfc-details" id="bajaj">
                    <div class="col-lg-12 p-0 checkeligibility clearfix">
                        <h3>Enter OTP</h3>
                        <div class="row">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-12   mb-3 ">
                                <input class="form-control" id="otp" type="tel" inputMode="numeric" pattern="[0-9\s]{3,6}"
                                    autoComplete="cc-number" maxLength="6"
                                    minLength="3"
                                    autoComplete="off"
                                    onPaste={event => event.preventDefault()}
                                    onCopy={event => event.preventDefault()}
                                    onKeyPress="return isNumber(event)"
                                    value={this.state.otp} onChange={event => this.onTextChange(event)} />
                                <label for="otp">Enter OTP</label>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-12 paynow-btn  mb-3">
                                <input type="button" class="btn btn-green" onClick={this.onPayNowBtnClick} value="Submit OTP" />
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 savethecard mb10 p0 fs-14 mb-3 " >
                        <span className="error-block">{this.props.nbfcTransError}</span>
                    </div>
                </div>
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
        generatedOtpState: state.selectedNbfcPaymentOptionReducer,
        nbfcTransError: state.selectedNbfcPaymentOptionReducer.nbfcTransError
    };

};
export default connect(mapStateToProps, { postNbfcEmiSubmitOtp, setNbfcTransactionError })(SubmitOtp);
