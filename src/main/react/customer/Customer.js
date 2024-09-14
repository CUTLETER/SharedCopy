import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import useCheckboxManager from "../js/CheckboxManager";
import useSort from '../js/useSort';
import './Customer.css'
import './modalAdd.css'
import './modalDetail.css'


function Customer() {

    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager();

    // 메인 리스트
    let [customer, setCustomer] = useState([{
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddress: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: '',
        activated: ''
    }]);

    // 메인 리스트 가져오기 axios
    useEffect(() => {
        axios.get('/customer/customerList')  // Spring Boot 엔드포인트와 동일한 URL로 요청
            .then(response => setCustomer(response.data))  // 응답 데이터를 상태로 설정
            .catch(error => console.error('Error fetching Customer data:', error));
    }, []);

    // 검색,필터 기능
    let [customerSearch, setEmSearch] = useState({
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddress: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: '',
        activated: ''
    });

    // 필터 변경 핸들러
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        console.log(e.target);
        // 변경된 필드의 값을 업데이트합니다.
        setEmSearch((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // 검색 리스트
    const handleSearchCustomer = () => {
        if (customerSearch) {
            axios.post('/customer/customerSearch', customerSearch, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => setCustomer(response.data))
                .catch(error => console.error('에러에러', error));
        } else {
            console.error('[핸들러 작동 잘 함]');
        }
    };

    // 직원 추가  리스트
    const [regist, setTest] = useState({
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddress: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: '',
        activated: ''
    });

    const [list, setList] = useState([]);
    const [customerRegist, setCustomerRegist] = useState([]);

    const handleInputAddChange = (e) => {
        const { name, value } = e.target;
        setTest((prevTest) => ({
            ...prevTest,
            [name]: value,
        }));
        console.log(regist);
    };

    // 추가 핸들러
    const handleInputRegistAdd = (e) => {
        const { id, value } = e.target;
        console.log(e.target);
        // 변경된 필드의 값을 업데이트합니다.
        setCustomerRegist((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(customerRegist);
    };

    // 리스트에 입력값 추가 핸들러
    const onClickListAdd = () => {
        setList((prevList) => [...prevList, regist]);
        setTest({
            customerNo: '',
            customerName: '',
            customerTel: '',
            customerAddress: '',
            postNum: '',
            businessRegistrationNo: '',
            nation: '',
            dealType: '',
            picName: '',
            picEmail: '',
            picTel: '',
            activated: ''
        }); // 입력값 초기화

        console.log('리스트:', JSON.stringify(list));
    };

    const onClickRegistBtn = () => {
        if (list.length > 0) {
            setCustomerRegist(list); // 등록할 항목이 있는 경우에만 상태 업데이트

            // 서버에 등록 요청 보내기
            axios
                .post('/customer/customerRegist', list, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    setCustomer(response.data); // 서버 응답 데이터로 Customer 상태 업데이트
                    console.log('등록 성공:', response.data);
                })
                .catch((error) => console.error('서버 요청 중 오류 발생', error))
                .finally(() => setIsVisible(false)); // 요청 완료 후 항상 실행되는 블록
            window.location.reload();
            setList([]); // 기존 목록 초기화
        } else {
            console.error('등록할 항목이 없습니다');
        }
    };


    // 참고용 코드
    //    const onClickRegistBtn = () => {
    //           setCustomerRegist(list);
    //           setList([]);
    //       };
    //
    //            useEffect(() => {
    //                                 if (customerRegist.length > 0) {
    //                                     axios.post('/Customer/customerRegist', customerRegist, {
    //                                         headers: {
    //                                             'Content-Type': 'application/json'
    //                                         }
    //                                     })
    //                                     .then(response => setCustomer(response.data))
    //                                     .catch(error => console.error('서버 요청 중 오류 발생', error));
    //                                 } else if (customerRegist.length === 0) {
    //                                     console.error('등록할 항목이 없습니다');
    //                                 }
    //                                 setIsVisible(false);
    //                             }, [customerRegist]);

    // 상태가 업데이트된 후 로그를 출력하기 위한 useEffect
    //    useEffect(() => {
    //        console.log('업데이트된 customerRegist:', JSON.stringify(customerRegist));
    //    }, [customerRegist]);


    // --- 테이블 정렬 기능
    const { sortedData, sortData, sortConfig } = useSort(customer);

    // ---  모달창 띄우는 스크립트
    const [isVisibleDetail, setIsVisibleDetail] = useState(false);

    const handleAddClickDetail = () => {
        setIsVisibleDetail(true);
    };

    const handleCloseClickDetail = () => {
        setIsVisibleDetail(false);
    };

    // CSV 이벤트
    const [isVisibleCSV, setIsVisibleCSV] = useState(false);
    const handleAddClickCSV = () => {
        setIsVisibleCSV((prevState) => !prevState);
    };

    // 버튼 이벤트
    const [isVisible, setIsVisible] = useState(false);
    const handleAddClick = () => {
        setIsVisible(true);
    };
    const handleCloseClick = () => {
        setList([]); // 기존 목록 초기화
        setIsVisible(false);
    };

    // --- 수정 기능
    const [modifyItem, setModifyItem] = useState(
        {
            customerNo: '',
            customerName: '',
            customerTel: '',
            customerAddress: '',
            postNum: '',
            businessRegistrationNo: '',
            nation: '',
            dealType: '',
            picName: '',
            picEmail: '',
            picTel: '',
            activated: ''
        }
    );

    //업데이트 기능
    const handleUpdateClick = () => {
        console.log(modifyItem);
        axios.post('/customer/customerUpdate', modifyItem, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setCustomer(response.data);  // 서버 응답 데이터로 Customer 상태 업데이트
                console.log('업데이트 성공:', response.data);
            })
            .catch(error => console.error('서버 요청 중 오류 발생', error))
            .finally(() => {
                setIsModifyModalVisible(false);
                window.location.reload();// 모달 숨기기
            });
    };

    // 수정 창 모달
    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
    const handleModify = (item) => {
        setModifyItem(item);
        setIsModifyModalVisible(true);
    }

    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

    const handleModifyItemChange = (e) => {
        let copy = { ...modifyItem, [e.name]: e.value };
        console.log(modifyItem);
        setModifyItem(copy);
    }

    // 삭제 기능
    const [checkedIds, setCheckedIds] = useState([]);

    useEffect(() => {
        // 모든 체크된 체크박스를 선택합니다.
        const checkedCheckboxes = Array.from(document.querySelectorAll('input.mainCheckbox:checked'));

        // 체크된 체크박스의 ID 값을 배열로 저장합니다.
        const ids = checkedCheckboxes.map(checkbox => checkbox.id);

        // 상태를 업데이트하여 배열에 저장합니다.
        console.log(checkedIds);
        setCheckedIds(ids);
    }, [checkItem]);


    //삭제 기능
    const handleDeleteClick = () => {
        axios.post('/customer/customerDelete', checkedIds, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('삭제 요청 성공', response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error('서버 요청 중 오류 발생', error);
            });
    }

    return (
        <div className='fade_effect'>
            <h1><i class="bi bi-person-lines-fill"></i> 직원 관리 </h1>
            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="customerName">고객명</label>
                                <input className="filter-input" type="text" id="customerName" placeholder="" onChange={handleInputChange} value={customerSearch.customerName} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="customerTel">고객 연락처</label>
                                <input className="filter-input" type="text" id="customerTel" placeholder="" onChange={handleInputChange} value={customerSearch.customerTel} r required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="businessRegistrationNo">사업자 등록 번호</label>
                                <input className="filter-input" type="text" id="businessRegistrationNo" placeholder="" onChange={handleInputChange} value={customerSearch.businessRegistrationNo} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="customerAddress">고객 주소</label>
                                <input className="filter-input" type="text" id="customerAddress" placeholder="" onChange={handleInputChange} value={customerSearch.customerAddress} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="postNum">우편번호</label>
                                <input className="filter-input" type="text" id="postNum" placeholder="" onChange={handleInputChange} value={customerSearch.postNum} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="nation">국가</label>
                                <input className="filter-input" type="text" id="nation" placeholder="" onChange={handleInputChange} value={customerSearch.nation} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="picName">담당자명</label>
                                <input className="filter-input" type="text" id="picName" placeholder="" onChange={handleInputChange} value={customerSearch.picName} required />
                            </div>

                            <div className="filter-row">
                                <label className="filter-label" htmlFor="picEmail">담당자 이메일</label>
                                <input className="filter-input" type="text" id="picEmail" placeholder="담당자 이메일" onChange={handleInputChange} value={customerSearch.picName} required />
                            </div>

                            <div className="filter-row">
                                <label className="filter-label" htmlFor="picTel">담당자 연락처</label>
                                <input className="filter-input" type="text" id="picTel" placeholder="담당자 연락처" onChange={handleInputChange} value={customerSearch.picName} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="nation">국가</label>
                                <select id="authorityGrade" onChange={handleInputChange} value={customerSearch.nation}>
                                    <option value="" disabled>국가 선택</option>
                                    <option value="KR">대한민국</option>
                                    <option value="US">미국</option>
                                    <option value="JP">일본</option>
                                    <option value="CN">중국</option>
                                </select>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="nation">거래 유형</label>
                                <select id="authorityGrade" onChange={handleInputChange} value={customerSearch.dealType}>
                                    <option value="" disabled>거래 유형 선택</option>
                                    <option value="B2B">B2B</option>
                                    <option value="B2C">B2C</option>
                                    <option value="C2C">C2C</option>
                                </select>
                            </div>

                            <div className="button-container">
                                <button type="button" className="search-btn" onClick={handleSearchCustomer}><i className="bi bi-search search-icon"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <button className="btn-common add" type="button" onClick={handleAddClick}>
                    고객 등록
                </button>

                <table className="search-table" style={{ marginTop: "50px" }}>
                    {showDelete && <button className='delete-btn btn-common' onClick={handleDeleteClick}>삭제</button>}
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange} /></th>
                            <th> No.</th>
                            <th>고객 번호
                                <button className="sortBtn" onClick={() => sortData('customerNo')}>
                                    {sortConfig.key === 'customerNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>고객명
                                <button className="sortBtn" onClick={() => sortData('customerName')}>
                                    {sortConfig.key === 'customerName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>고객 주소
                                <button className="sortBtn" onClick={() => sortData('customerAddr')}>
                                    {sortConfig.key === 'customerAddr' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>고객 연락처
                                <button className="sortBtn" onClick={() => sortData('customerTel')}>
                                    {sortConfig.key === 'customerTel' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>우편번호
                                <button className="sortBtn" onClick={() => sortData('postNum')}>
                                    {sortConfig.key === 'postNum' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>사업자 등록 번호
                                <button className="sortBtn" onClick={() => sortData('businessRegistrationNo')}>
                                    {sortConfig.key === 'businessRegistrationNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>국가
                                <button className="sortBtn" onClick={() => sortData('nation')}>
                                    {sortConfig.key === 'nation' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>거래유형
                                <button className="sortBtn" onClick={() => sortData('dealType')}>
                                    {sortConfig.key === 'dealType' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>담당자명
                                <button className="sortBtn" onClick={() => sortData('picName')}>
                                    {sortConfig.key === 'picName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>담당자 이메일
                                <button className="sortBtn" onClick={() => sortData('picEmail')}>
                                    {sortConfig.key === 'picEmail' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>

                            <th>활성화
                                <button className="sortBtn" onClick={() => sortData('activated')}>
                                    {sortConfig.key === 'activated' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
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
                                    <td><input className="mainCheckbox" type="checkbox" id={item.customerNo} checked={checkItem[index] || false}
                                        onChange={handleCheckboxChange} /></td>
                                    <td style={{ display: 'none' }}>{index}</td>
                                    <td>{index + 1}</td>
                                    <td>{item.customerNo}</td>
                                    <td>{item.customerName}</td>
                                    <td>{item.customerAddr}</td>
                                    <td>{item.customerTel}</td>
                                    <td>{item.postNum}</td>
                                    <td>{item.businessRegistrationNo}</td>
                                    <td>{item.nation}</td>
                                    <td>{item.dealType}</td>
                                    <td>{item.picName}</td>
                                    <td>{item.picEmail}</td>
                                    <td>{item.activated}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13">등록된 상품이 없습니다<i class="bi bi-emoji-tear"></i></td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="12"></td>
                            <td colSpan="2"> {customer.length} 건</td>
                        </tr>
                    </tbody>
                </table>
            </div>


            {/* 추가/등록 모달창 */}
            {isVisible && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div className="form-header">
                                <h1> 고객 등록 </h1>

                                <div className="btns">
                                    <div className="btn-add2">
                                        <button type="button" onClick={onClickRegistBtn}> 등록하기</button>
                                    </div>
                                    <div className="btn-close">

                                    </div>
                                </div>
                            </div>


                            <div className="RegistForm">
                                <table className="formTable">
                                    <tr>

                                        <th colSpan="1"><label htmlFor="productNo">고객 번호</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="customerTel" name="customerTel" value={regist.customerTel} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="customerNo">고객명</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="customerName" name="customerName" value={regist.customerName} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="customerNo">고객 주소</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="employeePw" name="employeePw" value={regist.employeePw} onChange={handleInputAddChange} /></td>

                                    
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="customPrice">고객 연락처</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="businessRegistrationNo" name="businessRegistrationNo" value={regist.businessRegistrationNo} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="currency">우편번호</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="customerAddress" name="customerAddress" value={regist.customerAddress} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="discount">사업자 등록 번호</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="postNum" name="postNum" value={regist.postNum} onChange={handleInputAddChange} /></td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="registStartDate">국가</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="residentNum" name="residentNum" value={regist.residentNum} onChange={handleInputAddChange} /> </td>


                                        <th colSpan="1"><label htmlFor="registEndDate">거래유형</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="nation" name="nation" value={regist.nation} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="registEndDate">담당자명</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="salary" name="salary" value={regist.salary} onChange={handleInputAddChange} /></td>
                                    </tr>

                                    <tr>
                                        <th colSpan="1"><label htmlFor="registEndDate">담당자 이메일</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="picName" name="picName" value={regist.picName} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="registEndDate">담당자 이메일</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="picName" name="picName" value={regist.picName} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="registEndDate">활성화</label></th>
                                        <td colSpan="2">
                                            <select id="authorityGrade" name="authorityGrade" value={regist.authorityGrade} onChange={handleInputAddChange}>
                                                <option value="">선택하세요</option>
                                                <option value="S">S</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                            </select>
                                        </td>
                                    </tr>


                                </table>


                                <div className="btn-add">
                                    <button id="downloadCsv" className="btn-CSV">CSV 샘플 양식</button>
                                    <button id="uploadCsv" className="btn-CSV" onClick={handleAddClickCSV}>CSV 파일 업로드</button>
                                    {isVisibleCSV && (
                                        <input type="file" id="uploadCsvInput" accept=".csv" />)}

                                    <button className="btn-common btn-add-p" onClick={onClickListAdd}> 추가</button>
                                </div>
                            </div>

                            <div className="RegistFormList">
                                <div style={{ fontWeight: 'bold' }}> 총 N 건</div>
                                <table className="formTableList">
                                    <thead>
                                        <tr>
                                            <th>번호</th>
                                            <th>고객명</th>
                                            <th>고객 번호</th>
                                            <th>전화번호</th>
                                            <th>주소</th>
                                            <th>우편번호</th>
                                            <th>사업자 등록번호</th>
                                            <th>국가</th>
                                            <th>거래 유형</th>
                                            <th>담당자 이름</th>
                                            <th>담당자 이메일</th>
                                            <th>담당자 전화번호</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.customerName}</td>
                                                <td>{item.customerNo}</td>
                                                <td>{item.customerTel}</td>
                                                <td>{item.customerAddress}</td>
                                                <td>{item.postNum}</td>
                                                <td>{item.businessRegistrationNo}</td>
                                                <td>{item.nation}</td>
                                                <td>{item.dealType}</td>
                                                <td>{item.picName}</td>
                                                <td>{item.picEmail}</td>
                                                <td>{item.picTel}</td>
                                            </tr>
                                        ))}
                                        <tr style={{ fontWeight: 'bold' }}>
                                            <td colSpan="11">합계</td>
                                            <td>{list.length} 건</td>
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
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleModifyCloseClick}> &times; </button>
                            <div className="form-header">
                                <h1>직원 수정</h1>
                                <div className="btns">
                                    <div className="btn-add2">
                                        <button type="button" onClick={handleUpdateClick}>수정하기</button>
                                    </div>
                                    <div className="btn-close">
                                        {/* 다른 버튼이 필요한 경우 여기에 추가 */}
                                    </div>
                                </div>
                            </div>
                            <div className="RegistForm">
                                <table className="formTable">
                                    <tbody>
                                        <tr>
                                            <th><label htmlFor="customerTel">직원명</label></th>
                                            <td><input type="text" id="customerTel" name="customerTel" value={modifyItem.customerTel} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="customerName">아이디</label></th>
                                            <td><input type="text" id="customerName" name="customerName" value={modifyItem.customerName} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="employeePw">비밀번호</label></th>
                                            <td><input type="text" id="employeePw" name="employeePw" value={modifyItem.employeePw} onChange={(e) => handleModifyItemChange(e.target)} /></td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="businessRegistrationNo">연락처</label></th>
                                            <td><input type="text" id="businessRegistrationNo" name="businessRegistrationNo" value={modifyItem.businessRegistrationNo} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="customerAddress">이메일</label></th>
                                            <td><input type="text" id="customerAddress" name="customerAddress" value={modifyItem.customerAddress} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="postNum">주소</label></th>
                                            <td><input type="text" id="postNum" name="postNum" value={modifyItem.postNum} onChange={(e) => handleModifyItemChange(e.target)} /></td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="residentNum">주민번호</label></th>
                                            <td><input type="text" id="residentNum" name="residentNum" value={modifyItem.residentNum} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="nation">입사일</label></th>
                                            <td><input type="date" id="nation" name="nation" value={modifyItem.nation} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="salary">급여</label></th>
                                            <td><input type="text" id="salary" name="salary" value={modifyItem.salary} onChange={(e) => handleModifyItemChange(e.target)} /></td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="picName">직속상사</label></th>
                                            <td><input type="text" id="picName" name="picName" value={modifyItem.picName} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="authorityGrade">권한</label></th>
                                            <td>
                                                <select id="authorityGrade" name="authorityGrade" value={modifyItem.authorityGrade} onChange={(e) => handleModifyItemChange(e.target)}>
                                                    <option value="">선택하세요</option>
                                                    <option value="S">S</option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="C">C</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 수정 모달창 끝  */}

            {/* 새로운 모달창 */}
            {isVisibleDetail && (
                <div> 추가 모달창  </div>
            )}
        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Customer />
);