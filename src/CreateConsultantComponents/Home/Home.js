import React from "react";
import PropTypes from "prop-types";
import { identify } from "@fullstory/browser";
import { withStyles } from "@mui/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import "./Home.css";
import ConfirmDetails from "../ConfirmDetails/ConfirmDetails";
import BusinessDetails from "../BusinessDetails/BusinessDetails";
import Footer from "../Footer/Footer";
import VerifyIdentity from "../VerifyIdentity/VerifyIdentity";
import PurchaseKit from "../PurchaseKit/PurchaseKit";
import PaymentConfirmation from "../PaymentConfirmation/PaymentConfirmation";
import StepConnector from "@mui/material/StepConnector";
import Logo from "../../Assets/images/ScoutAndCellar.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import * as API from "../../configuration/apiconfig";
import CircularProgress from "@mui/joy/CircularProgress";
import axios from "axios";
import { algoliaURL, getWorkingWithURL } from "../../configuration/config";
import swal from "sweetalert";
import moment from "moment";
import Spinner from "../../common/Spinner";
require("typeface-oswald");
require("typeface-domine");

//style for stepper
const styles = (theme) => ({
  step: {
    color: "#f2efed ",
    border: "1px solid #A6A6A6",
    borderRadius: "50%",
    fontFamily: "proxima-nova",
    fontWeight: 600,

    "&:not($active)": {
      "&:not($completed)": {
        fill: "white !important",
      },
    },

    "& $completed": {
      color: "#085250",
      border: "0px solid white",
      borderRadius: "0%",
    },
    "& $active": {
      color: "#FFFFFF", // Active step color is white
      border: "0px solid white",
      borderRadius: "0%",
    },
  },
  step1: {
    "& $completed": {
      fill: "#085250",
      border: "0px solid white",
      borderRadius: "0%",
    },
    "& $active": {
      border: "0px solid white",
      borderRadius: "0%",
      fill: "#085250",
    },
  },

  step2: {
    "& $active": {
      fill: "#241F20 !important",
      border: "0px solid #241F20",
      borderRadius: "0%",
    },
  },

  step3: {
    fill: "#f2efed",
    border: "2px solid white",
    borderRadius: "50%",
    "& $completed": {
      fill: "#085250",
      border: "0px solid white",
      borderRadius: "0%",
    },
    "& $active": {
      border: "0px solid white",
      borderRadius: "0%",
      fill: "#085250",
    },
  },

  alternativeLabel: {},
  active: {},
  completed: {},
  disabled: {},
});

//style for stepper connector
const GreenStepConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 30px)",
    right: "calc(50% + 16px)",
  },
  active: {
    "& $line": {
      borderColor: "black",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#085250",
    },
  },
  line: {
    borderColor: "#085250",
    borderTopWidth: 1,
    borderRadius: 1,
  },
})(StepConnector);

//mobile stepper connector
const MobileStepConnector = withStyles({
  active: {
    "& $line": {
      borderColor: "black",
    },
  },
  line: {
    borderColor: "white",
    borderTopWidth: 1,
    borderRadius: 2,
  },
})(StepConnector);

class Home extends React.Component {
  constructor() {
    super();
    //background color
    document.body.style = "background: #ffffff";
    this.state = {
      //active step for stepper and to display appropriate screen
      activeStep: 0,
      //label for footer right side button
      rightFooterButtonName: "NEXT",
      // footer right side button (disable/enable)
      rightFooterButtonDisabled: true,
      //get userdata by making axios call
      userData: {
        accessToken: "",
        refreshToken: "",
        id: "",
        email: "",
        phonenumber: "",
        address: "",
        working_with: {
          id: 1,
          name: "",
          displayId: "",
        },
        url: "",
        ssn: "",
        doing_business: "Individual",
        isemail_verified: false,
        first_name: "",
        last_name: "",
        customer: false,
        consultant: false,
        dateofbirth: "",
        screen: 0,
        // note: address is stored on the address varialble itself as a json
        // and copied into these variables (below 4) during backend call
        // since backend format is different.
        street: "",
        zipcode: "",
        city: "",
        state: "",
        indepedent_agreement: false,
        policy_procedures: false,
        cart_id: "",
        dob: {
          year: 1970,
          month: 0,
          day: 1,
        },
      },
      // userData Error
      errorUserData: {
        email: "",
        ssn: "",
        password: "",
        forgotPasswordEmail: "",
      },
      //to check if url is available
      checkURLAvailability: false,
      //current agreement displayed
      currentAgreement: false,
      //purchase kit details
      purchaseKitDetails: {
        subtotal: 0,
        shipping: 0,
        salestax: 0,
        discount: 0,
        total: 0,
        discountDescription: "",
      },
      //purchase kit card info
      cardinfo: {
        cardnumber: "",
        expiryMonth: "",
        expiryYear: "",
        expiryFullYear: "",
        cvv: "",
        nameoncard: "",
      },
      //address change
      addresschange: false,
      //billing address
      billingAddress: {
        city: "",
        zipcode: 0,
        state: "",
        country: "",
        street: "",
      },

      // state variable to (enable/disable) footer
      displayFooter: true,
      //display loader
      load: false,
      //display forgot password
      displayForgotPassword: false,
      //confirmation screen
      confirmation: false,
      //alogoliya hits
      working_with_arr: [],
      //consultant_id
      consultant_number: 0,
      //consulatnt payment error
      consultant_error: "",
      //email sent confirmation text display
      showSentEmailText: false,
      //use fixed working with
      fixedWorkingWith: false,
      // customer
      customer: false,
      couponCodeMessage: {
        success: false,
        message: "",
      },
    };
  }

  scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  handleKeypress = (e) => {
    if (e.key === "Enter") {
      this.handleClickRight();
    }
  };

  moveBack = (label) => {
    let currentScreen = this.state.activeStep;
    let expected = 0;
    if (label === "CONFIRM DETAILS") {
      expected = 0;
    } else if (label === "BUSINESS DETAILS") {
      expected = 1;
    } else if (label === "REVIEW TERMS") {
      expected = 2;
    } else if (label === "PURCHASE KIT") {
      expected = 3;
    }

    return expected <= currentScreen;
  };

  checkMaxScreenCovered = () => {
    if (this.state.cart_id !== "") {
      return 3;
    } else if (this.state.userData.indepedent_agreement && this.state.userData.policy_procedures) {
      return 2;
    } else if (this.state.checkURLAvailability && this.state.errorUserData.ssn === "") {
      return 1;
    } else {
      return 0;
    }
  };

  userRequestedScreen = (label) => {
    if (label === "CONFIRM DETAILS") {
      return 0;
    } else if (label === "BUSINESS DETAILS") {
      return 1;
    } else if (label === "REVIEW TERMS") {
      return 2;
    } else if (label === "PURCHASE KIT") {
      return 3;
    }
  };

  //top bar navigation
  topBarNavigation = async (label) => {
    let rightFooterButtonName = this.state.rightFooterButtonName;
    if (
      rightFooterButtonName !== "LOG IN" &&
      rightFooterButtonName !== "NEXT" &&
      rightFooterButtonName !== "CONTINUE " &&
      this.state.rightFooterButtonName !== "SAVE AND PROCEED"
    ) {
      //moving backward
      if (this.moveBack(label)) {
        if (label === "CONFIRM DETAILS" && this.state.activeStep !== 0) {
          this.setState({
            rightFooterButtonName: "LOOKS GOOD",
            activeStep: 0,
            rightFooterButtonDisabled: false,
          });
        } else if (label === "BUSINESS DETAILS" && this.state.activeStep !== 1) {
          this.setState({
            rightFooterButtonName: "PROCEED",
            activeStep: 1,
            rightFooterButtonDisabled: false,
          });
        } else if (label === "REVIEW TERMS" && this.state.activeStep !== 2) {
          this.setState({
            rightFooterButtonName: "CONTINUE",
            activeStep: 2,
            rightFooterButtonDisabled: false,
          });
        } else if (label === "PURCHASE KIT" && this.state.activeStep !== 3) {
          this.setState({
            rightFooterButtonName: "DONE",
            activeStep: 3,
          });
        }
      }
      //moving forward
      else {
        if (!this.moveBack(label) && !this.state.rightFooterButtonDisabled) {
          let maxScreen = this.checkMaxScreenCovered();
          let userRequested = this.userRequestedScreen(label);

          if (userRequested <= maxScreen) {
            await this.handleClickRight(userRequested);
          }
        }
      }
    }
  };

  // to handle right footer button changes
  handleClickRight = async (userRequested) => {
    let userData = this.state.userData;
    if (!this.state.rightFooterButtonDisabled) {
      this.scrollToTop();
      if (this.state.rightFooterButtonName === "NEXT") {
        //call API to verify email (API CALL IN Home)
        this.apiVerifyEmail();
      } else if (this.state.rightFooterButtonName === "CONTINUE ") {
        // api call forgot password
        this.apiForgotPassword();
      } else if (this.state.rightFooterButtonName === "LOG IN") {
        //call API to Login (API CALL IN Home)
        this.apiLogin();
      } else if (this.state.rightFooterButtonName === "LOOKS GOOD") {
        // call API to Update screen id and move to next screen
        let data = {
          id: this.state.userData.id,
          screen: 1,
        };
        this.apiUpdateScreen(data, "PROCEED", userRequested);
      } else if (this.state.rightFooterButtonName === "SAVE AND PROCEED") {
        //call API to update data (API CALL IN Home)
        this.apiUpdateUserData();
      } else if (this.state.rightFooterButtonName === "PROCEED") {
        this.setrightFooterButtonDisabled(true);
        if (await this.apiVerifyURL(this.state.userData.url)) {
          // call API to Update screen id and move to next screen
          let data = {
            id: this.state.userData.id,
            screen: 2,
            ssn: this.state.userData.ssn,
            url: this.state.userData.url,
            doing_business: this.state.userData.doing_business,
          };
          this.apiUpdateScreen(data, "", userRequested);
        } else {
          this.setrightFooterButtonDisabled(true);
        }
      } else if (this.state.rightFooterButtonName === "CONTINUE") {
        // call API to Update screen id ,agreement accepted and move to next screen
        let data = {
          id: this.state.userData.id,
          screen: 3,
          indepedent_agreement: true,
          policy_procedures: true,
        };
        this.apiUpdateScreen(data, "DONE", userRequested);
        userData["indepedent_agreement"] = true;
        userData["policy_procedures"] = true;
        this.setUserData(userData);
        this.setrightFooterButtonDisabled(true);
      } else if (this.state.rightFooterButtonName === "DONE") {
        this.apiCreateConsultant();
      }
    }
  };

  //*********************************************************** API Calls Starts Here*********************************************************/

  // API to Verify Email (landing page)
  apiVerifyEmail = async () => {
    this.setState({ load: true, rightFooterButtonDisabled: true });
    let userData = this.state.userData;
    let errorUserData = this.state.errorUserData;
    let data = { email: userData["email"] };
    identify(data.email, { email: data.email });
    await API.callEndpoint("POST", "Basic", "/users/verifyEmail", data)
      .then((response) => {
        try {
          if (response.data.is_emailValid) {
            errorUserData["email"] = "";
            this.setState({
              load: false,
              rightFooterButtonName: "LOG IN",
              rightFooterButtonDisabled: true,
              customer: response.data.customer,
              errorUserData: errorUserData,
            });
          }
        } catch (e) {
          console.log("Error in /verifyEmail1");
          console.log(e);
          errorUserData["email"] = "Invalid Email";
          this.setState({
            load: false,
            errorUserData: errorUserData,
          });
        }
      })
      .catch((error) => {
        console.log("Error in /verifyEmail2");
        console.log(error);
        errorUserData["email"] = error.error;
        this.setState({
          load: false,
          errorUserData: errorUserData,
        });
      });
  };

  validData = (userData) => {
    return (
      userData.first_name !== "" &&
      userData.last_name !== "" &&
      userData.dob !== "Invalid Date" &&
      userData.address.street !== "" &&
      userData.address.zipcode !== "" &&
      userData.address.city !== "" &&
      userData.address.state !== "" &&
      userData.phonenumber !== "" &&
      userData.phonenumber.length === 10 &&
      userData.working_with.id !== "" &&
      userData.working_with.name !== ""
    );
  };

  // API to Login
  apiLogin = async () => {
    this.setState({ load: true, rightFooterButtonDisabled: true });
    let userData = this.state.userData;
    let errorUserData = this.state.errorUserData;
    let activeStep = 0;

    await API.getAccessToken(userData.email, userData.password, false)
      .then((response) => {
        try {
          userData = response.data;
          //update date in required format
          let Date = moment(userData["dateofbirth"], "YYYY/MM/DD");
          userData["dob"] = {
            day: Date.date(),
            month: 1 + Date.month(),
            year: Date.year(),
          };
          //existing customer login fix
          if (userData["phonenumber"].length < 10) {
            userData["phonenumber"] = "";
          }
          if (userData["first_name"] === "DO NOT USE") {
            userData["first_name"] = "";
          }
          if (userData["last_name"] === "DO NOT USE") {
            userData["last_name"] = "";
          }
          if (userData["street"] === "DO NOT USE, DO NOT USE") {
            userData["street"] = "";
          }
          if (userData["city"] === "DO NOT USE") {
            userData["city"] = "";
          }
          //update address to required format
          userData["address"] = {
            street: userData["street"],
            zipcode: userData["zipcode"],
            city: userData["city"],
            state: userData["state"],
          };
          let buttonName = "";
          let buttonDisable = false;
          if (!this.validData(userData)) {
            buttonName = "SAVE AND PROCEED";
            buttonDisable = true;
          } else {
            buttonName = "LOOKS GOOD";
            buttonDisable = false;

            activeStep = userData.screen;
            if (activeStep === 1) {
              buttonDisable = true;
              buttonName = "PROCEED";
            } else if (activeStep === 2) {
              buttonDisable = !(userData["indepedent_agreement"] && userData["policy_procedures"]);
              buttonName = "CONTINUE";
            } else if (activeStep === 3) {
              buttonDisable = true;
              buttonName = "DONE";
            } else if (activeStep === 4) {
              buttonDisable = false;
            }
          }
          if (userData.doing_business === "") {
            userData["doing_business"] = "Individual";
          }
          if (this.state.fixedWorkingWith) {
            userData["working_with"] = this.state.userData["working_with"];
          }
          //update state with user data
          this.setState({
            load: false,
            rightFooterButtonName: buttonName,
            rightFooterButtonDisabled: buttonDisable,
            userData,
            activeStep,
            maxScreenCovered: userData.screen,
          });
        } catch (e) {
          console.log("Error in /Login1");
          console.log(e);
          //update state with user data
          this.setState({
            load: false,
          });
        }
      })
      .catch((error) => {
        console.log("Error in /Login2");
        console.log(error);
        errorUserData["password"] = error.error;
        //update state with user data
        this.setState({
          load: false,
          errorUserData,
        });
      });
  };

  // API to update user data
  apiUpdateUserData = async () => {
    this.setState({ load: true, rightFooterButtonDisabled: true });
    let data = {};
    let userData = this.state.userData;

    //user details
    data["id"] = userData["id"];
    data["first_name"] = userData["first_name"];
    data["last_name"] = userData["last_name"];
    data["working_with"] = userData["working_with"];
    data["phonenumber"] = userData["phonenumber"];

    //Change Address to required format
    data["street"] = userData["address"]["street"];
    data["zipcode"] = userData["address"]["zipcode"];
    data["city"] = userData["address"]["city"];
    data["state"] = userData["address"]["state"];
    data["country"] = "US";

    //Change date to required format
    data["dateofbirth"] = moment()
      .year(userData["dob"]["year"])
      .month(userData["dob"]["month"] - 1)
      .date(userData["dob"]["day"])
      .format("YYYY-MM-DD");

    // phone number remove hypen
    data["phonenumber"] = userData["phonenumber"]
      .split("")
      .filter((item) => item !== "-")
      .join("");

    await API.callEndpoint("PATCH", "Bearer", "/users/update", data)
      .then((response) => {
        try {
          userData = response.data;
          //update date in required format
          let Date = moment(userData["dateofbirth"], "YYYY/MM/DD");
          userData["dob"] = {
            day: Date.date(),
            month: 1 + Date.month(),
            year: Date.year(),
          };

          //update address to required format
          userData["address"] = {
            street: userData["street"],
            zipcode: userData["zipcode"],
            city: userData["city"],
            state: userData["state"],
          };

          this.setState({
            load: false,
            rightFooterButtonName: "LOOKS GOOD",
            rightFooterButtonDisabled: false,
            userData,
          });
        } catch (e) {
          console.log("Error in /Update");
          console.log(e);
          this.setState({
            load: false,
            rightFooterButtonDisabled: false,
          });
        }
      })
      .catch((error) => {
        console.log("Error in /update");
        console.log(error);
        this.setState({
          load: false,
          rightFooterButtonDisabled: false,
        });
      });
  };

  // Api to update which screen the user has completed ,
  //screen represented by screen id + data collected in that screen
  apiUpdateScreen = async (data, buttonName, userRequested = "") => {
    this.setState({ load: true, rightFooterButtonDisabled: true });
    let errorUserData = this.state.errorUserData;
    let rightFooterButtonDisabled = true;
    await API.callEndpoint("PATCH", "Bearer", "/users/update", data)
      .then(async (response) => {
        errorUserData["ssn"] = "";

        if (this.state.rightFooterButtonName === "CONTINUE") {
          await this.apiCartDetails();
        }

        // redirection for top bar navigation
        if (userRequested !== "") {
          console.log(userRequested);
          if (userRequested === 0) {
            buttonName = "LOOKS GOOD";
          } else if (userRequested === 1) {
            buttonName = "PROCEED";
          } else if (userRequested === 2) {
            buttonName = "CONTINUE";
          } else if (userRequested === 3) {
            buttonName = "DONE";
          }
        }

        this.setState({
          load: false,
          rightFooterButtonName: buttonName,
          rightFooterButtonDisabled: rightFooterButtonDisabled,
          activeStep: userRequested === "" ? data.screen : userRequested,
          errorUserData,
        });
      })
      .catch((error) => {
        console.log("Error in /update");
        console.log(error);
        if (error.error === "Please enter valid ssn") {
          errorUserData["ssn"] = "Invalid SSN";
        }
        this.setState({
          load: false,
        });
      });
  };

  // API to verify URL
  apiVerifyURL = async (customURL) => {
    let data = {
      url: customURL,
    };
    return await API.callEndpoint("POST", "Bearer", "/users/verifyUrl", data)
      .then((response) => {
        try {
          if (response.data.validText) {
            this.setState({ checkURLAvailability: true });
            return true;
          } else {
            this.setState({ checkURLAvailability: false });
            return false;
          }
        } catch (e) {
          console.log("Error in /VerifyURL1");
          console.log(e);
          this.setState({ checkURLAvailability: false });
          return false;
        }
      })
      .catch((error) => {
        console.log("Error in /VerifyURL2");
        console.log(error);
        this.setState({ checkURLAvailability: false });
        return false;
      });
  };

  //API to get cart id
  apiGetCartId = async () => {
    let userData = this.state.userData;
    userData["cart_id"] = "";
    this.setState({ userData });
    console.log('SKU: ', this.props.customSKU)

    await API.callEndpoint("POST", "Bearer", "/users/createCart", {SKU:this.props.customSKU})
      .then((response) => {
        try {
          userData["cart_id"] = response.data.cartId;
          this.setState({
            //load: false,
            userData,
          });
        } catch (e) {
          console.log("Error in /CreateCart");
          console.log(e);
          this.setState({
            load: false,
            activeStep: 2,
            rightFooterButtonName: "CONTINUE",
            rightFooterButtonDisabled: false,
          });
        }
      })
      .catch((error) => {
        console.log("Error in /CreateCart");
        console.log(error);
        this.setState({
          load: false,
          activeStep: 2,
          rightFooterButtonName: "CONTINUE",
          rightFooterButtonDisabled: false,
        });
        swal({
          title: "An error occured, try again!",
          text: error.error,
          icon: "info",
        });
      });
  };

  //API get card details
  apiCartDetails = async (createNewCart = true) => {
    this.setState({ load: true });

    if (createNewCart) {
      await this.apiGetCartId();
    }

    if (this.state.userData["cart_id"] !== "") {
      let cartId = this.state.userData.cart_id;
      this.setState({ load: true });
      let purchaseKitDetails = this.state.purchaseKitDetails;
      let data = {
        id: this.state.userData.id,
        ssn: this.state.userData.ssn,
      };
      await API.callEndpoint("GET", "Bearer", "/users/viewCart?cartid=" + cartId, data)
        .then((response) => {
          try {
            purchaseKitDetails["subtotal"] = response.data.Subtotal;
            purchaseKitDetails["shipping"] = response.data.OrderLines[0].ShippingTax;
            purchaseKitDetails["salestax"] = response.data.OrderLines[0].ItemTax;
            purchaseKitDetails["discount"] =
              response.data.OrderLines[0].Discounts || response.data.OrderLines[1]?.Discounts || 0;
            purchaseKitDetails["total"] = response.data.SubtotalAfterSavings;
            purchaseKitDetails["discountDescription"] =
              response.data.DiscountTotals.length > 0 ? response.data.DiscountTotals[0].TotalDescription : "";

            this.setState({
              load: false,
              cartId,
              purchaseKitDetails,
            });
          } catch (e) {
            console.log("Error in /get cart details");
            console.log(e);
            this.setState({
              load: false,
              activeStep: 2,
              rightFooterButtonName: "CONTINUE",
              rightFooterButtonDisabled: false,
            });
          }
        })
        .catch((error) => {
          console.log("Error in /get cart details");
          console.log(error);
          this.setState({
            load: false,
            activeStep: 2,
            rightFooterButtonName: "CONTINUE",
            rightFooterButtonDisabled: false,
          });
          swal({
            title: "An error occured, try again!",
            text: error.error,
            icon: "info",
          });
        });
    }
  };

  // api to create a consultant
  apiCreateConsultant = async () => {
    this.setState({ load: true, rightFooterButtonDisabled: true });
    let billingAddress = this.state.billingAddress;
    let userData = this.state.userData;
    // use same billing and shipping addesss ( note: address change should be set to false when handling request)
    let Address = {};
    if (this.state.addresschange) {
      Address["city"] = userData.address.city;
      Address["zipcode"] = userData.address.zipcode;
      Address["state"] = userData.address.state;
      Address["country"] = "US";
      Address["street"] = userData.address.street;
    } else {
      Address["city"] = billingAddress.city;
      Address["zipcode"] = billingAddress.zipcode;
      Address["state"] = billingAddress.state;
      Address["country"] = "US";
      Address["street"] = billingAddress.street;
    }

    let data = {
      addresschange: !this.state.addresschange,
      address: Address,
      cardinfo: this.state.cardinfo,
    };

    await API.callEndpoint("POST", "Bearer", "/users/createConsultant", data)
      .then((response) => {
        try {
          let consultant_number = 0;
          if (response.data.display_number !== null) {
            consultant_number = response.data.display_number;
          }
          this.setState({
            load: false,
            activeStep: 4,
            displayFooter: false,
            confirmation: true,
            consultant_number,
          });
        } catch (e) {
          console.log("Error in /createConsultant");
          console.log(e);
          this.setState({
            load: false,
            activeStep: 4,
            displayFooter: false,
            confirmation: false,
            consultant_error: e.error,
          });
        }
      })
      .catch((error) => {
        console.log("Error in /createConsultant");
        console.log(error);
        this.setState({
          load: false,
          activeStep: 4,
          displayFooter: false,
          confirmation: false,
          consultant_error: error.error,
        });
      });
  };

  //api for forgot password
  apiForgotPassword = async () => {
    this.setState({ load: true });
    let errorUserData = this.state.errorUserData;
    let data = {
      email: this.state.userData.email,
    };
    await API.callEndpoint("POST", "Basic", "/users/forgotpassword", data)
      .then((response) => {
        try {
          this.setState({
            load: false,
            rightFooterButtonName: "LOG IN",
            rightFooterButtonDisabled: true,
            displayForgotPassword: false,
            showSentEmailText: true,
          });
        } catch (e) {
          console.log("Error in /forgotpassword");
          console.log(e);
          errorUserData["forgotPasswordEmail"] = e.error;
          this.setState({
            load: false,
            rightFooterButtonName: "CONTINUE ",
            rightFooterButtonDisabled: false,
            displayForgotPassword: true,
            showSentEmailText: false,
            errorUserData,
          });
        }
      })
      .catch((error) => {
        errorUserData["forgotPasswordEmail"] = error.error;
        this.setState({
          load: false,
          rightFooterButtonName: "CONTINUE ",
          rightFooterButtonDisabled: false,
          displayForgotPassword: true,
          showSentEmailText: false,
          errorUserData,
        });
      });
  };

  //api to get "working with" drop down
  apiGetWorkingWithDropDownData = async (searchWord) => {
    let data = {
      requests: [
        {
          indexName: "dev_consultants",
          params: `query=${searchWord}&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&facets=%5B%5D&tagFilters=`,
        },
      ],
    };
    await axios
      .post(algoliaURL, data)
      .then((res) => {
        try {
          console.log(res.data.results[0].hits, "referal");
          this.setState({ working_with_arr: res.data.results[0].hits });
        } catch (e) {
          console.error(e);
          this.setState({ working_with_arr: [] });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ working_with_arr: [] });
      });
  };

  apiGetWorkingWith = async (userURL) => {
    let data = {
      consultantid: userURL,
    };
    let fixedWorkingWith = this.state.fixedWorkingWith;
    let userData = this.state.userData;
    await axios
      .post(getWorkingWithURL, data)
      .then((res) => {
        try {
          if (res.data.name) {
            fixedWorkingWith = true;
            userData["working_with"] = {
              id: res.data.id,
              name: res.data.name,
              displayId: res.data.displayId,
            };
            this.setState({
              userData,
              fixedWorkingWith,
            });
          }
        } catch (e) {
          console.error(e);
          fixedWorkingWith = false;
          this.setState({
            fixedWorkingWith,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        fixedWorkingWith = false;
        this.setState({
          fixedWorkingWith,
        });
      });
  };

  apiApplyCouponCode = async (couponCode) => {
    this.setState({ load: true });
    try {
      const res = await axios.post("https://tower-dev.scoutandcellar.com/api/bac/checkout/AddCouponToCart", {
        CartId: this.state.userData["cart_id"],
        CouponCode: couponCode,
      });

      if (res.data.Success) {
        try {
          await this.apiCartDetails(false);
        } catch {
          this.setState({
            couponCodeMessage: {
              success: false,
              message: "There was an error fetching subtotal data. Please try again later.",
            },
          });
        }
        this.setState({
          couponCodeMessage: {
            success: true,
            message: "Your coupon was successfully applied.",
          },
        });
      } else {
        this.setState({
          couponCodeMessage: {
            success: false,
            message: res.data.Error.Traceback.Notifications[0]?.Message,
          },
        });
      }
    } catch {
      this.setState({
        couponCodeMessage: {
          success: false,
          message: "There was an error when applying your coupon. Please try again later.",
        },
      });
    } finally {
      this.setState({ load: false });
    }
  };

  //*********************************************************** API Calls Ends Here*********************************************************/

  //method to set card and address details
  setCardDetails = (cardinfo, addresschange, billingAddress) => {
    this.setState({ cardinfo, addresschange, billingAddress });
  };

  // method to (ennable/disable) footer
  setDisplayFooter = (value) => {
    this.setState({ displayFooter: value });
  };

  //setCheckURLAvailability
  setCheckURLAvailability = (value) => {
    this.setState({ checkURLAvailability: value });
  };

  //stepper
  getMobileSteps = () => {
    return ["Your Details", "Business Details", "Review Terms", "Purchase Kit"];
  };

  //stepper title content
  getSteps = () => {
    return ["CONFIRM DETAILS", "BUSINESS DETAILS", "REVIEW TERMS", "PURCHASE KIT"];
  };

  //stepper content to be displayed based on current active step
  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          // confirm details display screen
          <ConfirmDetails
            rightFooterButtonName={this.state.rightFooterButtonName}
            rightFooterButtonDisabled={this.state.rightFooterButtonDisabled}
            setrightFooterButtonDisabled={this.setrightFooterButtonDisabled}
            userData={this.state.userData}
            errorUserData={this.state.errorUserData}
            setUserData={this.setUserData}
            setButtonName={this.setButtonName}
            setErrorUserData={this.setErrorUserData}
            displayForgotPassword={this.state.displayForgotPassword}
            setForgotPassword={this.setForgotPassword}
            handleBackButton={this.handleBackButton}
            apiGetWorkingWithDropDownData={this.apiGetWorkingWithDropDownData}
            apiVerifyEmail={this.apiVerifyEmail}
            apiLogin={this.apiLogin}
            working_with_arr={this.state.working_with_arr}
            showSentEmailText={this.state.showSentEmailText}
            setShowSentEmailText={this.setShowSentEmailText}
            fixedWorkingWith={this.state.fixedWorkingWith}
            topBarNavigation={this.topBarNavigation}
            apiForgotPassword={this.apiForgotPassword}
            customer={this.state.customer}
            setRemoveBackIcon={this.setRemoveBackIcon}
          />
        );
      case 1:
        return (
          // Business details screen
          <BusinessDetails
            rightFooterButtonName={this.state.rightFooterButtonName}
            setrightFooterButtonDisabled={this.setrightFooterButtonDisabled}
            userData={this.state.userData}
            setUserData={this.setUserData}
            setButtonName={this.setButtonName}
            apiVerifyURL={this.apiVerifyURL}
            errorUserData={this.state.errorUserData}
            setErrorUserData={this.setErrorUserData}
            checkURLAvailability={this.state.checkURLAvailability}
            setCheckURLAvailability={this.setCheckURLAvailability}
            handleBackButton={this.handleBackButton}
            topBarNavigation={this.topBarNavigation}
          />
        );
      case 2:
        return (
          //verify email screen
          <VerifyIdentity
            rightFooterButtonName={this.state.rightFooterButtonName}
            setrightFooterButtonDisabled={this.setrightFooterButtonDisabled}
            userData={this.state.userData}
            setUserData={this.setUserData}
            setButtonName={this.setButtonName}
            setDisplayFooter={this.setDisplayFooter}
            errorUserData={this.state.errorUserData}
            setErrorUserData={this.setErrorUserData}
            currentAgreement={this.state.currentAgreement}
            setCurrentAgreement={this.setCurrentAgreement}
            handleBackButton={this.handleBackButton}
            topBarNavigation={this.topBarNavigation}
          />
        );
      case 3:
        return (
          //Purchase kit screen
          <PurchaseKit
            rightFooterButtonName={this.state.rightFooterButtonName}
            setrightFooterButtonDisabled={this.setrightFooterButtonDisabled}
            userData={this.state.userData}
            setUserData={this.setUserData}
            setButtonName={this.setButtonName}
            purchaseKitDetails={this.state.purchaseKitDetails}
            apiCartDetails={this.apiCartDetails}
            apiApplyCouponCode={this.apiApplyCouponCode}
            couponCodeMessage={this.state.couponCodeMessage}
            cardinfo={this.state.cardinfo}
            addresschange={this.state.addresschange}
            setAddresschange={this.setAddresschange}
            billingAddress={this.state.billingAddress}
            setCardDetails={this.setCardDetails}
            handleBackButton={this.handleBackButton}
            topBarNavigation={this.topBarNavigation}
          />
        );
      case 4:
        return (
          //PaymentConfirmation screen
          <PaymentConfirmation
            userData={this.state.userData}
            setUserData={this.setUserData}
            setButtonName={this.setButtonName}
            confirmation={this.state.confirmation}
            setConfirmation={this.setConfirmation}
            moveBackToLastScreen={this.moveBackToLastScreen}
            consultant_number={this.state.consultant_number}
            consultant_error={this.state.consultant_error}
          />
        );
      default:
        //default screen
        return "Unknown step";
    }
  }

  //set email sent confirmation
  setShowSentEmailText = (value) => {
    this.setState({ showSentEmailText: value });
  };
  //set confirmation
  setAddresschange = (value) => {
    this.setState({ addresschange: value });
  };

  //set confirmation
  setConfirmation = (value) => {
    this.setState({ confirmation: value });
  };

  //set display forgot password
  setForgotPassword = () => {
    this.setState({ displayForgotPassword: true });
  };


  //set current agreement
  setCurrentAgreement = () => {
    this.setState({ currentAgreement: !this.state.currentAgreement });
  };

  //method to move to next screen
  moveToNextScreen = () => {
    this.handleNext();
  };

  // method to set user data
  setUserData = (data) => {
    this.setState({
      userData: data,
    });
  };

  // method to set error
  setErrorUserData = (data) => {
    this.setState({
      errorUserData: data,
    });
  };

  //set button name
  setButtonName = (button) => {
    this.setState({
      rightFooterButtonName: button,
    });
  };

  // method to enable/disable right footer button
  setrightFooterButtonDisabled = (value) => {
    this.setState({ rightFooterButtonDisabled: value });
  };

  // to move to next screen
  handleNext = () => {
    const { activeStep } = this.state;

    this.setState({
      activeStep: activeStep + 1,
    });
  };

  //move back to last screen
  moveBackToLastScreen = (activeStep, button) => {
    if (activeStep === 0 && !this.state.addresschange) {
      activeStep = 3;
      button = "DONE";
    }
    this.setState({
      activeStep: activeStep,
      rightFooterButtonName: button,
      rightFooterButtonDisabled: false,
      displayFooter: true,
    });
  };

  // header Back button
  handleBackButton = () => {
    let rightButton = this.state.rightFooterButtonName;
    this.setState({
      load: false,
    });
    switch (rightButton) {
      case "NEXT":
        this.props.history.push("/");
        break;
      case "LOG IN":
        this.setState({
          rightFooterButtonName: "NEXT",
          displayForgotPassword: false,
          rightFooterButtonDisabled: false,
        });
        break;
      case "CONTINUE ":
        this.setState({
          rightFooterButtonName: "NEXT",
          displayForgotPassword: false,
          rightFooterButtonDisabled: false,
        });
        break;
      case "LOOKS GOOD":
        this.setState({
          rightFooterButtonName: "NEXT",
          rightFooterButtonDisabled: true,
        });
        break;

      case "PROCEED":
        this.setState({
          rightFooterButtonName: "LOOKS GOOD",
          rightFooterButtonDisabled: false,
          activeStep: 0,
        });
        break;
      case "CONTINUE":
        this.setState({
          rightFooterButtonName: "PROCEED",
          rightFooterButtonDisabled: false,
          activeStep: 1,
        });
        break;
      case "DONE":
        this.setState({
          rightFooterButtonName: "CONTINUE",
          rightFooterButtonDisabled: true,
          activeStep: 2,
        });
        break;
      case "SAVE AND PROCEED":
        if (!this.state.rightFooterButtonDisabled) {
          this.apiUpdateUserData();
          break;
        } else {
          this.setState({
            rightFooterButtonName: "NEXT",
            rightFooterButtonDisabled: false,
          });
          break;
        }

      default:
        this.setState({ rightFooterButtonName: "NEXT" });
        break;
    }
  };
  componentDidMount = () => {
    const params = new URLSearchParams(this.props.location.search);
    const consultant = params.get("u");
    const sku = params.get('sku');
    this.props.passCustomSKU(sku)

    if (this.props.userURL !== "") {
      this.apiGetWorkingWith(this.props.userURL.split('&')[0]);
    } else if (consultant) {
      this.apiGetWorkingWith(consultant);
    }
  };

  render() {
    const { classes } = this.props;
    const steps = this.getSteps();
    const mobileStep = this.getMobileSteps();
    const { activeStep, load, rightFooterButtonName } = this.state;
        
    return (
      <div tabIndex='0' onKeyDown={this.handleKeypress}>
        {load ? <Spinner color='success' size='120px' /> : null}

        {/* If active step is less than 4 appropriate step page is dispayed , 
        if active step is 4  - payment confirmation page is displayed */}
        <>
          <div className='container-fluid'>
            <div className='row headerMarginTop'>
              {window.innerWidth >= 550 ||
              rightFooterButtonName === "NEXT" ||
              rightFooterButtonName === "LOG IN" ||
              rightFooterButtonName === "CONTINUE " ? (
                <>
                  <div className='col-xl-2 col-lg-1 col-md-1 col-1 d-flex justify-content-center justify-content-md-end align-items-center'>
                    {(activeStep < 4  && rightFooterButtonName !== "NEXT") && <div className='arrowIcon3' onClick={this.handleBackButton}>
                      <ArrowBackIosIcon />
                    </div>}
                  </div>
                  <div className='col-xl-2 col-lg-2 col-md-11 col-11 d-flex align-items-center justify-content-center'>
                    <div className='LogoIcon'>
                      <img src={Logo} alt='' />
                    </div>
                  </div>
                </>
              ) : null}
              <div className='col-xl-8 col-lg-9 col-md-12 col-12 stepperMarginTop'>
                {/* stepper */}
                <Stepper activeStep={activeStep} connector={<GreenStepConnector />} orientation={"horizontal"}>
                  {steps.map((label, index) => {
                    return (
                      <Step
                        key={label}
                        classes={{
                          root: classes.step1,
                          completed: classes.completed,
                          active: classes.active,
                        }}
                      >
                        <StepLabel
                          StepIconProps={{
                            classes: {
                              root: classes.step,
                              completed: classes.completed,
                              active: classes.active,
                              disabled: classes.disabled,
                            },
                          }}
                        >
                          <span className='fontProxima' onClick={() => this.topBarNavigation(label)}>
                            {label}
                          </span>
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </div>
            </div>
          </div>

          <div className='container-fluid HomeContainer'>
            <div className='row'>
              <div className={activeStep !== 4 && "col-xl-10 offset-xl-2 col-lg-11 offset-lg-1"}>
                {window.innerWidth >= 550 ? (
                  <>
                    {/* to display content based on active step */}
                    {activeStep !== 4 ? (
                      <div style={{ marginTop: "4em" }}>
                        <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
                      </div>
                    ) : (
                      <div>
                        <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* enter email */}
                    <div className='mobileMargin'>
                      <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
                    </div>
                    {/* Stepper */}
                    {this.state.rightFooterButtonName === "NEXT" ? (
                      <div className='btm-list-blk'>
                        <div className='btm-list-inner'>
                          <div className='mobileStepHead'>WHAT HAPPENS NEXT?</div>
                          {/* stepper for mobile view  */}
                          <Stepper
                            connector={<MobileStepConnector />}
                            activeStep={0}
                            style={{ background: "#e8e0dd" }}
                            className='mobileStep'
                            orientation={window.innerWidth >= 550 ? "horizontal" : "vertical"}
                          >
                            {mobileStep.map((label, index) => {
                              return (
                                <Step
                                  key={label}
                                  classes={{
                                    root: classes.mobileStep,
                                    completed: classes.completed,
                                    active: classes.active,
                                  }}
                                >
                                  <StepLabel
                                    StepIconProps={{
                                      classes: {
                                        root: classes.step3,
                                        completed: classes.completed,
                                        active: classes.active,
                                        disabled: classes.disabled,
                                        text: classes.textStep,
                                      },
                                    }}
                                  >
                                    <span className='fontProxima1'>{label}</span>
                                  </StepLabel>
                                </Step>
                              );
                            })}
                          </Stepper>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}

                {/* end of first page */}
              </div>
            </div>
          </div>
          {/* Global Footer for all screens  */}
          <Footer
            rightFooterButtonName={this.state.rightFooterButtonName}
            rightFooterButtonDisabled={this.state.rightFooterButtonDisabled}
            moveToNextScreen={this.moveToNextScreen}
            userData={this.state.userData}
            setUserData={this.setUserData}
            setButtonName={this.setButtonName}
            setrightFooterButtonDisabled={this.setrightFooterButtonDisabled}
            displayFooter={this.state.displayFooter}
            setDisplayFooter={this.setDisplayFooter}
            apiVerifyEmail={this.apiVerifyEmail}
            apiLogin={this.apiLogin}
            apiUpdateUserData={this.apiUpdateUserData}
            apiUpdateScreen={this.apiUpdateScreen}
            currentAgreement={this.state.currentAgreement}
            setCurrentAgreement={this.setCurrentAgreement}
            apiCreateConsultant={this.apiCreateConsultant}
            apiForgotPassword={this.apiForgotPassword}
            apiVerifyURL={this.apiVerifyURL}
          />
        </>
      </div>
    );
  }
}
// to add styles and props type for material UI design used
Home.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Home);
