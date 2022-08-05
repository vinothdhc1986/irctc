import React from "react";
import "../../css/style.css";
import { connect } from "react-redux";
import Navigation from "../Navigation/Navigation";
import MerchantPaymentDataUtils from "../../utils/MerchantPaymentDataUtils";
import amex from "../../images/amex.png";
import mc from "../../images/mc.png";
import maestro from "../../images/maestro.png";
import rupay from "../../images/rupay.png";
import visa from "../../images/visa.png";
import mastercard from "../../images/mastercard.png";
import verifiedbyvisa from "../../images/verifiedbyvisa.png";
import safekey from "../../images/safekey.png";
import pci from "../../images/pci.png";
import $ from "jquery";




class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
        this.error = null;
        this.loading = null;
        this.merchant_payment_data = null;
        this.CCPopUp = this.CCPopUp.bind(this);
    }
    CCPopUp = (SEALURL, cId) => {
        window.open("" + SEALURL + "index.php?page=showCert&cId=" + cId + "", "win", 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=700,height=585');
        // self.name = "mainWin";
    }

    render() {
        return (
            <> <section class="footer-top">
                <div class="container">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
                        <div class="row">
                            <div class=" col-lg-6 col-md-6 col-sm-6 col-7 pull-left">
                                <div class="row">
                                    <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12 p0">Your payment details are secured via 128 Bit encryption by Verisign</div>
                                </div>
                                <div class="row">
                                    <div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12 p0 verisign-logo">
                                        <img src={amex} alt="amex" />
                                        <img src={mc} alt="mastercard" />
                                        <img src={maestro} alt="maestro" />
                                        <img src={rupay} alt="rupay" />
                                        <img src={visa} alt="visa" />
                                    </div>
                                </div>
                            </div>

                            <div class=" col-lg-6 col-md-6 col-sm-6 col-5 pci-logo pull-right text-right">
                                <img src={mastercard} />
                                <img src={verifiedbyvisa} />
                                <img src={safekey} />
                                <a onClick={() => this.CCPopUp("http://seal.controlcase.com/", 3174701917)}>
                                    <img src={pci} oncontextmenu='return false;' alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
                <footer class="footer">
                    <div class="container">
                        <div class="row">
                            <div class="copyright col-lg-12 col-md-12 col-sm-12 col-xs-12"> <a href="">Privacy Policy </a> | <a href=""> Terms of Use</a> |<br /> Copyright © 2019-2020 Pine Labs, All rights reserved. </div>
                        </div>
                    </div>
                </footer>
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
        paymentAmountUI: state.merchantPaymentDataFetchingReducer.paymentAmountUI
    };
};

export default connect(mapStateToProps)(Footer);
