import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { SUCCESS } from "../../../Constants/ResponseCodesConstant";
import { InitiateWalletTransaction } from "../../../../src/stores/actions/CommonAction";

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payment_mode_data: this.props.merchantPaymentData.payment_mode_data.filter(
        x => x.payment_mode_id == 11
      )[0].data,
      selectedWalletName: "",
      mobileNumber: "",
      selectedWallet: {},
      walletsListInIconTray: []
    };
    if (this.state.payment_mode_data.length >= 1) {
      var allWalletList = this.state.payment_mode_data;
      var walletListInIconTray = allWalletList && allWalletList.length > 4 ? allWalletList.slice(0, 4) : allWalletList;
      //this.setState({ walletsListInIconTray: walletListInIconTray })
      this.state.walletsListInIconTray = walletListInIconTray;
    }
  }

  onClickDd = (data) => {
    let WalletName = data.options[data.selectedIndex].value;
    this.setState({
      selectedWalletName: WalletName
    });
  };

  SelectWallet = WalletName => {
    document.getElementById("wallet-dropdown").value = WalletName;
    this.setState({
      selectedWalletName: WalletName
    });
    this.onClickDd(document.getElementById("wallet-dropdown"));
  };

  ValidateMobileNumber = e => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      if (e.target.value.length <= 10) {
        this.setState({ mobileNumber: e.target.value });
      }
    }
  };

  IsValidMobilNumber = () => {
    return this.state.mobileNumber.length != 10;
  };

  PostForm = () => {
    let form = document.createElement("form");
    document.body.appendChild(form);
    form.method = "post";
    form.action =
      process.env.REACT_APP_PG_CONTROLLER +
      "pinepg/v2/submit/wallet?token=" +
      encodeURIComponent(this.props.token);
    form.submit();
  };

  PayNow = () => {
    this.btn.setAttribute("disabled", "disabled");

    let selectedWallet = this.state.payment_mode_data.filter(
      x => x.WalletName == this.state.selectedWalletName
    )[0];
    this.setState({ selectedWallet: selectedWallet });
    var data = {
      lPinePGTxnID: this.props.merchantPaymentData.txn_data.pine_pg_txn_id,
      strMobileNumber: this.state.mobileNumber,
      iWalletID: selectedWallet.WalletId,
      strPaymentOptionCode: selectedWallet.WalletCode,
      merchantId: this.props.merchantPaymentData.merchant_data.merchant_id,
      amountInPaisa: this.props.merchantPaymentData.payment_data.amount_in_paisa
    };
    this.props
      .dispatch(InitiateWalletTransaction(this.props.token, data))
      .then(json => {
        if (json.data.response_code == SUCCESS) {
          this.PostForm();
        } else {
          this.btn.removeAttribute("disabled");
          alert("Something went wrong");
        }
      });
  };

  render() {

    return (
      <div>
        <div
          id="collapsewallets"
          class="card-body collapse active show"
          data-parent="#accordion"
        >
          {this.state.walletsListInIconTray.length > 1 ?
            <h2> Select Wallets </h2> : <></>}
          <div class="col-12 wallets">
            <div className="col-12 p-0 bank-list clearfix">
              <div class="row">
                {this.state.walletsListInIconTray.map(x => (
                  <div class="col-lg-3 col-md-3 col-sm-3 col-6 mb-3">
                    <div
                      id={x.WalletName}
                      className={`bank-list-names  ${this.state.selectedWalletName == x.WalletName
                        ? "active"
                        : ""
                        }`}
                      onClick={() => this.SelectWallet(x.WalletName)}
                    >
                      <div className="bank-name">
                        <img
                          src={"images/" + x.WalletName + ".png"}
                          alt={x.WalletName}
                        />
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
                    id="wallet-dropdown"
                    onChange={() =>
                      this.onClickDd(
                        document.getElementById("wallet-dropdown"),
                        true
                      )
                    }
                  >
                    <option>Select Wallet</option>
                    {this.state.payment_mode_data.map(x =>
                      <option
                        key={x.WalletName}
                        value={x.WalletName}
                      >
                        {x.WalletName}
                      </option>
                    )}
                  </select>
                </div>
              </div>
              <div class=" row emiTypeContent">
                {this.state.selectedWalletName.toUpperCase() == "PAYZAPP"  ? (
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    <input
                      id="mobileNumber"
                      className="form-control"
                      onChange={this.ValidateMobileNumber}
                      value={this.state.mobileNumber}
                      type="text"
                      autoComplete="off"
                      onPaste={event => event.preventDefault()}
                      onCopy={event => event.preventDefault()}
                    ></input>
                    <label for="mobileNumber">Mobile Number</label>
                  </div>
                ) : null}

              </div>
              <div class=" row bdr-top">
                <div id="paynow">
                  <div class="col-12 p-0  mt-3 mb-3 paynow-btn ">
                    <button
                      onClick={() => this.PayNow()}
                      class="btn  btn-green"
                      disabled={
                        this.state.selectedWalletName === "" ||
                        (this.state.selectedWalletName.toUpperCase() == "PAYZAPP" &&
                          this.IsValidMobilNumber())
                      }
                      data-toggle="modal"
                      ref={btn => { this.btn = btn; }}
                    >
                      Pay now
                  </button>
                  </div>
                </div>
              </div>
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
    token: state.merchantPaymentDataFetchingReducer.token
  };
};

export default connect(mapStateToProps, null)(Wallet);
