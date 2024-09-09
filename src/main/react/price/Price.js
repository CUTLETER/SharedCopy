import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ReactDOM from "react-dom/client";
import './modalAdd.css';
import './modalDetail.css';
import './Price.css';
import useCheckboxManager from "../js/CheckboxManager";
import { CiSearch } from "react-icons/ci";

import {Bar, Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from 'chart.js';

ChartJS.register(
    BarElement,
    LineElement,
    PointElement,  // Register PointElement
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);


function Price() {
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager();

    const [price, setPrice] = useState([
        {
            priceNo: '',
            registerDate: '',
            productNo: '',
            customerNo: '',
            customPrice: '',
            currency: 0,
            discount: '',
            startDate: 0,
            endDate: ''
        }
    ]); // 리스트 데이터를 저장할 state

    // 서버에서 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
                try {
                    let data = await fetch('/price/all').then(res => res.json());
                    setPrice(data); // 데이터를 state에 저장
                    setOrder(data);
                } catch (error) {
                    console.error("데이터를 가져오는 중 오류 발생:", error);
                }
        };
        fetchData();
    }, []); // 컴포넌트가 처음 마운트될 때만 실행

    let [searchPrice, setSearchPrice] = useState({
        registerDate: '',
        productNo: '',
        customerNo: '',
        startDate: '',
        endDate: ''
    });

    let handleSearchPriceChange = (e) => {
        let copy = {...searchPrice, [e.name]: e.value};
        setSearchPrice(copy);
    }

    // Data and options for the chart
    const data = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        datasets: [
            {
                label: '매출액 (억 원)',
                data: [12, 19, 3, 5, 2, 3, 7, 8, 5, 9, 10, 14],
                backgroundColor: 'rgba(0, 123, 255, 0.8)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
                type: 'bar'
            },
            {
                label: '전년 대비 (%)',
                data: [5, 15, -3, -5, 2, 10, 7, 12, 5, -2, 0, 4],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
                type: 'line'
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e0e0e0'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333'
                }
            }
        }
    };
// --- 테이블 정렬 기능

// 주문 데이터를 저장하는 상태
    const [order, setOrder] = useState([
        {
            priceNo: '',
            registerDate: '',
            productNo: '',
            customerNo: '',
            customPrice: '',
            currency: 0,
            discount: '',
            startDate: 0,
            endDate: ''
        }
    ]); // 리스트 데이터를 저장할 state

// 정렬 상태와 방향을 저장하는 상태
    const [sortConfig, setSortConfig] = useState({key: '', direction: 'ascending'});

// 정렬 함수
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        const sortOrder = [...order].sort((a, b) => { //order배열 정렬(매개변수 비교)
            if (a[key] < b[key]) { // key는 변수명임 (ex. orderNo, manage, title ...)
                return direction === 'ascending' ? -1 : 1; //
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setOrder(sortOrder);
        setSortConfig({key, direction});
    };
// --- 테이블 정렬 기능

// ---  모달창 띄우는 스크립트
    const [isVisibleDetail, setIsVisibleDetail] = useState(false);

    const handleAddClickDetail = () => {
        setIsVisibleDetail(true);
    };

    const handleCloseClickDetail = () => {
        setIsVisibleDetail(false);
    };

    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

    const handleAddClickCSV = () => {
        setIsVisibleCSV((prevState) => !prevState);
    };


    const [isVisible, setIsVisible] = useState(false);

    const handleAddClick = () => {
        setIsVisible(true);
    };

    const handleCloseClick = () => {
        setIsVisible(false);
    };

// --- 모달창 띄우는 스크립트

    const handleSearchBtn = async () => {
        console.log(JSON.stringify(searchPrice));
        let {data} = await axios.post('/price/search', JSON.stringify(searchPrice), {
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log(JSON.stringify(data));
        setOrder(data);
    }

    const [modifyItem, setModifyItem] = useState([
        {
            priceNo: '',
            registerDate: '',
            productNo: '',
            customerNo: '',
            customPrice: '',
            currency: 0,
            discount: '',
            startDate: 0,
            endDate: ''
        }
    ]);
    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
    const handleModify = (item) => {
        setModifyItem(item);
        setIsModifyModalVisible(true);

    }

    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

    const handleModifyItemChange = (e) => {
        let copy = {...modifyItem, [e.name]: e.value};
        setModifyItem(copy);
    }

    return (

        <div>
            {/*<div>*/}
            {/*    <button type="button" onClick={handleBtn}>test</button>*/}
            {/*    <h1>{user.id} - {user.pw}</h1>*/}
            {/*</div>*/}

            <h1><i className="bi bi-search"></i> 판매가 리스트 </h1>


            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">
                            <div className="filter-item">
                                <label htmlFor="product-code">상품코드</label>
                                <input type="text" id="product-code" placeholder="상품코드"/>
                            </div>
                            <div className="filter-item">
                                <label htmlFor="product-name">상품명</label>
                                <input type="text" id="product-name" placeholder="상품명"/>
                            </div>
                            <div className="filter-item">
                                <label htmlFor="product-author">상품저자</label>
                                <input type="text" id="product-author" placeholder="상품저자"/>
                            </div>
                            <div className="filter-item">
                                <label htmlFor="product-category">상품카테고리</label>
                                <input type="text" id="product-category" placeholder="상품카테고리"/>
                            </div>
                            <div className="filter-item">
                                <label htmlFor="product-quantity">상품수량</label>
                                <input type="text" id="product-quantity" placeholder="상품수량"/>
                            </div>
                            <div className="filter-item">
                                <label htmlFor="product-price">상품원가</label>
                                <input type="text" id="product-price" placeholder="상품원가"/>
                            </div>
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="button" className="search-btn"><i className="bi bi-search search-icon"></i></button>
                    </div>
                </div>
                <button className="btn-common add" type="button" onClick={handleAddClick}>
                    판매가 등록
                </button>

                {/*<div style={{width: "100%", alignItems: "center", backgroundColor: "#fcfcfc", marginBottom: "50px"}}>*/}
                {/*    <div className="chart-container">*/}
                {/*        <div className="chart-header">*/}
                {/*            <h3>분기별 매출 예측</h3>*/}
                {/*            <button>데이터 업데이트</button>*/}
                {/*        </div>*/}
                {/*        /!*<div className="canvas"><Bar data={data} options={options} /></div>*!/*/}
                {/*        <Bar data={data} options={options} className="canvas"/>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <table className="search-table" style={{marginTop: "50px"}}>
                    {showDelete && <button className='delete-btn btn-common' onClick={handleDelete}>삭제</button>}
                    <thead>
                    <tr>
                        <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange}/></th>
                        <th> No.</th>
                        <th>등록일
                            <button className="sortBtn" onClick={() => sortData('registerDate')}>
                                {sortConfig.key === 'registerDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>상품명
                            <button className="sortBtn" onClick={() => sortData('productNo')}>
                                {sortConfig.key === 'productNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>업체명
                            <button className="sortBtn" onClick={() => sortData('customerNo')}>
                                {sortConfig.key === 'customerNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>가격
                            <button className="sortBtn" onClick={() => sortData('customPrice')}>
                                {sortConfig.key === 'customPrice' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>통화
                            <button className="sortBtn" onClick={() => sortData('currency')}>
                                {sortConfig.key === 'currency' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>할인율(%)
                            <button className="sortBtn" onClick={() => sortData('discount')}>
                                {sortConfig.key === 'currency' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>시작일
                            <button className="sortBtn" onClick={() => sortData('startDate')}>
                                {sortConfig.key === 'startDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>종료일
                            <button className="sortBtn" onClick={() => sortData('endDate')}>
                                {sortConfig.key === 'endDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {order.length > 0 ? (
                        order.map((item, index) => (
                            <tr key={index} className={checkItem[index] ? 'selected-row' : ''} onDoubleClick={() => {
                                handleModify(item)
                            }}>
                                <td><input type="checkbox" checked={checkItem[index] || false}
                                           onChange={handleCheckboxChange}/></td>
                                <td style={{display: 'none'}}>{index}</td>
                                <td>{index + 1}</td>
                                <td>{item.registerDate} </td>
                                <td>{item.productNo}</td>
                                <td>{item.customerNo}<i className="bi bi-search details"
                                                        onClick={handleAddClickDetail}/></td>
                                <td>{item.customPrice}</td>
                                <td>{item.currency}</td>
                                <td>{item.discount}</td>
                                <td>{item.startDate}</td>
                                <td>{item.endDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">등록된 상품이 없습니다😭</td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan="9"></td>
                        <td colSpan="1"> {order.length} 건</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* 여기 아래는 모달이다. */}


            {isVisible && (
                <div class="confirmRegist">
                    <div class="fullBody">
                        <div class="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div class="form-header">
                                <h1>고객 별 제품 판매가 등록</h1>

                                <div class="btns">
                                    <div class="btn-add2">
                                        <button> 등록하기</button>
                                    </div>
                                    <div class="btn-close">

                                    </div>
                                </div>
                            </div>


                            <div class="RegistForm">
                                <table class="formTable">
                                    <tr>
                                        <th colspan="1"><label htmlFor="productNo">상품</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" id="productNo"/></td>

                                        <th colspan="1"><label htmlFor="customerNo">고객</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" id="customerNo"/></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="customPrice">가격</label></th>
                                        <td><input type="number" placeholder="필드 입력" id="customPrice"/></td>

                                        <th><label htmlFor="currency">통화</label></th>
                                        <td><input type="text" placeholder="필드 입력" id="currency"/></td>

                                        <th><label htmlFor="discount">할인율(%)</label></th>
                                        <td><input type="number" placeholder="필드 입력" id="discount"/></td>
                                    </tr>
                                    <tr>
                                        <th colspan="1"><label htmlFor="registStartDate">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" id="registStartDate"/>
                                        </td>

                                        <th colspan="1"><label htmlFor="registEndDate">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" id="registEndDate"/></td>
                                    </tr>
                                </table>


                                <div className="btn-add">
                                    <button id="downloadCsv" className="btn-CSV">CSV 샘플 양식</button>
                                    <button id="uploadCsv" className="btn-CSV" onClick={handleAddClickCSV}>CSV 파일 업로드</button>
                                    {isVisibleCSV && (
                                        <input type="file" id="uploadCsvInput" accept=".csv"/>)}

                                    <button className="btn-common btn-add-p"> 추가</button>
                                </div>
                            </div>

                            <div class="RegistFormList">
                                <div style={{fontWeight: 'bold'}}> 총 N 건</div>
                                <table class="formTableList">
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox"/></th>
                                        <th>no</th>
                                        <th>품목명</th>
                                        <th>규격</th>
                                        <th>단위</th>
                                        <th>창고</th>
                                        <th>LOT</th>
                                        <th>현재고</th>
                                        <th>실사수량</th>
                                        <th>조정수량</th>
                                        <th>단가</th>
                                        <th>공급가액</th>
                                        <th>부가세</th>
                                        <th>총금액</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td><input type="checkbox"/></td>
                                        <td>1 </td>
                                        <td>제품공고1</td>
                                        <td>EA</td>
                                        <td>EA</td>
                                        <td>재품창고1 </td>
                                        <td>L2017-11-260001</td>
                                        <td>4,900</td>
                                        <td>5,000</td>
                                        <td>100</td>
                                        <td>3,000</td>
                                        <td>300,000</td>
                                        <td>30,000</td>
                                        <td>330,000</td>
                                    </tr>

                                    <tr style={{fontWeight: 'bold'}}>
                                        <td colspan="12"> 합계</td>
                                        <td colspan="2"> 13,000,000</td>
                                    </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {/* 모달창의 끝  */}

            {/* 수정 모달창 */}
            {isModifyModalVisible && (
                <div class="confirmRegist">
                    <div class="fullBody">
                        <div class="form-container">
                            <button className="close-btn" onClick={handleModifyCloseClick}> &times;
                            </button>
                            <div class="form-header">
                                <h1>고객 별 제품 판매가 수정</h1>

                                <div class="btns">
                                    <div class="btn-add2">
                                        <button> 수정하기</button>
                                    </div>
                                    <div class="btn-close">

                                    </div>
                                </div>
                            </div>


                            <div class="RegistForm">
                                <table class="formTable">
                                    <tr>
                                        <th colspan="1"><label htmlFor="productNo">상품</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" id="productNo" value={modifyItem.productNo} onChange={(e) => {handleModifyItemChange(e.target)}}/></td>

                                        <th colspan="1"><label htmlFor="customerNo">고객</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" id="customerNo" value={modifyItem.customerNo} onChange={(e) => {handleModifyItemChange(e.target)}}/></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="customPrice">가격</label></th>
                                        <td><input type="number" placeholder="필드 입력" id="customPrice" value={modifyItem.customPrice} onChange={(e) => {handleModifyItemChange(e.target)}}/></td>

                                        <th><label htmlFor="currency">통화</label></th>
                                        <td><input type="text" placeholder="필드 입력" id="currency" value={modifyItem.currency} onChange={(e) => {handleModifyItemChange(e.target)}}/></td>

                                        <th><label htmlFor="discount">할인율(%)</label></th>
                                        <td><input type="number" placeholder="필드 입력" id="discount" value={modifyItem.discount} onChange={(e) => {handleModifyItemChange(e.target)}}/></td>
                                    </tr>
                                    <tr>
                                        <th colspan="1"><label htmlFor="registStartDate">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" id="registStartDate" value={modifyItem.startDate} onChange={(e) => {handleModifyItemChange(e.target)}}/>
                                        </td>

                                        <th colspan="1"><label htmlFor="registEndDate">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" id="registEndDate" value={modifyItem.endDate} onChange={(e) => {handleModifyItemChange(e.target)}}/></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {/* 수정 모달창 끝  */}

            {/* 새로운 모달창 */}
            {isVisibleDetail && (

                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClickDetail}> &times;
                            </button>
                            <div className="form-header">
                                <h1> 고객 상세보기 </h1>

                                <div className="btns">
                                    <div className="btn-add2">
                                        <button> 수정하기</button>
                                    </div>
                                    <div className="btn-close">

                                    </div>
                                </div>
                            </div>


                            <div className="RegistForm">
                                <table className="formTable">
                                    <tr>
                                        <th colSpan="1"><label htmlFor="productNo">상품</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" id="productNo"
                                                               value={modifyItem.productNo} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>

                                        <th colSpan="1"><label htmlFor="customerNo">고객</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" id="customerNo"
                                                               value={modifyItem.customerNo} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="customPrice">가격</label></th>
                                        <td><input type="number" placeholder="필드 입력" id="customPrice"
                                                   value={modifyItem.customPrice} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>

                                        <th><label htmlFor="currency">통화</label></th>
                                        <td><input type="text" placeholder="필드 입력" id="currency"
                                                   value={modifyItem.currency} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>

                                        <th><label htmlFor="discount">할인율(%)</label></th>
                                        <td><input type="number" placeholder="필드 입력" id="discount"
                                                   value={modifyItem.discount} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="registStartDate">연락처</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" id="registStartDate"
                                                               value={modifyItem.startDate} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/>
                                        </td>

                                        <th colSpan="1"><label htmlFor="registEndDate">연락처</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" id="registEndDate"
                                                               value={modifyItem.endDate} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Price/>
);