export const setSelectUpiOption = (selectedUpiThirdPartyUpiApp, PinePGTxnID) => {
    return {
        type: "UPI_OPTION_SELECTED",
        payload: { selectedUpiThirdPartyUpiApp, PinePGTxnID }
    };
}

export const setUpiOptionPaymentReqData = paymentInitiationReqObj => {
    return {
        type: "UPI_PAYMENT_INITIATION_REQ_OBJ",
        payload: paymentInitiationReqObj
    };
}

export const setUpiTimerViewData = (upiApiTimer, token) => {
    return {
        type: "UPI_TIMER_VIEW_CONFIG_FETCHED",
        payload: { upiApiTimer, token }
    };
}