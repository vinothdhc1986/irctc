import * as CONSTANTS from "../../Constants/DispctaherActionTypeNamesConstant";
import HttpApiUtil from "../../ApiUtils/HttpApiUtil";
//import { MERCHANT_CODE } from "../../Constants/ResponseCodesConstant";
import MERCHANT_CODE from "../../images/data/merchant_code.json";
import { data } from "jquery";

const ObjHttpApiUtil = new HttpApiUtil();
export const FETCHING_MERCHANT_PAYMENT_DATA_BEGINS = () => ({
  type: CONSTANTS.FETCHING_MERCHANT_PAYMENT_DATA_BEGINS
});

export const FETCHING_MERCHANT_PAYMENT_DATA_SUCCESS = (data, token) => ({
  type: CONSTANTS.FETCHING_MERCHANT_PAYMENT_DATA_SUCCESS,
  merchantPaymentData: { data, token }
});

export const FETCHING_MERCHANT_PAYMENT_IRCTC_DATA_SUCCESS = (data) => ({
  type: CONSTANTS.FETCHING_MERCHANT_PAYMENT_IRCTC_DATA_SUCCESS,
  isIRCTC: data
});

export const FETCHING_MERCHANT_PAYMENT_DATA_FAILURE = error => ({
  type: CONSTANTS.FETCHING_MERCHANT_PAYMENT_DATA_FAILURE,
  error: { error }
});

export function fetchMerchantPayMentDataFromAPI(token) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.FetchMerchantPaymentData(token)
      .then(json => {
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_SUCCESS(json.data.data, token));
        MERCHANT_CODE.map(data => {
          if(data.id===1)
          {
            if(json.data.data.merchant_data.merchant_id===data.value){
               dispatch(FETCHING_MERCHANT_PAYMENT_IRCTC_DATA_SUCCESS(true))
            }else{    
              dispatch(FETCHING_MERCHANT_PAYMENT_IRCTC_DATA_SUCCESS(false))
            }
          }
          
        })
       
        return json.data.data;
        // return GetMerchantPaymentData("harsh")
        // alert(JSON.stringify(json.data.data));
        // alert(JSON.stringify(json));
        // dispatch(FETCHING_MERCHANT_PAYMENT_DATA_SUCCESS(json.data.data, token));
        //alert(JSON.stringify(json.data.data));
        //return json.data.data;
      })
      .catch(error => {
        //alert("ondis:" + error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
      });
  };
}

function GetMerchantPaymentData(token) {
  return new Promise(resolve => {
    // Resolve after a timeout so we can see the loading indicator
    setTimeout(
      () =>
        resolve({
          data: {
            merchant_data: {
              merchant_id: 3413,
              merchant_access_code: "1c295f88-4477-4cd3-b5ac-e76148545a3e",
              merchant_return_url:
                "http://localhost:53132/ChargingRespnew.aspx",
              unique_merchant_txn_id: "fdsfsd4fdsfsdfs3rdf",
              MerchantReturnUrlId: 0,
              arrProgramType: [105, 106, 110, 109, 101, 103, 112, 112],
              EMIModelTypeId: 1,
              IsDynamicRoutingEnabled: false
            },
            customer_data: {
              mobile_no: "9582492891",
              email_id: "abcd@gmail.com",
              first_name: "harsh",
              last_name: "kumar",
              customer_id: "CUST_12",
              billing_data: {
                address1: "h no 15",
                address2: "h no 16",
                address3: "h no 17",
                pincode: "123456",
                city: "noida",
                state: "up",
                country: "india"
              },
              shipping_data: {
                first_name: "harsh",
                last_name: "kumar",
                mobile_no: "1234567890",
                address1: "h no 15",
                address2: "h no 16",
                address3: "h no 17",
                pincode: "123456",
                city: "noida",
                state: "up",
                country: "india"
              }
            },
            payment_data: {
              amount_in_paisa: 550000
            },
            card_data: null,
            emi_data: {
              tenure_id: 0,
              offer_scheme: null,
              loan_amount: 0,
              auth_amount: 0,
              monthly_installment: 0,
              bank_interest_rate: 0,
              interest_pay_to_bank: 0,
              total_offerred_discount_cashback_amount: 0,
              dictMerchantRuleProgram: {
                "106": {
                  m_iRuleId: 1166,
                  m_iRuleTypeId: 106,
                  m_ptrAssociatedRule: {
                    m_iRuleId: 1166,
                    m_sRuleTypeId: 106,
                    m_OleDTRuleApplicabilityDate: "2017-10-24T11:30:31",
                    m_OleDTRuleExpiryDate: "2022-10-24T11:13:31",
                    m_iRwdDefaultServerCommPercentage: 1166,
                    m_iRwdDefaultServerFixedComminPaise: 0,
                    m_iMeDefaultCommPercentage: 0,
                    m_iMeDefaultFixedComminPaise: 0,
                    m_OleDTRowUpdationDateTime: "2019-12-31T13:06:50",
                    m_OleDTRowInsertionDateTime: "2017-10-24T11:26:49",
                    m_iRowActionCount: 25,
                    m_csRuleFileName: "addoncashbackrule.xml",
                    m_iChangeNumber: 0,
                    m_iMaxRuleApplicablityPerCardCount: 1000,
                    m_listAllSchemasIds: [
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 3454,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-31T13:06:50",
                        oledtRowInsertionDateTime: "2019-12-31T13:06:50",
                        sRowActionCount: 1
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 3434,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-31T13:06:50",
                        oledtRowInsertionDateTime: "2019-12-04T15:59:48",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 3398,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-31T13:06:50",
                        oledtRowInsertionDateTime: "2019-09-20T13:11:44",
                        sRowActionCount: 5
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 3397,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-31T13:06:50",
                        oledtRowInsertionDateTime: "2019-07-15T12:59:20",
                        sRowActionCount: 6
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 3393,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-31T13:06:50",
                        oledtRowInsertionDateTime: "2018-12-27T09:08:33",
                        sRowActionCount: 9
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 3392,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-31T13:06:50",
                        oledtRowInsertionDateTime: "2018-12-06T14:35:28",
                        sRowActionCount: 10
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 2397,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-31T13:06:50",
                        oledtRowInsertionDateTime: "2018-04-23T14:30:08",
                        sRowActionCount: 11
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 1392,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-31T13:06:50",
                        oledtRowInsertionDateTime: "2018-04-04T13:08:08",
                        sRowActionCount: 13
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 2396,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-31T13:06:50",
                        oledtRowInsertionDateTime: "2018-04-23T14:30:08",
                        sRowActionCount: 11
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 2395,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-31T13:06:50",
                        oledtRowInsertionDateTime: "2018-04-23T14:30:08",
                        sRowActionCount: 11
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 3433,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-04T15:59:48",
                        oledtRowInsertionDateTime: "2019-12-04T15:42:45",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 3418,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2019-12-04T15:42:45",
                        oledtRowInsertionDateTime: "2019-10-14T18:20:57",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 2394,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2018-04-23T14:30:08",
                        oledtRowInsertionDateTime: "2018-04-23T10:22:06",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 2393,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2018-04-23T14:30:08",
                        oledtRowInsertionDateTime: "2018-04-23T10:22:05",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 2392,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2018-04-23T14:30:08",
                        oledtRowInsertionDateTime: "2018-04-23T10:22:05",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 1388,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2018-04-23T10:22:06",
                        oledtRowInsertionDateTime: "2018-02-06T21:00:10",
                        sRowActionCount: 7
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 1381,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2018-04-23T10:22:05",
                        oledtRowInsertionDateTime: "2017-11-09T16:01:40",
                        sRowActionCount: 10
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 1385,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2018-04-23T10:22:05",
                        oledtRowInsertionDateTime: "2017-12-12T15:59:08",
                        sRowActionCount: 8
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 1382,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2018-04-04T13:08:08",
                        oledtRowInsertionDateTime: "2017-11-09T16:01:40",
                        sRowActionCount: 9
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 1383,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2017-12-12T15:59:07",
                        oledtRowInsertionDateTime: "2017-11-09T16:03:10",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 1380,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2017-11-09T16:03:10",
                        oledtRowInsertionDateTime: "2017-11-09T16:01:40",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 1377,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2017-11-09T16:01:40",
                        oledtRowInsertionDateTime: "2017-11-09T15:57:38",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 1376,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2017-11-09T16:01:40",
                        oledtRowInsertionDateTime: "2017-11-09T15:57:38",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 1375,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2017-11-09T16:01:40",
                        oledtRowInsertionDateTime: "2017-11-09T15:57:37",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 295,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2017-11-09T15:57:38",
                        oledtRowInsertionDateTime: "2017-10-24T11:26:50",
                        sRowActionCount: 3
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 294,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2017-11-09T15:57:38",
                        oledtRowInsertionDateTime: "2017-10-24T11:26:50",
                        sRowActionCount: 3
                      },
                      {
                        iRuleId: 1166,
                        iSchemaRowId: 293,
                        oledtRuleStartDateTime: "2017-10-24T11:30:31",
                        oledtRuleEndDateTime: "2022-10-24T11:13:31",
                        oledtRowUpdationDateTime: "2017-11-09T15:57:37",
                        oledtRowInsertionDateTime: "2017-10-24T11:26:50",
                        sRowActionCount: 3
                      }
                    ],
                    m_mapAllSchemas: {
                      "1392": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 1392,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 100000,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 1000,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 900000000,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 1000,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 1000,
                            m_sCashbackType: 1,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 110000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 12000,
                            m_csAdditionalCashBack:
                              "Hi there is additional casback of rs 100",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 1100,
                            m_llMaxTxnAmountPaise: 999000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "96": {
                            m_iSchemaId: 1392,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 1,
                            m_iCustomerProcessingFeePercentage: 0,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 0,
                            m_iMerchantOfferedDiscountCashbackPercentage: 100000,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 1000,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 990000000,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 1000,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 990000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 11000,
                            m_sCashbackType: 1,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 1000,
                            m_csAdditionalCashBack:
                              "Hi there is additional casback of rs 100",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "NoEMIOnlyCashbck",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 96,
                            m_llMinTxnAmountPaise: 1111,
                            m_llMaxTxnAmountPaise: 999000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "2395": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 2395,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 2,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 900000000,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100000,
                            m_sCashbackType: 3,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100000,
                            m_csAdditionalCashBack:
                              "Hi there is additional casback of rs 100",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 11000,
                            m_llMaxTxnAmountPaise: 999000000,
                            m_bIsInstantDiscountNoCostEMI: true
                          },
                          "6": {
                            m_iSchemaId: 2395,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 0,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 0,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 990000000,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999999900,
                            m_llMinAllowedTotalDiscountCashbackAmount: 200000,
                            m_sCashbackType: 3,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 200000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 200000,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 1000,
                            m_llMaxTxnAmountPaise: 110000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "96": {
                            m_iSchemaId: 2395,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 1,
                            m_iCustomerProcessingFeePercentage: 0,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 0,
                            m_iMerchantOfferedDiscountCashbackPercentage: 100000,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 1000,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 900000000,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 1000,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 990000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 11000,
                            m_sCashbackType: 1,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 110000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 1000,
                            m_csAdditionalCashBack:
                              "Hiiiii there is additional casback of rs 100",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "NoEMIOnlyCashbck",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 96,
                            m_llMinTxnAmountPaise: 1111,
                            m_llMaxTxnAmountPaise: 990000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "2396": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 2396,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 100000,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 1000,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 900000000,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 100,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 990000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100000,
                            m_sCashbackType: 3,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100000,
                            m_csAdditionalCashBack:
                              "Hi there is additional casback of rs 100",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 1000,
                            m_llMaxTxnAmountPaise: 999000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "96": {
                            m_iSchemaId: 2396,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 1,
                            m_iCustomerProcessingFeePercentage: 0,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 0,
                            m_iMerchantOfferedDiscountCashbackPercentage: 100000,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 1000,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 900000000,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 1000,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 11100,
                            m_sCashbackType: 1,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 110000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 1000,
                            m_csAdditionalCashBack:
                              "Hi there is additional casback of rs 100",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "NoEMIOnlyCashbck",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 96,
                            m_llMinTxnAmountPaise: 10000,
                            m_llMaxTxnAmountPaise: 999000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "2397": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 2397,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999999000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100000,
                            m_sCashbackType: 3,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100000,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 1000,
                            m_llMaxTxnAmountPaise: 999999900,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "6": {
                            m_iSchemaId: 2397,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999900000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 200000,
                            m_sCashbackType: 1,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 200000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 200000,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 1000,
                            m_llMaxTxnAmountPaise: 999990000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "96": {
                            m_iSchemaId: 2397,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 1,
                            m_iCustomerProcessingFeePercentage: 0,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 0,
                            m_iMerchantOfferedDiscountCashbackPercentage: 100000,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 100,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 111111000,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 1000,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999999900,
                            m_llMinAllowedTotalDiscountCashbackAmount: 7000,
                            m_sCashbackType: 1,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 110000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 3000,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "NoEMIOnlyCashbck",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 96,
                            m_llMinTxnAmountPaise: 120,
                            m_llMaxTxnAmountPaise: 999900000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3392": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3392,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 30000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 30000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 0,
                            m_llMinAllowedTotalDiscountCashbackAmount: 0,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 2,
                            m_iTotalOfferedDiscountCashbackPercentage: 0,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 0,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "6": {
                            m_iSchemaId: 3392,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 0,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 0,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 0,
                            m_llMinAllowedTotalDiscountCashbackAmount: 0,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 11,
                            m_iGraphicImageIdFooter: 11,
                            m_iTotalOfferedDiscountCashbackPercentage: 0,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 0,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 110000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 0
                      },
                      "3393": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3393,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 10000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 0,
                            m_llMinAllowedTotalDiscountCashbackAmount: 0,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 124231,
                            m_iGraphicImageIdFooter: 123412341,
                            m_iTotalOfferedDiscountCashbackPercentage: 0,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 0,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3397": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3397,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 10000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 40000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 10000,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 10000,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 199999999,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 100,
                            m_iIssuerOfferedDiscountCashbackPercentage: 10000,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 100000,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 199999999,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 100,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999999999,
                            m_llMinAllowedTotalDiscountCashbackAmount: 10100,
                            m_sCashbackType: 3,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 321000,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 10000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 1000,
                            m_iAssociationOfferedCashbackPercentage: 10000,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 10000,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 999999999,
                            m_bIsInstantDiscountNoCostEMI: true
                          },
                          "6": {
                            m_iSchemaId: 3397,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999999999,
                            m_llMinAllowedTotalDiscountCashbackAmount: 10000,
                            m_sCashbackType: 1,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 1000,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 999999999,
                            m_bIsInstantDiscountNoCostEMI: true
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 11111
                      },
                      "3398": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3398,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 100000,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 100,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 999999999,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 100,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999999999,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 1,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 999999999,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "6": {
                            m_iSchemaId: 3398,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 120000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 120000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 100000,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 100,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 999999999,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 100,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999999999,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 3,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 999999999,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3454": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3454,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 100000,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 100,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 100000000,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 100,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 900000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 1000,
                            m_sCashbackType: 3,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 999999999,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "6": {
                            m_iSchemaId: 3454,
                            m_iRuleId: 1166,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 160000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 160000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 0,
                            m_llMinAllowedTotalDiscountCashbackAmount: 0,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 0,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 0,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 999999999,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      }
                    }
                  },
                  m_ptrSelectedSchema: null,
                  m_bSchemaSelected: false,
                  m_iRuleProcessingState: 0,
                  m_llProductGroupIssuerGroupID: 0,
                  m_listProductGroupIssuerGroupID: [
                    10064,
                    10065,
                    10068,
                    10070,
                    10071
                  ],
                  m_iIssuerGroupID: 1058,
                  m_bIsViaEMIServer: false,
                  m_llProductGroupID: 0,
                  oleRowUpdationDateTimeForRuleInRWDMasterTbl:
                    "2019-12-31T13:06:50",
                  oleRowInsertionDateTimeForRuleInRWDMasterTbl:
                    "2017-10-24T11:26:49"
                },
                "108": {
                  m_iRuleId: 1178,
                  m_iRuleTypeId: 108,
                  m_ptrAssociatedRule: {
                    m_iRuleId: 1178,
                    m_sRuleTypeId: 108,
                    m_OleDTRuleApplicabilityDate: "2018-02-27T12:23:41",
                    m_OleDTRuleExpiryDate: "2024-02-08T12:08:41",
                    m_iRwdDefaultServerCommPercentage: 1178,
                    m_iRwdDefaultServerFixedComminPaise: 0,
                    m_iMeDefaultCommPercentage: 0,
                    m_iMeDefaultFixedComminPaise: 0,
                    m_OleDTRowUpdationDateTime: "2019-10-03T19:17:57",
                    m_OleDTRowInsertionDateTime: "2018-02-27T12:19:46",
                    m_iRowActionCount: 3,
                    m_csRuleFileName: "addoncashbacKnRANDOFUSINSTANTDIS.xml",
                    m_iChangeNumber: 0,
                    m_iMaxRuleApplicablityPerCardCount: 9999,
                    m_listAllSchemasIds: [
                      {
                        iRuleId: 1178,
                        iSchemaRowId: 3417,
                        oledtRuleStartDateTime: "2018-02-27T12:23:41",
                        oledtRuleEndDateTime: "2024-02-08T12:08:41",
                        oledtRowUpdationDateTime: "2019-10-03T19:17:57",
                        oledtRowInsertionDateTime: "2019-10-03T19:17:57",
                        sRowActionCount: 1
                      },
                      {
                        iRuleId: 1178,
                        iSchemaRowId: 1391,
                        oledtRuleStartDateTime: "2018-02-27T12:23:41",
                        oledtRuleEndDateTime: "2024-02-08T12:08:41",
                        oledtRowUpdationDateTime: "2019-10-03T19:17:57",
                        oledtRowInsertionDateTime: "2018-02-27T12:19:48",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1178,
                        iSchemaRowId: 1390,
                        oledtRuleStartDateTime: "2018-02-27T12:23:41",
                        oledtRuleEndDateTime: "2024-02-08T12:08:41",
                        oledtRowUpdationDateTime: "2019-10-03T19:17:57",
                        oledtRowInsertionDateTime: "2018-02-27T12:19:47",
                        sRowActionCount: 2
                      }
                    ],
                    m_mapAllSchemas: {
                      "1390": {
                        m_iMaxSchemaApplicabilityPerCardCount: 99999
                      },
                      "1391": {
                        m_iMaxSchemaApplicabilityPerCardCount: 11100
                      },
                      "3417": {
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      }
                    }
                  },
                  m_ptrSelectedSchema: null,
                  m_bSchemaSelected: false,
                  m_iRuleProcessingState: 0,
                  m_llProductGroupIssuerGroupID: 0,
                  m_listProductGroupIssuerGroupID: [10064, 10068],
                  m_iIssuerGroupID: 1058,
                  m_bIsViaEMIServer: false,
                  m_llProductGroupID: 0,
                  oleRowUpdationDateTimeForRuleInRWDMasterTbl:
                    "2019-10-03T19:17:57",
                  oleRowInsertionDateTimeForRuleInRWDMasterTbl:
                    "2018-02-27T12:19:46"
                },
                "112": {
                  m_iRuleId: 1203,
                  m_iRuleTypeId: 112,
                  m_ptrAssociatedRule: {
                    m_iRuleId: 1203,
                    m_sRuleTypeId: 112,
                    m_OleDTRuleApplicabilityDate: "2019-12-17T13:15:50",
                    m_OleDTRuleExpiryDate: "2023-12-14T12:58:50",
                    m_iRwdDefaultServerCommPercentage: 1203,
                    m_iRwdDefaultServerFixedComminPaise: 0,
                    m_iMeDefaultCommPercentage: 0,
                    m_iMeDefaultFixedComminPaise: 0,
                    m_OleDTRowUpdationDateTime: "2019-12-17T13:25:36",
                    m_OleDTRowInsertionDateTime: "2019-12-17T13:03:54",
                    m_iRowActionCount: 5,
                    m_csRuleFileName: "addonsubventionrule.xml",
                    m_iChangeNumber: 0,
                    m_iMaxRuleApplicablityPerCardCount: 1000,
                    m_listAllSchemasIds: [
                      {
                        iRuleId: 1203,
                        iSchemaRowId: 3443,
                        oledtRuleStartDateTime: "2019-12-17T13:15:50",
                        oledtRuleEndDateTime: "2023-12-14T12:58:50",
                        oledtRowUpdationDateTime: "2019-12-17T13:25:36",
                        oledtRowInsertionDateTime: "2019-12-17T13:25:36",
                        sRowActionCount: 1
                      },
                      {
                        iRuleId: 1203,
                        iSchemaRowId: 3442,
                        oledtRuleStartDateTime: "2019-12-17T13:15:50",
                        oledtRuleEndDateTime: "2023-12-14T12:58:50",
                        oledtRowUpdationDateTime: "2019-12-17T13:25:36",
                        oledtRowInsertionDateTime: "2019-12-17T13:25:36",
                        sRowActionCount: 1
                      },
                      {
                        iRuleId: 1203,
                        iSchemaRowId: 3441,
                        oledtRuleStartDateTime: "2019-12-17T13:15:50",
                        oledtRuleEndDateTime: "2023-12-14T12:58:50",
                        oledtRowUpdationDateTime: "2019-12-17T13:25:36",
                        oledtRowInsertionDateTime: "2019-12-17T13:25:36",
                        sRowActionCount: 1
                      },
                      {
                        iRuleId: 1203,
                        iSchemaRowId: 3440,
                        oledtRuleStartDateTime: "2019-12-17T13:15:50",
                        oledtRuleEndDateTime: "2023-12-14T12:58:50",
                        oledtRowUpdationDateTime: "2019-12-17T13:25:36",
                        oledtRowInsertionDateTime: "2019-12-17T13:25:36",
                        sRowActionCount: 1
                      },
                      {
                        iRuleId: 1203,
                        iSchemaRowId: 3438,
                        oledtRuleStartDateTime: "2019-12-17T13:15:50",
                        oledtRuleEndDateTime: "2023-12-14T12:58:50",
                        oledtRowUpdationDateTime: "2019-12-17T13:25:36",
                        oledtRowInsertionDateTime: "2019-12-17T13:12:52",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1203,
                        iSchemaRowId: 3439,
                        oledtRuleStartDateTime: "2019-12-17T13:15:50",
                        oledtRuleEndDateTime: "2023-12-14T12:58:50",
                        oledtRowUpdationDateTime: "2019-12-17T13:25:36",
                        oledtRowInsertionDateTime: "2019-12-17T13:25:36",
                        sRowActionCount: 1
                      },
                      {
                        iRuleId: 1203,
                        iSchemaRowId: 3437,
                        oledtRuleStartDateTime: "2019-12-17T13:15:50",
                        oledtRuleEndDateTime: "2023-12-14T12:58:50",
                        oledtRowUpdationDateTime: "2019-12-17T13:25:36",
                        oledtRowInsertionDateTime: "2019-12-17T13:12:52",
                        sRowActionCount: 2
                      },
                      {
                        iRuleId: 1203,
                        iSchemaRowId: 3436,
                        oledtRuleStartDateTime: "2019-12-17T13:15:50",
                        oledtRuleEndDateTime: "2023-12-14T12:58:50",
                        oledtRowUpdationDateTime: "2019-12-17T13:25:36",
                        oledtRowInsertionDateTime: "2019-12-17T13:07:16",
                        sRowActionCount: 3
                      },
                      {
                        iRuleId: 1203,
                        iSchemaRowId: 3435,
                        oledtRuleStartDateTime: "2019-12-17T13:15:50",
                        oledtRuleEndDateTime: "2023-12-14T12:58:50",
                        oledtRowUpdationDateTime: "2019-12-17T13:25:36",
                        oledtRowInsertionDateTime: "2019-12-17T13:03:54",
                        sRowActionCount: 4
                      }
                    ],
                    m_mapAllSchemas: {
                      "3435": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3435,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 999999999,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 999999999,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "6": {
                            m_iSchemaId: 3435,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 130000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 130000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 900000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 900000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "96": {
                            m_iSchemaId: 3435,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 1,
                            m_iCustomerProcessingFeePercentage: 0,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 0,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 0,
                            m_llMinAllowedTotalDiscountCashbackAmount: 0,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 0,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 0,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "NoEMIOnlyCashbck",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 96,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 900000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3436": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3436,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "6": {
                            m_iSchemaId: 3436,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 130000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 130000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3437": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3437,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "6": {
                            m_iSchemaId: 3437,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 130000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 130000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3438": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3438,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "6": {
                            m_iSchemaId: 3438,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 130000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 130000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3439": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3439,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "6": {
                            m_iSchemaId: 3439,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 130000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 132000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3440": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3440,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "6": {
                            m_iSchemaId: 3440,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 130000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 130000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 130000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 130000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3441": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3441,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          },
                          "9": {
                            m_iSchemaId: 3441,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 9,
                            m_iCustomerProcessingFeePercentage: 130000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 130000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 50000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "9 Months",
                            m_iManufacturerOfferedCashbackPercentage: 50000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 9,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3442": {
                        m_mapInstantEMITenures: {
                          "3": {
                            m_iSchemaId: 3442,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 3,
                            m_iCustomerProcessingFeePercentage: 100000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 100000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 100000000,
                            m_llMinAllowedTotalDiscountCashbackAmount: 100,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 100000,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 100,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "3 Months",
                            m_iManufacturerOfferedCashbackPercentage: 100000,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 100,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 3,
                            m_llMinTxnAmountPaise: 100,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      },
                      "3443": {
                        m_mapInstantEMITenures: {
                          "6": {
                            m_iSchemaId: 3443,
                            m_iRuleId: 1203,
                            m_iEmiTenureMonth: 6,
                            m_iCustomerProcessingFeePercentage: 130000,
                            m_iSubventionPayableToIssuerPercentage: 0,
                            m_iInterestRatePercentage: 130000,
                            m_iMerchantOfferedDiscountCashbackPercentage: 0,
                            m_llFixedMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMaxMerchantOfferedDiscountCashbackAmount: 0,
                            m_llMinMerchantOfferedDiscountCashbackAmount: 0,
                            m_iIssuerOfferedDiscountCashbackPercentage: 0,
                            m_llFixedIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMinIssuerOfferedDiscountCashbackAmount: 0,
                            m_llMaxAllowedTotalDiscountCashbackAmount: 0,
                            m_llMinAllowedTotalDiscountCashbackAmount: 0,
                            m_sCashbackType: 0,
                            m_llPaymentHolidaySchemeId: 0,
                            m_csStaticTextHeader: "",
                            m_csStaticTextFooter: "",
                            m_iGraphicImageIdHeader: 1,
                            m_iGraphicImageIdFooter: 1,
                            m_iTotalOfferedDiscountCashbackPercentage: 0,
                            m_llTotalOfferedDiscountCashbackFixedAmountPaise: 0,
                            m_csAdditionalCashBack: "",
                            m_csAdditionalRewardPoint: "",
                            m_csTernureSchemaDisplayName: "6 Months",
                            m_iManufacturerOfferedCashbackPercentage: 0,
                            m_llManufacturerOfferedCashbackFixedAmountPaise: 0,
                            m_iAssociationOfferedCashbackPercentage: 0,
                            m_llAssociationOfferedCashbackFixedAmountPaise: 0,
                            m_csStaticTextHeaderMerchant: "",
                            m_csStaticTextFooterMerchant: "",
                            m_iEMITenureID: 6,
                            m_llMinTxnAmountPaise: 0,
                            m_llMaxTxnAmountPaise: 100000000,
                            m_bIsInstantDiscountNoCostEMI: false
                          }
                        },
                        m_iMaxSchemaApplicabilityPerCardCount: 10000
                      }
                    }
                  },
                  m_ptrSelectedSchema: null,
                  m_bSchemaSelected: false,
                  m_iRuleProcessingState: 0,
                  m_llProductGroupIssuerGroupID: 0,
                  m_listProductGroupIssuerGroupID: [
                    10065,
                    10068,
                    10070,
                    10071,
                    10064
                  ],
                  m_iIssuerGroupID: 1060,
                  m_bIsViaEMIServer: false,
                  m_llProductGroupID: 0,
                  oleRowUpdationDateTimeForRuleInRWDMasterTbl:
                    "2019-12-17T13:25:36",
                  oleRowInsertionDateTimeForRuleInRWDMasterTbl:
                    "2019-12-17T13:03:54"
                }
              }
            },
            txn_data: {
              navigation_mode: 2,
              payment_mode: "1,4",
              transaction_type: 1,
              time_stamp: 157588000000,
              pine_pg_txn_id: 336676,
              PaymentModeList: [1, 4],
              IsInsantDiscountApplied: false,
              IssuerIDForAddOnSaleTxn: 0
            },
            wallet_data: null,
            netbanking_data: null,
            udf_data: {
              udf_field_1: "TEST1",
              udf_field_2: "TEST2",
              udf_field_3: "TEST3",
              udf_field_4: "TEST4",
              udf_field_5: "TEST5"
            },
            additional_data: null,
            si_data: null,
            AcquirerData: null,
            TxnProcessingoptionalParamteres: null,
            ParentTxnDetailData: null,
            upi_data: null,
            nbfc_data: null,
            product_details: [
              {
                schemes: [],
                product_code: "40",
                product_amount: 550000,
                subvention_cashback_discount: 0,
                product_discount: 0,
                subvention_cashback_discount_percentage: 0,
                product_discount_percentage: 0,
                bank_interest_rate_percentage: 0,
                bank_interest_rate: 0
              }
            ],
            payment_mode_data: [
              {
                payment_mode_id: 1,
                data: {
                  EncryptionTerminonlogy: 1,
                  RandomNumber: "3245764418568526"
                }
              },
              {
                payment_mode_id: 4,
                data: {
                  emi_model_type: 1,
                  emi_info: [
                    {
                      emi_category: 1,
                      emi_category_data: [
                        {
                          card_category: 1,
                          issuers: [
                            {
                              issuer_id: 3,
                              issuer_name: "HDFC",
                              is_debit_emi_issuer: false,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 2395,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 9041,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 100000,
                                        product_discount_percentage: 0,
                                        subvention_type: 1,
                                        additional_cashback:
                                          "Hi there is additional casback of rs 100",
                                        bank_interest_rate_percentage: 100000,
                                        bank_interest_rate: 9040
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 2395,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "3",
                                  tenure_in_month: "3",
                                  monthly_installment: 183333,
                                  bank_interest_rate: 100000,
                                  interest_pay_to_bank: 9040,
                                  total_offerred_discount_cashback_amount: 9041,
                                  loan_amount: 540959,
                                  auth_amount: 540959,
                                  cashback_type: 3
                                }
                              ]
                            }
                          ]
                        },
                        {
                          card_category: 2,
                          issuers: [
                            {
                              issuer_id: 23,
                              issuer_name: "Axis Debit",
                              is_debit_emi_issuer: true,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 3397,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 3647,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 100000,
                                        product_discount_percentage: 0,
                                        subvention_type: 1,
                                        bank_interest_rate_percentage: 40000,
                                        bank_interest_rate: 3646
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 3397,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "3",
                                  tenure_in_month: "3",
                                  monthly_installment: 183333,
                                  bank_interest_rate: 40000,
                                  interest_pay_to_bank: 3646,
                                  total_offerred_discount_cashback_amount: 3647,
                                  loan_amount: 546353,
                                  auth_amount: 546353,
                                  cashback_type: 3
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      emi_category: 2,
                      emi_category_data: [
                        {
                          card_category: 1,
                          issuers: [
                            {
                              issuer_id: 4,
                              issuer_name: "AMEX",
                              is_debit_emi_issuer: false,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 2396,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 155000,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 100000,
                                        product_discount_percentage: 0,
                                        subvention_type: 2,
                                        additional_cashback:
                                          "Hi there is additional casback of rs 100",
                                        bank_interest_rate_percentage: 100000,
                                        bank_interest_rate: 6601
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 2396,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "3",
                                  tenure_in_month: "3",
                                  monthly_installment: 133867,
                                  bank_interest_rate: 100000,
                                  interest_pay_to_bank: 6601,
                                  total_offerred_discount_cashback_amount: 155000,
                                  loan_amount: 395000,
                                  auth_amount: 395000,
                                  cashback_type: 3
                                }
                              ]
                            },
                            {
                              issuer_id: 8,
                              issuer_name: "SBI",
                              is_debit_emi_issuer: false,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 2397,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 155000,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 100000,
                                        product_discount_percentage: 0,
                                        subvention_type: 2,
                                        bank_interest_rate_percentage: 100000,
                                        bank_interest_rate: 6601
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 2397,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "3",
                                  tenure_in_month: "3",
                                  monthly_installment: 133867,
                                  bank_interest_rate: 100000,
                                  interest_pay_to_bank: 6601,
                                  total_offerred_discount_cashback_amount: 155000,
                                  loan_amount: 395000,
                                  auth_amount: 395000,
                                  cashback_type: 3
                                },
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 2397,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 310000,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 200000,
                                        product_discount_percentage: 0,
                                        subvention_type: 2,
                                        bank_interest_rate_percentage: 100000,
                                        bank_interest_rate: 7044
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 2397,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "6",
                                  tenure_in_month: "6",
                                  monthly_installment: 41174,
                                  bank_interest_rate: 100000,
                                  interest_pay_to_bank: 7044,
                                  total_offerred_discount_cashback_amount: 310000,
                                  loan_amount: 240000,
                                  auth_amount: 550000,
                                  cashback_type: 1
                                }
                              ]
                            }
                          ]
                        },
                        {
                          card_category: 2,
                          issuers: [
                            {
                              issuer_id: 23,
                              issuer_name: "Axis Debit",
                              is_debit_emi_issuer: true,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 3397,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 56000,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 100000,
                                        product_discount_percentage: 0,
                                        subvention_type: 2,
                                        bank_interest_rate_percentage: 100000,
                                        bank_interest_rate: 14506
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 3397,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "6",
                                  tenure_in_month: "6",
                                  monthly_installment: 84751,
                                  bank_interest_rate: 100000,
                                  interest_pay_to_bank: 14506,
                                  total_offerred_discount_cashback_amount: 56000,
                                  loan_amount: 494000,
                                  auth_amount: 550000,
                                  cashback_type: 1
                                }
                              ]
                            },
                            {
                              issuer_id: 233,
                              issuer_name: "HDFC DEBIT",
                              is_debit_emi_issuer: true,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 3454,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 55100,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 100000,
                                        product_discount_percentage: 0,
                                        subvention_type: 2,
                                        bank_interest_rate_percentage: 100000,
                                        bank_interest_rate: 8269
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 3454,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "3",
                                  tenure_in_month: "3",
                                  monthly_installment: 167723,
                                  bank_interest_rate: 100000,
                                  interest_pay_to_bank: 8269,
                                  total_offerred_discount_cashback_amount: 55100,
                                  loan_amount: 494900,
                                  auth_amount: 494900,
                                  cashback_type: 3
                                }
                              ]
                            },
                            {
                              issuer_id: 234,
                              issuer_name: "ICICI Debit",
                              is_debit_emi_issuer: true,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 3398,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 55100,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 100000,
                                        product_discount_percentage: 0,
                                        subvention_type: 2,
                                        bank_interest_rate_percentage: 100000,
                                        bank_interest_rate: 8269
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 3398,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "3",
                                  tenure_in_month: "3",
                                  monthly_installment: 167723,
                                  bank_interest_rate: 100000,
                                  interest_pay_to_bank: 8269,
                                  total_offerred_discount_cashback_amount: 55100,
                                  loan_amount: 494900,
                                  auth_amount: 550000,
                                  cashback_type: 1
                                },
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 3398,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 55100,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 100000,
                                        product_discount_percentage: 0,
                                        subvention_type: 2,
                                        bank_interest_rate_percentage: 120000,
                                        bank_interest_rate: 17464
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 3398,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "6",
                                  tenure_in_month: "6",
                                  monthly_installment: 85394,
                                  bank_interest_rate: 120000,
                                  interest_pay_to_bank: 17464,
                                  total_offerred_discount_cashback_amount: 55100,
                                  loan_amount: 494900,
                                  auth_amount: 494900,
                                  cashback_type: 3
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      emi_category: 3,
                      emi_category_data: [
                        {
                          card_category: 1,
                          issuers: [
                            {
                              issuer_id: 2,
                              issuer_name: "AXIS",
                              is_debit_emi_issuer: false,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 3392,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 0,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 0,
                                        product_discount_percentage: 0,
                                        subvention_type: 3,
                                        bank_interest_rate_percentage: 30000,
                                        bank_interest_rate: 2750
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 3392,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "3",
                                  tenure_in_month: "3",
                                  monthly_installment: 184250,
                                  bank_interest_rate: 30000,
                                  interest_pay_to_bank: 2750,
                                  total_offerred_discount_cashback_amount: 0,
                                  loan_amount: 550000,
                                  auth_amount: 550000,
                                  cashback_type: 0
                                },
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 3392,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 0,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 0,
                                        product_discount_percentage: 0,
                                        subvention_type: 3,
                                        bank_interest_rate_percentage: 0,
                                        bank_interest_rate: 0
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 3392,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "6",
                                  tenure_in_month: "6",
                                  monthly_installment: 91666,
                                  bank_interest_rate: 0,
                                  interest_pay_to_bank: 0,
                                  total_offerred_discount_cashback_amount: 0,
                                  loan_amount: 550000,
                                  auth_amount: 550000,
                                  cashback_type: 0
                                }
                              ]
                            },
                            {
                              issuer_id: 3,
                              issuer_name: "HDFC",
                              is_debit_emi_issuer: false,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 2395,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 310000,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 200000,
                                        product_discount_percentage: 0,
                                        subvention_type: 3,
                                        bank_interest_rate_percentage: 0,
                                        bank_interest_rate: 0
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 2395,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "6",
                                  tenure_in_month: "6",
                                  monthly_installment: 40000,
                                  bank_interest_rate: 0,
                                  interest_pay_to_bank: 0,
                                  total_offerred_discount_cashback_amount: 310000,
                                  loan_amount: 240000,
                                  auth_amount: 240000,
                                  cashback_type: 3
                                }
                              ]
                            },
                            {
                              issuer_id: 1,
                              issuer_name: "ICICI",
                              is_debit_emi_issuer: false,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 3393,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 0,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 0,
                                        product_discount_percentage: 0,
                                        subvention_type: 3,
                                        bank_interest_rate_percentage: 10000,
                                        bank_interest_rate: 914
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 3393,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "3",
                                  tenure_in_month: "3",
                                  monthly_installment: 183638,
                                  bank_interest_rate: 10000,
                                  interest_pay_to_bank: 914,
                                  total_offerred_discount_cashback_amount: 0,
                                  loan_amount: 550000,
                                  auth_amount: 550000,
                                  cashback_type: 0
                                }
                              ]
                            }
                          ]
                        },
                        {
                          card_category: 2,
                          issuers: [
                            {
                              issuer_id: 233,
                              issuer_name: "HDFC DEBIT",
                              is_debit_emi_issuer: true,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 3454,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 0,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 0,
                                        product_discount_percentage: 0,
                                        subvention_type: 3,
                                        bank_interest_rate_percentage: 160000,
                                        bank_interest_rate: 25946
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 3454,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "6",
                                  tenure_in_month: "6",
                                  monthly_installment: 95991,
                                  bank_interest_rate: 160000,
                                  interest_pay_to_bank: 25946,
                                  total_offerred_discount_cashback_amount: 0,
                                  loan_amount: 550000,
                                  auth_amount: 550000,
                                  cashback_type: 0
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      emi_category: 4,
                      emi_category_data: [
                        {
                          card_category: 1,
                          issuers: [
                            {
                              issuer_id: 4,
                              issuer_name: "AMEX",
                              is_debit_emi_issuer: false,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 2396,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 61500,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 110000,
                                        product_discount_percentage: 0,
                                        additional_cashback:
                                          "Hi there is additional casback of rs 100",
                                        bank_interest_rate_percentage: 0,
                                        bank_interest_rate: 0
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 2396,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "96",
                                  tenure_in_month: "1",
                                  monthly_installment: 0,
                                  bank_interest_rate: 0,
                                  interest_pay_to_bank: 0,
                                  total_offerred_discount_cashback_amount: 61500,
                                  loan_amount: 488500,
                                  auth_amount: 550000,
                                  cashback_type: 1
                                }
                              ]
                            },
                            {
                              issuer_id: 3,
                              issuer_name: "HDFC",
                              is_debit_emi_issuer: false,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 2395,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 61500,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 110000,
                                        product_discount_percentage: 0,
                                        additional_cashback:
                                          "Hiiiii there is additional casback of rs 100",
                                        bank_interest_rate_percentage: 0,
                                        bank_interest_rate: 0
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 2395,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "96",
                                  tenure_in_month: "1",
                                  monthly_installment: 0,
                                  bank_interest_rate: 0,
                                  interest_pay_to_bank: 0,
                                  total_offerred_discount_cashback_amount: 61500,
                                  loan_amount: 488500,
                                  auth_amount: 550000,
                                  cashback_type: 1
                                }
                              ]
                            },
                            {
                              issuer_id: 8,
                              issuer_name: "SBI",
                              is_debit_emi_issuer: false,
                              tenures: [
                                {
                                  offer_scheme: {
                                    product_details: [
                                      {
                                        schemes: [
                                          {
                                            scheme_id: 2397,
                                            program_type: 106,
                                            is_scheme_valid: true
                                          }
                                        ],
                                        product_code: "40",
                                        product_amount: 550000,
                                        subvention_cashback_discount: 63500,
                                        product_discount: 0,
                                        subvention_cashback_discount_percentage: 110000,
                                        product_discount_percentage: 0,
                                        bank_interest_rate_percentage: 0,
                                        bank_interest_rate: 0
                                      }
                                    ],
                                    emi_scheme: null
                                  },
                                  applicable_scheme: {
                                    scheme_id: 2397,
                                    program_type: 106,
                                    is_scheme_valid: true
                                  },
                                  tenure_id: "96",
                                  tenure_in_month: "1",
                                  monthly_installment: 0,
                                  bank_interest_rate: 0,
                                  interest_pay_to_bank: 0,
                                  total_offerred_discount_cashback_amount: 63500,
                                  loan_amount: 486500,
                                  auth_amount: 550000,
                                  cashback_type: 1
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  dictMerchantRuleProgram: null
                }
              },
              {
                payment_mode_id: 10,
                data: {
                  SelectedUpiThirdPartyUpiApp: null,
                  nbfc_data: [
                    {
                      UPIThirdPartyAppId: 0,
                      AppName: "UPI",
                      UPIOptionUIVal: 2,
                      UPIOptionUIId: "thirdPartyAppId-2"
                    },
                    {
                      UPIThirdPartyAppId: 1,
                      AppName: "GPAY",
                      UPIOptionUIVal: 3,
                      UPIOptionUIId: "thirdPartyAppId-3"
                    }
                  ]
                }
              }
            ]
          },
          response_code: 1,
          response_message: "SUCCESS"
        }),
      1000
    );
  });
}
