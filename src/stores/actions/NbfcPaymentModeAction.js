export const setSelectNbfcOption = (selectedNbfcVendor, PinePGTxnID) => {
    return {
        type: "NBFC_OPTION_SELECTED",
        payload: { selectedNbfcVendor, PinePGTxnID }
    };
}

export const setNbfcOptionPaymentReqData = paymentInitiationReqObj => {
    return {
        type: "NBFC_PAYMENT_INITIATION_REQ_OBJ",
        payload: paymentInitiationReqObj
    };
}

export const setNbfcTransactionState = (transactionState, apiUrl) => {
    return {
        type: "NBFC_PAYMENT_OTP_GENERATED",
        payload: { transactionState, apiUrl }
    };
}

export const setNbfcTransactionStateOtpSubmitted = (transactionState, apiUrl, validatedOtpResponse) => {
    return {
        type: "NBFC_PAYMENT_OTP_SUBMITTED",
        payload: { transactionState, apiUrl, validatedOtpResponse }
    };
}
export const setNbfcTransactionError = (transactionErrorMssg) => {
    return {
        type: "NBFC_TRANSACTION_ERROR_OCCURED",
        payload: { transactionErrorMssg }
    };
}