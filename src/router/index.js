import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import paths from "./routes";
import App from "../App";
import SignUp from "../SignUp";

export default function AppRouter() {
  return (
    <Router>
    <SignUp/>

    </Router>
  );
}
