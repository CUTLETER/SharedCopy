// src/components/Dashboard.js
import React from 'react';
import MonthlySalesChart from './MonthlySalesChart';
import AgeGroupBestsellersChart from './AgeGroupBestsellersChart';
import EmployeeOfMonth from './EmployeeOfMonth';
import TopGenres from './TopGenres';
import TopSalesTable from './TopSalesTable';
import BestsellersByRegion from './BestsellersByRegion';
import AuthorRankings from './AuthorRankings';
import './Main.css';
import ReactDOM from "react-dom/client";

function Main() {
    return (
        <div className="dashboard">
            <div className="card">
                <h3>월 별 매출액</h3>
                <div className="chart-container">
                    <MonthlySalesChart/>
                </div>
            </div>
            <div className="card">
                <h3>판매 순위 탑10 (가격 기준)</h3>
                <TopSalesTable/>
            </div>
            <div className="card">
                <h3>이 달의 우수사원</h3>
                <EmployeeOfMonth/>
            </div>
            <div className="card">
                <h3>연령대 별 구매율</h3>
                <div className="chart-container">
                    <AgeGroupBestsellersChart/>
                </div>
            </div>
            <div className="card">
                <h3>인기 있는 장르/카테고리 탑 10</h3>
                <TopGenres/>
            </div>
            <div className="card">
                <h3>지역 별 베스트셀러</h3>
                <BestsellersByRegion/>
            </div>
            <div className="card">
                <h3>작가 순위</h3>
                <AuthorRankings/>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Main/>
);