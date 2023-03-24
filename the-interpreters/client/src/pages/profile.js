import React from "react";
import { useId, useEffect, useState, useRef } from "react";
import LoginComponent from "../widgets/LoginComponent";
import RegisterComponent from "../widgets/RegisterComponent";
import '../widgets/Widget.css';

const Profile = (props) => {

    const [accountAccess, setAccountAccess] = useState('login');

    const toggle = (setForm) => {
        setAccountAccess(setForm);
    }


    return (
    <>
        <div id="profile-wrap" >
            {
                accountAccess === "login" ? <LoginComponent onToggle={toggle}/>: <RegisterComponent onToggle={toggle}/>
            }
        </div>
    </>
    )
}

export default Profile;
