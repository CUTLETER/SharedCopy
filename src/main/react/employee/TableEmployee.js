import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import './Employee.css';
import useCheckboxManager from "../js/CheckboxManager";
import useSort from '../js/useSort';


function TableEmployee(){

    // --- 테이블 정렬 기능
    const { sortedData, sortData, sortConfig } = useSort(employee);

    const {
          allCheck: allCheckMain,
          checkItem: checkItemMain,
          showDelete: showDeleteMain,
          handleMasterCheckboxChange: handleMasterCheckboxChangeMain,
          handleCheckboxChange: handleCheckboxChangeMain,
          handleDelete: handleDeleteMain
      } = useCheckboxManager();

      const {
          allCheck: allCheckModal,
          checkItem: checkItemModal,
          showDelete: showDeleteModal,
          handleMasterCheckboxChange: handleMasterCheckboxChangeModal,
          handleCheckboxChange: handleCheckboxChangeModal,
          handleDelete: handleDeleteModal,
          setCheckItem: setCheckItemModal,
          setAllCheck: setAllCheckModal,
          setShowDelete: setShowDeleteModal
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
        authorityGrade: '',
        authorityName: ''
    }]);

    // 메인 리스트 가져오기 axios
    useEffect(() => {
        axios.get('/employee/employeeALL')  // Spring Boot 엔드포인트와 동일한 URL로 요청
            .then(response => setEmployee(response.data))  // 응답 데이터를 상태로 설정
            .catch(error => console.error('Error fetching Customer data:', error));
    }, []);





return (

<div>

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
                         {/*   <th>직원PW
                                <button className="sortBtn" onClick={() => sortData('employeePw')}>
                                    {sortConfig.key === 'employeePw' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>*/}
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
                          {/*  <th>주민번호
                                <button className="sortBtn" onClick={() => sortData('residentNum')}>
                                    {sortConfig.key === 'residentNum' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>*/}
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
                             <th> 직급
                                <button className="sortBtn" onClick={() => sortData('authorityName')}>
                                    {sortConfig.key === 'authorityName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr key={index} className={checkItemMain[index] ? 'selected-row' : ''} onDoubleClick={() => {
                                    handleModify(item)
                                }}>
                                    <td><input className="mainCheckbox" type="checkbox" id={item.employeeId} checked={checkItemMain[index] || false}
                                        onChange={handleCheckboxChangeMain} /></td>
                                    <td style={{ display: 'none' }}>{index}</td>
                                     <td>{index + 1}</td>
                                    <td>{item.employeeId}</td>
                                   {/*<td>{truncateText(item.employeePw, 10)}</td>*/}
                                    <td>{item.employeeName}</td>
                                    <td>{item.employeeTel}</td>
                                    <td>{item.employeeEmail}</td>
                                    <td>{item.employeeAddr}</td>
                                   {/* <td>{item.residentNum}</td>*/}
                                    <td>{item.hireDate}</td>
                                    <td>{item.salary}</td>
                                    <td>{item.employeeManagerId}</td>

                                    <td>{item.authorityGrade}</td>
                                    <td>{item.authorityName}</td>
                                </tr>
                            ))
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
                    {renderPageNumbers()}
                </div>
</div>

);
}


export default TableEmployee;
