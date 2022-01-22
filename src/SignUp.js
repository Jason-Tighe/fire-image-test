import React, {useRef} from 'react'
import {useAuth} from './contexts/AuthContext'

export default function SignUp(){
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirm = useRef()
    const  createAccEmail = useAuth()

    const  handleSubmit = (e) => {
      e.preventDefault()
      createAccEmail(emailRef.current.value, passwordRef.current.value)
    }

  return(
  <form>
  <div className="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div className="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
  </div>
  <div className="form-group">
    <label for="exampleInputPassword1">Confirm Password</label>
    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
  </div>
  <div className="form-group form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
    <label className="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
  )
}
