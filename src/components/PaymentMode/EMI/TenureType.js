import React from "react";
import * as EMI_TYPE_CONST from "../../../Constants/EMITypeConstants";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  NavLink
} from "react-router-dom";
import { EMITypeContent } from "../EMI";
import "../../../css/style.css";
import axisbank from "../../../images/banks/axis.png";
import MerchantPaymentDataUtils from "../../../utils/MerchantPaymentDataUtils";
import EmiDetails from "../../UIUtil/EmiDetails";

export const CONST_CARD_TYPE_DATA = [
  {
    CARD_TYPE_ID: 1,
    NAME: "Credit Card",
    VALUE: "Credit Card",
    ROUTE_PATH: "/credit_card"
  },
  {
    CARD_TYPE_ID: 2,
    NAME: "Debit Card",
    VALUE: "Debit Card ",
    ROUTE_PATH: "/debit_card"
  }
];

class tenureType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmiDetailsShown: false

    };
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
  }
  onClickEMIDetails = () => {
    this.setState({
      isEmiDetailsShown: true
    });
  };



  GetAdditionalCashBackTagText = (tenureData) => {
    let text = "";
  
    if (tenureData != null && tenureData.offer_scheme != null) {
      let arrproductDetails = tenureData.offer_scheme.product_details;
      if (arrproductDetails != null && arrproductDetails.length > 0) {
        text = arrproductDetails[0].additional_cashback;
      }
    }

    if (text != undefined && text != "") {
      return <div className="instant-discount">{text}</div>;
    }
    return text;

  }
  GetDiscountCashBackTagText = (
    tenureData,
    emiModelType,
    discountCashBackAmount,
    original_amount
  ) => {
    let text = "";
    // alert("discountCashBackAmount" + discountCashBackAmount);
    if (discountCashBackAmount > 0) {
      if (emiModelType == 1) {
        if (
          tenureData.loan_amount == tenureData.auth_amount &&
          tenureData.auth_amount == original_amount
        ) {
          text = "₹" + discountCashBackAmount + "post cashback applied";
        } else if (tenureData.loan_amount < tenureData.auth_amount) {
          text = "₹" + discountCashBackAmount + " pre cashback applied";
        } else if (tenureData.loan_amount == tenureData.auth_amount) {
          text = "₹" + discountCashBackAmount + " instant discount applied";
        }
      } else if (emiModelType == 2) {
        text = "₹" + discountCashBackAmount + " instant discount applied";
      }
      if (text != "") {
        return <div className="instant-discount">{text}</div>;
      }
      return text;
    }
  };
  onClose = () => {
    this.setState({
      isEmiDetailsShown: false
    });
  };
  render() {
    const tenureID = this.props.tenure_id;
    const isSelected = this.props.is_selected;


    const obj = this.props.TenureData;
    const emiTypeName = this.props.emiTypeName;
    const proceedButtonTenureId = this.props.proceedButtonTenureId;
    const emiModelType = this.props.emiModelType;
    const originalAmount = this.props.original_amount;
    let additionalCashbackText = "";

    var bIsTenureIsAllowed = this.objMerchantPaymentDataUtils.IsTenureContainsSpecialOffer(obj);

    
    var showSpecialOfferText =
      (bIsTenureIsAllowed)
        ? (<span class="text-blue fs-11">Special offer available</span>)
        : (null)

    let tenureInMonthText = tenureID == EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID ? "No EMI Only Cashback" : obj.tenure_in_month + " Months";
    let interestRateText = tenureID == EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID ? "" : " at" + obj.bank_interest_rate / 10000 + "% p.a.";
    let monthlyInstallementText = tenureID == EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID ? "" : "₹" + obj.monthly_installment / 100;
    let emiTypeNameText = tenureID == EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID ? "" : "(" + emiTypeName + ")";
    //debugger;
    let discountcashbackTagText = tenureID == EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID ?
      this.GetAdditionalCashBackTagText(obj) :
      this.GetDiscountCashBackTagText(
        obj,
        emiModelType,
        obj.total_offerred_discount_cashback_amount / 100,
        originalAmount
      )

    let emiDetailsTextLink = <NavLink
      to="#"
      href="#collapseemi"
      className="emi-tab  "
      activeClassName="active"
      role="tab"
      aria-controls="nav-home"
      aria-selected="true"
      onClick={this.onClickEMIDetails}
    >
      {tenureID == EMI_TYPE_CONST.NO_EMI_ONLY_CASHBACK_TENURE_ID ?
        "Offer Details" : "EMI Details"}
    </NavLink>
      ;
    return (
      <>
        {this.state.isEmiDetailsShown ? (
          <EmiDetails tenureData={obj} onClose={this.onClose} />
        ) : null}
        <div className="col-lg-4 col-md-4 col-sm-6 col-12  mb-3 pr-2">
          {/* <a id="#Kotak"></a> */}
          <div
            className={`emi-tenure ${isSelected ? "active" : "disabled"} ${tenureID == proceedButtonTenureId ? "deactive" : ""
              }`}
          >
            {/* <a id="#Kotak"> */}
            <div className="custom-control custom-radio">
              {/* <div className="custom-control "> */}
              {/* </div><div class="custom-control"> */}
              <input
                type="radio"
                class="custom-control-input"
                id={tenureID + "months"}
                value={tenureID}
                //name="tenure_rb"
                name="defaultExampleRadios"
                onClick={this.props.onClickTenureSelectionRadioButton}
                checked={isSelected}
              />
              <label class="custom-control-label" htmlFor={tenureID + "months"}>
                <span className="pull-left text-left months">
                  {tenureInMonthText}
                  <br></br>
                  <span className="roi">
                    {interestRateText}
                  </span>
                </span>
                <span className="pull-right text-right amount">
                  {monthlyInstallementText}
                  <br></br>
                  <span className="emi-name">{emiTypeNameText}</span>
                </span>
              </label>
            </div>
            {discountcashbackTagText}{" "}
            {/* ₹200 Instant discount applied */}
            {/* <div className="instant-discount">
                       
                      </div> */}
            {/* </a> */}
            <div className="emi-details-link pull-left">
              {/* <a id="#Kotak"></a> */}
              {emiDetailsTextLink}
            </div>
            <div className="validate">
              <button
                className="btn btn-green  btn-small"
                disabled={!isSelected}
                onClick={this.props.onClickSelectIssuerTenureBtn}
              >
                Proceed
              </button>
            </div>
          </div>
          {showSpecialOfferText}
        </div>
      </>
    );

    return null;
  }
}

// const tenureType = function TenureType(props) {
//   return (() => {
//     const tenureID = props.tenure_id;
//     const isSelected = props.is_selected;
//     const obj = props.TenureData;
//     const emiTypeName = props.emiTypeName;
//     const proceedButtonTenureId = props.proceedButtonTenureId;
//     const emiModelType = props.emiModelType;
//     const originalAmount = props.original_amount;
//     return (
//       <>
//         <div className="col-lg-4 col-md-4 col-sm-6 col-12  mb-3 pr-2">
//           {/* <a id="#Kotak"></a> */}
//           <div
//             className={`emi-tenure ${isSelected ? "active" : ""} ${
//               tenureID == proceedButtonTenureId ? "deactive" : ""
//             }`}
//           >
//             <a id="#Kotak">
//               {/* <div className="custom-control custom-radio"> */}
//               <div className="custom-control ">
//                 <input
//                   type="radio"
//                   className=""
//                   id={tenureID}
//                   value={tenureID}
//                   name="tenure_rb"
//                   onClick={props.onClickTenureSelectionRadioButton}
//                   checked={isSelected}
//                 />
//                 {/* <label
//                           className="custom-control-label"
//                           for="defaultUnchecked"
//                         > */}
//                 <span className="pull-left text-left months">
//                   {obj.tenure_in_month} Months
//                   <span className="roi">
//                     at {obj.bank_interest_rate / 10000}% p.a.
//                   </span>
//                 </span>
//                 <span className="pull-right text-right amount">
//                   ₹{obj.monthly_installment / 100}
//                   <span className="emi-name">({emiTypeName})</span>
//                 </span>
//                 {/* </label> */}
//               </div>
//               {GetDiscountCashBackTagText(
//                 obj,
//                 emiModelType,
//                 obj.total_offerred_discount_cashback_amount / 100,
//                 originalAmount
//               )}{" "}
//               {/* ₹200 Instant discount applied */}
//               {/* <div className="instant-discount">

//                       </div> */}
//             </a>
//             <div className="emi-details-link pull-left">
//               {/* <a id="#Kotak"></a> */}
//               <span
//                 // to="#"
//                 // href="#collapseemi"
//                 // className="emi-tab  "
//                 // activeClassName="active"
//                 // role="tab"
//                 // aria-controls="nav-home"
//                 // aria-selected="true"
//                 onClick={<EmiDetails />}
//               >
//                 EMI details
//               </span>
//             </div>
//             <div className="validate pull-right">
//               <button
//                 className="btn btn-green  btn-small"
//                 disabled={!isSelected}
//                 onClick={props.onClickSelectIssuerTenureBtn}
//               >
//                 Proceed
//               </button>
//             </div>
//           </div>
//         </div>
//       </>
//       );

//     return null;
//   })();
// };

export default tenureType;
