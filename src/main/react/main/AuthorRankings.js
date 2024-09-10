// src/components/AuthorRankings.js
import React from 'react';

const AuthorRankings = () => {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>순위</th>
                <th>작가 이름</th>
                <th>판매 수량</th>
            </tr>
            </thead>
            <tbody>
            <tr><td>1</td><td>히가시노 게이고</td><td>200</td></tr>
            <tr><td>2</td><td>무라카미 하루키</td><td>180</td></tr>
            <tr><td>3</td><td>조지 오웰</td><td>160</td></tr>
            <tr><td>4</td><td>김영하</td><td>150</td></tr>
            <tr><td>5</td><td>정유정</td><td>140</td></tr>
            </tbody>
        </table>
    );
};

export default AuthorRankings;
