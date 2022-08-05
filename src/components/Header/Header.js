import React from "react";
import "../../css/style.css";
import { connect } from "react-redux";
import Navigation from "../Navigation/Navigation";
import {
  payConveniencefee
} from "../../stores/actions/CommonAction";

import MerchantPaymentDataUtils from "../../utils/MerchantPaymentDataUtils";
import HeaderTopBar from "./HeaderTopBar";
import $ from "jquery";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketamount:0,
      conveniencefee :0,
      overalltotoal:0,
      first_run: true,
    };
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
    this.error = null;
    this.loading = null;
    this.merchant_payment_data = null;
  }

  componentDidMount() {
    $(window).scroll(function () {
      var scroll = $(window).scrollTop();
      if (scroll >= 10) {
        $("#header").addClass("darkHeader");
      }
      else {
        $("#header").removeClass("darkHeader");
      }

    });
  }
  
  payConveniencefee = (body) => {
    this.props
      .dispatch(payConveniencefee(body))
      .then((response) => {
        let responseData = JSON.parse(response.data);
     // console.log("-----conviencefee responseData==="+JSON.stringify(responseData));
       if(responseData.fee!=undefined || responseData.total !=undefined)
       this.setState({
        ticketamount: responseData.amount, 
        conveniencefee: responseData.fee,
        overalltotoal: responseData.total,
        first_run: false
      });  
      })
      .catch((error) => {
      });
    return;
  };


  render() {
    
    this.error = this.props.error;
    this.loading = this.props.loading;
    this.merchant_payment_data = this.props.merchant_payment_data;
    let merchant_id = 0;
    let amount = 0;
    let unique_merchant_txn_id = 0;
    let pinePgTxnId = 0;
    this.is_IRCTC = this.props.is_IRCTC;
    console.log('-----is irctc'+this.is_IRCTC);
    if(this.merchant_payment_data!=undefined){
          merchant_id = this.merchant_payment_data.merchant_data.merchant_id;
          amount = this.merchant_payment_data.payment_data.amount_in_paisa;
          unique_merchant_txn_id = this.merchant_payment_data.merchant_data.unique_merchant_txn_id;
          pinePgTxnId = this.merchant_payment_data.txn_data.pine_pg_txn_id;
    }
    const merchantData = this.objMerchantPaymentDataUtils.GetMerchantData(
      this.merchant_payment_data
    );
    let conveniencefee = {
      merchantid : merchant_id,
      mode : "CC",
      amount: amount,
      unique_merchant_txn_id:unique_merchant_txn_id,
      pinePgTxnId : pinePgTxnId,
    };
    //console.log('----conveniencefee===='+JSON.stringify(conveniencefee));
    if(this.state.first_run&&this.is_IRCTC)
    {
     this.payConveniencefee(conveniencefee);
    }
    const paymentData = this.objMerchantPaymentDataUtils.GetPaymentData(
      this.merchant_payment_data
    );
    if (!merchantData || !paymentData) {
      return null;
    }

    let MerchantImagelogo = this.objMerchantPaymentDataUtils.GetMerchantLogo(
      merchantData
    );
    if (MerchantImagelogo == null || MerchantImagelogo == "") {
      MerchantImagelogo = "";
    }
    return (
      <>
        <header id="header" class="clearfix fixed-top">
          <HeaderTopBar merchantLogoSrc={MerchantImagelogo} />
          <div class="transaction-header">
            <div class="container">
           <div class={this.is_IRCTC?"col-lg-12 col-md-12 col-sm-12 col-xs-12 merchant-details-irctc ":
            "col-lg-12 col-md-12 col-sm-12 col-xs-12 merchant-details "}>
                <div class="rows">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-6 pull-left p0 merchant-transaction">
                    Merchant Transaction ID:
                    <span class="transaction-id">
                      {" "}
                      {this.objMerchantPaymentDataUtils.GetMerchantTxnId(
                        merchantData
                      )}
                    </span>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-6 pull-right text-right p10 total-amount-paid">
                  {this.is_IRCTC?<> Ticket Amount{" "}: <br />{" "}</>:<>
                  Total amount to be paid{" "}: <br />{" "}</>}
                    <span class="total-amount">
                      &#x20B9;{this.is_IRCTC?((this.state.ticketamount/ 100) % 1 == 0 ? (this.state.ticketamount/ 100).toFixed() : (this.state.ticketamount/ 100).toFixed(2)):(this.props.paymentAmountUI / 100)}
                    </span>{" "}
                  </div>
                {this.is_IRCTC?(<>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-6 pull-right text-right p0 total-amount-paid"><br/></div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-6 pull-right text-right p0 total-amount-paid">
                  Convenience Charge + 18% GST: <br />{" "}
                    <span class="total-amount">
                      &#x20B9;{(this.state.conveniencefee/ 100) % 1 == 0 ? (this.state.conveniencefee/ 100).toFixed() : (this.state.conveniencefee/ 100).toFixed(2)}
                    </span>{" "}
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-6 pull-right text-right p0 total-amount-paid"><br/></div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-6 pull-right text-right p0 total-amount-paid">
                  Overall Total{" "}: <br />{" "}
                    <span class="total-amount">
                      &#x20B9;{(this.state.overalltotoal/100) % 1 == 0 ? (this.state.overalltotoal/100).toFixed() : (this.state.overalltotoal/100).toFixed(2)}
                    </span>{" "}
                  </div>
                </>):null}
                  


                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="content mb10">
          <div className="container">
            <Navigation />
          </div>
        </section>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    merchant_payment_data:
      state.merchantPaymentDataFetchingReducer.merchantPaymentData,
    is_IRCTC: state.merchantPaymentDataFetchingReducer.isIRCTC,  
    error: state.merchantPaymentDataFetchingReducer.error,
    loading: state.merchantPaymentDataFetchingReducer.loading,
    paymentAmountUI: state.merchantPaymentDataFetchingReducer.paymentAmountUI,
    paymentFee: state.merchantPaymentDataFetchingReducer.paymentfee,
    conveniencefee_data: state.merchantPaymentDataFetchingReducer.conveniencefeeData,

  };
};

export default connect(mapStateToProps)(Header);
