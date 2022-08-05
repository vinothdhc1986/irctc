import React, { Component } from "react";
import { connect } from "react-redux";

import PopUp from "../../HOC/PopUp";
import Axios from "axios";
import { SUCCESS } from "../../../Constants/ResponseCodesConstant";

import BuyNowPayLaterTenure from "../BuyNowPayLater/BuyNowPayLaterTenure";
import { SetPaymentAmount } from "../../../stores/actions/PaymentModeAction";
import ValidatedInput from "react-number-format";
import MerchantPaymentDataUtils from "../../../utils/MerchantPaymentDataUtils";
import * as ACQUIRER_CONST from "../../../Constants/AcquirerConstants";
import BNPLTNCDetails from "../BuyNowPayLater/BuyNowPayLaterTermsAndConditions";

import {
    CheckSession,
    CheckIssuerCardBinIsValidEMI,
    CheckBNPLAcquirerElegibilty,
    SESSION_EXPIRES,
    FETCHING_merchantPaymentData_BEGINS,
    onBNPLValidateOTP,
    BNPLOrderConfirmation
} from "../../../stores/actions/CommonAction";




class BuyNowPayLater extends Component {
    constructor(props) {
        super(props);
        this.error = null;
        this.loading = null;

        this.state = {
            payment_mode_data: this.props.merchantPaymentData.payment_mode_data.filter(
                x => x.payment_mode_id == 17
            )[0].data,
            Tenure: "",
            tenureList: "",
            isOtpPageToBeShown: false,
            BNPLCardNumber: "",
            CardNumberErrorMsg: "",
            BNPLMobileNo: "",
            MobileNumberErrorMsg: "",
            isCardValid: false,
            isModelOpen: false,
            isBNPLCheckEleg: false,
            AcquirerId: "",
            OTPValue: "",
            isTermAndConditionSet: false,
            isTermAndConditionCheckBoxSet: false,
            TNCErrorMsg: "",
            OTPValidationFailureMsg: "",
            isCardToBeSaved: false,
            MaxAttemptsReached: false,
            hostResponseCode: "",
            isTNCDetailsShown: false,
            isBNPLTermAndConditionCheckBoxSet: false

        };
        this.state.tenureList = this.state.payment_mode_data.bnpls[0].list_bnpl_data;
        this.typingTimer = null; //timer identifier
        this.doneTypingInterval = 1000;
        this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
        this.loanAmount = null;
        this.InterestRate = null;
        this.TermsAndConditionsNote = "";



    }

    onSubmitOTP = event => {

        if (!this.state.isBNPLTermAndConditionCheckBoxSet) {
            this.setState({ TNCErrorMsg: "Please accept Terms and Conditions." });
            return;
        }


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
                    this.onValidateOTP(onValidateOTPResponse => {

                        debugger;
                        if (onValidateOTPResponse) {
                            this.props
                                .dispatch(
                                    BNPLOrderConfirmation(this.props.token)
                                ).then(json => {
                                    let responseData = json.data;
                                    document.getElementById("BNPLForm").submit();

                                })
                        }
                    });
                }
                else {
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
            card_number: this.state.BNPLCardNumber,
            tenure_id: this.state.Tenure,
            mobile_no: this.state.BNPLMobileNo,
            acquirer_id: this.state.AcquirerId,
            loan_amount: this.loanAmount,
            otp: this.state.OTPValue,
            interest_rate: this.InterestRate
        };


        this.props
            .dispatch(onBNPLValidateOTP(this.props.token, validateOTPData))
            .then(json => {
                let responseData = json.data;
                if (responseData.response_code == 1) {
                    valid = true;
                    callback(valid);
                } else if (!responseData.validate_otp_response.IsMaxAttemptsExcceded) {
                    this.submitOTPClicked = false;
                    this.setState({ OTPValidationFailureMsg: "Please enter Valid OTP, " + responseData.validate_otp_response.otp_attempts_left + " Attempts Left" });
                    callback(null);
                }
                else {
                    this.submitOTPClicked = false;
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
        this.setState({ TNCErrorMsg: "" });
        let nam = event.target.name;
        let val = event.target.value;
        if (nam == "isBNPLTermAndConditionCheckBoxSet") {
            this.setState({
                isBNPLTermAndConditionCheckBoxSet: event.target.checked
            });
            return;
        }


        this.setState({ [nam]: val });


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



                    <div class="col-12 p-0 text-left note-text">
                        <div class="checkbox">
                            <input
                                id="isBNPLTermAndConditionCheckBoxSet"
                                name="isBNPLTermAndConditionCheckBoxSet"
                                type="checkbox"
                                onChange={this.myChangeHandler}
                                value={this.state.isBNPLTermAndConditionCheckBoxSet}
                            />
                            <label htmlFor="isBNPLTermAndConditionCheckBoxSet">
                                {" "}
              I agree to Terms and Conditions of the

                                <a
                                    class="text-green"
                                    href="https://v1.hdfcbank.com/htdocs/T_n_C/Draft-Customer-Terms-Conditions-Pay-later.pdf"
                                    target="_blank"
                                >
                                    {" "} loan agreement by FlexiPay by HDFC Bank
                </a>

                            </label>
                        </div>
                        <span className="error-block">
                            {!this.state.isBNPLTermAndConditionCheckBoxSet
                                &&
                                this.state.TNCErrorMsg}

                        </span>
                    </div>

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
                        disabled={
                            this.onContinueButtonClicked}>
                        Cancel{" "}
                    </button>
                    <button
                        class="btn btn-green"
                        onClick={this.onTermAndConditionSubmitDebitEMI}
                        disabled={
                            this.onContinueButtonClicked}
                    >
                        Continue{" "}
                    </button>
                </div>
            </div >
        );
    };

    onClickProceedBtn = (
    ) => {

        this.setState({ isOtpPageToBeShown: true }); //({isOtpPageToBeShown: true });

    }


    onCardNumberKeyPress = () => {
        this.setState({ CardNumberErrorMsg: "" });
    }

    onMobileNumberKeyPress = () => {
        this.setState({ MobileNumberErrorMsg: "" });
    }

    setAmountGlobally = (authAmount) => {

        this.props.dispatch(SetPaymentAmount(authAmount));
    };

    onClickTenureSelectionRadioButton = (tenureId, authAmount, interestRate) => {

        this.setState({
            Tenure: tenureId,
            isOtpPageToBeShown: false,
            AcquirerId: ACQUIRER_CONST.FLEXIPAY_BY_HDFC_ACQUIRER

        })

        this.loanAmount = authAmount;
        this.InterestRate = interestRate;
        //this.props.dispatch(SetTenureId(tenureId));
        this.setAmountGlobally(authAmount);
    };

    onCardNumberKeyUp = () => {
        if (this.typingTimer) clearTimeout(this.typingTimer); // Clear if already set
        this.typingTimer = setTimeout(
            this.onCardValidation,
            this.doneTypingInterval
        );



        setTimeout(() => {
            this.setState({ ShowCardErrorMsg: true });
        }, this.doneTypingInterval);
    };

    dynamicCardBinFailureMsg = (issuerName) => {
        let errortext =
            " Your " + issuerName.toLowerCase() +
            " card is  presently not eligible for EMI.Please continue to quickly check" +
            " your eligibility for a different tenure or card."
        if (this.state.hostResponseCode === "A033") {
            errortext = "Debit Card EMI offer is not available for the entered details. ";
        }
        else if (this.state.hostResponseCode === "A042") {
            errortext = "Transaction Value is greater than pre-approved limit. To check your Debit Card Pre approved limit send SMS, MYHDFC to 5676712";
        }


        return (
            <div class="modal-body clearfix">
                <div class="col-12 cardeligibilityfailuremsg">
                    {/* src="../../images/warning.png"  */}
                    <img src={`../../${process.env.PUBLIC_URL}/images/warning.png`} alt="not eligible" />
                    <p class="text-black mt-3 mb-2">
                        {errortext}
                    </p>
                    {this.state.hostResponseCode == "A033" || this.state.hostResponseCode == "A042" ?
                        <></> : <p class="text-center text-green"> It won't even take a minute!</p>}
                </div>

                <div class="col-12"></div>
            </div >
        );
    };


    onClickTNCDetails = () => {
        this.setState({
            isTNCDetailsShown: true
        });
    };
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


    onClose = () => {
        this.setState({
            isModelOpen: false,
            isBNPLCheckEleg: false,
            OTPValue: "",
            isTermAndConditionSet: false,
            isTermAndConditionCheckBoxSet: false,
            TNCErrorMsg: "",
            OTPValidationFailureMsg: "",
            isCardToBeSaved: false,
            MaxAttemptsReached: false,
            isTNCDetailsShown: false
        });

    };
    EncryptCardNumberUsingAes(Data) {

        let cardInfoData = this.objMerchantPaymentDataUtils.GetPaymentModeDataForPaymentModeId(
            this.props.merchantPaymentData,
            this.props.paymentModeId);

        if (cardInfoData == null || cardInfoData[0] == null) {
            return;
        }
        let RandomKey = cardInfoData[0].data.RandomNumber;;
        var encryptedData = "";
        encryptedData = this.EncryptUsingAes(Data, RandomKey);
        return encryptedData.toString();
    }


    GetCardBinModel = () => {
        let cardNo = this.state.BNPLCardNumber;
        cardNo = cardNo.trim();
        if (cardNo.length < 9) {
            return null;
        }

        if (this.CreditCardValidator(cardNo)) {
            this.setState({
                isCardValid: true
            });



            cardNo = this.EncryptCardNumberUsingAes(cardNo);

            return (this.CardValidationModel = {
                card_number: cardNo,
                tenure_id: this.state.Tenure,
                mobile_no: this.state.BNPLMobileNo,
                acquirer_id: this.state.AcquirerId,
                loan_amount: this.loanAmount
            });
        }
        else {

            this.setState({
                isCardValid: false
            });

            return null;
        }


    };


    onCardValidation = event => {
        let cardBinModelData = this.GetCardBinModel();
        if (!cardBinModelData) {
            this.setState({ CardNumberErrorMsg: "Please enter valid card no." })
            return;
        }

    };

    CheckMobileNumber = () => {
        if (this.state.BNPLMobileNo != "" &&
            this.state.BNPLMobileNo.length !== 10) {
            this.setState({ MobileNumberErrorMsg: "Please enter valid mobile number" });
        }
        else {
            this.setState({ MobileNumberErrorMsg: "" });
        }

    }

    onBNPLCeckEleg(callback) {
        let valid = false;

        let cardBinModelData = this.GetCardBinModel();
        if (!cardBinModelData) {
            return;
        }

        this.props
            .dispatch(
                CheckBNPLAcquirerElegibilty(this.props.token, cardBinModelData)
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

    onClickBNPLSendOtp = event => {
        event.preventDefault();

        this.btn.setAttribute("disabled", "disabled");
        this.props
            .dispatch(CheckSession(this.props.token))
            .then(json => {
                let responseData = json.data;
                if (responseData.response_code == 1) {
                    let callbackProps = this.props;
                    let callbackStates = this.state;
                    this.onBNPLCeckEleg((status, responseMsg) => {
                        if (status) {

                            this.btn.removeAttribute("disabled");
                            this.setState({
                                isBNPLCheckEleg: true,
                                isModelOpen: true
                            });
                        } else {
                            this.btn.removeAttribute("disabled");
                            this.setState({
                                isBNPLCheckEleg: false,
                                isModelOpen: true

                            });
                        }
                    });
                } else {

                    this.btn.removeAttribute("disabled");
                    this.props.dispatch(SESSION_EXPIRES());
                }
            })
            .catch(error => {

            });
    };



    render() {

        const tenureList = this.state.tenureList;
        let actionName =
            process.env.REACT_APP_PG_CONTROLLER + "pinepg/v2/submit/bnpl?token=" +
            encodeURIComponent(this.props.token);


        const bnplScehems = tenureList.map(tenure => {
            let isSelected = this.state.Tenure === tenure.tenure_id ? true : false;

            return <BuyNowPayLaterTenure tenure={tenure} isSelected={isSelected}
                onClickProceedBtn={this.onClickProceedBtn} OnBNPLRadioBtnClick={this.onClickTenureSelectionRadioButton} />
        })
        let isSendOtpDisabled = false;
        if (

            !this.state.isCardValid ||
            !this.state.BNPLMobileNo ||
            this.state.BNPLMobileNo.length != 10
        ) {

            isSendOtpDisabled = true;
        }





        let otpData = "";
        if (this.state.isOtpPageToBeShown) {
            otpData = (

                <div class="col-lg-12 p-0 checkeligibility clearfix">
                    <h3>
                        Enter card number & registered mobile number to check eligibility
                     </h3>

                    <div class="row">
                        <div class="col-lg-5 col-md-5 col-sm-5 col-12 mb-3  pr-2">
                            <ValidatedInput
                                class="form-control"
                                type="text"
                                id="BNPLCardNumber"
                                name="BNPLCardNumber"
                                required=""
                                value={this.state.BNPLCardNumber}
                                onKeyPress={this.onCardNumberKeyPress}
                                onBlur={this.onCardNumberKeyUp}
                                format="#### #### #### ####"

                                onValueChange={values => {
                                    const { value } = values;
                                    this.setState({
                                        BNPLCardNumber: value
                                    });

                                }}
                            />
                            <label for="BNPLCardNumber">Enter card no.</label>

                            <span className="error-block">
                                {this.state.CardNumberErrorMsg}




                            </span>
                        </div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-12 mb-3  pr-2">
                            <ValidatedInput
                                class="form-control"
                                type="text"
                                id="BNPLMobileNo"
                                name="BNPLMobileNo"
                                format="###### ####"
                                required=""
                                onBlur={this.CheckMobileNumber}
                                // placeholder="Enter mobile no."
                                onValueChange={values => {
                                    const { value } = values;
                                    this.setState({
                                        BNPLMobileNo: value,
                                        MobileNumberErrorMsg: ""
                                    });
                                }}
                                value={this.state.BNPLMobileNo}
                            />
                            <label for="BNPLMobileNo">Enter mobile no.</label>

                            <span className="error-block">

                                {this.state.MobileNumberErrorMsg}
                            </span>
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-12 mb-3">
                            <button
                                class="btn btn-medium btn-green"
                                id="sendOtp"
                                name="sendOtp"
                                onClick={this.onClickBNPLSendOtp}
                                disabled={isSendOtpDisabled}
                                ref={btn => { this.btn = btn; }}
                            >
                                Send OTP
              </button>
                        </div>

                    </div>
                </div>





            );
        }




        return (

            <>

                {this.state.isTNCDetailsShown ? (
                    <BNPLTNCDetails onClose={this.onClose} />

                ) : null
                }

                {
                    this.state.isModelOpen && (
                        !this.state.isDebitEMICheckEleg) ? (
                        <PopUp onClose={this.onClose}>
                            {this.dynamicCardBinFailureMsg("HDFC")}
                        </PopUp>
                    ) : null
                }

                {
                    this.state.isModelOpen && this.state.isBNPLCheckEleg ? (
                        <PopUp onClose={this.onClose} isContinueButtonToBeHide="true">
                            {this.showDebitEMIOTP()}
                        </PopUp>
                    ) : null
                }


                <form
                    id="BNPLForm"
                    method="post"
                    action={actionName}
                // onSubmit={this.onHandleSubmit}
                >

                    <input
                        type="hidden"
                        id="PaymentModeId"
                        name="PaymentModeId"
                        value="17"
                    />

                    <input
                        type="hidden"
                        id="PinePGTxnId"
                        name="PinePGTxnId"
                        value={this.props.merchantPaymentData.txn_data.pine_pg_txn_id}
                    />
                    <input type="hidden" id="AcquirerId" name="AcquirerId" value={this.state.AcquirerId} />

                    <input type="hidden" id="TenureId" name="TenureId" value={this.state.Tenure} />

                    <input
                        type="hidden"
                        id="AmountFromUI"
                        name="AmountFromUI"
                        value={this.loanAmount}
                    />
                    <input
                        type="hidden"
                        id="CardNumber"
                        name="CardNumber"
                        value={this.state.BNPLCardNumber}
                    />

                    <input
                        type="hidden"
                        id="MobileNo"
                        name="MobileNo"
                        value={this.state.BNPLMobileNo}
                    />



                    <input
                        type="hidden"
                        id="otpValue"
                        name="otpValue"
                        value={this.state.OTPValue}
                    />
                </form>
                <div>
                    {/* <div className="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
                        <div
                            className=""
                            id="nav-creditcard"
                            role="tabpanel"
                            aria-labelledby="nav-creditcard-tab"
                        >
                            <div className="col-12 p-0 bank-list">
                                <span>Flexipay By HDFC</span>

                            </div>
                        </div>
                    </div> */}
                    <div
                        id="collapseflexipay"
                        class="card-body collapse active show"
                        data-parent="#accordion"
                    >

                        <section id="flexipay-content">
                            <div class="container">
                                <div class="col-12 bank-list mt-4 clearfix">
                                    <div class="row">
                                        <div class="col-lg-3 col-md-3 col-sm-6 col-6">
                                            <div class="bank-list-names">
                                                <div class="bank-name">
                                                    <img src="images/banks/flexipay.png" alt="Flexipay" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12 ">

                                        <div class="col-lg-12 p-0 emi-plan clearfix" id="flexipay-tenure">
                                            <h3>Select tenure
                                            <a class="pull-right" data-toggle="modal"
                                                    onClick={this.onClickTNCDetails}>View T&amp;C </a>


                                            </h3>
                                            <div class="row">
                                                {bnplScehems}
                                            </div>
                                        </div>
                                        {otpData}
                                    </div>
                                </div>
                            </div>

                        </section>
                    </div>
                </div >


            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        merchantPaymentData:
            state.merchantPaymentDataFetchingReducer.merchantPaymentData,
        token: state.merchantPaymentDataFetchingReducer.token,
        error: state.merchantPaymentDataFetchingReducer.error,
        loading: state.merchantPaymentDataFetchingReducer.loading,
        paymentAmountUI: state.merchantPaymentDataFetchingReducer.paymentAmountUI,
        paymentModeId: state.merchantPaymentDataFetchingReducer.paymentModeId
    };
};

export default connect(mapStateToProps, null)(BuyNowPayLater);
