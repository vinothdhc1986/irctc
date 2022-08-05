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

export const CONST_EMI_TYPE_DATA = [
    {
        EMI_TYPE_ID: EMI_TYPE_CONST.EMI_TYPE_NO_EMI_ONLY_CASHBACK_COST_EMI,
        NAME: "No EMI Only Cashback",
        VALUE: "Avail Cashback without EMI",
        ROUTE_PATH: "/cashbackOnFullPayment"
    }
];

const d = function CashbackType(props) {
    const match = useRouteMatch();
    return (() => {
        const emiTypeId = props.emi_type_id;
        const isSelected = props.is_selected;
        // alert(isSelected);
        if (!emiTypeId) {
            return null;
        }

        var emiTypeData = CONST_EMI_TYPE_DATA.filter(
            obj => obj.EMI_TYPE_ID === emiTypeId
        );
        if (emiTypeData && emiTypeData.length > 0) {
            return (
                <>
                    <NavLink
                        to={emiTypeData[0].ROUTE_PATH}
                        className={`nav-item nav-link ${isSelected ? "active" : ""}`}
                        activeClassName=""
                        // id="nav-nocostemi-tab"
                        id={emiTypeId}
                        //data-toggle="tab"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        onClick={props.onClicked}
                    >
                        {emiTypeData[0].NAME}
                        <span>{emiTypeData[0].VALUE}</span>
                    </NavLink>
                </>
            );
        }

        return null;
    })();
};

export default d;
