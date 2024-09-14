import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom/client";
import './Order.css'
import './OrderRegist.css'
import './OrderModalDetail.css'
import useCheckboxManager from "../js/CheckboxManager";
import axios from 'axios';

function Order() {


    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager(setOrder);

    // 주문 데이터를 저장하는 상태
    const [order, setOrder] = useState([]);

    //주문목록 불러오기
    useEffect( () => {

        let effectOrder = async () => {
            try{
                let data = await fetch('/order/orderList').then(res => res.json());

                const transfomData = data.map(item => ({
                    orderNo: item.orderNo,
                    /*상품명은 상세보기 만들면 그거랑 연결 할 예정*/
                    customerN: item.customer.customerName,
                    manager:item.employee.employeeName,
                    status:item.confirmStatus,
                    date:item.regDate
                }));

                setOrder(transfomData);
                console.log(transfomData);
            } catch (error){
                console.error('error발생함 : ', error);
            }
        }

        effectOrder();
    }, []);


// --- 테이블 정렬 기능

    // 정렬 상태와 방향을 저장하는 상태
    const [sortConfig, setSortConfig] = useState({key: '', direction: 'ascending'});

    // 정렬 함수
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        const sortOrder = [...order].sort((a, b) => { //order배열 정렬(매개변수 비교)
            if (a[key] < b[key]) { // key는 변수명임 (ex. orderNo, manage, title ...)
                return direction === 'ascending' ? -1 : 1; //
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setOrder(sortOrder);
        setSortConfig({key, direction});
    };


// --- 테이블 정렬 기능

    /*==============jsy조건 검색==============*/
    const [prod, setProd] = useState([]);
    const [mycustomer, setMycustomer] = useState([]);

    const [confirmState] = useState(['임시저장', '대기', '승인', '반려']);//결재상태배열
    const [selectedConfirm, setSelectedConfrim] = useState('');

    //상품명 목록 Data
    useEffect ( () => {
        let effectProd = async() => {
            let getProd = await fetch('/product/products').then(res => res.json());
            setProd(getProd);
        }
        effectProd();
    },[]);

    //고객명 목록 data
    useEffect ( () => {
        let effectCustomer = async() => {
            let getCustomer = await fetch('/customer/customerALL').then(res => res.json());
            setMycustomer(getCustomer);//주문필터
            setOrderCustomer(getCustomer);//주문등록폼
        }
        effectCustomer();
    },[]);


    //입력된 조건 데이터 보내기
    const [form, setForm] = useState({});

    const handleChange = (e) => {
        let copy = {...form, [e.target.id]: e.target.value};
        setForm(copy);
    }


    const handleSearchBtn = async() => {
        //서버로 데이터 보내기
        const date = form.date || null;
        const orderNo = form.orderNo|| null;
        const prod = form.prod || null;
        const mycustomer = form.mycustomer || null;
        const manager = form.manager || null;
        const status = form.selectedConfirm || null;

        const res = await axios.post('/order/searchSelect', {
            inputDate: date,
            inputOrderNo: orderNo,
            inputProdNo: prod,
            inputCustomerNo: mycustomer,
            inputManager: manager,
            inputState: status
        }); //{매개변수 : 전달 값}

        const searchOrderData = res.data; //이렇게 먼저 묶고 반복 돌려야함.

        if(Array.isArray(searchOrderData)){
            const getSearchOrder = searchOrderData.map(item => ({ //res.data.map안된다는 소리
                orderNo: item.orderNo,
                /*상품명은 상세보기 만들면 그거랑 연결 할 예정*/
                customerN: item.customer.customerName,
                manager:item.employee.employeeName,
                status:item.confirmStatus,
                date:item.regDate
            }))

            setOrder(getSearchOrder);
        } else {
            console.log('서버로부터 받은 데이터가 배열이 아닙니다.', searchOrderData);
        }
    };


    /*---------------jsy조건 끝---------------*/

    /*==============jsy주문 등록 폼==============*/

    const [orderCustomer, setOrderCustomer] = useState([]);//고객번호목록
    const [registCustomer, setRegistCustomer] = useState(''); //선택된 고객명 저장
    const [customPrice, setCustomPrice] = useState([]);//판매가리스트
    const [checkProd, setCheckProd] = useState([]); //체크한 항목의 상태번호 저장
    const [addCheckProd, setAddCheckProd] = useState([]); //체크한 상품 추가된 리스트

    // 고객 번호 변경 시 호출되는 함수
    const handleCustomer = (e) => {
        setRegistCustomer(e.target.value);
        //목록 호출하는게 customoPrice임 ㅇㄴ

        setAddCheckProd([]); //추가리스트 초기화
    };

    // 고객이 선택되면 상품+판매가를 가져오는 함수
    useEffect(() => {
        if (registCustomer) {
            const fetchPrice = async () => {
                try {
                    const resp = await axios.post('/order/getPrice', {
                        inputOrderCustomerNo:  parseInt(registCustomer,10)
                    });
                    const OrderCustomerData = resp.data;

                    if (Array.isArray(OrderCustomerData)) {
                        const getOrderCustomer = OrderCustomerData.map(value => ({
                            salePrice: value.customPrice,
                            prodNo: value.product.productNo,
                            prodCat: value.product.productCategory,
                            prodName: value.product.productName,
                            prodWriter: value.product.productWriter,
                            saleStart: value.startDate,
                            saleEnd: value.endDate
                        }));
                        setCustomPrice(getOrderCustomer);
                        setCheckProd([]);
                    } else {
                        console.error('등록폼 에러', OrderCustomerData);
                    }
                } catch (error) {
                    console.error('API 호출 오류', error);
                }
            };
            fetchPrice();
        }
    },[registCustomer]); //의존성 배열: 특정 값이 변경될 때마다 실행한다.




    //상품 체크 이벤트 - 체크항목만 checkProd 넣기
    const handleCheck = (prodNo, prodCat, prodName, salePrice, saleStart, saleEnd) => (e) => { //체크항목 가져오기
        setCheckProd( prevCheckProd => {
            const newCheckProd = [...prevCheckProd];
            if(e.target.checked){ //체크O
                newCheckProd.push({prodNo, prodCat, prodName, salePrice, saleStart, saleEnd});
            }else{ //체크 X
                const index = newCheckProd.findIndex(item => item.prodNo === prodNo); //체크한 prodNo랑 같은 행 찾기
                if(index > -1 ){ //내가 체크한게 이미 있다? 그럼 지울거임
                    newCheckProd.splice(index,1);
                }
            }
            return newCheckProd; //새 상태로 prodForm 업데이트~
        });
    }

    //추가 클릭
    const handleAddProd = () => {
        setAddCheckProd(prevAddCheckProd => [...prevAddCheckProd, ...checkProd]); // 기존 리스트에 체크된 항목 추가
    };

    // 값 확인
   /* useEffect(() => {
        console.log('checkProd:', checkProd);
        console.log('addCheckProd:', addCheckProd);
    }, [checkProd, addCheckProd]);*/

    //상품 수량
    const [quantities, setQuantities] = useState(0);
    const handleQuantityChange = (index) => (e) => {
        const qty = e.target.value || 0; // 입력값 정수변환

        setQuantities(prevQuantities => ({ ...prevQuantities, [index]: qty }));
    };



    /*---------------jsy주문 등록 끝---------------*/


// ---  모달창 띄우는 스크립트
    const [isVisibleDetail, setIsVisibleDetail] = useState(false);

    const handleAddClickDetail = () => {
        setIsVisibleDetail(true);
    };

    const handleCloseClickDetail = () => {
        setIsVisibleDetail(false);
    };

    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

    const handleAddClickCSV = () => {
        setIsVisibleCSV((prevState) => !prevState);
    };


    const [isVisible, setIsVisible] = useState(false);

    const handleAddClick = () => {
        setIsVisible(true);
    };

    const handleCloseClick = () => {
        setIsVisible(false);
    };

    const [modifyItem, setModifyItem] = useState([
        {
            orderNo: 0,
            title: '',
            details: '',
            manager: '',
            status: '',
            date: ''
        }
    ]);

    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);

    const handleModify = (item) => {
        setIsModifyModalVisible(true);

    }
    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

// --- 모달창 띄우는 스크립트



    return (
        <div>

            <div className="pageHeader"><h1><i class="bi bi-menu-up"></i>주문 관리</h1></div>

            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="date">등록 일자</label>
                                <input className="filter-input" type="date" id="date" value={form.date || ''} onChange={handleChange} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="orderNo">주문 번호</label>
                                <input className="filter-input" type="text" id="orderNo" value={form.orderNo || ''} onChange={handleChange} placeholder="주문 번호" required/>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="mycustomer">고객 명</label>
                                <select id="mycustomer" className="filter-input" value={form.mycustomer || ''} onChange={handleChange} >
                                    <option value="">선택</option>
                                    {mycustomer.map((customer) => (
                                        <option key={customer.customerNo} value={customer.customerNo}>
                                            {customer.customerName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="manager">담당자명</label>
                                <input className="filter-input" type="text" id="manager" value={form.manager || ''} onChange={handleChange}  placeholder="담당자명" required/>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="prod">상품명</label>
                                <select id="prod" className="filter-input" value={form.prod || ''} onChange={handleChange} >
                                    <option value="">선택</option>
                                        {prod.map((product) => (
                                            <option key={product.productNo} value={product.productNo}>
                                                {product.productName}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="selectedConfirm">결재 여부</label>
                                <select className="filter-select" id="selectedConfirm" value={form.selectedConfirm || ''} onChange={handleChange}>
                                    <option value="">전체</option>
                                    {confirmState.map( state => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>


                        </div>
                    </div>
                    <div className="button-container">
                        <button type="button" className="search-btn" id="searchOrder" onClick={handleSearchBtn}><i
                        className="b    i bi-search search-icon"></i>
                        </button>
                    </div>
                </div>

                <button className="btn-common add" type="button" onClick={handleAddClick}>
                    주문 등록
                </button>

                <table className="seacrh-table">
                    {showDelete && <button className='delete-btn' onClick={handleDelete}>삭제</button>}
                    <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>No.</th>
                        <th>
                            주문 번호
                            <button className="sortBtn" onClick={() => sortData('orderNo')}>
                                {sortConfig.key === 'orderNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>
                            담당자명
                            <button className="sortBtn" onClick={() => sortData('manager')}>
                                {sortConfig.key === 'manager' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>
                            고객명
                            <button className="sortBtn" onClick={() => sortData('customerN')}>
                                {sortConfig.key === 'customerN' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>
                            결재 상태
                            <button className="sortBtn" onClick={() => sortData('status')}>
                                {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>
                            주문 등록 일자
                            <button className="sortBtn" onClick={() => sortData('date')}>
                                {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>
                        주문 상세
                        <button className="sortBtn" onClick={() => sortData('details')}>
                        {sortConfig.key === 'details' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                        </th>


                    </tr>
                    </thead>
                    <tbody>
                    {order.length > 0 ? (
                        order.map((item, index) => (
                                <tr key={`${item.orderNo}`} className={checkItem[index+1] ? 'selected-row' : ''} onDoubleClick={() => {
                                handleModify(item)
                                }}>
                                <td>
                                    <input
                                    type="checkbox"
                                    checked={checkItem[index + 1] || false}
                                    onChange={handleCheckboxChange}
                                    />
                                </td>
                                <td>{index + 1}</td>
                                <td>{item.orderNo}</td>
                                <td className="ellipsis">{item.manager}</td>
                                <td className="ellipsis">{item.customerN}</td>
                                <td>{item.status}</td>
                                <td>{item.date}</td>
                                <td><button className="btn-common"> 상세보기 </button> </td>
                                {/*<td>{item.prodName}</td>*/}
                                </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">등록된 주문이 없습니다😭</td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan="7"></td>
                        <td colSpan="1"> {order.length} 건</td>
                    </tr>

                    </tbody>
                </table>
            </div>

{/* 여기 아래는 모달이다. */}

{/*jsy 주문등록 모달창 시작*/}
            {isVisible && (
                <div class="confirmRegist">
                    <div class="fullBody">
                        <div class="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div class="form-header">
                                <h1>주문 등록</h1>

                                <div class="btns">
                                    <div class="btn-add2">
                                            <button> 임시저장 </button>

                                    </div>
                                    <div class="btn-close">
                                          <button> 등록하기</button>
                                    </div>
                                </div>
                            </div>

                            {/*주문정보-헤더*/}
                            <div class="RegistForm">
                                <table class="formTable">

                                    <tr>

                                        <th colspan="1"><label htmlFor="orderCustomer">고객사 명</label></th>
                                        <td colspan="3">
                                        <select id="orderCustomer" value={registCustomer || ''} onChange={handleCustomer}>
                                            <option value="">선택</option>
                                            {orderCustomer.map(customer => (
                                                <option key={customer.customerNo} value={customer.customerNo}>
                                                    {customer.customerName}
                                                </option>
                                            ))
                                            }
                                        </select></td>

                                        <th colspan="1"><label htmlFor="">납품 요청일</label></th>
                                        <td colspan="3"><input type="date"/></td>

                                    </tr>


                                    <tr>
                                        <th colspan="1"><label htmlFor="">담당자명</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력"/></td>


                                        <th colspan="1"><label htmlFor="">결재자</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력"/></td>

                                    </tr>
                                </table>
                            </div>

                            <div className="bookSearchBox">
                                <div className="bookSearch">
                                    <input type="text" />
                                    <button type="button" className="btn-common" onClick={handleAddProd}>추가</button>
                                </div>
                                {/*<div className="bookResultList">
                                        <ul>
                                        {orderCustomer.map((customer) => (
                                            <li key={customer.customerNo}>
                                            {customer.customerName}
                                            </li>
                                        ))}
                                        </ul>
                                    </div>*/}
                            </div>



                            <div class="RegistFormList">
                                <div style={{fontWeight: 'bold'}}> 총 N 건</div>
                                <table className="formTableList">
                                    <thead>
                                        <tr>
                                            <th><input type="checkbox"/></th>
                                            <th>no</th>
                                            <th>상품 코드</th>
                                            <th>상품 명</th>
                                            <th>저자</th>
                                            <th>판매가</th>
                                            <th>판매 기간</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customPrice.map((prodList, index) => (
                                            <tr key={index}>
                                                <td><input type="checkbox" id="checkProdList"
                                                        onChange={handleCheck(prodList.prodNo,
                                                                                prodList.prodCat,
                                                                                prodList.prodName,
                                                                                prodList.salePrice,
                                                                                prodList.saleStart,
                                                                                prodList.saleEnd)}/></td>
                                                <td>{index + 1}</td>
                                                <td>{prodList.prodNo}</td>
                                                <td>{prodList.prodName}</td>
                                                <td>{prodList.prodWriter}</td>
                                                <td>{prodList.salePrice}</td>
                                                <td>{prodList.saleStart} ~ {prodList.saleEnd}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        <div className="RegistFormList">
                                    <div style={{fontWeight: 'bold'}}> 총 N 건</div>
                                    <table className="formTableList">
                                        <thead>
                                            <tr>
                                                <th><input type="checkbox"/></th>
                                                <th>no</th>
                                                <th>상품 종류</th>
                                                <th>상품 명</th>
                                                <th>상품 수량</th>
                                                <th>총 액</th>
                                                <th>판매시작날짜</th>
                                                <th>판매종료날짜</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {addCheckProd.map((addProd, index) => {
                                                const qty = quantities[index] || 0; // 상태에서 수량을 가져옵니다.
                                                return (
                                                    <tr key={index}>
                                                        <td><input type="checkbox"/></td>
                                                        <td>{index + 1}</td>
                                                        <td>{addProd.prodCat}</td>
                                                        <td>{addProd.prodName}</td>
                                                        <td>
                                                        <input type="number" id={`prodQty_${index}`} onChange={handleQuantityChange(index)} placeholder="수량"/>
                                                        </td>
                                                        <td>{addProd.salePrice * qty}</td> {/* 총액 계산 */}
                                                        <td>{addProd.saleStart}</td>
                                                        <td>{addProd.saleEnd}</td>
                                                    </tr>
                                                );
                                            })}
                                            <tr style={{fontWeight: 'bold'}}>
                                                <td colspan="6"> 합계</td>
                                                <td colspan="2"> 13,000,000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>


                        </div>



                    </div>
                </div>

            )}
            {/* 모달창의 끝  */}

 {isModifyModalVisible && (


        <div className="confirmRegist">
                           <div className="fullBody">
                               <div className="form-container">
                                   <button className="close-btn" onClick={handleModifyCloseClick}> &times; </button>
                                   <div className="form-header">
                                       <h1>상세 조회</h1>
                                       <div className="btns">
                                           <div className="btn-add">
                                               <button type="button">수정하기</button>
                                               {/* Changed type to "button" */}
                                           </div>
                                       </div>
                                   </div>
                                   <form className="RegistForm">
                                       <table className="formTable">
                                           <tbody>
                                           <tr>
                                               <th colSpan=""><label htmlFor="confirmTitle">주문번호</label></th>
                                               <td colSpan="">
                                                   <input
                                                       type="text"
                                                   />
                                               </td>
                                                <th colSpan=""><label htmlFor="confirmTitle">작성일</label></th>
                                              <td colSpan="">
                                                  <input
                                                      type="text"
                                                  />
                                              </td>
                                               <th colSpan=""><label htmlFor="customerName">고객명</label></th>
                                               <td colSpan="">
                                                   <input

                                                       placeholder="필드 입력"
                                                   />
                                               </td>
                                               <th colSpan=""><label htmlFor="picName">담당자명</label></th>
                                               <td colSpan="">
                                                   <input
                                                       type="text"
                                                       name="employeeName"

                                                       placeholder="필드입력"
                                                   />
                                               </td>



                                           </tr>



                                           <tr>



                                               <th colSpan=""><label htmlFor="productType">상품종류</label></th>
                                               <td  colSpan="">
                                                   <select
                                                       name="productType"

                                                   >
                                                       <option value="도서">도서</option>
                                                       <option value="MD">MD</option>
                                                       <option value="기타">기타</option>
                                                   </select>
                                               </td>
                                               <th colSpan=""><label htmlFor="productName">상품명</label></th>
                                               <td colSpan="">
                                                   <input
                                                       type="text"
                                                       name="productName"

                                                       placeholder="필드 입력"
                                                   />
                                               </td>
                                               <th colSpan="" ><label htmlFor="qty">상품수량</label></th>
                                               <td colSpan="" >
                                                   <input
                                                       type="text"
                                                       name="orderQty"

                                                       placeholder="필드 입력"
                                                   />
                                               </td>
                                           </tr>
                                           <tr>
                                               <th colSpan=""><label htmlFor="customPrice">판매가</label></th>
                                               <td colSpan="">
                                                   <input
                                                       type="text"
                                                       name="customPrice"

                                                       placeholder="필드 입력"
                                                   />
                                               </td>
                                               <th colSpan=""><label htmlFor="totalAmount">총 금액</label></th>
                                               <td colSpan="">
                                                   <input
                                                       type="text"
                                                       name="totalAmount"

                                                       placeholder="필드 입력"
                                                   />
                                               </td>
                                               <th colSpan=""><label htmlFor="delDate">납품 요청일</label></th>
                                               <td colSpan="">
                                                   <input
                                                       type="date"
                                                       name="delDate"

                                                   />
                                               </td>
                                           </tr>


                                           </tbody>
                                       </table>

                                         <table className="formTable2">

                                           <tr >
                                               <th colSpan="1"><label htmlFor="approver">결재자</label></th>
                                               <td colSpan="3">
                                                   <input
                                                       type="text"
                                                       name="approver"

                                                       placeholder="필드 입력"
                                                   />
                                               </td>
                               <th colSpan="1"> <label htmlFor="approvalStatus">결재 여부</label> </th>

                                  <td colSpan="3">
                                     <select
                                         name="confirmStatus">
                                         <option value="pending">대기</option>
                                         <option value="approved">승인</option>
                                         <option value="rejected">반려</option>
                                     </select>
                                 </td>
                                 </tr>

                                           <tr>
                                           <th colSpan="1"><label htmlFor="remarks">반려사유</label></th>
                                              <td colSpan="8">
                                                  <textarea>  </textarea>
                                              </td>
                                           </tr>


                                         </table>





                                   </form>

                                   <div className="RegistFormList">
                                       <div style={{fontWeight: 'bold'}}> 총  건</div>
                                       <table className="formTableList">
                                           <thead>
                                           <tr>
                                               <th><input type="checkbox"
                                                          /></th>
                                               <th>No</th>
                                               <th>고객명</th>
                                               <th>상품 종류</th>
                                               <th>상품명</th>
                                               <th>상품 수량</th>
                                               <th>판매가</th>
                                               <th>총 금액</th>
                                               <th>납품 요청일</th>
                                               <th>담당자</th>
                                           </tr>
                                           </thead>
                                           <tbody>

                                           <tr style={{fontWeight: 'bold'}}>
                                               <td colSpan="8"> 합계</td>
                                               <td colSpan="2">

                                               </td>
                                           </tr>
                                           </tbody>
                                       </table>
                                       {showDelete && (
                                           <button className='delete-btn' onClick={handleDelete}>삭제</button>
                                       )}
                                   </div>
                               </div>
                           </div>
                       </div>

            )}


            </div>
                );
            }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Order />
);