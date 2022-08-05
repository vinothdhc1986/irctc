import * as CONSTANTS from "../../Constants/DispctaherActionTypeNamesConstant";
import MerchantPaymentDataUtils from "../../utils/MerchantPaymentDataUtils";
const intialState = {
  token: null,
  merchantPaymentData: {},
  isIRCTC:false,
  error: null,
  loading: false,
  sessionExpires: false,
  paymentAmountUI: null,
  conveniencefeeData:{},
  paymentfee:null,
  paymenttotal:null,
  paymentModeId: null,
  selected_emi_data: {
    paymentMode: null,
    emiType: null,
    cardType: null,
    issuerId: null,
    tenureId: null,
    isSelected: false,
    paymentAmountForEMI: null,
    isSaveCardEMIPage: false
  },
  RemovedSeqId: []
};
const objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
const merchantPaymentDataFetchingReducer = (state = intialState, action) => {
  switch (action.type) {
    case CONSTANTS.FETCHING_MERCHANT_PAYMENT_DATA_BEGINS:
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.
      return {
        ...state,
        loading: true,
        error: null
      };
    case CONSTANTS.FETCHING_CONVENIENCE_DATA_SUCCESS:
      return {
        ...state,
        loading:false,
        conveniencefeeData: action.conveniencefeeData,
      };
    case CONSTANTS.FETCHING_MERCHANT_PAYMENT_IRCTC_DATA_SUCCESS:
      return {
        ...state,
        loading:false,
        isIRCTC:action.isIRCTC,
      }  
    case CONSTANTS.FETCHING_MERCHANT_PAYMENT_DATA_SUCCESS:
      // All done: set loading "false".
      // Also, replace the items with the ones from the server
      return {
        ...state,
        loading: false,
        token: action.merchantPaymentData.token,
        merchantPaymentData: action.merchantPaymentData.data,
        paymentAmountUI: objMerchantPaymentDataUtils.GetPaymentAmount(
          action.merchantPaymentData.data
        ),
        paymentfee: objMerchantPaymentDataUtils.GetPaymentAmount(
          action.merchantPaymentData.data
        ),
        paymenttotal: objMerchantPaymentDataUtils.GetPaymentAmount(
          action.merchantPaymentData.data
        ),
        selected_emi_data: {
          ...state.selected_emi_data,
          paymentAmountForEMI: objMerchantPaymentDataUtils.GetPaymentAmount(
            action.merchantPaymentData.data
          )
        }
      };

    case CONSTANTS.FETCHING_DATA_SUCCESS:
      // All done: set loading "false".
      // Also, replace the items with the ones from the server
      return {
        ...state,
        loading: false
      };

    case CONSTANTS.FETCHING_MERCHANT_PAYMENT_DATA_FAILURE:
      // The request failed, but it did stop, so set loading to "false".
      // Save the error, and we can display it somewhere
      // Since it failed, we don't have items to display anymore, so set it empty.
      // This is up to you and your app though: maybe you want to keep the items
      // around! Do whatever seems right.
      return {
        ...state,
        loading: false,
        error: action.error.error
        // merchantPaymentData: {}
      };

    case CONSTANTS.SET_SELECTED_EMI_DATA:

      return {
        ...state,
        selected_emi_data: {
          ...state.selected_emi_data,
          paymentMode: action.emi_selected_data.data.payment_mode,
          emiType: action.emi_selected_data.data.emiType,
          cardType: action.emi_selected_data.data.cardType,
          issuerId: action.emi_selected_data.data.issuerId,
          tenureId: action.emi_selected_data.data.tenureId,
          isSelected: true,
          paymentAmountForEMI: action.emi_selected_data.data.paymentAmountForEMI,
          isSaveCardEMIPage: action.emi_selected_data.data.isSaveCardEMIPage,
          isDefaultSchemeSelected: true
        }
      };

    case CONSTANTS.SET_EMI_TYPE_ID:
      return {
        ...state,
        selected_emi_data: {
          ...state.selected_emi_data,
          emiType: action.emi_type_id.data,
          cardType: null,
          issuerId: null,
          tenureId: null,
          isSelected: false
        }
      };

    case CONSTANTS.SET_CARD_TYPE_ID:
      return {
        ...state,
        selected_emi_data: {
          ...state.selected_emi_data,
          cardType: action.card_type_id.data,
          issuerId: null,
          tenureId: null,
          isSelected: false
        }
      };

    case CONSTANTS.SET_ISSUER_ID:
      return {
        ...state,
        selected_emi_data: {
          ...state.selected_emi_data,
          issuerId: action.issuer_id.data,
          tenureId: null,
          isSelected: false
        }
      };

    case CONSTANTS.SET_TENURE_ID:
      return {
        ...state,
        selected_emi_data: {
          ...state.selected_emi_data,
          tenureId: action.tenure_id.data
        }
      };

    case CONSTANTS.SET_CHOOSE_OTHER_EMI:
      return {
        ...state,
        selected_emi_data: {
          ...state.selected_emi_data,
          isSelected: false,
          isDefaultSchemeSelected: true
        }
      };

    case CONSTANTS.CHOOSE_EMI_PAYMENT_MODE:
      return {
        ...state,
        selected_emi_data: {
          ...state.selected_emi_data,
          isNoSchemeToBeSelected: true
        }
      };
    case CONSTANTS.SET_PAYMENT_AMOUNT:
      return {
        ...state,
        paymentAmountUI: action.payment_amount_ui.amount
      };
    case CONSTANTS.SET_PAYMENT_FEE:
        return {
          ...state,
          paymentfee: action.payment_amount_ui.fee
        };  
        
    case CONSTANTS.SET_PAYMENT_TOTAL:
      return {
        ...state,
        paymenttotal: action.payment_amount_ui.total
      };  
    case CONSTANTS.SET_PAYMENT_MODE_ID:
      return {
        ...state,
        paymentModeId: action.payment_mode_id.paymentModeId

      };

    case CONSTANTS.SET_REMOVED_SEQUENCE_ID:
      return {
        ...state,
        RemovedSeqId: [...state.RemovedSeqId, action.sequence_id.SequenceId]
      };


    case CONSTANTS.SESSION_EXPIRES:
      return {
        ...state,
        sessionExpires: true
      };

    case CONSTANTS.SET_NO_CASHBACK_FULL_PAYMENT_MODE_SELECTED:
      return {
        ...state,
        isSelected: action.payment_mode_id.paymentModeId
      };

    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
};

export default merchantPaymentDataFetchingReducer;
