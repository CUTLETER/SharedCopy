import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import useCheckboxManager from "../js/CheckboxManager";
import useSort from '../js/useSort';
import './Customer.css'
import './modalAdd.css'
import './modalDetail.css'
import AddressInput from './AddressInput';

function Customer() {

    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete,
        setAllCheck,
        setCheckItem,
        setShowDelete
    } = useCheckboxManager();

    // 메인 리스트
    const [customer, setCustomer] = useState([]);

    useEffect(() => {
        axios.get('/customer/customerAll')  // Spring Boot 엔드포인트와 동일한 URL로 요청
            .then(response => setCustomer(response.data))  // 응답 데이터를 상태로 설정
            .catch(error => console.error('Error fetching Customer data:', error));
    }, []);



    // =============================== 고객 조회 부분 ===============================

    // 검색, 필터 기능
    let [customerSearch, setEmSearch] = useState({
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddr: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: '',
        activated: 'Y'
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

    // 공백 제거, 대소문자 통일
    const normalizeString = (str) => str.replace(/\s+/g, '').toLowerCase();

    // 하이픈 및 공백 제거
    const removeHyphensAndSpaces = (str) => str.replace(/[-\s]/g, '');

    // 검색 리스트
    // 검색 리스트
    const handleSearchCustomer = () => {
        const normalizedSearch = {
            ...customerSearch,
            customerName: normalizeString(customerSearch.customerName),
            customerTel: removeHyphensAndSpaces(customerSearch.customerTel),
            customerAddr: normalizeString(customerSearch.customerAddr),
            businessRegistrationNo: removeHyphensAndSpaces(customerSearch.businessRegistrationNo),
            nation: normalizeString(customerSearch.nation),
            picName: normalizeString(customerSearch.picName),
            picTel: removeHyphensAndSpaces(customerSearch.picTel)
        };

        // 검색 실행
        if (normalizedSearch) {
            axios.post('/customer/customerSearch', normalizedSearch, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    // 응답 데이터를 고객 목록에 반영하고 정렬
                    const sortedData = response.data.sort((a, b) => {
                        // 영어와 한글을 구분하여 정렬
                        const regex = /^[A-Za-z]/; // 영어로 시작하는지 확인하는 정규식

                        const aIsEnglish = regex.test(a.customerName);
                        const bIsEnglish = regex.test(b.customerName);

                        // 둘 다 영어일 경우
                        if (aIsEnglish && bIsEnglish) {
                            return a.customerName.localeCompare(b.customerName);
                        }

                        // 둘 다 한글일 경우
                        if (!aIsEnglish && !bIsEnglish) {
                            return a.customerName.localeCompare(b.customerName, 'ko-KR', { sensitivity: 'base' });
                        }

                        // 하나는 영어이고 다른 하나는 한글일 경우
                        // 영어를 먼저 정렬하기 위해
                        return aIsEnglish ? -1 : 1;
                    });
                    setCustomer(sortedData); // 정렬된 데이터를 상태에 설정
                })
                .catch(error => console.error('에러 발생:', error)); // 오류 처리
        } else {
            console.error('[필터 입력이 없습니다.]');
        }
    };



    // 엔터 키로 검색 처리
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 폼 제출 방지
            handleSearchCustomer(); // 엔터 시 검색 실행
        }
    };


    // 조히 입력값 초기화
    const handleReset = () => {
        setEmSearch({
            customerName: '',
            customerTel: '',
            customerAddr: '',
            businessRegistrationNo: '',
            postNum: '',
            nation: '',
            picName: '',
            picEmail: '',
            picTel: ''
        });

        handleInputChange(); // 리셋 후 검색 기능 호출
    };



    // =============================== 고객 등록 부분 ===============================

    // 고객 등록 리스트 상태
    // 고객 등록 상태
    const [regist, setRegist] = useState({
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddr: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: '',
        activated: 'Y' // 기본값
    });

    // 입력 핸들러
    const handleInputAddChange = (e) => {
        const { name, value } = e.target;
        setRegist((prevRegist) => ({
            ...prevRegist,
            [name]: value,
        }));
    };

    // 서버로 고객 등록 요청
    const onClickRegistBtn = () => {
        // 필수 입력값 확인
        if (!regist.customerName || !regist.customerTel || !regist.customerAddr ||
            !regist.postNum || !regist.businessRegistrationNo || !regist.nation ||
            !regist.dealType || !regist.picName || !regist.picEmail || !regist.picTel) {
            alert('고객 정보를 모두 입력해야 합니다.');
            return;
        }

        // 중복 검사
        if (checkDuplicateName(regist.customerName)) {
            alert('고객명이 이미 존재합니다.');
            return;
        }

        if (checkDuplicateBusinessRegistrationNo(regist.businessRegistrationNo)) {
            alert('사업자 등록번호가 이미 존재합니다.');
            return;
        }

        // 유효성 검사
        if (!validatePhoneNumber(regist.customerTel) || !validatePhoneNumber(regist.picTel)) {
            alert('전화번호 형식으로 입력해주세요.( - 포함)');
            return;
        }

        if (!isValidBusinessRegistrationNo(regist.businessRegistrationNo)) {
            alert('사업자등록번호는 XXX-XX-XXXXX 형식입니다.');
            return;
        }

        if (!validateEmail(regist.picEmail)) {
            alert('이메일 형식으로 입력해야 합니다.');
            return;
        }

        // 고객 등록 컨펌창
        if (!window.confirm(`고객을 등록하시겠습니까?`)) {
            return; // 취소하면 등록 진행 안 함
        }

        // 고객 등록 요청
        axios
            .post('/customer/customerRegist', [regist], { // 배열로 감싸서 전송
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                console.log('등록 성공:', response.data);
                alert('고객이 성공적으로 등록되었습니다.');

                // 입력값 초기화
                setRegist({
                    customerNo: '',
                    customerName: '',
                    customerTel: '',
                    customerAddr: '',
                    postNum: '',
                    businessRegistrationNo: '',
                    nation: '',
                    dealType: '',
                    picName: '',
                    picEmail: '',
                    picTel: '',
                    activated: 'Y'
                });

                window.location.reload(); // 페이지 새로고침
            })
            .catch((error) => {
                console.error('등록 중 오류 발생:', error.response.data);
            });
    };




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
        setIsVisible(false);
    };



    // =============================== 고객 수정 부분 ===============================

    // 사업자등록번호 유효성 검사
    const isValidBusinessRegistrationNo = (str) => {
        const regex = /^\d{3}-\d{2}-\d{5}$/;
        return regex.test(str);
    };

    // 고객연락처 유효성 검사
    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^(\d{2,3}[-\s]?\d{3,4}[-\s]?\d{4})$/;
        return phoneRegex.test(phoneNumber);
    };

    // 담당자이메일 유효성 검사
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };


    // 고객 수정 아이템 상태
    const [modifyItem, setModifyItem] = useState({
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddr: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: '',
        activated: 'Y'
    });

    // 중복 확인 함수
    const checkDuplicateName = (name) => {
        const normalizedCustomerName = normalizeString(name);
        return customer.some(existingItem => {
            const normalizedExistingCustomerName = normalizeString(existingItem.customerName);
            return normalizedExistingCustomerName === normalizedCustomerName && existingItem.customerNo !== modifyItem.customerNo;
        });
    };

    const checkDuplicateBusinessRegistrationNo = (businessRegistrationNo) => {
        const normalizedBusinessRegistrationNo = removeHyphensAndSpaces(businessRegistrationNo);
        return customer.some(existingItem => {
            const normalizedExistingBusinessRegistrationNo = removeHyphensAndSpaces(existingItem.businessRegistrationNo);
            return normalizedExistingBusinessRegistrationNo === normalizedBusinessRegistrationNo && existingItem.customerNo !== modifyItem.customerNo;
        });
    };

    // 수정 클릭 시 호출
    const handleUpdateClick = () => {

        // 기존 고객 정보와 비교하여 변경 내용 확인
        const originalItem = customer.find(item => item.customerNo === modifyItem.customerNo);
        const hasChanges = Object.keys(modifyItem).some(key => modifyItem[key] !== originalItem[key]);

        if (!hasChanges) {
            alert('수정된 내용이 없습니다.');
            return;
        }
        // 필수 입력값 확인
        if (!modifyItem.customerName || !modifyItem.customerTel || !modifyItem.customerAddr ||
            !modifyItem.postNum || !modifyItem.businessRegistrationNo || !modifyItem.nation ||
            !modifyItem.dealType || !modifyItem.picName || !modifyItem.picEmail || !modifyItem.picTel) {
            alert('고객 정보를 모두 입력해야 합니다.');
            return;
        }

        if (checkDuplicateName(modifyItem.customerName)) {
            alert('고객명이 이미 존재합니다.');
            return;
        }

        if (!validatePhoneNumber(modifyItem.customerTel) || !validatePhoneNumber(modifyItem.picTel)) {
            alert('전화번호 형식으로 입력해주세요.( - 포함)');
            return;
        }

        if (!isValidBusinessRegistrationNo(modifyItem.businessRegistrationNo)) {
            alert('사업자등록번호는 XXX-XX-XXXXX 형식입니다.');
            return;
        }

        if (checkDuplicateBusinessRegistrationNo(modifyItem.businessRegistrationNo)) {
            alert('사업자 등록번호가 이미 존재합니다.');
            return;
        }

        if (!validateEmail(modifyItem.picEmail)) {
            alert('이메일 형식으로 입력해야 합니다.');
            return;
        }

        if (!window.confirm('수정하시겠습니까?')) {
            return;
        }

        // 수정 진행
        axios.post('/customer/customerUpdate', modifyItem, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('업데이트 성공:', response.data);
                setCustomer(prev => prev.map(item =>
                    item.customerNo === modifyItem.customerNo ? modifyItem : item
                ));
                setIsModifyModalVisible(false);
                alert('수정되었습니다.');
            })
            .catch(error => console.error('서버 요청 중 오류 발생', error));
    };

    // 수정 창 모달 상태
    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);

    // 수정 모달 열기
    const handleModify = (item) => {
        setModifyItem(item); // 선택한 고객 정보로 수정 아이템 설정
        setIsModifyModalVisible(true);
    }

    // 수정 모달 닫기
    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

    // 수정 아이템 변경 핸들러
    const handleModifyItemChange = (e) => {
        setModifyItem(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    // 삭제 기능 구현
    const handleDeleteItem = () => {
        const customerNo = modifyItem.customerNo; // 수정하는 고객의 ID 가져오기
        if (window.confirm('삭제하시겠습니까?')) {
            axios.post('/customer/customerDelete', [customerNo], {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('삭제 요청 성공', response.data);
                    alert('삭제되었습니다.');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('서버 요청 중 오류 발생', error);
                    alert('삭제 중 오류가 발생했습니다.'); // 오류 알림
                });
        }
    };


    // =============================== 고객 삭제 부분 ===============================

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
        if (window.confirm('삭제하시겠습니까?')) {
            axios.post('/customer/customerDelete', checkedIds, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('삭제 요청 성공', response.data);
                    const deletedCount = checkedIds.length;
                    alert(`${deletedCount}개 항목이 삭제되었습니다.`);
                    window.location.reload();
                })
                .catch(error => {
                    console.error('서버 요청 중 오류 발생', error);
                    alert('삭제 중 오류가 발생했습니다.'); // 오류 알림
                });
        }
    };




    // =============================== 주소API 모달 부분 ===============================

    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false); // 주소 모달 상태 추가
    const [customerAddress, setCustomerAddress] = useState('');
    const [postNum, setPostNum] = useState('');

    const openAddressModal = () => setIsAddressModalVisible(true); // 주소 모달 열기
    const closeAddressModal = () => setIsAddressModalVisible(false); // 주소 모달 닫기

    const handleAddressConfirm = (addrObj, isRegistration) => {
        console.log('주소:', addrObj.fullAddress, '우편번호:', addrObj.zonecode);

        if (isRegistration) {
            // 등록 모달에서 사용할 경우
            setRegist((prev) => ({
                ...prev,
                customerAddr: addrObj.fullAddress,
                postNum: addrObj.zonecode
            }));
        } else {
            // 수정 모달에서 사용할 경우
            setModifyItem((prev) => ({
                ...prev,
                customerAddr: addrObj.fullAddress,
                postNum: addrObj.zonecode
            }));
        }

        closeAddressModal(); // 주소 입력 모달 닫기
    };



    // =============================== 페이지 네이션 ===============================

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // 페이지당 항목 수

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // 현재 페이지에 맞는 데이터 필터링
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setAllCheck(false);
        setCheckItem(false);
        setShowDelete(false);
        setCurrentPage(pageNumber);
    };

    // 페이지네이션 버튼 렌더링
    const renderPageNumbers = () => {
        let pageNumbers = [];
        const maxButtons = 5; // 고정된 버튼 수

        // 맨 처음 페이지 버튼
        pageNumbers.push(
            <span
                key="first"
                onClick={() => handlePageChange(1)}
                className={`pagination_link ${currentPage === 1 ? 'disabled' : ''}`}
            >
                &laquo;&laquo; {/* 두 개의 왼쪽 화살표 */}
            </span>
        );

        // 이전 페이지 버튼
        pageNumbers.push(
            <span
                key="prev"
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={`pagination_link ${currentPage === 1 ? 'disabled' : ''}`}
            >
                &laquo; {/* 왼쪽 화살표 */}
            </span>
        );

        // 페이지 수가 4 이하일 경우 모든 페이지 표시
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <span
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`pagination_link ${i === currentPage ? 'pagination_link_active' : ''}`}
                    >
                        {i}
                    </span>
                );
            }
        } else {
            // 페이지 수가 5 이상일 경우 유동적으로 변경
            let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let endPage = startPage + maxButtons - 1;

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxButtons + 1);
            }

            // 시작 페이지와 끝 페이지에 대한 페이지 버튼 추가
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <span
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`pagination_link ${i === currentPage ? 'pagination_link_active' : ''}`}
                    >
                        {i}
                    </span>
                );
            }

            // 마지막 페이지가 현재 페이지 + 1보다 큰 경우 '...'과 마지막 페이지 표시
            if (endPage < totalPages) {
                pageNumbers.push(<span className="pagination_link">...</span>);
                pageNumbers.push(
                    <span
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`pagination_link ${currentPage === totalPages ? 'pagination_link_active' : ''}`}
                    >
                        {totalPages}
                    </span>
                );
            }
        }

        // 다음 페이지 버튼
        pageNumbers.push(
            <span
                key="next"
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={`pagination_link ${currentPage === totalPages ? 'disabled' : ''}`}
            >
                &raquo; {/* 오른쪽 화살표 */}
            </span>
        );

        // 맨 마지막 페이지 버튼
        pageNumbers.push(
            <span
                key="last"
                onClick={() => handlePageChange(totalPages)}
                className={`pagination_link ${currentPage === totalPages ? 'disabled' : ''}`}
            >
                &raquo;&raquo; {/* 두 개의 오른쪽 화살표 */}
            </span>
        );

        return pageNumbers;
    };




    return (
        <div>

            <div className='pageHeader'>
                <h1><i class="bi bi-people-fill"></i>고객 관리</h1>
            </div>

            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">
                            <div className="filter-item">
                                <label className="filter-label" htmlFor="customerName">고객명</label>
                                <input
                                    className="filter-input"
                                    type="text"
                                    id="customerName"
                                    placeholder="고객명"
                                    onChange={handleInputChange}
                                    value={customerSearch.customerName}
                                    onKeyPress={handleKeyPress}
                                    required
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="customerTel">고객연락처</label>
                                <input
                                    className="filter-input"
                                    type="text"
                                    id="customerTel"
                                    placeholder="고객연락처"
                                    onChange={handleInputChange}
                                    value={customerSearch.customerTel}
                                    onKeyPress={handleKeyPress}
                                    required
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="businessRegistrationNo">사업자등록번호</label>
                                <input
                                    className="filter-input"
                                    type="text"
                                    id="businessRegistrationNo"
                                    placeholder="사업자등록번호"
                                    onChange={handleInputChange}
                                    value={customerSearch.businessRegistrationNo}
                                    onKeyPress={handleKeyPress}
                                    required
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="customerAddr">고객주소</label>
                                <input
                                    className="filter-input"
                                    type="text"
                                    id="customerAddr"
                                    placeholder="고객주소"
                                    onChange={handleInputChange}
                                    value={customerSearch.customerAddr}
                                    onKeyPress={handleKeyPress}
                                    required
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="postNum">우편번호</label>
                                <input
                                    className="filter-input"
                                    type="text"
                                    id="postNum"
                                    placeholder="우편번호"
                                    onChange={handleInputChange}
                                    value={customerSearch.postNum}
                                    onKeyPress={handleKeyPress}
                                    required
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="nation">국가</label>
                                <input
                                    className="filter-input"
                                    type="text"
                                    id="nation"
                                    placeholder="국가"
                                    onChange={handleInputChange}
                                    value={customerSearch.nation}
                                    onKeyPress={handleKeyPress}
                                    required
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="picName">담당자명</label>
                                <input
                                    className="filter-input"
                                    type="text"
                                    id="picName"
                                    placeholder="담당자명"
                                    onChange={handleInputChange}
                                    value={customerSearch.picName}
                                    onKeyPress={handleKeyPress}
                                    required
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="picEmail">담당자이메일</label>
                                <input
                                    className="filter-input"
                                    type="text"
                                    id="picEmail"
                                    placeholder="담당자이메일"
                                    onChange={handleInputChange}
                                    value={customerSearch.picEmail}
                                    onKeyPress={handleKeyPress}
                                    required
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="picTel">담당자연락처</label>
                                <input
                                    className="filter-input"
                                    type="text"
                                    id="picTel"
                                    placeholder="담당자연락처"
                                    onChange={handleInputChange}
                                    value={customerSearch.picTel}
                                    onKeyPress={handleKeyPress}
                                    required
                                />
                            </div>

                            {/* <div className="filter-item">
                                <label className="filter-label" htmlFor="dealType">거래 유형</label>
                                <select
                                    id="dealType"
                                    className="filter-input"
                                    onChange={handleInputChange}
                                    value={customerSearch.dealType}
                                    required
                                >
                                    <option value="" disabled>거래 유형 선택</option>
                                    <option value="B2B">B2B</option>
                                    <option value="B2C">B2C</option>
                                    <option value="C2C">C2C</option>
                                </select>
                            </div> */}
                        </div>
                    </div>

                    <div className="button-container">
                        <button type="button" className="reset-btn" onClick={handleReset}>
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                        <button type="button" className="search-btn" onClick={handleSearchCustomer}>
                            <i className="bi bi-search search-icon"></i>
                        </button>
                    </div>

                </div>

                <button className="btn-common add" type="button" onClick={handleAddClick}>
                    고객등록
                </button>

                <table className="search-table" style={{ marginTop: "50px" }}>
                    {showDelete && <button className='delete-btn btn-common' onClick={() => { handleDeleteClick(); handleDelete(); }}>삭제</button>}
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange} /></th>
                            <th> No.</th>
                            <th>고객명
                                <button className="sortBtn" onClick={() => sortData('customerName')}>
                                    {sortConfig.key === 'customerName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>고객주소
                                <button className="sortBtn" onClick={() => sortData('customerAddr')}>
                                    {sortConfig.key === 'customerAddr' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>고객연락처
                                <button className="sortBtn" onClick={() => sortData('customerTel')}>
                                    {sortConfig.key === 'customerTel' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>우편번호
                                <button className="sortBtn" onClick={() => sortData('postNum')}>
                                    {sortConfig.key === 'postNum' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>사업자등록번호
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
                            <th>담당자이메일
                                <button className="sortBtn" onClick={() => sortData('picEmail')}>
                                    {sortConfig.key === 'picEmail' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>담당자연락처
                                <button className="sortBtn" onClick={() => sortData('picTel')}>
                                    {sortConfig.key === 'picTel' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => {
                                // Calculate globalIndex to continue numbering across pages
                                const globalIndex = indexOfFirstItem + index + 1; // +1 to start from 1
                                return (
                                    <tr
                                        key={index}
                                        className={checkItem[index] ? 'selected-row' : ''}
                                        onDoubleClick={() => handleModify(item)}
                                    >
                                        <td>
                                            <input
                                                className="mainCheckbox"
                                                type="checkbox"
                                                id={item.customerNo}
                                                checked={checkItem[index] || false}
                                                onChange={handleCheckboxChange}
                                            />
                                        </td>
                                        <td style={{ display: 'none' }}>{index}</td>
                                        <td>{globalIndex}</td> {/* Use globalIndex here */}
                                        <td>{item.customerName}</td>
                                        <td>
                                            <div style={{ whiteSpace: 'pre-wrap' }}>{item.customerAddr}</div>
                                        </td>
                                        <td>{item.customerTel}</td>
                                        <td>{item.postNum}</td>
                                        <td>{item.businessRegistrationNo}</td>
                                        <td>{item.nation}</td>
                                        <td>{item.dealType}</td>
                                        <td>{item.picName}</td>
                                        <td>{item.picEmail}</td>
                                        <td>{item.picTel}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="12">등록된 상품이 없습니다<i className="bi bi-emoji-tear"></i></td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="10"></td>
                            <td colSpan="2"> {customer.length} 건</td>
                        </tr>
                    </tbody>

                </table>
            </div>

            <div className="pagination">
                {renderPageNumbers()}
            </div>


            {/* 고객 등록 모달 */}
            {isVisible && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times; </button>
                            <div className="form-header">
                                <h1> 고객등록 </h1>
                                <div className="btns">
                                    <button className="btn-customer-add" type="button" onClick={onClickRegistBtn}> 등록 </button>
                                </div>
                            </div>

                            <div className="RegistForm">
                                <table className="formTable">
                                    <tbody>
                                        <tr>
                                            <th><label htmlFor="customerName">고객명</label></th>
                                            <td><input type="text" placeholder="고객명" id="customerName" name="customerName" value={regist.customerName} onChange={handleInputAddChange} /></td>

                                            <th><label htmlFor="customerTel">고객연락처</label></th>
                                            <td><input type="text" placeholder="고객연락처" id="customerTel" name="customerTel" value={regist.customerTel} onChange={handleInputAddChange} /></td>

                                            <th><label htmlFor="businessRegistrationNo">사업자등록번호</label></th>
                                            <td><input type="text" placeholder="사업자등록번호" id="businessRegistrationNo" name="businessRegistrationNo" value={regist.businessRegistrationNo} onChange={handleInputAddChange} /></td>
                                        </tr>

                                        <tr>
                                            <th colSpan="1"><label htmlFor="customerAddr">고객주소</label></th>
                                            <td colSpan="5">
                                                <input type="text" placeholder="고객주소" id="customerAddr" name="customerAddr" value={regist.customerAddr} readOnly />
                                                <button className="btn-addr-find" type="button" onClick={openAddressModal}>주소찾기</button>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th><label htmlFor="postNum">우편번호</label></th>
                                            <td><input type="text" placeholder="우편번호" id="postNum" name="postNum" value={regist.postNum} readOnly /></td>

                                            <th><label htmlFor="nation">국가</label></th>
                                            <td><input type="text" placeholder="국가" id="nation" name="nation" value={regist.nation} onChange={handleInputAddChange} /></td>

                                            <th><label htmlFor="dealType">거래유형</label></th>
                                            <td><input type="text" placeholder="거래유형" id="dealType" name="dealType" value={regist.dealType} onChange={handleInputAddChange} /></td>
                                        </tr>

                                        <tr>
                                            <th><label htmlFor="picName">담당자명</label></th>
                                            <td><input type="text" placeholder="담당자명" id="picName" name="picName" value={regist.picName} onChange={handleInputAddChange} /></td>

                                            <th><label htmlFor="picEmail">담당자이메일</label></th>
                                            <td><input type="text" placeholder="담당자이메일" id="picEmail" name="picEmail" value={regist.picEmail} onChange={handleInputAddChange} /></td>

                                            <th><label htmlFor="picTel">담당자연락처</label></th>
                                            <td><input type="text" placeholder="담당자연락처" id="picTel" name="picTel" value={regist.picTel} onChange={handleInputAddChange} /></td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                            {/* 
                            <div className="btn-add">
                                <button className="btn-common btn-add-p" onClick={onClickListAdd}> 추가</button>
                            </div>

                            <div className="RegistFormList">
                                <div style={{ fontWeight: 'bold' }}> 총 N 건</div>
                                <table className="formTableList">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>고객명</th>
                                            <th>고객연락처</th>
                                            <th>사업자등록번호</th>
                                            <th>고객주소</th>
                                            <th>우편번호</th>
                                            <th>국가</th>
                                            <th>거래유형</th>
                                            <th>담당자명</th>
                                            <th>담당자이메일</th>
                                            <th>담당자연락처</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.length > 0 ? list.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.customerName}</td>
                                                <td>{item.customerTel}</td>
                                                <td>{item.businessRegistrationNo}</td>
                                                <td>{item.customerAddr}</td>
                                                <td>{item.postNum}</td>
                                                <td>{item.nation}</td>
                                                <td>{item.dealType}</td>
                                                <td>{item.picName}</td>
                                                <td>{item.picEmail}</td>
                                                <td>{item.picTel}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="11">추가된 고객이 없습니다.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                            </div> */}

                            {/* 주소 모달 */}
                            {isAddressModalVisible && (
                                <div className="confirmRegist">
                                    <div className="fullBody">
                                        <div className="form-container">
                                            <button className="close-btn" onClick={closeAddressModal}> &times; </button>
                                            <div className="form-header">
                                                <h1>주소입력</h1>
                                            </div>
                                            <AddressInput onAddressConfirm={(addrObj) => handleAddressConfirm(addrObj, true)} /> {/* 주소 입력 컴포넌트 */}
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                <h1>고객 정보 수정</h1>
                                <div className="btns">

                                    <div className="btn-delete">
                                        <button type="button" onClick={handleDeleteItem}>삭제</button>
                                    </div>

                                    <div className="btn-add2">
                                        <button type="button" onClick={handleUpdateClick}>수정</button>
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
                                            <th><label htmlFor="customerName">고객명</label></th>
                                            <td><input type="text" placeholder="고객명" id="customerName" name="customerName" value={modifyItem.customerName || ''} onChange={handleModifyItemChange} /></td>

                                            <th><label htmlFor="customerTel">고객연락처</label></th>
                                            <td><input type="text" placeholder="고객연락처" id="customerTel" name="customerTel" value={modifyItem.customerTel || ''} onChange={handleModifyItemChange} /></td>

                                            <th><label htmlFor="businessRegistrationNo">사업자등록번호</label></th>
                                            <td><input type="text" placeholder="사업자등록번호" id="businessRegistrationNo" name="businessRegistrationNo" value={modifyItem.businessRegistrationNo || ''} onChange={handleModifyItemChange} /></td>


                                        </tr>

                                        <tr>
                                            <th colSpan="1"> <label htmlFor="customerAddr">고객주소</label></th>
                                            <td colSpan="5">
                                                <input type="text" placeholder="고객주소" id="customerAddr" name="customerAddr" value={modifyItem.customerAddr || ''} readOnly />
                                                <button className="btn-addr-find" type="button" onClick={openAddressModal}>주소찾기</button>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th><label htmlFor="postNum">우편번호</label></th>
                                            <td>
                                                <input type="text" placeholder="우편번호" id="postNum" name="postNum" value={modifyItem.postNum || ''} readOnly />
                                            </td>

                                            <th><label htmlFor="nation">국가</label></th>
                                            <td><input type="text" placeholder="국가" id="nation" name="nation" value={modifyItem.nation || ''} onChange={handleModifyItemChange} /></td>

                                            <th><label htmlFor="dealType">거래유형</label></th>
                                            <td><input type="text" placeholder="거래유형" id="dealType" name="dealType" value={modifyItem.dealType || ''} onChange={handleModifyItemChange} /></td>
                                        </tr>

                                        <tr>
                                            <th><label htmlFor="picName">담당자명</label></th>
                                            <td><input type="text" placeholder="담당자명" id="picName" name="picName" value={modifyItem.picName || ''} onChange={handleModifyItemChange} /></td>

                                            <th><label htmlFor="picEmail">담당자이메일</label></th>
                                            <td><input type="text" placeholder="담당자이메일" id="picEmail" name="picEmail" value={modifyItem.picEmail || ''} onChange={handleModifyItemChange} /></td>

                                            <th><label htmlFor="picTel">담당자연락처</label></th>
                                            <td><input type="text" placeholder="담당자연락처" id="picTel" name="picTel" value={modifyItem.picTel || ''} onChange={handleModifyItemChange} /></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* 주소 모달 */}
                    {isAddressModalVisible && (
                        <div className="confirmRegist">
                            <div className="fullBody">
                                <div className="form-container">
                                    <button className="close-btn" onClick={closeAddressModal}>
                                        &times;
                                    </button>
                                    <div className="form-header">
                                        <h1>주소 입력</h1>
                                    </div>
                                    <AddressInput onAddressConfirm={(addrObj) => handleAddressConfirm(addrObj, false)} /> {/* 주소 입력 컴포넌트 */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Customer />
);