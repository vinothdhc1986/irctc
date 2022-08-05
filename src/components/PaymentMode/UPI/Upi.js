import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import "../../../css/style.css";
import Axios from "axios";
import UpiNavOptions from "./UpiNavOptions";
import { INITIATE_UPI_URL } from "../../../Constants/ApiUrlsConstants";

import PayByUpi from "./UpiPaymentOptions/PayByUpi";
import PayByGpay from "./UpiPaymentOptions/PayByGpay";
import HttpApiUtil from "../../../ApiUtils/HttpApiUtil";
import {
    payUpiGPay
} from "../../../stores/actions/CommonAction";

import $ from "jquery"


import { setSelectUpiOption } from "../../../stores/actions/UpiPaymentModeAction";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    NavLink
} from "react-router-dom";

const ObjHttpApiUtil = new HttpApiUtil();
class Upi extends Component {
    state = {}

    constructor(props) {
        super(props);
        this.error = null;
        this.loading = null;
        this.mercantPaymentData = null;
        this.emiInfo = null;
        this.SelectedUpiThirdPartyAppId = null;
        this.onPayNowBtnClick = this.onPayNowBtnClick.bind(this);
        this.upiPayNowSuccessCb = this.upiPayNowSuccessCb.bind(this);
        this.upiPayNowFailureCb = this.upiPayNowFailureCb.bind(this);
    }


    onPayNowBtnClick = (selectedUPIOption, token) => {
        this.props.payUpiGPay(token, selectedUPIOption, this.upiPayNowSuccessCb, this.upiPayNowFailureCb);

    }


    componentDidMount() {
        //this.props.setSelectUpiOption(this.props.upiPaymentModeOptionOpted);
    }
    upiPayNowSuccessCb = (response) => {
        document.getElementById("UPIForm").submit();
        console.log(response);
    }
    upiPayNowFailureCb = (response) => {
        console.log(response);
    }


    render() {
        const {
            error,
            loading,
            merchant_payment_data,
            upiPaymentModeOptionOpted
        } = this.props;
        let upiPaymentModeConfig = null;
        merchant_payment_data.payment_mode_data.map(paymentModeConfigData => {
            if (paymentModeConfigData.payment_mode_id == 10) {
                return upiPaymentModeConfig = paymentModeConfigData.data
            }
        }
        )

        let renderPaymentOptionByUserChoise = (!this.props.upiPaymentModeOptionOpted.SelectedUpiThirdPartyUpiApp ?
            <PayByUpi upiSuccessCb={this.upiPayNowSuccessCb} upiFailureCb={this.upiPayNowFailureCb} /> :
            this.props.upiPaymentModeOptionOpted.SelectedUpiThirdPartyUpiApp == 3 ? <PayByGpay upiSuccessCb={this.upiPayNowSuccessCb} upiFailureCb={this.upiPayNowFailureCb} /> :
                <PayByUpi upiSuccessCb={this.upiPayNowSuccessCb} upiFailureCb={this.upiPayNowFailureCb} />);
        return (
            <>
                <div
                    id="collapseupi"
                    className="card-body collapse active show"
                    data-parent="#accordion"
                >
                    <h2>Select your UPI app</h2>
                    <div class="col-12 upibhim">
                        <form id="UPIForm" method="post" action={process.env.REACT_APP_PG_CONTROLLER + "pinepg/v2/submit/upi"}  >

                            <input type="hidden" value={this.props.merchant_payment_data.txn_data.pine_pg_txn_id} name="PinePGTransactionID" id="PinePGTransactionID" />
                            <input type="hidden" value={this.props.token} name="token" id="toekn" />
                            <UpiNavOptions upiOptionsConfigured={upiPaymentModeConfig.UPIPaymentOptions} />

                            {renderPaymentOptionByUserChoise}

                        </form>
                    </div>

                </div>

            </>
        );
    }
};

const mapStateToProps = state => {
    return {
        merchant_payment_data:
            state.merchantPaymentDataFetchingReducer.merchantPaymentData,
        token: state.merchantPaymentDataFetchingReducer.token,
        error: state.merchantPaymentDataFetchingReducer.error,
        loading: state.merchantPaymentDataFetchingReducer.loading,
        upiPaymentModeOptionOpted: state.selectedUpiThirdPartyAppOptionReducer
    };
};
export default connect(mapStateToProps, { setSelectUpiOption, payUpiGPay })(Upi);
