import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { site_key } from "../../configuration/config";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./ConfirmDetails.css";

class ConfirmDetailsPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // password for login
      password: "",
      //forgot passowrd
      email: props.userData.email,
      emailError: props.errorUserData.forgotPasswordEmail,
      recaptchaToken: "",
    };
  }

  //handle change for forgot password flow
  handleForgotPassword = (e) => {
    let type = e.target.id;
    let value = e.target.value;
    let error = this.state.emailError;

    // email
    if (type === "emailAddress") {
      let regex = new RegExp(
        '^(([^<>()[\\]\\.,;:\\s@"]+(\\.[^<>()[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
      );
      if (regex.test(value)) {
        error = "";
        this.setState({ emailError: error });
        this.checkAndMoveToLogin(error);
      } else {
        error = "Please enter a valid email address";
        this.props.setrightFooterButtonDisabled(true);
      }
      this.setState({
        emailError: error,
        email: value,
      });
      let userData = this.props.userData;
      userData["email"] = value;
      this.props.setUserData(userData);
      let errorUserData = this.props.errorUserData;
      errorUserData["forgotPasswordEmail"] = error;
      this.props.setErrorUserData(errorUserData);
      this.setState({ emailError: error });
    }
  };

  // handle change to record password and validate
  handleChange = (e) => {
    let type = e.target.id;
    let value = e.target.value.trim();
    let error = this.props.errorUserData.password;

    // password
    if (type === "password") {
      let regex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{7,20}$");
      if (regex.test(value)) {
        error = "";
        this.props.setrightFooterButtonDisabled(false);
        let userData = this.props.userData;
        userData["password"] = value;
        this.props.setUserData(userData);
      } else {
        error =
          // "Password length must be at least with one letter, one Uppercase letter and one digit ";
          "Password must be at least 7 characters long and must contain at least 1 upper case letter, 1 lower case letter and 1 digit.";
        this.props.setrightFooterButtonDisabled(true);
      }
    }

    this.setState({ password: value });
    let errorUserData = this.props.errorUserData;
    errorUserData["password"] = error;
    this.props.setErrorUserData(errorUserData);
  };

  componentDidMount = () => {
    let errorUserData = this.props.errorUserData;
    errorUserData["password"] = "";
    this.props.setErrorUserData(errorUserData);
    this.props.setShowSentEmailText(false);
  };

  onChangeReCaptcha = (recaptchaToken) => {
    if (recaptchaToken === null) {
      recaptchaToken = "";
    }
    this.setState({ recaptchaToken });
    this.checkAndMoveToLogin(this.props.errorUserData.email);
  };

  checkAndMoveToLogin = (errorEmail) => {
    if (this.state.recaptchaToken.length > 0 && errorEmail === "") {
      this.props.setrightFooterButtonDisabled(false);
    } else {
      this.props.setrightFooterButtonDisabled(true);
    }
  };

  scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  render() {
    const { password, email, emailError } = this.state;
    const { errorUserData } = this.props;

    return (
      <React.Fragment>
        <div className={window.innerWidth >= 550 ? "componentMargin2 " : "mobileComponent"}>
          {/* <span className="head2">Hey, there!</span> */}
          <span className='head2'>WELCOME IN!</span>

          {/* <div className='staticText1'>Welcome {this.props.userData.first_name !== "" ? "back!" : null}</div> */}

          {/* <div className="staticText2">We are excited to have you as a member of the Scout &amp; Cellar™ Family.</div> */}

          {/* input to accept Password  */}

          {this.props.customer && (
            <div
              className='SubText'
              style={{ clear: "both", marginTop: "25px", maxWidth: "600px" }}
            >
              If your email address is already linked to a Scout & Cellar customer account, enter that password here.
            </div>
          )}

          <div className='password1 form-group'>
          {!this.props.customer && (
            <label className='passwordLabel' htmlFor='password'>
              Create a password
            </label>)}
            <div className='wrapper-email'>
              <div className='InputMargin one'>
                <input
                  style={{ width: "40%" }}
                  type='password'
                  // autocomplete="none"
                  // autoComplete="none"
                  value={password}
                  className={
                    errorUserData.password && errorUserData.password.length > 0
                      ? "form-control Red"
                      : "form-control Input"
                  }
                  id='password'
                  name='password'
                  placeholder='Enter your password'
                  onChange={this.handleChange}
                  disabled={this.props.displayForgotPassword}
                />

                {/* error message incase for incorrect password */}
                {errorUserData.password && errorUserData.password.length > 0 ? (
                  <span className='errorMes'>
                    {errorUserData.password}
                    <br />
                  </span>
                ) : null}
              </div>
              {!this.props.displayForgotPassword ? (
                <div
                  className={
                    !this.props.rightFooterButtonDisabled
                      ? "NextarrowForwardIcon two"
                      : "NextarrowForwardIcon NextarrowForwardIconDisabled two"
                  }
                  onClick={() => {
                    if (!this.props.rightFooterButtonDisabled) {
                      if (this.props.rightFooterButtonName === "LOG IN") {
                        //call API to Login (API CALL IN Home)
                        this.props.apiLogin();
                      }
                    }
                  }}
                >
                  <ArrowForwardIosIcon style={{ color: "white" }} />
                </div>
              ) : null}
            </div>
            {/* <div style={{ clear: "both" }}>
              <span className='SubText' style={{ clear: "both" }}>
                Forgot Your Password? &nbsp;
              </span>
              link to forgot password
              <span
                style={{clear: "both"}}
                className="passwordForgotLink"
                onClick={() => {
                  this.props.setForgotPassword();
                  this.setState({
                    password: "",
                    recaptchaToken: "",
                  });
                  let userData = this.props.userData;
                  userData["password"] = "";
                  this.props.setUserData(userData);
                  let errorUserData = this.props.errorUserData;
                  errorUserData["password"] = "";
                  this.props.setErrorUserData(errorUserData);
                  this.props.setButtonName("CONTINUE ");
                  this.props.setrightFooterButtonDisabled(true);
                }}
              >
                Let's Find it
              </span>
            </div> */}
          </div>

          {!this.props.customer && (
            <div style={{ marginTop: "30px", marginBottom: "30px", maxWidth: "600px" }}>
              <div className='SubText' style={{ clear: "both" }}>
                Did you start this process but already forgot your password? (It happens.)
              </div>
              {/* link to forgot password */}
              <div
                style={{ clear: "both" }}
                className='passwordForgotLink'
                onClick={() => {
                  this.props.setForgotPassword();
                  this.setState({
                    password: "",
                    recaptchaToken: "",
                  });
                  let userData = this.props.userData;
                  userData["password"] = "";
                  this.props.setUserData(userData);
                  let errorUserData = this.props.errorUserData;
                  errorUserData["password"] = "";
                  this.props.setErrorUserData(errorUserData);
                  this.props.setButtonName("CONTINUE ");
                  this.props.setrightFooterButtonDisabled(true);
                }}
              >
                Click here to reset
              </div>
            </div>
          )}

          {this.props.customer && (
            <div style={{ marginTop: "30px", marginBottom: "30px", maxWidth: "700px" }}>
              <div className='SubText' style={{ clear: "both" }}>
                Already a Scout & Cellar customer but forgot your password?
              </div>

              {/* link to forgot password */}

              <a style={{ textDecoration: "none" }} href='https://team.scoutandcellar.com/Account/ForgotPassword' target="_blank">
                <div style={{ clear: "both" }} className='passwordForgotLink'>
                  Click here to reset
                </div>
              </a>
            </div>
          )}

          {/* forgot password flow */}
          {this.props.displayForgotPassword ? (
            <>
              <div className='row'>
                <div className='col-lg-8 col-md-8 col-sm-5'>
                  <div className='forgotPassowordContainer'>
                    <span className='head2'>FORGOT YOUR PASSWORD?</span>
                    {!this.props.customer ? (
                      <>
                        <div className='forgotpasswordText1'>Enter your email to be sent a password.</div>
                        <div className='email1 form-group'>
                          <label className='emailLabel' htmlFor='emailAddress'>
                            EMAIL ADDRESS
                          </label>
                          {/* input to accept email address */}
                          <div className='wrapper-email'>
                            <div className='InputMargin one1'>
                              <input
                                type='text'
                                value={email}
                                className={emailError.length > 0 ? "form-control Red" : "form-control Input"}
                                id='emailAddress'
                                name='emailAddress'
                                placeholder='Enter email address'
                                // autocomplete="none"
                                // autoComplete="none"
                                onChange={this.handleForgotPassword}
                              />
                              {/* error handling of email field */}

                              {errorUserData.forgotPasswordEmail.length > 0 ? (
                                <span className='errorMes'>
                                  {errorUserData.forgotPasswordEmail}
                                  <br />
                                </span>
                              ) : null}
                            </div>
                            <div
                              className={
                                !this.props.rightFooterButtonDisabled
                                  ? "NextarrowForwardIcon two1"
                                  : "NextarrowForwardIcon NextarrowForwardIconDisabled two1"
                              }
                              onClick={() => {
                                if (!this.props.rightFooterButtonDisabled) {
                                  if (this.props.rightFooterButtonName === "CONTINUE ") {
                                    //call API to forgot password (API CALL IN Home)
                                    this.props.apiForgotPassword();
                                  }
                                }
                              }}
                            >
                              <ArrowForwardIosIcon style={{ color: "white" }} />
                            </div>
                          </div>
                        </div>
                        <ReCAPTCHA
                          style={{ clear: "both" }}
                          data-size='compact'
                          className='ReCAPTCHA'
                          sitekey={site_key}
                          onChange={this.onChangeReCaptcha}
                        />
                        {this.scrollToBottom()}
                      </>
                    ) : (
                      <>
                        <div className='customer-forgot-password'>
                          <ul>
                            {/* <li>
                              Check your customer email for a forgot password /
                              reset email.
                            </li> */}
                            <li>
                              Visit{" "}
                              <a href='https://scoutandcellar.com/login/' target={"_blank"}>
                                ScoutandCellar.com
                              </a>{" "}
                              to reset your password.
                            </li>
                            <li>Come back and re-attempt the login with your changed password.</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : this.props.showSentEmailText ? (
            <div className='forgot-password-confirmation'>
              <CheckCircleIcon
                className='forgot-password-confirmation-Icon '
                style={
                  window.innerWidth <= 850
                    ? window.innerWidth <= 550
                      ? { fontSize: 20 }
                      : { fontSize: 23 }
                    : { fontSize: 30 }
                }
              />{" "}
              A password is sent to your email
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default ConfirmDetailsPasswordPage;
