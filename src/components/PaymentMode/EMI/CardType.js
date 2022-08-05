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

const cardType = function CardType(props) {
  const match = useRouteMatch();
  return (() => {
    const cardTypeId = props.card_type_id;
    const isSelected = props.is_selected;
    const EmiTypeRelativePath = props.emi_type_relative_path;
    if (!cardTypeId) {
      return null;
    }

    var cardTypeData = CONST_CARD_TYPE_DATA.filter(
      obj => obj.CARD_TYPE_ID === cardTypeId
    );
    if (cardTypeData && cardTypeData.length > 0) {
      return (
        <>
          <NavLink
            to={EmiTypeRelativePath + cardTypeData[0].ROUTE_PATH}
            className={`nav-item nav-link ${isSelected ? "active" : ""}`}
            activeClassName=""
            // id="nav-nocostemi-tab"
            id={cardTypeId}
            //data-toggle="tab"
            role="tab"
            aria-controls="nav-home"
            aria-selected="true"
            onClick={props.onClicked}
          >
            {cardTypeData[0].NAME}
          </NavLink>
        </>
      );
    }

    return null;
  })();
};

export default cardType;
