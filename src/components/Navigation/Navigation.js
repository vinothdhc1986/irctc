import React from "react";
import { connect } from "react-redux";
import "../../css/style.css";
import * as PAYMENT_MODE_CONST from "../../Constants/PaymentModeConstants";
import Body from "../Body/Body";
import { NavigationTag } from "../Navigation";
import PaymentAmountUIFetchUtil from "../../utils/PaymentAmountUIFetchUtil";
import MerchantPaymentDataUtils from "../../utils/MerchantPaymentDataUtils";
import {
  SetPaymentModeID,
  SetPaymentAmount
} from "../../stores/actions/PaymentModeAction";
import { SetEMITypeID } from "../../stores/actions/EmiDataProcessingAction";
import { SetOtherEMI } from "../../stores/actions/EmiDataProcessingAction";
import { ChooseEMIPaymentMode } from "../../stores/actions/EmiDataProcessingAction";

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
    this.objPaymentAmountUIUtil = new PaymentAmountUIFetchUtil();
    this.error = null;
    this.loading = null;
    this.mercantPaymentData = null;
    this.byDefaultComponent = { key: 0, value: "/" };
    this.state =
    {
      selectedPaymentMode: 0,
      isCashbackOnFullPaymentModeSelected: false
    };
    this.isCashBackonFullPaymentDefaultSelected = false;
    this.EMISelectedPlan = null;
  }
  setAmountGloballyAndPaymentModeID = (amount, paymentModeId) => {
    this.props.dispatch(SetPaymentModeID(paymentModeId));
    this.props.dispatch(SetPaymentAmount(amount));
  };

  onClickedCashbackOnFullPayment = paymentModeId => {
    let selected_emi_data = this.props.selected_emi_data;

    let isRefreshStateOnChangingTab = this.state.isCashbackOnFullPaymentModeSelected == false;

    this.setAmountGloballyAndPaymentModeID(
      selected_emi_data.paymentAmountForEMI,
      paymentModeId
    );
    this.setState({
      selectedPaymentMode: paymentModeId,
      isCashbackOnFullPaymentModeSelected: true
    })

    if (isRefreshStateOnChangingTab)
      this.onClickEMITypeNaviagtion(selected_emi_data.emi_category);

    this.props.dispatch(ChooseEMIPaymentMode());


  }

  onClickEMITypeNaviagtion = emiTypeId => {
    this.props.dispatch(SetEMITypeID(emiTypeId));
    this.props.dispatch(
      SetPaymentAmount(
        this.objMerchantPaymentDataUtils.GetPaymentAmount(
          this.mercantPaymentData
        )
      )
    );
  };


  onClickPaymentModeNavSetAmountAccToPaymentMode = paymentModeId => {
    let isRefreshStateOnChangingTab = this.state.isCashbackOnFullPaymentModeSelected == true || this.state.selectedPaymentMode != 4;

    this.setState(
      {
        selectedPaymentMode: paymentModeId,
        isCashbackOnFullPaymentModeSelected: false
      }
    );
    let selected_emi_data = this.props.selected_emi_data;

    if (paymentModeId == 4) {
      //alert(selected_emi_data.paymentAmountForEMI);
      this.setAmountGloballyAndPaymentModeID(
        selected_emi_data.paymentAmountForEMI,
        paymentModeId
      );

      this.props.dispatch(ChooseEMIPaymentMode());


      if (isRefreshStateOnChangingTab)
        this.onClickEMITypeNaviagtion(selected_emi_data.emi_category);

    } else {
      this.setAmountGloballyAndPaymentModeID(
        this.objPaymentAmountUIUtil.GetPaymentAmountUIAccToPaymentMode(
          this.mercantPaymentData,
          paymentModeId
        ),
        paymentModeId
      );
    }
  };

  componentDidMount() {
    if (!this.props.selected_emi_data.isNoSchemeToBeSelected
      && !this.props.selected_emi_data.isDefaultSchemeSelected &&
      this.EMISelectedPlan != null && this.EMISelectedPlan.emi_info.length > 0
    ) {



      let emiSelectedTypeId =
        this.objMerchantPaymentDataUtils.GetDefaultSelectedEMITypeId(
          this.EMISelectedPlan.emi_info
        );
      let issuerIdSelected = this.EMISelectedPlan.emi_info[0].emi_category_data[0].issuers[0].issuer_id;

      let tenureIdSelected = this.EMISelectedPlan.emi_info[0].emi_category_data[0].issuers[0].tenures[0].tenure_id;

      let cardTypeIdSelected = this.EMISelectedPlan.emi_info[0].emi_category_data[0].card_category;

      let tenuredata = this.objMerchantPaymentDataUtils.GetTenureDataForTenureId(
        this.mercantPaymentData,
        emiSelectedTypeId,
        cardTypeIdSelected,
        issuerIdSelected,
        tenureIdSelected
      );

      if (tenuredata != null && tenureIdSelected == "96") {
        this.isCashBackonFullPaymentDefaultSelected = true
      }
    }

  }

  render() {
    let priorityWisePaymentModeIds = [];

    const { error, loading, merchant_payment_data } = this.props;
    if (!merchant_payment_data.payment_mode_data) {
      return null;
    }
    let paymentModesInReq = merchant_payment_data.payment_mode_data.map(obj => {
      return obj.payment_mode_id;
    });
    if (
      paymentModesInReq &&
      paymentModesInReq != null &&
      paymentModesInReq.length > 0
    ) {
      PAYMENT_MODE_CONST.PAYMENT_MODES_SEQUENCE_PRIORITIES.map(pm => {
        if (paymentModesInReq.indexOf(pm) > -1) {
          priorityWisePaymentModeIds.push(pm);
        }
      });
      PAYMENT_MODE_CONST.PAYMENT_MODES_SEQUENCE_PRIORITIES.some(pm => {
        if (paymentModesInReq.indexOf(pm) > -1) {
          PAYMENT_MODE_CONST.PAYMENT_MODES_BY_KEY_VALUE_PAIR.map(keyVal => {
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
    this.mercantPaymentData = merchant_payment_data;
    // const dynamicNavigationSideBar = merchant_payment_data.payment_mode_data.map(
    //   obj => {
    //     // return <NavigationTag tagName={obj.payment_mode_name} isActive={obj.isActive} routeName={obj.RouteName}/>
    //     return (
    //       <NavigationTag
    //         payment_mode_id={obj.payment_mode_id}
    //         onClickedPaymentMode={() =>
    //           this.onClickPaymentModeNavSetAmountAccToPaymentMode(
    //             obj.payment_mode_id
    //           )
    //         }
    //       />
    //     );
    //   }
    // );

    /*Pre offer tag starts*/
    let cardInfoData = this.objMerchantPaymentDataUtils.GetPaymentModeDataForPaymentModeId(
      merchant_payment_data,
      1
    );

    let isPreOfferedTxn = false;

    if (!(cardInfoData == null || cardInfoData[0] == null)) {
      isPreOfferedTxn = cardInfoData[0].data.isPreOfferTxn;

    }


    if (this.props.selected_emi_data.isNoSchemeToBeSelected) {

      this.isCashBackonFullPaymentDefaultSelected = false;
    }

    let isPaymentCashbackOnFullPaymentExist = false;
    let isSpecialOffersToBeShownForFullCashback = false;
    let isSpecialOffersToBeShownForEMIExceptFullCashback = false;
    let isNonFullCashbackEMIExists = false;

    merchant_payment_data.payment_mode_data.map(obj => {
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

                      if (criteria.emi_category != 4) {
                        isNonFullCashbackEMIExists = true;
                        isSpecialOffersToBeShownForEMIExceptFullCashback = (isSpecialOffersToBeShownForEMIExceptFullCashback) || (this.objMerchantPaymentDataUtils.IsTenureContainsSpecialOffer(tenureobj));
                      }

                      if (
                        isPaymentCashbackOnFullPaymentExist == true
                        && isSpecialOffersToBeShownForFullCashback == true
                        && isSpecialOffersToBeShownForEMIExceptFullCashback == true
                      ) {
                        return;
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






    /*Pre offer tag ends*/
    const dynamicNavigationSideBar = priorityWisePaymentModeIds.map(
      payment_mode_id => {
        let isActiveTab =
          (this.byDefaultComponent.key === payment_mode_id &&
            this.state.selectedPaymentMode == 0) ||
            payment_mode_id === this.state.selectedPaymentMode
            ? "active"
            : "";


        this.EMISelectedPlan = this.objMerchantPaymentDataUtils.GetEMISelectedData(
          this.mercantPaymentData
        )




        // return <NavigationTag tagName={obj.payment_mode_name} isActive={obj.isActive} routeName={obj.RouteName}/>
        return (
          <NavigationTag
            isActiveTab={isActiveTab}
            payment_mode_id={payment_mode_id}
            isPaymentCashbackOnFullPaymentExist={isPaymentCashbackOnFullPaymentExist}
            isCashbackOnFullPaymentModeSelected={this.state.isCashbackOnFullPaymentModeSelected}
            isSpecialOffersToBeShownForFullCashback={isSpecialOffersToBeShownForFullCashback}
            isSpecialOffersToBeShownForEMIExceptFullCashback={isSpecialOffersToBeShownForEMIExceptFullCashback}
            isNonFullCashbackEMIExists={isNonFullCashbackEMIExists}
            onClickedCashbackOnFullPayment=
            //{this.onClickedCashbackOnFullPayment}
            {() =>
              this.onClickedCashbackOnFullPayment(
                payment_mode_id
              )
            }
            onClickedPaymentMode={() =>
              this.onClickPaymentModeNavSetAmountAccToPaymentMode(
                payment_mode_id
              )
            }
            isPreOfferedPaymentMode={isPreOfferedTxn}
            isCashBackonFullPaymentDefaultSelected=
            {this.isCashBackonFullPaymentDefaultSelected}

          />
        );
      }
    );
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 white-block ">
        <div className="row">
          <div className="col-md-4 col-lg-3 left-sidepanel">
            <h1>Choose a payment option</h1>
            <ul className="nav nav-tabs">
              {dynamicNavigationSideBar}

              {/* <li className="active"> <a href="#collapseemi" className="emi-tab active show" data-toggle="tab"><span>EMI</span></a> </li>						  
                    <li> <a href="#collapsecreditdebit" className="cc-tab" data-toggle="tab"><span>Credit &amp; Debit Cards</span> </a> </li>						  
                    <li> <a href="#collapsenetbanking" className="netbanking-tab" data-toggle="tab"><span>Net Banking</span></a> </li>
                    <li> <a href="#collapseupi" className="upi-tab" data-toggle="tab"><span>UPI/BHIM</span></a> </li>
                        <li> <a href="#collapsebharatqr" className="qr-tab" data-toggle="tab"><span>Bharat QR</span></a> </li>
                    <li> <a href="#collapsewallets" className="wallet-tab" data-toggle="tab"><span>Wallets</span></a> </li>              
                    <li className=""> <a href="#collapsenbfc" className="nbfc-tab" data-toggle="tab"><span>NBFC</span></a> </li> */}
            </ul>
          </div>
          <Body />
        </div>
      </div>
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

export default connect(mapStateToProps)(Navigation);
