import React from "react";


import { connect } from "react-redux";

import PopUp from "../../HOC/PopUp";

class BNPLTNCDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    onClickedClose = () => { };
    render() {


        return (
            <PopUp onClose={this.props.onClose}>





                <div class="modal-body terms-conditions-panel">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
                        <h2>Bank Offers</h2>

                    </div>


                    <div class="text-left">
                        <ul>
                            <li>Minimum cart amount for availing FlexiPay is 1000 Orders below Rs. 1000/- not to be sent or given FlexiPay option on payment page</li>
                            <li>Maximum cart amount for availing FlexiPay is Rs.10,000/-. Orders above Rs. 10,000/- not to be sent or given FlexiPay option on payment page</li>
                            <li>Tenure Options to be displayed - </li>

                        </ul>
                        <div class="col-6 m-2 table-bdr">
                            <div class="p-2">			15 days = NO COST</div>
                            <div class="bdr-top p-2">	30 days = 28%</div>
                            <div class="bdr-top p-2">	60 days = 28%</div>
                            <div class="bdr-top p-2">	90 days = 28%</div>
                        </div>
                        <ul>
                            <li>NO Extra Cost period has been given as upfront discount to cover for interest charged by the Bank, effectively giving you the benefit of No Extra Cost. Total amount you pay to the Bank will be equal to the price of your order.</li>
                            <li>The Bank will continue to charge interest as per existing rates. This amount excludes GST on interest amount that will be charged by your Bank. </li>
                            <li> Amount to be paid will be debited from your account on the respective due dates.</li>
                        </ul>



                    </div>
                </div>



            </PopUp >
        )
    }
}

const mapStateToProps = state => {
    return {
        sessionExpires: state.merchantPaymentDataFetchingReducer.sessionExpires,
        token: state.merchantPaymentDataFetchingReducer.token
    };
};

export default connect(mapStateToProps)(BNPLTNCDetails);
