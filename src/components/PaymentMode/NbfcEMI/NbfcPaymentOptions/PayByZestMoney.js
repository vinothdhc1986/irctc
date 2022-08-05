import React from "react";
import { connect } from "react-redux";
import "../../../../css/style.css";
import $ from "jquery";
import * as PAYMENT_MODE_CONST from "../../../../Constants/PaymentModeConstants";
import { setSelectNbfcOption, setNbfcTransactionState } from "../../../../stores/actions/NbfcPaymentModeAction";
import EmiTenure from "./BFL/EmiTenure";
import {
    postNbfcEmiRequestData
} from "../../../../stores/actions/CommonAction";



class PayByZestMoney extends React.Component {
    constructor(props) {
        super(props);

        let obj = {
            error: '',
            MobileNumber: "",
            PaymentMode: ""
        };
        this.state = obj;
        this.error = null;
        this.loading = null;
        this.onGenerateOtpBtnClick = this.onGenerateOtpBtnClick.bind(this);
    };

    nbfcEmiGenerateOTPSuccessCb = (response) => {
        if (response && response !== undefined && response !== null) {
            let generatedOTPResp = response;
            if (generatedOTPResp.response_code == 1) {
                this.props.setNbfcTransactionState("OTP_GENERATED", generatedOTPResp.api_url)
            }
        }
        console.log(response);
    }
    nbfcEmiGenerateOTPFailureCb = (response) => {
        console.log(response);
    }



    onGenerateOtpBtnClick = (event) => {
        event.preventDefault();
        if (this.ZMoneyValidation()) {
            let bflGenerateOtpReq = {
                txn_data: {
                    SelectedPaymentModeId: PAYMENT_MODE_CONST.PAYMENT_MODE_NBFC_THIRD_PARTY_EMI
                },
                nbfc_data: {
                    vendor_name: "ZEST_MONEY",
                    zestMoney_data: {
                        mobile_no: this.state.MobileNumber
                    }
                }
            }
            this.props.postNbfcEmiRequestData(this.props.token, bflGenerateOtpReq, this.nbfcEmiGenerateOTPSuccessCb, this.nbfcEmiGenerateOTPFailureCb);

        }
    };




    ZMoneyValidation = () => {
        let MobileNumber = this.state.MobileNumber.trim();
        if (MobileNumber == null || MobileNumber == "") {
            $("#EMIZestMoneyValidationErrorTRow").show();
            $("#EMIZestMoneyValidationErrorSpan").text("Please enter mobile number");
            return false;
        }
        else if (MobileNumber.length != 10) {
            $("#EMIZestMoneyValidationErrorTRow").show();
            $("#EMIZestMoneyValidationErrorSpan").text("Please enter valid mobile number");
            return false;
        }
        return true;
    }
    onTextChange = (event) => {
        // if value is not blank, then test the regex

        if (PAYMENT_MODE_CONST.NUMBERS_ONLY_REGEX.test(event.target.value)) {
            this.setState({ MobileNumber: event.target.value })
        }
    }

    render() {
        return (
            <>
                <div class="bdr-top nbfc-details" id="zest">

                    <div class="col-lg-12 p-0 checkeligibility clearfix">
                        <h3>Enter mobile no and view EMI plans</h3>
                        <div class="row">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-8">
                                <input class="form-control" type="text" id="ZMoneyMobileNumber" required="" type="tel" inputMode="numeric" pattern="[0-9\s]{10,10}"
                                    autoComplete="off"
                                    onPaste={event => event.preventDefault()}
                                    onCopy={event => event.preventDefault()}
                                    smaxLength="10"
                                    minLength="10"
                                    value={this.state.MobileNumber}
                                    onChange={event => this.onTextChange(event)}
                                />
                                <label for="ZMoneyMobileNumber">Enter mobile no.</label>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-4">
                                <input type="button" class="btn  btn-green" data-toggle="modal" value="Send OTP" onClick={this.onGenerateOtpBtnClick} />
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-12 p-0 checkeligibility clearfix" id="EMIZestMoneyValidationErrorTRow">
                        <p id="EMIZestMoneyValidationErrorSpan" class="error"></p>
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
        nbfcPaymentModeEmiVendorOpted: state.selectedNbfcPaymentOptionReducer
    };
};
export default connect(mapStateToProps, { setSelectNbfcOption, postNbfcEmiRequestData, setNbfcTransactionState })(PayByZestMoney);
