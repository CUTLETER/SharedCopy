// src/components/TopGenres.js
import React from 'react';

const TopGenres = () => {
    return (
        <div>
            <div className="top-genres">
                <span>
                    <img src="https://cdn.wbcb.co.kr/news/photo/202007/64375_72389_2237.jpg" alt="Fantasy Genre" /> 판타지
                </span>
                <small>이 장르가 가장 인기 있습니다.</small>
            </div>
            {/* Add more genres as needed */}
        </div>
    );
};

export default TopGenres;
