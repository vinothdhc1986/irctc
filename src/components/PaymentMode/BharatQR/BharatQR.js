import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import "../../../css/style.css";
import HttpApiUtil from "../../../ApiUtils/HttpApiUtil";
import bharatQRLogo from "../../../images/bqr-logo.jpg";
import { INITIATE_BHARATQR_URL } from "../../../Constants/ApiUrlsConstants";
import {
    renderBharatQRCodeView
} from "../../../stores/actions/CommonAction";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    NavLink
} from "react-router-dom";


const ObjHttpApiUtil = new HttpApiUtil();
class BharatQR extends Component {
    state = {}

    constructor(props) {
        super(props);
        this.error = null;
        this.loading = null;
        this.mercantPaymentData = null;
        this.emiInfo = null;
        this.SelectedUpiThirdPartyAppId = null;
        this.onPayNowBtnClick = this.onPayNowBtnClick.bind(this);
    }



    bharatQRPayNowSuccessCb(response) {
        console.log(response);
    }
    bharatQRPayNowFailureCb(response) {
        this.btn.removeAttribute("disabled");
        if (response.responseCode == -1 || response.responseCode == -136 || response.responseCode == -328) {
            document.getElementById("BharatQRForm").submit();
        }
    }


    onPayNowBtnClick(selectedUPIOption) {
        this.btn.setAttribute("disabled", "disabled");
        let token = this.props.token
        this.props.renderBharatQRCodeView(token, this.bharatQRPayNowSuccessCb, this.bharatQRPayNowFailureCb)
    };
    render() {
        const {
            error,
            loading,
            merchant_payment_data
        } = this.props;
        let upiPaymentModeConfig = merchant_payment_data.payment_mode_data.map(paymentModeConfigData => {
            if (paymentModeConfigData.payment_mode_id == 10) {
                return paymentModeConfigData.data
            }
        }
        )
        return (
            <>
                <div
                    id="collapsebharatqr"
                    className="card-body collapse active show"
                    data-parent="#accordion"
                >
                    <h2>Bharat QR</h2>
                    <div class="col-12 upibhim">
                        <form id="BharatQRForm" method="post" action={process.env.REACT_APP_PG_CONTROLLER + "BharatQR/ProcessBQRTransOnBQRGenerationFailure"} >
                            <div class="row">
                                <div class="col-lg-3 col-md-3 col-sm-3 col-6 mb-3">
                                    <div class="border-grey upi-app" id="thirdPartyAppId-2">
                                        <img src={bharatQRLogo} alt="bqr-logo" />
                                    </div>
                                    <input type="hidden" value={this.props.merchant_payment_data.txn_data.pine_pg_txn_id} name="PinePGTransactionID" id="PinePGTransactionID" />
                                    <input type="hidden" value={this.props.token} name="token" id="toekn" />
                                </div>
                            </div>
                            <div class="bdr-top upi-app-details" id="bhim-pay">
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-12  p-0 mt-3 mb-3 paynow-btn">
                                        <input type="button" class="btn  btn-green mr-3" onClick={this.onPayNowBtnClick} value="Pay now" ref={btn => { this.btn = btn; }} />
                                    </div>
                                </div>
                            </div>

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
        error: state.merchantPaymentDataFetchingReducer.error,
        loading: state.merchantPaymentDataFetchingReducer.loading,
        token: state.merchantPaymentDataFetchingReducer.token
    };
};
export default connect(mapStateToProps, { renderBharatQRCodeView })(BharatQR);