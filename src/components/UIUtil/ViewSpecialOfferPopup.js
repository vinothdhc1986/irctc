import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../../stores/reducers";
import thunk from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(thunk));

class ViewSpecialOfferPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultStyleName: {
                opacity: 1,
                display: "block"
            },

            defaultBackdropClassName: "modal-backdrop fade show"
        };

        this.onClosed = this.onClosed.bind(this);
    }

    onClosed() {
        console.log('popup closed');
        this.setState({
            defaultStyleName: {
                opacity: 0,
                display: "none"
            },
            defaultBackdropClassName: null
        });
        if (typeof this.props.onClose == "function") {
            this.props.onClose();
        }
    }

    render() {
        const { onClose } = this.props;
        return ReactDOM.createPortal(
            <Provider store={store}>
                <React.Fragment>
                    <div
                        className="modal fade text-center"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="exampleModalCenterTitle"
                        aria-hidden="true"
                        style={this.state.defaultStyleName}
                    >

                        <div className="modal-dialog height-EMI">


                            <div class="modal-content" >
                                {/* <div id="PopupModalContentCancel" >
                                    <button
                                        type="button"
                                        className="close text-right"
                                        data-dismiss="modal"
                                        onClick={this.onClosed}
                                    >
                                        &times;
                                </button>
                                </div> */}
                                <div class="modal-body-SpecialOffers terms-conditions-panel" style={{ height: "400px" }}>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0 " >
                                        <h2>
                                            Bank Offers</h2>
                                    </div>
                                    <div className="row">
                                    </div>
                                    <div class="text-left">
                                        {/* <ul>
                                            <li><b> ICICI Bank Debit Card</b>: You will pay Rs. 15204 per month for 3 months</li>
                                            <li><b> ICICI Bank Debit Card</b>: You will pay Rs. 15204 per month for 3 months</li>
                                            <li><b> ICICI Bank Debit Card</b>: You will pay Rs. 15204 per month for 3 months</li>

                                        </ul> */}

                                        {this.props.listDataForSpecialOffer}
                                    </div>
                                </div>

                                <div
                                // class="modal-body-SpecialOffers terms-conditions-panel"
                                >
                                    <div id="PopupModalContentEMI" >
                                        {/* <button className="btn btn-green mt-2  mb-2 btn-block" onClick={this.onClosed}> */}
                                        <button className="btn btn-green  btn-block" onClick={this.onClosed}>
                                            {" "}
                                Close
                                        </button>
                                    </div>
                                </div>
                            </div>




                        </div>
                    </div>
                    <div className={this.state.defaultBackdropClassName}></div>
                </React.Fragment >
            </Provider >,
            document.getElementById("popUpRoot")
        );
    }
}

export default ViewSpecialOfferPopup;


