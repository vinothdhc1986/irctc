import React from "react";
import { connect } from "react-redux";
import "../../../../css/style.css";
import $ from "jquery";
import * as PAYMENT_MODE_CONST from "../../../../Constants/PaymentModeConstants";
import { setSelectNbfcOption, setNbfcTransactionState, setNbfcTransactionError } from "../../../../stores/actions/NbfcPaymentModeAction";
import EmiTenure from "./BFL/EmiTenure";
import {
    postNbfcEmiRequestData
} from "../../../../stores/actions/CommonAction";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

class PayByBfl extends React.Component {
    constructor(props) {
        super(props);

        let obj = {
            error: '',
            CardNumber: "",
            SchemeCode: "",
            Tenure: "",
            PaymentMode: "",
            isTermsConditionAgreed: false
        };
        this.state = obj;
        this.error = null;
        this.loading = null;
        this.onPayNowBtnClick = this.onPayNowBtnClick.bind(this);
        this.BFLValidation = this.BFLValidation.bind(this);
        this.allowedBflCardBins = this.props.emiAllowedBins;
    };

    nbfcEmiGenerateOTPCb = (response) => {
        if (response && response !== undefined && response !== null) {
            if (response.response_code == 1) {
                this.props.setNbfcTransactionState("OTP_GENERATED", response.api_url)
            }
            else {
                this.nbfcEmiGenerateOTPFailureCb(response)
            }
        }
        else {
            response = { response_code: -1 };
            this.nbfcEmiGenerateOTPFailureCb(response)
        }
    }
    nbfcEmiGenerateOTPFailureCb = (response) => {
        this.btn.removeAttribute("disabled");
        this.props.nbfcEmiTxnFailureCb(response);
    }





    onPayNowBtnClick = () => {
        this.btn.setAttribute("disabled", "disabled");
        if (this.GenerateOTPBFLValidation()) {
            let isTermsAgreed = this.state.isTermsConditionAgreed === "on" ? true : false;
            let bflGenerateOtpReq = {
                txn_data: {
                    SelectedPaymentModeId: PAYMENT_MODE_CONST.PAYMENT_MODE_NBFC_THIRD_PARTY_EMI
                },
                nbfc_data: {
                    vendor_name: "BFL",
                    bfl_data: {
                        scheme_code: this.state.SchemeCode,
                        card_number: this.state.CardNumber,
                        tenure: this.state.Tenure,
                        is_terms_conditions_agreed: isTermsAgreed
                    }
                }
            }
            this.props.postNbfcEmiRequestData(this.props.token, bflGenerateOtpReq, this.nbfcEmiGenerateOTPCb);
        }
        else {
            this.btn.removeAttribute("disabled");
        }
    };

    GenerateOTPBFLValidation = () => {
        var scheme = this.state.SchemeCode;
        var Tenure = this.state.Tenure;
        if (scheme == null || scheme == "") {
            this.props.setNbfcTransactionError('Please select scheme');
            return false;

        }
        else if (Tenure == null || Tenure == "") {
            this.props.setNbfcTransactionError("Tenure amount is invalid");
            return false;
        }

        return this.BFLValidation();

    }



    BFLValidation = () => {
        var selectedPaymentMode = this.state.PaymentMode;


        if (selectedPaymentMode == "0") {
            this.props.setNbfcTransactionError("Please select one of the mode");
            return false;

        }
        else if (selectedPaymentMode == "1") {
            var cardNumber = this.state.CardNumber.trim();
            if (cardNumber == null || cardNumber == "") {
                this.props.setNbfcTransactionError("Please enter card number");
                return false;
            }
            else if (cardNumber.length != 16) {
                this.props.setNbfcTransactionError("Please enter valid card number");
                return false;
            }
            else if (!this.BFLCardValidator(cardNumber)) {
                this.props.setNbfcTransactionError("Card not eligible for BFL EMI");
                return false;
            }

        }
        else if (selectedPaymentMode == "2") {
            var MobileNumber = this.state.MobileNumber.trim();
            if (MobileNumber == null || MobileNumber == "") {
                this.props.setNbfcTransactionError("Please enter mobile number");
                return false;
            }
            else if (MobileNumber.length != 10) {
                this.props.setNbfcTransactionError("Please enter valid mobile number");
                return false;
            }
        }
        return true;
    }

    BFLCardValidator = (value) => {
        if (this.allowedBflCardBins && this.allowedBflCardBins != null && this.allowedBflCardBins != '' && this.allowedBflCardBins.length > 0) {
            var bflBinVal = value.substring(0, 6);
            if (bflBinVal && bflBinVal != null && bflBinVal != '' && this.allowedBflCardBins.indexOf(parseInt(bflBinVal)) > -1) {
                return true;
            }
            else {
                return false;
            }
        }
        return true;

    }

    onEmiSchemeSelect = (emiTenure, emiSchemeCode) => {
        let errTxtPrinted = this.props.nbfcTransError;
        if (emiSchemeCode != null && emiSchemeCode != '' && isNaN(emiSchemeCode) && emiSchemeCode > 0 && errTxtPrinted != 'Please select scheme') {
            this.props.setNbfcTransactionError("");

        }
        else if (emiTenure != null && emiTenure != '' && isNaN(emiTenure) && emiTenure > 0 && errTxtPrinted != "Tenure amount is invalid") {
            this.props.setNbfcTransactionError("");
        }
        this.setState({
            SchemeCode: emiSchemeCode,
            Tenure: emiTenure,
            PaymentMode: 1
        })
    }

    onTextChange = (event) => {
        this.props.setNbfcTransactionError("");
        // if value is not blank, then test the regex

        if (PAYMENT_MODE_CONST.NUMBERS_ONLY_REGEX.test(event.target.value)) {
            this.setState({ CardNumber: event.target.value })
        }
    }




    render() {
        const emiScehems = this.props.emiSchemes.map(scheme => {
            let isSelected = this.state.Tenure === scheme.tenure_in_months ? true : false;
            return <EmiTenure scheme={scheme} OnBFLRadioBtnClick={this.onEmiSchemeSelect} isSelected={isSelected} />
        })
        return (
            <>

                <div class="bdr-top nbfc-details" id="bajaj">
                    <div class="col-lg-12 p-0 emi-plan clearfix">
                        <h3>Select EMI plan</h3>
                        <div class="row">
                            {emiScehems}
                        </div>
                    </div>

                    <div class="col-lg-12 p-0 checkeligibility clearfix">
                        <h3>Enter your card details</h3>
                        <div class="row">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-12   ">
                                <input class="form-control" id="cardno" type="tel" inputMode="numeric" pattern="[0-9\s]{13,19}"
                                    maxLength="19"
                                    minLength="14"
                                    autoComplete="off"
                                    onPaste={event => event.preventDefault()}
                                    onCopy={event => event.preventDefault()}
                                    value={this.state.CardNumber}
                                    onChange={event => this.onTextChange(event)}
                                />
                                <label for="cardno">Enter card number</label>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 savethecard mb10 p0 fs-14 mb-3 " >
                                <span className="error-block">{this.props.nbfcTransError}</span>
                            </div>
                        </div>
                    </div>


                    <div class="col-12 p-0 text-left pt-2 note-text">
                        <div class="checkbox">
                            <input id="bflTermsConditionCb" type="checkbox" onClick={(event) => this.setState({ isTermsConditionAgreed: event.target.value })} />
                            <label for="bflTermsConditionCb">By making payment, I accept the  <a href={process.env.REACT_APP_PG_CONTROLLER + "/PinePGRedirect/DownloadBFLTermAndCondition"}><u> terms &amp; conditions</u></a></label>
                        </div>

                    </div>

                    <div class="col-12 p-0  paynow-btn mb-3">
                        <input type="button" class="btn  btn-green" value="Pay Now" onClick={this.onPayNowBtnClick} ref={btn => { this.btn = btn; }} />
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
        nbfcPaymentModeEmiVendorOpted: state.selectedNbfcPaymentOptionReducer,
        nbfcTransError: state.selectedNbfcPaymentOptionReducer.nbfcTransError
    };
};
export default connect(mapStateToProps, { setSelectNbfcOption, setNbfcTransactionState, postNbfcEmiRequestData, setNbfcTransactionError })(PayByBfl);
