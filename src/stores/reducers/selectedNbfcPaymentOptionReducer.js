import * as CONSTANTS from "../../Constants/DispctaherActionTypeNamesConstant";

const initialSelectedNbfcOption = {
    PinePGTxnID: 0,
    SchemeCode: "",
    Tenure: "",
    CardNumber: "",
    MobileNumber: "",
    PaymentMode: "",
    NbfcEmiVendor: "",
    TransactionState: "TXN_INITIATE",
    apiUrl: "",
    validatedOtpResponse: null,
    nbfcTransError: ""
};

const selectedNbfcPaymentOptionReducer = (state = initialSelectedNbfcOption, action) => {
    if (action.type == CONSTANTS.NBFC_OPTION_SELECTED && action.payload) {
        return {
            ...state,
            NbfcEmiVendor: action.payload.selectedNbfcVendor,
            PinePGTxnID: action.payload.PinePGTxnID,
            TransactionState: "TXN_INITIATE"
        }

    }
    if (action.type == CONSTANTS.NBFC_PAYMENT_OTP_GENERATED && action.payload) {
        return {
            ...state,
            TransactionState: action.payload.transactionState,
            apiUrl: action.payload.apiUrl
        }

    }
    if (action.type == CONSTANTS.NBFC_PAYMENT_OTP_SUBMITTED && action.payload) {
        return {
            ...state,
            TransactionState: action.payload.transactionState,
            apiUrl: action.payload.apiUrl,
            validatedOtpResponse: action.payload.validatedOtpResponse
        }

    }
    if (action.type == CONSTANTS.NBFC_TRANSACTION_ERROR_OCCURED && action.payload) {
        return {
            ...state,
            nbfcTransError: action.payload.transactionErrorMssg
        }

    }

    return state;
}

export default selectedNbfcPaymentOptionReducer


