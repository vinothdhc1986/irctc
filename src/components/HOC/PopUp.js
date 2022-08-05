import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../../stores/reducers";
import thunk from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(thunk));

class PopUp extends React.Component {
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
            <div className="modal-dialog height-big">
              {/* <button
                type="button"
                className=" close text-right"
                data-dismiss="modal"
                onClick={this.onClose}
              >
                &times;
              </button> */}
           

              
              <div id="PopupModalContent" className="modal-content">
                <div className="modal-body clearfix"
                >{this.props.children}
                  {this.props.isContinueButtonToBeHide ? null : (
                    <button className="btn btn-green mt-2  mb-2 btn-block" onClick={this.onClosed}>
                      {" "}
                    Continue
                    </button>
                  )}
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

export default PopUp;
