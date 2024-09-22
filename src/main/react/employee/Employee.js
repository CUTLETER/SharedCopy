import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import './Employee.css';
import useCheckboxManager from "../js/CheckboxManager";
import useSort from '../js/useSort';
import './modalPw.css';
import '../js/modalAdd.css';
import '../js/Pagination.css';
import Pagination from '../js/Pagination';
import '../js/pagecssReal.css';

import { Bar } from 'react-chartjs-2';
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


//  const truncate = (str, maxLength) => {
//    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
//  };


function Employee() {
    const [totalItems, setTotalItems] = useState(); // 총 아이템 수
    const [pageCount, setPageCount] = useState(); // 총 페이지 수 계산

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
          allCheck: allCheckMain,
          checkItem: checkItemMain,
          showDelete: showDeleteMain,
          handleMasterCheckboxChange: handleMasterCheckboxChangeMain,
          handleCheckboxChange: handleCheckboxChangeMain,
          handleDelete: handleDeleteMain,
    setAllCheck: setAllCheckMain,
      setCheckItem: setCheckItemMain,
      setShowDelete: setShowDeleteMain

      } = useCheckboxManager();


    // 메인 리스트
    let [employee, setEmployee] = useState([{
        employeeId: '',
        employeePw: '',
        employeeName: '',
        employeeTel: '',
        employeeEmail: '',
        employeeAddr: '',
        residentNum: '',
        hireDate: null,
        salary: 0,
      /*  employeeManagerId: '',*/
        authorityGrade: '',
        authorityName: ''
    }]);

    // 메인 리스트 가져오기 axios
    useEffect(() => {
        axios.get('/employee/employeeALL')  // Spring Boot 엔드포인트와 동일한 URL로 요청
            .then(response => setEmployee(response.data))  // 응답 데이터를 상태로 설정
            .catch(error => console.error('Error fetching Customer data:', error));
    }, []);

    // 검색,필터 기능
    let [emSearch, setEmSearch] = useState({
        employeeId: '',
        employeePw: '',
        employeeName: '',
        employeeTel: '',
        employeeEmail: '',
        employeeAddr: '',
        residentNum: '',
        hireDate: null,
        salary: 0,
 /*       employeeManagerId: '',*/
        authorityGrade: '',
        authorityName: '',
        page: 1,
        amount: 10
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
    const handleSearchEmployee = () => {
        if (emSearch) {
            axios.post('/employee/employeeSearch', emSearch, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log(response.data);
                    setEmployee(response.data.pageData);
                    setCurrentPage(response.data.page);
                    setTotalItems(response.data.total);
                    setItemsPerPage(response.data.pageData.length);
                    setPageCount(response.data.realEnd);
                })
                .catch(error => console.error('에러에러', error));
        } else {
            console.error('[핸들러 작동 잘 함]');
        }
    };

        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // 기본 Enter 동작 방지 (예: 폼 제출)
                handleSearchEmployee();
            }
        };

        // =============== 조회 입력값 초기화 ===============
        const handleReset = () => {
            setEmSearch({
                employeeId: '',
                employeeName: '',
                employeeTel: '',
                employeeEmail: '',
                employeeAddr: '',
                hireDate: '',
                authorityGrade: ''
            })
        }



//----------------------------------------------------
    // 직원 추가  리스트
    const [test, setTest] = useState({
        employeeId: '',
        employeePw: '1234*',
        employeeName: '',
        employeeTel: '',
        employeeEmail: '',
        employeeAddr: '',
        residentNum: '',
        hireDate: null,
        salary: null,
       /* employeeManagerId: '',*/
        authorityGrade: ''
    });


    const [list, setList] = useState([]);
    const [emregist, setEmRegist] = useState([]);

    const handleInputAddChange = (e) => {
        const { name, value } = e.target;
        setTest((prevTest) => ({
            ...prevTest,
            [name]: value,
        }));

   if (name === 'employeeId' && value !== test.employeeId) {
                 setIdResult(false);
                 setButtonColor('#939393');
        }

        console.log(test);
    };


const validateInputs = () => {
  const { employeeId, residentNum, salary, employeeTel ,authorityGrade, employeePw , employeeEmail} = test; // 상태에서 값을 가져옵니다

  if (isObjectEmpty(test)) {
    alert('모든 값을 입력하세요.');
    return false;
  }

  // 아이디 유효성 검사
  if (employeeId.length < 5) {
    alert('아이디는 5자 이상 입력해주세요.');
    return false;
  }

  // 비밀번호 유효성 검사
  if (employeePw.length < 5) {
    alert('비밀번호는 5자 이상 입력해주세요.');
    return false;
  }

  // 전화번호 유효성 검사
  const koreanPhoneRegex = /^(01[016789])-([0-9]{4})-([0-9]{4})$|^(02|0[3-9][0-9])-[0-9]{3,4}-[0-9]{4}$/;
  if (!koreanPhoneRegex.test(employeeTel)) {
    alert('전화번호 형식에 맞게 입력하세요. 000-0000-0000');
    return false;
  }

  // 아이디 및 비밀번호 문자 검증
  const validPattern = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;"'<>,.?/~`|-]+$/;

  if (!validPattern.test(employeePw)) {
    alert('비밀번호는 대소문자, 숫자, 특수문자만 가능합니다.');
    return false;
  }

  // 주민번호 유효성 검사
  const residentNumRegex = /^\d{6}-\d{7}$/;
  if (residentNum.length < 14 || !residentNumRegex.test(residentNum)) {
    alert('주민번호는 형식에 맞게 입력하세요 000000-0000000');
    return false;
  }

  // 이메일 유효성 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(employeeEmail)) {
    alert('유효한 이메일 주소를 입력해 주세요.');
    return false;
  }



  // 급여 입력값 검사
  if (!/^[0-9]*$/.test(salary) && salary >= 0 ) {
    alert('급여란에는 숫자만 입력하세요.');
    return false;
  }

  // 중복 확인 검사
  if (idResult === false) {
    alert('중복확인을 해주세요.');
    return false;
  }

  // 모든 검증 통과 시
  return true;
};


const onClickListAdd = () => {

 setButtonColor('#939393');
  if (validateInputs()) {
    const trimmedTest = {
      employeeId: test.employeeId,
      employeePw: test.employeePw,
      employeeName: test.employeeName.replace(/\s+/g, ''),
      employeeTel: test.employeeTel,
      employeeEmail: test.employeeEmail,
      employeeAddr: test.employeeAddr.replace(/^\s+|\s+$/g, ''),
      residentNum: test.residentNum,
      hireDate: test.hireDate,
      salary: test.salary.replace(/\s+/g, ''),
/*      employeeManagerId: test.employeeManagerId.replace(/\s+/g, ''),*/
      authorityGrade : test.authorityGrade
    };

    setList((prevList) => [...prevList, trimmedTest]);

    // 입력값 초기화
    setTest({
      employeeId: '',
      employeePw: '1234*',
      employeeName: '',
      employeeTel: '',
      employeeEmail: '',
      employeeAddr: '',
      residentNum: '',
      hireDate: '',
      salary: '',
/*      employeeManagerId: '',*/
      authorityGrade: '',
    });
  }
};



// 아이디 중복 체크
 const [idResult, setIdResult] = useState(); // 중복 여부 상태
 const [buttonColor, setButtonColor] = useState('#939393');

  const IdCheck = async () => {

    const validPattern = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;"'<>,.?/~`|-]+$/;
    if (!validPattern.test(test.employeeId)) {
      alert('아이디는 대소문자, 숫자, 특수문자만 가능합니다.');
      return;
    }

    try {
      const response = await axios.post('/employee/employeeIdCheck',{employeeId : test.employeeId}, {
       headers: { 'Content-Type': 'application/json' }
      });
      // 아이디가 사용 가능한지 여부를 서버 응답에서 확인
        const isAvailable = !response.data;
         // 서버가 `true` 반환 시 사용 불가, `false` 반환 시 사용 가능
        console.log("아이디!!!!" + isAvailable);
        if (isAvailable) {
        setIdResult(true);
        alert('사용 가능한 아이디입니다.');
        setButtonColor('#004e90');
      } else {
        setIdResult(false);
        alert('중복된 아이디입니다.');
        setButtonColor('#939393');
      }
    } catch (error) {
    }
  };

// 값이 비었는지 확인 하는 메서드
 const isObjectEmpty = (obj) => {
    return Object.values(obj).some(value => value === '' || value === null || value === undefined);
  };

useEffect(() => {
    console.log("Updated list:", list);
    console.log("Item IDs:", list.map(item => item.id));
}, [list]);


// [등록] 요청
    const onClickRegistBtn = () => {
        if (list.length > 0) {
            setEmRegist(list); // 등록할 항목이 있는 경우에만 상태 업데이트

            // 서버에 등록 요청 보내기
            axios
                .post('/employee/employeeRegist', list, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    setEmployee(response.data); // 서버 응답 데이터로 Customer 상태 업데이트
                    alert("등록이 완료되었습니다");
                })
                .catch((error) => console.error('서버 요청 중 오류 발생', error))
                .finally(() => setIsVisible(false)); // 요청 완료 후 항상 실행되는 블록
            window.location.reload();
            setList([]); // 기존 목록 초기화
        } else {
            alert('등록할 항목이 없습니다');
        }
    };



    // --- 테이블 정렬 기능
    const { sortedData, sortData, sortConfig } = useSort(employee);

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
        setTest([]);
            setIdResult(false);
                setButtonColor('#939393');
        setIsVisible(false);
    };


//  [수정] 기능 초기값
    const [modifyItem, setModifyItem] = useState(
        {
            employeeId: '',
            employeePw: '',
            employeeName: '',
            employeeTel: '',
            employeeEmail: '',
            employeeAddr: '',
            residentNum: '',
            hireDate: null,
            salary: 0,
        /*    employeeManagerId: '',*/
            authorityGrade: ''
        }
    );
const [originalItem, setOriginalItem] = useState({}); // 원래 데이터를 저장할 상태


const handleUpdateClick = () => {
    // 급여 유효성 검사
    const trimmedSalary = modifyItem.salary.toString().trim(); // 급여값을 문자열로 변환하고 공백 제거
    if (!/^[0-9]+$/.test(trimmedSalary)) {
        alert('급여란에는 숫자만 입력하세요.');
        return;
    }

    const hasChanges = Object.keys(modifyItem).some(key => modifyItem[key] !== originalItem[key]);
    // 변경사항이 없다면 함수 종료
    if (!hasChanges) {
        alert('수정된 내용이 없습니다.');
        return;
    }


    // 유효성 검사를 통과한 후, 서버로 데이터 전송
    axios.post('/employee/employeeUpdate', modifyItem, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        setEmployee(response.data);  // 서버 응답 데이터로 Customer 상태 업데이트
        console.log('업데이트 성공:', response.data);
        alert("수정이 완료되었습니다");
    })
    .catch(error => console.error('서버 요청 중 오류 발생', error))
    .finally(() => {
        setIsModifyModalVisible(false);
        window.location.reload(); // 모달 숨기기
    });
};

//  [수정] 모달
const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);

//  [수정] 값 가져오기
   const handleModify = (item) => {
        setOriginalItem(item); // 원래 데이터를 저장
       setModifyItem(prevState => ({
           employeeId: item.employeeId,
           employeeName: item.employeeName,
           employeeTel: item.employeeTel,
           employeeEmail: item.employeeEmail,
           employeeAddr: item.employeeAddr,
           residentNum: item.residentNum,
           hireDate: item.hireDate,
           salary: item.salary,
/*           employeeManagerId: item.employeeManagerId,*/
           authorityGrade: item.authorityGrade
       }));
       setIsModifyModalVisible(true);
   };

   console.log(modifyItem);


    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

    const handleModifyItemChange = (e) => {
        let copy = { ...modifyItem, [e.name]: e.value };
        setModifyItem(copy);
    }


// [수정] 비밀번호 변경 버튼
    const [isVisibleDeleteInput, setIsVisibleDeleteInput] = useState(false);

    const handlePwOpenClick = () => {
        setIsVisibleDeleteInput(true);
    };
  const handlePwCloseClick = () => {
        setIsVisibleDeleteInput(false);
    }

// 비밀번호 변경 로직

/*   const [emplPw, setEmplPw] = useState({''});*/

/*
  const handleemplPwChange = (e) => {
    const { name, value } = e.target;

    setEmplPw({
      ...emplPw,
      [name]: value,
    });
  };
*/

/*    console.log(emplPw);*/

// [수정] 비밀번호 변경 기능
     const pwChangeClick = () => {
        axios.post('/employee/employeePwChange', {employeeId : modifyItem.employeeId, employeePw : '1234*' }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('삭제 요청 성공', response.data);
                alert("비밀번호가 초기화 되었습니다.");
            })
            .catch(error => {
                console.error('서버 요청 중 오류 발생', error);
            });



        setIsVisibleDeleteInput(false);
     }

////////// [수정] ------------------------------
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleMasterCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setAllChecked(isChecked);

        const newCheckedItems = {};
        list.forEach(item => {
            newCheckedItems[item.employeeId] = isChecked;
        });
        setCheckedItems(newCheckedItems);
        setShowDeleteModal(isChecked);
    };

    const handleCheckboxChange = (e, employeeId) => {
        const isChecked = e.target.checked;
        setCheckedItems(prev => ({
            ...prev,
            [employeeId]: isChecked
        }));

        const hasCheckedItems = Object.values({
            ...checkedItems,
            [employeeId]: isChecked
        }).some(checked => checked);
        setShowDeleteModal(hasCheckedItems);

        if (!isChecked) {
            setAllChecked(false);
        }
    };

const handleDeleteClick2 = () => {
    // 선택된 항목 삭제 로직
    const itemsToDelete = Object.keys(checkedItems).filter(id => checkedItems[id]);
    console.log("선택된 삭제 항목:", itemsToDelete);

    // 현재 리스트에서 삭제할 항목을 제외한 새로운 리스트 생성
    const updatedList = list.filter(item => !itemsToDelete.includes(item.employeeId));

    // 리스트 업데이트
    setList(updatedList);

    // 체크 상태 초기화
    const newCheckedItems = {};
    list.forEach(item => {
        newCheckedItems[item.employeeId] = false;
    });
    setCheckedItems(newCheckedItems);
    setAllChecked(false);
    setShowDeleteModal(false);
};




// ------------------------------------------------------

    // [삭제] 기능
    const [checkedIds, setCheckedIds] = useState([]);

    useEffect(() => {
        // 모든 체크된 체크박스를 선택합니다.
        const checkedCheckboxes = Array.from(document.querySelectorAll('input.mainCheckbox:checked'));
        // 체크된 체크박스의 ID 값을 배열로 저장합니다.
        const ids = checkedCheckboxes.map(checkbox => checkbox.id);
        // 상태를 업데이트하여 배열에 저장합니다.
        console.log(checkedIds);
        setCheckedIds(ids);

    }, [checkItemMain]);


/*
useEffect(() => {
    const checkedCheckboxes = Array.from(document.querySelectorAll('input.mainCheckboxModal:checked'));
    const ids = checkedCheckboxes.map(checkbox => checkbox.id);
    setCheckedIds2(ids);
}, [checkItemModal]);


*/



// [삭제] 체크된 아이템 삭제하기
    const handleDeleteClick = () => {
        axios.post('/employee/employeeDelete', checkedIds, {
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

// [삭제] 개별 삭제하기 요청
const handleDeletePickClick = () => {
    // 사용자에게 확인 메시지 표시
    if (window.confirm('정말 비활성화 하시겠습니까?')) {
        // 사용자가 확인한 경우에만 삭제 요청
        axios.post('/employee/employeeDeletePick', modifyItem.employeeId, {
            headers: {
                'Content-Type': 'text/plain'
            }
        })
        .then(response => {
            console.log('삭제 요청 성공', response.data);
            alert('비활성화 되었습니다.');
        })
        .catch(error => {
            console.error('서버 요청 중 오류 발생', error);
        })
        .finally(() => {
            setIsModifyModalVisible(false);
            window.location.reload(); // 모달 숨기기
        });
    } else {
        // 사용자가 취소한 경우
        alert('비활성화가 취소되었습니다.');
    }
};


// [리스트] 긴 글씨 줄이기
  const truncateText = (str, maxLength) => {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  };








  const getOriginalIndex = (item) => {
      // sortedData가 배열인지 확인
      if (!Array.isArray(sortedData)) {
          console.error("sortedData가 배열이 아닙니다.");
          return -1; // 배열이 아닌 경우 -1을 반환하여 오류 처리
      }

      // item.id와 일치하는 originalItem을 찾고, 그 인덱스를 반환
      const index = sortedData.findIndex(originalItem => originalItem.id === item.id);

      // 인덱스가 -1인 경우는 일치하는 항목이 없다는 뜻이므로 +1 하지 않음
      return index !== -1 ? index + 1 : -1;
  };


    // =============================================== 페이지 네이션


    // 페이지 네이션

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
        setAllCheckMain(false);
        setCheckItemMain(false);
        setShowDeleteMain(false);
        setCurrentPage(pageNumber);
    };

    // 페이지네이션 버튼 렌더링
    const renderPageNumbers = () => {
        let pageNumbers = [];
        const maxButtons = 3; // 고정된 버튼 수

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
                onClick={() => handlePageChange(currentPage - 1)}
                className={`pagination_link ${currentPage === 1 ? 'disabled' : ''}`}
            >
                &laquo; {/* 왼쪽 화살표 */}
            </span>
        );

        // // 항상 첫 페이지 버튼 표시
        // pageNumbers.push(
        //     <span
        //         key={1}
        //         onClick={() => handlePageChange(1)}
        //         className={`pagination_link ${currentPage === 1 ? 'pagination_link_active' : ''}`}
        //     >
        //         1
        //     </span>
        // );

        // 6페이지 이상일 때
        if (totalPages > maxButtons) {
            let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let endPage = startPage + maxButtons - 1;

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxButtons + 1);
            }

            // 중간 페이지 버튼 추가
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

            // 마지막 페이지가 현재 페이지 + 1보다 큰 경우 '...'와 마지막 페이지 추가
            if (endPage < totalPages) {
                pageNumbers.push(<span className="pagination_link">...</span>);
                pageNumbers.push(
                    <span key={totalPages} onClick={() => handlePageChange(totalPages)} className="pagination_link">
                        {totalPages}
                    </span>
                );
            }
        }

        // 다음 페이지 버튼
        pageNumbers.push(
            <span
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
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
            <h1><i class="bi bi-person-lines-fill"></i> 직원 관리 </h1>
            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="employeeId" >직원아이디</label>
                                <input  onKeyDown={handleKeyDown} className="filter-input" type="text" id="employeeId" placeholder="" onChange={handleInputChange} value={emSearch.employeeId} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="employeeName">직원이름</label>
                                <input onKeyDown={handleKeyDown} className="filter-input" type="text" id="employeeName" placeholder="" onChange={handleInputChange} value={emSearch.employeeName} r required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="employeeTel">직원전화번호</label>
                                <input     onKeyDown={handleKeyDown}className="filter-input" type="text" id="employeeTel" placeholder="" onChange={handleInputChange} value={emSearch.employeeTel} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="employeeEmail">직원이메일</label>
                                <input    onKeyDown={handleKeyDown} className="filter-input" type="text" id="employeeEmail" placeholder="" onChange={handleInputChange} value={emSearch.employeeEmail} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="employeeAddr">주소</label>
                                <input     onKeyDown={handleKeyDown} className="filter-input" type="text" id="employeeAddr" placeholder="" onChange={handleInputChange} value={emSearch.employeeAddr} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="hireDate">입사일</label>
                                <input     onKeyDown={handleKeyDown}  className="filter-input" type="date" id="hireDate" placeholder="" onChange={handleInputChange} value={emSearch.hireDate} required />
                            </div>


                       {/*     <div className="filter-item">
                                <label className="filter-label" htmlFor="employeeManagerId">직속 상사</label>
                                <input     onKeyDown={handleKeyDown} className="filter-input" type="text" id="employeeManagerId" placeholder="" onChange={handleInputChange} value={emSearch.employeeManagerId} required />
                            </div>*/}

                            <div className="filter-item">
                                <label htmlFor="authorityGrade">직급</label>
                                <select id="authorityGrade" onChange={handleInputChange} value={emSearch.authorityGrade}>
                                    <option value="">선택하세요</option>
                                          <option value="S">대표</option>
                                         <option value="A">부장</option>
                                         <option value="B">과장</option>
                                         <option value="C">대리</option>
                                         <option value="D">사원</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="button-container">
                        <button type="button" className="reset-btn" onClick={handleReset}>
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                        <button type="button" className="search-btn" onClick={handleSearchEmployee}><i
                            className="bi bi-search search-icon"></i>
                        </button>
                    </div>

                </div>


                <button className="btn-common add" type="button" onClick={handleAddClick}>
                    직원 등록
                </button>

                <table className="search-table" style={{ marginTop: "50px" }}>
                    {showDeleteMain && <button className='delete-btn btn-common' onClick={handleDeleteClick}>삭제</button>}
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={allCheckMain} onChange={handleMasterCheckboxChangeMain} /></th>
                            <th> No.</th>
                            <th>직원ID
                                <button className="sortBtn" onClick={() => sortData('employeeId')}>
                                    {sortConfig.key === 'employeeId' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>직원PW
                                <button className="sortBtn" onClick={() => sortData('employeePw')}>
                                    {sortConfig.key === 'employeePw' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>직원명
                                <button className="sortBtn" onClick={() => sortData('employeeName')}>
                                    {sortConfig.key === 'employeeName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>전화번호
                                <button className="sortBtn" onClick={() => sortData('employeeTel')}>
                                    {sortConfig.key === 'employeeTel' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>이메일
                                <button className="sortBtn" onClick={() => sortData('employeeEmail')}>
                                    {sortConfig.key === 'employeeEmail' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>주소
                                <button className="sortBtn" onClick={() => sortData('employeeAddr')}>
                                    {sortConfig.key === 'employeeAddr' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                          <th>주민번호
                                <button className="sortBtn" onClick={() => sortData('residentNum')}>
                                    {sortConfig.key === 'residentNum' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>입사일
                                <button className="sortBtn" onClick={() => sortData('hireDate')}>
                                    {sortConfig.key === 'hireDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th> 급여
                                <button className="sortBtn" onClick={() => sortData('salary')}>
                                    {sortConfig.key === 'salary' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                          {/*  <th> 직속상사
                                <button className="sortBtn" onClick={() => sortData('employeeManagerId')}>
                                    {sortConfig.key === 'employeeManagerId' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>*/}

                        {/*    <th> 권한
                                <button className="sortBtn" onClick={() => sortData('authorityGrade')}>
                                    {sortConfig.key === 'authorityGrade' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>*/}
                             <th> 직급
                                <button className="sortBtn" onClick={() => sortData('authorityName')}>
                                    {sortConfig.key === 'authorityName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => {
                             const globalIndex = indexOfFirstItem + index + 1; // +1은 1부터 시작하기 위함
                             return(
                                <tr key={index} className={checkItemMain[index] ? 'selected-row' : ''} onDoubleClick={() => {
                                    handleModify(item)
                                }}>
                                    <td><input className="mainCheckbox" type="checkbox" id={item.employeeId} checked={checkItemMain[index] || false}
                                        onChange={handleCheckboxChangeMain} /></td>
                                    <td style={{ display: 'none' }}>{index}</td>
                                     <td>{globalIndex}</td> {/* 여기에서 globalIndex 사용 */}
                                    <td>{item.employeeId}</td>
                                   <td>{truncateText(item.employeePw, 10)}</td>
                                    <td>{item.employeeName}</td>
                                    <td>{item.employeeTel}</td>
                                    <td>{item.employeeEmail}</td>
                                    <td>{item.employeeAddr}</td>
                                   <td>{item.residentNum}</td>
                                    <td>{item.hireDate}</td>
                                    <td>{item.salary}</td>
                                    {/*<td>{item.employeeManagerId}</td>*/}
                                    <td>{item.authorityName}</td>
                                </tr>
                              );
                            })
                        ) : (
                            <tr>
                                <td colSpan="12">등록된 직원이 없습니다<i class="bi bi-emoji-tear"></i></td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="11"></td>
                            <td colSpan="1"> {employee.length} 건</td>
                        </tr>
                    </tbody>
                </table>
                   <div>
                  <div className="pagination">
                            {renderPageNumbers()}
                    </div>
                </div>
            </div>


            {/* 추가/등록 모달창 */}
            {isVisible && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div className="form-header">
                                <h1> 직원 등록 </h1>

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

                                        <th colSpan="1"><label htmlFor="productNo">직원명</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="employeeName" name="employeeName" value={test.employeeName} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="customerNo">아이디</label></th>

                                        <td colSpan="2"><input style={{  width:'68%'}} type="text" placeholder="필드 입력" id="employeeId" name="employeeId" value={test.employeeId} onChange={handleInputAddChange} />
                                        <button type="button" onClick={IdCheck} className="checkId"  style={{ backgroundColor: buttonColor }}>  ✔ </button>
                                        </td>


                                        <th colSpan="1"><label htmlFor="customerNo">비밀번호</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="employeePw" name="employeePw" value={test.employeePw} onChange={handleInputAddChange} /></td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="customPrice">연락처</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="employeeTel" name="employeeTel" value={test.employeeTel} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="currency">이메일</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="employeeEmail" name="employeeEmail" value={test.employeeEmail} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="discount">주소</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="employeeAddr" name="employeeAddr" value={test.employeeAddr} onChange={handleInputAddChange} /></td>
                                    </tr>
                                    <tr>
                                      <th colSpan="1"><label htmlFor="registStartDate">주민번호</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="residentNum" name="residentNum" value={test.residentNum} onChange={handleInputAddChange} /> </td>


                                        <th colSpan="1"><label htmlFor="registEndDate">입사일</label></th>
                                        <td colSpan="2"><input type="date" placeholder="필드 입력" id="hireDate" name="hireDate" value={test.hireDate} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="registEndDate">급여</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="salary" name="salary" value={test.salary} onChange={handleInputAddChange} /></td>
                                    </tr>

                                    <tr>
                                      {/*  <th colSpan="1"><label htmlFor="registEndDate">직속상사</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="employeeManagerId" name="employeeManagerId" value={test.employeeManagerId} onChange={handleInputAddChange} /></td>*/}

                                        <th colSpan="1"><label htmlFor="registEndDate">직급</label></th>
                                        <td colSpan="2">        <select id="authorityGrade" name="authorityGrade" value={test.authorityGrade} onChange={handleInputAddChange}>
                                            <option value="">선택하세요</option>
                                            <option value="S">대표</option>
                                            <option value="A">부장</option>
                                            <option value="B">과장</option>
                                            <option value="C">대리</option>
                                            <option value="D">사원</option>
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
                                        <div style={{ fontWeight: 'bold' }}> 총 {list.length} 건</div>
                                        {showDeleteModal && (
                                            <button className='delete-btn2 btn-common' onClick={handleDeleteClick2}>삭제</button>
                                        )}
                                        <table className="formTableList">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <input type="checkbox" checked={allChecked} onChange={handleMasterCheckboxChange} />
                                                    </th>
                                                    <th>No.</th>
                                                    <th>직원ID</th>
                                                    <th>직원PW</th>
                                                    <th>직원명</th>
                                                    <th>전화번호</th>
                                                    <th>이메일</th>
                                                    <th>주소</th>
                                                    <th>주민번호</th>
                                                    <th>입사일</th>
                                                    <th>급여</th>
                                                    <th>직급</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {list.map((item, index) => (
                                                    <tr key={item.employeeId}>
                                                        <td>
                                                            <input
                                                                className="mainCheckboxModal"
                                                                type="checkbox"
                                                                id={item.employeeId}
                                                                checked={checkedItems[item.employeeId] || false}
                                                                onChange={(e) => handleCheckboxChange(e, item.employeeId)}
                                                            />
                                                        </td>
                                                        <td style={{ display: 'none' }}>{index}</td>
                                                        <td>{index + 1}</td>
                                                        <td>{item.employeeId}</td>
                                                        <td>{item.employeePw}</td>
                                                        <td>{item.employeeName}</td>
                                                        <td>{item.employeeTel}</td>
                                                        <td>{item.employeeEmail}</td>
                                                        <td>{item.employeeAddr}</td>
                                                        <td>{item.residentNum}</td>
                                                        <td>{item.hireDate}</td>
                                                        <td>{item.salary}</td>
                                                        <td>
                                                            {(() => {
                                                                switch (item.authorityGrade) {
                                                                    case 'S': return '대표';
                                                                    case 'A': return '부장';
                                                                    case 'B': return '과장';
                                                                    case 'C': return '대리';
                                                                    case 'D': return '사원';
                                                                    default: return '';
                                                                }
                                                            })()}
                                                        </td>
                                                    </tr>
                                                ))}
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
                                    <div className="btn-add1">
                                        {/* 다른 버튼이 필요한 경우 여기에 추가 */}
                                        <button type="button"  onClick={handleDeletePickClick}> 비활성화 </button>
                                    </div>
                                </div>
                            </div>
                            <div className="RegistForm">
                                <table className="formTable">
                                    <tbody>
                                        <tr>
                                            <th><label htmlFor="employeeName">직원명</label></th>
                                            <td><input type="text" id="employeeName" name="employeeName" value={modifyItem.employeeName} onChange={(e) => handleModifyItemChange(e.target)}  disabled/></td>

                                            <th><label htmlFor="employeeId">아이디</label></th>
                                            <td><input type="text" id="employeeId" name="employeeId" value={modifyItem.employeeId} onChange={(e) => handleModifyItemChange(e.target)} disabled/></td>

                                            <th><label htmlFor="employeePw">비밀번호</label></th>
                                            <td>  {isVisibleDeleteInput && (

                                                  <div className="confirmRegistPw">
                                                            <div className="fullBodyPw">
                                                                <div className="form-containerPw">
                                                                 <button className="close-btn" onClick={handlePwCloseClick}> &times; </button>
                                                                           <div className="form-headerPw">
                                                                                    <h3> 비밀번호 변경 </h3>
                                                                                    <div> <input type="text" id="employeePw" name="employeePw" value="1234*" disabled/> </div>
                                                                                    <button type="button" className="btn-common" onClick={pwChangeClick}> 변경하기 </button>
                                                                                    <p> 초기값 1234* 로 비밀번호 초기화가 됩니다.</p>
                                                                           </div>

                                                                </div>
                                                            </div>
                                                    </div>
                                            )} <button type="button" className="btn-common" onClick={handlePwOpenClick}> 비밀번호 초기화 </button> </td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="employeeTel">연락처</label></th>
                                            <td><input type="text" id="employeeTel" name="employeeTel" value={modifyItem.employeeTel} onChange={(e) => handleModifyItemChange(e.target)} disabled/></td>

                                            <th><label htmlFor="employeeEmail">이메일</label></th>
                                            <td><input type="text" id="employeeEmail" name="employeeEmail" value={modifyItem.employeeEmail} onChange={(e) => handleModifyItemChange(e.target)} disabled/></td>

                                            <th><label htmlFor="employeeAddr">주소</label></th>
                                            <td><input type="text" id="employeeAddr" name="employeeAddr" value={modifyItem.employeeAddr} onChange={(e) => handleModifyItemChange(e.target)} disabled/></td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="residentNum">주민번호</label></th>
                                            <td><input type="text" id="residentNum" name="residentNum" value={modifyItem.residentNum} onChange={(e) => handleModifyItemChange(e.target)} disabled/></td>

                                            <th><label htmlFor="hireDate">입사일</label></th>
                                            <td><input type="date" id="hireDate" name="hireDate" value={modifyItem.hireDate} onChange={(e) => handleModifyItemChange(e.target)} disabled/></td>

                                            <th><label htmlFor="salary">급여</label></th>
                                            <td><input type="text" id="salary" name="salary" value={modifyItem.salary} onChange={(e) => handleModifyItemChange(e.target)} /></td>
                                        </tr>
                                        <tr>
                                     {/*       <th><label htmlFor="employeeManagerId">직속상사</label></th>
                                            <td><input type="text" id="employeeManagerId" name="employeeManagerId" value={modifyItem.employeeManagerId} onChange={(e) => handleModifyItemChange(e.target)} /></td>
*/}
                                            <th><label htmlFor="authorityGrade">권한</label></th>
                                            <td>
                                                <select id="authorityGrade" name="authorityGrade" value={modifyItem.authorityGrade} onChange={(e) => handleModifyItemChange(e.target)}>
                                                    <option value="">선택하세요</option>
                                                          <option value="S">대표</option>
                                                           <option value="A">부장</option>
                                                           <option value="B">과장</option>
                                                           <option value="C">대리</option>
                                                           <option value="D">사원</option>
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
    <Employee />
);