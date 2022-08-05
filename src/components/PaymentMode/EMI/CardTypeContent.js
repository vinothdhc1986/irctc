import React from "react";
import { connect } from "react-redux";
import "../../../css/style.css";
import axisbank from "../../../images/banks/axis.png";
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
  ConstEmiTypeConfigData,
  ConstCardTypeConfigData,
  Tenure
} from "../EMI";
class CardTypeContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      issuerSelectedId: null
    };
  }
  onClickIssuerSelection = issuerId => {
    this.setState({
      issuerSelectedId: issuerId
    });

    let emiTypeId = this.props.emi_type_id;
    let cardTypeId = this.props.card_type_id;

    var emiTypeConfData = ConstEmiTypeConfigData.filter(
      obj => obj.EMI_TYPE_ID === emiTypeId
    );

    var cardTypeConfData = ConstCardTypeConfigData.filter(
      obj => obj.CARD_TYPE_ID === cardTypeId
    );
    let issuerLinkPath =
      emiTypeConfData[0].ROUTE_PATH +
      cardTypeConfData[0].ROUTE_PATH +
      "/issuer/" +
      issuerId;
    //  this.props.history.push("/emi/no_cost_emi/credit_card/issuer/3");
  };

  componentDidMount() {
    this.onClickIssuerSelection(1);
  }

  render() {
    const { error, loading, merchant_payment_data } = this.props;
    let emiTypeId = this.props.emi_type_id;
    let cardTypeId = this.props.card_type_id;

    if (
      !merchant_payment_data.merchant_data ||
      !merchant_payment_data.payment_mode_data ||
      !emiTypeId ||
      emiTypeId == 0 ||
      !cardTypeId ||
      cardTypeId == 0
    ) {
      return null;
    }

    var emiTypeConfData = ConstEmiTypeConfigData.filter(
      obj => obj.EMI_TYPE_ID === emiTypeId
    );

    var cardTypeConfData = ConstCardTypeConfigData.filter(
      obj => obj.CARD_TYPE_ID === cardTypeId
    );

    const issuersList = merchant_payment_data.payment_mode_data
      .filter(
        obj => obj.payment_mode_id === PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
      )[0]
      .data.emi_info.filter(obj => obj.emi_category === emiTypeId)[0]
      .emi_category_data.filter(obj => obj.card_category === cardTypeId)[0];

    if (!issuersList) {
      return null;
    }
    const issuers = issuersList.issuers;
    // alert(JSON.stringify(issuers));
    const dynamicIssuerList = issuers.map(obj => {
      let issuerLinkPath =
        emiTypeConfData[0].ROUTE_PATH +
        cardTypeConfData[0].ROUTE_PATH +
        "/issuer/" +
        obj.issuer_id;
      return (
        <div
          key={issuerLinkPath}
          className="col-lg-3 col-md-3 col-sm-6 col-12 "
        >
          <div
            className={`bank-list-names  ${obj.issuer_id === this.state.issuerSelectedId ? "active" : ""
              }`}
            onClick={() => this.onClickIssuerSelection(obj.issuer_id)}
          >
            <div className="bank-name ">
              <NavLink
                exact
                to={issuerLinkPath}
                className="nav-item "
                activeClassName="nav-item"
              >
                <img src={axisbank} alt="axis bank" />
                {obj.issuer_id + "erfewfewfewf"}
              </NavLink>
            </div>
          </div>
        </div>
      );
    });
    if (!dynamicIssuerList) {
      return null;
    }
    return (
      <>
        <div className="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
          <div
            className=""
            id="nav-creditcard"
            role="tabpanel"
            aria-labelledby="nav-creditcard-tab"
          >
            <div className="col-12 p-0 bank-list">
              <div className="row">{dynamicIssuerList}</div>
              <Switch>
                {issuers.map(obj => {
                  let issuerLinkPath =
                    emiTypeConfData[0].ROUTE_PATH +
                    cardTypeConfData[0].ROUTE_PATH +
                    "/issuer/" +
                    obj.issuer_id;
                  return (
                    <Route key={obj.issuer_id} path={issuerLinkPath}>
                      <Tenure
                        emi_type_id={emiTypeId}
                        card_type_id={cardTypeId}
                        issuer_id={obj.issuer_id}
                      />
                    </Route>
                  );
                })}
              </Switch>
            </div>
          </div>
        </div>
      </>
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

export default connect(mapStateToProps)(withRouter(CardTypeContent));
