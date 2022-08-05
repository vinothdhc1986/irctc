// const data={
//     merchant_data: {
//         merchant_id: 3413,
//         merchant_unique_txn_d: "merchant_123"
//       },
//       payment_data: {
//         payment_amount_in_paise: 550000
//       },
//       payment_mode_data: [
//         {
//           payment_mode_id: 4,
//           data: {}
//         },
//         {
//           payment_mode_id: 1,
//           data: {}
//         }
//       ],
//       response_code: 1,
//       response_message: "SUCCESS"
//       };

//     //   console.log(data);
//     //   console.log( Object.keys(data));

//       console.log(data.payment_mode_data.filter(obj=> obj.payment_mode_id===4))

//       data.payment_mode_data.map((obj)=>{

//         // console.log(obj.payment_mode_id);

//       })

//      let md= data.merchant_data.merchant_id;
//    //  console.log(md);

//       Object.keys(data).map((obj)=>{

//       //  console.log(data["merchant_data"]);

//       })

//       var EMI_TYPE_DATA=[
//         {

//             VALUE:"Easy EMIs without any additional costs"
//         },
//         {

//             VALUE:"Avail EMIs from top banks on low-interest"

//         },
//        {

//             VALUE:"Standard interest rates apply on these EMIs"
//         }

//       ]

//       console.log(EMI_TYPE_DATA.le);

//     console.log(Object.entries(EMI_TYPE_DATA).map(([key, value]) =>    {key, key * 2}));

var data1 = {
  emi_model_type: 0,
  emi_info: [
    {
      emi_category: 3,
      emi_category_data: [
        {
          card_category: 1,
          issuers: [
            {
              issuer_id: 4,
              is_debit_emi_issuer: false,
              tenures: [
                {
                  offer_scheme: {
                    product_details: [
                      {
                        schemes: [],
                        product_code: "40",
                        product_amount: 550000,
                        subvention_cashback_discount: 0,
                        product_discount: 0,
                        subvention_cashback_discount_percentage: 0,
                        product_discount_percentage: 0,
                        bank_interest_rate_percentage: 100000,
                        bank_interest_rate: 0
                      }
                    ],
                    emi_scheme: {
                      scheme_id: 3446,
                      program_type: 105,
                      is_scheme_valid: true
                    }
                  },
                  applicable_scheme: {
                    scheme_id: 3446,
                    program_type: 105,
                    is_scheme_valid: true
                  },
                  tenure_id: "9",
                  tenure_in_month: "9",
                  monthly_installment: 56500,
                  bank_interest_rate: 100000,
                  interest_pay_to_bank: 0,
                  total_offerred_discount_cashback_amount: 0,
                  loan_amount: 550000,
                  auth_amount: 550000
                }
              ]
            },
            {
              issuer_id: 1,
              is_debit_emi_issuer: false,
              tenures: [
                {
                  offer_scheme: {
                    product_details: [
                      {
                        schemes: [],
                        product_code: "40",
                        product_amount: 550000,
                        subvention_cashback_discount: 0,
                        product_discount: 0,
                        subvention_cashback_discount_percentage: 0,
                        product_discount_percentage: 0,
                        bank_interest_rate_percentage: 100000,
                        bank_interest_rate: 9191
                      }
                    ],
                    emi_scheme: {
                      scheme_id: 3450,
                      program_type: 105,
                      is_scheme_valid: true
                    }
                  },
                  applicable_scheme: {
                    scheme_id: 3450,
                    program_type: 105,
                    is_scheme_valid: true
                  },
                  tenure_id: "3",
                  tenure_in_month: "3",
                  monthly_installment: 186397,
                  bank_interest_rate: 100000,
                  interest_pay_to_bank: 9191,
                  total_offerred_discount_cashback_amount: 0,
                  loan_amount: 550000,
                  auth_amount: 550000
                },
                {
                  offer_scheme: {
                    product_details: [
                      {
                        schemes: [],
                        product_code: "40",
                        product_amount: 550000,
                        subvention_cashback_discount: 0,
                        product_discount: 0,
                        subvention_cashback_discount_percentage: 0,
                        product_discount_percentage: 0,
                        bank_interest_rate_percentage: 160000,
                        bank_interest_rate: 37313
                      }
                    ],
                    emi_scheme: {
                      scheme_id: 3450,
                      program_type: 105,
                      is_scheme_valid: true
                    }
                  },
                  applicable_scheme: {
                    scheme_id: 3450,
                    program_type: 105,
                    is_scheme_valid: true
                  },
                  tenure_id: "9",
                  tenure_in_month: "9",
                  monthly_installment: 65257,
                  bank_interest_rate: 160000,
                  interest_pay_to_bank: 37313,
                  total_offerred_discount_cashback_amount: 0,
                  loan_amount: 550000,
                  auth_amount: 550000
                }
              ]
            }
          ]
        },
        {
          card_category: 2,
          issuers: [
            {
              issuer_id: 233,
              is_debit_emi_issuer: true,
              tenures: [
                {
                  offer_scheme: {
                    product_details: [
                      {
                        schemes: [],
                        product_code: "40",
                        product_amount: 550000,
                        subvention_cashback_discount: 0,
                        product_discount: 0,
                        subvention_cashback_discount_percentage: 0,
                        product_discount_percentage: 0,
                        bank_interest_rate_percentage: 160000,
                        bank_interest_rate: 25946
                      }
                    ],
                    emi_scheme: {
                      scheme_id: 3449,
                      program_type: 105,
                      is_scheme_valid: true
                    }
                  },
                  applicable_scheme: {
                    scheme_id: 3449,
                    program_type: 105,
                    is_scheme_valid: true
                  },
                  tenure_id: "6",
                  tenure_in_month: "6",
                  monthly_installment: 95991,
                  bank_interest_rate: 160000,
                  interest_pay_to_bank: 25946,
                  total_offerred_discount_cashback_amount: 0,
                  loan_amount: 550000,
                  auth_amount: 550000
                }
              ]
            }
          ]
        }
      ]
    },
    {
      emi_category: 4,
      emi_category_data: [
        {
          card_category: 1,
          issuers: [
            {
              issuer_id: 4,
              is_debit_emi_issuer: false,
              tenures: [
                {
                  offer_scheme: {
                    product_details: [
                      {
                        schemes: [],
                        product_code: "40",
                        product_amount: 550000,
                        subvention_cashback_discount: 0,
                        product_discount: 0,
                        subvention_cashback_discount_percentage: 0,
                        product_discount_percentage: 0,
                        bank_interest_rate_percentage: 0,
                        bank_interest_rate: 0
                      }
                    ],
                    emi_scheme: {
                      scheme_id: 3446,
                      program_type: 105,
                      is_scheme_valid: true
                    }
                  },
                  applicable_scheme: {
                    scheme_id: 3446,
                    program_type: 105,
                    is_scheme_valid: true
                  },
                  tenure_id: "96",
                  tenure_in_month: "1",
                  monthly_installment: 0,
                  bank_interest_rate: 0,
                  interest_pay_to_bank: 0,
                  total_offerred_discount_cashback_amount: 0,
                  loan_amount: 550000,
                  auth_amount: 550000
                }
              ]
            },
            {
              issuer_id: 3,
              is_debit_emi_issuer: false,
              tenures: [
                {
                  offer_scheme: {
                    product_details: [
                      {
                        schemes: [
                          {
                            scheme_id: 3435,
                            program_type: 112,
                            is_scheme_valid: true
                          }
                        ],
                        product_code: "40",
                        product_amount: 550000,
                        subvention_cashback_discount: 0,
                        product_discount: 0,
                        subvention_cashback_discount_percentage: 0,
                        product_discount_percentage: 0,
                        bank_interest_rate_percentage: 0,
                        bank_interest_rate: 0
                      }
                    ],
                    emi_scheme: {
                      scheme_id: 3445,
                      program_type: 105,
                      is_scheme_valid: true
                    }
                  },
                  applicable_scheme: {
                    scheme_id: 3445,
                    program_type: 105,
                    is_scheme_valid: true
                  },
                  tenure_id: "96",
                  tenure_in_month: "1",
                  monthly_installment: 0,
                  bank_interest_rate: 0,
                  interest_pay_to_bank: 0,
                  total_offerred_discount_cashback_amount: 0,
                  loan_amount: 550000,
                  auth_amount: 550000
                }
              ]
            },
            {
              issuer_id: 8,
              is_debit_emi_issuer: false,
              tenures: [
                {
                  offer_scheme: {
                    product_details: [
                      {
                        schemes: [],
                        product_code: "40",
                        product_amount: 550000,
                        subvention_cashback_discount: 0,
                        product_discount: 0,
                        subvention_cashback_discount_percentage: 0,
                        product_discount_percentage: 0,
                        bank_interest_rate_percentage: 0,
                        bank_interest_rate: 0
                      }
                    ],
                    emi_scheme: {
                      scheme_id: 3447,
                      program_type: 105,
                      is_scheme_valid: true
                    }
                  },
                  applicable_scheme: {
                    scheme_id: 3447,
                    program_type: 105,
                    is_scheme_valid: true
                  },
                  tenure_id: "96",
                  tenure_in_month: "1",
                  monthly_installment: 0,
                  bank_interest_rate: 0,
                  interest_pay_to_bank: 0,
                  total_offerred_discount_cashback_amount: 0,
                  loan_amount: 550000,
                  auth_amount: 550000
                }
              ]
            }
          ]
        }
      ]
    },
    {
      emi_category: 1,
      emi_category_data: [
        {
          card_category: 1,
          issuers: [
            {
              issuer_id: 3,
              is_debit_emi_issuer: false,
              tenures: [
                {
                  offer_scheme: {
                    product_details: [
                      {
                        schemes: [
                          {
                            scheme_id: 3435,
                            program_type: 112,
                            is_scheme_valid: true
                          }
                        ],
                        product_code: "40",
                        product_amount: 550000,
                        subvention_cashback_discount: 55100,
                        product_discount: 0,
                        subvention_cashback_discount_percentage: 100000,
                        product_discount_percentage: 0,
                        subvention_type: 1,
                        bank_interest_rate_percentage: 100000,
                        bank_interest_rate: 8269
                      }
                    ],
                    emi_scheme: {
                      scheme_id: 3445,
                      program_type: 105,
                      is_scheme_valid: true
                    }
                  },
                  applicable_scheme: {
                    scheme_id: 3445,
                    program_type: 105,
                    is_scheme_valid: true
                  },
                  tenure_id: "3",
                  tenure_in_month: "3",
                  monthly_installment: 148767,
                  bank_interest_rate: 100000,
                  interest_pay_to_bank: 0,
                  total_offerred_discount_cashback_amount: 55100,
                  loan_amount: 494900,
                  auth_amount: 494900
                }
              ]
            }
          ]
        }
      ]
    },
    {
      emi_category: 2,
      emi_category_data: [
        {
          card_category: 2,
          issuers: [
            {
              issuer_id: 233,
              is_debit_emi_issuer: true,
              tenures: [
                {
                  offer_scheme: {
                    product_details: [
                      {
                        schemes: [
                          {
                            scheme_id: 3441,
                            program_type: 112,
                            is_scheme_valid: true
                          }
                        ],
                        product_code: "40",
                        product_amount: 550000,
                        subvention_cashback_discount: 55100,
                        product_discount: 0,
                        subvention_cashback_discount_percentage: 100000,
                        product_discount_percentage: 0,
                        subvention_type: 2,
                        bank_interest_rate_percentage: 100000,
                        bank_interest_rate: 8269
                      }
                    ],
                    emi_scheme: {
                      scheme_id: 3449,
                      program_type: 105,
                      is_scheme_valid: true
                    }
                  },
                  applicable_scheme: {
                    scheme_id: 3449,
                    program_type: 105,
                    is_scheme_valid: true
                  },
                  tenure_id: "3",
                  tenure_in_month: "3",
                  monthly_installment: 167723,
                  bank_interest_rate: 100000,
                  interest_pay_to_bank: 8269,
                  total_offerred_discount_cashback_amount: 55100,
                  loan_amount: 494900,
                  auth_amount: 494900
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
console.log(JSON.parse(data1));
