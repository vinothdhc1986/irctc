import * as CONSTANTS from "../../Constants/DispctaherActionTypeNamesConstant";
import HttpApiUtil from "../../ApiUtils/HttpApiUtil";
import { findAllByPlaceholderText } from "@testing-library/react";
const ObjHttpApiUtil = new HttpApiUtil();

export function CheckSession(token) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.CheckSession(token)
      .then(json => {
        dispatch(FETCHING_DATA_SUCCESS());
        if (json != null && json.data.response_code != 1) {
          dispatch(SESSION_EXPIRES());
        }

        return json;
      })
      .catch(error => {
        //  alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}


export function InitiateWalletTransaction(token, data) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.InitiateWalletTransaction(token, data)
      .then(response => {
        dispatch(FETCHING_DATA_SUCCESS());
        return response;
      })
      .catch(error => {
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}

export function CheckIssuerCardBinIsValidEMI(token, CardValidationModel) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.CheckIssuerCardBinIsValidEMI(
      token,
      CardValidationModel
    )
      .then(json => {
        // alert("jsn is" + json);
        dispatch(FETCHING_DATA_SUCCESS());
        //alert(JSON.stringify(json.data));
        return json;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}

export function CheckDebitEMIIssuerElegibilty(token, CardValidationModel) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.CheckDebitEMIIssuerElegibilty(
      token,
      CardValidationModel
    )
      .then(json => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        return json;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}

export function CheckBNPLAcquirerElegibilty(token, CardValidationModel) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.CheckBNPLAcquirerElegibilty(
      token,
      CardValidationModel
    )
      .then(json => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        return json;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}

export function onValidateOTP(token, otpValue) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.onValidateOTP(token, otpValue)
      .then(json => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        return json;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}

export function onBNPLValidateOTP(token, otpValue) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.onBNPLValidateOTP(token, otpValue)
      .then(json => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        return json;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}





export function renderBharatQRCodeView(token, succesCB, failureCB) {
  let fCb = failureCB;
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.renderBharatQRCodeView(token, succesCB, failureCB)
      .then(response => {
        dispatch(FETCHING_DATA_SUCCESS());
        let res = response.data;
        //  alert(JSON.stringify(json.data));
        if (res && res != null && res.responseCode == 1) {
          window.location.replace(res.qrCodeViewUrl)
        }
        else {
          fCb(res);
        }
      }, response => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        fCb(response.data)
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}
export function getBharatQRCodeViewData(token, succesCB, failureCB) {
  let sCb = succesCB;
  let fCb = failureCB;
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.getBharatQRCodeViewData(token)
      .then(response => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        sCb(response.data);
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}
export function payUpiGPay(token, formData) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.payUpiGPay(token, formData)
      .then(response => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        return response.data;
      }, response => {
        return response.data;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}



export function SaveCardRemoval(token, SeqId) {

  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.RemoveSaveCard(token, SeqId)
      .then(response => {


        dispatch(FETCHING_DATA_SUCCESS());
        return response;
      })
      .catch(error => {
        alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };


}


export function payConveniencefee(data_value) {

  return dispatch => {
  //  dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.payConveniencefee(data_value)
      .then(response => {
        dispatch(FETCHING_CONVENIENCE_DATA_SUCCESS(JSON.parse(response.data)));
        return response;
      })
      .catch(error => {
      //  dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
       // throw new Error(error);
      });
  };


}






export function postNbfcEmiRequestData(token, formData, responseCb) {
  let cb = responseCb;
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.payNbfcEmi(token, formData)
      .then(response => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        cb(response.data);
      }, response => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        cb(response.data)
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}
export function postNbfcEmiSubmitOtp(url, formData, succesCB, failureCB) {
  let cb = succesCB;
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.postNbfcEmiSubmitOtp(url, formData, succesCB, failureCB)
      .then(response => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        cb(response.data);
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}
export function postZestMoneyLoanApproval(url, formData, succesCB, failureCB) {
  let cb = succesCB;
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.postZestMoneyLoanApproval(url, formData)
      .then(response => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        cb(response.data);
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}


export function CheckVPAUpiMandate(token, PayerVPA) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.CheckVPAUpiMandate(token, PayerVPA)
      .then(response => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        return response.data;
      }, response => {
        return response.data;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}


export function CheckCardIsValidForLoungeTxn(token, cardMdel) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.CheckCardIsValidForLoungeTxn(
      token,
      cardMdel
    )
      .then(json => {
        // alert("jsn is" + json);
        dispatch(FETCHING_DATA_SUCCESS());
        //alert(JSON.stringify(json.data));
        return json;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}



export function OrderConfirmation(token, emiModel) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.OrderConfirmation(
      token,
      emiModel
    )
      .then(json => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        return json;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}

export function BNPLOrderConfirmation(token) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.BNPLOrderConfirmation(
      token
    )
      .then(json => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        return json;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}

export function payByUpiMandate(token, formData) {
  return dispatch => {
    dispatch(FETCHING_MERCHANT_PAYMENT_DATA_BEGINS());
    return ObjHttpApiUtil.payByUpiMandate(token, formData)
      .then(response => {
        dispatch(FETCHING_DATA_SUCCESS());
        //  alert(JSON.stringify(json.data));
        return response.data;
      }, response => {
        return response.data;
      })
      .catch(error => {
        //alert(error);
        dispatch(FETCHING_MERCHANT_PAYMENT_DATA_FAILURE(error));
        throw new Error(error);
      });
  };
}



export const FETCHING_MERCHANT_PAYMENT_DATA_BEGINS = () => ({
  type: CONSTANTS.FETCHING_MERCHANT_PAYMENT_DATA_BEGINS
});

export const FETCHING_MERCHANT_PAYMENT_DATA_FAILURE = error => ({
  type: CONSTANTS.FETCHING_MERCHANT_PAYMENT_DATA_FAILURE,
  error: { error }
});
export const FETCHING_CONVENIENCE_DATA_SUCCESS = (data)=>({
  type: CONSTANTS.FETCHING_CONVENIENCE_DATA_SUCCESS,
  conveniencefeeData: { data }

});
export const FETCHING_DATA_SUCCESS = () => ({
  type: CONSTANTS.FETCHING_DATA_SUCCESS
});

export const SESSION_EXPIRES = () => ({
  type: CONSTANTS.SESSION_EXPIRES
});

