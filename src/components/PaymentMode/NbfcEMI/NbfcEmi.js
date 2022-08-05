import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import "../../../css/style.css";
import Axios from "axios";
import NbfcNavOptions from "./NbfcNavOptions";
import { INITIATE_UPI_URL } from "../../../Constants/ApiUrlsConstants";

import PayByBfl from "./NbfcPaymentOptions/PayByBfl";
import SubmitOtp from "./SubmitOtp";
import PayByZestMoney from "./NbfcPaymentOptions/PayByZestMoney";
import EmiTenuresView from "./NbfcPaymentOptions/ZestMoney/EmiTenuresView";
import HttpApiUtil from "../../../ApiUtils/HttpApiUtil";

import $ from "jquery"


import { setSelectNbfcOption, setNbfcTransactionState, setNbfcTransactionStateOtpSubmitted, setNbfcTransactionError } from "../../../stores/actions/NbfcPaymentModeAction";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    NavLink
} from "react-router-dom";

const ObjHttpApiUtil = new HttpApiUtil();
class NbfcEmi extends Component {
    state = {}

    constructor(props) {
        super(props);
        let obj = {
            nbfcTransError: ''
        };
        this.state = obj;
        this.error = null;
        this.loading = null;
        this.mercantPaymentData = null;
        this.emiInfo = null;
        this.SelectedUpiThirdPartyAppId = null;
        this.nbfcEmiTxnSuccessCb = this.nbfcEmiTxnSuccessCb.bind(this);
        this.nbfcEmiTxnFailureCb = this.nbfcEmiTxnFailureCb.bind(this);
    }


    componentDidMount() {
        // this.props.setSelectNbfcOption(this.props.nbfcPaymentModeEmiVendorOptedData);
    }
    nbfcEmiTxnSuccessCb(response) {
        if (response.response_code == 1
            && (this.props.nbfcPaymentModeEmiVendorOptedData.NbfcEmiVendor === 'BFL'
                || (this.props.nbfcPaymentModeEmiVendorOptedData.NbfcEmiVendor === 'ZEST_MONEY'
                    && this.props.nbfcPaymentModeEmiVendorOptedData.TransactionState === 'OTP_SUBMITTED'))) {
            document.getElementById("BFLForm").submit();
        }
        else if (response.response_code == 1
            && this.props.nbfcPaymentModeEmiVendorOptedData.NbfcEmiVendor === 'ZEST_MONEY'
            && this.props.nbfcPaymentModeEmiVendorOptedData.TransactionState === 'OTP_GENERATED') {
            this.props.setNbfcTransactionStateOtpSubmitted("OTP_SUBMITTED", response.api_url, response.validate_otp_response);
        }
        else if (response.response_code == 1
            && this.props.nbfcPaymentModeEmiVendorOptedData.NbfcEmiVendor === 'ZEST_MONEY'
            && this.props.nbfcPaymentModeEmiVendorOptedData.TransactionState === 'OTP_SUBMITTED') {
            document.getElementById("BFLForm").submit();

        }
        console.log(response);
    }
    nbfcEmiTxnFailureCb(response) {

        if (response.response_code == -136) {
            alert("Session has been expired .Redirecting to merchant Url");
            document.getElementById("BFLForm").submit();

        }
        else if (response.response_code == -199) {
            alert("Either purchase transaction response time out or response could not validated. Need to enquiry the transaction. Redirecting to merchant Url");
            document.getElementById("BFLForm").submit();

        }
        else {
            this.showResponseMessageFromBfl(response.response_code);
        }
    }

    showResponseMessageFromBfl = (PinePGResponseCode) => {
        let nbfcTransErrorToShow = '';
        if (PinePGResponseCode === "-184") {
            nbfcTransErrorToShow = "Multiple Customer id exists.Please enter card number"
        }
        else if (PinePGResponseCode === "-171") {
            nbfcTransErrorToShow = "Card does not exists"
        }
        else if (PinePGResponseCode === "-185") {
            nbfcTransErrorToShow = "Transaction is not allowed for next 24 hours,Due to 5 times wrong OTP"
        }
        else if (PinePGResponseCode === "-180" || PinePGResponseCode === "-172" || PinePGResponseCode === "-188" ||
            PinePGResponseCode === "-189" || PinePGResponseCode === "-174" || PinePGResponseCode === "-194" || PinePGResponseCode === "-195"
        ) {
            nbfcTransErrorToShow = "Error Occurred"
        }
        else if (PinePGResponseCode === "-178") {
            nbfcTransErrorToShow = "Card blocked.Contact customer service"
        }
        else if (PinePGResponseCode === "-179") {
            nbfcTransErrorToShow = "ECS not present";
        }

        else if (PinePGResponseCode == "-177") {
            nbfcTransErrorToShow = "Available limit is less than emi amount";
        }
        else if (PinePGResponseCode == "-176") {
            nbfcTransErrorToShow = "Limit amount exceeded";
        }
        else if (PinePGResponseCode === "-186") {
            nbfcTransErrorToShow = "OTP number do not match";
        }
        else if (PinePGResponseCode === "-187") {
            nbfcTransErrorToShow = "Scheme not found";
        }
        else if (PinePGResponseCode === "-190") {
            nbfcTransErrorToShow = "Card is expired";
        }
        else if (PinePGResponseCode === "-173" || PinePGResponseCode === "-204") {
            nbfcTransErrorToShow = "Inactive card. Please contact bfl.";
        }
        else if (PinePGResponseCode === "-201" || PinePGResponseCode === "-202") {
            nbfcTransErrorToShow = "This card will be blocked after 2 more attempts.";
        }
        else if (PinePGResponseCode === "-181") {
            nbfcTransErrorToShow = "Insufficient Balance.";
        }
        else if (PinePGResponseCode === "-206") {
            nbfcTransErrorToShow = "Card is blocked.";
        }
        else if (PinePGResponseCode === "-207" || PinePGResponseCode === "-208") {
            nbfcTransErrorToShow = "Transaction declined.Please contact BFL.";
        }
        else if (PinePGResponseCode === "-209" || PinePGResponseCode === "-210") {
            nbfcTransErrorToShow = "Transaction declined.Please try after some time.";
        }
        else if (PinePGResponseCode === "-82") {
            nbfcTransErrorToShow = "Invalid card number.EMI not applicable on this card.";
        }
        else {
            nbfcTransErrorToShow = "Error Occurred";
        }
        this.props.setNbfcTransactionError(nbfcTransErrorToShow);
        // this.setState({
        //     nbfcTransError: nbfcTransErrorToShow
        // })

    }


    render() {
        const {
            error,
            loading,
            merchant_payment_data,
            upiPaymentModeOptionOpted
        } = this.props;
        let nbfcEmiTxnStepWiseViewToRender = <div>hello</div>;

        if (this.props.nbfcPaymentModeEmiVendorOptedData.TransactionState === 'OTP_SUBMITTED') {
            nbfcEmiTxnStepWiseViewToRender = <EmiTenuresView onSubmitLoanApprovalSuccessCb={this.props.nbfcEmiTxnSuccessCb} onSubmitLoanApprovalFailureCb={this.props.nbfcEmiTxnFailureCb} />
        }
        else {
            let bflInitTransactionData = { bflSchemes: null, bflAllowedBins: null };
            let nbfcPaymentModeConfig = null;
            merchant_payment_data.payment_mode_data.map(paymentModeConfigData => {
                if (paymentModeConfigData.payment_mode_id == 7) {
                    return nbfcPaymentModeConfig = paymentModeConfigData.data
                }
            }
            )
            if (nbfcPaymentModeConfig && nbfcPaymentModeConfig != null) {
                nbfcPaymentModeConfig.emi_vendors.map(emiVendor => {
                    if (emiVendor.vendor_name === 'BFL') {
                        bflInitTransactionData.bflSchemes = emiVendor.NbfcEmiVendorSchemeData.schemes || [];
                        bflInitTransactionData.bflAllowedBins = emiVendor.NbfcEmiVendorSchemeData.bflAllowedBins || [];
                        return bflInitTransactionData;
                    }
                })
            }
            if (this.props.nbfcPaymentModeEmiVendorOptedData.TransactionState === 'TXN_INITIATE') {

                const renderPaymentOptionByUserChoise = !this.props.nbfcPaymentModeEmiVendorOptedData.NbfcEmiVendor
                    || (this.props.nbfcPaymentModeEmiVendorOptedData.NbfcEmiVendor != null && this.props.nbfcPaymentModeEmiVendorOptedData.NbfcEmiVendor === 'BFL') ?
                    <PayByBfl nbfcEmiTxnFailureCb={this.nbfcEmiTxnFailureCb} emiSchemes={bflInitTransactionData.bflSchemes} emiAllowedBins={bflInitTransactionData.bflAllowedBins} nbfcTransError={this.state.nbfcTransError} /> :
                    <PayByZestMoney postGenerateOTPFn={this.onGenerateOTPBtnClick} />;

                nbfcEmiTxnStepWiseViewToRender = (
                    <div>
                        <NbfcNavOptions nbfcOptionsConfigured={nbfcPaymentModeConfig.emi_vendors} />

                        {renderPaymentOptionByUserChoise}
                    </div>
                );
            }
            else if (this.props.nbfcPaymentModeEmiVendorOptedData.TransactionState === 'OTP_GENERATED') {
                nbfcEmiTxnStepWiseViewToRender = (
                    <div>
                        <NbfcNavOptions nbfcOptionsConfigured={nbfcPaymentModeConfig.emi_vendors} />

                        <SubmitOtp onSubmitOtpSuccessCb={this.nbfcEmiTxnSuccessCb} onSubmitOtpFailureCb={this.nbfcEmiTxnFailureCb} nbfcTransError={this.state.nbfcTransError} />
                    </div>
                );
            }
        }
        return (
            <>
                <div
                    id="collapsenbfc"
                    className="card-body collapse active show"
                    data-parent="#accordion"
                >
                    <h2>Select NBFC</h2>
                    <div class="col-12 upibhim">
                        <form id="BFLForm" method="post" action={process.env.REACT_APP_PG_CONTROLLER + "pinepg/v2/submit/nbfcemi"}   >

                            <input type="hidden" value={this.props.merchant_payment_data.txn_data.pine_pg_txn_id} id="PinePGTransactionID" name="PinePGTransactionID" />
                            <input type="hidden" value={this.props.token} id="token" name="token" />

                            {nbfcEmiTxnStepWiseViewToRender}

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
        nbfcPaymentModeEmiVendorOptedData: state.selectedNbfcPaymentOptionReducer
    };
};
export default connect(mapStateToProps, { setSelectNbfcOption, setNbfcTransactionState, setNbfcTransactionStateOtpSubmitted, setNbfcTransactionError })(NbfcEmi);
