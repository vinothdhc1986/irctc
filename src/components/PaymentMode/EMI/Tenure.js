import React from "react";
import { connect } from "react-redux";
import "../../../css/style.css";
import { withRouter } from "react-router";
import * as ISSUER_CONST from "../../../Constants/IssuersConstants";

import { ConstEmiTypeConfigData, ConstCardTypeConfigData } from "../EMI";
import { SetSelectedEMICardIssuerTenureData } from "../../../stores/actions/EmiDataProcessingAction";
import MerchantPaymentDataUtils from "../../../utils/MerchantPaymentDataUtils";
import PaymentAmountUIFetchUtil from "../../../utils/PaymentAmountUIFetchUtil";
import {
  SetTenureId,
  SetOtherEMI
} from "../../../stores/actions/EmiDataProcessingAction";
import { SetPaymentAmount } from "../../../stores/actions/PaymentModeAction";
import OtpModelPopUp from "../../UIUtil/OtpModelPopUp";
import TenureType from "./TenureType";
import DebitEMIOTPIssuer from "./Issuers/DebitEMIOTPIssuer";
import SavedCardEMI from "./SavedCardEMI"
import {
  ConstCashbackTypeConfigData
} from "../CashbackOnFullPayment";
import * as EMI_TYPE_CONST from "../../../Constants/EMITypeConstants";

class Tenure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isButtonClicked: false,
      tenureSelectedId: null,
      onProceedBtnClickNotSelectedTenureId: null,
      isOtpPageToBeShown: false
    };
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
    this.objPaymentAmountUIUtil = new PaymentAmountUIFetchUtil();
    this.error = null;
    this.loading = null;
    this.mercantPaymentData = null;
    this.conveniencefeeData = null;
    this.allTenureForIssuer = null;
    this.tenureSelectedId = null;
    this.is_call_from_issuer = null;
    this.emiModelType = null;
    this.paymentAmountForEMI = null;
    this.isOtpPageToBeShown = false;
  }
  setAmountGlobally = (tenureId, authAmount) => {
    this.paymentAmountForEMI = this.objPaymentAmountUIUtil.GetPaymentAmountUIForEMI(
      this.mercantPaymentData,
      this.emiModelType,
      this.allTenureForIssuer,
      tenureId
    );
    this.props.dispatch(SetPaymentAmount(authAmount));
  };
  // GetDiscountCashBackTagText = (emiModelType, discountCashBackAmount) => {
  //   let text = "";

  //   if (discountCashBackAmount > 0) {
  //     if (emiModelType == 1) {
  //       text = "₹" + discountCashBackAmount + " Cashback applied";
  //     } else if (emiModelType == 2) {
  //       text = "₹" + discountCashBackAmount + " Instant discount applied";
  //     }
  //     if (text != "") {
  //       return <div className="instant-discount">{text}</div>;
  //     }
  //     return text;
  //   }
  // };
  onClickTenureSelectionRadioButton = (tenureId, authAmount) => {

    if (tenureId == this.state.onProceedBtnClickNotSelectedTenureId) {
      this.setState({
        onProceedBtnClickNotSelectedTenureId: null
      });
    }
    this.props.dispatch(SetTenureId(tenureId));
    this.setAmountGlobally(tenureId, authAmount);
  };

  componentDidMount() {
    //alert("tenure:mount");
    let tenureId = this.objMerchantPaymentDataUtils.GetDefaultSelectedTenureId(
      this.allTenureForIssuer
    );

    if (!tenureId || tenureId == 0) {
      return;
    }

    if (!this.props.selected_emi_data.tenureId) {
      this.onClickTenureSelectionRadioButton(tenureId);
    }
  }

  GetDefaultTenureId() {
    let tenureId = this.objMerchantPaymentDataUtils.GetDefaultSelectedTenureId(
      this.allTenureForIssuer
    );

    if (!tenureId || tenureId == 0) {
      return;
    }

    return tenureId;
  }
  onClickSelectIssuerTenureBtn = (

    cardTypeId,
    emiTypeId,
    issuerId,
    onProceedBtnTenureId
  ) => {


    if (this.props.selected_emi_data.tenureId != onProceedBtnTenureId) {
      this.setState({
        onProceedBtnClickNotSelectedTenureId: onProceedBtnTenureId
      });
      return;
    }
    this.setState({
      onProceedBtnClickNotSelectedTenureId: null
    });

    if (ISSUER_CONST.ISSUER_DEBIT_EMI_OTP_TO_BE_SHOWN.includes(parseInt(issuerId))) {
      this.setState({ isOtpPageToBeShown: true }); //({ isOtpPageToBeShown: true });
      this.props.dispatch(SetOtherEMI());
    } else {
      this.setState({ isOtpPageToBeShown: false });
    }

    let tenuredata = this.objMerchantPaymentDataUtils.GetTenureDataForTenureId(
      this.mercantPaymentData,
      emiTypeId,
      cardTypeId,
      issuerId,
      onProceedBtnTenureId
    );

    // this.loanAmount = tenuredata.auth_amount;

    let emiSelectedData = {
      payment_mode: 4,
      emiType: emiTypeId,
      cardType: cardTypeId,
      issuerId: issuerId,
      tenureId: onProceedBtnTenureId,
      paymentAmountForEMI: tenuredata.auth_amount,
      isSaveCardEMIPage: this.props.isSaveCardEMIPage != true ? false : true
    };
    //this.props.dispatch(SetTenureId(emiSelectedData));
    // alert("tenure end" + JSON.stringify(this.props.selected_emi_data));
    this.props.dispatch(SetSelectedEMICardIssuerTenureData(emiSelectedData));

    //on issuer id basis validation
    //alert("issuer:" + issuerId);

    // this.props.history.push("/emi/cards");
  };

  render() {
    // alert(this.state.isOtpPageToBeShown);
    //console.log('---props-----'+JSON.stringify(this.props));
    const {
      error,
      loading,
      merchant_payment_data,
      selected_emi_data,
      conveniencefee_data
    } = this.props;
    this.mercantPaymentData = merchant_payment_data;
   // this.conveniencefeeData = conveniencefee_data.total;
    let emiTypeId = this.props.emi_type_id;
    let cardTypeId = this.props.card_type_id;
    let issuerId = this.props.issuer_id;
    if (issuerId == null || issuerId == 0 || issuerId == undefined) {
      return null;
    }

    var emiTypeConfData = ConstEmiTypeConfigData.filter(
      obj => obj.EMI_TYPE_ID === emiTypeId
    );

    if (emiTypeConfData == null || emiTypeConfData.length === 0) {
      emiTypeConfData = ConstCashbackTypeConfigData.filter(
        obj => obj.EMI_TYPE_ID === emiTypeId
      );

    }

    this.allTenureForIssuer = this.objMerchantPaymentDataUtils.GetAllTenuresForEMITypeIdCardTypeIdIssuerId(
      this.mercantPaymentData,
      emiTypeId,

      cardTypeId,
      issuerId
    );
    if (!this.allTenureForIssuer) {
      return null;
    }

    this.emiModelType = this.objMerchantPaymentDataUtils.GetEMIModelTypeId(
      this.mercantPaymentData
    );
    //alert("tenure:" + this.state.tenureSelectedId);
    //alert(this.state.tenureSelectedId);
    // {
    //   this.onTenureSelectionRadioButtonclicked(4);
    // }
    let defaultTenureId = selected_emi_data.tenureId;

    if ((emiTypeId != EMI_TYPE_CONST.EMI_TYPE_NO_EMI_ONLY_CASHBACK_COST_EMI && defaultTenureId == EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID)
      || (emiTypeId == EMI_TYPE_CONST.EMI_TYPE_NO_EMI_ONLY_CASHBACK_COST_EMI && defaultTenureId != EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID)
    ) {
      defaultTenureId = null
    }


    //alert(selected_emi_data.cardType);
    if (!defaultTenureId) {
      //get default id
      defaultTenureId = this.GetDefaultTenureId();
      this.props.dispatch(SetTenureId(defaultTenureId));
    }



    let tenureData = this.objMerchantPaymentDataUtils.GetTenureData(
      this.allTenureForIssuer,
      defaultTenureId
    );
    this.setAmountGlobally(defaultTenureId, tenureData.auth_amount);
   // this.setAmountGlobally(defaultTenureId, this.conveniencefeeData);

    let dynamicTenureList = this.allTenureForIssuer.map(obj => {
    
      return (
        <TenureType
          TenureData={obj}
          tenure_id={obj.tenure_id}
          key={obj.tenure_id}
          is_selected={defaultTenureId == obj.tenure_id}
          emi_model_type_id={this.emiModelType}
          emiTypeName={emiTypeConfData[0].NAME}
          onClickTenureSelectionRadioButton={() =>
            this.onClickTenureSelectionRadioButton(
              obj.tenure_id,
              obj.auth_amount
            )
          }
          onClickSelectIssuerTenureBtn={() =>
            this.onClickSelectIssuerTenureBtn(
              cardTypeId,
              emiTypeId,
              issuerId,
              obj.tenure_id
            )
          }
          proceedButtonTenureId={
            this.state.onProceedBtnClickNotSelectedTenureId
          }
          emiModelType={this.emiModelType}
          original_amount={this.objMerchantPaymentDataUtils.GetPaymentAmount(
            this.mercantPaymentData
          )}
         // original_amount={this.conveniencefeeData}
        />
      );
    });
    // alert(
    //   "issuer tenure hdfc" +
    //     issuerId +
    //     selected_emi_data.isSelected +

    // );
    let isOtpToBeShown = "";
    if (
      ISSUER_CONST.ISSUER_DEBIT_EMI_OTP_TO_BE_SHOWN.includes(parseInt(issuerId)) &&
      selected_emi_data.isSelected && this.props.isSaveCardEMIPage != 1 && emiTypeId != 4
    ) {


      isOtpToBeShown = (
        <>
          <DebitEMIOTPIssuer />
          <OtpModelPopUp />
        </>
      );
    }


    let isSaveCardPageToBeShown = "";
    if (this.props.isSaveCardEMIPage &&
      selected_emi_data.isSelected) {
      isSaveCardPageToBeShown =
        <SavedCardEMI sequenceId={this.props.sequenceId} />
    }

    let selectEMIPlanText = emiTypeId != 4 ? "Select EMI plan" : ""
    return (
      <>
        <div className="col-lg-12 p-0 emi-plan clearfix" id="hdfcbank">
          {/* <a id="#Kotak"> */}

          <h3>{selectEMIPlanText}</h3>
          {/* </a> */}
          <div className="row">
            {/* <a id="#Kotak"></a> */}
            {dynamicTenureList}
          </div>
        </div>

        {isOtpToBeShown}
        {isSaveCardPageToBeShown}
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
    conveniencefee_data: state.merchantPaymentDataFetchingReducer.conveniencefeeData,
  };
};

export default connect(mapStateToProps)(withRouter(Tenure));
