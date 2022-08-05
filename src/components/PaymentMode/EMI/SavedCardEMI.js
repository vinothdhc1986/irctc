import React from "react";
import { connect } from "react-redux";
import "../../../css/style.css";

import PopUp from "../../HOC/PopUp";
import { EMIType, Cards, ConstCardTypeConfigData } from "../EMI";
import OtpModelPopUp from "../../UIUtil/OtpModelPopUp";
import DebitEMISavedCardOTP from "./Issuers/DebitEMISavedCardOTP";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import {
    CheckSession,
    CheckIssuerCardBinIsValidEMI,
    CheckDebitEMIIssuerElegibilty,
    SESSION_EXPIRES,
    FETCHING_MERCHANT_PAYMENT_DATA_BEGINS,
    onValidateOTP
} from "../../../stores/actions/CommonAction";

import MerchantPaymentDataUtils from "../../../utils/MerchantPaymentDataUtils";
import * as ISSUER_CONST from "../../../Constants/IssuersConstants";
import * as EMI_TYPE_CONST from "../../../Constants/EMITypeConstants";
// import { findAllInRenderedTree } from "react-dom/test-utils";
import ValidatedInput from "react-number-format";


class SavedCardEMI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            DebitCardNumber: "",
            DebitMobileNo: "",
            isCardValid: false,
            isCardBinValidityCheck: true,
            isModelOpen: false,
            isDebitEMICheckEleg: false,
            OTPValue: "",
            isTermAndConditionSet: false,
            isTermAndConditionCheckBoxSet: false,
            TNCErrorMsg: "",
            OTPValidationFailureMsg: "",
            isDebitCardToBeSaved: false,
            CVV: null,
            isModelOpen: false,
            isIciciTermAndConditionSet: false,
            isAxisTermAndConditionCheckBoxSet: false,
            TNCErrorMsg: "",

        };
        this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
        this.typingTimer = null; //timer identifier
        this.doneTypingInterval = 1000;
        this.CardValidationModel = {
            sequence_id: null,
            scheme_id: null,
            issuer_id: null,
            tenure_id: null,
            loan_amount: null
        };

        this.schemeID = null;
        this.loanAmount = null;
        this.selected_emi_data = null;
        this.HDFCTermAndConditionData = null;
        this.InterestRate = null;
        this.DynamictermsAndConditionNoteText = null;
    }

    onClose = () => {
        this.setState({
            isModelOpen: false,
            isIciciTermAndConditionSet: false,
            TNCErrorMsg: ""
        });
    };


    isNumber = (evt) => {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            evt.preventDefault();
        }
        return true;
    };

    showICICITermAndConditionPage = (tenureMonths, emiPerMonth) => {
        return (

            <div class="modal-body clearfix">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="text-left modal-title">Terms and Conditions - ICICI Bank Debit Card</h1>
                </div>

                <div class="modal-body terms-conditions-panel">

                    <div class="text-left">

                        <ul class=" fs-14" id="termsAndConUl">
                            <li>You will pay Rs. {emiPerMonth / 100} per month for {tenureMonths}  months</li>
                            <li>For transaction done on or before 15th of the month, the EMI amount will be charged on your ICICI Bank account between 3rd to 7th of the next month</li>
                            <li>For transaction done after 15th of the month, the EMI amount will be charged on your ICICI Bank account between 3rd to 7th of the month after next</li>
                            <li>Processing fee will be charged in availing EMI facility through your debit card</li>
                            <li>For the purpose of providing an EMI on debit card, the bank is required to confirm your mobile number registered with the account as well as eligibility grading with the merchant.</li>
                            <li>
                                The detailed T&amp;C for EMI on debit card facility is available on the ICICI Bank website.<br />
                                <a class="text-green" href="https://www.icicibank.com/Personal-Banking/cards/Consumer-Cards/Debit-Card/emi-debitcard.page" target="_blank">Click here to view</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" id="agree-btn"
                        class="btn btn-green"
                        onClick={this.onTermAndConditionSubmitDebitEMI}>I Agree</button>
                    {/* <button type="button" id="cancel-btn"
                        class="btn btn-green" onClick={this.onClose} >Cancel</button> */}
                </div>
            </div>



        );
    };



    GetPaymentModeIDOnIssuerBasis = (paymentModeId, issuerId) => {
        let calPaymentModeId = 1;
        if (paymentModeId == 4) {
            calPaymentModeId = 4;
            if (this.CheckIsDebitEMiIssuer(issuerId)) {
                calPaymentModeId = 14;
            }
        }

        return calPaymentModeId;
    };


    myChangeHandler = event => {
        let nam = event.target.name;
        let val = event.target.value;

        if (nam == "isAxisTermAndConditionCheckBoxSet") {
            this.setState({
                isAxisTermAndConditionCheckBoxSet: event.target.checked,
                TNCErrorMsg: ""
            });
            return;
        }

        this.setState({ [nam]: val });
    };

    CheckIsDebitEMiIssuer = issuerId => {
        let isDebitEMiIssuer = false;
        if (ISSUER_CONST.ISSUER_DEBIT_EMI.includes(issuerId)) {
            isDebitEMiIssuer = true;
        }
        return isDebitEMiIssuer;
    };


    GetCardBinModel = () => {
        return (this.CardValidationModel = {
            sequence_id: this.props.sequenceId,
            scheme_id: this.schemeID,
            issuer_id: this.selected_emi_data.issuerId,
            tenure_id: this.selected_emi_data.tenureId,
            loan_amount: this.loanAmount
        });
    };

    onDebitEMICeckEleg(callback) {
        let valid = false;
        let issuerId = this.props.selected_emi_data.issuerId;
        let tenureId = parseInt(this.props.selected_emi_data.tenureId);

        if (this.CheckIsDebitEMiIssuer(issuerId) && tenureId != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID) {
            let cardBinModelData = this.GetCardBinModel();
            if (!cardBinModelData) {
                return;
            }
            this.props
                .dispatch(
                    CheckDebitEMIIssuerElegibilty(this.props.token, cardBinModelData)
                )
                .then(json => {
                    let responseData = json.data;
                    if (responseData.response_code == 1) {

                        valid = true;
                    } else {
                    }
                    callback(valid);
                })
                .catch(error => {
                    console.log(error);

                });
        } else {

            valid = true;
            callback(valid);
        }

    }

    onHandleSubmit = event => {
        event.preventDefault();

        let tenureId = parseInt(this.props.selected_emi_data.tenureId);

        if (
            this.props.selected_emi_data.issuerId ==
            ISSUER_CONST.AXIS_DEBIT_EMI_ISSUER &&
            (tenureId !=
                EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID) &&
            !this.state.isAxisTermAndConditionCheckBoxSet
        ) {
            this.setState({ TNCErrorMsg: "Please accept Terms and Conditions." });
            return;
        }

        this.btn.setAttribute("disabled", "disabled");
        this.props
            .dispatch(CheckSession(this.props.token))
            .then(json => {

                let responseData = json.data;
                if (responseData.response_code == 1) {
                    let cardBinModelData = this.GetCardBinModel();
                    if (!cardBinModelData) {
                        return;
                    }
                    this.props
                        .dispatch(
                            CheckIssuerCardBinIsValidEMI(this.props.token, cardBinModelData)
                        )
                        .then(json => {
                            let responseData = json.data;
                            if (responseData.response_code == 1) {
                                this.setState({ isCardBinValidityCheck: true });
                                let callbackProps = this.props;
                                let callbackStates = this.state;
                                this.onDebitEMICeckEleg(status => {
                                    if (status) {
                                        if (
                                            (this.props.selected_emi_data.issuerId ==
                                                ISSUER_CONST.ICICI_DEBIT_EMI_ISSUER)
                                            &&
                                            (tenureId !=
                                                EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID)
                                        ) {
                                            this.btn.removeAttribute("disabled");
                                            this.onClose();
                                            this.setState({
                                                isIciciTermAndConditionSet: true,
                                                isModelOpen: true
                                            });
                                        } else {

                                            document.getElementById("SaveCardEMIForm").submit();
                                        }
                                    } else {

                                        this.btn.removeAttribute("disabled");
                                        this.setState({
                                            isCardBinValidityCheck: false,
                                            isModelOpen: true
                                        });

                                    }
                                });
                            } else {
                                this.btn.removeAttribute("disabled");
                                this.setState({
                                    ...this.state,
                                    isCardBinValidityCheck: false,
                                    isModelOpen: true
                                });
                                // this.onOpenModelPop();
                            }
                        })
                        .catch(error => {
                            //alert("onCardValidation:" + error);
                        });

                } else {
                    //show session pop up
                    // this.onHandleSession();
                    this.btn.removeAttribute("disabled");
                    this.props.dispatch(SESSION_EXPIRES());
                }
            })
            .catch(error => {
                //techincal error
                this.btn.removeAttribute("disabled");
                alert("onHandleSubmit:" + error);
            });
    };


    onTermAndConditionSubmitDebitEMI = event => {
        event.preventDefault();
        this.props
            .dispatch(CheckSession(this.props.token))
            .then(json => {
                let responseData = json.data;
                if (responseData.response_code == 1) {
                    this.props.dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
                    document.getElementById("SaveCardEMIForm").submit();
                } else {
                    //show session pop up

                    this.props.dispatch(SESSION_EXPIRES());
                }
            })
            .catch(error => {
                //techincal error
                //alert("onHandleSubmit:" + error);
            });
    };

    dynamicCardBinFailureMsg = (issuerName, cardTypeName) => {
        return (
            <div class="modal-body clearfix">
                <div class="col-12 cardeligibilityfailuremsg">
                    {/* src="../../images/warning.png" */}
                    <img src={`../../${process.env.PUBLIC_URL}/images/warning.png`} alt="not eligible" />
                    <p class="text-black mt-3 mb-2">
                        Your {issuerName.toLowerCase()} bank {cardTypeName.toLowerCase()} is
                presently not eligible for EMI. Please continue to quickly check
                your eligibility for a different tenure or card.
              </p>
                    <p class="text-center text-green"> It won't even take a minute!</p>
                </div>
                <div class="col-12"></div>
            </div>
        );
    };

    render() {
        const {
            error,
            loading,
            merchant_payment_data,
            selected_emi_data
        } = this.props;
        this.selected_emi_data = selected_emi_data;
        let emiData = null;
        let PaymentModeId = 4;
        let IssuerId = 0;
        let TenureId = 0;
        let CardTypeId = 0;
        let EmiTypeId = 0;
        let TxnType = 1;
        let AmountFromUI = this.props.paymentAmountUI;
        let debitEMIPennyTxnNote = "";
        let TermsAndConditionsNote = "";
        let isSavedCardEMIPayNowDisabled = false;
        let pennyTxnAmount = null;

        let issuerName = null;
        let cardTypeName = null;
        let tenureMonths = null;
        let emiPerMonth = null;
        let actionName =
            process.env.REACT_APP_PG_CONTROLLER + "pinepg/v2/submit/emi?token=" +
            encodeURIComponent(this.props.token);


        let isTenureContainsSpecialOffers = false;

        if (
            selected_emi_data &&
            selected_emi_data.paymentMode == 4 &&
            selected_emi_data.emiType &&
            selected_emi_data.cardType &&
            selected_emi_data.issuerId &&
            selected_emi_data.tenureId
        ) {
            IssuerId = selected_emi_data.issuerId;
            TenureId = selected_emi_data.tenureId;
            CardTypeId = selected_emi_data.cardType;
            EmiTypeId = selected_emi_data.emiType;

            PaymentModeId = this.GetPaymentModeIDOnIssuerBasis(
                selected_emi_data.paymentMode,
                IssuerId
            );
            PaymentModeId = selected_emi_data.paymentMode;

            issuerName = this.objMerchantPaymentDataUtils.GetIssuerDataForEMITypeIdCardTypeId(
                merchant_payment_data,
                EmiTypeId,
                CardTypeId,
                IssuerId
            ).issuer_name;

            let tenuredata = this.objMerchantPaymentDataUtils.GetTenureDataForTenureId(
                merchant_payment_data,
                EmiTypeId,
                CardTypeId,
                IssuerId,
                TenureId
            );

            this.DynamictermsAndConditionNoteText = this.objMerchantPaymentDataUtils.GetIssuerDataForEMITypeIdCardTypeId(
                merchant_payment_data,
                EmiTypeId,
                CardTypeId,
                IssuerId
            ).terms_and_conditions;



            isTenureContainsSpecialOffers = this.objMerchantPaymentDataUtils.IsTenureContainsSpecialOffer(tenuredata);


            pennyTxnAmount = this.objMerchantPaymentDataUtils.GetIssuerDataForEMITypeIdCardTypeId(
                merchant_payment_data,
                EmiTypeId,
                CardTypeId,
                IssuerId
            ).penny_amount;


            cardTypeName = ConstCardTypeConfigData.filter(
                obj => obj.CARD_TYPE_ID == CardTypeId
            )[0].NAME;
            // alert("issyuer name" + issuerName);
            // alert("cardTypeName " + cardTypeName);
            tenureMonths = tenuredata.tenure_in_month;
            emiPerMonth = tenuredata.monthly_installment;
            this.schemeID = tenuredata.applicable_scheme.scheme_id;
            this.loanAmount = tenuredata.loan_amount;
            this.InterestRate = tenuredata.bank_interest_rate;
        }


        let isOtpToBeShown = null;
        let SendOTPEnabled = false;
        if (
            ISSUER_CONST.ISSUER_DEBIT_EMI_OTP_TO_BE_SHOWN.includes(IssuerId) &&
            selected_emi_data.isSelected && EmiTypeId != 4
        ) {
            isOtpToBeShown = (
                <>
                    <DebitEMISavedCardOTP sequenceId={this.props.sequenceId} />
                    <OtpModelPopUp />
                </>
            );

            SendOTPEnabled = true;
        }

        if (

            !this.state.CVV ||
            this.state.CVV.length < 3

        ) {
            isSavedCardEMIPayNowDisabled = true;
        }


        if (IssuerId == ISSUER_CONST.AXIS_DEBIT_EMI_ISSUER
            && TenureId != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID) {

            debitEMIPennyTxnNote =
                "Note: You will be paying INR " + pennyTxnAmount + " for this transaction, which will be refunded"

            TermsAndConditionsNote = (
                <div className="checkbox">
                    <input
                        id="isAxisTermAndConditionCheckBoxSet"
                        name="isAxisTermAndConditionCheckBoxSet"
                        onChange={this.myChangeHandler}
                        type="checkbox"
                        value={this.state.isAxisTermAndConditionCheckBoxSet}
                    />
                    <label for="isAxisTermAndConditionCheckBoxSet">
                        {this.DynamictermsAndConditionNoteText.split(":")[0]}
                        <a
                            href={
                                process.env.REACT_APP_PG_CONTROLLER +
                                "PinePGRedirect/DownloadDebitEMITermAndCondition?iIssuerId=" +
                                IssuerId
                            }
                        >
                            <u>  {this.DynamictermsAndConditionNoteText.split(":")[1]}</u>
                        </a>
                    </label>
                    <span className="error-block">
                        {!this.state.isAxisTermAndConditionCheckBoxSet
                            &&
                            this.state.TNCErrorMsg}
                    </span>
                </div>
            );
        }


        if (IssuerId == ISSUER_CONST.ICICI_DEBIT_EMI_ISSUER
            && TenureId != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID) {

            debitEMIPennyTxnNote =
                "Note:  We will deduct Rs. " + pennyTxnAmount + " from your account to validate this transaction. The amount will be reversed in your account.";
        }


        if (IssuerId == ISSUER_CONST.HDFC_CREDIT_EMI_ISSUER
            && TenureId != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID) {
            TermsAndConditionsNote = <div>
                {this.DynamictermsAndConditionNoteText}
            </div>
        }

        return (
            <>
                {this.state.isModelOpen && !this.state.isCardBinValidityCheck ? (
                    <PopUp onClose={this.onClose}>
                        {this.dynamicCardBinFailureMsg(issuerName, cardTypeName)}
                    </PopUp>
                ) : null}
                {
                    this.state.isModelOpen && this.state.isIciciTermAndConditionSet ? (
                        <PopUp onClose={this.onClose}>
                            {this.showICICITermAndConditionPage(tenureMonths, emiPerMonth)}
                        </PopUp>
                    ) : null
                }

                < form
                    id="SaveCardEMIForm"
                    method="post"
                    action={actionName}
                    onSubmit={this.onHandleSubmit}
                >


                    <input
                        type="hidden"
                        id="SequenceId"
                        name="SequenceId"
                        value={this.props.sequenceId}
                    />
                    <input
                        type="hidden"
                        id="IsSavedCardEmiTransaction"
                        name="IsSavedCardEmiTransaction"
                        value="1"
                    />
                    <input
                        type="hidden"
                        id="CardTypeId"
                        name="CardTypeId"
                        value={CardTypeId}
                    />
                    <input
                        type="hidden"
                        id="EmiTypeId"
                        name="EmiTypeId"
                        value={EmiTypeId}
                    />
                    <input type="hidden" id="TxnType" name="TxnType" value={TxnType} />
                    <input
                        type="hidden"
                        id="PaymentModeId"
                        name="PaymentModeId"
                        value={PaymentModeId}
                    />
                    <input
                        type="hidden"
                        id="MerchantReturnUrl"
                        name="MerchantReturnUrl"
                        value={
                            this.props.merchant_payment_data.merchant_data.merchant_return_url
                        }
                    />
                    <input
                        type="hidden"
                        id="PinePGTxnId"
                        name="PinePGTxnId"
                        value={this.props.merchant_payment_data.txn_data.pine_pg_txn_id}
                    />
                    <input type="hidden" id="IssuerId" name="IssuerId" value={IssuerId} />
                    <input
                        type="hidden"
                        id="SchemeId"
                        name="SchemeId"
                        value={this.schemeID}
                    />
                    <input type="hidden" id="TenureId" name="TenureId" value={TenureId} />
                    <input
                        type="hidden"
                        id="AmountFromUI"
                        name="AmountFromUI"
                        value={AmountFromUI}
                    />

                    {
                        SendOTPEnabled ? isOtpToBeShown :
                            <div class="row" id="paynow">
                                <div class="col-lg-5 col-md-5 col-sm-5 col-7 mt-2  mb-3">

                                    <input
                                        className="form-control"
                                        type="password"
                                        id="CVV"
                                        name="CVV"
                                        onChange={this.myChangeHandler}
                                        value={this.state.CVV}
                                        onKeyPress={this.isNumber}
                                        maxLength="4"
                                        required=""
                                        format="####"
                                        placeholder="CVV"
                                        autoComplete="off"
                                        onPaste={event => event.preventDefault()}
                                        onCopy={event => event.preventDefault()}

                                    />
                                    <span className="error-block">
                                        {this.state.CVV != null &&
                                            this.state.CVV.length < 3 &&
                                            "Please Enter CVV"}
                                    </span>
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-5 mt-2 mb-3">
                                    <button class="btn  btn-green mr-3" type="submit"
                                        disabled={isSavedCardEMIPayNowDisabled}
                                        ref={btn => { this.btn = btn; }}
                                        id="SavedCardEMIPayNowButton"
                                    >Pay now</button>
                                </div>
                                {(isTenureContainsSpecialOffers) ?
                                    (<div class="col-lg-2 col-md-2 col-sm-2 col-2 mt-2 mb-3">
                                        <p class="text-blue fs-11 choose-another-plan-sub-head pull-right">
                                            Special offer applied
                                    </p>
                                    </div>
                                    ) : (null)}
                                <div className="col-12 mb-3 note">{debitEMIPennyTxnNote}</div>
                                <div className="col-12 text-left note-text">
                                    {TermsAndConditionsNote}
                                </div>
                            </div>
                    }
                </form >




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
        selected_emi_data:
            state.merchantPaymentDataFetchingReducer.selected_emi_data,
        token: state.merchantPaymentDataFetchingReducer.token,
        paymentAmountUI: state.merchantPaymentDataFetchingReducer.paymentAmountUI,
        paymentModeId: state.merchantPaymentDataFetchingReducer.paymentModeId
    };
};

export default connect(mapStateToProps)(SavedCardEMI);