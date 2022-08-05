import React from "react";
import { connect } from "react-redux";
import $ from "jquery";
import "../../../css/style.css";
import HeaderTopBar from "../../Header/HeaderTopBar";
import Footer from "../../Footer/footer";
import CountDownTimer from 'react-component-countdown-timer';
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
const Response = {
    TRANSACTION_SUCCESS: 1,
    INTERNAL_ERROR: 1001,
    TRANSACTION_FAILED: 1002,
    TRANSACTION_PENDING: 1003,
    SESSION_EXPIRED: 1004,
    REQUEST_EXPIRED: 1005
};

const contentStyle = {
    marginTop: '0px',
};
class UpiExecuteMandateTimerView extends React.Component {
    constructor(props) {
        super(props)
        this.state = { apitimeout: "", PinePGTransactionID: "" };
        let obj = {
            apitimeout: "",
            PinePGTransactionID: ""
        };
        this.state = obj;
        this.startTimeout = setInterval(() => {
            this.ajaxCall()
        }, 10000)
        this.ajaxCall = this.ajaxCall.bind(this);
        this.ajaxCallAfterTimerExpired = this.ajaxCallAfterTimerExpired.bind(this);
        this.token = encodeURIComponent(this.props.upiTimerViewConfigs.token)
    };


    ajaxCall = () => {


        $.ajax(
            {
                type: 'GET',
                // url: "/PinePGRedirect/IsSavedCardDeleted",
                url: process.env.REACT_APP_PG_CONTROLLER + "api/v1/mandate/upi/GetStatusOfUPIExecuteMandateTransaction?token=" +
                    encodeURIComponent(this.props.upiTimerViewConfigs.token) + "&CallHost=0",

                // data: { token: this.props.upiTimerViewConfigs.token, CallHost: 0 },
                dataType: 'JSON',

                contentType: "application/x-www-form-urlencoded",

                success: function (data) {
                    if (data != null) {
                        if (data.response_code == Response.TRANSACTION_SUCCESS) {


                            $('#message').text('Response received. Transaction successful.');
                            $('#message').addClass('green');
                            clearInterval(this.startTimeout);
                            setTimeout(function () {
                                $('#UPIAuthForm').submit();
                            }, 1000);


                        }
                        else if (data.response_code == Response.TRANSACTION_FAILED) {

                            $('#message').text('Response received. Transaction Failed.');
                            $('#message').addClass('red');
                            clearInterval(this.startTimeout);
                            setTimeout(function () {
                                $('#UPIAuthForm').submit();
                            }, 1000);


                        }
                        else if (data.response_code == Response.SESSION_EXPIRED) {

                            alert('Session has been expired .Redirecting to merchant Url')
                            $('#UPIAuthForm').submit();

                        }
                        else if (data.response_code == Response.TRANSACTION_PENDING) {

                        }
                        else if (data.response_code == Response.INTERNAL_ERROR) {

                            if (window.opener && window.opener !== window) {
                                // you are in a popup
                                window.close();

                            }
                            else {
                                var url = process.env.REACT_APP_PG_CONTROLLER + "Home/Error";
                                window.location.href = url;
                            }
                        }
                        else if (data.response_code == Response.REQUEST_EXPIRED) {

                            $('#message').text('Request Expired. Transaction Failed.');
                            $('#message').addClass('red');
                            clearInterval(this.startTimeout);
                            setTimeout(function () {
                                $('#UPIAuthForm').submit();
                            }, 1000);
                        }

                    }
                },
                error: function (x, e) {
                    // alert('The call to the server side failed.' + x.responseText);
                },
                failure: function (response) {
                    //   alert(response.d);
                }, async: true
            });

    }


    ajaxCallAfterTimerExpired = () => {
        clearInterval(this.startTimeout);

        $.ajax(
            {
                type: 'GET',
                // url: "/PinePGRedirect/IsSavedCardDeleted",
                url: process.env.REACT_APP_PG_CONTROLLER + "api/v1/mandate/upi/GetStatusOfUPIExecuteMandateTransaction?token=" +
                    encodeURIComponent(this.props.upiTimerViewConfigs.token) + "&CallHost=1",
                dataType: 'JSON',
                contentType: "application/x-www-form-urlencoded",


                success: function (data) {
                    alert(data)
                    if (data != null) {
                        if (data.response_code == Response.TRANSACTION_SUCCESS) {


                            $('#message').text('Response received. Transaction successful.');
                            $('#message').addClass('green');
                            setTimeout(function () {
                                $('#UPIAuthForm').submit();
                            }, 1000);


                        }
                        else if (data.response_code == Response.TRANSACTION_FAILED) {

                            $('#message').text('Response received. Transaction Failed.');
                            $('message').addClass('green');
                            setTimeout(function () {
                                $('#UPIAuthForm').submit();
                            }, 1000);


                        }
                        else if (data.response_code == Response.SESSION_EXPIRED) {

                            alert('Session has been expired .Redirecting to merchant Url')
                            $('#UPIAuthForm').submit();

                        }


                        else if (data.response_code == Response.INTERNAL_ERROR) {
                            if (window.opener && window.opener !== window) {
                                // you are in a popup
                                window.close();

                            }
                            else {
                                var url = process.env.REACT_APP_PG_CONTROLLER + "Home/Error";
                                window.location.href = url;
                            }
                        }
                        else {
                            $('#UPIAuthForm').submit();
                        }


                    }
                },
                error: function (x, e) {

                    // alert('The call to the server side failed. ' + x.responseText);
                },
                failure: function (response) {

                    //  alert(response.d);
                }, async: true
            });

    }

    hello = () => {
        console.log("hello from expire method")
    }


    render() {
        // this.setState({
        //     apitimeout: this.props.upiTimerViewConfigs.apiTime,
        //     PinePGTransactionID: 337083//this.props.upiTimerViewConfigs.PinePGTransactionID
        // })
        let settings = {
            count: this.props.upiTimerViewConfigs.apiTime,
            hideDay: "true",
            hideHours: "true"
        }
        return (
            <>
                <HeaderTopBar />

                <form id="UPIAuthForm" method="POST" action={process.env.REACT_APP_PG_CONTROLLER + "UPI/SubmitUpiExecuteMandateTransaction"}  >
                    <section class="content mb10" style={contentStyle}>
                        <div class="container">
                            <div class="col-12 white-block">
                                <div class="proceesing-request text-center">
                                    <div class="circle-loader-bg">
                                        <div class="circle-loader">
                                            <div class="checkmark draw"></div>
                                        </div>
                                        <div class="timer">
                                            <React.Fragment>
                                                <CountDownTimer {...settings} onEnd={this.ajaxCallAfterTimerExpired} />
                                                {/* <CountDownTimer {...settings} onEnd={this.hello} /> */}
                                            </React.Fragment>
                                        </div>

                                    </div>
                                    <div>
                                        <span id="message" ></span>
                                    </div>
                                    <h1>Please wait, we are processing your request.</h1>
                                    <div class="bdr-top transaction-successful">Processing execute mandate request.Please click on the notification received on your<br /> UPI based Bank App & enter your bank MPIN.</div>
                                </div>
                            </div>
                            <input class="form-control" type="hidden" value={this.state.apitimeout}
                                id="apitimeout" />
                            <input class="form-control" type="hidden" name="token" value={this.props.upiTimerViewConfigs.token}
                                id="PinePGTransactionID" />
                        </div>
                    </section>

                </form >
                <Footer />
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
        upiTimerViewConfigs: state.fetchUpiTimerViewConfigsReducer
    };
};
export default connect(mapStateToProps, null)(UpiExecuteMandateTimerView);