import React from "react";
import { connect } from "react-redux";
import "../../../../../css/style.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

class EmiTenure extends React.Component {
    constructor(props) {
        super(props);
        this.error = null;
        this.loading = null;
    };
    render() {
        let tenureOptionRdId = "bflTenure-" + this.props.scheme.tenure_in_months;
        let isSelected
        return (
            <>
                <div class="col-lg-4 col-md-4 col-sm-6 col-12  mb-3 pr-2">
                    <div className={`emi-tenure ${this.props.isSelected ? "active" : ""}`}>
                        <div class="custom-control custom-radio bdr-btm-0">
                            <input type="radio" class="custom-control-input" id={tenureOptionRdId} name="BFLTenureID"
                                onClick={() => this.props.OnBFLRadioBtnClick(this.props.scheme.tenure_in_months, this.props.scheme.scheme_code)} />
                            <label class="custom-control-label" for={tenureOptionRdId}>
                                <span class="pull-left text-left months">{this.props.scheme.tenure_in_months} Months<br />
                                    {/* <span class="roi">at 13% p.a.</span> */}
                                </span>
                                <span class="pull-right text-right amount">&#x20B9;{this.props.scheme.emi_amount}</span>
                            </label>
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
export default connect(mapStateToProps, null)(EmiTenure);
