// src/components/EmployeeOfMonth.js
import React from 'react';

const EmployeeOfMonth = () => {
    return (
        <div className="employee-ranker">
            <img
                src="https://file2.nocutnews.co.kr/newsroom/image/2023/06/06/202306060141536125_0.jpg"
                alt="Employee of the Month"
                className="employee-photo"
            />
            <div id="employee-of-month" style={{ textAlign: 'center', marginTop: '30px' }}>
                Thomas Mueller (매출액: 1,500만원)
            </div>
        </div>
    );
};

export default EmployeeOfMonth;
