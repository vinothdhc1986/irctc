import React from "react";
import pl from "../../images/edge-power-by-pinelabs-logo.png";
import "../../css/style.css";
class HeaderTopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.error = null;
    this.loading = null;
  }

  render() {
    this.error = this.props.error;
    this.loading = this.props.loading;

    return (
      <>
        <div className="main-header">
          <div className="container">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
              <div class="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-6 text-left">
                  {" "}
                  <img src={pl} />{" "}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-6 text-right">
                  {" "}
                  <img src={this.props.merchantLogoSrc} />{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default HeaderTopBar;
