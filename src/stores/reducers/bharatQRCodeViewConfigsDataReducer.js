import * as CONSTANTS from "../../Constants/DispctaherActionTypeNamesConstant";

const initialUPITimerViewConfigs = {
    PinePGTxnID: 0,
    apiTime: 120
};

const bharatQrCodeViewConfigs = {
    bharatQRTimer: 120,
    PinePGTxnID: 0,
    MerchantName: '',
    MerchantLocation: '',
    token: ""
}

const fetchBharatQrCodeViewConfigDataReducer = (state = bharatQrCodeViewConfigs, action) => {
    if (action.type == CONSTANTS.CONFIG_FETCHED_BHARAT_QR_CODE_GENERATED_VIEW && action.payload) {
        return {
            ...state,
            bharatQRTimer: action.payload.bharatQRTimer,
            PinePGTxnID: action.payload.PinePGTxnID,
            MerchantName: action.payload.MerchantName,
            MerchantLocation: action.payload.MerchantLocation
        }

    }
    if (action.type == CONSTANTS.BHARAT_QR_TIMER_VIEW_RENDERED && action.payload) {
        return {
            ...state,
            token: action.payload.token
        }
    }
    return state;
}



export default fetchBharatQrCodeViewConfigDataReducer