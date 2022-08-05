import React from "react";
import { connect } from "react-redux";
import "../../../css/style.css";
import upiLogo from "../../../images/upi.png";
import gpayLogo from "../../../images/google_pay.png";
import { setSelectUpiOption } from "../../../stores/actions/UpiPaymentModeAction";
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





class UpiNavOptions extends React.Component {
    constructor(props) {
        super(props)
        this.PinePGTxnId = this.props.merchant_payment_data.txn_data.PinePgTxnId || 0;
    }

    componentDidMount() {
        let upiOptions = this.props.upiOptionsConfigured;
        if (upiOptions && upiOptions != null && upiOptions.length > 0) {
            let byDefaultUpiOption = upiOptions[0];
            this.props.setSelectUpiOption(byDefaultUpiOption.UPIOptionUIVal, this.props.merchant_payment_data.txn_data.pine_pg_txn_id)
        }
    }

    render() {
        let upiOptions = this.props.upiOptionsConfigured;
        const upiOptionsToRender = upiOptions.map(upiOption => {
            if (upiOption) {
                let upiComponent = upiOption.AppName === 'UPI' ? 'PayByUpi' : 'PayByGPay';
                let iconImage = upiOption.AppName === 'UPI' ? upiLogo : gpayLogo;
                let isSelected = this.props.upiPaymentModeUpiOptionOpted === upiOption.UPIOptionUIVal ? true : false;
                let upiOptionLinkPath =
                    "/upi/UpiPaymentOptions/" +
                    upiComponent;
                return (
                    <div class="col-lg-3 col-md-5 col-sm-3 col-6 mb-3" key={upiOption.UPIOptionUIId}
                        onClick={() => this.props.setSelectUpiOption(upiOption.UPIOptionUIVal, this.props.merchant_payment_data.txn_data.PinePgTxnId)}>
                        <div
                            className={`border-grey upi-app ${isSelected ? "active" : ""}
                              `}
                            id={upiOption.UPIOptionUIId}>
                            <img src={iconImage} alt={upiOption.AppName} />
                        </div>
                    </div>
                );
            }

        });
        if (!upiOptionsToRender) {
            return <div>Hello</div>;
        }
        return (
            <>
                <div class="row">
                    {upiOptionsToRender}
                </div>


            </>
        );

        return (
            { upiOptionsToRender }
        );
    };
}

const mapStateToProps = state => {
    return {
        merchant_payment_data:
            state.merchantPaymentDataFetchingReducer.merchantPaymentData,
        error: state.merchantPaymentDataFetchingReducer.error,
        loading: state.merchantPaymentDataFetchingReducer.loading,
        upiPaymentModeUpiOptionOpted: state.selectedUpiThirdPartyAppOptionReducer.SelectedUpiThirdPartyUpiApp
    };
};
export default connect(mapStateToProps, { setSelectUpiOption })(UpiNavOptions);