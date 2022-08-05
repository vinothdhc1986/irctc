import React from "react";
import { connect } from "react-redux";
import "../../../../../css/style.css";
import $ from "jquery";
import * as PAYMENT_MODE_CONST from "../../../../../Constants/PaymentModeConstants";
import { setSelectNbfcOption } from "../../../../../stores/actions/NbfcPaymentModeAction";
import ZmEmiTenure from "./ZmEmiTenure";
import {
    postZestMoneyLoanApproval
} from "../../../../../stores/actions/CommonAction";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

class EmiTenuresView extends React.Component {
    constructor(props) {
        super(props);

        let obj = {
            error: '',
            EmiAmount: "",
            Tenure: "",
            isTermsConditionAgreed: false
        };
        this.state = obj;
        this.error = null;
        this.loading = null;
        this.onPayNowBtnClick = this.onPayNowBtnClick.bind(this);
        let zestMoneyOtpResponse = this.props.nbfcPaymentModeEmiVendorOpted.validatedOtpResponse;

        let zmSchemensWithOtherData = zestMoneyOtpResponse && zestMoneyOtpResponse != null ? zestMoneyOtpResponse.zest_emi_schemes : null;
        this.zmTermsConditionLink = zmSchemensWithOtherData != null ? zmSchemensWithOtherData.terms_condtions_link : "";
    };

    nbfcEmiTransactionCompleteSuccessCb = (response) => {
        if (response && response !== undefined && response !== null) {
            let generatedOTPResp = response.data && response.data !== undefined && response.data !== null ? response.data : null;
            if (generatedOTPResp.response_code == 1) {
                this.props.onSubmitLoanApprovalSuccessCb(response)
            }
            else if (generatedOTPResp.response_code == -136 || generatedOTPResp.response_code == -199) {
                this.props.onSubmitLoanApprovalFailureCb(response)
            }
            else {
                this.nbfcEmiTransactionCompleteFailureCb(response)
            }
        }
        console.log(response);
    }
    nbfcEmiTransactionCompleteFailureCb = (response) => {
        this.ShowResponseMessageFromZestMoney(response.response_message);
    }

    ShowResponseMessageFromZestMoney = (PinePGResponseMessage) => {
        if (PinePGResponseMessage && PinePGResponseMessage != null && PinePGResponseMessage != "") {
            $("#EMIZestMoneyValidationErrorTRow").show();
            $("#EMIZestMoneyValidationErrorSpan").text(PinePGResponseMessage);
        }
        else {
            $("#EMIZestMoneyValidationErrorTRow").show();
            $("#EMIZestMoneyValidationErrorSpan").text("Error Occurred");
        }

    }
    componentDidMount = () => {
    }

    InitiateTransZestMoneyValidation = () => {
        var emiAmount = this.state.EmiAmount;
        var emiTenure = this.state.Tenure;
        let isTermsAgreed = false;
        if (this.state.isTermsConditionAgreed === "on") {
            isTermsAgreed = true;
        }
        else {
            $("#EMIZestMoneyValidationErrorTRow").show();
            $("#EMIZestMoneyValidationErrorSpan").text('Please read and agree with Terms & condition.');
            return false;
        }
        if (emiTenure == undefined || emiTenure == null || emiTenure == "") {
            $("#EMIZestMoneyValidationErrorTRow").show();
            $("#EMIZestMoneyValidationErrorSpan").text('Please select EMI plan.');
            return false;
        }
        else if (emiAmount == undefined || emiAmount == null || emiAmount == "") {
            $("#EMIZestMoneyValidationErrorTRow").show();
            $("#EMIZestMoneyValidationErrorSpan").text("Amount is invalid. Please select EMI plan.");
            return false;
        }
        return true;

    }



    onPayNowBtnClick = () => {
        $("#EMIZestMoneyValidationErrorTRow").hide();
        $("#EMIZestMoneyValidationErrorSpan").text('');
        if (this.InitiateTransZestMoneyValidation()) {

            let isTermsAgreed = this.state.isTermsConditionAgreed === "on" ? true : false;
            let zestMoneyCompleteTransactionReq = {
                zest_money: {
                    emi_amount: this.state.EmiAmount,
                    tenure_in_months: this.state.Tenure,
                    is_terms_conditions_agreed: isTermsAgreed
                }
            }
            let zestMoneyCompleteTransUrl = this.props.nbfcPaymentModeEmiVendorOpted.apiUrl
            this.props.postZestMoneyLoanApproval(zestMoneyCompleteTransUrl, zestMoneyCompleteTransactionReq, this.nbfcEmiTransactionCompleteSuccessCb, this.nbfcEmiTransactionCompleteFailureCb)

        }
    };



    onEmiSchemeSelect = (emiTenure, emiAmount) => {
        this.setState({
            EmiAmount: emiAmount,
            Tenure: emiTenure,
            PaymentMode: 1
        })
        var termsConditionLinkUrl = $("#ZMoney_TNC").prop("href");
        if (termsConditionLinkUrl && termsConditionLinkUrl != '' && termsConditionLinkUrl != null) {
            if (termsConditionLinkUrl.indexOf("&EMITenure=") > 0) {
                var indexQueryParam = termsConditionLinkUrl.indexOf("&EMITenure=");
                termsConditionLinkUrl = termsConditionLinkUrl.substring(0, indexQueryParam);
            }
        }
        termsConditionLinkUrl = termsConditionLinkUrl + "&EMITenure=" + emiTenure;
        $("#ZMoney_TNC").prop("href", termsConditionLinkUrl);
    }





    render() {
        let zestMoneyOtpResponse = this.props.nbfcPaymentModeEmiVendorOpted.validatedOtpResponse;
        let zmSchemensWithOtherData = zestMoneyOtpResponse && zestMoneyOtpResponse != null ? zestMoneyOtpResponse.zest_emi_schemes : null;
        const zmTermsConditionLink = zmSchemensWithOtherData != null ? zmSchemensWithOtherData.terms_condtions_link : "";
        const emiSchemes = zmSchemensWithOtherData != null ? zmSchemensWithOtherData.schemes : [];
        const emiScehems = emiSchemes.map(scheme => {
            let isSelected = this.state.Tenure === scheme.tenure_in_months ? true : false;
            return <ZmEmiTenure scheme={scheme} OnZMRadioBtnClick={this.onEmiSchemeSelect} isSelected={isSelected} />
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

                    <div class="col-12 p-0 text-left note-text">
                        <div class="checkbox">
                            <input id="zmTNC_cb" type="checkbox" checked onChecked={(event) => this.setState({ isTermsConditionAgreed: event.target.value })} />
                            <label for="zmTNC_cb">By making payment, I accept the  <a id="ZMoney_TNC" name="ZMoney_TNC" target="_new" href={process.env.REACT_APP_PG_CONTROLLER + this.zmTermsConditionLink}><u> terms &amp; conditions</u></a></label>
                        </div>

                    </div>
                    <div class="col-12 p-0 text-left note-text" id="EMIZestMoneyValidationErrorTRow">
                        <p id="EMIZestMoneyValidationErrorSpan" class="error"></p>
                    </div>

                    <div class="col-12 p-0 paynow-btn mb-3">
                        <input type="button" class="btn  btn-green" data-toggle="modal" value="Pay now" onClick={this.onPayNowBtnClick} />
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
export default connect(mapStateToProps, { setSelectNbfcOption, postZestMoneyLoanApproval })(EmiTenuresView);
