import React from "react";
import pl from "../../images/pinelabs-logo.png";
import "../../css/style.css";
import { connect } from "react-redux";
import Navigation from "../Navigation/Navigation";
import MerchantPaymentDataUtils from "../../utils/MerchantPaymentDataUtils";
import Loader from "react-loader-spinner";
import PopUp from "../HOC/PopUp";
import { FETCHING_MERCHANT_PAYMENT_DATA_BEGINS } from "../../stores/actions/CommonAction";
class EmiDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickedClose = () => { };
  render() {
    const {conveniencefee_data,is_IRCTC}=this.props;
    // alert("emi details");
    //this.props.IsEmiDetailsOpen
   // console.log('-----emi details----'+JSON.stringify(conveniencefee_data.data.fee));
    let tenureData = this.props.tenureData;
    let dynamicItemLevelEMIdetails = null;
    if (tenureData != null && tenureData.offer_scheme != null) {
      let arrproductDetails = tenureData.offer_scheme.product_details;
      let tenuerMonths = tenureData.tenure_in_month;
      if (arrproductDetails != null && arrproductDetails.length > 0) {
        dynamicItemLevelEMIdetails = arrproductDetails.map(pd => {
          let defaultValue = 0;
          let conveniencefee = 0;
          let product_amount =0;
          if(is_IRCTC)
          {   
           conveniencefee = pd.product_amount + conveniencefee_data.data.fee;
           product_amount = conveniencefee ?? defaultValue;
          }
         else
         {
            product_amount = pd.product_amount ?? defaultValue;
         }
          product_amount = pd.product_amount ?? defaultValue;
          pd.bank_interest_rate = pd.bank_interest_rate ?? defaultValue;
          pd.product_discount = pd.product_discount ?? defaultValue;
          pd.subvention_cashback_discount = pd.subvention_cashback_discount ?? defaultValue;
          pd.additional_cashback = pd.additional_cashback ?? defaultValue;
          return (
            <div class="col-12 paymentSummaryDetail">

              {pd.product_display_name == 'NO_PRODUCT_DISPLAY_NAME' ? null :
                <div class="row">
                  <div class="col-7 text-left fw-600">
                    <p>{pd.product_display_name}</p>
                  </div>
                  {/* <div class="col-5 text-right fw-600">
                  <p>Qty: 1</p>
                </div> */}
                </div>}
              <div class="row">
                <div class="col-7 text-left">
                  <p>Item value</p>
                </div>
                <div class="col-5 text-right">
                  <p class="">₹{(product_amount/ 100) }</p>
                </div>
              </div>
              <div class="row">
                <div class="col-7 text-left">
                  <p>Interest(charge by bank)</p>
                </div>
                <div class="col-5 text-right">
                  <p class="">₹{pd.bank_interest_rate / 100}</p>
                </div>
              </div>
              {pd.product_discount > 0 ? (
                <div class="row">
                  <div class="col-7 text-left">
                    <p class="text-green">Product Instant Discount</p>
                  </div>
                  <div class="col-5 text-right">
                    <p class="text-green"> ₹{pd.product_discount / 100}</p>
                  </div>
                </div>
              ) : null}
              {pd.subvention_cashback_discount > 0 ? (
                <div class="row">
                  <div class="col-7 text-left">
                    <p class="text-green">EMI Discount/Cashback </p>
                  </div>
                  <div class="col-5 text-right">
                    <p class="text-green">
                      ₹{pd.subvention_cashback_discount / 100}
                    </p>
                  </div>
                </div>
              ) : null}

              {pd.additional_cashback !== undefined ? (
                <div class="row">
                  <div class="col-7 text-left">
                    <p class="text-green">Add.Cashback</p>
                  </div>
                  <div class="col-5 text-right">
                    <p class="text-green">

                      {pd.additional_cashback}
                    </p>
                  </div>
                </div>
              ) : null}





              <div class="row">
                <div class="col-7 text-left">
                  <p>Total EMI for {tenuerMonths} months </p>
                </div>
                <div class="col-5 text-right">
                  <p>
                    {" "}
                    ₹
                    {((product_amount +
                      pd.bank_interest_rate -
                      pd.product_discount -
                      pd.subvention_cashback_discount) /
                      100)}
                  </p>
                </div>
              </div>
            </div>
          );
        });
      }
    }

    return true ? (
      <PopUp onClose={this.props.onClose}>
        <>
          <div class="modal-content">
            <div class="modal-body clearfix">
              <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                {/* <h2>EMI Detailss</h2> */}
                <h2>EMI Details</h2>
              </div>
              {dynamicItemLevelEMIdetails}
              {/* <div class="final-price clearfix">
                <div class="col-12 ">
                  <div class="row">
                    <div class="col-7 text-left fw-600">
                      <p>Final Price </p>
                    </div>
                    <div class="col-5 text-right fw-600">
                      <p>₹4,560</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </>
      </PopUp>
    ) : null;
  }
}

const mapStateToProps = state => {
  return {
    sessionExpires: state.merchantPaymentDataFetchingReducer.sessionExpires,
    is_IRCTC: state.merchantPaymentDataFetchingReducer.isIRCTC,  
    token: state.merchantPaymentDataFetchingReducer.token,
    conveniencefee_data: state.merchantPaymentDataFetchingReducer.conveniencefeeData,

  };
};

export default connect(mapStateToProps)(EmiDetails);
