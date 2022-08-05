import * as CONSTANTS from "../../Constants/DispctaherActionTypeNamesConstant";
export function SetPaymentAmount(amount) {
  return dispatch => {
    // alert(json.data)
    dispatch(SET_PAYMENT_AMOUNT(amount));
  };
}

export const SET_PAYMENT_AMOUNT = amount => ({
  type: CONSTANTS.SET_PAYMENT_AMOUNT,
  payment_amount_ui: { amount }
});

export function SetPaymentFee(fee) {
  return dispatch => {
    dispatch(SET_PAYMENT_FEE(fee));
  };
}

export const SET_PAYMENT_FEE = fee => ({
  type: CONSTANTS.SET_PAYMENT_FEE,
  payment_amount_ui: { fee }
});
export function SetPaymentTotal(total) {
  return dispatch => {
    dispatch(SET_PAYMENT_TOTAL(total));
  };
}

export const SET_PAYMENT_TOTAL = total => ({
  type: CONSTANTS.SET_PAYMENT_TOTAL,
  payment_amount_ui: { total }
});

export function SetPaymentModeID(paymentModeId) {
  return dispatch => {
    dispatch(SET_PAYMENT_MODE_ID(paymentModeId));
  };
}

export const SET_PAYMENT_MODE_ID = paymentModeId => ({
  type: CONSTANTS.SET_PAYMENT_MODE_ID,
  payment_mode_id: { paymentModeId }
});

export const SET_NO_CASHBACK_FULL_PAYMENT_MODE_SELECTED = isSelected => ({
  type: CONSTANTS.SET_NO_CASHBACK_FULL_PAYMENT_MODE_SELECTED,
  isSelected: { isSelected }
});


export function SetRemovedSequenceId(SequenceId) {
  return dispatch => {
    dispatch(SET_REMOVED_SEQUENCE_ID(SequenceId));
  };
}

export const SET_REMOVED_SEQUENCE_ID = SequenceId => ({
  type: CONSTANTS.SET_REMOVED_SEQUENCE_ID,
  sequence_id: { SequenceId }
});