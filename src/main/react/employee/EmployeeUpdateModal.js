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
                                                                                    <div> <input type="text" id="employeePw" name="employeePw" value={emplPw.employeePw || ''}  onChange={handleemplPwChange} />  </div>
                                                                                    <button type="button" className="btn-common" onClick={pwChangeClick}> 변경하기 </button>
                                                                           </div>

                                                                </div>
                                                            </div>
                                                    </div>
                                            )} <button type="button" className="btn-common" onClick={handlePwOpenClick}> 비밀번호 변경 </button> </td>
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
                                            {/*<th><label htmlFor="residentNum">주민번호</label></th>
                                            <td><input type="text" id="residentNum" name="residentNum" value={modifyItem.residentNum} onChange={(e) => handleModifyItemChange(e.target)} disabled/></td>*/}

                                            <th><label htmlFor="hireDate">입사일</label></th>
                                            <td><input type="date" id="hireDate" name="hireDate" value={modifyItem.hireDate} onChange={(e) => handleModifyItemChange(e.target)} disabled/></td>

                                            <th><label htmlFor="salary">급여</label></th>
                                            <td><input type="text" id="salary" name="salary" value={modifyItem.salary} onChange={(e) => handleModifyItemChange(e.target)} /></td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="employeeManagerId">직속상사</label></th>
                                            <td><input type="text" id="employeeManagerId" name="employeeManagerId" value={modifyItem.employeeManagerId} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="authorityGrade">권한</label></th>
                                            <td>
                                                <select id="authorityGrade" name="authorityGrade" value={modifyItem.authorityGrade} onChange={(e) => handleModifyItemChange(e.target)}>
                                                    <option value="">선택하세요</option>
                                                    <option value="S">S</option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="C">C</option>
                                                    <option value="D">D</option>
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