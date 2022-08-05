import React from "react";
import { connect } from "react-redux";
import ValidatedInput from "react-number-format";
import "../../../../css/style.css";
import * as PAYMENT_MODE_CONST from "../../../../Constants/PaymentModeConstants";
import { setSelectUpiOption } from "../../../../stores/actions/UpiPaymentModeAction";
import {
    payUpiGPay
} from "../../../../stores/actions/CommonAction";


class PayByGpay extends React.Component {
    constructor(props) {
        super(props);
        let obj = {
            error: '',
            CustomerMobileNo: "",
            upiTransError: ""
        };
        this.state = obj;
        this.onPayNowBtnClick = this.onPayNowBtnClick.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    };

    phone_validate = (phno) => {
        var regexPattern = new RegExp(/^[6-9]\d{9}$/);  //new RegExp(/^\+?[1-9]\d{1,14}$/);     regular expression pattern for E.164 phone format /^\+?[9][1][1-9]\d{1,12}$/^\+?[9]\d{1}[1]\d{1}[1-9]\d{10}$
        if (regexPattern.test(phno)) {
            return true;
        }
        return false;
    }

    UPIGooglePayValidation = () => {

        var googlePayCustMobNumber = this.state.CustomerMobileNo;
        if (googlePayCustMobNumber == null || googlePayCustMobNumber == "") {
            this.setState({ error: "Please enter mobile number" });
            return false;
        }
        if (!this.phone_validate(googlePayCustMobNumber)) {
            this.setState({ error: "Please enter valid mobile number" });
            return false;
        }
        this.setState({ error: "" });
        return true;
    }
    onPayNowBtnClick(selectedUPIOption) {

        this.btn.setAttribute("disabled", "disabled");
        if (this.UPIGooglePayValidation()) {
            let upiInitiateTransReq = {
                txn_data: {
                    SelectedPaymentModeId: PAYMENT_MODE_CONST.PAYMENT_MODE_UPI
                },
                upi_data: {
                    mobile_no: this.state.CustomerMobileNo,
                    upi_option: "GPAY"
                }
            }


            this.props.payUpiGPay(this.props.token, upiInitiateTransReq)
                .then(response => {
                    if (response.response_code === 1 || response.response_code === -136 || response.response_code === -188) {
                        this.gPayNowSuccessCb();
                    } else {
                        this.gPayNowFailureCb(response);
                    }
                });
        }
        else {
            this.btn.removeAttribute("disabled");
        }

    };
    gPayNowSuccessCb = (response) => {
        this.props.upiSuccessCb();
    }
    gPayNowFailureCb = (response) => {
        this.btn.removeAttribute("disabled");
        this.setState({
            upiTransError: response.response_message,
            error: '',
            CustomerMobileNo: "",
        })
    }
    gPayNowSuccessCb = (response) => {
        this.props.upiSuccessCb();
    }

    onTextChange = (event) => {
        if (PAYMENT_MODE_CONST.NUMBERS_ONLY_REGEX.test(event.target.value)) {
            this.setState({
                upiTransError: "",
                CustomerMobileNo: event.target.value,
            })
        }
    }



    render() {
        const {
            error,
            loading,
            merchant_payment_data,
            selected_emi_data
        } = this.props;
        this.mercantPaymentData = merchant_payment_data;
        return (
            <>
                <div class="bdr-top upi-app-details" id="google-pay">
                    <div class="row">
                        <div class="col-lg-5 col-md-5 col-sm-5 col-12  mt-3 ">
                            <input class="form-control"
                                maxLength='10'
                                minLength='10'
                                autoComplete="off"
                                onPaste={event => event.preventDefault()}
                                onCopy={event => event.preventDefault()}
                                type="tel"
                                onChange={event => this.onTextChange(event)} id="gpayMobNoTxt" required="" />
                            <label for="gpayMobNoTxt">Enter mobile no.</label>
                            <span className="error-block">
                                {this.state.error}
                            </span>
                        </div>
                        <div class="col-lg-7 col-md-7 col-sm-7 col-12 p-0 mt-3 mb-3 paynow-btn ">
                            <input type="button" class="btn  btn-green mr-3" disabled={this.state.CustomerMobileNo === '' || this.state.error !== ''} onClick={this.onPayNowBtnClick} value="Pay now" ref={btn => { this.btn = btn; }} />
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb10 p0 fs-14" id="UPIGooglePayValidationErrorTRow" >
                            <span id="UPIGooglePayValidationErrorSpan" className="error-block">{this.state.upiTransError}</span>
                        </div>
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
        token: state.merchantPaymentDataFetchingReducer.token,
        error: state.merchantPaymentDataFetchingReducer.error,
        loading: state.merchantPaymentDataFetchingReducer.loading,
        upiPaymentModeReqObject: state.selectedUpiThirdPartyAppOptionReducer
    };
};
export default connect(mapStateToProps, { setSelectUpiOption, payUpiGPay })(PayByGpay);
