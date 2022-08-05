import React from "../../../node_modules/react";

import "../../css/style.css";
import { connect } from "react-redux";
import { fetchMerchantPayMentDataFromAPI } from "../../stores/actions/MerchantPaymentDataFetchingActions";
import { setUpiTimerViewData } from "../../stores/actions/UpiPaymentModeAction";
import { setBharatQRTimerViewData } from "../../stores/actions/BharatQrCodeViewConfigsAction";

import UpiTimerView from "../PaymentMode/UPI/UpiTimerView";
import UpiMandateTimerView from "../PaymentMode/UPIMandate/UpiMandateTimerView";
import UpiExecuteMandateTimerView from "../PaymentMode/UPIMandate/UpiExecuteMandateTimerView";

import BharatQRCodeView from "../PaymentMode/BharatQR/BharatQRCodeView";
import HeaderTopBar from "../Header/HeaderTopBar"


import Header from "../Header/Header";
import Footer from "../Footer/footer";

import "../../css/loader.css";
import queryString from "query-string";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import GloablLoader from "../UIUtil/GloablLoader";
import GlobalError from "../UIUtil/GlobalError";
import SessionExpires from "../UIUtil/SessionExpires";
import EmiDetails from "../UIUtil/EmiDetails";
// import UpiMandateTimerView from "../PaymentMode/UpiMandate/";

class App extends React.Component {
  constructor(props) {
    super(props)
    let url = this.props.location.search;
    let params = queryString.parse(url);
    let upiApiTimer = params.apiTime || 0;
    this.componentToRender = "";
    this.paymentMode = "";
    this.isBharatQRTimerView = false;
    this.isUpiTimerView = false;
    this.isUpiMandateTimerView = false;
    this.isUpiExecuteMandateTimerView = false;
    if (params.paymentMode
      && params.paymentMode !== undefined && params.paymentMode !== null) {
      this.paymentMode = params.paymentMode;
    }
    if (this.paymentMode && this.paymentMode !== "") {
      switch (this.paymentMode) {
        case "BharatQR":
          this.componentToRender = "BharatQr";
          this.isBharatQRTimerView = true;
          break;
        case "Upi":
          this.componentToRender = "upi";
          this.isUpiTimerView = true;
          break;
        case "UpiMandate":
          this.componentToRender = "upiMandate";
          this.isUpiMandateTimerView = true;
          break;
        case "UpiExecuteMandate":
          this.componentToRender = "upiExecuteMandate";
          this.isUpiExecuteMandateTimerView = true;
          break
        default:
          break;
      }
    }

    if (this.isUpiTimerView) {
      let token = params.token || "";
      this.props.setUpiTimerViewData(upiApiTimer, token);
    }
    if (this.isBharatQRTimerView) {
      let token = params.token || "";
      this.props.setBharatQRTimerViewData(token);
    }

    if (this.isUpiMandateTimerView) {
      let token = params.token || "";
      this.props.setUpiTimerViewData(upiApiTimer, token);
    }

    if (this.isUpiExecuteMandateTimerView) {
      let token = params.token || "";
      this.props.setUpiTimerViewData(upiApiTimer, token);
    }


  }
  render() {
    const { error, loading, merchant_payment_data } = this.props;

    // alert("merchant_payment_data" + JSON.stringify(merchant_payment_data));

    // if (!merchant_payment_data.payment_mode_data) {
    //   return <div></div>;
    //   // let loader = <Loader type="ball-clip-rotate-pulse" />;
    //   // return <div>{loader}</div>;
    // }
    if (this.isBharatQRTimerView) {
      return (
        <>
          <Header />
          <GloablLoader />
          <GlobalError />
          <SessionExpires />
          <BharatQRCodeView />

          <Footer />
        </>
      );
    }
    else if (this.isUpiTimerView) {
      return <UpiTimerView />
    }
    else if (this.isUpiMandateTimerView) {

      return <UpiMandateTimerView />
    }
    else if (this.isUpiExecuteMandateTimerView) {
      return <UpiExecuteMandateTimerView />
    }
    else if (!merchant_payment_data.payment_mode_data) {
      return <div></div>;
      // let loader = <Loader type="ball-clip-rotate-pulse" />;
      // return <div>{loader}</div>;
    }

    else

      return (
        <>
          <Header />
          <GloablLoader />
          <GlobalError />
          <SessionExpires />
          <Footer />
        </>
      );
  }

  componentDidMount() {
    //	this.props.fetchingMerchantPaymentData();

    let url = this.props.location.search;
    let params = queryString.parse(url);
    let token = params.token;
    if (!this.isUpiTimerView && !this.isBharatQRTimerView) {
      this.props.fetchMerchantPayMentDataFromAPI(token)
    }

    //alert("harsh");
    //this.props.dispatch(fetchMerchantPayMentDataFromAPI(token)).then(json => {
    //alert(JSON.stringify(json.data.data));
    //});

    // this.props.dispatch(() => {
    //   fetchMerchantPayMentDataFromAPI(token);
    // });
  }
}

// const mapDispatchToProps=dispatch=>{
// 	  return {
// 		fetchingMerchantPaymentData:()=>dispatch(DISPATCHER_ACTION_TYPE.FETCHING_MERCHANT_PAYMENT_DATA)

// 	  };

// };

const mapStateToProps = state => {
  return {
    merchant_payment_data:
      state.merchantPaymentDataFetchingReducer.merchantPaymentData,
    error: state.merchantPaymentDataFetchingReducer.error,
    loading: state.merchantPaymentDataFetchingReducer.loading
  };
};

export default connect(mapStateToProps, { fetchMerchantPayMentDataFromAPI, setUpiTimerViewData, setBharatQRTimerViewData })(withRouter(App));
