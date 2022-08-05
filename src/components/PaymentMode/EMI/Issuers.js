import React from "react";
import { connect } from "react-redux";
import "../../../css/style.css";
import axisbank from "../../../images/banks/axis.png";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  NavLink
} from "react-router-dom";
import { withRouter } from "react-router";
import * as PAYMENT_MODE_CONST from "../../../Constants/PaymentModeConstants";
import { ConstEmiTypeConfigData, ConstCardTypeConfigData, Tenure } from ".";
import MerchantPaymentDataUtils from "../../../utils/MerchantPaymentDataUtils";
import { IssuerType } from "../EMI";
import issuerType from "./IssuerType";
import { SetIssuerId } from "../../../stores/actions/EmiDataProcessingAction";
import { SetPaymentAmount } from "../../../stores/actions/PaymentModeAction";
class Issuers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { SelectedIssuerId: null };
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
    this.error = null;
    this.loading = null;
    this.mercantPaymentData = null;
    this.allIssuerForCardType = null;
  }

  GetDefaulIssuerId = () => {
    let issuerId = this.objMerchantPaymentDataUtils.GetDefaultSelectedIssuerId(
      this.allIssuerForCardType
    );

    if (!issuerId || issuerId == 0) {
      return;
    }
    return issuerId;
  };
  onClickIssuerIdNav = issuerId => {
    //alert("issuer selected" + issuerId);
    this.props.dispatch(SetIssuerId(issuerId));

    if (document.getElementById("selectbank")) {
      document.getElementById("selectbank").value = issuerId
    }

  };

  onClickIssuerIdDropdDown = data => {

    let issuerId = data.options[data.selectedIndex].value;
    if (issuerId == null || issuerId == undefined || issuerId == 0) {
      return;
    }
    this.props.dispatch(SetIssuerId(issuerId));
  };

  render() {
    const {
      error,
      loading,
      merchant_payment_data,
      selected_emi_data
    } = this.props;
    this.mercantPaymentData = merchant_payment_data;
    //let merchant_payment_data = this.mercantPaymentData;
    let emiTypeId = this.props.emi_type_id;
    let cardTypeId = this.props.card_type_id;
    if (cardTypeId == null || cardTypeId == 0 || cardTypeId == undefined) {
      return null;
    }

    this.allIssuerForCardType = this.objMerchantPaymentDataUtils.GetAllIssuersForEMITypeIdCardTypeId(
      this.mercantPaymentData,
      emiTypeId,
      cardTypeId
    );

    // this.objMerchantPaymentDataUtils.SetPaymentAmountUI(
    //   this.mercantPaymentData
    // );
    //alert("issuerdR:" + JSON.stringify(this.allIssuerForCardType));
    if (!this.allIssuerForCardType) {
      return null;
    }

    let defaultIssuerId = selected_emi_data.issuerId;
    //alert(selected_emi_data.cardType);

    // if (!selected_emi_data.issuerId) {
    //   //get default id
    //   defaultIssuerId = this.GetDefaulIssuerId();
    //   this.props.dispatch(SetIssuerId(defaultIssuerId));
    //   //  alert(defaultCardTypeId);
    // }
    // alert(JSON.stringify(issuers));
    let issuerListNav = this.allIssuerForCardType.slice(0, 4);
    let issuerDropDown = this.allIssuerForCardType.slice(
      0,
      this.allIssuerForCardType.length
    );

    let isContainsSpecialOffers = false;
    const dynamicIssuerList = issuerListNav.map(obj => {

      isContainsSpecialOffers = this.objMerchantPaymentDataUtils.IsIssuerContainsSpecialOffer(obj);

      return (
        <IssuerType
          issuer_id={obj.issuer_id}
          issuer_name={obj.issuer_name}
          key={obj.issuer_id}
          is_selected={defaultIssuerId == obj.issuer_id}
          isContainsSpecialOffers={isContainsSpecialOffers}
          onClicked={() => this.onClickIssuerIdNav(obj.issuer_id)}
        />
      );
    });

    var specialOfferTextShow = (<span class="text-blue fs-11"> Special offer available </span>)
    let DropDownHtml = null;
    if (
      issuerDropDown != null &&
      issuerDropDown != undefined &&
      issuerDropDown.length > 0
    ) {
      let dynamicissuerDropDown = issuerDropDown.map(obj => (
        <option
          key={obj.issuer_id}
          value={obj.issuer_id}

        // onClick={() => this.onClickIssuerIdNav(obj.issuer_id)}
        >
          {obj.issuer_name}
        </option>
      ));

      DropDownHtml = (
        <>
          <div class="row">
            <div class="col-12 orbanklist">
              <span>or</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6  col-md-6  col-sm-12 offset-lg-6 offset-md-6  offset-sm-6 col-12  pull-right">
              <div class="other-banks">
                <select
                  id="selectbank"
                  name="emi-issuer-drop-down"
                  class="form-control"
                  onChange={() =>
                    this.onClickIssuerIdDropdDown(
                      document.getElementById("selectbank")
                    )
                  }
                >
                  <option>Select Bank</option>
                  {dynamicissuerDropDown}
                </select>
                {/* <label for="selectbank">Select Bank</label> */}
              </div>
            </div>
          </div>
        </>
      );
    }

    // const isTenurePageToBeRender = (
    //   <Tenure
    //     emi_type_id={emiTypeId}
    //     card_type_id={cardTypeId}
    //     issuer_id={this.state.SelectedIssuerId}
    //     is_call_from_issuer={true}
    //   />
    // );
    //alert("issuer" + this.state.SelectedIssuerId);
    const isTenurePageToBeRender = defaultIssuerId ? (
      <Tenure
        emi_type_id={emiTypeId}
        card_type_id={cardTypeId}
        issuer_id={defaultIssuerId}
        is_call_from_issuer={true}
      />
    ) : null;
    return (
      <>
        <div className="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
          <div
            className=""
            id="nav-creditcard"
            role="tabpanel"
            aria-labelledby="nav-creditcard-tab"
          >
            <div className="col-12 p-0 bank-list">
              <div className="row">{dynamicIssuerList}</div>
              {DropDownHtml}
              {isTenurePageToBeRender}
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
    error: state.merchantPaymentDataFetchingReducer.error,
    loading: state.merchantPaymentDataFetchingReducer.loading,
    selected_emi_data:
      state.merchantPaymentDataFetchingReducer.selected_emi_data
  };
};

export default connect(mapStateToProps)(withRouter(Issuers));
