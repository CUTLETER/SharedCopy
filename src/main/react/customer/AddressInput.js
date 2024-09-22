import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import './AddressInput.css'; // CSS 파일 임포트

const AddressInput = (props) => {
  // 상태 관리: 우편번호, 주소, 상세주소, 모달 열림 상태
  const [zonecode, setZonecode] = useState('');
  const [address, setAddress] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // DaumPostcode의 테마 설정
  const themeObj = {
    bgColor: '#FFFFFF',
    pageBgColor: '#FFFFFF',
    postcodeTextColor: '#C05850', // 강조 텍스트 색상
    emphTextColor: '#222222',     // 일반 텍스트 색상
  };

  // DaumPostcode의 스타일 설정
  const postCodeStyle = {
    width: '400px', // 너비 설정
    height: '480px', // 높이 설정
  };

  // DaumPostcode 검색 완료 시 실행되는 함수
  const completeHandler = (data) => {
    const { address, zonecode } = data;
    setZonecode(zonecode);  // 우편번호 설정
    setAddress(address);    // 기본 주소 설정
  };

  // DaumPostcode 모달이 닫힐 때 실행되는 함수
  const closeHandler = (state) => {
    // 강제 종료 또는 완료 후 닫힐 때 모달을 닫음
    if (state === 'FORCE_CLOSE' || state === 'COMPLETE_CLOSE') {
      setIsOpen(false);
    }
  };

  // 주소 검색 모달을 토글하는 함수
  const toggleHandler = () => {
    setIsOpen((prevOpenState) => !prevOpenState);  // 모달 열림/닫힘 상태 변경
  };

  // 상세 주소 입력 시 상태 업데이트 함수
  const inputChangeHandler = (event) => {
    setDetailedAddress(event.target.value);  // 입력한 상세 주소 업데이트
  };

  const handleConfirm = () => {
    const fullAddress = `${address} ${detailedAddress}`;
    if (props.onAddressConfirm) {
      props.onAddressConfirm({
        fullAddress: fullAddress,
        zonecode: zonecode
      }); // 객체로 전달
    }
    setIsOpen(false);
  };
  
  return (
    <div className="address-input-container">
      <div className="address-input-header">주소 입력</div>
      <div className="address-input-content">
        {/* 우편번호 및 주소 검색 버튼 */}
        <div className="address-input-zipcode-container">
          <div className="address-input-zipcode">{zonecode}</div>
          <button
            type="button"
            className="address-input-search-button"
            onClick={toggleHandler}
          >
            주소 찾기
          </button>
        </div>

        {/* DaumPostcode 검색 창 열기 */}
        {isOpen && (
          <div className="address-input-postcode-container">
            <DaumPostcode
              theme={themeObj}              // 설정한 테마 적용
              style={postCodeStyle}          // 설정한 스타일 적용
              onComplete={completeHandler}   // 검색 완료 시 호출
              onClose={closeHandler}         // 모달 닫힐 때 호출
            />
          </div>
        )}

        {/* 주소 표시 */}
        <div className="address-input-address-container">{address}</div>

        {/* 상세 주소 입력 필드 */}
        <div className="address-input-detailed-container">
          <input
            className="address-input-detailed-input"
            value={detailedAddress}
            onChange={inputChangeHandler}
            placeholder="상세 주소 입력"
          />
        </div>

        {/* 주소 확인 버튼 */}
        <button
          type="button"
          className="address-input-confirm-button"
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default AddressInput;
