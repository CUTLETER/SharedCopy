// src/components/TopSalesTable.js
import React from 'react';

const TopSalesTable = () => {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>순위</th>
                <th>책 제목</th>
                <th>판매 수량</th>
                <th>매출액 (만원)</th>
            </tr>
            </thead>
            <tbody>
            <tr><td>1</td><td>나미야 잡화점의 기적</td><td>120</td><td>1,200</td></tr>
            <tr><td>2</td><td>미드나잇 라이브러리</td><td>110</td><td>1,100</td></tr>
            <tr><td>3</td><td>역행자</td><td>100</td><td>1,000</td></tr>
            <tr><td>4</td><td>불편한 편의점</td><td>90</td><td>900</td></tr>
            <tr><td>5</td><td>달러구트 꿈 백화점</td><td>85</td><td>850</td></tr>
            </tbody>
        </table>
    );
};

export default TopSalesTable;
