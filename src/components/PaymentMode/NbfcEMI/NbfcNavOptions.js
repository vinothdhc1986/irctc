import React from "react";
import { connect } from "react-redux";
import "../../../css/style.css";
import bflLogo from "../../../images/bfl.png";
import zestMoneyLogo from "../../../images/zest_money.png";
import { setSelectNbfcOption } from "../../../stores/actions/NbfcPaymentModeAction";
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


const NbfcVendorsConfig = () => {
    return {
        BFL: {
            nbfcComponent: 'PayByBfl',
            iconImage: bflLogo
        },
        ZEST_MONEY: {
            nbfcComponent: 'PayByZestMoney',
            iconImage: zestMoneyLogo
        }
    }
}


class NbfcNavOptions extends React.Component {
    constructor(props) {
        super(props)
        this.PinePGTxnId = this.props.merchant_payment_data.txn_data.pine_pg_txn_id || 0;
    }

    componentDidMount() {
        let nbfcOptions = this.props.nbfcOptionsConfigured;
        if (nbfcOptions && nbfcOptions != null && nbfcOptions.length > 0) {
            let byDefaultNbfcOption = nbfcOptions[0];
            this.props.setSelectNbfcOption(byDefaultNbfcOption.vendor_name, this.props.merchant_payment_data.txn_data.pine_pg_txn_id)
        }
    }

    render() {
        let nbfcOptions = this.props.nbfcOptionsConfigured;
        const nbfcOptionsToRender = nbfcOptions.map(nbfcOption => {
            if (nbfcOption) {
                let nbfcComponent = nbfcOption.vendor_name === 'BFL' ? 'PayByBfl' : 'PayByZestMoney';
                let iconImage = nbfcOption.vendor_name === 'BFL' ? bflLogo : zestMoneyLogo;
                let isSelected = this.props.nbfcPaymentModeEmiVendorOpted === nbfcOption.vendor_name ? true : false;
                let nbfcOptionLinkPath =
                    "/Nbfc/NbfcPaymentOptions/" +
                    nbfcComponent;
                return (
                    <div class="col-lg-3 col-md-5 col-sm-3 col-6 mb-3" key={nbfcOption.vendor_name}
                        onClick={() => this.props.setSelectNbfcOption(nbfcOption.vendor_name, this.props.merchant_payment_data.txn_data.pine_pg_txn_id)}>
                        <div
                            className={`border-grey upi-app ${isSelected ? "active" : ""}
                              `}
                            id={nbfcOption.vendor_name}>
                            <img src={iconImage} alt={nbfcOption.vendor_display_name} />
                        </div>
                    </div>
                );
            }

        });
        if (!nbfcOptionsToRender) {
            return <div></div>;
        }
        return (
            <>
                <div class="row">
                    {nbfcOptionsToRender}
                </div>
            </>
        );
    };
}

const mapStateToProps = state => {
    return {
        merchant_payment_data:
            state.merchantPaymentDataFetchingReducer.merchantPaymentData,
        error: state.merchantPaymentDataFetchingReducer.error,
        loading: state.merchantPaymentDataFetchingReducer.loading,
        nbfcPaymentModeEmiVendorOpted: state.selectedNbfcPaymentOptionReducer.NbfcEmiVendor
    };
};
export default connect(mapStateToProps, { setSelectNbfcOption })(NbfcNavOptions);