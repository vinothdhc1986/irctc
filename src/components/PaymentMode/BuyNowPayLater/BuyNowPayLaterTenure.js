import React, { Component } from 'react';
import { connect } from "react-redux";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

class BuyNowPayLaterTenure extends Component {
    constructor(props) {
        super(props);
        this.error = null;
        this.loading = null;


    };


    render() {
        let tenureOptionRdId = "BNPLGridTenure-" + this.props.tenure.tenure_id;
        const isSelected = this.props.isSelected;

        return (
            <>
                <div class="col-lg-4 col-md-4 col-sm-6 col-12  mb-3 pr-2">
                    <div className={`emi-tenure ${this.props.isSelected ? "active" : ""}`}>
                        <div class="custom-control custom-radio bdr-btm-0">
                            <input type="radio" class="custom-control-input" id={tenureOptionRdId} name="BNPLTenureID"
                                onClick={() => this.props.OnBNPLRadioBtnClick(this.props.tenure.tenure_id, this.props.tenure.auth_amount, this.props.tenure.bank_interest_rate)} />


                            <label class="custom-control-label" for={tenureOptionRdId}>
                                <span class="pull-left text-left months">{this.props.tenure.tenure_display_name} <br />

                                </span>
                                <span class="pull-right text-right amount">&#x20B9;{this.props.tenure.total_amount / 100}</span>
                            </label>
                        </div >
                        <div class="interest-charged pull-left"> {this.props.tenure.tenure_id == "1081" ?
                            <>
                                NO Extra Cost
                            </> :
                            <>
                                Interest charged &#x20B9;{this.props.tenure.interest_pay_to_bank / 100}</>
                        }
                        </div>
                        <div class="validate"><button class="btn btn-green  btn-small"
                            disabled={!isSelected}
                            onClick={this.props.onClickProceedBtn}>Proceed</button></div>
                    </div >
                </div >
            </>
        );
    }


}




export default BuyNowPayLaterTenure;

