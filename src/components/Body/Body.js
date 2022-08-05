import React from "react";
import { connect } from "react-redux";
import "../../css/style.css";
// import * as PAYMENT_MODE_CONST from "../../Constants/PaymentModeConstants";
import {
  PAYMENT_MODES_SEQUENCE_PRIORITIES,
  PAYMENT_MODES_BY_KEY_VALUE_PAIR,
  PAYMENT_MODE_CREDIT_DEBIT_CARD,
  PAYMENT_MODE_EMI,
  PAYMENT_MODE_UPI,
  PAYMENT_MODE_NBFC_THIRD_PARTY_EMI,
  PAYMENT_MODE_NETBANKING,
  PAYMENT_MODE_BHARATQR,
  PAYMENT_MODE_WALLET,
  PAYMENT_MODE_UPI_MANDATE,
  PAYMENT_MODE_BUY_NOW_PAY_LATER
} from "../../Constants/PaymentModeConstants";
import Wallet from "../PaymentMode/Wallet/Wallet";
import BuyNowPayLater from "../PaymentMode/BuyNowPayLater/BuyNowPayLater";
import Netbanking from "../PaymentMode/NetBanking/Netbanking";
import { EMI, Cards } from "../PaymentMode/EMI";
import { Card } from "../../components/PaymentMode/Card";
import { Upi } from "../../components/PaymentMode/UPI";
import { NbfcEmi } from "../../components/PaymentMode/NbfcEMI";
import BharatQR from "../../components/PaymentMode/BharatQR/BharatQR";
import { UpiMandate } from "../../components/PaymentMode/UPIMandate"
import { CashbackOnFullPayment } from "../PaymentMode/CashbackOnFullPayment";
import * as PAYMENT_MODE_CONST from "../../Constants/PaymentModeConstants";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  useRouteMatch,
  NavLink,
  useHistory
} from "react-router-dom";

import { withRouter } from "react-router";
import { SetEMITypeID } from "../../..../../stores/actions/EmiDataProcessingAction";
import {
  SetPaymentAmount,
  SetPaymentModeID
} from "../../..../../stores/actions/PaymentModeAction";
import MerchantPaymentDataUtils from "../../utils/MerchantPaymentDataUtils";
import PaymentAmountUIFetchUtil from "../../utils/PaymentAmountUIFetchUtil";
import Navigation from "../Navigation/Navigation";
import * as ISSUER_CONST from "../../Constants/IssuersConstants";

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
    this.objPaymentAmountUIUtil = new PaymentAmountUIFetchUtil();
    this.byDefaultComponent = { key: 0, value: "/" };

    this.paymentModesInReq = [];

    this.state = {
      active: "emi"
    };
  }
  chooseOtherEMI = () => {
    this.props.dispatch(SetEMITypeID(null));
  };

  setPaymentModeId = paymentModeId => {
    this.props.dispatch(SetPaymentModeID(paymentModeId));
  };

  componentDidMount() {
    let paymentModeID = this.objMerchantPaymentDataUtils.GetDefaultSelectedPaymentModeID(
      this.props.merchant_payment_data
    );



    let EMISelectedPlan = paymentModeID == 4 ? this.objMerchantPaymentDataUtils.GetEMISelectedData(
      this.props.merchant_payment_data
    ) : null;






    if (paymentModeID <= 0) {
      return;
    }
    this.setPaymentModeId(paymentModeID);
    switch (paymentModeID) {
      case 4:
        let isEMIContainsOnlyFullCashback = this.objMerchantPaymentDataUtils.ReturnIfEMIContainsOnlyFullCashback(
          this.props.merchant_payment_data
        );
        if (isEMIContainsOnlyFullCashback)
          this.props.history.push("/cashbackOnFullPayment");
        else
          this.props.history.push("/emi");
        break;
      case 1:
        this.props.history.push("/card");
        break;
    }

    const { error, loading, merchant_payment_data } = this.props;
    if (!merchant_payment_data.payment_mode_data) {
      return null;
    }
    this.paymentModesInReq = merchant_payment_data.payment_mode_data.map(obj => {
      return obj.payment_mode_id;
    });
    if (
      this.paymentModesInReq &&
      this.paymentModesInReq != null &&
      this.paymentModesInReq.length > 0
    ) {
      PAYMENT_MODES_SEQUENCE_PRIORITIES.some(pm => {
        if (this.paymentModesInReq.indexOf(pm) > -1) {
          PAYMENT_MODES_BY_KEY_VALUE_PAIR.map(keyVal => {
            if (keyVal.key === pm) {
              this.byDefaultComponent = {
                key: keyVal.key,
                value: keyVal.value
              };
            }
          });

          return this.byDefaultComponent;
        }
      });
    }
    if (
      EMISelectedPlan != null && EMISelectedPlan.emi_info.length > 0) {



      let emiSelectedTypeId =
        this.objMerchantPaymentDataUtils.GetDefaultSelectedEMITypeId(
          EMISelectedPlan.emi_info
        );
      let issuerIdSelected = EMISelectedPlan.emi_info[0].emi_category_data[0].issuers[0].issuer_id;

      let tenureIdSelected = EMISelectedPlan.emi_info[0].emi_category_data[0].issuers[0].tenures[0].tenure_id;

      let cardTypeIdSelected = EMISelectedPlan.emi_info[0].emi_category_data[0].card_category;

      let tenuredata = this.objMerchantPaymentDataUtils.GetTenureDataForTenureId(
        this.props.merchant_payment_data,
        emiSelectedTypeId,
        cardTypeIdSelected,
        issuerIdSelected,
        tenureIdSelected
      );



      if (tenureIdSelected == "96") {
        this.props.history.push("/cashbackOnFullPayment");
        //this.onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_EMI, "/cashbackOnFullPayment")
      }

    }







  }




  toggle = paymentMethod => {
    if (this.state.active === paymentMethod) {
      this.setState({ active: null });
    } else {
      this.setState({ active: paymentMethod });
    }
  };

  setAmountGloballyAndPaymentModeID = (amount, paymentModeId) => {
    this.props.dispatch(SetPaymentModeID(paymentModeId));
    this.props.dispatch(SetPaymentAmount(amount));
  };

  onClickPaymentModeNavSetAmountAccToPaymentMode = (paymentModeId, paymentModeName) => {


    this.setPaymentModeId(paymentModeId);
    this.toggle(paymentModeName);

  };

  render() {



    let selected_emi_data = this.props.selected_emi_data;
    let isEMIDataSelected = <EMI />;
    let isCashbackOnFullPaymentSelected = <CashbackOnFullPayment />;
    let cardComponent = <Card />
    let cardInfoData = this.objMerchantPaymentDataUtils.GetPaymentModeDataForPaymentModeId(
      this.props.merchant_payment_data,
      1
    );



    let isLoungeTxn = false;
    let preFilledCardNumber = null;
    if (!(cardInfoData == null || cardInfoData[0] == null)) {
      isLoungeTxn = cardInfoData[0].data.isLoungeTxn;
      preFilledCardNumber = cardInfoData[0].data.cardNumber;
      if (isLoungeTxn == true) {
        cardComponent = <Card is_lounge_txn={isLoungeTxn} pre_filled_card_no={preFilledCardNumber} />

      }
    }



    if (
      selected_emi_data &&
      selected_emi_data.paymentMode == 4 &&
      selected_emi_data.emiType &&
      selected_emi_data.cardType &&
      selected_emi_data.issuerId &&
      selected_emi_data.tenureId &&
      selected_emi_data.isSelected &&
      !selected_emi_data.isSaveCardEMIPage
    ) {

      if (
        (selected_emi_data.emiType == 4
          //&& selected_emi_data.issuerId == ISSUER_CONST.HDFC_DEBIT_EMI_ISSUER 
          && selected_emi_data.tenureId == 96)
      ) {
        isCashbackOnFullPaymentSelected = <Card is_emi_card_page={true} />;
      }
      else
        if (
          selected_emi_data.emiType != 4
          && selected_emi_data.tenureId != 96
          && (selected_emi_data.issuerId != ISSUER_CONST.HDFC_DEBIT_EMI_ISSUER)
          && (selected_emi_data.issuerId != ISSUER_CONST.KOTAK_DEBIT_EMI_ISSUER)
          && (selected_emi_data.issuerId != ISSUER_CONST.FEDERAL_DEBIT_EMI_ISSUER)
        ) {
          isEMIDataSelected = <Card is_emi_card_page={true} />;
        }

    }

    let isPaymentCashbackOnFullPaymentExist = false;
    let isWithoutPaymentCashbackOnFullPaymentExist = false;
    let isSpecialOffersToBeShownForFullCashback = false;
    let isSpecialOffersToBeShownForEMIExceptFullCashback = false;
   
    

    this.props.merchant_payment_data.payment_mode_data.map(obj => {
      if (
        obj.payment_mode_id == PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
        && obj.data != null
        //&& obj.data.emi_model_type == 1
        && obj.data.emi_info != null
      ) {
        obj.data.emi_info.map((criteria) => {
          if (criteria.emi_category_data != null) {
            criteria.emi_category_data.map((emiCatData) => {
              if (emiCatData.issuers != null) {
                emiCatData.issuers.map((issuerobj) => {
                  if (issuerobj.tenures != null) {
                    issuerobj.tenures.map((tenureobj) => {
                      if (criteria.emi_category == 4 && tenureobj.tenure_id == 96) {
                        isPaymentCashbackOnFullPaymentExist = true;

                        isSpecialOffersToBeShownForFullCashback = (isSpecialOffersToBeShownForFullCashback) || this.objMerchantPaymentDataUtils.IsTenureContainsSpecialOffer(tenureobj);

                      }
                      else if (criteria.emi_category != 4) {
                        isWithoutPaymentCashbackOnFullPaymentExist = true;

                        isSpecialOffersToBeShownForEMIExceptFullCashback = (isSpecialOffersToBeShownForEMIExceptFullCashback) || (this.objMerchantPaymentDataUtils.IsTenureContainsSpecialOffer(tenureobj));
                      }

                    });
                  }
                });
              }

            });
          }
          //isPaymentCashbackOnFullPaymentExist = true;
          //return;
          //return true;
        });
      }
    });

    return (

      < div className="col-md-8 col-lg-9 right-sidepanel" >
        <div id="accordion" className="accordion">
          <div className="card mb-0">

            {
              (this.paymentModesInReq.includes(PAYMENT_MODE_EMI)) && (isWithoutPaymentCashbackOnFullPaymentExist == true) ? (
                <div
                  className={
                    this.state.active === "/emi"
                      ? "card-header active"
                      : "card-header collapsed"
                  }
                  data-parent="#accordion"

                >
                  <NavLink
                    className="card-title emi-tab-mobile"
                    to="/emi"
                    // onClick={() => this.toggle("/emi")}
                    // activeClassName="active"
                    onClick={() => this.onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_EMI, "/emi")}
                  >
                    {" "}
                    <span>EMI</span>

                    <span class="special-offer pull-right">
                      {(isSpecialOffersToBeShownForEMIExceptFullCashback) ? (<img src="images/special-offers.png" alt="special offer" />) : (null)}
                      <i className={
                        this.state.active === "/emi"
                          ? "fa fa-angle-up pull-right"
                          : "fa fa-angle-down pull-right"
                      }></i>{" "}
                    </span>

                  </NavLink>

                </div>
              ) : (
                  ""
                )}
            {
              (isPaymentCashbackOnFullPaymentExist == true) ? (
                <div
                  className={
                    this.state.active === "/cashbackOnFullPayment" 
                      ? "card-header active"
                      : "card-header collapsed"
                  }
                  data-parent="#accordion"

                >
                  <NavLink
                    className="card-title fullpayment-tab-mobile"
                    to="/cashbackOnFullPayment"
                    // onClick={() => this.toggle("/emi")}
                    // activeClassName="active"
                    onClick={() => this.onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_EMI, "/cashbackOnFullPayment")}
                  >
                    {" "}

                    <span class="col-md-6" >Cashback on <br />Full payment </span>

                    <span class="col-md-6 text-right special-offer">
                      {(isSpecialOffersToBeShownForFullCashback) ? (<img src="images/special-offers.png" alt="special offer" />) : (null)}
                      <i className={
                        this.state.active === "/cashbackOnFullPayment"
                          ? "fa fa-angle-up pull-right"
                          : "fa fa-angle-down pull-right"
                      }></i>{" "}
                    </span>

                  </NavLink>

                </div>
              ) : (
                  ""
                )}
            {this.paymentModesInReq.includes(PAYMENT_MODE_CREDIT_DEBIT_CARD) ? (
              <div
                className={
                  this.state.active === "/card"
                    ? "card-header active"
                    : "card-header collapsed"
                }
                data-parent="#accordion"
                href="#collapsecreditdebit"
              >
                <NavLink
                  className="card-title cc-tab-mobile"
                  to="/card"
                  // onClick={() => this.toggle("/card")}
                  // activeClassName="active"
                  onClick={() => this.
                    onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_CREDIT_DEBIT_CARD, "/card")}
                >
                  {" "}
                  <span>Credit &amp; Debit Cards</span>
                  {/* <i className="fa fa-angle-down pull-right"></i> */}
                  <i className={
                    this.state.active === "/card"
                      ? "fa fa-angle-up pull-right"
                      : "fa fa-angle-down pull-right"
                  }></i>
                </NavLink>
              </div>
            ) : (
                ""
              )}
            {this.paymentModesInReq.includes(PAYMENT_MODE_NETBANKING) ? (
              <div
                className={
                  this.state.active === "/netbanking"
                    ? "card-header active"
                    : "card-header collapsed"
                }
                data-parent="#accordion"
                href="#collapsenetbanking"
              >
                <NavLink
                  className="card-title netbanking-tab-mobile"
                  to="/netbanking"
                  //onClick={() => this.toggle("/netbanking")}
                  onClick={() => this.onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_NETBANKING, "/netbanking")}
                >
                  {" "}
                  <span>Net Banking</span>
                  <i className={
                    this.state.active === "/netbanking"
                      ? "fa fa-angle-up pull-right"
                      : "fa fa-angle-down pull-right"
                  }></i>
                </NavLink>
              </div>
            ) : (
                ""
              )}
            {this.paymentModesInReq.includes(PAYMENT_MODE_UPI) ? (
              <div
                className={
                  this.state.active === "/upi"
                    ? "card-header active"
                    : "card-header collapsed"
                }
                data-parent="#accordion"
                href="#collapseupi"
              >
                <NavLink
                  className="card-title upi-tab-mobile"
                  to="/upi"
                  //onClick={() => this.toggle("/upi")}
                  onClick={() => this.onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_UPI, "/upi")}
                >
                  <span>UPI/BHIM</span>
                  <i className={
                    this.state.active === "/upi"
                      ? "fa fa-angle-up pull-right"
                      : "fa fa-angle-down pull-right"
                  }></i>
                </NavLink>
              </div>
            ) : (
                ""
              )}
            {this.paymentModesInReq.includes(PAYMENT_MODE_BHARATQR) ? (
              <div
                className={
                  this.state.active === "/bharatQR"
                    ? "card-header active"
                    : "card-header collapsed"
                }
                data-parent="#accordion"
                href="#collapsebharatqr"
              >
                <NavLink
                  className="card-title qr-tab-mobile"
                  to="/bharatqr"
                  //onClick={() => this.toggle("/bharatQR")}
                  onClick={() => this.onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_BHARATQR, "/bharatQR")}
                >
                  <span>Bharat QR</span>
                  <i className={
                    this.state.active === "/bharatQR"
                      ? "fa fa-angle-up pull-right"
                      : "fa fa-angle-down pull-right"
                  }></i>
                </NavLink>
              </div>
            ) : (
                ""
              )}
            {this.paymentModesInReq.includes(PAYMENT_MODE_WALLET) ? (
              <div
                className={
                  this.state.active === "/wallet"
                    ? "card-header active"
                    : "card-header collapsed"
                }
                data-parent="#accordion"
                href="#collapsewallets"
              >
                <NavLink
                  className="card-title wallet-tab-mobile"
                  to="/wallet"
                  //onClick={() => this.toggle("/wallet")}
                  onClick={() => this.onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_WALLET, "/wallet")}
                >
                  <span>Wallets</span>
                  <i className={
                    this.state.active === "/wallet"
                      ? "fa fa-angle-up pull-right"
                      : "fa fa-angle-down pull-right"
                  }></i>
                </NavLink>
              </div>
            ) : (
                ""
              )}
            {this.paymentModesInReq.includes(PAYMENT_MODE_NBFC_THIRD_PARTY_EMI) ? (
              <div
                className={
                  this.state.active === "/nbfc"
                    ? "card-header active"
                    : "card-header collapsed"
                }
                data-parent="#accordion"
                href="#collapsenbfc"
              >
                <NavLink
                  className="card-title nbfc-tab-mobile"
                  to="/nbfc"
                  //onClick={() => this.toggle("/nbfc")}
                  onClick={() => this.onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_NBFC_THIRD_PARTY_EMI, "/nbfc")}
                >
                  <span>NBFC</span>
                  <i className={
                    this.state.active === "/nbfc"
                      ? "fa fa-angle-up pull-right"
                      : "fa fa-angle-down pull-right"
                  }></i>
                </NavLink>
              </div>
            ) : (
                ""
              )}

            {this.paymentModesInReq.includes(PAYMENT_MODE_UPI_MANDATE) ? (

              <div
                className={
                  this.state.active === "/upimandate"
                    ? "card-header active"
                    : "card-header collapsed"
                }
                data-parent="#accordion"
                href="#collapseupimandate"

              >
                <NavLink
                  className="card-title upi-tab-mobile"
                  to="/upimandate"
                  //onClick={() => this.toggle("/upi")}
                  onClick={() => this.onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_UPI_MANDATE, "/upimandate")}
                >
                  <span>UPI/BHIM</span>
                  <i className={
                    this.state.active === "/upimandate"
                      ? "fa fa-angle-up pull-right"
                      : "fa fa-angle-down pull-right"
                  }></i>
                </NavLink>
              </div>
            ) : (
                ""
              )}

            {this.paymentModesInReq.includes(PAYMENT_MODE_BUY_NOW_PAY_LATER) ? (

              <div
                className={
                  this.state.active === "/buynowpaylater"
                    ? "card-header active"
                    : "card-header collapsed"
                }
                data-parent="#accordion"

              >

                <NavLink
                  className="card-title flexipay-tab-mobile"
                  to="/buynowpaylater"
                  //onClick={() => this.toggle("/upi")}
                  onClick={() => this.onClickPaymentModeNavSetAmountAccToPaymentMode(PAYMENT_MODE_BUY_NOW_PAY_LATER, "/buynowpaylater")}
                >
                  <span>Buy now Pay later</span>
                  <i className={
                    this.state.active === "/buynowpaylater"
                      ? "fa fa-angle-up pull-right"
                      : "fa fa-angle-down pull-right"
                  }></i>
                </NavLink>
              </div>
            ) : (
                ""
              )}
            <>
              {" "}
              {

                <Switch>
                  <Route key="/emi" path="/emi">
                    {isEMIDataSelected}
                  </Route>
                  <Route key="/cashbackOnFullPayment" path="/cashbackOnFullPayment">
                    {isCashbackOnFullPaymentSelected}
                  </Route>
                  <Route key="/upi" path="/upi" component={Upi} />
                  <Route key="/nbfc" path="/nbfc" component={NbfcEmi} />
                  <Route key="/upimandate" path="/upimandate" component={UpiMandate} />
                  <Route
                    key="/bharatqr"
                    path="/bharatqr"
                    component={BharatQR}
                  />
                  <Route key="/card" path="/card">
                    {cardComponent}
                  </Route>
                  <Route
                    key="/netbanking"
                    component={Netbanking}
                    path="/netbanking"
                  />
                  <Route key="/wallet" component={Wallet} path="/wallet" />
                  <Route key="/buynowpaylater" path="/buynowpaylater" component={BuyNowPayLater} />
                  <Redirect to={this.byDefaultComponent.value} />
                </Switch>
              }
            </>
          </div>
        </div>
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    merchant_payment_data:
      state.merchantPaymentDataFetchingReducer.merchantPaymentData,
    error: state.merchantPaymentDataFetchingReducer.error,
    loading: state.merchantPaymentDataFetchingReducer.loading,
    selected_emi_data:
      state.merchantPaymentDataFetchingReducer.selected_emi_data
  };
};

export default connect(mapStateToProps)(withRouter(Body));
