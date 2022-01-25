import React, { useState, useContext, useEffect } from "react";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function useAuth() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  //gmail is enabled will have to figure that out
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      console.log(user);
    } catch (err) {
      console.err(err.message);
    }
  };
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log("Welcome" + user);
    } catch (err) {
      console.err(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <div>
        <h3>Register User</h3>
        <input
        type="email"
          placeholder="Enter your email"
          onChange={(e) => {
            setRegisterEmail(e.target.value);
          }}
        />

        <input
          type="password"
          placeholder="Create a password"
          onChange={(e) => {
            setRegisterPassword(e.target.value);
          }}
        />
        <button onClick={register}> Create User</button>
      </div>
      <div>
        <h3></h3>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => {
            setLoginEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => {
            setLoginPassword(e.target.value);
          }}
        />

        <button onClick={login}>Login</button>
      </div>
      <h4>User Logged In</h4>
      {user?.email}
      <button onClick={logout}>Sign Out</button>

    </>
  );
}
