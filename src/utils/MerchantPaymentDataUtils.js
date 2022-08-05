import React from "react";
import * as PAYMENT_MODE_CONST from "../Constants/PaymentModeConstants";
class MerchantPaymentDataUtils {
  GetMerchantData = data => {
    let result = null;
    if (data) {
      result = data.merchant_data;
    }
    return result;
  };

  GetPaymentData = data => {
    return data.payment_data;
  };

  GetPaymentModeData = data => {
    return data.payment_mode_data;
  };




  GetCustomerData = data => {
    return data.customer_data;
  };

  GetMerchantTxnId = merchantData => {
    return merchantData.unique_merchant_txn_id;
  };

  GetMerchantLogo = merchantData => {
    return merchantData.merchant_logo;
  };

  GetMerchantId = merchantData => {
    return merchantData.merchant_id;
  };

  GetCustomerId = customerData => {
    if (customerData != null) {
      return customerData.customer_id;
    }
    else {
      return 0;
    }
  };

  GetSavedCardEnabled = merchantData => {
    return merchantData.IsSaveCardEnabled;
  };
  GetPaymentAmount = data => {
    let paymentData = this.GetPaymentData(data);
    // alert(JSON.stringify(paymentData));
    return paymentData.amount_in_paisa;
  };

  GetPaymentModeDataForPaymentModeId = (data, paymentModeId) => {
    let paymentModeData = data.payment_mode_data;
    let Data = paymentModeData.filter(
      obj => obj.payment_mode_id == paymentModeId
    );


    return Data;
  };



  GetSavedCardDataForPaymentModeId = (data, paymentModeId) => {

    let savedCardData = data.customer_saved_details;
    if (savedCardData != null) {
      let Data = savedCardData.filter(
        obj => obj.payment_mode_id == paymentModeId
      );


      //  return Data[0].data;
      if (Data && Data != null && Data.length > 0) {


        // console.log('data : ', data);
        // console.log('saved card', Data[0].data)

        return Data[0].data;


      }
    }
    else {
      return;
    }
  };



  GetEMISelectedData = (data) => {



    let emiSelectedData = data.emi_data_selected;
    if (emiSelectedData != null) {
      return emiSelectedData;
    }

  };

  // GetPaymentAmount = paymentData => {
  //   return paymentData.amount_in_paisa / 100;
  // };

  GetDefaultSelectedPaymentModeID = data => {
    let defaultpaymentModeId = 0;
    let paymentModeData = this.GetPaymentModeData(data);
    if (paymentModeData && paymentModeData.length > 0) {
      let paymentModeInReq = paymentModeData.map(pm => {
        return pm.payment_mode_id
      });
      PAYMENT_MODE_CONST.PAYMENT_MODES_SEQUENCE_PRIORITIES.some(pm => {
        if (paymentModeInReq.indexOf(pm) > -1) {
          defaultpaymentModeId = pm;
          return defaultpaymentModeId;
        }
      });
      //  let data= paymentModeData.filter(
      //     obj => obj.is_default_selected ==true
      //   );
      //   if(data!=null && data.length>0)
      //   {
      //     data[0].payment_mode_id;
      //   }
      // }
    }
    return defaultpaymentModeId;
  };

  GetEmiInfoForIssuerId = (data, cardTypeId, issuerId) => {
    let issuerEmiInfo = null
    let emiInfoData = this.GetEmiInfo(data);
    issuerEmiInfo = emiInfoData.filter(p => p.emi_category_data.some(s => (s.card_category === cardTypeId
      &&
      s.issuers.some(k => k.issuer_id == issuerId))
    ))

    return issuerEmiInfo;
  };



  GetEmiInfo = data => {
    let emiInfo = null;
    let paymentModeData = this.GetPaymentModeData(data);
    if (paymentModeData) {
      let emiData = paymentModeData.filter(
        obj => obj.payment_mode_id === PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
      );
      if (emiData && emiData.length > 0) {
        if (
          emiData[0].data &&
          emiData[0].data.emi_info &&
          emiData[0].data.emi_info.length > 0
        ) {
          emiInfo = emiData[0].data.emi_info;
        }
      }
    }
    return emiInfo;
  };

  GetDefaultSelectedEMITypeId = emiInfoData => {
    //  alert(JSON.stringify(emiInfoData));
    let emiTypeId = null;
    if (emiInfoData) {
      emiTypeId = emiInfoData[0].emi_category;
    }
    return emiTypeId;
  };

  GetAllCardDataForEMIType = (data, emiTypeId) => {
    let allCardDataForEMIType = null;

    let emiInfo = this.GetEmiInfo(data);
    if (emiInfo) {
      let emiTypeData = emiInfo.filter(obj => obj.emi_category === emiTypeId);
      if (
        emiTypeData &&
        emiTypeData.length > 0 &&
        emiTypeData[0].emi_category_data &&
        emiTypeData[0].emi_category_data.length > 0
      ) {
        allCardDataForEMIType = emiTypeData[0].emi_category_data;
      }
    }
    return allCardDataForEMIType;
  };

  GetAllEmiCategoriesEmiModelType = (data) => {
    let allCardDataForEMIType = null;

    let emiInfo = this.GetEmiInfo(data);
    if (emiInfo) {
      let allEmiCategories = emiInfo.map(obj => obj.emi_category);

      return allCardDataForEMIType = { emiCategories: allEmiCategories, emiModelType: this.GetEMIModelTypeId(data) };
    }
  };

  GetDefaultSelectedCardTypeId = allCardDataForEMIType => {
    //  alert(JSON.stringify(allCardDataForEMIType));
    let cardTypeId = null;
    if (allCardDataForEMIType) {
      cardTypeId = allCardDataForEMIType[0].card_category;
    }
    return cardTypeId;
  };

  GetAllIssuersForEMITypeIdCardTypeId = (data, emiTypeId, cardTypeId) => {
    let allIssuersForEMITypeCardType = null;
    let cardsInfo = this.GetAllCardDataForEMIType(data, emiTypeId);

    if (cardsInfo) {
      let cardTypeData = cardsInfo.filter(
        obj => obj.card_category === cardTypeId
      );
      if (
        cardTypeData &&
        cardTypeData.length > 0 &&
        cardTypeData[0].issuers &&
        cardTypeData[0].issuers.length > 0
      ) {
        allIssuersForEMITypeCardType = cardTypeData[0].issuers;
      }
    }
    return allIssuersForEMITypeCardType;
  };

  GetIssuerDataForEMITypeIdCardTypeId = (
    data,
    emiTypeId,
    cardTypeId,
    issuerId
  ) => {
    let issuerData = null;
    let allIssuersData = this.GetAllIssuersForEMITypeIdCardTypeId(
      data,
      emiTypeId,
      cardTypeId
    );
    if (allIssuersData) {
      issuerData = allIssuersData.filter(obj => obj.issuer_id == issuerId)[0];
    }
    return issuerData;
  };

  GetDefaultSelectedIssuerId = allIssuersForEMITypeCardType => {
    let issuerId = null;
    if (allIssuersForEMITypeCardType) {
      issuerId = allIssuersForEMITypeCardType[0].issuer_id;
    }
    return issuerId;
  };

  GetAllTenuresForEMITypeIdCardTypeIdIssuerId = (
    data,
    emiTypeId,
    cardTypeId,
    issuerId
  ) => {
    let allTenuresForEMITypeIdCardTypeIdIssuerId = null;
    let allIssuerForEMITypeIdCardTypeId = this.GetAllIssuersForEMITypeIdCardTypeId(
      data,
      emiTypeId,
      cardTypeId
    );

    if (allIssuerForEMITypeIdCardTypeId) {
      let allIssuers = allIssuerForEMITypeIdCardTypeId.filter(
        obj => obj.issuer_id == issuerId
      );
      if (
        allIssuers != null &&
        allIssuers.length > 0 &&
        allIssuers[0].tenures &&
        allIssuers[0].tenures.length > 0
      ) {
        allTenuresForEMITypeIdCardTypeIdIssuerId = allIssuers[0].tenures;
      }
    }
    return allTenuresForEMITypeIdCardTypeIdIssuerId;
  };

  GetDefaultSelectedTenureId = allTenureForIssuer => {
    let tenureId = null;
    if (allTenureForIssuer) {
      tenureId = allTenureForIssuer[0].tenure_id;
    }
    return tenureId;
  };
  GetTenureDataForTenureId = (
    data,
    emiTypeId,
    cardTypeId,
    issuerId,
    tenureId
  ) => {
    let allTenureForIssuer = this.GetAllTenuresForEMITypeIdCardTypeIdIssuerId(
      data,
      emiTypeId,
      cardTypeId,
      issuerId
    );
    let tenureData = allTenureForIssuer.filter(
      obj => obj.tenure_id == tenureId
    );
    if (
      tenureData == null ||
      tenureData == undefined ||
      tenureData.length == 0 ||
      !tenureData[0]
    ) {
      tenureData = null;
    }
    return tenureData[0];
  };

  GetTenureData = (allTenureForIssuer, tenureId) => {
    let tenureData = allTenureForIssuer.filter(
      obj => obj.tenure_id == tenureId
    );
    if (
      tenureData == null ||
      tenureData == undefined ||
      tenureData.length == 0 ||
      !tenureData[0]
    ) {
      tenureData = null;
      return tenureData;
    }
    return tenureData[0];
  };

  GetPaymentAmountUIForEMI = (
    data,
    emiModelType,
    allTenuresForIssuer,
    tenureId
  ) => {
    let paymentAmountUI = this.GetPaymentAmount(data);

    let tenureData = this.GetTenureData(allTenuresForIssuer, tenureId);
    // alert(JSON.stringify(tenureData));
    if (tenureData) {
      if (emiModelType == 2) {
        paymentAmountUI =
          paymentAmountUI - tenureData.total_offerred_discount_cashback_amount;
      }
    }
    return paymentAmountUI;
  };

  GetEMIModelTypeId = data => {
    let paymentModeData = this.GetPaymentModeData(data);
    return paymentModeData.filter(
      obj => obj.payment_mode_id === PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
    )[0].data.emi_model_type;
  };

  IsIssuerContainsSpecialOffer = issuerData => {
    let isContains = false;
    if (issuerData.tenures != null) {
      issuerData.tenures.map((tenure) => {
        isContains = (isContains) || this.IsTenureContainsSpecialOffer(tenure);
        if (isContains)
          return isContains;
      }
      );

    }
    return isContains;
  };

  IsTenureContainsSpecialOffer = tenure => {
    let isContains = false;
    let specialOfferNode = null;
    if (tenure.offer_scheme != null && tenure.offer_scheme.product_details != null) {
      tenure.offer_scheme.product_details.map((prodDetail) => {

        specialOfferNode = this.GetSpecialOfferNode(prodDetail);
        if (specialOfferNode != null || specialOfferNode != undefined) {
          isContains = true;
          return isContains;
        }
      }
      );

    }

    return isContains;
  };



  IsSpecialOfferExistForCashbackOnFullPayment = merchant_payment_data => {
    let isSpecialOffersToBeShownForFullCashback = false;

    merchant_payment_data.payment_mode_data.map(obj => {
      if (
        obj.payment_mode_id == PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
        && obj.data != null
        //&& obj.data.emi_model_type == 1
        && obj.data.emi_info != null
      ) {
        obj.data.emi_info.map((criteria) => {
          if (criteria.emi_category == 4) {

            if (criteria.emi_category_data != null) {
              criteria.emi_category_data.map((emiCatData) => {
                if (emiCatData.issuers != null) {
                  emiCatData.issuers.map((issuerobj) => {
                    if (issuerobj.tenures != null) {
                      issuerobj.tenures.map((tenureobj) => {
                        if (tenureobj.tenure_id == 96) {
                          isSpecialOffersToBeShownForFullCashback = (isSpecialOffersToBeShownForFullCashback) || this.IsTenureContainsSpecialOffer(tenureobj);
                          if (isSpecialOffersToBeShownForFullCashback == true) {
                            return isSpecialOffersToBeShownForFullCashback;
                          }
                          //return;
                        }
                      });
                    }
                  });
                }

              });
            }
            //isPaymentCashbackOnFullPaymentExist = true;
            //return;
            //return true;
          }
        });
      }
    });

    //console.log('isSpecialOffersToBeShownForFullCashback : ' + isSpecialOffersToBeShownForFullCashback);
    return isSpecialOffersToBeShownForFullCashback;
  };


  GetSpecialOfferDataForCashbackOnFullPayment = emiInfo => {
    let specialOfferNodes = [];

    let node = "";
    let card = "";
    let issuername = "";
    let tenureWiseArrayDetails = [];
    let arrProdSpecialOffersDetails = [];
    let arrIssuerWiseDetails = [];

    emiInfo.map((criteria) => {
      if (criteria.emi_category == 4) {

        if (criteria.emi_category_data != null) {
          criteria.emi_category_data.map((emiCatData) => {

            if (emiCatData.card_category == 1) {
              card = "Credit Card";
            }
            else if (emiCatData.card_category == 2) {
              card = "Card";
            }

            if (emiCatData.issuers != null) {
              emiCatData.issuers.map((issuerobj) => {
                arrIssuerWiseDetails = [];
                issuername = issuerobj.issuer_name;


                if (issuerobj.tenures != null) {
                  issuerobj.tenures.map((tenureobj) => {
                    if (tenureobj.tenure_id == 96) {
                      tenureWiseArrayDetails = [];
                      //tenureobj = issuerobj.tenures[0];
                      {
                        arrProdSpecialOffersDetails = [];

                        if (tenureobj.offer_scheme != null && tenureobj.offer_scheme.product_details != null) {
                          tenureobj.offer_scheme.product_details.map((prodDetail) => {
                            node = this.GetSpecialOfferNode(prodDetail);
                            if (node != null || node != undefined) {
                              // arrProdSpecialOffersDetails.push(issuername + " " + card + " : " + node);
                              //arrProdSpecialOffersDetails.push(issuername + " " + card );
                              arrProdSpecialOffersDetails.push(node);
                            }
                          });

                        }
                      }

                      if (arrProdSpecialOffersDetails.length > 0) {
                        tenureWiseArrayDetails.push(arrProdSpecialOffersDetails);
                      }

                    }
                  });
                }


                if (tenureWiseArrayDetails.length > 0) {
                  arrIssuerWiseDetails.push(issuername + " " + card);
                  arrIssuerWiseDetails.push(tenureWiseArrayDetails);

                  specialOfferNodes.push(arrIssuerWiseDetails);
                }
                // specialOfferNodes.push(issuername + " " + card);
                // specialOfferNodes.push(tenureWiseArrayDetails);
              });
            }

          });
        }
        //isPaymentCashbackOnFullPaymentExist = true;
        //return;
        //return true;
      }
    });

    //console.log('isSpecialOffersToBeShownForFullCashback : ' + isSpecialOffersToBeShownForFullCashback);
    return specialOfferNodes;
  };


  IsSpecialOfferExistForEMIExcludingCashbackOnFullPayment = emiInfo => {
    let IsSpecialOfferExistForEMIExcludingCashbackOnFullPayment = false;

    emiInfo.map((criteria) => {
      if (criteria.emi_category != 4) {

        if (criteria.emi_category_data != null) {
          criteria.emi_category_data.map((emiCatData) => {
            if (emiCatData.issuers != null) {
              emiCatData.issuers.map((issuerobj) => {
                if (issuerobj.tenures != null) {
                  issuerobj.tenures.map((tenureobj) => {
                    IsSpecialOfferExistForEMIExcludingCashbackOnFullPayment = (IsSpecialOfferExistForEMIExcludingCashbackOnFullPayment) || (this.IsTenureContainsSpecialOffer(tenureobj));
                    if (IsSpecialOfferExistForEMIExcludingCashbackOnFullPayment == true) {
                      return IsSpecialOfferExistForEMIExcludingCashbackOnFullPayment;
                    }
                  });
                }
              });
            }

          });
        }
      }
    });

    return IsSpecialOfferExistForEMIExcludingCashbackOnFullPayment;
  };

  GetSpecialOfferDataForEMIExcludingCashbackOnFullPayment = emiInfo => {
    let specialOfferNodes = [];

    let node = "";
    let card = "";
    let issuername = "";
    let tenureWiseArrayDetails = [];
    let arrProdSpecialOffersDetails = [];
    let arrIssuerWiseDetails = [];
    let tenureobj;

    emiInfo.map((criteria) => {
      if (criteria.emi_category != 4) {

        if (criteria.emi_category_data != null) {
          criteria.emi_category_data.map((emiCatData) => {

            if (emiCatData.card_category == 1) {
              card = "Credit Card";
            }
            else if (emiCatData.card_category == 2) {
              card = "Card";
            }

            if (emiCatData.issuers != null) {
              emiCatData.issuers.map((issuerobj) => {
                arrIssuerWiseDetails = [];
                issuername = issuerobj.issuer_name;


                if (issuerobj.tenures != null && issuerobj.tenures.length > 0) {
                  tenureWiseArrayDetails = [];

                  // issuerobj.tenures.map((tenureobj) => {
                  tenureobj = issuerobj.tenures[0];
                  arrProdSpecialOffersDetails = [];

                  if (tenureobj.offer_scheme != null && tenureobj.offer_scheme.product_details != null) {
                    tenureobj.offer_scheme.product_details.map((prodDetail) => {
                      node = this.GetSpecialOfferNode(prodDetail);
                      if (node != null || node != undefined) {
                        arrProdSpecialOffersDetails.push(node);
                      }
                    });

                  }
                  if (arrProdSpecialOffersDetails.length > 0) {
                    tenureWiseArrayDetails.push(arrProdSpecialOffersDetails);
                  }

                  // });
                }


                if (tenureWiseArrayDetails.length > 0) {
                  arrIssuerWiseDetails.push(issuername + " " + card);
                  arrIssuerWiseDetails.push(tenureWiseArrayDetails);

                  specialOfferNodes.push(arrIssuerWiseDetails);
                }
                // specialOfferNodes.push(issuername + " " + card);
                // specialOfferNodes.push(tenureWiseArrayDetails);
              });
            }

          });
        }

      }
    });

    // console.log('specialOfferNodes', specialOfferNodes);

    return specialOfferNodes;
  };




  GetSpecialOfferNode = prodDetail => {

    let specialOfferNode = null;

    // if (prodDetail.product_discount != undefined) {
    //   specialOfferNode = prodDetail.product_discount;
    // }

    if (
      prodDetail.special_offer_cashback != null
      && prodDetail.special_offer_cashback != undefined
      && prodDetail.special_offer_cashback != ""
    ) {
      specialOfferNode = prodDetail.special_offer_cashback;
    }

    return specialOfferNode;
  };

  ReturnIfEMIContainsOnlyFullCashback = merchant_payment_data => {

    let isPaymentCashbackOnFullPaymentExist = false;
    let isWithoutPaymentCashbackOnFullPaymentExist = false;

    merchant_payment_data.payment_mode_data.map(obj => {
      if (
        obj.payment_mode_id == PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
        && obj.data != null
        //&& obj.data.emi_model_type == 1
        && obj.data.emi_info != null
      ) {
        obj.data.emi_info.map((criteria) => {
          if (criteria.emi_category_data != null) {
            criteria.emi_category_data.map((emiCatData) => {
              if (emiCatData.issuers != null) {
                emiCatData.issuers.map((issuerobj) => {
                  if (issuerobj.tenures != null) {
                    issuerobj.tenures.map((tenureobj) => {
                      if (criteria.emi_category == 4 && tenureobj.tenure_id == 96) {
                        isPaymentCashbackOnFullPaymentExist = true;

                      }
                      else if (criteria.emi_category != 4) {
                        isWithoutPaymentCashbackOnFullPaymentExist = true;
                      }

                    });
                  }
                });
              }

            });
          }
          //isPaymentCashbackOnFullPaymentExist = true;
          //return;
          //return true;
        });
      }
    });


    if (isPaymentCashbackOnFullPaymentExist == true && isWithoutPaymentCashbackOnFullPaymentExist == false) {
      return true;
    }
    else {
      return false;
    }

  }


  IsIssuerIDContainsSpecialOfferForCashbackOnFullPayment = (merchant_payment_data, searchedIssuerID) => {
    let isSpecialOffersToBeShownForFullCashback = false;

    merchant_payment_data.payment_mode_data.map(obj => {
      if (
        obj.payment_mode_id == PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
        && obj.data != null
        //&& obj.data.emi_model_type == 1
        && obj.data.emi_info != null
      ) {
        obj.data.emi_info.map((criteria) => {
          if (criteria.emi_category == 4) {

            if (criteria.emi_category_data != null) {
              criteria.emi_category_data.map((emiCatData) => {
                if (emiCatData.issuers != null) {
                  emiCatData.issuers.map((issuerobj) => {
                    if (issuerobj.tenures != null && issuerobj.issuer_id == searchedIssuerID) {
                      issuerobj.tenures.map((tenureobj) => {
                        if (tenureobj.tenure_id == 96) {
                          isSpecialOffersToBeShownForFullCashback = (isSpecialOffersToBeShownForFullCashback) || this.IsTenureContainsSpecialOffer(tenureobj);
                          if (isSpecialOffersToBeShownForFullCashback == true) {
                            return isSpecialOffersToBeShownForFullCashback;
                          }
                          //return;
                        }
                      });
                    }
                  });
                }

              });
            }

          }
        });
      }
    });

    return isSpecialOffersToBeShownForFullCashback;
  };


  IsIssuerIDContainsSpecialOfferForNonCashbackOnFullPayment = (merchant_payment_data, searchedIssuerID) => {
    let isSpecialOffersToBeShownForNonFullCashback = false;

    merchant_payment_data.payment_mode_data.map(obj => {
      if (
        obj.payment_mode_id == PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
        && obj.data != null
        //&& obj.data.emi_model_type == 1
        && obj.data.emi_info != null
      ) {
        obj.data.emi_info.map((criteria) => {
          if (criteria.emi_category != 4) {

            if (criteria.emi_category_data != null) {
              criteria.emi_category_data.map((emiCatData) => {
                if (emiCatData.issuers != null) {
                  emiCatData.issuers.map((issuerobj) => {
                    if (issuerobj.tenures != null && issuerobj.issuer_id == searchedIssuerID) {
                      issuerobj.tenures.map((tenureobj) => {
                        isSpecialOffersToBeShownForNonFullCashback = (isSpecialOffersToBeShownForNonFullCashback) || this.IsTenureContainsSpecialOffer(tenureobj);
                        if (isSpecialOffersToBeShownForNonFullCashback == true) {
                          return isSpecialOffersToBeShownForNonFullCashback;
                        }
                      });
                    }
                  });
                }

              });
            }

          }
        });
      }
    });

    return isSpecialOffersToBeShownForNonFullCashback;
  };

  GetSpecialOfferDataForFullPaymentWithCashbackForAllProducts = (merchant_payment_data) => {
    let specialEmiOfferNodeData = null;
    merchant_payment_data.payment_mode_data.map(obj => {
      if (
        obj.payment_mode_id == PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
        && obj.data != null
        //&& obj.data.emi_model_type == 1
        && obj.data.special_offers_full_payment_with_cashback != null) {
        specialEmiOfferNodeData = obj.data.special_offers_full_payment_with_cashback.issuer_wise_special_offer_list;
      }

    });
    return specialEmiOfferNodeData;
  }

  GetSpecialOfferDataForEMIForAllProducts = (merchant_payment_data) => {
    let specialEmiOfferNodeData = null;
    merchant_payment_data.payment_mode_data.map(obj => {
      if (
        obj.payment_mode_id == PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
        && obj.data != null
        //&& obj.data.emi_model_type == 1
        && obj.data.emi_special_offers != null) {
        specialEmiOfferNodeData = obj.data.emi_special_offers.issuer_wise_special_offer_list;
      }

    });
    return specialEmiOfferNodeData;
  }

  CheckInstantDiscountForEMIForAllProducts = (merchant_payment_data) => {
    let instantDiscountIssuerWise = null;
    merchant_payment_data.payment_mode_data.map(obj => {
      if (
        obj.payment_mode_id == PAYMENT_MODE_CONST.PAYMENT_MODE_EMI
        && obj.data != null
        //&& obj.data.emi_model_type == 1
        && obj.data.emi_special_offers != null) {
        if (obj.data.emi_special_offers.issuer_wise_special_offer_list && obj.data.emi_special_offers.issuer_wise_special_offer_list != null) {
          instantDiscountIssuerWise = Object.keys(obj.data.emi_special_offers.issuer_wise_special_offer_list).map(key => {
            let issuerData = obj.data.emi_special_offers.issuer_wise_special_offer_list[key];
            (issuerData).map((offerWiseData) => {
              if (offerWiseData.instant_discount_amount_wise != null &&
                offerWiseData.instant_discount_amount_wise.length > 0) {
                return offerWiseData.instant_discount_amount_wise;
              }
            })

          })
        }
      }

    });
    return instantDiscountIssuerWise && instantDiscountIssuerWise.length > 0 ? true : false;
  }

  CreateListTagForSpecialOffers = (specialOfferNodeData) => {
    if (specialOfferNodeData == null) {
      return;
    }
    let data = (
      <ul>
        {
          Object.keys(specialOfferNodeData).map(key => {
            // <option value={key}>{tifs[key]}</option>
            let issuerData = specialOfferNodeData[key];
            //Object.entries(specialOfferNodeData).forEach(([key, issuerData]) => {
            // console.log("CreateListTagForSpecialOffers" + `${key} ${issuerData}`);
            // alert(JSON.stringify(issuerData))

            return (
              <li>
                <b>{issuerData[0].issuer_name}</b>
                {

                  issuerData.length == 1 ? (issuerData).map((offerWiseData) => {
                    return <ul>{offerWiseData.product_wise_special_offer_text != null &&
                      offerWiseData.product_wise_special_offer_text.length > 0 ?
                      offerWiseData.product_wise_special_offer_text.map(offerData => {
                        return (<li>{offerData}</li>)
                      }) : offerWiseData.instant_discount_amount_wise != null &&
                        offerWiseData.instant_discount_amount_wise.length > 0 ?
                        offerWiseData.instant_discount_amount_wise.map(offerData => {
                          return (<li>{offerData}</li>)
                        }) : null}</ul>



                  }
                  ) : (issuerData).map((offerWiseData) => {
                    if (offerWiseData.product_wise_special_offer_text != null &&
                      offerWiseData.product_wise_special_offer_text.length > 0) {
                      return <ul>{
                        offerWiseData.product_wise_special_offer_text.map(offerData => {
                          return (<li>{offerData}</li>)
                        })}</ul>
                    }
                    else if (offerWiseData.instant_discount_amount_wise != null &&
                      offerWiseData.instant_discount_amount_wise.length > 0) {
                      return <ul>{
                        offerWiseData.instant_discount_amount_wise.map(offerData => {
                          return (<li>{offerData}</li>)
                        })}</ul>
                    }
                    else {
                      return <ul>
                        {

                          offerWiseData.special_offer_type == 1 ?
                            <li><b>Cashback </b>
                              <ul>
                                {
                                  offerWiseData.product_wise_special_offer_text != null &&
                                    offerWiseData.product_wise_special_offer_text.length > 0 ?
                                    offerWiseData.product_wise_special_offer_text.map(offerData => {
                                      return (<li>{offerData}</li>)
                                    }) : null
                                }
                              </ul>
                            </li>

                            : <li><b>Discount</b>
                              <ul>
                                {
                                  offerWiseData.product_wise_special_offer_text != null &&
                                    offerWiseData.product_wise_special_offer_text.length > 0 ?
                                    offerWiseData.product_wise_special_offer_text.map(offerData => {
                                      return (<li>{offerData}</li>)
                                    }) : null
                                }
                              </ul>
                            </li>

                        }
                      </ul>
                    }


                  }
                  )



                }


                <br />
              </li>
            )


          })
        }

      </ul>
    )


    return data;
  }





}
export default MerchantPaymentDataUtils;
