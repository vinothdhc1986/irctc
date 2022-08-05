import React from "react";
import { connect } from "react-redux";
import "../../../../css/style.css";
import PopUp from "../../../HOC/PopUp";
import { EMIType, Cards, ConstCardTypeConfigData } from "..";
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
    onValidateOTP,
    OrderConfirmation
} from "../../../../stores/actions/CommonAction";

import MerchantPaymentDataUtils from "../../../../utils/MerchantPaymentDataUtils";
import * as ISSUER_CONST from "../../../../Constants/IssuersConstants";
import { findAllInRenderedTree } from "react-dom/test-utils";
import ValidatedInput from "react-number-format";

class DebitEMISavedCardOTP extends React.Component {
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
            MaxAttemptsReached: false,
            hostResponseCode: "",
            isKotakTermAndConditionCheckBoxSet: false

        };
        this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
        this.typingTimer = null; //timer identifier
        this.doneTypingInterval = 1000;
        this.CardValidationModel = {
            DebitCardNumber: null,
            DebitMobileNo: null,
            issuer_id: null,
            tenure_id: null,
            card_expiry_date: null,
            loan_amount: null,
            mobile_no: null
        };


        this.emiModel = {
            CardTypeId: null,
            CardNumber: null,
            CardHolderName: null,
            CardExpiryDate: null,
            CardCVVTypeId: null,
            isCardToBeSaved: null,
            IsSavedCardNonEmiTransaction: null,
            IsSavedCardEmiTransaction: null,
            TenureId: null,
            SchemeId: null,
            SequenceId: null,
            IssuerId: null,
            PinePGTxnId: null,
            MerchantReturnUrl: null,
            TxnType: null,
            PaymentModeId: null,
            AmountFromUI: null,
            IsSavedCardEmiTransaction: null,
            TenureId: null,
            SchemeId: null,
            EmiTypeId: null,
            MobileNo: null,
            otpValue: null,
            RetryCall: 0
        };

        this.schemeID = null;
        this.loanAmount = null;
        this.selected_emi_data = null;
        this.HDFCTermAndConditionData = null;
        this.InterestRate = null;
        this.submitOTPClicked = false;
        this.onContinueButtonClicked = false;
        this.TermsAndConditionsNote = "";
        this.DynamictermsAndConditionNoteText = null;
    }
    onClose = () => {
        this.setState({
            isModelOpen: false,
            isDebitEMICheckEleg: false,
            OTPValue: "",
            isTermAndConditionSet: false,
            isTermAndConditionCheckBoxSet: false,
            TNCErrorMsg: "",
            OTPValidationFailureMsg: "",
            isCardToBeSaved: false,
            MaxAttemptsReached: false

        });
        this.submitOTPClicked = false;
        this.onContinueButtonClicked = false;
    };
    onCardNumberKeyUp = () => {
        if (this.typingTimer) clearTimeout(this.typingTimer); // Clear if already set
        this.typingTimer = setTimeout(
            this.onCardValidation,
            this.doneTypingInterval
        );
    };


    EncryptUsingAes = (Data, RandomKey) => {
        let CryptoJS1 = window.CryptoJS;
        RandomKey = RandomKey.toString();

        var key = CryptoJS1.enc.Utf8.parse(RandomKey);
        var iv = key;

        var encryptedData = CryptoJS1.AES.encrypt(
            CryptoJS1.enc.Utf8.parse(Data),
            key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS1.mode.CBC,
                padding: CryptoJS1.pad.Pkcs7
            }
        );
        return encryptedData;
    };

    EncryptCardNumberUsingAes(Data) {

        let cardInfoData = this.objMerchantPaymentDataUtils.GetPaymentModeDataForPaymentModeId(
            this.props.merchant_payment_data,
            this.props.paymentModeId);

        if (cardInfoData == null || cardInfoData[0] == null) {
            return;
        }
        let RandomKey = cardInfoData[0].data.RandomNumber;
        var encryptedData = "";
        encryptedData = this.EncryptUsingAes(Data, RandomKey);
        return encryptedData.toString();
    }

    onCardNumberKeyDown = () => {
        clearTimeout(this.typingTimer);
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




    onCardValidation = event => {
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
                } else if (responseData.response_code == -136) {
                    this.props.dispatch(SESSION_EXPIRES());
                } else {
                    this.setState({
                        ...this.state,
                        isCardBinValidityCheck: false,
                        isModelOpen: true
                    });
                }
            })
            .catch(error => { });
    };

    onDebitEMICeckEleg(callback) {
        let valid = false;

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
                }

                callback(valid, responseData.response_message);

            })
            .catch(error => { });

        return valid;
    }
    GetEMIModel = () => {


        return (this.emiModel = {
            CardTypeId: this.props.selected_emi_data.cardType,
            EmiTypeId: this.props.selected_emi_data.emiType,
            PaymentModeId: "14",
            MerchantReturnUrl: this.props.merchant_payment_data.merchant_data.merchant_return_url,
            PinePGTxnId: this.props.merchant_payment_data.txn_data.pine_pg_txn_id,
            IssuerId: this.props.selected_emi_data.issuerId,
            TenureId: this.props.selected_emi_data.tenureId,

            SchemeId: this.schemeID,
            AmountFromUI: this.props.paymentAmountUI,
            CardNumber: this.state.DebitCardNumber,
            MobileNo: this.state.DebitMobileNo,
            isCardToBeSaved: this.state.isDebitCardToBeSaved,
            otpValue: this.state.OTPValue,
            RetryCall: this.RetryCall,
            SequenceId: this.props.sequenceId,
            IsSavedCardEmiTransaction: 1

        });


    };


    onClickDebitEMIConfirmOtp(callback) {
        let valid = -1;
        let emiModelData = this.GetEMIModel();
        if (!emiModelData) {
            return;
        }
        this.props
            .dispatch(
                OrderConfirmation(this.props.token, emiModelData)
            )

            .then((json) => {
                let responseData = json.data;

                if (responseData.response_code == 1) {
                    valid = responseData.response_code;
                    callback(valid);
                }
                else if (responseData.validate_otp_response != null &&
                    responseData.validate_otp_response.host_response_code == '-337') {


                    if (!responseData.validate_otp_response.IsMaxAttemptsExcceded) {

                        this.setState({ OTPValidationFailureMsg: "Please enter Valid OTP, " + responseData.validate_otp_response.otp_attempts_left + " Attempts Left" });
                        callback(null);
                    }
                    else {

                        this.setState({
                            OTPValidationFailureMsg: "Max Attempts Reached, User now can  click on cancel button to re- initiate check eligibility call",
                            MaxAttemptsReached: true
                        });

                        callback(null);
                    }
                }

                else {
                    valid = responseData.response_code;
                    callback(valid);
                }


            })
            .catch((error) => {
                console.log(error);
            });
    };

    onClickDebitEMISendOtp = event => {
        event.preventDefault();

        if (
            this.props.selected_emi_data.issuerId ==
            ISSUER_CONST.KOTAK_DEBIT_EMI_ISSUER &&
            !this.state.isKotakTermAndConditionCheckBoxSet
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
                                this.onDebitEMICeckEleg((status, responseMsg) => {
                                    if (status) {
                                        this.btn.removeAttribute("disabled");
                                        //show otp page
                                        this.setState({
                                            isDebitEMICheckEleg: true,
                                            isModelOpen: true
                                        });
                                    } else {
                                        this.btn.removeAttribute("disabled");
                                        this.setState({
                                            isDebitEMICheckEleg: false,
                                            isModelOpen: true,
                                            hostResponseCode: responseMsg
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
                            }
                        })
                        .catch(error => { });

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

    onSubmitOTP = event => {
        let otpValue = this.state.OTPValue;
        event.preventDefault();
        if (otpValue == null || otpValue.length != 6) {
            return;
        }
        event.preventDefault();
        this.submitOTPClicked = true;
        this.props
            .dispatch(CheckSession(this.props.token))
            .then(json => {
                let responseData = json.data;
                if (responseData.response_code == 1) {
                    let callbackProps = this.props;
                    let callbackStates = this.state;
                    if (this.selected_emi_data.issuerId == ISSUER_CONST.KOTAK_DEBIT_EMI_ISSUER
                        || this.selected_emi_data.issuerId == ISSUER_CONST.FEDERAL_DEBIT_EMI_ISSUER) {

                        this.onClickDebitEMIConfirmOtp((responseCode) => {
                            if (responseCode != null) {

                                this.props.dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
                                document.getElementById("DebitEMISavedCardForm").submit();
                            }

                            else {
                                this.submitOTPClicked = false;
                                this.RetryCall = this.RetryCall + 1;
                            }


                        })
                    }
                    else {

                        this.onValidateOTP(onValidateOTPResponse => {
                            if (onValidateOTPResponse) {
                                this.HDFCTermAndConditionData = onValidateOTPResponse;
                                // document.getElementById("CardsForm").submit();
                                //show otp page
                                this.onClose();
                                this.setState({
                                    isTermAndConditionSet: true,
                                    isModelOpen: true
                                });
                                this.submitOTPClicked = false;
                            } else {
                                //show in valid otp error
                                // this.setState({
                                //   isCardBinValidityCheck: false,
                                //   isModelOpen: true
                                // });
                                this.submitOTPClicked = false;
                            }
                        });
                    }
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
    onValidateOTP(callback) {
        let valid = false;

        let validateOTPData = {

            scheme_id: this.schemeID,
            issuer_id: this.selected_emi_data.issuerId,
            tenure_id: this.selected_emi_data.tenureId,
            loan_amount: this.loanAmount,
            mobile_no: this.state.DebitMobileNo,
            otp: this.state.OTPValue,
            interest_rate: this.InterestRate,
            sequence_id: this.props.sequenceId
        };

        let otpValue = { otp: this.state.OTPValue };
        this.props
            .dispatch(onValidateOTP(this.props.token, validateOTPData))
            .then(json => {
                let responseData = json.data;
                if (responseData.response_code == 1) {
                    callback(responseData.validate_otp_response);
                } else if (!responseData.validate_otp_response.IsMaxAttemptsExcceded) {
                    this.setState({ OTPValidationFailureMsg: "Please enter Valid OTP, " + responseData.validate_otp_response.otp_attempts_left + " Attempts Left" });
                    callback(null);
                }
                else {

                    this.setState({
                        OTPValidationFailureMsg: "Max Attempts Reached, User now can  click on cancel button to re- initiate check eligibility call",
                        MaxAttemptsReached: true
                    });

                    callback(null);
                }
            })
            .catch(error => { });

        return valid;
    }

    myChangeHandler = event => {

        let nam = event.target.name;
        let val = event.target.value;
        if (nam == "isTermAndConditionCheckBoxSet") {
            this.setState({
                isTermAndConditionCheckBoxSet: event.target.checked
            });
            return;
        }

        if (nam == "isKotakTermAndConditionCheckBoxSet") {
            this.setState({
                isKotakTermAndConditionCheckBoxSet: event.target.checked,
                TNCErrorMsg: "",
            });
            return;
        }

        if (nam == "isDebitCardToBeSaved") {
            this.setState({
                isDebitCardToBeSaved: event.target.checked
            });
            return;
        }
        this.setState({ [nam]: val });


    };




    dynamicCardBinFailureMsg = (issuerName, cardTypeName) => {

        let errortext = this.state.hostResponseCode;

        if (this.state.hostResponseCode === "ELIGIBILITY_CHECK_FAILED") {

            errortext = " Your " + issuerName.toLowerCase() +
                " is  presently not eligible for EMI.Please continue to quickly check" +
                " your eligibility for a different tenure or card."
        }

        // let errortext =
        //     " Your " + issuerName.toLowerCase() +
        //     " is  presently not eligible for EMI.Please continue to quickly check" +
        //     " your eligibility for a different tenure or card."
        // if (this.state.hostResponseCode === "A033") {
        //     errortext = "Debit Card EMI offer is not available for the entered details. ";
        // }
        // else if (this.state.hostResponseCode === "A042") {
        //     errortext = "Transaction Value is greater than pre-approved limit. To check your Debit Card Pre approved limit send SMS, MYHDFC to 5676712";
        // }


        return (
            <div class="modal-body clearfix">
                <div class="col-12 cardeligibilityfailuremsg">
                    {/* src="../../images/warning.png"  */}
                    <img src={`../../${process.env.PUBLIC_URL}/images/warning.png`} alt="not eligible" />
                    <p class="text-black mt-3 mb-2">
                        {errortext}

                    </p>
                    {this.state.hostResponseCode === "ELIGIBILITY_CHECK_FAILED" ?
                        <p class="text-center text-green"> It won't even take a minute!</p> : <></>}
                </div>

                <div class="col-12"></div>
            </div >
        );
    };
    showDebitEMIOTP = () => {
        return (
            <div className="modal-body clearfix">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h2>Enter OTP</h2>
                    <p>OTP has been sent to your registered mobile no.</p>
                </div>
                <div className="col-lg-12 col-md-10 col-sm-10 col-12 col-centered enterotp mb-3">
                    <ValidatedInput
                        className="form-control"
                        type="text"
                        id="OTPValue"
                        name="OTPValue"
                        value={this.state.OTPValue}
                        required=""
                        format="######"
                        onValueChange={values => {
                            const { value } = values;
                            this.setState({
                                OTPValue: value,
                                OTPValidationFailureMsg: ""


                            });
                        }}
                    />
                    <label for="OTPValue">
                        <span className="dot mr-1"></span>
                        <span className="dot mr-1"></span>
                        <span className="dot mr-1"></span>
                        <span className="dot mr-1"></span>
                        <span className="dot mr-1"></span>
                        <span className="dot mr-1"></span>
                    </label>
                </div>
                <div className="col-12 p-0">
                    <button
                        className="btn btn-green"
                        disabled={
                            this.state.OTPValue == "" || this.submitOTPClicked
                                ? true
                                : this.state.OTPValue.length === 6
                                    ? this.state.MaxAttemptsReached ? true : false
                                    : true
                        }
                        onClick={this.onSubmitOTP}
                    >
                        Continue{" "}
                    </button>
                    <button className="btn btn-grey" onClick={this.onClose}>
                        Cancel{" "}
                    </button>
                </div>
                <div className="mt-4 justify-content-center">
                    {this.TermsAndConditionsNote}
                </div>
                <span className="error-block">
                    {this.state.OTPValidationFailureMsg}
                </span>
            </div>
        );
    };

    showHDFCTermAndConditionPage = () => {
        let data = this.HDFCTermAndConditionData;
        let issuerId = this.selected_emi_data.issuerId;
        return (
            <div >
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h2>Payment Summary</h2>
                </div>
                <div class="col-12 paymentSummaryDetail">
                    <div class="row">
                        <div class="col-6 text-left fw-600">
                            <p>Customer name</p>
                        </div>
                        <div class="col-6 text-right">
                            <p>{data.customer_name}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 text-left fw-600">
                            <p>Merchant name</p>
                        </div>
                        <div class="col-6 text-right">
                            <p>{data.merchant_name}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 text-left fw-600">
                            <p>EMI </p>
                        </div>
                        <div class="col-6 text-right">
                            <p>₹{data.emi_amount_in_paise / 100}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 text-left fw-600">
                            <p>Interest</p>
                        </div>
                        <div class="col-6 text-right">
                            <p>{data.interest_rate / 10000}%</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 text-left fw-600">
                            <p>Amount </p>
                        </div>
                        <div class="col-6 text-right">
                            <p>₹{data.total_amount_in_paise / 100}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 text-left fw-600">
                            <p>Tenure </p>
                        </div>
                        <div class="col-6 text-right">
                            <p>{data.tenure_in_months} Months</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 text-left fw-600">
                            <p>Address </p>
                        </div>
                        <div class="col-6 text-right">
                            <p>{data.address}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 text-left fw-600">
                            <p>Last 6 digit</p>
                        </div>{" "}
                        <div class="col-6 text-right">
                            <p>{data.last6digitaccountnumber}</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 p-0 text-left note-text">
                    <div class="checkbox">
                        <input
                            id="isTermAndConditionCheckBoxSet"
                            name="isTermAndConditionCheckBoxSet"
                            type="checkbox"
                            onChange={this.myChangeHandler}
                            value={this.state.isTermAndConditionCheckBoxSet}
                        />
                        <label htmlFor="isTermAndConditionCheckBoxSet">
                            {" "}
              I accept the{" "}
                            <a
                                href={
                                    process.env.REACT_APP_PG_CONTROLLER +
                                    "PinePGRedirect/DownloadHDFCDebitEMITermAndCondition?iIssuerId=" +
                                    issuerId
                                }
                            >
                                <u> terms and conditions</u>
                            </a>{" "}
              and{" "}
                            <a
                                href={
                                    process.env.REACT_APP_PG_CONTROLLER +
                                    "PinePGRedirect/DownloadHDFCSchedulingCharges?iIssuerId=" +
                                    issuerId
                                }
                            >
                                <u> schedule of charges</u>
                            </a>
                            {" "} of the HDFC bank.
            </label>
                        <span className="error-block">
                            {!this.state.isTermAndConditionCheckBoxSet
                                &&
                                this.state.TNCErrorMsg}

                        </span>
                    </div>
                </div>
                <div class="col-12 p-0 pull-right text-right">
                    <button class="btn btn-grey" onClick={this.onClose}
                        disabled={this.onContinueButtonClicked}>
                        Cancel{" "}

                    </button>
                    <button
                        class="btn btn-green"
                        onClick={this.onTermAndConditionSubmitDebitEMI}
                        disabled={this.onContinueButtonClicked}
                    >
                        Continue{" "}
                    </button>
                </div>
            </div >
        );
    };

    onTermAndConditionSubmitDebitEMI = event => {
        event.preventDefault();
        if (!this.state.isTermAndConditionCheckBoxSet) {
            this.setState({ TNCErrorMsg: "Please accept Terms and Conditions." });
            return;
        }

        this.onContinueButtonClicked = true;
        this.props
            .dispatch(CheckSession(this.props.token))
            .then(json => {
                let responseData = json.data;
                if (responseData.response_code == 1) {
                    this.props.dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
                    document.getElementById("DebitEMISavedCardForm").submit();
                } else {
                    //show session pop up
                    this.props.dispatch(SESSION_EXPIRES());

                    this.onContinueButtonClicked = false;
                }
            })
            .catch(error => {
                //techincal error
                //alert("onHandleSubmit:" + error);
            });
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
    CheckIsDebitEMiIssuer = issuerId => {
        let isDebitEMiIssuer = false;
        //alert(ISSUER_CONST.ISSUER_DEBIT_EMI.includes(issuerId) + issuerId);
        if (ISSUER_CONST.ISSUER_DEBIT_EMI.includes(issuerId)) {
            isDebitEMiIssuer = true;
        }
        return isDebitEMiIssuer;
    };

    // validation part
    CreditCardValidator = value => {
        var nCheck = 0,
            nDigit = 0,
            bEven = false;

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }
            nCheck += nDigit;
            bEven = !bEven;
        }
        return nCheck % 10 == 0;
    };
    //validation part ends

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

        let issuerName = null;
        let cardTypeName = null;
        let CustomerId = 0;
        let isSaveCardEnabled = false;
        let KotakTermsAndConditionsNote = "";
        let actionName =
            process.env.REACT_APP_PG_CONTROLLER + "pinepg/v2/submit/debitemi?token=" +
            encodeURIComponent(this.props.token);




        CustomerId = this.objMerchantPaymentDataUtils.GetCustomerId(
            merchant_payment_data.customer_data
        );


        isSaveCardEnabled = this.objMerchantPaymentDataUtils.GetSavedCardEnabled(
            merchant_payment_data.merchant_data
        );

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
            // PaymentModeId = selected_emi_data.paymentMode;
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

            cardTypeName = ConstCardTypeConfigData.filter(
                obj => obj.CARD_TYPE_ID == CardTypeId
            )[0].NAME;
            // alert("issyuer name" + issuerName);
            // alert("cardTypeName " + cardTypeName);
            let tenureMonths = tenuredata.tenure_in_month;
            let emiPerMonth = tenuredata.monthly_installment;
            this.schemeID = tenuredata.applicable_scheme.scheme_id;
            this.loanAmount = tenuredata.loan_amount;
            this.InterestRate = tenuredata.bank_interest_rate;
        }


        if (IssuerId == ISSUER_CONST.HDFC_DEBIT_EMI_ISSUER
        ) {
            this.TermsAndConditionsNote = <div>
                {this.DynamictermsAndConditionNoteText}
            </div>
        }


        if (IssuerId == ISSUER_CONST.KOTAK_DEBIT_EMI_ISSUER) {


            KotakTermsAndConditionsNote = (
                <div className="checkbox">
                    <input
                        id="isKotakTermAndConditionCheckBoxSet"
                        name="isKotakTermAndConditionCheckBoxSet"
                        onChange={this.myChangeHandler}
                        type="checkbox"
                        value={this.state.isKotakTermAndConditionCheckBoxSet}
                    />
                    <label for="isKotakTermAndConditionCheckBoxSet">
                        {this.DynamictermsAndConditionNoteText.split(":")[0]}
                        <a
                            href={
                                process.env.REACT_APP_PG_CONTROLLER +
                                "PinePGRedirect/DownloadDebitEMITermAndCondition?iIssuerId=" +
                                IssuerId
                            }
                        >
                            <u>   {this.DynamictermsAndConditionNoteText.split(":")[1]}</u>
                        </a>
                    </label>
                    <span className="error-block">
                        {!this.state.isKotakTermAndConditionCheckBoxSet &&
                            this.state.TNCErrorMsg}
                    </span>
                </div>
            );
        }
        let isSendOtpDisabled = false;
        if (
            !this.state.isCardBinValidityCheck ||
            !this.state.isCardValid ||
            !this.state.DebitMobileNo ||
            this.state.DebitMobileNo.length != 10
        ) {
            isSendOtpDisabled = true;
        }
        return (
            <>
                {this.state.isModelOpen && (!this.state.isCardBinValidityCheck
                    || !this.state.isDebitEMICheckEleg) ? (
                        <PopUp onClose={this.onClose}>
                            {this.dynamicCardBinFailureMsg(issuerName, cardTypeName)}
                        </PopUp>
                    ) : null}

                {this.state.isModelOpen && this.state.isDebitEMICheckEleg ? (
                    <PopUp onClose={this.onClose} isContinueButtonToBeHide="true">
                        {this.showDebitEMIOTP()}
                    </PopUp>
                ) : null}
                {this.state.isModelOpen && this.state.isTermAndConditionSet ? (
                    <PopUp onClose={this.onClose} isContinueButtonToBeHide="true">
                        {this.showHDFCTermAndConditionPage()}
                    </PopUp>
                ) : null}

                <form
                    id="DebitEMISavedCardForm"
                    method="post"
                    action={actionName}
                // onSubmit={this.onHandleSubmit}
                >
                    <input
                        type="hidden"
                        id="CardTypeId"
                        name="CardTypeId"
                        value={CardTypeId}
                    />

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
                        id="EmiTypeId"
                        name="EmiTypeId"
                        value={EmiTypeId}
                    />
                    <input type="hidden" id="TxnType" name="TxnType" value={TxnType} />
                    <input
                        type="hidden"
                        id="PaymentModeId"
                        name="PaymentModeId"
                        value="14"
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
                    <input
                        type="hidden"
                        id="CardNumber"
                        name="CardNumber"
                        value={this.state.DebitCardNumber}
                    />

                    <input
                        type="hidden"
                        id="MobileNo"
                        name="MobileNo"
                        value={this.state.DebitMobileNo}
                    />


                    <input
                        type="hidden"
                        id="isCardToBeSaved"
                        name="isCardToBeSaved"
                        value={this.state.isDebitCardToBeSaved}
                    />
                </form>
                <div class="col-lg-12 p-0 checkeligibility clearfix">

                    <div class="col-lg-2 col-md-2 col-sm-2 col-12 mb-3">
                        <button
                            class="btn btn-medium btn-green"
                            id="sendOtp"
                            name="sendOtp"
                            onClick={this.onClickDebitEMISendOtp}
                            ref={btn => { this.btn = btn; }}
                        >
                            Send OTP
              </button>
                    </div>
                    <div className="col-12 text-left note-text">
                        {KotakTermsAndConditionsNote}
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
        selected_emi_data:
            state.merchantPaymentDataFetchingReducer.selected_emi_data,
        token: state.merchantPaymentDataFetchingReducer.token,
        paymentAmountUI: state.merchantPaymentDataFetchingReducer.paymentAmountUI,
        paymentModeId: state.merchantPaymentDataFetchingReducer.paymentModeId
    };
};

export default connect(mapStateToProps)(DebitEMISavedCardOTP);
