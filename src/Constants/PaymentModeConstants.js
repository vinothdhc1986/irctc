export const PAYMENT_MODE_CREDIT_DEBIT_CARD = 1;
export const PAYMENT_MODE_EMI = 4;
export const PAYMENT_MODE_UPI = 10;
export const PAYMENT_MODE_NBFC_THIRD_PARTY_EMI = 7;
export const PAYMENT_MODE_NETBANKING = 3;
export const PAYMENT_MODE_BHARATQR = 12;
export const PAYMENT_MODE_WALLET = 11;
export const PAYMENT_MODE_UPI_MANDATE = 15;
export const PAYMENT_MODE_BUY_NOW_PAY_LATER = 17;
export const NUMBERS_ONLY_REGEX = /^[0-9\b]{0,19}$/;
export const CVV_NUMBERS_ONLY_REGEX = /^[0-9\b]{0,4}$/;
export const NAME_WITH_SPECIAL_CHARS_REGEX = /^[a-zA-Z!@#$%^*_-| ]+$/





export const PAYMENT_MODES_SEQUENCE_PRIORITIES = [4, 1, 3, 10, 12, 11, 7, 13, 14, 5, 6, 8, 9, 15, 17];
export const PAYMENT_MODES_BY_KEY_VALUE_PAIR = [
    { key: 4, value: "/emi" },
    { key: 3, value: "/netbanking" },
    { key: 1, value: "/card" },
    { key: 10, value: "/upi" },
    { key: 12, value: "/bharatqr" },
    { key: 11, value: "/wallet" },
    { key: 7, value: "/nbfc" },
    { key: 15, value: "/upimandate" },
    { key: 17, value: "/buynowpaylater" }
   

];