import React from 'react';
import ReactDOM from "react-dom/client";
import './MyPage.css';
import MonthlySalesChart from '../main/MonthlySalesChart';


function MyPage() {

    return (

        <div>
 <h1 className="header"><i class="bi bi-tag"></i>마이페이지  </h1>
  <div className="mypage-main">

<div className="mypage-table">
        <table>
            <tr>
                <td><label for="employeeId">아이디</label></td>
                <td><input type="text" id="employeeId" name="employeeId" required/></td>
            </tr>
            <tr>
                <td><label for="employeePw">비밀번호</label></td>
                <td><input type="password" id="employeePw" name="employeePw" required/></td>

            </tr>
            <tr>
                <td><label for="employeeName">이름</label></td>
                <td><input type="text" id="employeeName" name="employeeName" required/></td>
            </tr>
            <tr>
                <td><label for="phone">전화번호</label></td>
                <td><input type="tel" id="phone" name="phone" required/></td>
            </tr>
            <tr>
                <td><label for="email">이메일</label></td>
                <td><input type="email" id="email" name="email" required/></td>
            </tr>
            <tr>
                <td><label for="address">주소</label></td>
                <td><input type="text" id="address" name="address" required/></td>
            </tr>
            <tr>
              <td><label for="ssn">주민번호</label></td>
              <td>
                  <input 
                      type="text" 
                      id="ssn" 
                      name="ssn" 
                      required
                      title="주민번호는 6자리-7자리 형식이어야 합니다."
                      maxlength="14"/>
              </td>
            </tr>
            <tr>
                <td><label for="hireDate">입사일</label></td>
                <td><input type="date" id="hireDate" name="hireDate" required/></td>
            </tr>
            <tr>
                <td><label for="salary">급여</label></td>
                <td><input type="number" id="salary" name="salary" required/></td>
            </tr>
            <tr>
                <td><label for="supervisor">직속상사</label></td>
                <td><input type="text" id="supervisor" name="supervisor" required/></td>
            </tr>
            <tr>
                <td><label for="role">권한</label></td>
                <td>
                    <select id="role" name="role" required>
                        <option value="">선택하세요</option>
                        <option value="Admin">관리자</option>
                        <option value="User">사용자</option>
                    </select>
                </td>
            </tr>
        </table>

        <div className="form-actions">
            <button type="submit" className="submit-btn">수정하기</button>

        </div>
</div>

    <div className="mypage-chart">
      <h2 className="header"><i class="bi bi-graph-up"></i> 이번 달 실적  </h2>
                <MonthlySalesChart />

    </div>

</div>

</div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MyPage />
);