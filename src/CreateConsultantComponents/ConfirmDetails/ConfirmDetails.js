import React from "react";
import "./ConfirmDetails.css";
import ConfirmDetailsPasswordPage from "./ConfirmDetailsPasswordPage";
import ConfirmDetailsDisplay from "./ConfirmDetailsDisplay";
import ConfirmDetailsEdit from "./ConfirmDetailsEdit";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

class ConfirmDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //to get user email address
      form: {
        emailAddress: "",
      },
    };
  }

  // to handle change in email input and validate email
  handleChange = (e) => {
    let type = e.target.id;
    let value = e.target.value;
    let form = this.state.form;
    let error = this.props.errorUserData;

    // email
    if (type === "emailAddress") {
      let regex = new RegExp(
        '^(([^<>()[\\]\\.,;:\\s@"]+(\\.[^<>()[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
      );
      if (regex.test(value)) {
        this.props.setUserData({ email: value });
        error["email"] = "";
        this.props.setErrorUserData(error);
        this.props.setrightFooterButtonDisabled(false);
        let userData = this.props.userData;
        userData["email"] = value;
        this.props.setUserData(userData);
      } else {
        error["email"] = "Please enter a valid email address";
        this.props.setErrorUserData(error);
        this.props.setrightFooterButtonDisabled(true);
      }
    }
    form[type] = value;
    this.setState({ form: form });
  };

  render() {
    const { form } = this.state;
    const { rightFooterButtonName, userData, errorUserData, setErrorUserData } = this.props;
    return (
      <React.Fragment>
        {rightFooterButtonName === "NEXT" ? (
          <div className={window.innerWidth >= 550 ? "componentMargin1 " : "mobileComponent"}>
            <span className='signAsConsultant'>SIGN UP TO BECOME A CONSULTANT</span>
            <div className='email1 form-group'>
              {/* ™ */}
              <div className='SubText' style={{ clear: "both", marginBottom: "25px" }}>
                Enter the email address you’d like to use for your Scout &amp; Cellar business.
              </div>
              {/* ™ */}
              <div className='SubText' style={{ clear: "both", marginBottom: "25px", maxWidth: "816px" }}>
                Already have a Scout &amp; Cellar customer account and want to use your same email? You will need your
                password handy for the next step. If you’ve forgotten it,{" "}
                <a href='https://team.scoutandcellar.com/Account/ForgotPassword' target='_blank'>
                  <span style={{ clear: "both" }} className='passwordForgotLink'>
                    click here to reset your password
                  </span>
                </a>
                . (Don’t be gone too long! We miss you already!)
              </div>
              <label className='emailLabel' htmlFor='emailAddress'>
                EMAIL ADDRESS
              </label>
              {/* input to accept email address */}
              <div className='wrapper-email'>
                <div className='InputMargin one'>
                  <input
                    type='text'
                    value={form["emailAddress"]}
                    className={errorUserData.email.length > 0 ? "form-control Red" : "form-control Input"}
                    id='emailAddress'
                    name='emailAddress'
                    placeholder='Enter email address'
                    // autocomplete="none"
                    // autoComplete="none"
                    onChange={this.handleChange}
                  />

                  {/* error handling of email field */}

                  {errorUserData.email.length ? (
                    <span className='errorMes'>
                      {errorUserData.email === "This email address is in use for an existing Consultant Account." ? (
                        <>
                          <span>
                            This email address is already in use for an existing Consultant Account. Please login into{" "}
                          </span>
                          <a href='https://team.scoutandcellar.com/Account/Login'>
                            https://team.scoutandcellar.com/Account/Login
                          </a>
                        </>
                      ) : (
                        errorUserData.email
                      )}
                      <br />
                    </span>
                  ) : null}
                </div>

                <div
                  className={
                    !this.props.rightFooterButtonDisabled
                      ? "NextarrowForwardIcon two"
                      : "NextarrowForwardIcon NextarrowForwardIconDisabled two"
                  }
                  onClick={() => {
                    if (!this.props.rightFooterButtonDisabled) {
                      if (this.props.rightFooterButtonName === "NEXT") {
                        //call API to verify email (API CALL IN Home)
                        this.props.apiVerifyEmail();
                      }
                    }
                  }}
                >
                  <ArrowForwardIosIcon style={{ color: "white" }} />
                </div>
              </div>

              {/* Static text dispayed at the bottom of email field */}
              {/* <div className="SubText" style={{ clear: "both" }}>
                The email you already use or want to use with Scout &amp;
                Cellar™.
              </div> */}
            </div>
          </div>
        ) : rightFooterButtonName === "LOG IN" || rightFooterButtonName === "CONTINUE " ? (
          // to display the password page of cnfirm details
          <ConfirmDetailsPasswordPage
            userData={userData}
            rightFooterButtonName={this.props.rightFooterButtonName}
            setUserData={this.props.setUserData}
            setButtonName={this.props.setButtonName}
            setrightFooterButtonDisabled={this.props.setrightFooterButtonDisabled}
            errorUserData={errorUserData}
            setErrorUserData={setErrorUserData}
            displayForgotPassword={this.props.displayForgotPassword}
            setForgotPassword={this.props.setForgotPassword}
            handleBackButton={this.props.handleBackButton}
            showSentEmailText={this.props.showSentEmailText}
            setShowSentEmailText={this.props.setShowSentEmailText}
            apiLogin={this.props.apiLogin}
            rightFooterButtonDisabled={this.props.rightFooterButtonDisabled}
            apiForgotPassword={this.props.apiForgotPassword}
            customer={this.props.customer}
          />
        ) : rightFooterButtonName === "LOOKS GOOD" ? (
          //to display confirm details page
          <ConfirmDetailsDisplay
            userData={userData}
            setrightFooterButtonDisabled={this.props.setrightFooterButtonDisabled}
            handleBackButton={this.props.handleBackButton}
            topBarNavigation={this.props.topBarNavigation}
          />
        ) : (
          //to display editable version  of confirm details page
          <ConfirmDetailsEdit
            userData={this.props.userData}
            setrightFooterButtonDisabled={this.props.setrightFooterButtonDisabled}
            setUserData={this.props.setUserData}
            setButtonName={this.props.setButtonName}
            handleBackButton={this.props.handleBackButton}
            apiGetWorkingWithDropDownData={this.props.apiGetWorkingWithDropDownData}
            working_with_arr={this.props.working_with_arr}
            fixedWorkingWith={this.props.fixedWorkingWith}
            topBarNavigation={this.props.topBarNavigation}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ConfirmDetails;
