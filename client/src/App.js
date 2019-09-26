import React, { Component } from "react";
import "typeface-roboto";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Paperbase from "./components/layout/Paperbase";
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Paperbase />
        </div>
      </Router>
    );
  }
}

export default App;
