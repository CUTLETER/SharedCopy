import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import './Employee.css';
import useCheckboxManager from "../js/CheckboxManager";
import useSort from '../js/useSort';


function MainEmployee(){

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
        employeeManagerId: '',
        authorityGrade: '',
        authorityName: ''
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

        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // 기본 Enter 동작 방지 (예: 폼 제출)
                handleSearchEmployee();
            }
        };

return (

<div>
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


                            <div className="filter-item">
                                <label className="filter-label" htmlFor="employeeManagerId">직속 상사</label>
                                <input     onKeyDown={handleKeyDown} className="filter-input" type="text" id="employeeManagerId" placeholder="" onChange={handleInputChange} value={emSearch.employeeManagerId} required />
                            </div>

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

                            <div className="button-container">
                                <button type="button" className="search-btn" onClick={handleSearchEmployee}><i
                                    className="bi bi-search search-icon"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                    </div>
</div>

);
}


export default MainEmployee;
