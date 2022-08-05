
import { combineReducers } from 'redux';
import merchantPaymentDataFetchingReducer from './merchantPaymentDataFetchingReducer';
import selectedUpiThirdPartyAppOptionReducer from './selectedUpiThirdPartyAppOptionReducer';
import selectedNbfcPaymentOptionReducer from './selectedNbfcPaymentOptionReducer';
import fetchUpiTimerViewConfigsReducer from './upiTimerViewConfigsDataReducer';
import fetchBharatQrCodeViewConfigDataReducer from './bharatQRCodeViewConfigsDataReducer';


export default combineReducers({
    merchantPaymentDataFetchingReducer,
    selectedUpiThirdPartyAppOptionReducer,
    selectedNbfcPaymentOptionReducer,
    fetchUpiTimerViewConfigsReducer,
    fetchBharatQrCodeViewConfigDataReducer,
    selectedNbfcPaymentOptionReducer
});