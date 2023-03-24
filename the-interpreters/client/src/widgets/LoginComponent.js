import React, { useRef, useState } from "react";
import './Widget.css';

const LoginComponent = (props) =>{
  
  const unameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const pwordInput1Ref = useRef(null);
  const pwordInput2Ref = useRef(null);

  const unameLoginRef = useRef(null);
  const pwordLoginRef = useRef(null);

  const [loginStatus, setActive] = useState(false);

  const tryLogin = () => {
    
    let unameLogin = unameLoginRef.current.value;
    let pwordLogin = pwordLoginRef.current.value;
    
    fetch(`http://${process.env.REACT_APP_HOST}:3001/tryLogin`,
    {
        headers: {"Content-Type" : "application/json"},
        method: "post",
        body: JSON.stringify({ 
            UserName: unameLogin,
            Password: pwordLogin
        })
    })
    .then(response => response.json())
    .then(function(data)
    {
        if (data == null)
            alert("Invalid credentials");
        else
        {
            localStorage.setItem("accessToken", data)
            setActive(!loginStatus);
            alert("Welcome!");
        }
    });
  };
  
  const logout = () => {
    if(localStorage.getItem("accessToken") == null || localStorage.getItem("accessToken") == "null")
        alert("You are not logged in");
    else
    {
        localStorage.setItem("accessToken", null)
        alert("You're now logged out");
        setActive(!loginStatus);
    }
  };

    return (
      <div className="center-wrap">
        <div id="user-entry">
          <div id="login-wrap">
            <h2>Account Login</h2>
            <div className="form-wrap">
              <label className="input-text" for="uname_login">Username:</label>
              <input ref={unameLoginRef} type="text" id="uname_login"></input>
              <label className="input-text" for="pword_login">Password:</label>
              <input ref={pwordLoginRef} type="password" id="pword_login"></input>
              </div>
            
            <button onClick={tryLogin}>Login</button>
            <button id="login-toggle" onClick={() => props.onToggle("register")}> Register here </button>
            <br></br>
          </div>
          <p>{loginStatus ? "You're logged in" : "You are not logged in"}</p>
        </div>
      </div>
    );
};

export default LoginComponent;