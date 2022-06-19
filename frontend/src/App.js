import React from 'react';
import { Switch, BrowserRouter, Route, Redirect } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import SignUp from "./pages/SignUp"
import Search from "./pages/Search"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route exact={true} path="/sign-up" component={SignUp} />
          <Route exact={true} path="/log-in" component={Login} />
          <Route exact={true} path="/feed" component={Dashboard} />
          <Route exact={true} path="/profile/:id" component={Profile} />
          <Route exact={true} path="/search/:name" component={Search} />
          <Route path="*"><Redirect to="/feed"/></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
