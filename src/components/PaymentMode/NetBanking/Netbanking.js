import React, { Component } from "react";
import { connect } from "react-redux";
import { CCAVENUE_ACQUIRER } from "../../../Constants/AcquirerConstants";
import $ from "jquery";

class Netbanking extends Component {
  constructor(props) {
    super(props);
    var netbkingPaymentData = this.props.merchantPaymentData.payment_mode_data.filter(
      x => x.payment_mode_id == 3
    )[0].data;
    var paymentModeData = {};
    let imageList = [];
    if (netbkingPaymentData && netbkingPaymentData != null) {
      paymentModeData = netbkingPaymentData.acquirerWisePaymentData;
      imageList = netbkingPaymentData.IssersUIDataList;
    }
    this.state = {
      selectedValue: 0,
      IsSelected: false,
      payment_mode_data: paymentModeData,
      imagesList: [],
      selectedIssuer: null,
      selectedCCAvanueIssuer: false
    };
    if (this.state.payment_mode_data.length >= 1) {
      // this.state.payment_mode_data.map(x => {
      //   if (x && x != null && x.PaymentOption && x.PaymentOption != null) {
      //     x.PaymentOption.map(y => {
      //       let obj = {};
      //       obj["IssuerName"] = y.Name.trim();
      //       obj["IssuerId"] = x.AcquirerId + "_" + y.Code;
      //       imageList.push(obj);
      //     })
      //   }
      // }
      // );
      // imageList = imageList && imageList.length > 4 ? imageList.slice(0, 4) : imageList;
      this.state.imagesList = imageList;
    }
  }

  componentDidMount() {
    if (
      this.state.payment_mode_data.length == 1 &&
      this.state.payment_mode_data[0].AcquirerId == CCAVENUE_ACQUIRER
    ) {
      this.fetchPaymentOptions();
    }
  }

  processData = data => {
    var netBanks = [];
    $("#card_name")
      .children()
      .remove(); // remove old card names from old one
    $("#card_name").append("<option value='0'>Select Bank</option>");
    $.each(data, function () {
      switch (this.payOpt) {
        case "OPTNBK":
          var jsonData = this.OPTNBK;
          var obj = $.parseJSON(jsonData);
          $.each(obj, function () {
            // $("#card_name")
            //   .find("option:last")
            //   .after(
            //     "<option class='" +
            //     this["dataAcceptedAt"] +
            //     " " +
            //     this["status"] +
            //     "'  value='" +
            //     this["cardName"] +
            //     "'>" +
            //     this["cardName"] +
            //     "</option>"
            //   );
            $("#card_name").find("option:last").after("<option class='" + this['dataAcceptedAt'] + " " + this['status'] + "'  value='" + this['cardName'] + "'>" + this['cardName'] + "</option>");
          });
          break;
      }
    });

    // $("#card_name").append(
    //   "<option class='UP CCAvenue' value='AvenuesTest'>AvenuesTest</option>"
    // );
  };

  fetchPaymentOptions = () => {

    /* json object contains
      1) payOptType - Will contain payment options allocated to the merchant. Options may include Credit Card, Net Banking, Debit Card, Cash Cards or Mobile Payments.
      2) cardType - Will contain card type allocated to the merchant. Options may include Credit Card, Net Banking, Debit Card, Cash Cards or Mobile Payments.
      3) cardName - Will contain name of card. E.g. Visa, MasterCard, American Express or and bank name in case of Net banking. 
      4) status - Will help in identifying the status of the payment mode. Options may include Active or Down.
      5) dataAcceptedAt - It tell data accept at CCAvenue or Service provider
      6)error -  This parameter will enable you to troubleshoot any configuration related issues. It will provide error description.
      */
    var jsonData;
    var self = this;
    var paymentProviderUrlValue = $("#PAYMENT_PROVIDER_URL").val();
    if (
      paymentProviderUrlValue == null ||
      paymentProviderUrlValue == undefined
    ) {
      return;
    }
    var PayMentProviderUrl = paymentProviderUrlValue.split("?")[0];
    var access_code = $("#ACCESS_CODE").val(); // "AVLV80FI33AU24VLUA"   // shared by CCAVENUE

    var amount = $("#amount").val(); //;
    var currency = "INR"; //Currency Is INR
    var urlr =
      PayMentProviderUrl +
      "?command=getJsonData&access_code=" +
      access_code +
      "&currency=" +
      currency +
      "&amount=" +
      amount;
    $.ajax({
      url: urlr,
      dataType: "jsonp",
      jsonp: false,
      jsonpCallback: "processData",
      success: function (data) {
        //Process data callback is called automatically

        self.processData(data);
      }.bind(this),
      error: function (xhr, textStatus, errorThrown) {
        console.log("Error occured in fetching banks");
      }
    });
  };

  onCCAvanueChange = event => {
    console.log(event.target.value);
    if (event.target.value === "0") {
      this.setState({ selectedCCAvanueIssuer: false });

    }
    else {
      this.setState({ selectedCCAvanueIssuer: true });

    }
  }

  onClickCardName = () => {
    //this.setState({ selectedCCAvanueIssuer: false })
    $("#CCAvenueNetBankingPaymentOptionCodeError").text("");
    if (
      $(this)
        .find(":selected")
        .hasClass("DOWN")
    ) {
      alert(
        "Selected option is currently unavailable. Select another payment option or try again later."
      );
      $("#card_name").val("0");

      //this.setState({ selectedCCAvanueIssuer: false })
    }
    if (
      $(this)
        .find(":selected")
        .hasClass("CCAvenue")
    ) {
      //this.setState({ selectedCCAvanueIssuer: true })
      $("#data_accept").val("Y");
    } else {
      $("#data_accept").val("N");
    }
  };

  onClickDd = (data, fromDD) => {
    if (fromDD) {
      this.setState({
        selectedIssuer: ""
      });
    }
    let acquirer_paymentOption = data.options[data.selectedIndex].value.split(
      "_"
    );

    let url =
      process.env.REACT_APP_PG_CONTROLLER +
      "Netbanking/ProcessNetBankingRequest?token=" +
      encodeURIComponent(this.props.token);
    let obj = {
      AcquirerId: acquirer_paymentOption[0],
      PaymentOptionCode: acquirer_paymentOption[1],
      PinePgTxnId: this.props.merchantPaymentData.txn_data.pine_pg_txn_id,
      MerchantReturnUrl: this.props.merchantPaymentData.merchant_data
        .merchant_return_url
    };
    this.setState({
      url: url,
      postdata: obj,
      selectedValue: document.getElementById("netbanking-dropdown")
        .selectedIndex
    });
  };

  PayNow = () => {
    this.otherNBbtn.setAttribute("disabled", "disabled");
    document.getElementById("netbanking_form").submit();
  };

  SelectBank = (issuerId, issuerName) => {
    document.getElementById("netbanking-dropdown").value = issuerId;
    this.setState({
      selectedValue: document.getElementById("netbanking-dropdown")
        .selectedIndex,
      selectedIssuer: issuerName
    });
    this.onClickDd(document.getElementById("netbanking-dropdown"), false);
  };

  ccAvenue = () => {
    this.btn.setAttribute("disabled", "disabled");
    document.getElementById("ccAvenueNetBankingForm").submit();
  };

  render() {
    if (
      this.state.payment_mode_data.length == 1 &&
      this.state.payment_mode_data[0].AcquirerId == CCAVENUE_ACQUIRER
    ) {
      return (
        <div
          id="collapsecreditdebit"
          className="card-body "
          data-parent="#accordion"
        >
          <div className="card-body">
            <form
              id="ccAvenueNetBankingForm"
              method="post"
              action={
                process.env.REACT_APP_PG_CONTROLLER +
                "PinePGRedirect/CCAvenueRequestHandler"
              }
            >
              <input
                name="tid"
                type="hidden"
                value={this.props.merchantPaymentData.txn_data.pine_pg_txn_id}
              ></input>
              <input
                type="hidden"
                name="merchant_id"
                value={
                  this.state.payment_mode_data[0].NbCommParams
                    .mERCHNAT_ID_PROVIDER_BY_PAYMENT_PROVIDERField
                }
              ></input>
              <input
                type="hidden"
                name="order_id"
                value={this.props.merchantPaymentData.txn_data.pine_pg_txn_id}
              ></input>
              <input
                type="hidden"
                id="amount"
                name="amount"
                value={this.state.payment_mode_data[0].AmountInRps}
              ></input>
              <input
                type="hidden"
                id="currency"
                name="currency"
                value="INR"
              ></input>
              <input
                type="hidden"
                id="redirect_url"
                name="redirect_url"
                value={
                  this.state.payment_mode_data[0].NbCommParams
                    .pINE_PG_RETURN_URL_TO_RECEIVE_RESPONSE_FROM_PAYMENT_PROVIDERField
                }
              ></input>
              <input
                id="cancel_url"
                type="hidden"
                name="cancel_url"
                value={
                  this.state.payment_mode_data[0].NbCommParams
                    .pINE_PG_RETURN_URL_TO_RECEIVE_RESPONSE_FROM_PAYMENT_PROVIDERField
                }
              ></input>
              <input type="hidden" name="language" value="EN"></input>
              <input type="hidden" name="billing_name" value="Pine Labs"></input>
              <input
                type="hidden"
                id="payment_option"
                name="payment_option"
                value="OPTNBK"
              ></input>
              <input
                type="hidden"
                id="card_type"
                name="card_type"
                value="NBK"
              ></input>
              <input
                type="hidden"
                id="billing_address"
                value="Unitech Infospace Building 2 Sector 62"
              ></input>
              <input type="hidden" name="billing_city" value="Noida"></input>
              <input type="hidden" name="billing_state" value="UP"></input>
              <input type="hidden" name="billing_state" value="UP"></input>
              <input type="hidden" name="billing_zip" value="201301"></input>
              <input type="hidden" name="billing_country" value="India"></input>
              <input type="hidden" name="billing_tel" value="9999999999"></input>
              <input
                type="hidden"
                name="billing_email"
                value="test@pinelabs.com"
              ></input>
              <input type="hidden" name="delivery_name" value="Pine Labs"></input>
              <input
                type="hidden"
                name="delivery_address"
                value="Unitech Infospace Building 2 Sector 62"
              ></input>
              <input type="hidden" name="delivery_state" value="UP"></input>
              <input type="hidden" name="delivery_city" value="Noida"></input>
              <input type="hidden" name="delivery_zip" value="201301"></input>
              <input type="hidden" name="delivery_country" value="India"></input>
              <input type="hidden" name="delivery_tel" value="9999999999"></input>
              <input
                type="hidden"
                name="merchant_param1"
                value="additional Info."
              ></input>
              <input
                type="hidden"
                name="merchant_param2"
                value="additional Info."
              ></input>
              <input
                type="hidden"
                name="merchant_param3"
                value="additional Info."
              ></input>
              <input
                type="hidden"
                name="merchant_param4"
                value="additional Info."
              ></input>
              <input
                type="hidden"
                name="merchant_param5"
                value="additional Info."
              ></input>
              <input
                type="hidden"
                id="ACCESS_CODE"
                name="ACCESS_CODE"
                value={
                  this.state.payment_mode_data[0].NbCommParams
                    .pinePGAccessCodeField
                }
              ></input>
              <input
                type="hidden"
                id="PAYMENT_PROVIDER_URL"
                name="PAYMENT_PROVIDER_URL"
                value={
                  this.state.payment_mode_data[0].NbCommParams
                    .pAYMENT_PROVIDER_URLField
                }
              ></input>
              <input
                type="hidden"
                name="MERCHNAT_ID"
                value={this.props.merchantPaymentData.merchant_data.merchant_id}
              ></input>
              <input
                type="hidden"
                id="PINE_PG_TXN_ID"
                name="PINE_PG_TXN_ID"
                value={this.props.merchantPaymentData.txn_data.pine_pg_txn_id}
              ></input>
              {/* <div>
                <div className="col-lg-6  col-md-6  col-sm-12 offset-lg-6 offset-md-6 col-12  pull-right">
                  <select
                    className="form-control"
                    onClick={this.onClickCardName}
                    onChange={event => this.onCCAvanueChange(event)}
                    name="card_name"
                    id="card_name"
                  >
                    <option value="0">Select Bank</option>
                  </select>
                </div>
                <p
                  id="CCAvenueNetBankingPaymentOptionCodeError"
                  className="error"
                ></p>
              </div> */}
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-12  mt-3">
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-12  mt-3   pull-right">
                  <select
                    className="form-control"
                    onClick={this.onClickCardName}
                    onChange={event => this.onCCAvanueChange(event)}
                    name="card_name"
                    id="card_name"
                  >
                    <option value="0">Select Bank</option>
                  </select>
                  <p
                    id="CCAvenueNetBankingPaymentOptionCodeError"
                    className="error"
                  ></p>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-12  p-0 mt-3 mb-3 paynow-btn ">
                  <button
                    className="btn  btn-green mr-3"
                    onClick={this.ccAvenue}
                    id="CCAvenueNetBankingBtn"
                    disabled={!this.state.selectedCCAvanueIssuer}
                    ref={btn => { this.btn = btn; }}
                  >
                    Pay Now
            </button>
                </div>
              </div>

            </form>

            {/* <div>
              <button
                className="btn  btn-green mr-3"
                onClick={this.ccAvenue}
                id="CCAvenueNetBankingBtn"
                disabled={!this.state.selectedCCAvanueIssuer}
                ref={btn => { this.btn = btn; }}
              >
                Pay Now
            </button>
            </div> */}
          </div>
        </div >
      );
    }

    return (
      <div className="card mb-0">
        <div
          id="collapsenetbanking"
          className="card-body collapse active show"
          data-parent="#accordion"
        >
          <h1>Select Bank</h1>
          <div className="col-12 wallets">
            <div className="col-12 p-0 bank-list clearfix">
              <div className="row">
                {this.state.imagesList.map(x => (
                  <div className="col-lg-3 col-md-3 col-sm-6 col-12 ">
                    <div
                      className={`bank-list-names  ${
                        this.state.selectedIssuer == x.IssuerName
                          ? "active"
                          : ""
                        }`}
                      id={x.IssuerName}
                      onClick={() => this.SelectBank(x.IssuerId, x.IssuerName)}
                    >
                      <div className="bank-name">
                        <img src={"images/" + x.IssuerName + ".png"} />
                        <span>{x.IssuerName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row">
                <div className="col-12 orbanklist">
                  <span>or</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-6  col-md-6  col-sm-12 offset-lg-6 offset-md-6 col-12  pull-right">
                  <div class="other-banks"></div>
                  <select
                    className="form-control"
                    id="netbanking-dropdown"
                    onChange={() =>
                      this.onClickDd(
                        document.getElementById("netbanking-dropdown"),
                        true
                      )
                    }
                  >
                    <option>Select Bank</option>
                    {this.state.payment_mode_data.map(x =>
                      x.PaymentOption.map(y => (
                        <option
                          key={x.AcquirerId + "_" + y.Code}
                          value={x.AcquirerId + "_" + y.Code}
                        >
                          {y.Name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-12 p-0 mt-3 mb-3 paynow-btn ">
                  <button
                    className="btn btn-green mr-3"
                    disabled={this.state.selectedValue === 0}
                    onClick={this.PayNow}
                    ref={otherNBbtn => { this.otherNBbtn = otherNBbtn; }}
                  >
                    Pay Now
                  </button>
                </div>
              </div>

              {this.state.postdata ? (
                <form
                  id="netbanking_form"
                  action={this.state.url}
                  method="post"
                >
                  <input
                    type="hidden"
                    name="AcquirerId"
                    value={this.state.postdata.AcquirerId}
                  ></input>
                  <input
                    type="hidden"
                    name="PaymentOptionCode"
                    value={this.state.postdata.PaymentOptionCode}
                  ></input>
                  <input
                    type="hidden"
                    name="PinePgTxnId"
                    value={this.state.postdata.PinePgTxnId}
                  ></input>
                  <input
                    type="hidden"
                    name="MerchantReturnUrl"
                    value={this.state.postdata.MerchantReturnUrl}
                  ></input>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    merchantPaymentData:
      state.merchantPaymentDataFetchingReducer.merchantPaymentData,
    token: state.merchantPaymentDataFetchingReducer.token,
    paymentAmountUI: state.merchantPaymentDataFetchingReducer.paymentAmountUI
  };
};

export default connect(mapStateToProps, null)(Netbanking);
