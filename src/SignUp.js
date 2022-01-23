import React, { useRef, useState } from "react";
import { useAuth } from "./contexts/AuthContext";

export default function SignUp() {
  const [email, setEmail] = useState("")
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirm = useRef();
  const { createAccEmail } = useAuth;

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   createAccEmail(emailRef.current.value, passwordRef.current.value);
  // };



  return (
    <form>
      <input type="email"/>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
