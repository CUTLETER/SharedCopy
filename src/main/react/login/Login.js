// src/Login.js

import React, {useState} from 'react';
import ReactDOM from "react-dom/client";
import './Login.css';
import { useLocation } from 'react-router-dom';

function Login() {


    return (
        <div className="main">
            <div>
                <form method='POST' action='/loginForm'>
                <div className="login-box">
                    <img className="img-logo" src="./img/login.png"/>
                    <div className="inputs-box"><i className="bi bi-person-fill"></i>
                    <input type="text" className="input-box" name="employeeId" />
                    </div>
                    <div className="inputs-box"><i className="bi bi-lock-fill"></i>
                    <input type="password" className="input-box" name="employeePw" />
                    </div>
                    <button type="submit" className="login_btn"> 로그인</button>
                </div>
                </form>
            </div>
        </div>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Login/>
);