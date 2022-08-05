import React from "react";
import { connect } from "react-redux";
import "../../../css/style.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  NavLink,
  Redirect,
  useHistory
} from "react-router-dom";
import {
  ConstEmiTypeConfigData,
  cardType as CardType,
  Issuers,
  ConstCardTypeConfigData
} from "../EMI";

import {
  ConstCashbackTypeConfigData
} from "../CashbackOnFullPayment";
import { withRouter } from "react-router";
import * as PAYMENT_MODE_CONST from "../../../Constants/PaymentModeConstants";

import MerchantPaymentDataUtils from "../../../utils/MerchantPaymentDataUtils";
import { SetCardTypeId } from "../../../stores/actions/EmiDataProcessingAction";
import { SetPaymentAmount } from "../../../stores/actions/PaymentModeAction";
import * as EMI_TYPE_CONST from "../../../Constants/EMITypeConstants";

class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = { SelectedCardTypeId: null };
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
    this.error = null;
    this.loading = null;
    this.mercantPaymentData = null;
    this.allCardDataForEMIType = null;
    this.SelectedCardTypeId = null;
   // this.conveniencefee_data = this.props.conveniencefee_data;
  }
  // onLoaSetAmount =(fee)=>{
  //       console.log('----convfee ====='+JSON.stringify(fee));
  //   if(fee.data!=undefined)
  //   {
  //   this.props.dispatch(
  //     SetPaymentAmount(
  //       fee.data.total
  //     )
  //   );
  //   console.log('----convfee setamount====='+JSON.stringify(fee.data.total));

  //     }
  // }
  // componentDidMount() {
  //   //alert("cardM:" + this.allCardDataForEMIType);
  //   let cardTypeId = this.objMerchantPaymentDataUtils.GetDefaultSelectedCardTypeId(
  //     this.allCardDataForEMIType
  //   );

  //   if (!cardTypeId || cardTypeId == 0) {
  //     return;
  //   }
  //   this.onClickCardTypeNaviagtion(cardTypeId);
  // }
  GetDefaulCardTypeId = () => {
    //alert(JSON.stringify(this.allCardDataForEMIType));
    let cardTypeId = this.objMerchantPaymentDataUtils.GetDefaultSelectedCardTypeId(
      this.allCardDataForEMIType
    );
    //  alert(cardTypeId);
    if (!cardTypeId || cardTypeId == 0) {
      return;
    }
    return cardTypeId;
  };

  onClickCardTypeNaviagtion = cardTypeId => {
    //  alert("harsh");
    //conveniencefee_data.total
    this.props.dispatch(
      SetPaymentAmount(
        this.objMerchantPaymentDataUtils.GetPaymentAmount(
          this.mercantPaymentData
        )
      )
    );
    //alert('---test--');
   // alert('----convfee ====='+JSON.stringify(convfee.data.total));
    // this.props.dispatch(
    //   SetPaymentAmount(
    //     convfee.data.total
    //   )
    // );
    this.props.dispatch(SetCardTypeId(cardTypeId));
  };
  render() {
    const {
      error,
      loading,
      merchant_payment_data,
      selected_emi_data,
      //conveniencefee_data,
    } = this.props;
    this.mercantPaymentData = merchant_payment_data;


    let emiTypeId = this.props.emi_type_id;
    if (emiTypeId == null || emiTypeId == 0 || emiTypeId == undefined) {
      return null;
    }

  //  if(conveniencefee_data!=undefined){
  //    this.onLoaSetAmount(conveniencefee_data);
  //  }

    var emiTypeConfData = ConstEmiTypeConfigData.filter(
      obj => obj.EMI_TYPE_ID === emiTypeId
    );


    if (emiTypeConfData == null || emiTypeConfData.length == 0) {
      emiTypeConfData = ConstCashbackTypeConfigData.filter(
        obj => obj.EMI_TYPE_ID === emiTypeId
      );

    }

    this.allCardDataForEMIType = this.objMerchantPaymentDataUtils.GetAllCardDataForEMIType(
      this.mercantPaymentData,
      emiTypeId
    );

    //alert("cardR:" + JSON.stringify(this.allCardDataForEMIType));
    if (!this.allCardDataForEMIType) {
      return null;
    }

    let defaultCardTypeId = selected_emi_data.cardType;
    //alert(selected_emi_data.cardType);
    // alert("crd d:" + selected_emi_data.cardType);
    if (!selected_emi_data.cardType) {
      //get default id
      defaultCardTypeId = this.GetDefaulCardTypeId();
      this.props.dispatch(SetCardTypeId(defaultCardTypeId));
      //  alert(defaultCardTypeId);
    }

    // let emiTypeRelativePath = '';
    // if (emiTypeId != EMI_TYPE_CONST.EMI_TYPE_NO_EMI_ONLY_CASHBACK_COST_EMI) {
    //   emiTypeRelativePath = emiTypeConfData[0].ROUTE_PATH
    // }


    const dynamicCardType = this.allCardDataForEMIType.map(obj => {
      return (
        <CardType
          emi_type_relative_path={emiTypeConfData[0].ROUTE_PATH}
          //emi_type_relative_path={emiTypeRelativePath}
          card_type_id={obj.card_category}
          key={obj.card_category}
          is_selected={defaultCardTypeId == obj.card_category}
          onClicked={() => this.onClickCardTypeNaviagtion(obj.card_category)}
        />
      );
    });

    // let PathToRedirectDefaultSelectedCardType = "";
    // switch (selectedCardTypeByDefaultId) {
    //   case 1:
    //     PathToRedirectDefaultSelectedCardType =
    //       emiTypeConfData[0].ROUTE_PATH + "/credit_card";
    //     break;

    //   case 2:
    //     PathToRedirectDefaultSelectedCardType =
    //       emiTypeConfData[0].ROUTE_PATH + "/debit_card";
    //     break;
    // }
    //alert("cards:" + this.state.SelectedCardTypeId);
    const isIssuerPageToBeRender = defaultCardTypeId ? (
      <Issuers emi_type_id={emiTypeId} card_type_id={defaultCardTypeId} />
    ) : null;
    return (
      <div
        className="tab-content emiTypeContent col-12 p-0"
        id="nav-tabContent"
      >
        <div
          className="tab-pane fade show active"
          id="nav-nocostemi"
          role="tabpanel"
          aria-labelledby="nav-nocostemi-tab"
        >
          <span className="emi-type-subheading mb-4">
            {emiTypeConfData[0].VALUE}
          </span>

          <div className="col-12 p-0" id="card-type">
            <nav>
              <div
                className="nav nav-tabs nav-fill"
                id="nav-tab"
                role="tablist"
              >
                {dynamicCardType}
              </div>
            </nav>
            {isIssuerPageToBeRender}
            {/* <Switch>
              <Route
                path={
                  emiTypeConfData[0].ROUTE_PATH +
                  ConstCardTypeConfigData.filter(
                    obj => obj.CARD_TYPE_ID === 1
                  )[0].ROUTE_PATH
                }
              >
                <CardTypeContent emi_type_id={emiTypeId} card_type_id={1} />
              </Route>
              <Route
                path={
                  emiTypeConfData[0].ROUTE_PATH +
                  ConstCardTypeConfigData.filter(
                    obj => obj.CARD_TYPE_ID === 2
                  )[0].ROUTE_PATH
                }
              >
                <CardTypeContent emi_type_id={emiTypeId} card_type_id={2} />
              </Route>
            </Switch>
            <Redirect to={PathToRedirectDefaultSelectedCardType}></Redirect> */}
          </div>
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
      state.merchantPaymentDataFetchingReducer.selected_emi_data,
    conveniencefee_data: state.merchantPaymentDataFetchingReducer.conveniencefeeData,

  };
};

export default connect(mapStateToProps)(Cards);
