import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from "react-dom/client";
import './Price.css';
import useCheckboxManager from "../js/CheckboxManager";
import useSort from '../js/useSort';
import '../js/modalAdd.css';
import ModalDetail from '../js/ModalDetail';
import '../js/Page.css'
import '../js/Pagination.css';
import Pagination from '../js/Pagination';

import {Bar} from 'react-chartjs-2';
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
import ReactPaginate from "react-paginate";
// import e from "babel-loader/lib/Error";

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
    // Data and options for the chart
    const chartData = {
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

    const [isChartVisible, setIsChartVisible] = useState(false);

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
            productName: '',
            customerNo: '',
            customerName: '',
            customPrice: '',
            currency: '',
            discount: '',
            startDate: '',
            endDate: ''
        }
    ]); // 리스트 데이터를 저장할 state

    const [product, setProduct] = useState([
        {
            productNo: 0,
            productName: '',
            productWriter: '',
            productCategory: '',
            productQty: '',
            productType: '',
            productPrice: '',
            productYn: ''
        }
    ]); // 리스트 데이터를 저장할 state

    const productOptions = product.map((item) => {
        return <option value={item.productNo} key={item.productNo}>{item.productName}</option>
    });
    const productDataList = <datalist id="productDataList">{productOptions}</datalist>

    const [customer, setCustomer] = useState([
        {
            customerNo: 0, //고객번호
            customerName: "", //고객명
            customerAddr: "", //고객주소
            customerTel: "", //고객 연락처
            postNum: "", //우편번호
            businessRegistrationNo: "", //사업자 등록 번호
            nation: "", //국가
            dealType: "", //거래 유형
            picName: "", //담당자명
            picEmail: "", //담당자 이메일
            picTel: "", //담당자 연락처
            activated: "" //활성화
        }
    ]);
    const customerOptions = customer.map((item) => {
        return <option value={item.customerNo} key={item.customerNo}>{item.customerName}</option>
    });
    const customerDataList = <datalist id="customerDataList">{customerOptions}</datalist>

    useEffect(() => {

        fetchData();
        handleSearchBtn();

    }, []); // 컴포넌트가 처음 마운트될 때만 실행

    // 서버에서 데이터 가져오기
    const fetchData = async () => {
        try {
            let {data} = await axios('/price/all');

            setProduct(data.productList);
            setCustomer(data.customerList);
        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        }
    };

    let [searchPrice, setSearchPrice] = useState({
        registerDate: '',
        productNo: '',
        customerNo: '',
        startDate: '',
        endDate: '',
        page: 1,
        amount: 10
    });

    let handleSearchPriceChange = (e) => {
        let copy = {...searchPrice, [e.name]:e.value};
        setSearchPrice(copy);
    }

    async function getSearchItems (item) {
        let {data} = await axios.post('/price/search', JSON.stringify(item), {
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            }
        });
        setPrice(data.pageData);
        setCurrentPage(data.page);
        setTotalItems(data.total);
        setItemsPerPage(data.pageData.length);
        setPageCount(data.realEnd);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(100); // 총 아이템 수
    const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 아이템 수
    const [pageCount, setPageCount] = useState(10); // 총 페이지 수 계산

    const handleSearchBtn = async () => {
        await getSearchItems(searchPrice);


        if (searchPrice.productNo !== '' && searchPrice.customerNo !== '') {
            setIsChartVisible(true);
        }
    }

    // 페이지 변경 시 호출될 함수
    const handlePageChange = async(selectedPage) => {
        console.log(selectedPage.selectedIndex);
        console.log(selectedPage.selectedItem);
        console.log(selectedPage.selected);
        console.log(selectedPage.selected+1);

        let copy = {...searchPrice, page: selectedPage.selected+1};
        console.log(copy);

        await getSearchItems(copy).then(r => console.log(r));
    };

    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

    const handleAddClickCSV = () => {
        setIsVisibleCSV((prevState) => !prevState);
    };

    const [selectedFiles, setSelectedFiles] = useState();

    const handleFileChange = async (e) => {
        setSelectedFiles(e.target.files);
    }
// --- 테이블 정렬 기능
    const {sortedData, sortData, sortConfig} = useSort(price);

// --- 상세 모달창 띄우는 스크립트
    const [isVisibleDetail, setIsVisibleDetail] = useState(false);
    const [modalDetailTitle, setModalDetailTitle] = useState('');
    const [modalDetailData, setModalDetailData] = useState({});

    const handleAddClickDetail = (title, id) => {
        let data = {};

        if (title === 'product') {
            data = product.filter((item) => item.productNo === id)[0];
        }

        if (title === 'customer') {
            data = customer.filter((item) => item.customerNo === id)[0];
        }

        setModalDetailData(data);
        setModalDetailTitle(title);

        setIsVisibleDetail(true);
    };

    const handleCloseClickDetail = () => {
        setIsVisibleDetail(false);
    };

// --- 추가 모달창 띄우는 스크립트
    const [isVisible, setIsVisible] = useState(false);

    const handleAddClick = () => {
        setIsVisible(true);
    };

    const handleCloseClick = () => {
        setIsVisible(false);
    };

    const [modifyItem, setModifyItem] = useState([
        {
            priceNo: '',
            registerDate: '',
            productNo: '',
            productName: '',
            customerNo: '',
            customerName: '',
            customPrice: '',
            currency: '',
            discount: '',
            startDate: '',
            endDate: ''
        }
    ]);
    let [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
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

    const handleModifyBtn = async () => {
        await axios.post('/price/modify', JSON.stringify(modifyItem), {
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(r => {
            setIsModifyModalVisible(false);
            fetchData();
        }) ;
    }

    let [insertPrice, setInsertPrice] = useState({
        productNo: '',
        customerNo: '',
        customPrice: '',
        currency: '',
        discount: '',
        startDate: '',
        endDate: ''
    });

    const handleInsertPrice = (e) => {
        let copy = {...insertPrice, [e.name]: e.value};
        setInsertPrice(copy);
    }

    let [insertPriceList, setInsertPriceList] = useState([]);

    const handleInsertPriceList = () => {
        if (insertPrice.productNo === '') {
            alert('제품을 선택해 주세요.');
            return;
        }
        if (insertPrice.customerNo === '') {
            alert('고객을 선택해 주세요.');
            return;
        }
        if (insertPrice.customPrice === '') {
            alert('가격을 입력해 주세요.');
            return;
        }
        if (insertPrice.currency === '') {
            alert('화폐 통화를 입력해 주세요.');
            return;
        }
        if (insertPrice.startDate === '') {
            alert('판매가 적용 시작일을 선택해 주세요.');
            return;
        }
        if (insertPrice.endDate === '') {
            alert('판매가 적용 기한을 선택해 주세요.');
            return;
        }

        let copy = [...insertPriceList, insertPrice];
        setInsertPriceList(copy);
    }

    const handleRegisterAddBtn = async () => {
        if (insertPriceList.length === 0 && selectedFiles.length === 0) {
            alert('값을 추가해 주세요');
            return;
        }

        if (insertPriceList.length > 0 ) {
            await axios.post('/price/register', JSON.stringify(insertPriceList), {
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(r => {
                setIsVisible(false);
                fetchData();
            });
        }

        if (selectedFiles !== null) {
            const formData = new FormData();

            Array.from(selectedFiles).forEach((item) => {
                formData.append('file', item);
            });

            await axios.post('/price/register/csv', formData, {
                headers : {
                    'content-type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            }).then(r => {
                setIsVisible(false);
                fetchData();
            });
        }
    }
//-------------------------------------------------------------------

    //키 (상품코드) : 값 (상품이름)
    // console.log(product);
    //
    //
    // const [inputValue, setInputValue] = useState('');
    // const [filteredOptions, setFilteredOptions] = useState([]);
    // const browsers = ['아기돼지삼형제', '데미안', '위대한 개츠비', '어린 왕자', '부리부리대마왕의 지구정복이야기', '해리포터'];
    //
    // const handleInputChange = (event) => {
    //     const value = event.target.value;
    //     setInputValue(value);
    //
    //     if (value) {
    //         const filtered = browsers.filter((browser) =>
    //             browser.toLowerCase().includes(value.toLowerCase())
    //         );
    //         setFilteredOptions(filtered);
    //     } else {
    //         setFilteredOptions([]);
    //     }
    // };
    //
    // const handleOptionClick = (option) => {
    //     setInputValue(option);
    //     setFilteredOptions([]);
    // };

    return (

        <div>



            <h1><i className="bi bi-currency-dollar"></i> 판매가 리스트 </h1>
            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">
                            <div className="filter-item">
                                <label className="filter-label" htmlFor="product">상품</label>
                                <input name="productNo" className="filter-label" type="number" list="productDataList"
                                       id="product"
                                       placeholder="상품"
                                       onChange={(e) => {
                                           handleSearchPriceChange(e.target)
                                       }}/>
                                {productDataList}


                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="customer">업체</label>
                                <input name="customerNo" className="filter-label" type="number" list="customerDataList"
                                       id="customer"
                                       placeholder="고객"
                                       onChange={(e) => {
                                           handleSearchPriceChange(e.target)
                                       }}/>
                                {customerDataList}
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="date">등록일자</label>
                                <input name="registerDate" className="filter-input" type="date" id="date"
                                       value={searchPrice.registerDate}
                                       onChange={(e) => {
                                           handleSearchPriceChange(e.target)
                                       }}
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="startDate">시작일자</label>
                                <input name="startDate" className="filter-input" type="date" id="startDate"
                                       value={searchPrice.startDate}
                                       onChange={(e) => {
                                           handleSearchPriceChange(e.target)
                                       }}
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="endDate">종료일자</label>
                                <input name="endDate" className="filter-input" type="date" id="endDate"
                                       value={searchPrice.endDate}
                                       onChange={(e) => {
                                           handleSearchPriceChange(e.target)
                                       }}/>
                            </div>
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="button" className="search-btn" onClick={handleSearchBtn}><i
                            className="bi bi-search search-icon"></i>
                        </button>
                    </div>
                </div>

                {/*{isChartVisible && <div*/}
                {/*    style={{width: "100%", alignItems: "center", backgroundColor: "#fcfcfc", marginBottom: "50px"}}>*/}
                {/*    <div className="chart-container">*/}
                {/*        <div className="chart-header">*/}
                {/*            <h3>분기별 매출 예측</h3>*/}
                {/*        </div>*/}
                {/*        /!*<div className="canvas"><Bar data={data} options={options} /></div>*!/*/}
                {/*        <Bar data={chartData} options={options} className="canvas"/>*/}
                {/*    </div>*/}
                {/*</div>}*/}

                <button className="btn-common add" type="button" onClick={handleAddClick}>
                    판매가 등록
                </button>

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
                    {sortedData.length > 0 ? (
                        sortedData.map((item, index) => (
                            <tr key={index} className={checkItem[index] ? 'selected-row' : ''} onDoubleClick={() => {
                                handleModify(item)
                            }}>
                                <td><input type="checkbox" checked={checkItem[index] || false}
                                           onChange={handleCheckboxChange}/></td>
                                <td style={{display: 'none'}}>{index}</td>
                                <td>{((currentPage-1)*10) + index + 1}</td>
                                <td>{item.registerDate} </td>
                                <td>{item.productName}
                                    <i className="bi bi-search details"
                                       onClick={() => {
                                           handleAddClickDetail('product', item.productNo)
                                       }}/>
                                </td>
                                <td>
                                    {item.customerName}
                                    <i className="bi bi-search details"
                                       onClick={() => {
                                           handleAddClickDetail('customer', item.customerNo)
                                       }}/>
                                </td>
                                <td>{item.customPrice}</td>
                                <td>{item.currency}</td>
                                <td>{item.discount}</td>
                                <td>{item.startDate}</td>
                                <td>{item.endDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">등록된 상품이 없습니다
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-emoji-tear" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path
                                        d="M6.831 11.43A3.1 3.1 0 0 1 8 11.196c.916 0 1.607.408 2.25.826.212.138.424-.069.282-.277-.564-.83-1.558-2.049-2.532-2.049-.53 0-1.066.361-1.536.824q.126.27.232.535.069.174.135.373ZM6 11.333C6 12.253 5.328 13 4.5 13S3 12.254 3 11.333c0-.706.882-2.29 1.294-2.99a.238.238 0 0 1 .412 0c.412.7 1.294 2.284 1.294 2.99M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5m-1.5-3A.5.5 0 0 1 10 3c1.162 0 2.35.584 2.947 1.776a.5.5 0 1 1-.894.448C11.649 4.416 10.838 4 10 4a.5.5 0 0 1-.5-.5M7 3.5a.5.5 0 0 0-.5-.5c-1.162 0-2.35.584-2.947 1.776a.5.5 0 1 0 .894.448C4.851 4.416 5.662 4 6.5 4a.5.5 0 0 0 .5-.5"/>
                                </svg>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan="9"></td>
                        <td colSpan="1"> {sortedData.length} 건</td>
                    </tr>
                    </tbody>
                </table>
                <Pagination
                    pageCount={pageCount} // 총 페이지 수
                    onPageChange={handlePageChange} // 페이지 변경 이벤트 핸들러
                    currentPage={currentPage} // 현재 페이지
                    total={totalItems} // 총 아이템 수
                />
            </div>



            {isVisible && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div className="form-header">
                                <h1>고객 별 제품 판매가 등록</h1>

                                <div className="btns">
                                    <div className="btn-add2">
                                        <button onClick={handleRegisterAddBtn}> 등록하기</button>
                                    </div>
                                    <div className="btn-close">

                                    </div>
                                </div>
                            </div>


                            <div className="RegistForm">
                                <table className="formTable">
                                    <thead>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="registProductNo">상품</label></th>
                                        <td colSpan="3">
                                            <select name="productNo" className="filter-input" id="registProductNo"
                                                    placeholder="상품"
                                                    onChange={(e) => {
                                                        handleInsertPrice(e.target)
                                                    }}>
                                                {productOptions}
                                            </select>
                                        </td>

                                        <th colSpan="1"><label htmlFor="registCustomerNo">고객</label></th>
                                        <td colSpan="3">
                                            <select name="customerNo" className="filter-input" id="registCustomerNo"
                                                    placeholder="고객"
                                                    onChange={(e) => {
                                                        handleInsertPrice(e.target)
                                                    }}>
                                                {customerOptions}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="registCustomPrice">가격</label></th>
                                        <td><input name="customPrice" type="number" placeholder="필드 입력"
                                                   id="registCustomPrice"
                                                   value={insertPrice.customPrice} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/></td>

                                        <th><label htmlFor="registCurrency">통화</label></th>
                                        <td><input name="currency" type="text" placeholder="필드 입력" id="registCurrency"
                                                   value={insertPrice.currency} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/></td>

                                        <th><label htmlFor="registDiscount">할인율(%)</label></th>
                                        <td><input name="discount" type="number" placeholder="필드 입력" id="registDiscount"
                                                   value={insertPrice.discount} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/></td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="registStartDate">시작일</label></th>
                                        <td colSpan="3"><input name="startDate" type="date" placeholder="필드 입력"
                                                               id="registStartDate"
                                                               value={insertPrice.startDate} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/>
                                        </td>

                                        <th colSpan="1"><label htmlFor="registEndDate">종료일</label></th>
                                        <td colSpan="3"><input name="endDate" type="date" placeholder="필드 입력"
                                                               id="registEndDate"
                                                               value={insertPrice.endDate} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/></td>
                                    </tr>
                                    </thead>
                                </table>


                                <div className="btn-add">
                                    {/*<button id="downloadCsv" className="btn-CSV">CSV 샘플 양식</button>*/}
                                    {/*<button id="uploadCsv" className="btn-CSV" onClick={handleAddClickCSV}>CSV 파일 업로드*/}
                                    {/*</button>*/}
                                    {/*{isVisibleCSV && (*/}
                                    {/*    <input type="file" id="uploadCsvInput" accept=".csv"*/}
                                    {/*           onChange={handleFileChange}/>)}*/}

                                    <button className="btn-common btn-add-p" onClick={handleInsertPriceList}> 추가
                                    </button>
                                </div>
                            </div>

                            <div className="RegistFormList">
                                <div style={{fontWeight: 'bold'}}> 총 N 건</div>
                                <table className="formTableList">
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox"/></th>
                                        <th>no</th>
                                        <th>상품</th>
                                        <th>고객</th>
                                        <th>가격</th>
                                        <th>통화</th>
                                        <th>할인율</th>
                                        <th>시작일</th>
                                        <th>종료일</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {insertPriceList.length > 0 ? (insertPriceList.map((item, index) => (
                                        <tr key={index}>
                                            <td><input type="checkbox" checked={checkItem[index] || false}
                                                       onChange={handleCheckboxChange}/></td>
                                            <td style={{display: 'none'}}>{index}</td>
                                            <td>{index + 1}</td>
                                            <td>{item.productNo}</td>
                                            <td>
                                                {item.customerNo}
                                                <i className="bi bi-search details"
                                                   onClick={handleAddClickDetail}/>
                                            </td>
                                            <td>{item.customPrice}</td>
                                            <td>{item.currency}</td>
                                            <td>{item.discount}</td>
                                            <td>{item.startDate}</td>
                                            <td>{item.endDate}</td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            {/*<td colSpan="10">등록된 상품이 없습니다<i className="bi bi-emoji-tear"></i></td>*/}
                                            <td colSpan="10">등록된 상품이 없습니다
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-emoji-tear"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                    <path
                                                        d="M6.831 11.43A3.1 3.1 0 0 1 8 11.196c.916 0 1.607.408 2.25.826.212.138.424-.069.282-.277-.564-.83-1.558-2.049-2.532-2.049-.53 0-1.066.361-1.536.824q.126.27.232.535.069.174.135.373ZM6 11.333C6 12.253 5.328 13 4.5 13S3 12.254 3 11.333c0-.706.882-2.29 1.294-2.99a.238.238 0 0 1 .412 0c.412.7 1.294 2.284 1.294 2.99M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5m-1.5-3A.5.5 0 0 1 10 3c1.162 0 2.35.584 2.947 1.776a.5.5 0 1 1-.894.448C11.649 4.416 10.838 4 10 4a.5.5 0 0 1-.5-.5M7 3.5a.5.5 0 0 0-.5-.5c-1.162 0-2.35.584-2.947 1.776a.5.5 0 1 0 .894.448C4.851 4.416 5.662 4 6.5 4a.5.5 0 0 0 .5-.5"/>
                                                </svg>
                                            </td>
                                        </tr>
                                    )}
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
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleModifyCloseClick}> &times;
                            </button>
                            <div className="form-header">
                                <h1>고객 별 제품 판매가 수정</h1>

                                <div className="btns">
                                    <div className="btn-add2">
                                        <button onClick={handleModifyBtn}> 수정하기</button>
                                    </div>
                                    <div className="btn-close">

                                    </div>
                                </div>
                            </div>


                            <div className="RegistForm">
                                <table className="formTable">
                                    <tr>
                                        <th colSpan="1"><label htmlFor="modifyProductNo">상품</label></th>
                                        <td colSpan="3">
                                            <input name="productNo" className="filter-input" id="modifyProductNo"
                                                   placeholder="상품"
                                                   value={modifyItem.productName}
                                                   readOnly={true}/>
                                        </td>

                                        <th colSpan="1"><label htmlFor="modifyCustomerNo">고객</label></th>
                                        <td colSpan="3">
                                            <input name="customerNo" className="filter-input" id="modifyCustomerNo"
                                                   placeholder="고객"
                                                   value={modifyItem.customerName}
                                                   readOnly={true}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="modifyCustomPrice">가격</label></th>
                                        <td><input name="customPrice" type="number" placeholder="필드 입력"
                                                   id="modifyCustomPrice"
                                                   value={modifyItem.customPrice} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>

                                        <th><label htmlFor="modifyCurrency">통화</label></th>
                                        <td><input name="currency" type="text" placeholder="필드 입력" id="modifyCurrency"
                                                   value={modifyItem.currency} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>

                                        <th><label htmlFor="modifyDiscount">할인율(%)</label></th>
                                        <td><input name="discount" type="number" placeholder="필드 입력" id="modifyDiscount"
                                                   value={modifyItem.discount} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="registStartDate">시작일</label></th>
                                        <td colSpan="3"><input name="startDate" type="date" placeholder="필드 입력"
                                                               id="modifyStartDate"
                                                               value={modifyItem.startDate} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/>
                                        </td>

                                        <th colSpan="1"><label htmlFor="registStartDate">종료일</label></th>
                                        <td colSpan="3"><input name="startDate" type="date" placeholder="필드 입력"
                                                               id="modifyEndDate"
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
            {/* 수정 모달창 끝  */}

            {/* 상세 모달창 */}
            {isVisibleDetail && (

                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClickDetail}> &times;
                            </button>


                            <ModalDetail title={modalDetailTitle} data={modalDetailData}/>
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