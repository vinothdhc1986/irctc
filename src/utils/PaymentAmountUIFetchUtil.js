import MerchantPaymentDataUtils from "./MerchantPaymentDataUtils";
const objMerchantPaymentDataUtils = new MerchantPaymentDataUtils();
class PaymentAmountUIFetchUtil {
  GetPaymentAmountUIForEMI = (
    data,
    emiModelType,
    allTenuresForIssuer,
    tenureId
  ) => {
    return objMerchantPaymentDataUtils.GetPaymentAmountUIForEMI(
      data,
      emiModelType,
      allTenuresForIssuer,
      tenureId
    );
  };

  GetPaymentAmountUIAccToPaymentMode = (data, paymentModeId) => {
    let paymentAmountUI = objMerchantPaymentDataUtils.GetPaymentAmount(data);

    if (paymentModeId == 4) {
    }
    return paymentAmountUI;
  };
}
export default PaymentAmountUIFetchUtil;
