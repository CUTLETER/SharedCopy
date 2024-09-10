import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ReactDOM from "react-dom/client";
import './employee.css';
import useCheckboxManager from "../js/CheckboxManager";
import useSort from '../js/useSort';
import '../js/modalAdd.css';

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


function Employee() {
//    // Data and options for the chart
//    const chartData = {
//        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
//        datasets: [
//            {
//                label: '매출액 (억 원)',
//                data: [12, 19, 3, 5, 2, 3, 7, 8, 5, 9, 10, 14],
//                backgroundColor: 'rgba(0, 123, 255, 0.8)',
//                borderColor: 'rgba(0, 123, 255, 1)',
//                borderWidth: 1,
//                type: 'bar'
//            },
//            {
//                label: '전년 대비 (%)',
//                data: [5, 15, -3, -5, 2, 10, 7, 12, 5, -2, 0, 4],
//                backgroundColor: 'rgba(255, 99, 132, 0.5)',
//                borderColor: 'rgba(255, 99, 132, 1)',
//                borderWidth: 2,
//                fill: false,
//                type: 'line'
//            }
//        ]
//    };

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
            employeeManagerId: '',
            authorityGrade: ''
    }]);

// 메인 리스트 가져오기 axios
    useEffect(() => {
        axios.get('/employee/employeeALL')  // Spring Boot 엔드포인트와 동일한 URL로 요청
          .then(response => setEmployee(response.data))  // 응답 데이터를 상태로 설정
          .catch(error => console.error('Error fetching employee data:', error));
      }, []);


// 검색,필터 기능
    let [emSearch, setEmSearch] = useState({
          employeeId: '',
            employeeName: '',
            employeeTel: '',
            employeeEmail: '',
            employeeAddr: '',
            hireDate: null,
            employeeManagerId: '',
            authorityGrade: ''
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
    .then(response => setEmployee(response.data))
    .catch(error => console.error('에러에러', error));
  } else {
    console.error('[핸들러 작동 잘 함]');
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
        setIsVisible(false);
    };

// --- 수정 모달

//    const [modifyItem, setModifyItem] = useState([
//        {
//             employeeId: '',
//              employeePw: '',
//              employeeName: '',
//              employeeTel: '',
//              employeeEmail: '',
//              employeeAddr: '',
//              residentNum: '',
//              hireDate: null,
//              salary: 0,
//              employeeManagerId: '',
//              authorityGrade: ''
//        }
//    ]);

    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
    const handleModify = (item) => {
        setModifyItem(item);
        setIsModifyModalVisible(true);
    }
    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

//    const handleModifyItemChange = (e) => {
//        let copy = {...modifyItem, [e.name]: e.value};
//        setModifyItem(copy);
//    }

    return (

        <div>
            <h1><i className="bi bi-search"></i> 직원 목록  </h1>
            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">

                    <div className="filter-item">
                        <label className="filter-label" htmlFor="employeeId" >직원아이디</label>
                        <input className="filter-input" type="text" id="employeeId" placeholder="" onChange={handleInputChange}  value={emSearch.employeeId} required/>
                    </div>

                    <div className="filter-item">
                        <label className="filter-label" htmlFor="employeeName">직원이름</label>
                        <input className="filter-input" type="text" id="employeeName" placeholder="" onChange={handleInputChange}  value={emSearch.employeeName} r required/>
                    </div>

                    <div className="filter-item">
                        <label className="filter-label" htmlFor="employeeTel">직원전화번호</label>
                        <input className="filter-input" type="text" id="employeeTel" placeholder="" onChange={handleInputChange}  value={emSearch.employeeTel}  required/>
                    </div>

                    <div className="filter-item">
                        <label className="filter-label" htmlFor="employeeEmail">직원이메일</label>
                        <input className="filter-input" type="text" id="employeeEmail" placeholder="" onChange={handleInputChange}  value={emSearch.employeeEmail}  required/>
                    </div>

                    <div className="filter-item">
                        <label className="filter-label" htmlFor="employeeAddr">주소</label>
                        <input className="filter-input" type="text" id="employeeAddr" placeholder="" onChange={handleInputChange}  value={emSearch.employeeAddr}  required/>
                    </div>

                    <div className="filter-item">
                        <label className="filter-label" htmlFor="hireDate">입사일</label>
                        <input className="filter-input" type="text" id="hireDate" placeholder=""  onChange={handleInputChange}  value={emSearch.hireDate}  required/>
                    </div>


                      <div className="filter-item">
                          <label className="filter-label" htmlFor="employeeManagerId">직속 상사</label>
                          <input className="filter-input" type="text" id="employeeManagerId" placeholder=""  onChange={handleInputChange}  value={emSearch.employeeManagerId}  required/>
                      </div>

                     <div className="filter-item">
                       <label htmlFor="authorityGrade">권한</label>
                       <select id="authorityGrade" onChange={handleInputChange} value={emSearch.authorityGrade}>
                         <option value="">선택하세요</option>
                         <option value="S">S</option>
                          <option value="A">A</option>
                        <option value="B">C</option>
                         <option value="C">C</option>

                       </select>
                     </div>

                        <div className="button-container">
                        <button type="button" className="search-btn" onClick={handleSearchEmployee}><i
                            className="bi bi-search search-icon"></i>
                        </button>
                    </div>

                        </div>
                    </div>


                </div>


                <button className="btn-common add" type="button">
                    직원 등록
                </button>

                <table className="search-table" style={{marginTop: "50px"}}>
                    {showDelete && <button className='delete-btn btn-common' onClick={handleDelete}>삭제</button>}
                    <thead>
                    <tr>
                        <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange}/></th>
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
                      <th> 직속상사
                        <button className="sortBtn" onClick={() => sortData('employeeManagerId')}>
                            {sortConfig.key === 'employeeManagerId' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>

                      <th> 권한
                    <button className="sortBtn" onClick={() => sortData('authorityGrade')}>
                        {sortConfig.key === 'authorityGrade' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                    </th>
                    </tr>
                    </thead>
                    <tbody>
                    {employee.length > 0 ? (
                        employee.map((item, index) => (
                            <tr key={index} className={checkItem[index] ? 'selected-row' : ''} onDoubleClick={() => {
                                handleModify(item)
                            }}>
                                <td><input type="checkbox" checked={checkItem[index] || false}
                                           onChange={handleCheckboxChange}/></td>
                                <td style={{display: 'none'}}>{index}</td>
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
                                <td>{item.employeeManagerId}</td>
                                <td>{item.authorityGrade}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="13">등록된 상품이 없습니다😭</td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan="12"></td>
                        <td colSpan="1"> {employee.length} 건</td>
                    </tr>
                    </tbody>
                </table>
            </div>

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
                                        <button> 등록하기</button>
                                    </div>
                                    <div className="btn-close">

                                    </div>
                                </div>
                            </div>


                            <div className="RegistForm">
                                <table className="formTable">
                                    <tr>
                                        <th colSpan="1"><label htmlFor="productNo">직원명</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" id="productNo"/></td>

                                        <th colSpan="1"><label htmlFor="customerNo">아이디</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" id="customerNo"/></td>

                                        <th colSpan="1"><label htmlFor="customerNo">비밀번호</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" id="customerNo"/></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="customPrice">연락처</label></th>
                                        <td><input type="number" placeholder="필드 입력" id="customPrice"/></td>

                                        <th><label htmlFor="currency">이메일</label></th>
                                        <td><input type="text" placeholder="필드 입력" id="currency"/></td>

                                        <th><label htmlFor="discount">주소</label></th>
                                        <td><input type="number" placeholder="필드 입력" id="discount"/></td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="registStartDate">주민번호</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" id="registStartDate"/> </td>


                                        <th colSpan="1"><label htmlFor="registEndDate">입사일</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" id="registEndDate"/></td>

                                        <th colSpan="1"><label htmlFor="registEndDate">급여</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" id="registEndDate"/></td>
                                    </tr>

                                    <tr>
                                     <th colSpan="1"><label htmlFor="registEndDate">직속상사</label></th>
                                    <td colSpan="3"><input type="text" placeholder="필드 입력" id="registEndDate"/></td>

                                     <th colSpan="1"><label htmlFor="registEndDate">권한</label></th>
                                    <td colSpan="3">        <select>
                                                             <option value="">선택하세요</option>
                                                             <option value="S">S</option>
                                                              <option value="A">A</option>
                                                            <option value="B">C</option>
                                                             <option value="C">C</option>
                                                           </select>

                                    </td>



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

                            <div className="RegistFormList">
                                <div style={{fontWeight: 'bold'}}> 총 N 건</div>
                                <table className="formTableList">
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
                                        <td colSpan="12"> 합계</td>
                                        <td colSpan="2"> 13,000,000</td>
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
                <div> 수정 모달창  </div>
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
    <Employee/>
);