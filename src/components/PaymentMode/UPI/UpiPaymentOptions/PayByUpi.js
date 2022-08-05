import React from "react";
import { connect } from "react-redux";
import "../../../../css/style.css";
import * as PAYMENT_MODE_CONST from "../../../../Constants/PaymentModeConstants";
import { setSelectUpiOption } from "../../../../stores/actions/UpiPaymentModeAction";
import ValidatedInput from "react-number-format";
import {
    payUpiGPay
} from "../../../../stores/actions/CommonAction";

class PayByUpi extends React.Component {
    constructor(props) {
        super(props);

        let obj = {
            error: '',
            CustomerVPA: "",
            upiTransError: ""
        };
        this.state = obj;
        this.onPayNowBtnClick = this.onPayNowBtnClick.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    };

    validateCustomerVPA = () => {
        let error = "";
        var vpa = this.state.CustomerVPA
        if (vpa && vpa != null || vpa != "") {
            this.setState({ error: '' })
            return true;
        }
        else {
            this.setState({ error: 'Please enter UPI ID' })
            return false;
        }

    }

    onPayNowBtnClick = () => {
        this.btn.setAttribute("disabled", "disabled");
        if (this.validateCustomerVPA()) {
            let upiReqObj = {
                UpiThirdPartyAppId: null,
                CustomerVPA: this.state.CustomerVPA,
                CustomerMobileNo: "",
                PinePGTxnID: this.props.upiPaymentModeReqObject.PinePGTxnID,
                CustomerUpiOptionOpted: this.props.upiPaymentModeReqObject.SelectedUpiThirdPartyUpiApp
            }

            let upiInitiateTransReq = {
                txn_data: {
                    SelectedPaymentModeId: PAYMENT_MODE_CONST.PAYMENT_MODE_UPI
                },
                upi_data: {
                    vpa: this.state.CustomerVPA,
                    upi_option: "UPI"
                }
            }
            this.props.payUpiGPay(this.props.token, upiInitiateTransReq)
                .then(response => {
                    if (response.response_code === 1 || response.response_code === -136 || response.response_code === -188) {
                        this.upiPayNowSuccessCb();
                    } else {
                        this.upiPayNowFailureCb(response);
                    }
                });
        }
        else {
            this.btn.removeAttribute("disabled");
        }

    };
    upiPayNowSuccessCb = (response) => {
        this.props.upiSuccessCb();
    }
    upiPayNowFailureCb = (response) => {
        this.btn.removeAttribute("disabled");
        this.setState({
            upiTransError: response.response_message,
            error: '',
            CustomerVPA: "",
        })
    }

    onTextChange = (event) => {
        this.setState({
            upiTransError: "",
            CustomerVPA: event.target.value,
        })
    }
    render() {

        return (
            <>
                <div class="bdr-top upi-app-details" id="bhim-pay">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-12  mt-3 ">
                            <input type="text"
                                class="form-control"
                                value={this.state.CustomerVPA}
                                onChange={event => this.onTextChange(event)}
                                id="upi id" required=""
                                autoComplete="off"
                                onPaste={event => event.preventDefault()}
                                onCopy={event => event.preventDefault()} />
                            <label for="upi id">Enter your UPI ID</label>
                            <span className="error-block">
                                {this.state.error}
                            </span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-12  p-0 mt-3 mb-3 paynow-btn ">
                            <input type="button" class="btn  btn-green mr-3" onClick={this.onPayNowBtnClick}
                                disabled={this.state.CustomerVPA === '' || this.state.error !== ''} value="Pay Now" ref={btn => { this.btn = btn; }} />
                        </div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 savethecard mb10 p0 fs-14" id="UPIValidationErrorTRow" >
                            <span id="UPIValidationErrorSpan" className="error-block">{this.state.upiTransError}</span>
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
export default connect(mapStateToProps, { setSelectUpiOption, payUpiGPay })(PayByUpi);
