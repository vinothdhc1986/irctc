import Axios from "axios";
import PGApiClient from "../AxiosUtils/PGApiClient";
import APIConfig from "../AxiosUtils/PGApiClient";

class HttpApiUtil {
  constructor() { }

  FetchMerchantPaymentData = token => {
    try {
      return PGApiClient.post(
        process.env.REACT_APP_PG_CONTROLLER + "api/v2/fetch/paymentmode/data",
        null,
        {
          params: {
            token: token
          },
          headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };


  OrderConfirmation = (token, emiModel) => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/redirect/order/confirmation",
      emiModel,
      {
        params: {
          token: token
        }
      }
    );
  };


  BNPLOrderConfirmation = (token) => {

    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/redirect/bnpl/order/confirmation?token=" + encodeURIComponent(token),

    );
  };




  //.then(response => response.status)
  // .catch(err => console.warn(err));;;

  CheckIssuerCardBinIsValidEMI = (token, CardValidationModel) => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/card/validation",
      CardValidationModel,
      {
        params: {
          token: token
        }
      }
    );
  };
  CheckDebitEMIIssuerElegibilty = (token, CardValidationModel) => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/debit/cardelegibility",
      CardValidationModel,
      {
        params: {
          token: token
        }
      }
    );
  };


  CheckBNPLAcquirerElegibilty = (token, CardValidationModel) => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/bnpl/initiate",
      CardValidationModel,
      {
        params: {
          token: token
        }
      }
    );
  };




  CheckSession = token => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/session/validity",
      null,
      {
        params: {
          token: token
        }
      }
    );
  };

  onValidateOTP = (token, CardValidationModel) => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/DebitEMI/validate/otp",
      CardValidationModel,
      {
        params: {
          token: token
        }
      }
    );
  };


  onBNPLValidateOTP = (token, CardValidationModel) => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/BNPL/validate/otp",
      CardValidationModel,
      {
        params: {
          token: token
        }
      }
    );
  };



  InitiateWalletTransaction = (token, data) => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER +
      "walletapi/initiate?token=" +
      encodeURIComponent(token),
      data
    );
  };

  renderBharatQRCodeView = (token, succesCB, failureCB) => {
    try {
      return PGApiClient.post(process.env.REACT_APP_PG_CONTROLLER + "api/v2/BharatQRApi/RenderBharatQRCodeView",
        {
          "token": token,
          "apiVersion": "v2"
        },
        {
          headers: {
            Accept: "application/json"
          }
        }
      )
    } catch (error) {

      console.log(error);
    }
  };
  getBharatQRCodeViewData = (token) => {
    try {
      return PGApiClient.post(process.env.REACT_APP_PG_CONTROLLER + "api/v2/BharatQRApi/InitiateBharatQRTransaction",
        {
          "token": token
        },
        {
          headers: {
            Accept: "application/json"
          }
        }
      )
    }
    catch (error) {
      console.log(error);
    }
  };

  // postNbfcEmiRequestData = (url, formData, successCb, failureCb) => {
  //   let cb = successCb;
  //   Axios.post(url, formData)
  //     .then(response => {
  //       cb(response.data);
  //     })
  //     .catch(error => {
  //       alert(error)
  //       console.log(error);
  //     });
  // };
  postNbfcEmiRequestData = (token, formData) => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/process/payment?token=" + encodeURIComponent(token),
      formData
    );
  };
  postNbfcEmiSubmitOtp = (url, formData) => {
    return PGApiClient.post(url, formData);
  };
  postZestMoneyLoanApproval = (url, formData) => {
    return PGApiClient.post(url, formData);
  };
  // payUpiGPay = (token, formData, successCb, failureCb) => {
  //   let cb = successCb;
  //   Axios.post(process.env.REACT_APP_PG_CONTROLLER + "api/v2/process/payment?token=" + encodeURIComponent(token), formData).then(response => {
  //     cb(response.data);
  //   })
  //     .catch(error => {
  //       alert(error)
  //       console.log(error);
  //     });
  // };

  payUpiGPay = (token, formData) => {
    return PGApiClient.post(
      // process.env.REACT_APP_PG_CONTROLLER + "api/v2/process/payment?token=" + encodeURIComponent(token),
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/upi/initiate?token=" + encodeURIComponent(token),
      formData
    );
  };
  payNbfcEmi = (token, formData) => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/process/payment?token=" + encodeURIComponent(token),
      formData
    );
  };


  RemoveSaveCard = (token, SeqId) => {
    // alert(process.env.REACT_APP_PG_CONTROLLER + "api/v2/remove/savecard?token=" + token + "&SeqId=" + SeqId);
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/remove/savecard?token=" + encodeURIComponent(token) + "&SeqId=" + SeqId
    );
  }


  payConveniencefee = (ModalValue) => {
   return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v1/irctc/conveniencefee",
      ModalValue
    );
  };




  payBharatQR = (url, formData, successCb, failureCb) => {
    Axios.post("http://localhost:51462/haratQR/InitiateBharatQRTransaction", formData)
      .then(response => {
        this.cb();
        this.PostForm(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };


  CheckVPAUpiMandate = (token, PayerVPA) => {
    return PGApiClient.post(
      // process.env.REACT_APP_PG_CONTROLLER + "api/v2/process/payment?token=" + encodeURIComponent(token),
      process.env.REACT_APP_PG_CONTROLLER + "api/v1/mandate/upi/checkvpa?token=" + encodeURIComponent(token),
      PayerVPA
    );
  };


  payByUpiMandate = (token, formData) => {
    return PGApiClient.post(
      // process.env.REACT_APP_PG_CONTROLLER + "api/v2/process/payment?token=" + encodeURIComponent(token),
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/upi/pay/mandate?token=" + encodeURIComponent(token),
      formData
    );
  };

  CheckCardIsValidForLoungeTxn = (token, cardBinValidationModel) => {
    return PGApiClient.post(
      process.env.REACT_APP_PG_CONTROLLER + "api/v2/card/validation/lounge",
      cardBinValidationModel,
      {
        params: {
          token: token,

        }
      }
    );
  };

}

export default HttpApiUtil;
