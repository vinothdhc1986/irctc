import React from "react";
import { connect } from "react-redux";
import "../../../css/style.css";
import { EMIType, EMITypeContent, ConstCardTypeConfigData } from "../EMI";
import GloablLoader from "../../UIUtil/GloablLoader";
import SavedCard from "../Card/SavedCard";
import AddGreenIcon from "../../../images/icons/add-green-icon.png";
import $ from "jquery";

import * as PAYMENT_MODE_CONST from "../../../Constants/PaymentModeConstants";
import { SetRemovedSequenceId } from "../../../stores/actions/PaymentModeAction";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  NavLink,
} from "react-router-dom";
import { withRouter } from "react-router-dom";
import { SetOtherEMI } from "../../../stores/actions/EmiDataProcessingAction";
import {
  CheckSession,
  CheckIssuerCardBinIsValidEMI,
  CheckDebitEMIIssuerElegibilty,
  FETCHING_MERCHANT_PAYMENT_DATA_BEGINS,
  SESSION_EXPIRES,
  SaveCardRemoval,
  CheckCardIsValidForLoungeTxn
} from "../../../stores/actions/CommonAction";
import MerchantPaymentDataUtils from "../../../utils/MerchantPaymentDataUtils";
import PopUp from "../../HOC/PopUp";
import ValidatedInput from "react-number-format";
import * as ISSUER_CONST from "../../../Constants/IssuersConstants";
import * as EMI_TYPE_CONST from "../../../Constants/EMITypeConstants";

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CardType: "",
      CardImage: "",
      CardNumber: props.pre_filled_card_no || "",
      CardHolderName: null,
      isCardHolderDefaultVal: true,
      CardExpiryMonth: null,
      CardExpiryYear: null,
      CardExpiryDate: '',
      CVV: null,
      SavedCardCVV: null,
      isCardBinValidityCheck: true,
      isModelOpen: false,
      isIciciTermAndConditionSet: false,
      isAxisTermAndConditionCheckBoxSet: false,
      isCardValid: props.is_lounge_txn == true ? true : false,
      isCardCVVValid: false,
      isCardHolderNameValid: false,
      TNCErrorMsg: "",
      isCardToBeSaved: props.is_lounge_txn == true ? true : false,
      isCardPageToBeShown: false,
      SequenceId: "",
      isSaveCardRemoved: false,
      // RemovedSeqId: [],
      SaveCardExpiryYear: "",
      SaveCardExpiryMonth: "",
      cardError: "",
      cVVError: "",
      isCVVDefaultVal: true,
      cardNameError: "",
      expDateLbl: "MM/YY",
      expiryDateError: "",
      SaveCardPayNowShow: false,
      SaveCardcVVError: "",
      isLoungeTxn: props.is_lounge_txn
    };
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
    this.typingTimer = null; //timer identifier
    this.doneTypingInterval = 1000;
    this.SavedCardData = null;
    this.isSaveCardToBeShown = false;

    this.CardValidationModel = {
      card_number: null,
      scheme_id: null,
      issuer_id: null,
      tenure_id: null,
      card_expiry_date: null,
      loan_amount: null,
      mobile_no: null,
    };
    this.schemeID = null;
    this.loanAmount = null;
    this.selected_emi_data = null;
    this.DynamictermsAndConditionNoteText = null;

  }

  onClose = () => {
    this.setState({
      isModelOpen: false,
      isIciciTermAndConditionSet: false,
      TNCErrorMsg: "",
    });
    this.btn.removeAttribute("disabled");
  };

  onTermsAndConditionsClick = () => { };
  onDebitEMICeckEleg(callback) {
    let valid = false;
    let issuerId = this.props.selected_emi_data.issuerId;
    let tenure_id = this.props.selected_emi_data.tenureId;

    if (this.CheckIsDebitEMiIssuer(issuerId) && tenure_id != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID) {
      let cardBinModelData = this.GetCardBinModel();
      if (!cardBinModelData) {
        return;
      }
      this.props
        .dispatch(
          CheckDebitEMIIssuerElegibilty(this.props.token, cardBinModelData)
        )
        .then((json) => {
          let responseData = json.data;
          if (responseData.response_code == 1) {
            valid = true;
          } else {
          }
          callback(valid);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      valid = true;
      callback(valid);
    }
  }

  GetCardBinModel = () => {
    let cardNo = this.state.CardNumber;
    cardNo = cardNo.trim();
    if (cardNo.length < 9) {
      return null;
    }

    if (this.CreditCardValidator(cardNo)) {
      this.setState({
        isCardValid: true,
      });

      cardNo = this.EncryptCardNumberUsingAes(cardNo);
      return {
        card_number: cardNo,
        scheme_id: this.schemeID,
        issuer_id: this.selected_emi_data.issuerId,
        tenure_id: this.selected_emi_data.tenureId,
        card_expiry_date: this.state.CardExpiryDate,
        loan_amount: this.loanAmount,
        mobile_no: "",
      };
    } else {
      this.setState({
        isCardValid: false,
      });
      return null;
    }
  };

  EncryptCardNumberUsingAes(Data) {
    let cardInfoData = this.objMerchantPaymentDataUtils.GetPaymentModeDataForPaymentModeId(
      this.props.merchant_payment_data,
      this.props.paymentModeId
    );

    if (cardInfoData == null || cardInfoData[0] == null) {
      return;
    }
    let RandomKey = cardInfoData[0].data.RandomNumber;

    var encryptedData = "";
    encryptedData = this.EncryptUsingAes(Data, RandomKey);
    encryptedData = encryptedData.toString();

    return encryptedData;
  }

  doCardDetailsAESEncryption = () => {
    let cardNumber = this.state.CardNumber;
    let cardHolderName = this.state.CardHolderName;
    let cardExpiryDate = this.state.CardExpiryDate;

    let month = this.state.CardExpiryMonth;
    //let year = this.state.CardExpiryYear;
    let d = new Date();
    let y = d.getFullYear();
    let yearCentury = y.toString().substring(0, 2);
    let year = yearCentury + this.state.CardExpiryYear;
    let cardCVV = this.state.CVV;

    var encryptedtedString =
      cardNumber +
      ";" +
      cardHolderName +
      ";" +
      month +
      ";" +
      year +
      ";" +
      cardCVV;

    let cardInfoData = this.objMerchantPaymentDataUtils.GetPaymentModeDataForPaymentModeId(
      this.props.merchant_payment_data,
      1
    );

    if (cardInfoData == null || cardInfoData[0] == null) {
      return;
    }

    let EncryptionTerminology = cardInfoData[0].data.EncryptionTerminonlogy;
    let RandomKey = cardInfoData[0].data.RandomNumber;
    var encryptedData = "";
    if (EncryptionTerminology == 1) {
      encryptedData = this.EncryptUsingAes(encryptedtedString, RandomKey);
    } else if (EncryptionTerminology == 2) {
      RandomKey = RandomKey.toString();

      for (let i = 0; i < RandomKey.length; i = i + 5) {
        encryptedtedString =
          encryptedtedString.substr(RandomKey[i]) +
          encryptedtedString.substr(0, RandomKey[i]);
        console.log(encryptedtedString);
      }
      encryptedData = this.GetHexEncode(encryptedtedString);
      console.log(encryptedData);
    }

    if (EncryptionTerminology == 1 || EncryptionTerminology == 2) {
      encryptedData = encryptedData.toString();
      var encryptedCardNumber = encryptedData.substr(
        0,
        encryptedData.length / 2
      );
      var encryptedName = encryptedData.substr(encryptedData.length / 2);

      this.setState({
        CardNumber: encryptedCardNumber,
        CardHolderName: encryptedName,
        CVV: "..................",
      });

      this.setState({
        CVV: "..................",
      });
    }
  };
  GetHexEncode = (data) => {
    var hex, i;

    var result = "";
    for (i = 0; i < data.length; i++) {
      hex = data.charCodeAt(i).toString(16);
      result = result + hex;
    }

    return result;
  };
  EncryptUsingAes = (Data, RandomKey) => {
    let CryptoJS1 = window.CryptoJS;
    RandomKey = RandomKey.toString();

    var key = window.CryptoJS.enc.Utf8.parse(RandomKey);
    var iv = key;

    var encryptedData = CryptoJS1.AES.encrypt(
      CryptoJS1.enc.Utf8.parse(Data),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS1.mode.CBC,
        padding: CryptoJS1.pad.Pkcs7,
      }
    );
    return encryptedData;
  };
  onHandleSubmit = (event) => {
    this.btn.setAttribute("disabled", "disabled");
    event.preventDefault();

    if (
      this.props.selected_emi_data.issuerId ==
      ISSUER_CONST.AXIS_DEBIT_EMI_ISSUER &&
      !this.state.isAxisTermAndConditionCheckBoxSet
    ) {
      this.setState({ TNCErrorMsg: "Please accept Terms and Conditions." });
      return;
    }
    this.props
      .dispatch(CheckSession(this.props.token))
      .then((json) => {
        let responseData = json.data;
        if (responseData.response_code == 1) {
          if (this.props.paymentModeId == 1) {
            //normal submit
            this.props.dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
            this.doCardDetailsAESEncryption();
            //this.props.history..push("/Edge/?token" + this.props.token);
            //console.log(this.props.history);
            document.getElementById("CardsForm").submit();
          } else {
            let callbackProps = this.props;
            let callbackStates = this.state;

            this.onDebitEMICeckEleg((status) => {
              if (status) {
                if (
                  this.props.selected_emi_data.issuerId ==
                  ISSUER_CONST.ICICI_DEBIT_EMI_ISSUER &&
                  this.props.selected_emi_data.tenureId != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID
                ) {
                  this.onClose();
                  this.btn.removeAttribute("disabled");
                  this.setState({
                    isIciciTermAndConditionSet: true,
                    isModelOpen: true,
                  });
                } else {
                  document.getElementById("CardsForm").submit();
                }
              } else {
                this.btn.removeAttribute("disabled");
                this.setState({
                  isCardBinValidityCheck: false,
                  isModelOpen: true,
                });
              }
            });
          }
        } else {
          //show session pop up
          // this.onHandleSession();
          this.btn.removeAttribute("disabled");
          this.props.dispatch(SESSION_EXPIRES());
        }
      })
      .catch((error) => {
        this.btn.removeAttribute("disabled");
        //techincal error
        alert("onHandleSubmit:" + error);
      });
  };

  onHandleSaveCardSubmit = (event) => {
    event.preventDefault();

    if (
      this.props.selected_emi_data.issuerId ==
      ISSUER_CONST.AXIS_DEBIT_EMI_ISSUER &&
      !this.state.isAxisTermAndConditionCheckBoxSet
    ) {
      this.setState({ TNCErrorMsg: "Please accept Terms and Conditions." });
      return;
    }

    this.btn.setAttribute("disabled", "disabled");
    this.props
      .dispatch(CheckSession(this.props.token))
      .then((json) => {
        let responseData = json.data;
        if (responseData.response_code == 1) {
          if (this.props.paymentModeId == 1) {
            //normal submit
            this.props.dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
            document.getElementById("SaveCardForm").submit();
          } else {
            let callbackProps = this.props;
            let callbackStates = this.state;

            this.onDebitEMICeckEleg((status) => {
              if (status) {
                if (
                  this.props.selected_emi_data.issuerId ==
                  ISSUER_CONST.ICICI_DEBIT_EMI_ISSUER
                ) {
                  this.onClose();
                  this.btn.removeAttribute("disabled");
                  this.setState({
                    isIciciTermAndConditionSet: true,
                    isModelOpen: true,
                  });
                } else {
                  document.getElementById("SaveCardForm").submit();
                }
              } else {
                this.btn.removeAttribute("disabled");
                this.setState({
                  isCardBinValidityCheck: false,
                  isModelOpen: true,
                });
              }
            });
          }
        } else {
          //show session pop up
          this.onHandleSession();
          this.btn.removeAttribute("disabled");
          this.props.dispatch(SESSION_EXPIRES());
        }
      })
      .catch((error) => {
        this.btn.removeAttribute("disabled");
        //techincal error
        alert("onHandleSubmit:" + error);
      });
  };
  onHandleSession = () => {
    this.setState({
      isModelOpen: true,
    });
    this.onOpenModelPop();
  };
  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;

    if (nam == "isAxisTermAndConditionCheckBoxSet") {
      this.setState({
        isAxisTermAndConditionCheckBoxSet: event.target.checked,
        TNCErrorMsg: "",
      });
      return;
    }

    if (nam == "isCardToBeSavedDB") {
      this.setState({
        isCardToBeSaved: event.target.checked,
        TNCErrorMsg: "",
      });
      return;
    }
    this.setState({ [nam]: val });
  };

  CardNumberChangeHandler = (event) => {
    let cardNumber = event.target.value;
    if (PAYMENT_MODE_CONST.NUMBERS_ONLY_REGEX.test(cardNumber)) {
      // if (this.isNumber(event)) {
      if (cardNumber === "") {
        this.setState({ CardNumber: "" });
      } else {
      }
      this.setState({ CardNumber: cardNumber });
      this.GetCardType(this.state.CardNumber);
    }
  };

  onSaveCardTextChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    if (nam === "CVV") {
      this.setState({ SavedCardCVV: val });
      this.setState({ SaveCardcVVError: "" });
    }
  };
  onTextChange = (event) => {
    // if (PAYMENT_MODE_CONST.NUMBERS_ONLY_REGEX.test(event.target.value)) {
    //   this.setState({
    //     cardError: "",
    //     CardNumber: event.target.value
    //   })

    //   this.GetCardType(this.state.CardNumber);
    // }

    let nam = event.target.name;
    let val = event.target.value;
    if (nam === "CardNumber") {
      this.setState({ cardError: "" });
      this.setState({ CardNumber: val });
      this.GetCardType(this.state.CardNumber);
    } else if (nam === "CVV") {
      //if (PAYMENT_MODE_CONST.NUMBERS_ONLY_REGEX.test(val)) {
      this.setState({ cVVError: "" });
      this.setState({ [nam]: val, isCVVDefaultVal: false });
      //}
    } else if (nam === "CardHolderName") {
      this.setState({ cardNameError: "" });
      this.setState({ [nam]: val, isCardHolderDefaultVal: false });
    }
  };

  onCardNumberBlur = () => {
    if (this.typingTimer) clearTimeout(this.typingTimer); // Clear if already set
    this.typingTimer = setTimeout(
      this.onCardValidation,
      this.doneTypingInterval
    );
  };

  isNumber = (evt) => {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;

    let inputChar = String.fromCharCode(evt.key);
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
    }
    return true;
  };

  getKeyCode = (str) => {
    return str.charCodeAt(str.length - 1);
  };

  isCVVNumber = (evt) => {
    evt = evt ? evt : window.event;
    const pattern = /^[0-9\b]{0,4}$/;
    let inputChar = String.fromCharCode(evt.key);
    console.log(inputChar);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      evt.preventDefault();
    }
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
    }
    if (charCode == 0 || charCode == 229) {
      //for android chrome keycode fix
      alert(charCode + ":" + inputChar);
      charCode = this.getKeyCode(inputChar);
      alert(charCode);
    }
    return true;
  };

  isCharsMethod(e) {
    const re = /[a-zA-Z!@#$%^*_-| ]+$/g;
    console.log(e.key);
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }

  isAlphabet = (evt) => {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||
      charCode === 32
    ) {
      return true;
    } else if (
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 96 && charCode <= 105)
    ) {
      evt.preventDefault();
    } else {
      evt.preventDefault();
    }
  };

  componentDidUpdate() {
    $(".bank-card").on("click", function () {
      $(".bank-card").removeClass("active");
      $(this).addClass("active");
      $("#paynow").show();
    });
  }

  componentDidMount() {
    if (this.isSaveCardToBeShown) {
      $("#paynow").hide();
      $(".bank-card").on("click", function () {
        $(".bank-card").removeClass("active");
        $(this).addClass("active");
        $("#paynow").show();
      });

      $(".add-new-card").on("click", function () {
        $(".add-new-card").hide();
      });
    }

  }

  onCardNumberKeyDown = () => {
    clearTimeout(this.typingTimer);
  };

  onOpenModelPop = () => {
    this.setState({
      isModelOpen: false,
    });
    this.setState({
      isModelOpen: true,
    });
  };

  onCardValidation = (event) => {
    let cardNumber = this.state.CardNumber;

    if (cardNumber === null || cardNumber == "") {
      return;
    }

    if (this.props.paymentModeId == 1) {
      let cardNo = this.state.CardNumber;

      cardNo = cardNo.trim();
      if (12 <= cardNo.length && cardNo.length <= 19) {
        this.setState({ isCardValid: true, cardError: "" });
      } else {
        this.setState({
          isCardValid: false,
          cardError: "Please enter valid card no.",
        });
      }
      if (!this.CreditCardValidator(cardNo)) {
        this.setState({
          isCardValid: false,
          cardError: "Please enter valid card no.",
        });
      } else {


        //check lounge txn if lounge txn then call api
        /*LOUNGE STARTS*/
        if (this.state.isLoungeTxn) {
          let loungeEncryptedCardNo = this.EncryptCardNumberUsingAes(this.state.CardNumber);
          let model = {
            card_number: loungeEncryptedCardNo,
            scheme_id: 0,
            issuer_id: 0,
            tenure_id: 0,
            card_expiry_date: "",
            loan_amount: 0,
            mobile_no: "",
          };
          this.props
            .dispatch(
              CheckCardIsValidForLoungeTxn(this.props.token, model)
            )
            .then((json) => {
              let responseData = json.data;
              if (responseData.response_code == 1) {
                this.setState({ isCardValid: true, cardError: "" });
              } else if (responseData.response_code == -136) {
                this.props.dispatch(SESSION_EXPIRES());
              } else {

                this.setState({
                  isCardValid: false,
                  cardError: "Please enter valid card no.",
                });


              }
            })
            .catch((error) => {
              this.setState({
                isCardValid: false,
                cardError: "",
              });
              //alert("onCardValidation:" + error);
            });
          return;

        }
        /*LOUNGE ENDS*/
        else {
          this.setState({
            isCardValid: true,
            cardError: "",
          });
          return;
        }


      }
      return;
    }

    let cardBinModelData = this.GetCardBinModel();

    if (!cardBinModelData) {
      this.setState({
        isCardValid: false,
        cardError: "Please enter valid card no.",
      });
      return;
    }

    this.props
      .dispatch(
        CheckIssuerCardBinIsValidEMI(this.props.token, cardBinModelData)
      )
      .then((json) => {
        let responseData = json.data;
        if (responseData.response_code == 1) {
          // alert("valid");

          this.setState({ isCardBinValidityCheck: true });
        } else if (responseData.response_code == -136) {
          this.props.dispatch(SESSION_EXPIRES());
        } else {

          if (cardBinModelData.tenure_id == EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID) {
            this.setState({
              isCardValid: false,
              cardError: "Please enter valid card no.",
            });
          }
          else {
            this.setState({
              ...this.state,
              isCardBinValidityCheck: false,
              isModelOpen: true,
            });
            this.onOpenModelPop();
          }
        }
      })
      .catch((error) => {
        //alert("onCardValidation:" + error);
      });
    return;
  };
  onClickChooseOtherEMIBtn = () => {
    this.props.dispatch(SetOtherEMI());
  };

  setRemovedSequenceId = (SequenceId) => {
    this.props.dispatch(SetRemovedSequenceId(SequenceId));
  };

  RemoveSaveCard = (SeqId, callback) => {
    this.props
      .dispatch(SaveCardRemoval(this.props.token, SeqId))
      .then((response) => {
        let responseData = response.data;

        if (responseData.response_code == 1) {
          this.setRemovedSequenceId(SeqId);

          // var arrayvar = [...this.state.RemovedSeqId, SeqId];
          // this.setState({
          //   isSaveCardRemoved: true,
          //   RemovedSeqId: arrayvar
          // })

          callback();
        } else if (responseData.response_code == -136) {
          this.props.dispatch(SESSION_EXPIRES());
        } else {
        }
      })
      .catch((error) => {
        alert("onCardValidation:" + error);
      });
    return;
  };

  CheckIsDebitEMiIssuer = (issuerId) => {
    let isDebitEMiIssuer = false;
    if (ISSUER_CONST.ISSUER_DEBIT_EMI.includes(parseInt(issuerId))) {
      isDebitEMiIssuer = true;
    }
    return isDebitEMiIssuer;
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

  dynamicCardBinFailureMsg = (issuerName, cardTypeName) => {
    return (
      <div class="modal-body clearfix">
        <div class="col-12 cardeligibilityfailuremsg">
          <img
            src={`../../${process.env.PUBLIC_URL}/images/warning.png`}
            alt="not eligible"
          />
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



  showICICITermAndConditionPage = (tenureMonths, emiPerMonth) => {
    return (
      <div className="paymentSummaryDetail">
        <div class="modal-header">
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-hidden="true"
          >
            &times;
          </button>
          <h1 class="text-left modal-title">
            Terms and Conditions - ICICI Bank Debit Card
          </h1>
        </div>

        <div class="modal-body-iciciTNC terms-conditions-panel">
          <div class="text-left">
            <ul class=" fs-14" id="termsAndConUl">
              <li>
                You will pay Rs.{emiPerMonth / 100} per month for {tenureMonths}{" "}
                months
              </li>
              <li>
                For transaction done on or before 15th of the month, the EMI
                amount will be charged on your ICICI Bank account between 3rd to
                7th of the next month
              </li>
              <li>
                For transaction done after 15th of the month, the EMI amount
                will be charged on your ICICI Bank account between 3rd to 7th of
                the month after next
              </li>
              <li>
                Processing fee will be charged in availing EMI facility through
                your debit card
              </li>
              <li>
                For the purpose of providing an EMI on debit card, the bank is
                required to confirm your mobile number registered with the
                account as well as eligibility grading with the merchant.
              </li>
              <li>
                The detailed T&amp;C for EMI on debit card facility is available
                on the ICICI Bank website.
                <br />
                <a
                  class="text-green"
                  href="https://www.icicibank.com/Personal-Banking/cards/Consumer-Cards/Debit-Card/emi-debitcard.page"
                  target="_blank"
                >
                  Click here to view
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            id="agree-btn"
            class="btn btn-green"
            onClick={this.onTermAndConditionSubmitDebitEMI}
          >
            I Agree
          </button>
          {/* <button type="button" id="cancel-btn"
            class="btn btn-green" onClick={this.onClose} >Cancel</button> */}
        </div >
      </div >
    );
  };

  CreditCardValidator = (value) => {
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

  ShowCardDetails = () => {
    this.setState({
      isCardPageToBeShown: true,
      SaveCardPayNowShow: false,
    });
  };
  CardExpDateValidation = () => {
    let d = new Date();
    let m = d.getMonth();
    let y = d.getFullYear();
    let yearCentury = y.toString().substring(0, 2);
    let expiryYear = yearCentury + this.state.CardExpiryYear;
    if (expiryYear < y) {
      return false;
    }
    if (expiryYear == y && this.state.CardExpiryMonth < m + 1) {
      return false;
    }

    if (this.state.CardExpiryMonth > 12) {
      return false;
    }
    return true;
  };

  onExpiryDateBlurFn = () => {
    let expDataLbl = "MM/YY";
    let expDate = this.state.CardExpiryDate;
    if (expDate && expDate != null) {
      expDate = expDate.trim();
      expDataLbl = expDate !== "" ? "Expiry Date" : expDataLbl;
    }
    this.setState({ expDateLbl: expDataLbl });
    let d = new Date();
    let m = d.getMonth();
    let y = d.getFullYear();
    let yearCentury = y.toString().substring(0, 2);
    let expiryYear = yearCentury + this.state.CardExpiryYear;
    if (
      this.state.CardExpiryDate != null &&
      (expiryYear < y ||
        (expiryYear == y &&
          this.state.CardExpiryMonth < m + 1) ||
        this.state.CardExpiryMonth > 12)
    ) {
      this.setState({ expiryDateError: "Please Enter Valid Expiry Date" });
    } else {
      this.setState({ expiryDateError: "" });
    }
  };
  onExpiryDateFocusFn = () => {
    let expDataLbl = "Expiry date";
    this.setState({ expDateLbl: expDataLbl });
  };

  SaveCardExpDateValidation = () => {
    let d = new Date();
    let m = d.getMonth();
    let y = d.getFullYear();
    if (this.state.SaveCardExpiryYear < y) {
      return false;
    }
    if (
      this.state.SaveCardExpiryYear == y &&
      this.state.SaveCardExpiryMonth < m + 1
    ) {
      return false;
    }

    if (this.state.SaveCardExpiryMonth > 12) {
      return false;
    }
    return true;
  };

  EachSaveCardExpDateValidation = (year, month) => {
    let d = new Date();
    let m = d.getMonth();
    let y = d.getFullYear();
    if (month === "00") {
      return true;
    }
    if (year < y) {
      return false;
    }
    if (year == y && month < m + 1) {
      return false;
    }
    return true;
  };

  GetCardType = (cur_val) => {
    if (!this.CreditCardValidator) {
      this.setState({
        CardType: "",
        CardImage: "",
      });
    } else {
      let jcb_regex = new RegExp("^(?:2131|1800|35)[0-9]{0,}$");
      let amex_regex = new RegExp("^3[47][0-9]{0,}$");
      let diners_regex = new RegExp("^3(?:0[0-59]{1}|[689])[0-9]{0,}$");
      let visa_regex = new RegExp("^4[0-9]{0,}$");
      let mastercard_regex = new RegExp(
        "^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$"
      );
      let maestro_regex = new RegExp("^(5[06789]|6)[0-9]{0,}$");
      let discover_regex = new RegExp(
        "^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$"
      );
      if (cur_val != null) {
        if (cur_val.match(jcb_regex)) {
          this.setState({
            CardType: "jcb",
            CardImage: "images/jcb.png",
          });
        } else if (cur_val.match(amex_regex)) {
          this.setState({
            CardType: "amex",
            CardImage: "images/amex.png",
          });
        } else if (cur_val.match(diners_regex)) {
          this.setState({
            CardType: "diners",
            CardImage: "images/diners.png",
          });
        } else if (cur_val.match(visa_regex)) {
          this.setState({
            CardType: "visa",
            CardImage: "../.." + process.env.PUBLIC_URL + "/images/visa.png",
          });
        } else if (cur_val.match(mastercard_regex)) {
          this.setState({
            CardType: "mastercard",
            CardImage: "../.." + process.env.PUBLIC_URL + "/images/mc.png",
          });
        } else if (cur_val.match(discover_regex)) {
          this.setState({
            CardType: "discover",
            CardImage: "images/discover.png",
          });
        } else if (cur_val.match(maestro_regex)) {
          if (cur_val[0] == "5") {
            this.setState({
              CardType: "mastercard",
              CardImage: "../.." + process.env.PUBLIC_URL + "/mastercard.png",
            });
          } else {
            this.setState({
              CardType: "maestro",
              CardImage: "../.." + process.env.PUBLIC_URL + "/maestro.png",
            });
          }
        } else {
          this.setState({
            CardType: "",
            CardImage: "",
          });
        }
      }
    }
  };

  selectSaveCardHandler = (
    SequenceId,
    SaveCardExpiryMonth,
    SaveCardExpiryYear
  ) => {
    this.setState({
      SequenceId: SequenceId,
      SaveCardExpiryMonth: SaveCardExpiryMonth,
      SaveCardExpiryYear: SaveCardExpiryYear,
      SaveCardPayNowShow: true,
    });
  };

  onTermAndConditionSubmitDebitEMI = (event) => {
    event.preventDefault();

    this.props
      .dispatch(CheckSession(this.props.token))
      .then((json) => {
        let responseData = json.data;
        if (responseData.response_code == 1) {
          this.props.dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
          document.getElementById("CardsForm").submit();
        } else {
          //show session pop up
          this.props.dispatch(SESSION_EXPIRES());
        }
      })
      .catch((error) => {
        //techincal error
        //alert("onHandleSubmit:" + error);
      });
  };

  onCardNameCVVValidation = (event) => {
    let nam = event.target.name;
    let val = event.target.value;

    if (nam === "CardHolderName") {
      let cardHolderName = this.state.CardHolderName || "";
      cardHolderName = cardHolderName.trim();
      if (cardHolderName && cardHolderName != "") {
        this.setState({ isCardHolderNameValid: true, cardNameError: "" });
      } else {
        this.setState({
          isCardHolderNameValid: false,
          cardNameError: "Please Enter Card holder name.",
        });
      }
    } else if (nam === "CVV") {
      let CVV = this.state.CVV || "";
      CVV = CVV.trim();
      if (CVV && CVV != "" && 3 <= CVV.length && CVV.length <= 6) {
        this.setState({ isCardCVVValid: true, cVVError: "" });
      } else {
        this.setState({ isCardCVVValid: false, cVVError: "Please Enter CVV." });
      }
    }
  };

  onSaveCardCVVValidation = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    if (nam === "CVV") {
      let CVV = this.state.SavedCardCVV || "";
      CVV = CVV.trim();
      if (CVV && CVV != "" && 3 <= CVV.length && CVV.length <= 6) {
        this.setState({ SaveCardcVVError: "" });
      } else {
        this.setState({ SaveCardcVVError: "Please Enter CVV." });
      }
    }
  };

  // validation part ends

  render() {
    const {
      error,
      loading,
      merchant_payment_data,
      selected_emi_data,
      conveniencefee_data,
      is_IRCTC,
    } = this.props;
    this.selected_emi_data = selected_emi_data;
    let emiData = null;
    let PaymentModeId = 1;
    let SavedCardData = null;
    let IssuerId = 0;
    let TenureId = 0;
    let CardTypeId = 0;
    let EmiTypeId = 0;
    let TxnType = 1;
    let AmountFromUIFee = 0;
    if(is_IRCTC)
    { 
      AmountFromUIFee= conveniencefee_data.data.fee;
    }
    let AmountFromUI = this.props.paymentAmountUI+AmountFromUIFee;
    let AmountFromUI = conveniencefee_data.data.total;
    console.log("=-----AmountFromUI===="+JSON.stringify(AmountFromUI));
    let debitEMIPennyTxnNote = "";
    let TermsAndConditionsNote = "";
    let actionName = null;
    let issuerName = null;
    let cardTypeName = null;
    let d = new Date();
    let m = d.getMonth();
    let y = d.getFullYear();
    let isPayNowADisabled = false;
    let isSavedCardPayNowDisabled = false;
    let CustomerId = 0;
    let isSaveCardEnabled = false;
    let tenureMonths = null;
    let emiPerMonth = null;
    let pennyTxnAmount = null;
    let DynamictermsAndConditionNote = null;
    let reSymbol = '&#x20B9;'
    let isCashbackOnFullPayment = false;
    let routePathPrefixForChooseAnother = "/emi";

    if (this.props.paymentModeId == 1) {
      actionName =
        process.env.REACT_APP_PG_CONTROLLER +
        "pinepg/v2/submit/card?token=" +
        encodeURIComponent(this.props.token);
    } else {
      actionName =
        process.env.REACT_APP_PG_CONTROLLER +
        "pinepg/v2/submit/emi?token=" +
        encodeURIComponent(this.props.token);
    }

    CustomerId = this.objMerchantPaymentDataUtils.GetCustomerId(
      merchant_payment_data.customer_data
    );

    isSaveCardEnabled = this.objMerchantPaymentDataUtils.GetSavedCardEnabled(
      merchant_payment_data.merchant_data
    );
    if (
      !this.state.isCardValid ||
      !this.state.isCardBinValidityCheck ||
      !this.CardExpDateValidation() ||
      this.state.CardExpiryDate.length != 4 ||
      !this.state.CVV ||
      this.state.CVV.length < 3 ||
      !this.state.CardHolderName
    ) {
      isPayNowADisabled = true;
    }

    if (
      selected_emi_data &&
      selected_emi_data.paymentMode == 4 &&
      selected_emi_data.emiType &&
      selected_emi_data.cardType &&
      selected_emi_data.issuerId &&
      selected_emi_data.tenureId &&
      this.props.is_emi_card_page
    ) {
      IssuerId = selected_emi_data.issuerId;
      TenureId = selected_emi_data.tenureId;
      CardTypeId = selected_emi_data.cardType;
      EmiTypeId = selected_emi_data.emiType;

      isCashbackOnFullPayment = (EmiTypeId == EMI_TYPE_CONST.EMI_TYPE_NO_EMI_ONLY_CASHBACK_COST_EMI) && (TenureId == EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID);

      if (isCashbackOnFullPayment == true) {
        routePathPrefixForChooseAnother = "/cashbackOnFullPayment";
      }

      PaymentModeId = this.GetPaymentModeIDOnIssuerBasis(
        selected_emi_data.paymentMode,
        IssuerId
      );

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

      pennyTxnAmount = this.objMerchantPaymentDataUtils.GetIssuerDataForEMITypeIdCardTypeId(
        merchant_payment_data,
        EmiTypeId,
        CardTypeId,
        IssuerId
      ).penny_amount;


      this.DynamictermsAndConditionNoteText = this.objMerchantPaymentDataUtils.GetIssuerDataForEMITypeIdCardTypeId(
        merchant_payment_data,
        EmiTypeId,
        CardTypeId,
        IssuerId
      ).terms_and_conditions;



      cardTypeName = ConstCardTypeConfigData.filter(
        (obj) => obj.CARD_TYPE_ID == CardTypeId
      )[0].NAME;
      tenureMonths = tenuredata.tenure_in_month;
      emiPerMonth = tenuredata.monthly_installment;
      this.schemeID = tenuredata.applicable_scheme.scheme_id;
      this.loanAmount = tenuredata.loan_amount;
     // console.log("=-----loan amount===="+JSON.stringify(this.loanAmount));  
      var bIsTenureIsAllowed = this.objMerchantPaymentDataUtils.IsTenureContainsSpecialOffer(tenuredata);

      var showSpecialOfferText =
        (bIsTenureIsAllowed)
          ? (<p class="text-blue fs-11 choose-another-plan-sub-head">Special offer applied</p>)
          : (null)


      let planDesc = tenureMonths == 1 ? "No EMI Only Cashback" : tenureMonths + " EMIs @ ₹" + (emiPerMonth / 100) + "/ month";
      emiData = (
        <h2 className="choose-another-plan">

          {issuerName} - {planDesc}
          <NavLink
            exact
            to={routePathPrefixForChooseAnother + "/cards/other"}
            onClick={() => this.onClickChooseOtherEMIBtn()}
          >
            <i className="fa fa-pencil pull-right mt-2"></i>
            <span className="btn btn-medium btn-green">
              Choose another Plan
            </span>
          </NavLink>
          {showSpecialOfferText}
        </h2>
      );
    }

    if (IssuerId == ISSUER_CONST.AXIS_DEBIT_EMI_ISSUER &&
      TenureId != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID) {
      debitEMIPennyTxnNote =
        "Note: You will be paying INR " +
        pennyTxnAmount +
        " for this transaction, which will be refunded";

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
            {!this.state.isAxisTermAndConditionCheckBoxSet &&
              this.state.TNCErrorMsg}
          </span>
        </div >
      );
    }
    else if (IssuerId == ISSUER_CONST.HDFC_CREDIT_EMI_ISSUER
      && TenureId != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID) {
      TermsAndConditionsNote = <div>
        {this.DynamictermsAndConditionNoteText}
        {/* Note: Convenience fee of &#x20B9;199 +GST applicable for EMI
        transaction for HDFC bank cards.
        In case of refund, Customer has to call HDFC Bank phonebanking to pre close loan. Loan will not be cancelled/pre closed automatically. */}
      </div>
    }

    else if (TenureId != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID && this.DynamictermsAndConditionNoteText != null
      && this.DynamictermsAndConditionNoteText != '') {


      TermsAndConditionsNote = <div>
        {this.DynamictermsAndConditionNoteText.split(":::")[0]}
        <a
          href={this.DynamictermsAndConditionNoteText.split(":::")[1]}
          target="_blank"
        >
          <u>  {this.DynamictermsAndConditionNoteText.split(":::")[1]}</u>
        </a>
      </div>
    }



    if (IssuerId == ISSUER_CONST.ICICI_DEBIT_EMI_ISSUER
      && TenureId != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID) {
      debitEMIPennyTxnNote =
        "Note:  We will deduct Rs. " +
        pennyTxnAmount +
        " from your account to validate this transaction. The amount will be reversed in your account.";
    }


    let SaveCardType;

    SavedCardData =
      this.props.paymentModeId == 1
        ? this.objMerchantPaymentDataUtils.GetSavedCardDataForPaymentModeId(
          this.props.merchant_payment_data,
          this.props.paymentModeId
        )
        : null;

    if (Array.isArray(SavedCardData) && SavedCardData.length) {
      // && !this.state.isCardPageToBeShown) {
      this.isSaveCardToBeShown = true;

      // if (this.state.isSaveCardRemoved) {
      // SavedCardData = SavedCardData.filter(obj => !this.state.RemovedSeqId.includes(obj.sSeqId))
      SavedCardData = SavedCardData.filter(
        (obj) => !this.props.RemovedSeqId.includes(obj.sSeqId)
      );
      if (SavedCardData.length === 0) {
        this.isSaveCardToBeShown = false;
      }

      // }

      SaveCardType = SavedCardData.map((obj, index) => {
        return (
          <SavedCard
            cardNumber={obj.strCardNumber}
            expiryMonth={obj.strExpiryMonth}
            expiryYear={obj.strExpiryYear}
            key={obj.sSeqId}
            onClick={() =>
              this.selectSaveCardHandler(
                obj.sSeqId,
                obj.strExpiryMonth,
                obj.strExpiryYear
              )
            }
            onRemove={() =>
              this.RemoveSaveCard(obj.sSeqId, () => {
                $("#paynow").hide();
              })
            }
            MobileNumber={obj.strMobileNumber}
            token={this.props.token}
            issuerName={obj.strIssuerName}
            errorMsg={
              this.EachSaveCardExpDateValidation(
                obj.strExpiryYear,
                obj.strExpiryMonth
              )
                ? ""
                : "Card Expired"
            }
          />
        );
      });
    }

    if (
      !this.SaveCardExpDateValidation() ||
      !this.state.SavedCardCVV ||
      this.state.SavedCardCVV.length < 3
    ) {
      isSavedCardPayNowDisabled = true;
    }

    const SaveCardDetails = (
      <form
        id="SaveCardForm"
        method="post"
        action={actionName}
        onSubmit={this.onHandleSaveCardSubmit}
      >
        <input
          type="hidden"
          id="isCardToBeSaved"
          name="isCardToBeSaved"
          value={this.state.isCardToBeSaved}
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

        <div>
          <input
            type="hidden"
            id="SequenceId"
            name="SequenceId"
            value={this.state.SequenceId}
          />
          <input
            type="hidden"
            id="IsSavedCardNonEmiTransaction"
            name="IsSavedCardNonEmiTransaction"
            value="1"
          />

          {/* <div id="collapsecreditdebit" class="card-body collapse active show" data-parent="#accordion"> */}
          <div class="col-12 saved-cards">
            <div class="row">{SaveCardType}</div>

            {this.state.SaveCardPayNowShow ? (
              <div class="row" id="paynow">
                <div class="col-lg-5 col-md-5 col-sm-5 col-7 mt-2  mb-3">
                  <input
                    className="form-control"
                    type="password"
                    pattern="\d*"
                    id="CVV"
                    name="CVV"
                    maxLength="4"
                    value={this.state.SavedCardCVV}
                    // onChange={this.myChangeHandler}
                    onChange={(event) => this.onSaveCardTextChange(event)}
                    onBlur={this.onSaveCardCVVValidation}
                    onKeyPress={this.isNumber}
                    required=""
                    autoComplete="off"
                    onPaste={(event) => event.preventDefault()}
                    onCopy={(event) => event.preventDefault()}
                  //placeholder="CVV"
                  />
                  <span className="error-block">
                    {/* {this.state.CVV != null &&
                  this.state.CVV.length < 3 &&
                  "Please Enter CVV"} */}
                    {this.state.SaveCardcVVError}
                  </span>
                  <label for="CVV">CVV</label>
                  <div class="find-text ">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/cvv.png`}
                      alt="cvv"
                    />
                  </div>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-5 mt-2 mb-3">
                  <button
                    id="SavedCardPayNow"
                    disabled={isSavedCardPayNowDisabled}
                    class="btn  btn-green mr-3"
                    type="submit"
                    ref={(btn) => {
                      this.btn = btn;
                    }}
                  >
                    Pay now
                  </button>
                </div>
              </div>
            ) : (
              <> </>
            )}
          </div>
        </div>

        {!this.state.isLoungeTxn ? (
          !this.state.isCardPageToBeShown ? (
            <div
              class=" pt-3 mb-2 text-center add-new-card"
              onClick={this.ShowCardDetails}
            >
              <a
                // href="#card-details"

                class="btn btn-bdr-green"
              >
                <img src={AddGreenIcon} alt="add icon" class="cvv-icon mr-1" />{" "}
              Add new card
            </a>
            </div>
          ) : (
            <></>
          )

        ) : null}

      </form>
    );

    const CardDetailData = (
      <div className="col-lg-12 card-details">
        <form
          id="CardsForm"
          method="post"
          action={actionName}
          onSubmit={this.onHandleSubmit}
        >
          <input
            type="hidden"
            id="isCardToBeSaved"
            name="isCardToBeSaved"
            value={this.state.isCardToBeSaved}
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

          <div>
            <div className="row">
              <div className="col-12">
                <h3>Enter your card details</h3>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    <input
                      className="form-control"
                      type="tel"
                      id="CardNumber"
                      name="CardNumber"
                      value={this.state.CardNumber}
                      //  placeholder="Enter card no."
                      onChange={(event) => this.onTextChange(event)}
                      onBlur={this.onCardValidation}
                      onKeyPress={this.isNumber}
                      maxLength="19"
                      format="################"
                      required=""
                      autoComplete="off"
                      onPaste={(event) => event.preventDefault()}
                      onCopy={(event) => event.preventDefault()}
                    />
                    {/* <ValidatedInput
                      className="form-control date-input"
                      type="text"
                      id="CardNumber"
                      name="CardNumber"
                      placeholder=""
                      value={this.state.CardNumber}
                      onValueChange={values => {
                        console.log(values)
                        const { value } = values;
                        this.setState({
                          cardError: "",
                          CardNumber: value
                        });
                        this.GetCardType(this.state.CardNumber)
                      }}
                      onBlur={this.onCardValidation}
                      format="################"
                      required=""
                      autoComplete="off"
                      onPaste={event => event.preventDefault()}
                      onCopy={event => event.preventDefault()}
                    /> */}
                    <span className="error-block">{this.state.cardError}</span>
                    <label for="CardNumber">Enter card no.</label>
                    {/* <div className="find-text ">
  <img src="images/visa.png" alt="visa" />
</div> */}
                    {this.state.CardNumber ? (
                      <div className="find-text ">
                        <img
                          src={this.state.CardImage}
                          alt={this.state.CardType}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    <input
                      className="form-control"
                      type="text"
                      id="CardHolderName"
                      name="CardHolderName"
                      value={this.state.CardHolderName}
                      // onChange={this.myChangeHandler}
                      onChange={(event) => this.onTextChange(event)}
                      onBlur={this.onCardNameCVVValidation}
                      onKeyPress={(e) => this.isCharsMethod(e)}
                      required=""
                      //placeholder="Name on card"
                      autoComplete="off"
                      onPaste={(event) => event.preventDefault()}
                      onCopy={(event) => event.preventDefault()}
                    />
                    <span className="error-block">
                      {/* {this.state.CardHolderName != null &&
                    !this.state.CardHolderName &&
                    "Please Enter Card holder name"} */}
                      {!this.state.isCardHolderDefaultVal &&
                        this.state.cardNameError}
                    </span>
                    <label for="CardHolderName">Name on card</label>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    {/* <label htmlFor="CardExpiryDate" className="date-label">
</label> */}
                    <ValidatedInput
                      className="form-control date-input"
                      type="text"
                      id="CardExpiryDate"
                      name="CardExpiryDate"
                      placeholder=""
                      value={this.state.CardExpiryDate}
                      onValueChange={(values) => {
                        const { value } = values;
                        this.setState({
                          CardExpiryDate: value,
                          CardExpiryMonth: value.substring(0, 2),
                          CardExpiryYear: value.substring(2, 4),
                        });
                        this.CardExpDateValidation();
                      }}
                      format="##/##"
                      required
                      autoComplete="off"
                      onPaste={(event) => event.preventDefault()}
                      onCopy={(event) => event.preventDefault()}
                      onBlur={(event) => this.onExpiryDateBlurFn(event)}
                      onFocus={(event) => this.onExpiryDateFocusFn(event)}
                    />
                    <span className="error-block">
                      {this.state.expiryDateError}
                    </span>
                    <label for="CardExpiryDate" id="expiryDateLbl">
                      {this.state.expDateLbl}
                    </label>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    <input
                      className="form-control"
                      type="password"
                      pattern="\d*"
                      id="CVV"
                      name="CVV"
                      maxLength="4"
                      value={this.state.CVV}
                      onChange={(event) => this.onTextChange(event)}
                      onBlur={this.onCardNameCVVValidation}
                      onKeyPress={this.isNumber}
                      required=""
                      autoComplete="off"
                      onPaste={(event) => event.preventDefault()}
                      onCopy={(event) => event.preventDefault()}
                    // placeholder="CVV"
                    />
                    <span className="error-block">
                      {/* {this.state.CVV != null &&
                    this.state.CVV.length < 3 &&
                    "Please Enter CVV"} */}
                      {!this.state.isCVVDefaultVal && this.state.cVVError}
                    </span>
                    <label for="CVV">CVV</label>
                    <div className="find-text ">
                      {/* <img src="./../../images/cvv.png" alt="cvv" /> */}
                      <img
                        src={`../../${process.env.PUBLIC_URL}/images/cvv.png`}
                        alt="cvv"
                      />
                    </div>
                  </div>

                  {/* {this.state.CardNumber ? (
                <div className="find-text ">
                  <img
                    src={this.state.CardImage}
                    alt={this.state.CardType}
                  />
                </div>
              ) : null} */}
                  {isSaveCardEnabled && CustomerId > 0 ? (
                    <div className="col-12 mb-3">
                      <div readonly class="checkbox">
                        {this.state.isLoungeTxn ? (<input
                          id="isCardToBeSavedDB"
                          name="isCardToBeSavedDB"
                          onChange={this.myChangeHandler}
                          type="checkbox"
                          readonly
                          value={true}
                        />) : <input
                          id="isCardToBeSavedDB"
                          name="isCardToBeSavedDB"
                          onChange={this.myChangeHandler}
                          type="checkbox"
                          value={this.state.isCardToBeSaved}
                        />}

                        <label for="isCardToBeSavedDB">
                          Save this card for future payments
                        </label>
                      </div>
                    </div>
                  ) : null}

                  <div className="col-12 mb-3">
                    <button
                      id="CardPayNow"
                      disabled={isPayNowADisabled}
                      type="submit"
                      className="btn  btn-green mr-3"
                      ref={(btn) => {
                        this.btn = btn;
                      }}
                    >
                      Pay now
                    </button>
                  </div>

                  <div className="col-12 mb-3 note">{debitEMIPennyTxnNote}</div>
                  <div className="col-12 text-left note-text">
                    {TermsAndConditionsNote}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );

    return (
      <>
        {this.state.isModelOpen && !this.state.isCardBinValidityCheck ? (
          <PopUp onClose={this.onClose}>
            {this.dynamicCardBinFailureMsg(issuerName, cardTypeName)}
          </PopUp>
        ) : null}
        {this.state.isModelOpen && this.state.isIciciTermAndConditionSet ? (
          <PopUp onClose={this.onClose}>
            {this.showICICITermAndConditionPage(tenureMonths, emiPerMonth)}
          </PopUp>
        ) : null}
        {emiData}
        {/* <div className="col-lg-12 card-details">
          <form
            id="CardsForm"
            method="post"
            action={actionName}
            onSubmit={this.onHandleSubmit}
          >

            <input
              type="hidden"
              id="isCardToBeSaved"
              name="isCardToBeSaved"
              value={this.state.isCardToBeSaved}
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
            <input
              type="hidden"
              id="TxnType"
              name="TxnType"
              value={TxnType}
            />
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
                this.props.merchant_payment_data.merchant_data
                  .merchant_return_url
              }
            />
            <input
              type="hidden"
              id="PinePGTxnId"
              name="PinePGTxnId"
              value={
                this.props.merchant_payment_data.txn_data.pine_pg_txn_id
              }
            />
            <input
              type="hidden"
              id="IssuerId"
              name="IssuerId"
              value={IssuerId}
            />
            <input
              type="hidden"
              id="SchemeId"
              name="SchemeId"
              value={this.schemeID}
            />
            <input
              type="hidden"
              id="TenureId"
              name="TenureId"
              value={TenureId}
            />
            <input
              type="hidden"
              id="AmountFromUI"
              name="AmountFromUI"
              value={AmountFromUI}
            />

          </form>
          <div> */}

        {this.isSaveCardToBeShown ? (
          this.state.isCardPageToBeShown ? (
            <div className="card mb-0">
              <div
                id="collapsecreditdebit"
                class="card-body collapse active show"
                data-parent="#accordion"
              >
                {SaveCardDetails}
                {CardDetailData}
              </div>
            </div>
          ) : (
            <div className="card mb-0">
              <div
                id="collapsecreditdebit"
                class="card-body collapse active show"
                data-parent="#accordion"
              >
                {SaveCardDetails}
              </div>
            </div>
          )
        ) : (
          <div className="card mb-0">
            <div
              id="collapsecreditdebit"
              class="card-body collapse active show"
              data-parent="#accordion"
            >
              {CardDetailData}
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    merchant_payment_data:
      state.merchantPaymentDataFetchingReducer.merchantPaymentData,
    is_IRCTC: state.merchantPaymentDataFetchingReducer.isIRCTC,    
    error: state.merchantPaymentDataFetchingReducer.error,
    loading: state.merchantPaymentDataFetchingReducer.loading,
    selected_emi_data:
      state.merchantPaymentDataFetchingReducer.selected_emi_data,
    token: state.merchantPaymentDataFetchingReducer.token,
    paymentAmountUI: state.merchantPaymentDataFetchingReducer.paymentAmountUI,
    paymentModeId: state.merchantPaymentDataFetchingReducer.paymentModeId,
    RemovedSeqId: state.merchantPaymentDataFetchingReducer.RemovedSeqId,
    conveniencefee_data: state.merchantPaymentDataFetchingReducer.conveniencefeeData,
  };
};

export default connect(mapStateToProps)(Card);
//export default withRouter(connect(mapStateToProps)(Card));
//export default connect(mapStateToProps)(withRouter(Card));
