// src/components/BestsellersByRegion.js
import React from 'react';

const BestsellersByRegion = () => {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>지역</th>
                <th>베스트셀러</th>
                <th>고객사</th>
            </tr>
            </thead>
            <tbody>
            <tr><td>서울</td><td>데미안</td><td>교보문고</td></tr>
            <tr><td>부산</td><td>혼자서 공부하는 파이썬</td><td>알라딘</td></tr>
            </tbody>
        </table>
    );
};

export default BestsellersByRegion;
