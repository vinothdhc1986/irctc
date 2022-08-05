import React from "react";
import { connect } from "react-redux";
import "../../../../css/style.css";


import { EMIType, Cards } from "../EMI";
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
  CheckDebitEMIIssuerElegibilty
} from "../../../../stores/actions/CommonAction";

import MerchantPaymentDataUtils from "../../../../utils/MerchantPaymentDataUtils";
class HdfcIssuer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DebitCardNumber: "",
      DebitMobileNo: null
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
    this.schemeID = null;
    this.loanAmount = null;
    this.selected_emi_data = null;
  }

  onCardNumberKeyUp = () => {
    if (this.typingTimer) clearTimeout(this.typingTimer); // Clear if already set
    this.typingTimer = setTimeout(
      this.onCardValidation,
      this.doneTypingInterval
    );
  };

  onCardNumberKeyDown = () => {
    clearTimeout(this.typingTimer);
  };
  onCardValidation = event => {
    // alert("onClickDebitEMISendOtp");
    let cardNo = this.state.DebitCardNumber;
    if (cardNo.length <= 12) {
      return;
    }
    if (this.props.paymentModeId == 1) {
      return;
    }
    this.CardValidationModel = {
      card_number: cardNo,
      scheme_id: this.schemeID,
      issuer_id: this.selected_emi_data.issuerId,
      tenure_id: this.selected_emi_data.tenureId,
      card_expiry_date: this.state.CardExpiryDate,
      loan_amount: this.loanAmount,
      mobile_no: this.state.DebitMobileNo
    };

    this.props
      .dispatch(
        CheckIssuerCardBinIsValidEMI(this.props.token, this.CardValidationModel)
      )
      .then(json => {
        let responseData = json.data;
        // alert(responseData.RESPONSE_CODE);
        if (responseData.response_code == 1) {
          //check issuer elegibility
          if (this.selected_emi_data.issuerId == ISSUER_CONST.AXIS_DEBIT_EMI_ISSUER) {
            this.props
              .dispatch(
                CheckDebitEMIIssuerElegibilty(
                  this.props.token,
                  this.CardValidationModel
                )
              )
              .then(json => {
                //alert(JSON.stringify(json));
                let responseData = json.data;
                // alert(responseData.RESPONSE_CODE);
                if (responseData.response_code == 1) {
                } else {
                }
              });
          }
        } else {
        }
      })
      .catch(error => {
        alert(error);
      });
    return;
  };

  onClickDebitEMISendOtp = () => {
    // alert("onClickDebitEMISendOtp");
    let cardNo = this.state.DebitCardNumber;
    this.CardValidationModel = {
      card_number: cardNo,
      scheme_id: this.schemeID,
      issuer_id: this.selected_emi_data.issuerId,
      tenure_id: this.selected_emi_data.tenureId,
      card_expiry_date: this.state.CardExpiryDate,
      loan_amount: this.loanAmount,
      mobile_no: this.state.DebitMobileNo
    };
    this.props
      .dispatch(
        CheckDebitEMIIssuerElegibilty(
          this.props.token,
          this.CardValidationModel
        )
      )
      .then(json => {
        //alert(JSON.stringify(json));
        let responseData = json.data;
        // alert(responseData.RESPONSE_CODE);
        if (responseData.response_code == 1) {
          alert("issuer debit");
        } else {
        }
      })
      .catch(error => {
        alert(error);
      });
  };
  myChangeHandler = event => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
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
    let PaymentModeId = 1;
    let IssuerId = 0;
    let TenureId = 0;
    let CardTypeId = 0;
    let EmiTypeId = 0;
    let TxnType = 1;
    let AmountFromUI = this.props.paymentAmountUI;
    let debitEMIPennyTxnNote = "";
    let actionName =
      process.env.REACT_APP_PG_CONTROLLER +
      "pinepg/v2/submit/emi?token=" +
      encodeURIComponent(this.props.token);
    if (
      selected_emi_data &&
      selected_emi_data.paymentMode == 4 &&
      selected_emi_data.emiType &&
      selected_emi_data.cardType &&
      selected_emi_data.issuerId &&
      selected_emi_data.tenureId
    ) {
      PaymentModeId = 4;
      IssuerId = selected_emi_data.issuerId;
      TenureId = selected_emi_data.tenureId;
      CardTypeId = selected_emi_data.cardType;
      EmiTypeId = selected_emi_data.emiType;

      let issuerName = this.objMerchantPaymentDataUtils.GetIssuerDataForEMITypeIdCardTypeId(
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
      let tenureMonths = tenuredata.tenure_in_month;
      let emiPerMonth = tenuredata.monthly_installment;
      this.schemeID = tenuredata.applicable_scheme.scheme_id;
      this.loanAmount = tenuredata.loan_amount;
    }
    return (
      <div class="col-lg-12 p-0 checkeligibility clearfix">
        <h3>
          Enter card number & registered mobile number to check eligibility
        </h3>
        <div class="row">
          <div class="col-lg-5 col-md-5 col-sm-5 col-12 mb-3  pr-2">
            <input
              class="form-control"
              type="text"
              id="DebitCardNumber"
              name="DebitCardNumber"
              required=""
              value={this.state.DebitCardNumber}
              onChange={this.myChangeHandler}
              onKeyUp={this.onCardNumberKeyUp}
              onKeyDown={this.onCardNumberKeyDown}
            />
            <label for="1">Enter card no.</label>
          </div>
          <div class="col-lg-5 col-md-5 col-sm-5 col-12 mb-3  pr-2">
            <input
              class="form-control"
              type="text"
              id="DebitMobileNo"
              name="DebitMobileNo"
              required=""
              onChange={this.myChangeHandler}
              value={this.state.DebitMobileNo}
            />
            <label for="2">Enter mobile no.</label>
          </div>
          <div class="col-lg-2 col-md-2 col-sm-2 col-12 mb-3">
            <button
              class="btn btn-medium btn-green"
              data-toggle="modal"
              data-target="#sendOtp"
              onClick={this.onClickDebitEMISendOtp}
            >
              Send OTP
            </button>
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps)(HdfcIssuer);
