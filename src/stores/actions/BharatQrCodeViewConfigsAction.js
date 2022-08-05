export const setBharatQrCodeViewConfigData = (bharatQRTimer, PinePGTxnID, MerchantName, MerchantLocation) => {
    return {
        type: "CONFIG_FETCHED_BHARAT_QR_CODE_GENERATED_VIEW",
        payload: { bharatQRTimer, PinePGTxnID, MerchantName, MerchantLocation }
    };
}

export const setBharatQRTimerViewData = (token) => {
    return {
        type: "BHARAT_QR_TIMER_VIEW_RENDERED",
        payload: { token }
    };
}