import React, { useState, useContext, useEffect } from "react";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export default function useAuth() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});
  const [token, setToken] =useState("")

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    console.log(user);
  });

  //gmail is enabled will have to figure that outt
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      console.log(user);
    } catch (err) {
      console.log(err.message)
      alert(err.message)
    }
  };

  const otherLogin = async () =>{
    console.log("In Progress")
  }

  const googleLogin = async () => {
    try {
      const user = await signInWithPopup(auth, new GoogleAuthProvider()).then(
        (result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          console.log("credential:" + credential);
          setToken(credential.accessToken)
          console.log("token:" + credential.accessToken);
          const user = result.user;
          console.log("user:" + result.user);
        }
      );
    } catch (err) {
      console.log(err.message);
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
      console.log(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const [signup, setSignUp] = useState(false);
  const registerUser = () => {
    setSignUp(!signup);
  };
  //user?.accesstoken is coming from the user after tha auth.
  return (
    <>
      {!user?.accessToken ?
      <>
      {signup ? (
        <div>
          <h3>Register</h3>
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
          <button onClick={registerUser}>Already have an account? Log In</button>
        </div>
      ) : (
        <div>
          <h3>Log In</h3>
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
          <button onClick={registerUser}>Don't have an account register now</button>
        </div>
      )}
      <h1>Other ways to login</h1>
      <button onClick={googleLogin}> Sign in with Google </button>
      <button onClick={otherLogin}> Sign in with FaceBook </button>
      <button onClick={otherLogin}> Sign in with Apple </button>
      </>
      :
      <>
      <h4>User Logged In</h4>
      <p>{user?.email}</p>
      <p>{user?.displayName}</p>
      <button onClick={logout}>Sign Out</button>
      </>
    }
    </>
  );
}
