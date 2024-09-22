// DetailModal.js
import React from 'react';

const DetailModal = ({ title, data, setIsVisibleDetail }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-btn" onClick={() => setIsVisibleDetail(false)}> &times; </button>
                <h1>{title === 'product' ? '상품 상세 정보' : '고객 상세 정보'}</h1>
                <div className="detail-content">
                    {Object.keys(data).map((key) => (
                        <div key={key} className="detail-item">
                            <strong>{key}:</strong> {data[key]}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
