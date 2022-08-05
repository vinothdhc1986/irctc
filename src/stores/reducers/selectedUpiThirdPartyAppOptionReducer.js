
import * as CONSTANTS from "../../Constants/DispctaherActionTypeNamesConstant";

const initialSelectedUpiOption = {
    UpiThirdPartyAppId: null,
    CustomerVPA: "",
    CustomerMobileNo: "",
    PinePGTxnID: 0,
    SelectedUpiThirdPartyUpiApp: null
};

const selectedUpiThirdPartyAppOptionReducer = (state = initialSelectedUpiOption, action) => {
    if (action.type == CONSTANTS.UPI_OPTION_SELECTED && action.payload) {
        let upiThirPartyAppId = action.payload == 3 ? 1 : null;
        return {
            ...state,
            SelectedUpiThirdPartyUpiApp: action.payload.selectedUpiThirdPartyUpiApp,
            CustomerVPA: "",
            CustomerMobileNo: "",
            UpiThirdPartyAppId: upiThirPartyAppId,
            PinePGTxnID: action.payload.PinePGTxnID
        }

    }
    return state;
}



export default selectedUpiThirdPartyAppOptionReducer