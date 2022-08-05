import React from "react";
import * as EMI_TYPE_CONST from "../../../Constants/EMITypeConstants";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  NavLink
} from "react-router-dom";
import { EMITypeContent } from "../EMI";
import "../../../css/style.css";
// import axisbank from "../../../images/banks/axis.png";

export const CONST_CARD_TYPE_DATA = [
  {
    CARD_TYPE_ID: 1,
    NAME: "Credit Card",
    VALUE: "Credit Card",
    ROUTE_PATH: "/credit_card"
  },
  {
    CARD_TYPE_ID: 2,
    NAME: "Debit Card",
    VALUE: "Debit Card ",
    ROUTE_PATH: "/debit_card"
  }
];

const issuerType = function IssuerType(props) {
  return (() => {
    const issuerId = props.issuer_id;
    const isSelected = props.is_selected;
    let issuerName = props.issuer_name;
    let isViewSpecialOfferText = props.isContainsSpecialOffers;

    let specialOfferText =
      (isViewSpecialOfferText)
        ?
        (
          <span class="text-blue fs-11">
            Special offer available
          </span>
        )
        :
        (null);
    //alert("issuertype" + issuerId);

    // let imgUrl = "../../images/banks/" + issuerName + ".png";
    return (
      <>
        <div className="col-lg-3 col-md-3 col-sm-6 col-12 ">
          <div
            className={`bank-list-names  ${isSelected ? "active" : ""}`}
            onClick={props.onClicked}
          >
            <img src={`../../${process.env.PUBLIC_URL}/images/banks/${issuerName}.png`} alt="" />
            {issuerName}
          </div>
          {specialOfferText}
        </div>
      </>
    );

    return null;
  })();
};

export default issuerType;
