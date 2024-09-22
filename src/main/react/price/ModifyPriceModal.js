// ModifyPriceModal.js
import React from 'react';
import axios from 'axios';

const ModifyPriceModal = ({ isVisible, setIsVisible, modifyItem, fetchData }) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModifyItem((prev) => ({ ...prev, [name]: value }));
    };

    const handleModifySubmit = async () => {
        try {
            await axios.post('/price/modify', modifyItem, {
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            fetchData();
            setIsVisible(false);
        } catch (error) {
            console.error('수정 중 오류 발생:', error);
        }
    };

    return (
        isVisible && (
            <div className="modal">
                <div className="modal-content">
                    <button className="close-btn" onClick={() => setIsVisible(false)}> &times; </button>
                    <h1>고객 별 제품 판매가 수정</h1>
                    <div className="form-group">
                        <input name="productName" type="text" value={modifyItem.productName} readOnly />
                        <input name="customerName" type="text" value={modifyItem.customerName} readOnly />
                        <input name="customPrice" type="number" placeholder="가격" onChange={handleInputChange} value={modifyItem.customPrice} />
                        <input name="currency" type="text" placeholder="통화" onChange={handleInputChange} value={modifyItem.currency} />
                        <input name="discount" type="number" placeholder="할인율" onChange={handleInputChange} value={modifyItem.discount} />
                        <input name="startDate" type="date" onChange={handleInputChange} value={modifyItem.startDate} />
                        <input name="endDate" type="date" onChange={handleInputChange} value={modifyItem.endDate} />
                    </div>
                    <button onClick={handleModifySubmit}>수정하기</button>
                </div>
            </div>
        )
    );
};

export default ModifyPriceModal;
