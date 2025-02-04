import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./CreateConsultantComponents/Home/Home";
import HomePage from "./HomePage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      customURL: "",
      customSKU: null,
    };
  }
  passCustomURL = (value) => {
    this.setState({ customURL: value });
  };

  passCustomSKU = (value) => {
    this.setState({ customSKU: value });
  };

  render() {
    //to block all testing logs, warnings and errors
    // console.log = console.warn = console.error = () => {};
    return (
      <div>
        <Router>
          <Switch>
            {/* create consultant Home component */}
            <Route
              path='/consultant'
              render={(props) => (
                <Home
                  userURL={this.state.customURL}
                  passCustomURL={this.passCustomURL}
                  customSKU={this.state.customSKU}
                  passCustomSKU={this.passCustomSKU}
                  {...props}
                />
              )}
            ></Route>
            {/* Custom URL --> fixed working with */}
            <Route path='/*' render={(props) => <HomePage passCustomURL={this.passCustomURL} {...props} />}></Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
