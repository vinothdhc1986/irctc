import React, { Component } from 'react';
import SavedCard from "../Card/SavedCard";
import $ from "jquery";
import { SetSelectedEMICardIssuerTenureData } from '../../../stores/actions/EmiDataProcessingAction';
import MerchantPaymentDataUtils from "../../../utils/MerchantPaymentDataUtils";


class SavedCards extends Component {

    constructor(props) {
        super(props);

        this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();

    }


    render() {

        let SaveCardType;

        let isFullCashback = this.props.IsFullCashback;
        let merchant_payment_data = this.props.merchant_payment_data;
        let IsSavedCardContainsSpecialOffers = false;


        SaveCardType = this.props.SavedCardData.map((obj, index) => {

            IsSavedCardContainsSpecialOffers = false;

            if (isFullCashback) {

                IsSavedCardContainsSpecialOffers = this.objMerchantPaymentDataUtils.
                    IsIssuerIDContainsSpecialOfferForCashbackOnFullPayment
                    (
                        merchant_payment_data,
                        obj.m_iIssuerID
                    )
            }
            else {
                IsSavedCardContainsSpecialOffers = this.objMerchantPaymentDataUtils.
                    IsIssuerIDContainsSpecialOfferForNonCashbackOnFullPayment
                    (
                        merchant_payment_data,
                        obj.m_iIssuerID
                    )
            }

            return (
                <SavedCard cardNumber={obj.strCardNumber} expiryMonth={obj.strExpiryMonth}
                    expiryYear={obj.strExpiryYear} key={obj.sSeqId} MobileNumber={obj.strMobileNumber}
                    onClick={() => this.props.onClickSavedCard(obj.sSeqId, obj.m_iIssuerID, obj.iCardTypeId,
                        obj.strExpiryMonth, obj.strExpiryYear)}
                    onRemove={() => this.props.onRemove(obj.sSeqId, () => {
                        $("#showcardtype").attr("disabled", "disabled");

                    })
                    }
                    token={this.props.token}
                    issuerName={obj.strIssuerName}
                    IsSavedCardContainsSpecialOffers={IsSavedCardContainsSpecialOffers}
                    errorMsg={this.props.ExpiryDateValidation(obj.strExpiryYear, obj.strExpiryMonth) ? "" : "Card Expired"} />


            );
        });

        return (
            <div id="collapsecreditdebit" class="card-body collapse active show" data-parent="#accordion" >
                <div class="col-12 saved-cards">
                    <div class="row">
                        {SaveCardType}
                    </div >
                </div >

                <div class="col-12 pt-3">
                    <h3>Choose another option</h3>
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-6 col-12">
                            <   button id="showemitype" class="border-grey p-3 mb-3"
                            > Pay with another EMI type</button></div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-12"><button id="showcardtype"
                            class="border-grey p-3 mb-3"
                            disabled>
                            Pay with saved card EMI</button></div>
                    </div>
                </div>
            </div >

        );


    }
}


export default SavedCards;