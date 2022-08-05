import React from "react";
import { connect } from "react-redux";
import "../../../css/style.css";
import * as PAYMENT_MODE_CONST from "../../../Constants/PaymentModeConstants";
import { EMIType, Cards } from "../EMI";
import SavedCard from "../Card/SavedCard";
import SavedCards from "../EMI/SavedCards";
import $ from "jquery";
import { SetIssuerId } from "../../../stores/actions/EmiDataProcessingAction";
import { SetSelectedEMICardIssuerTenureData } from "../../../stores/actions/EmiDataProcessingAction";
import { CashbackOnFullPayment } from "../CashbackOnFullPayment";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  NavLink
} from "react-router-dom";

import MerchantPaymentDataUtils from "../../../utils/MerchantPaymentDataUtils";
import { SetEMITypeID, SetTenureId } from "../../../stores/actions/EmiDataProcessingAction";

import { SetPaymentAmount, SetRemovedSequenceId } from "../../../stores/actions/PaymentModeAction";

import { Tenure } from ".";
import {
  SESSION_EXPIRES,
  SaveCardRemoval
} from "../../../stores/actions/CommonAction";
import ViewSpecialOfferPopup from "../../UIUtil/ViewSpecialOfferPopup";

class EMI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SelectedEmiTypeId: null,
      isPayWithAnotherEMIType: false,
      isPayWithSaveCardEMIType: false,
      SequenceId: null,
      SavedCardIssuerId: null,
      SavedCardCardTypeId: null,
      // RemovedSeqId: [],
      isSaveCardRemoved: false,
      isViewSpecialOfferPopupShow: false



    };
    this.objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
    this.error = null;
    this.loading = null;
    this.mercantPaymentData = null;
    this.emiInfo = null;
    this.emiCategoriesEmiModelType = null;
    this.SelectedEmiTypeId = null;
    this.isSaveCardToBeShown = false;
    this.IssuerEMIInfo = null
    this.EMISelectedPlan = null;
    this.emiPlanSelectedToBeShown = true;

  }





  GetDefaultEmiTypeId = () => {



    let emiTypeId = this.objMerchantPaymentDataUtils.GetDefaultSelectedEMITypeId(
      this.emiInfo
    );


    if (this.state.isPayWithSaveCardEMIType) {

      emiTypeId = this.objMerchantPaymentDataUtils.GetDefaultSelectedEMITypeId(
        this.IssuerEMIInfo
      );
    }

    if (!emiTypeId || emiTypeId == 0) {
      return;
    }
    return emiTypeId;
  };

  onClickEMITypeNaviagtion = emiTypeId => {
    this.props.dispatch(SetEMITypeID(emiTypeId));
    this.props.dispatch(
      SetPaymentAmount(
        this.objMerchantPaymentDataUtils.GetPaymentAmount(
          this.mercantPaymentData
        )
      )
    );
    // alert("emi" + JSON.stringify(this.props.selected_emi_data));
    // this.setState({
    //   SelectedEmiTypeId: emiTypeId
    // });
  };


  onClickSaveCardEMITypeNaviagtion = emiTypeId => {
    this.props.dispatch(SetEMITypeID(emiTypeId));
    this.props.dispatch(
      SetPaymentAmount(
        this.objMerchantPaymentDataUtils.GetPaymentAmount(
          this.mercantPaymentData
        )
      )
    );
    // alert("emi" + JSON.stringify(this.props.selected_emi_data));
    // this.setState({
    //   SelectedEmiTypeId: emiTypeId
    // });
  };

  onClickPayWithAnotherEMIType = () => {

    this.setState({
      isPayWithAnotherEMIType: true,
      isPayWithSaveCardEMIType: false
    });
    let defaultEMITypeId = this.GetDefaultEmiTypeId();
    this.props.dispatch(SetEMITypeID(defaultEMITypeId));

  }




  onClickWithSaveCardEMIType = () => {

    this.setState({
      isPayWithSaveCardEMIType: true,
      isPayWithAnotherEMIType: false
    });

    let defaultEMITypeId = this.GetDefaultEmiTypeId();

    this.props.dispatch(SetEMITypeID(defaultEMITypeId));
  }


  selectSaveCardHandler = (SequenceId, SavedCardIssuerId, SavedCardCardTypeId,
    SavedCardExpiryMonth, SavedCardExpiryYear) => {



    if (SavedCardExpiryMonth != "00" &&
      !this.SaveCardExpDateValidation(SavedCardExpiryYear, SavedCardExpiryMonth)) {
      $("#showcardtype").attr("disabled", "disabled");
      return;
    }
    else {
      $("#showcardtype").attr("disabled", "disabled");
      this.setState({
        SequenceId: SequenceId,
        SavedCardIssuerId: SavedCardIssuerId,
        SavedCardCardTypeId: SavedCardCardTypeId
      });

      this.props.dispatch(SetIssuerId(SavedCardIssuerId));

      let filteredEMIInfo = this.objMerchantPaymentDataUtils.GetEmiInfoForIssuerId(
        this.mercantPaymentData, SavedCardCardTypeId, SavedCardIssuerId
      );

      if (filteredEMIInfo == null || filteredEMIInfo.length == 0) {

      } else {
        $("#showcardtype").removeAttr("disabled");
      }
    }

  }

  SaveCardExpDateValidation = (year, month) => {
    let d = new Date();
    let m = d.getMonth();
    let y = d.getFullYear();
    if (month === "00") {
      return true;
    }
    if (year < y) {
      return false;
    }
    if (year == y && month < m + 1) {
      return false;
    }
    return true;
  };


  setRemovedSequenceId = SequenceId => {
    this.props.dispatch(SetRemovedSequenceId(SequenceId));
  };
  RemoveSaveCard = (SeqId, callback) => {

    this.props.dispatch(SaveCardRemoval(this.props.token, SeqId))
      .then(response => {
        console.log(response);
        let responseData = response.data;

        if (responseData.response_code == 1) {
          // var arrayvar = [...this.state.RemovedSeqId, SeqId];
          // this.setState({
          //   isSaveCardRemoved: true,
          //   RemovedSeqId: arrayvar
          // })
          this.setRemovedSequenceId(SeqId);

          callback();
        }
        else if (responseData.response_code == -136) {
          this.props.dispatch(SESSION_EXPIRES());
        } else {

        }
      })
      .catch(error => {
        alert("onCardValidation:" + error);
      });
    return;

  }

  onClose = () => {
    this.setState({
      isViewSpecialOfferPopupShow: false
    });
    //this.btn.removeAttribute("disabled");
  };

  ViewSpecialOfferPopup = () => {
    this.setState({
      isViewSpecialOfferPopupShow: true
    });
    //this.btn.removeAttribute("disabled");
  };


  convertLiFromArray = (objArray) => {

    let val =
      (
        (objArray.length == 1)
          ?
          (
            objArray[0]
          )
          :
          (
            <ul>
              {
                objArray.map((obj) => (
                  (
                    <li>
                      {
                        obj
                      }
                    </li>
                  )
                )

                )
              }
            </ul>
          )
      );

    return val;


  }



  componentDidMount() {



    var that = this;
    if (this.isSaveCardToBeShown) {
      $(".bank-card").on('click', function () {
        $(".bank-card").removeClass('active');
        $(this).addClass('active');
        //  $("#showcardtype").removeAttr("disabled");

      });

      $("#showcardtype").on('click', function () {
        $("#showemitype").removeClass('active');
        $("#showcardtype").addClass('active');
        $(this).addClass('active');
        that.onClickWithSaveCardEMIType();

      });


      $("#showemitype").on('click', function () {
        $("#showcardtype").removeClass('active');
        $("#showemitype").addClass('active');
        that.onClickPayWithAnotherEMIType();
      });






    }




    if (!this.props.selected_emi_data.isDefaultSchemeSelected &&
      this.EMISelectedPlan != null && this.EMISelectedPlan.emi_info.length > 0) {

      let emiSelectedTypeId =
        this.objMerchantPaymentDataUtils.GetDefaultSelectedEMITypeId(
          this.EMISelectedPlan.emi_info
        );
      let issuerIdSelected = this.EMISelectedPlan.emi_info[0].emi_category_data[0].issuers[0].issuer_id;

      let tenureIdSelected = this.EMISelectedPlan.emi_info[0].emi_category_data[0].issuers[0].tenures[0].tenure_id;

      let cardTypeIdSelected = this.EMISelectedPlan.emi_info[0].emi_category_data[0].card_category;

      let tenuredata = this.objMerchantPaymentDataUtils.GetTenureDataForTenureId(
        this.mercantPaymentData,
        emiSelectedTypeId,
        cardTypeIdSelected,
        issuerIdSelected,
        tenureIdSelected
      );

      let emiSelectedData = {
        payment_mode: 4,
        emiType: emiSelectedTypeId,
        cardType: cardTypeIdSelected,
        issuerId: issuerIdSelected,
        tenureId: tenureIdSelected,
        paymentAmountForEMI: tenuredata.auth_amount,
        isSaveCardEMIPage: false
      };




      if (tenureIdSelected != "96") {
        //this.props.dispatch(SetTenureId(emiSelectedData));
        // alert("tenure end" + JSON.stringify(this.props.selected_emi_data));
        this.props.dispatch(SetSelectedEMICardIssuerTenureData(emiSelectedData));
        this.props.dispatch(SetPaymentAmount(tenuredata.auth_amount));
      }


    }



  }

  render() {
    const {
      error,
      loading,
      merchant_payment_data,
      selected_emi_data
    } = this.props;
    this.mercantPaymentData = merchant_payment_data;
    let SavedCardData = null;

    this.EMISelectedPlan = this.props.paymentModeId == 4 ? this.objMerchantPaymentDataUtils.GetEMISelectedData(
      this.mercantPaymentData
    ) : null;




    SavedCardData = this.props.paymentModeId == 4 ? this.objMerchantPaymentDataUtils.GetSavedCardDataForPaymentModeId(
      this.props.merchant_payment_data,
      this.props.paymentModeId
    ) : null;







    if (Array.isArray(SavedCardData) && SavedCardData.length > 0) {
      this.isSaveCardToBeShown = true;
      //if (this.state.isSaveCardRemoved) {
      // SavedCardData = SavedCardData.filter(obj => !this.state.RemovedSeqId.includes(obj.sSeqId))
      SavedCardData = SavedCardData.filter(obj => !this.props.RemovedSeqId.includes(obj.sSeqId))

      if (SavedCardData.length === 0) {
        this.isSaveCardToBeShown = false;


      }

      //}
    }




    let emiInfo = this.emiInfo;


    this.emiInfo = emiInfo = this.objMerchantPaymentDataUtils.GetEmiInfo(
      this.mercantPaymentData
    );
    if (!selected_emi_data || !emiInfo) {
      return null;
    }
    this.emiInfo = emiInfo = this.objMerchantPaymentDataUtils.GetEmiInfo(
      this.mercantPaymentData
    );

    let defaultEMITypeId = selected_emi_data.emiType;
    this.emiCategoriesEmiModelType = this.objMerchantPaymentDataUtils.GetAllEmiCategoriesEmiModelType(
      this.mercantPaymentData
    );


    if (!selected_emi_data.emiType || defaultEMITypeId == 4) {
      //get default id
      defaultEMITypeId = this.GetDefaultEmiTypeId();

      this.props.dispatch(SetEMITypeID(defaultEMITypeId));
    }



    const dynamicEmiType = emiInfo.map(obj => {
      return (
        <EMIType
          emi_type_id={obj.emi_category}
          key={obj.emi_category}
          is_selected={defaultEMITypeId == obj.emi_category}
          onClicked={() => this.onClickEMITypeNaviagtion(obj.emi_category)}

        />
      );
    });

    let filteredEMIInfo = this.IssuerEMIInfo = this.objMerchantPaymentDataUtils.GetEmiInfoForIssuerId(
      this.mercantPaymentData, this.state.SavedCardCardTypeId, this.state.SavedCardIssuerId
    );

    let filteredEMIType = null;
    if (filteredEMIInfo != null && filteredEMIInfo.length > 0) {
      filteredEMIType = filteredEMIInfo.map(obj => {
        return (
          <EMIType
            emi_type_id={obj.emi_category}
            key={obj.emi_category}
            is_selected={defaultEMITypeId == obj.emi_category}
            onClicked={() => this.onClickSaveCardEMITypeNaviagtion(obj.emi_category)}

          />
        );
      });
    }



    const isCardPageToBeRender = defaultEMITypeId ? (
      <Cards emi_type_id={defaultEMITypeId} />
    ) : null;



    const isTenurePageToBeRender = defaultEMITypeId ? (
      //  <div class="col-lg-12  emi-plan clearfix">
      <Tenure
        emi_type_id={defaultEMITypeId}
        card_type_id={this.state.SavedCardCardTypeId}
        issuer_id={this.state.SavedCardIssuerId}
        is_call_from_issuer={true}
        isSaveCardEMIPage={this.state.isPayWithSaveCardEMIType}
        sequenceId={this.state.SequenceId}
      />



      //  </div>

    ) : null;


    let isContainsSpecialOffers = this.objMerchantPaymentDataUtils.IsSpecialOfferExistForEMIExcludingCashbackOnFullPayment(emiInfo);
    isContainsSpecialOffers = this.objMerchantPaymentDataUtils.CheckInstantDiscountForEMIForAllProducts(this.mercantPaymentData);
    debugger;
    let viewSpecialCashbackOffers =
      (isContainsSpecialOffers)
        ? (<NavLink
          to="#"
          href="#viewSpecialCashbackOffers"
          className="pull-right btn-blue"
          activeClassName="active"
          role="tab"
          aria-controls="nav-home"
          aria-selected="true"
          onClick={this.ViewSpecialOfferPopup}
        >
          View special offer
        </NavLink>
        )
        : (
          null
        );

    let arrDetailsForSpecialOffers = null
    let listDataForSpecialOffer = null

    if (isContainsSpecialOffers) {

      arrDetailsForSpecialOffers = this.objMerchantPaymentDataUtils.GetSpecialOfferDataForEMIExcludingCashbackOnFullPayment(emiInfo);
      let listSpecialOfferData = this.objMerchantPaymentDataUtils.GetSpecialOfferDataForEMIForAllProducts(merchant_payment_data);
      listDataForSpecialOffer = this.objMerchantPaymentDataUtils.CreateListTagForSpecialOffers(listSpecialOfferData);
      debugger;
      // listDataForSpecialOffer = (
      //   <ul>
      //     {

      //       Object.entries(listSpecialOfferData).forEach(([key, issuerData]) => //{
      //         (
      //           <li>{

      //             <>
      //               <b>key</b>
      //               <ul>
      //                 {issuerData}.length ==1? {(issuerData).map((offerWiseData) => //{
      //                   (offerWiseData.product_wise_special_offer_text != null &&
      //                     offerWiseData.product_wise_special_offer_text.length > 0 ?
      //                     offerWiseData.product_wise_special_offer_text.map(offerData => //{
      //                       (<li>offerData</li>)


      //                       // }
      //                     ) : null

      //                   )
      //                   //}
      //                 )}: null

      //             </ul>
      //             </>}
      //           </li>
      //         )
      //         //}
      //       )


      //     }

      //   </ul>
      // )

      // listDataForSpecialOffer = (

      //   <ul>

      //     {
      //       arrDetailsForSpecialOffers.map((objIssuerWise) => (
      //         <li>
      //           <b>{(objIssuerWise[0])}</b> :
      //           {
      //             (
      //               (objIssuerWise[1].length == 1)
      //                 ?
      //                 (
      //                   this.convertLiFromArray(objIssuerWise[1][0])
      //                 )
      //                 :
      //                 (
      //                   <ul>
      //                     {
      //                       objIssuerWise[1].map((objProd) => (
      //                         (
      //                           <li>
      //                             {
      //                               this.convertLiFromArray(objProd)
      //                             }
      //                           </li>
      //                         )
      //                       )

      //                       )
      //                     }
      //                   </ul>
      //                 )
      //             )
      //           }
      //         </li>

      //       )


      //       )

      //     }


      //   </ul>

      // )
    }


    let modelData =
      (this.state.isViewSpecialOfferPopupShow)
        ? (
          <ViewSpecialOfferPopup listDataForSpecialOffer={listDataForSpecialOffer} onClose={this.onClose} />
        )
        : (null);
    let multiProductsEmiDisclaimer =
      this.emiCategoriesEmiModelType != null && this.emiCategoriesEmiModelType.emiModelType == 2
        && this.emiCategoriesEmiModelType.emiCategories && this.emiCategoriesEmiModelType.emiCategories.length >= 2 ?
        <>
          <span class="text-green fs-11">Please Note: not all Items in your cart may be eligible for No Cost/Low Cost EMI. Please see EMI details for more information.</span>
        </>

        : <></>;

    const emiCardData = <div>
      <h2 className="font-weight-semi-bold">Select EMI type
        {viewSpecialCashbackOffers}
      </h2>
      <section id="emi-type">
        <div className="container">
          <div className="row">
            <div className="col-12 p-0 ">
              <nav>
                <div
                  className="nav nav-tabs nav-fill p-2"
                  id="nav-tab"
                  role="tablist"
                >

                  {!this.isSaveCardToBeShown ? dynamicEmiType
                    : null}

                  {!this.isSaveCardToBeShown ? isCardPageToBeRender
                    : null}

                  {this.state.isPayWithAnotherEMIType && this.isSaveCardToBeShown ? dynamicEmiType : null}
                  {this.state.isPayWithAnotherEMIType &&
                    this.isSaveCardToBeShown ? isCardPageToBeRender : null}

                  {this.state.isPayWithSaveCardEMIType && this.isSaveCardToBeShown ? filteredEMIType : null}
                  {this.state.isPayWithSaveCardEMIType && this.isSaveCardToBeShown ? isTenurePageToBeRender : null}






                </div>
              </nav>

              {multiProductsEmiDisclaimer}
            </div>
          </div>
        </div>
      </section>
    </div>



    return (
      <>
        <div
          id="collapseemi"
          className="card-body "
          data-parent="#accordion"
        >





          {this.isSaveCardToBeShown ? (
            <SavedCards SavedCardData={SavedCardData}
              //  onClickPayWithAnotherEMIType={this.onClickPayWithAnotherEMIType}
              onClickSavedCard={this.selectSaveCardHandler}
              onRemove={this.RemoveSaveCard}
              token={this.props.token}
              ExpiryDateValidation={this.SaveCardExpDateValidation}
              merchant_payment_data={merchant_payment_data}
              IsFullCashback={false}

            />
          ) : emiCardData}

          {this.state.isPayWithAnotherEMIType && this.isSaveCardToBeShown
            ? emiCardData : null}

          {this.state.isPayWithSaveCardEMIType && this.isSaveCardToBeShown
            ? emiCardData : null}

        </div>
        {modelData}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    merchant_payment_data:
      state.merchantPaymentDataFetchingReducer.merchantPaymentData,
    error: state.merchantPaymentDataFetchingReducer.error,
    loading: state.merchantPaymentDataFetchingReducer.loading,
    selected_emi_data:
      state.merchantPaymentDataFetchingReducer.selected_emi_data,
    paymentModeId: state.merchantPaymentDataFetchingReducer.paymentModeId,
    token: state.merchantPaymentDataFetchingReducer.token,
    RemovedSeqId: state.merchantPaymentDataFetchingReducer.RemovedSeqId
  };
};

export default connect(mapStateToProps)(EMI);
