import * as CONSTANTS from "../../Constants/DispctaherActionTypeNamesConstant";

const initialUPITimerViewConfigs = {
    apiTime: 120,
    token: ""
};

export const fetchUpiTimerViewConfigsReducer = (state = initialUPITimerViewConfigs, action) => {
    if (action.type == CONSTANTS.UPI_TIMER_VIEW_CONFIG_FETCHED && action.payload) {
        return {
            ...state,
            apiTime: action.payload.upiApiTimer,
            token: action.payload.token
        }

    }
    return state;
}



export default fetchUpiTimerViewConfigsReducer