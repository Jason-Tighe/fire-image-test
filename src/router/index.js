import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import App from "../App";
import AuthContext from "../contexts/AuthContext";

export default function AppRouter() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" component={App} />
          <Route exact path="/signup" component={AuthContext} />
        </Routes>
    </Router>
  );
}
