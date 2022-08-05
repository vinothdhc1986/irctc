import React from "react";
import { connect } from "react-redux";
import $ from 'jquery';
import CountDownTimer from 'react-component-countdown-timer';
import "../../../css/style.css";
import HeaderTopBar from "../../Header/HeaderTopBar"
import queryString from "query-string";
import HttpApiUtil from "../../../ApiUtils/HttpApiUtil";
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
import {
    getBharatQRCodeViewData
} from "../../../stores/actions/CommonAction";
import { FETCHING_MERCHANT_PAYMENT_DATA_SUCCESS } from "../../../stores/actions/MerchantPaymentDataFetchingActions";
const Response = {
    TRANSACTION_SUCCESS: 1000,
    INTERNAL_ERROR: 1001,
    TRANSACTION_FAILED: 1002,
    TRANSACTION_PENDING: 1003,
    SESSION_EXPIRED: 1004,
    REQUEST_EXPIRED: 1005
};
const contentStyle = {
    marginTop: '0px',
};
class BharatQRCodeView extends React.Component {
    constructor(props) {
        super(props)

        this.startTimeout = "";
        this.state = {
            GeneratedQRCodeImage: "",
            MerchantName: "",
            MerchantLocation: "",
            count: 0,
            UniqueMerchantTxnID: "",
            MerchantID: 0,
            Amount: 0,
            AmountInRupees: 0,
            PinePGTransactionID: 0,
            hideDay: true,
            hideHours: true,
            isQRCodeLoaded: false
        };
        this.bharatQRPayNowSuccessCb = this.bharatQRPayNowSuccessCb.bind(this);
        this.bharatQPayNowFailureCb = this.bharatQPayNowFailureCb.bind(this);
        this.ajaxCall = this.ajaxCall.bind(this);
        this.showMessage = this.showMessage.bind(this);

    };
    bharatQRPayNowSuccessCb(response) {
        if (response && response !== undefined && response != null) {
            let res = response.bqrViewModal
            let token = this.props.bharatQrCodeViewConfigs.token;
            this.props.FETCHING_MERCHANT_PAYMENT_DATA_SUCCESS(response.paymentRequest, token)
            this.setState({
                GeneratedQRCodeImage: res.GeneratedQRCodeImage,
                MerchantName: res.MerchantName,
                MerchantLocation: res.MerchantLocation,
                BQRTransactionTimeOut: res.BQRTransactionTimeOut,
                UniqueMerchantTxnID: res.UniqueMerchantTxnID,
                MerchantID: res.MerchantID,
                Amount: res.Amount,
                AmountInRupees: res.AmountInRupees,
                PinePGTransactionID: res.PinePGTxnID,
                isQRCodeLoaded: true

            });
            this.startTimeout = setInterval(() => {
                this.ajaxCall()
            }, 5000)
        }

    };
    bharatQPayNowFailureCb(response) {
        console.log(response);
    }
    //
    ajaxCallAfterTimerExpired = () => {
        clearInterval(this.startTimeout);
        var GetStatusBQRTransactionUrl = process.env.REACT_APP_PG_CONTROLLER + "BharatQR/GetStatusOfTransaction";

        $.ajax(
            {
                type: "POST",
                url: GetStatusBQRTransactionUrl,

                data: { token: this.props.bharatQrCodeViewConfigs.token, CallHost: 1 },
                dataType: 'JSON',

                success: function (data) {
                    if (data != null) {

                        if (data.ResponseCode == Response.TRANSACTION_SUCCESS) {


                            $("#message").text("Response received. Transaction successful.");
                            $("#message").addClass("green");
                            setTimeout(function () {
                                $("#BQRAuthForm").submit();
                            }, 1000);


                        }
                        else if (data.ResponseCode == Response.TRANSACTION_FAILED) {

                            $("#message").text("Response received. Transaction Failed.");
                            $("message").addClass("green");
                            setTimeout(function () {
                                $("#BQRAuthForm").submit();
                            }, 1000);


                        }
                        else if (data.ResponseCode == Response.SESSION_EXPIRED) {

                            alert("Session has been expired .Redirecting to merchant Url")
                            $("#BQRAuthForm").submit();

                        }


                        else if (data.ResponseCode == Response.INTERNAL_ERROR) {
                            if (window.opener && window.opener !== window) {
                                // you are in a popup
                                window.close();

                            }
                            else {
                                var url = $("#PinePGHandleErrorURL").val();
                                window.location.href = url;
                            }
                        }
                        else {
                            $("#BQRAuthForm").submit();
                        }


                    }
                },
                error: function (x, e) {

                    alert("The call to the server side failed. " + x.responseText);
                },
                failure: function (response) {

                    alert(response.d);
                }, async: false
            });

    }

    showMessage = () => {
        console.log(this.state.count);
    }

    ajaxCall = () => {
        var GetStatusBQRTransactionUrl = process.env.REACT_APP_PG_CONTROLLER + "BharatQR/GetStatusOfTransaction";
        $.ajax(
            {
                type: "POST",
                // url: "/PinePGRedirect/IsSavedCardDeleted",
                url: GetStatusBQRTransactionUrl,

                data: { token: this.props.bharatQrCodeViewConfigs.token, CallHost: 0 },
                dataType: 'JSON',

                success: function (data) {
                    if (data != null) {
                        if (data.ResponseCode == Response.TRANSACTION_SUCCESS) {


                            $("#message").text("Response received. Transaction successful.");
                            $("#message").addClass("green");
                            clearInterval(this.startTimeout);
                            setTimeout(function () {
                                $("#BQRAuthForm").submit();
                            }, 1000);


                        }
                        else if (data.ResponseCode == Response.TRANSACTION_FAILED) {

                            $("#message").text("Response received. Transaction Failed.");
                            $("#message").addClass("red");
                            clearInterval(this.startTimeout);
                            setTimeout(function () {
                                $("#BQRAuthForm").submit();
                            }, 1000);


                        }
                        else if (data.ResponseCode == Response.SESSION_EXPIRED) {

                            alert("Session has been expired .Redirecting to merchant Url")
                            $("#BQRAuthForm").submit();

                        }
                        else if (data.ResponseCode == Response.TRANSACTION_PENDING) {

                        }
                        else if (data.ResponseCode == Response.INTERNAL_ERROR) {
                            if (window.opener && window.opener !== window) {
                                // you are in a popup
                                window.close();

                            }
                            else {
                                var url = $("#PinePGHandleErrorURL").val();
                                window.location.href = url;
                            }

                        }
                        else if (data.ResponseCode == Response.REQUEST_EXPIRED) {

                            $("#message").text("Request Expired. Transaction Failed.");
                            $("#message").addClass("red");
                            clearInterval(this.startTimeout);
                            setTimeout(function () {
                                $("#BQRAuthForm").submit();
                            }, 1000);
                        }

                    }
                },
                error: function (x, e) {
                    alert("The call to the server side failed. " + x.responseText);
                },
                failure: function (response) {
                    alert(response.d);
                }, async: true
            });

    }


    componentDidMount() {
        let token = this.props.bharatQrCodeViewConfigs.token;


        //fetchMerchantPayMentDataFromAPI(token);
        this.props.getBharatQRCodeViewData(token, this.bharatQRPayNowSuccessCb, this.bharatQRayNowFailureCb)

        // this.props.dispatch(() => {
        //   fetchMerchantPayMentDataFromAPI(token);
        // });
    }



    render() {
        const minHeight = {
            minHeight: "355px"
        }

        if (this.state.isQRCodeLoaded) {
            let settings = {
                count: this.state.BQRTransactionTimeOut,
                hideDay: "true",
                hideHours: "true"
            }
            let bqrCodeImg = "data:image/jpeg;base64," + this.state.GeneratedQRCodeImage;
            return (
                <section class="content mb10">
                    <div class="container">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 white-block ">
                            <div class="row">
                                <div class="col-md-4 col-lg-3 left-sidepanel">
                                </div>
                                <div className="col-md-8 col-lg-9 right-sidepanel bQRCodeViewMinHeight" >
                                    <div id="accordion" className="accordion">
                                        <div className="card mb-0">
                                            <div id="collapsebharatqr" class="card-body text-center collapse active show" data-parent="#accordion">
                                                <form id="BQRAuthForm" method="post" action={process.env.REACT_APP_PG_CONTROLLER + "BharatQR/SubmitBQRTransaction"}>
                                                    <h2 class="mb-1">Scan QR code </h2>
                                                    <p >and complete your transaction</p>
                                                    <div class="col-12 wallets">
                                                        <div class="row">
                                                            <input type="hidden" name="PinePGTransactionID" id="PinePGTransactionID" value={this.state.PinePGTransactionID} />
                                                            <input type="hidden" id="token" name="token" value={this.props.bharatQrCodeViewConfigs.token} />
                                                            <div class=" col-lg-12 col-md-12 col-xs-12 col-8  mx-auto  mb-3">
                                                                <img src={bqrCodeImg} alt="QR code" class="max-width-100 text-center bharatQRImg" />
                                                            </div>
                                                            <div class=" col-12 mb-3">
                                                                <p class="text-green">Request expires in
                                                <b>
                                                                        <React.Fragment>
                                                                            <CountDownTimer {...settings} onEnd={this.ajaxCallAfterTimerExpired} />
                                                                        </React.Fragment>
                                                                    </b>
                                                                </p>
                                                            </div>
                                                        </div>


                                                        <div class="col-12 text-center bdr-top pt-3 pb-3">	<div class="row">
                                                            <div class="col-lg-6 col-lg-6 col-lg-6 col-12 text-center"><p class="m-0"><b>Merchant name:</b> {this.state.MerchantName} </p></div>
                                                            <div class="col-lg-6 col-lg-6 col-lg-6 col-12 text-center"><p class="m-0"><b>Location:</b> {this.state.MerchantLocation} </p></div>
                                                        </div>
                                                        </div>


                                                    </div>

                                                </form >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section >
            );
        }
        else {
            return (<section class="content mb10">
                <div class="container">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 white-block ">
                        <div class="row">
                            <div class="col-md-4 col-lg-3 left-sidepanel">
                            </div>
                            <div className="col-md-8 col-lg-9 right-sidepanel">
                                <div id="accordion" className="accordion">
                                    <div className="card mb-0">
                                        <div id="collapsebharatqr" class="card-body text-center collapse active show" data-parent="#accordion">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>);
        }

    }
}

const mapStateToProps = state => {
    return {
        merchant_payment_data:
            state.merchantPaymentDataFetchingReducer.merchantPaymentData,
        error: state.merchantPaymentDataFetchingReducer.error,
        loading: state.merchantPaymentDataFetchingReducer.loading,
        bharatQrCodeViewConfigs: state.fetchBharatQrCodeViewConfigDataReducer
    };
};
export default connect(mapStateToProps, { getBharatQRCodeViewData, FETCHING_MERCHANT_PAYMENT_DATA_SUCCESS })(withRouter(BharatQRCodeView));