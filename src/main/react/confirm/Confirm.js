import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './Confirm.css';
import './modal_confirm1.css';
import ConfirmModal from './ConfirmModal';

function Confirm() {

    const [confirm, setConfirm] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchParams, setSearchParams] = useState({
        customerName: '',
        employeeName: '',
        confirmRegDate: '',
        confirmDate: '',
        confirmStatus: ''
    });

// 정렬 이벤트
    const [order, setOrder] = useState([
        {
            productType: '',
            productName: '',
            productQty: '',
            customPrice: '',
            confirmStatus: '',
            confirmConfirmDate: ''
        }
    ]); // 리스트 데이터를 저장할 state

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        const sortOrder = [...confirm].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setConfirm(sortOrder);
        setSortConfig({ key, direction });
    };

    // 서버에서 데이터를 가져오는 함수 (예시)
    const fetchData = async (params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch('http://localhost:8383/confirm.do');
            const data = await response.json();
            console.log('data는 뭘까:'+data);
            setConfirm(data);
        } catch (error) {
            console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


// 모달창
    const handleOpenClick = () => {
        const item = confirm.find((item, index) => checkItem[index]);
        setSelectedItem(item || null);
        setOpenModal(true);
    }
    const handleCloseClick = () => {
        setOpenModal(false);
        setSelectedItem(null);
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSearchParams(prev => ({...prev, [name]: value}));
    }

    const handleUpdateItem = useCallback((updatedItem) => {
        setConfirm(prevConfirm =>
            prevConfirm.map(confirm =>
                confirm.confirmNo === updatedItem.confirmNo ? updatedItem : confirm
            )
        );
        setOpenModal(false);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData(searchParams);
    }

    return (
        <div>
            <div className="pageHeader"><h1><i className="bi bi-search"></i>결재 리스트</h1></div>

            <div className="main-container">
                <div className="filter-container">
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerName">고객명</label>
                        <input className="filter-input" type="text" id="customerName" name="customerName"
                               value={searchParams.employeeName} onChange={handleInputChange} placeholder="고객명" required />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeName">담당자</label>
                        <input className="filter-input" type="text" id="employeeName" name="employeeName"
                               value={searchParams.customerName} onChange={handleInputChange} placeholder="담당자" required />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmRegDate">시작 일자</label>
                        <span className="info-icon">
                            <i className="bi bi-info-circle"></i>
                            <span className="tooltip">결재 요청일 기준</span>
                        </span>
                        <input className="filter-input" type="date" id="confirmRegDate" required />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmConfirmDate">종료 일자</label>
                        <span className="info-icon">
                            <i className="bi bi-info-circle"></i>
                            <span className="tooltip">결재 요청일 기준</span>
                        </span>
                        <input className="filter-input" type="date" id="confirmConfirmDate" required />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmStatus">결재 여부</label>
                        <select className="filter-select" id="confirmStatus" name="confirmStatus"
                                value={searchParams.confirmStatus} onChange={handleInputChange} required>
                            <option value="승인">승인</option>
                            <option value="대기">대기</option>
                            <option value="반려">반려</option>
                        </select>
                    </div>
                    <button type="submit" className="filter-button">조회</button>
                </div>

                <button type="button" className="confirm-selected" onClick={handleOpenClick}>수정</button>

                <table className="seacrh-table">
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>고객명</th>
                        <th>상품 종류
                            <button className="sortBtn" onClick={() => sortData('productType')}>
                                {sortConfig.key === 'productType' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>상품명
                            <button className="sortBtn" onClick={() => sortData('productName')}>
                                {sortConfig.key === 'productName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>상품 수량
                            <button className="sortBtn" onClick={() => sortData('productQty')}>
                                {sortConfig.key === 'productQty' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>판매가(원)
                            <button className="sortBtn" onClick={() => sortData('customPrice')}>
                                {sortConfig.key === 'customPrice' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>총 금액(원)
                            <button className="sortBtn" onClick={() => sortData('totalAmount')}>
                                {sortConfig.key === 'totalAmount' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>납품 요청일
                            <button className="sortBtn" onClick={() => sortData('delDate')}>
                                {sortConfig.key === 'delDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>담당자</th>
                        <th>결재자</th>
                        <th>결재 여부</th>
                    </tr>
                    </thead>
                    <tbody>
                    {confirm.length > 0 ? (
                        confirm.map((item, index) => (
                            <tr key={item.No || index}>
                                <td>{item.No}</td>
                                <td>{item.customerName}</td>
                                <td>{item.productType}</td>
                                <td>{item.productName}</td>
                                <td>{item.productQty}</td>
                                <td>{item.customPrice}</td>
                                <td>{item.totalAmount}</td>
                                <td>{item.delDate}</td>
                                <td>{item.employeeName}</td>
                                <td>{item.approver}</td>
                                <td>{item.confirmStatus}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12">등록된 상품이 없습니다😭</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                openModal={openModal}
                handleCloseClick={handleCloseClick}
                selectedItem={selectedItem}
                onUpdateItem={handleUpdateItem}
            />

        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Confirm/>
);