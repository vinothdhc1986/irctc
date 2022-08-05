import * as CONSTANTS from "../../Constants/DispctaherActionTypeNamesConstant";

export function SetSelectedEMICardIssuerTenureData(data) {
  return dispatch => {
    // alert(json.data)
    dispatch(SET_SELECTED_EMI_DATA(data));
  };
}

export function SetEMITypeID(data) {
  return dispatch => {
    // alert(json.data)
    dispatch(SET_EMI_TYPE_ID(data));
  };
}

export function SetCardTypeId(data) {
  return dispatch => {
    // alert(json.data)
    dispatch(SET_CARD_TYPE_ID(data));
  };
}

export function SetIssuerId(data) {
  return dispatch => {
    // alert(json.data)
    dispatch(SET_ISSUER_ID(data));
  };
}

export function SetTenureId(data) {
  return dispatch => {
    // alert(json.data)
    dispatch(SET_TENURE_ID(data));
  };
}

export function SetOtherEMI() {

  return dispatch => {
    // alert(json.data)
    dispatch(SET_CHOOSE_OTHER_EMI());
  };
}

export function ChooseEMIPaymentMode() {

  return dispatch => {
    // alert(json.data)
    dispatch(CHOOSE_EMI_PAYMENT_MODE());
  };
}

export const SET_SELECTED_EMI_DATA = data => ({
  type: CONSTANTS.SET_SELECTED_EMI_DATA,
  emi_selected_data: { data }
});

export const SET_EMI_TYPE_ID = data => ({
  type: CONSTANTS.SET_EMI_TYPE_ID,
  emi_type_id: { data }
});

export const SET_CARD_TYPE_ID = data => ({
  type: CONSTANTS.SET_CARD_TYPE_ID,
  card_type_id: { data }
});

export const SET_ISSUER_ID = data => ({
  type: CONSTANTS.SET_ISSUER_ID,
  issuer_id: { data }
});

export const SET_TENURE_ID = data => ({
  type: CONSTANTS.SET_TENURE_ID,
  tenure_id: { data }
});

export const SET_CHOOSE_OTHER_EMI = () => ({
  type: CONSTANTS.SET_CHOOSE_OTHER_EMI
});

export const CHOOSE_EMI_PAYMENT_MODE = () => ({
  type: CONSTANTS.CHOOSE_EMI_PAYMENT_MODE
});
