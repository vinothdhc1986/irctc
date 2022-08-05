
import React, { Component } from 'react';



class SavedCard extends Component {



    render() {
        return (
            <div class="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                <div class="pull-left bank-card" onClick={this.props.onClick} id={this.props.key}>
                    <div class="col-lg-10 col-md-10 col-sm-10 col-12  p-0 bank-card-details ">
                        {/* src={"../../${process.env.PUBLIC_URL}/images/banks/" + this.props.issuerName + ".png"} */}

                        <img src={`../../${process.env.PUBLIC_URL}/images/banks/${this.props.issuerName}.png`} class="pull-left mr-2" alt="hdfc bank" />
                        {this.props.issuerName} Bank Card <br></br>
                        <span class="pull-left">{this.props.cardNumber}</span>
                        {this.props.expiryMonth === "00" ? null :
                            <span class="pull-right">Expiry {this.props.expiryMonth}/{this.props.expiryYear.substring(2, 4)}</span>}
                        {this.props.MobileNumber != "" ? <span class="pull-right">  Registered Mobile No. {this.props.MobileNumber}
                        </span> : null}
                        <a class="remove-bank-card" onClick={this.props.onRemove}><span class="bank-card-select"></span></a>
                    </div>
                </div>
                {(this.props.IsSavedCardContainsSpecialOffers) ? (
                    <span class="text-blue fs-11">
                        Special offer available
                    </span>
                ) : (null)}

                <span className="error-block">
                    {this.props.errorMsg}
                </span>


            </div >



        );
    }








}


//export default Radium(person);

export default SavedCard;



