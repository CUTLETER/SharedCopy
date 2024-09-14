import React, {useEffect, useState} from 'react';
import './Confirm.css';
import './modal_confirm1.css';
import useCheckboxManager from '../js/CheckboxManager';

import '../confirm/modal_confirm1.css';


const ConfirmModal = ({openModal, handleCloseClick, selectedItem, onUpdateItem}) => {
    const initialFormData = {
        confirmNo: '',
        customerName: '',
        employeeName: '',
        productType: '도서',
        productName: '',
        orderQty: 0,
        totalAmount: 0,
        delDate: '',
        customPrice: 0,
        approver: '',
        confirmStatus: '대기',
        remarks: '',
        confirmTitle: '',
        confirmRegDate: new Date().toISOString().split('T')[0]
    };


    const [formData, setFormData] = useState(initialFormData);
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete: handleDeleteItems
    } = useCheckboxManager();

    const [formList, setFormList] = useState([]);
    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

    useEffect(() => {
        if (selectedItem) {
            setFormData(selectedItem);
            setFormList([selectedItem]);
        } else {
            setFormData(formData);
            setFormList([]);
        }
    }, [selectedItem]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddClick = () => {
        setFormList(prevList => [...prevList, {...formData, confirmNo: prevList.length + 1}]);
        setFormData(initialFormData);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8383/confirm/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formList),
            });

            const result = await response.json();
            onUpdateItem(result);
            handleCloseClick();
            setFormList([]);
        } catch (error) {
            console.error('Error saving confirms:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    const handleAddClickCSV = () => {
        setIsVisibleCSV(!isVisibleCSV);
        // 여기다가 CSV 구현 예정
    };

    const handleDelete = () => {
        const newFormList = formList.filter((_, index) => !checkItem[index]);
        setFormList(newFormList);
    };

    return (
        <div>
            {openModal && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times; </button>
                            <div className="form-header">
                                <h1>결재 상세 조회</h1>
                                <div className="btns">
                                    <div className="btn-add">
                                        <button type="button" onClick={handleSubmit}>등록</button>
                                        {/* Changed type to "button" */}
                                    </div>
                                </div>
                            </div>
                            <form onSubmit={(e) => e.preventDefault()} className="RegistForm">
                                <table className="formTable">
                                    <tbody>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="confirmTitle">제목</label></th>
                                        <td colSpan="2">
                                            <input
                                                type="text"
                                                name="confirmTitle"
                                                value={formData.confirmTitle}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                        <th colSpan="1"><label htmlFor="customerName">고객명</label></th>
                                        <td colSpan="2">
                                            <input
                                                type="text"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                        <th colSpan="1"><label htmlFor="picName">담당자명</label></th>
                                        <td colSpan="2">
                                            <input
                                                type="text"
                                                name="employeeName"
                                                value={formData.employeeName}
                                                onChange={handleInputChange}
                                                placeholder="필드입력"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="productType">상품종류</label></th>
                                        <td>
                                            <select
                                                name="productType"
                                                value={formData.productType}
                                                onChange={handleInputChange}
                                            >
                                                <option value="도서">도서</option>
                                                <option value="MD">MD</option>
                                                <option value="기타">기타</option>
                                            </select>
                                        </td>
                                        <th><label htmlFor="productName">상품명</label></th>
                                        <td colSpan="3">
                                            <input
                                                type="text"
                                                name="productName"
                                                value={formData.productName}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                        <th><label htmlFor="qty">상품수량</label></th>
                                        <td>
                                            <input
                                                type="text"
                                                name="orderQty"
                                                value={formData.orderQty}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="customPrice">판매가</label></th>
                                        <td colSpan="1">
                                            <input
                                                type="text"
                                                name="customPrice"
                                                value={formData.customPrice}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                        <th colSpan="1"><label htmlFor="totalAmount">총 금액</label></th>
                                        <td colSpan="3">
                                            <input
                                                type="text"
                                                name="totalAmount"
                                                value={formData.totalAmount}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                        <th colSpan="1"><label htmlFor="delDate">납품 요청일</label></th>
                                        <td colSpan="2">
                                            <input
                                                type="date"
                                                name="delDate"
                                                value={formData.delDate}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="approver">결재자</label></th>
                                        <td>
                                            <input
                                                type="text"
                                                name="approver"
                                                value={formData.approver}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                        <th><label htmlFor="approvalStatus">결재 여부</label></th>
                                        <td>
                                            <select
                                                name="confirmStatus"
                                                value={formData.confirmStatus}
                                                onChange={handleInputChange}
                                            >
                                                <option value="pending">대기</option>
                                                <option value="approved">승인</option>
                                                <option value="rejected">반려</option>
                                            </select>
                                        </td>
                                        <th colSpan="1"><label htmlFor="remarks">비고</label></th>
                                        <td colSpan="4">
                                            <input
                                                type="text"
                                                name="remarks"
                                                value={formData.remarks}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <button id="downloadCsv">CSV 샘플 양식</button>
                                <button id="uploadCsv" onClick={handleAddClickCSV}>CSV 업로드</button>
                                {isVisibleCSV && (
                                    <input type="file" id="uploadCsvInput" accept=".csv"/>
                                )}

                                <div className="btn-add">
                                    <button type="button" onClick={handleAddClick}>추가</button>
                                </div>
                            </form>

                            <div className="RegistFormList">
                                <div style={{fontWeight: 'bold'}}> 총 {formList.length} 건</div>
                                <table className="formTableList">
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox" checked={allCheck}
                                                   onChange={handleMasterCheckboxChange}/></th>
                                        <th>No</th>
                                        <th>고객명</th>
                                        <th>상품 종류</th>
                                        <th>상품명</th>
                                        <th>상품 수량</th>
                                        <th>판매가</th>
                                        <th>총 금액</th>
                                        <th>납품 요청일</th>
                                        <th>담당자</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {formList.map((item, index) => (
                                        <tr key={item.No || index}>
                                            <td><input type="checkbox" checked={checkItem[index]}
                                                       onChange={() => handleCheckboxChange(index)}/></td>
                                            <td>{item.confirmNo || index + 1}</td>
                                            <td>{item.customerName}</td>
                                            <td>{item.productType}</td>
                                            <td>{item.productName}</td>
                                            <td>{item.orderQty}</td>
                                            <td>{item.customPrice}</td>
                                            <td>{item.totalAmount}</td>
                                            <td>{item.delDate}</td>
                                            <td>{item.employeeName}</td>
                                        </tr>
                                    ))}
                                    <tr style={{fontWeight: 'bold'}}>
                                        <td colSpan="8"> 합계</td>
                                        <td colSpan="2">
                                            {formList.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0)}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                {showDelete && (
                                    <button className='delete-btn' onClick={handleDelete}>삭제</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConfirmModal;