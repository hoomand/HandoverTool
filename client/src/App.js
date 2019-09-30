import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import "typeface-roboto";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Paperbase from "./components/layout/Paperbase";
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Paperbase />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
