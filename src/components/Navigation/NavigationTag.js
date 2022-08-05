import React from "react";
import * as PAYMENT_MODE_CONST from "../../Constants/PaymentModeConstants";
import { NavLink } from "react-router-dom";
import { map } from "jquery";
export default function NavigationTag(props) {
  return (() => {
    let paymentModeId = props.payment_mode_id;
    let onClickedPaymentMode = props.onClickedPaymentMode;
    let isPreOfferedPaymentMode = props.isPreOfferedPaymentMode;
    // let creditDebitText= isPreOfferedPaymentMode?<span>Credit &amp; Debit Cards</span>{" "}
    let creditDebitText = isPreOfferedPaymentMode ? "Pay to Pre-book" : "Credit Debit Cards";

    // let isCashbackOnFullPaymentShow = (props.payment_mode_id == PAYMENT_MODE_CONST.PAYMENT_MODE_EMI 
    //                                   && props.data != null  
    //                                   && props.data.emi_model_type == 1
    //                                   && props.data.emi_info != null

    //                                   )

    let isPaymentCashbackOnFullPaymentExist = props.isPaymentCashbackOnFullPaymentExist;
    let isSpecialOffersToBeShownForFullCashback = props.isSpecialOffersToBeShownForFullCashback;
    let isSpecialOffersToBeShownForEMI = props.isSpecialOffersToBeShownForEMIExceptFullCashback;

    let isCashbackonFullPaymentSelected = props.isCashbackOnFullPaymentModeSelected;



    const specialOfferSpan =
      (
        <span class="special-offer pull-right">
          <img src="images/special-offers.png" alt="special offer" />
        </span>
      )

    let specialOfferForCashbackOnFullPayment =
      (isSpecialOffersToBeShownForFullCashback)
        ?
        (
          specialOfferSpan
        )
        :
        (
          null
        );


    let specialOfferForEMI =
      (isSpecialOffersToBeShownForEMI)
        ?
        (
          specialOfferSpan
        )
        :
        (
          null
        );


    // default if only cashbackfull payment exist in emi
    if (paymentModeId == PAYMENT_MODE_CONST.PAYMENT_MODE_EMI &&
      props.isNonFullCashbackEMIExists == false && props.isActiveTab == 'active') {
      isCashbackonFullPaymentSelected = true;
    }

    const cashbackOnFullPayment =
      (isPaymentCashbackOnFullPaymentExist)
        ?
        (
          <>
            <li className={`${isCashbackonFullPaymentSelected ||
              props.isCashBackonFullPaymentDefaultSelected ? "active" : ""}`}>
              {" "}

              <NavLink
                to="/cashbackOnFullPayment"
                href="#collapsecashbackOnFullPayment"
                className="fullpayment-tab"
                activeClassName="active"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={props.onClickedCashbackOnFullPayment}
              >
                {/* <span>Cashback On Full Payment</span> */}
                <span>Cashback on <br />Full payment </span>

                {specialOfferForCashbackOnFullPayment}
              </NavLink>{" "}
            </li>
          </>

        )
        :
        (
          null
        )

    if (!paymentModeId) {
      return null;
    }
    switch (paymentModeId) {
      case PAYMENT_MODE_CONST.PAYMENT_MODE_EMI:

        return (
          <>
            {
              (props.isNonFullCashbackEMIExists == true) ?
                (<li className={`${(props.isActiveTab && isCashbackonFullPaymentSelected == false
                  && props.isCashBackonFullPaymentDefaultSelected == false) ? "active" : ""}`}>
                  {" "}
                  <NavLink
                    to="/emi"
                    href="#collapseemi"
                    className="emi-tab"
                    activeClassName="active"
                    role="tab"
                    aria-controls="nav-home"
                    aria-selected="true"
                    onClick={onClickedPaymentMode}
                  >
                    <span>EMI</span>
                    {specialOfferForEMI}
                    {/* <span class="special-offer pull-right">
                  <img src="images/special-offers.png" alt="special offer" />
                </span> */}
                  </NavLink>{" "}
                </li>)
                : null
            }

            { cashbackOnFullPayment}
          </>


        );

      case PAYMENT_MODE_CONST.PAYMENT_MODE_CREDIT_DEBIT_CARD:
        return (
          <li className={`${props.isActiveTab === "active" ? "active" : ""}`}>
            {" "}
            <NavLink
              to="/card"
              href="#collapsecreditdebit"
              className="cc-tab"
              activeClassName="active"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
              onClick={onClickedPaymentMode}
            >
              {/* <span>Credit &amp; Debit Cards</span>{" "} */}
              <span>{creditDebitText}</span>{" "}
            </NavLink>{" "}
          </li>
        );

      case PAYMENT_MODE_CONST.PAYMENT_MODE_UPI:
        return (
          <li className={`${props.isActiveTab ? "active" : ""}`}>
            {" "}
            <NavLink
              to="/upi"
              href="#collapseupi"
              className="upi-tab"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
              onClick={onClickedPaymentMode}
            >
              <span>UPI/BHIM</span>
            </NavLink>{" "}
          </li>
        );

      case PAYMENT_MODE_CONST.PAYMENT_MODE_WALLET:
        return (
          <>
            <li className={`${props.isActiveTab ? "active" : ""}`}>
              {" "}
              <NavLink
                to="/wallet"
                href="#collapsewallet"
                className="wallet-tab"
                activeClassName="active"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={onClickedPaymentMode}
              >
                <span>Wallets</span>
              </NavLink>{" "}
            </li>
          </>
        );

      case PAYMENT_MODE_CONST.PAYMENT_MODE_NETBANKING:
        return (
          <>
            <li className={`${props.isActiveTab ? "active" : ""}`}>
              {" "}
              <NavLink
                to="/netbanking"
                href="#collapsenetbanking"
                className="netbanking-tab  "
                activeClassName="active"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={onClickedPaymentMode}
              >
                <span>Net Banking</span>
              </NavLink>{" "}
            </li>
          </>
        );
      case PAYMENT_MODE_CONST.PAYMENT_MODE_NBFC_THIRD_PARTY_EMI:
        return (
          <>
            <li className={`${props.isActiveTab ? "active" : ""}`}>
              {" "}
              <NavLink
                to="/nbfc"
                href="#collapsenbfc"
                className="nbfc-tab"
                activeClassName="active"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={onClickedPaymentMode}
              >
                <span>NBFC</span>
              </NavLink>{" "}
            </li>
          </>
        );
      case PAYMENT_MODE_CONST.PAYMENT_MODE_BHARATQR:
        return (
          <>
            <li className={`${props.isActiveTab ? "active" : ""}`}>
              {" "}
              <NavLink
                to="/bharatqr"
                href="#collapsebharatqr"
                className="qr-tab"
                activeClassName="active"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={onClickedPaymentMode}
              >
                <span>Bharat QR</span>
              </NavLink>{" "}
            </li>
          </>
        );
      case PAYMENT_MODE_CONST.PAYMENT_MODE_UPI_MANDATE:
        return (
          <>
            <li className={`${props.isActiveTab ? "active" : ""}`}>
              {" "}
              <NavLink
                to="/upimandate"
                href="#collapseupimandate"
                className="qr-tab"
                activeClassName="active"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={onClickedPaymentMode}
              >
                <span>UPI Mandate</span>
              </NavLink>{" "}
            </li>
          </>
        );

      case PAYMENT_MODE_CONST.PAYMENT_MODE_BUY_NOW_PAY_LATER:
        return (
          <>
            <li className={`${props.isActiveTab ? "active" : ""}`}>
              {" "}
              <NavLink
                to="/buynowpaylater"
                href="#collapseflexipay"
                className="flexipay-tab"
                activeClassName="active"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={onClickedPaymentMode}



              >
                <span>Buy Now Pay Later</span>
              </NavLink>{" "}
            </li>
          </>
        );

      default:
        return null;
    }
  })();
}
