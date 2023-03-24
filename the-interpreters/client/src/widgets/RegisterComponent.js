import React, { useRef, useState } from "react";
import './Widget.css';

const RegisterComponent = (props) =>{
  const unameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const pwordInput1Ref = useRef(null);
  const pwordInput2Ref = useRef(null);

  const [loginStatus, setActive] = useState(false);
const tryRegister = () => {

    let unameInput = unameInputRef.current.value;
    let emailInput = emailInputRef.current.value;
    let pwordInput1 = pwordInput1Ref.current.value;
    let pwordInput2 = pwordInput2Ref.current.value;

    if (unameInput == "" || emailInput  == "" || pwordInput1 == "" || pwordInput2 == "")
        alert("Error: empty field");
    else if (pwordInput1 != pwordInput2)
        alert("Error: passwords don't match");
    else
    {
        fetch(`http://${process.env.REACT_APP_HOST}:3001/registerAccount`,
        {
            headers: {"Content-Type" : "application/json"},
            method: "post",
            body: JSON.stringify({ 
                UserName: unameInput,
                Email: emailInput,
                Password: pwordInput1
            })
        })
        .then(response => response.json())
        .then(function(data)
        {
            if (data == null)
                alert("Sorry, try again");
            else
            {
                localStorage.setItem("accessToken", data)
                setActive(!loginStatus);
                alert("Welcome!");
            }
        });
    }
  };

  return(
    <div className="center-wrap">
    <div id="user-entry">
    <div id="sign-up-wrap">
      <h2>Sign Up</h2>
      <div className="form-wrap">
        <label className="input-text" for="uname">Username:</label>
        <input ref={unameInputRef} type="text" id="uname"></input>
        <label className="input-text" for="email">Email:</label>
        <input ref={emailInputRef} type="text" id="email"></input>
        <label className="input-text" for="pword1">Password:</label>
        <input ref={pwordInput1Ref} type="password" id="pword1" ></input>      
        <label className="input-text" for="pword2">Repeat Password:</label>
        <input ref={pwordInput2Ref} type="password" id="pword2"></input>
      </div>
      
      <button onClick={tryRegister}>Register</button>
      <button id="register-toggle" onClick={() => props.onToggle('login')}>Login here</button>
      </div>
    </div>
    </div>
);
};

export default RegisterComponent;