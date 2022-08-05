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
  CardTypeContent,
  ConstCardTypeConfigData
} from "../EMI";
import { withRouter } from "react-router";
import * as PAYMENT_MODE_CONST from "../../../Constants/PaymentModeConstants";

class EMITypeContent extends React.Component {
  //

  //   handleClick = url => {
  //     let history = useHistory();
  //     history.push("/home");
  //   };
  render() {
    const { error, loading, merchant_payment_data } = this.props;
    let emiTypeId = this.props.emi_type_id;

    if (
      !merchant_payment_data.merchant_data ||
      !merchant_payment_data.payment_mode_data ||
      !emiTypeId ||
      emiTypeId == 0
    ) {
      return null;
    }
    const emidata = merchant_payment_data.payment_mode_data.filter(
      obj => obj.payment_mode_id === PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
    )[0];

    if (
      !emidata ||
      !emidata.data ||
      !emidata.data.emi_info ||
      emidata.data.emi_info.length == 0
    ) {
      return null;
    }

    let emiTypeData = emidata.data.emi_info.filter(
      obj => obj.emi_category === emiTypeId
    );
    if (
      !emiTypeData ||
      emiTypeData.length == 0 ||
      !emiTypeData[0].emi_category_data ||
      emiTypeData[0].emi_category_data.length == 0
    ) {
      return null;
    }

    emiTypeData = emiTypeData[0];


    var emiTypeConfData = ConstEmiTypeConfigData.filter(
      obj => obj.EMI_TYPE_ID === emiTypeId
    );

    let selectedCardTypeByDefaultId = 0;
    let isSetCardTypeByDefaultId = false;




    const dynamicCardType = emiTypeData.emi_category_data.map(obj => {
      if (!isSetCardTypeByDefaultId) {
        selectedCardTypeByDefaultId = obj.card_category;
        isSetCardTypeByDefaultId = true;
      }
      return (
        <CardType
          emi_type_relative_path={emiTypeConfData[0].ROUTE_PATH}
          card_type_id={obj.card_category}
          key={obj.card_category}
        />
      );
    });





    let PathToRedirectDefaultSelectedCardType = "";
    switch (selectedCardTypeByDefaultId) {
      case 1:
        PathToRedirectDefaultSelectedCardType =
          emiTypeConfData[0].ROUTE_PATH + "/credit_card";
        break;

      case 2:
        PathToRedirectDefaultSelectedCardType =
          emiTypeConfData[0].ROUTE_PATH + "/debit_card";
        break;
    }

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
            <Switch>
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
            <Redirect to={PathToRedirectDefaultSelectedCardType}></Redirect>
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
    loading: state.merchantPaymentDataFetchingReducer.loading
  };
};
export function HomeButton() {
  const history = useHistory();

  function handleClick(url) {
    history.push(url);
  }
}
export default connect(mapStateToProps)(EMITypeContent);
