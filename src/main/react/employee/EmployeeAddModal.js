
const validateInputs = () => {
  const { employeeId, residentNum, salary, employeeTel ,authorityGrade, employeeManagerId, employeePw , employeeEmail} = test; // 상태에서 값을 가져옵니다

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
  if (!validPattern.test(employeeId)) {
    alert('아이디는 대소문자, 숫자, 특수문자만 가능합니다.');
    return false;
  }
  if (!validPattern.test(employeePw)) {
    alert('비밀번호는 대소문자, 숫자, 특수문자만 가능합니다.');
    return false;
  }

  // 주민번호 유효성 검사
/*  const residentNumRegex = /^\d{6}-\d{7}$/;
  if (residentNum.length < 14 || !residentNumRegex.test(residentNum)) {
    alert('주민번호는 형식에 맞게 입력하세요 000000-0000000');
    return false;
  }*/

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


    // 리스트에 입력값 추가 핸들러
    const onClickListAdd = () => {
    if (validateInputs()) {
      setList((prevList) => [...prevList, test]);
      setTest({
        employeeId: '',
        employeePw: '',
        employeeName: '',
        employeeTel: '',
        employeeEmail: '',
        employeeAddr: '',
        residentNum: '',
        hireDate: '',
        salary: '',
        employeeManagerId: '',
        authorityGrade: '',
         authorityName: ''
      }); // 입력값 초기화
    }
    };


// 아이디 중복 체크
 const [idResult, setIdResult] = useState(); // 중복 여부 상태
 const [buttonColor, setButtonColor] = useState('#939393');

  const IdCheck = async () => {
    try {
      const response = await axios.post('/employee/employeeIdCheck',test, {
       headers: { 'Content-Type': 'application/json' }
      });
      // 아이디가 사용 가능한지 여부를 서버 응답에서 확인
        const isAvailable = !response.data;
         // 서버가 `true` 반환 시 사용 불가, `false` 반환 시 사용 가능
        console.log(isAvailable);
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


 const isObjectEmpty = (obj) => {
    return Object.values(obj).some(value => value === '' || value === null || value === undefined);
  };





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
                                      {/*  <th colSpan="1"><label htmlFor="registStartDate">주민번호</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="residentNum" name="residentNum" value={test.residentNum} onChange={handleInputAddChange} /> </td>*/}


                                        <th colSpan="1"><label htmlFor="registEndDate">입사일</label></th>
                                        <td colSpan="2"><input type="date" placeholder="필드 입력" id="hireDate" name="hireDate" value={test.hireDate} onChange={handleInputAddChange} /></td>

                                        <th colSpan="1"><label htmlFor="registEndDate">급여</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="salary" name="salary" value={test.salary} onChange={handleInputAddChange} /></td>
                                    </tr>

                                    <tr>
                                        <th colSpan="1"><label htmlFor="registEndDate">직속상사</label></th>
                                        <td colSpan="2"><input type="text" placeholder="필드 입력" id="employeeManagerId" name="employeeManagerId" value={test.employeeManagerId} onChange={handleInputAddChange} /></td>

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
                                <div style={{ fontWeight: 'bold' }}> 총 N 건</div>
                                  {showDeleteModal && <button className='delete-btn2 btn-common' onClick={handleDeleteClick2}>삭제</button>}
                                <table className="formTableList">

                                        <thead>
                                            <tr>
                                            <th><input type="checkbox" checked={allCheckModal} onChange={handleMasterCheckboxChangeModal} /></th>
                                            <th>No.</th>
                                            <th>직원ID</th>
                                            <th>직원PW</th>
                                            <th>직원명</th>
                                            <th>전화번호</th>
                                            <th>이메일</th>
                                            <th>주소</th>
                                            {/*<th>주민번호</th>*/}
                                            <th>입사일</th>
                                            <th>급여</th>
                                            <th>직속상사</th>
                                            <th>권한</th>
                                        </tr>
                                    </thead>
                                    <tbody>


                                        {list.map((item, index) => (
                                            <tr key={index} className={checkItemModal[index] ? 'selected-row' : ''}>
                                                <td>
                                                <input className="mainCheckboxModal" type="checkbox" id={item.employeeId} checked={checkItemModal[index] || false}
                                                                                                                                onChange={handleCheckboxChangeModal} />
                                                </td>
                                                <td style={{display : 'none'}}> {index} </td>
                                                <td> {index + 1} </td>
                                                <td>{item.employeeId}</td>
                                                <td>{item.employeePw}</td>
                                                <td>{item.employeeName}</td>
                                                <td>{item.employeeTel}</td>
                                                <td>{item.employeeEmail}</td>
                                                <td>{item.employeeAddr}</td>
                                                {/*<td>{item.residentNum}</td>*/}
                                                <td>{item.hireDate}</td>
                                                <td>{item.salary}</td>
                                                <td>{item.employeeManagerId}</td>
                                                <td>{item.authorityGrade}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            )}

