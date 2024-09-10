// src/Login.js

import React, {useState} from 'react';
import ReactDOM from "react-dom/client";
import './Login.css'

function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // 간단한 폼 검증
        if (!id || !password) {
            setError('이메일과 비밀번호를 입력하세요.');
            return;
        }

        // 로그인 로직 구현 부분 (예: API 요청)
        console.log('로그인 시도:', {id, password});

        // 예시로 콘솔 출력
        // 실제 구현에서는 서버로 로그인 요청을 보낸 후 응답에 따라 로직을 작성합니다.
        setError('');
        alert('로그인 성공!'); // 예시 알림
    };

    return (
        <div className="main">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.1/font/bootstrap-icons.css"/>
            <div>
                <div className="login-box">
                    <img className="img-logo" src="./img/login.png"/>
                    <div className="inputs-box"><i className="bi bi-person-fill"></i> <input type="text"
                                                                                             className="input-box"/>
                    </div>
                    <div className="inputs-box"><i className="bi bi-lock-fill"></i> <input type="password"
                                                                                           className="input-box"/>
                    </div>
                    <button type="button" className="login_btn"> 로그인</button>
                </div>
            </div>
        </div>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Login/>
);