import React from 'react'
import { useHistory } from "react-router-dom"
import "./Home.css"


export default function Home (){
  
  const history = useHistory();
  return(
    <div className="container">
      <div className="top-wrapper">
        <h1 className="title">WELCOME!</h1>
        <h3>Connect with friends! Join Now</h3>
      </div>
      <div className="btns-wrapper">
        <button className="signup-btn" onClick={()=> history.push("/sign-up")}>
          Sign Up
        </button>  
        <br/>
        <button className="login-btn" onClick={()=> history.push("/log-in")}>
          Log In
        </button> 
    </div>
  </div>
  )    
}
