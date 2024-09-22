import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom/client";
import './Order.css'
import './OrderRegist.css'
import './OrderModalDetail.css'
import useCheckboxManager from "../js/CheckboxManager";
import axios from 'axios';
import DetailOrderModal from './DetailOrderModal';
import ModifyOrderModal from './ModifyOrderModal';
import ModifyTempOrderModal from './ModifyTempOrderModal';
import Select from "react-select";
/*
import '../js/pagecssReal.css';
*/


function Order() {

    // 주문 데이터 및 체크박스 관리 상태
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager(setOrder);

    // 주문 목록에서의 체크박스 관리 상태
    const {
        allCheck: orderListAllCheck,
        checkItem: orderListCheckItem,
        handleMasterCheckboxChange: handleOrderListMasterCheckboxChange,
        handleCheckboxChange: handleOrderListCheckboxChange,
        setAllCheck: setAllCheckMal,
        setShowDelete: setShowDeleteMal,
        setCheckItem: setCheckItemMal
    } = useCheckboxManager(setOrder);

    // 추가 상품 리스트에 대한 체크박스 관리 상태
    const {
        allCheck: orderAddAllCheck,
        checkItem: orderAddCheckItem,
        showDelete: orderAddShowDelete,
        handleMasterCheckboxChange: handleOrderAddMasterCheckboxChange,
        handleCheckboxChange: handleOrderAddCheckboxChange,
        handleDelete: handleOrderAddDelete
    } = useCheckboxManager();

    // 주문 데이터를 저장하는 상태
    const [order, setOrder] = useState([]);
    console.log("order" + JSON.stringify(order));

    // 사용자 정보 상태
    const [userInfo, setUserInfo] = useState(null);

    // 사용자 정보 불러오기 함수
    const fetchUserInfo = async () => {
        const response = await axios.get('/employee/user-info', { withCredentials: true });
        setUserInfo(response.data);
    }

    // 주문 목록을 서버에서 불러오는 함수
    useEffect( () => {

        let effectOrder = async () => {
            try {
                let data = await fetch('/order/orderList').then(res => res.json());

                const transfomData = data.map(item => ({
                    orderNo: item.orderNo,
                    customerN: item.customer.customerName,
                    manager: item.employee.employeeName,
                    status: item.confirmStatus,
                    date: item.regDate,
                    managerId : item.employee.employeeId,
                    managerGrade : item.employee.authorityGrade
                }));

                setOrder(transfomData);
                console.log(transfomData);
            } catch (error) {
                console.error('error발생함 : ', error);
            }
        }

        effectOrder();


        // 결재자 리스트 불러오기
        const fetchConfirmerIdList = async () => {
            const response = await axios.get('/employee/user-info', { withCredentials: true });
            console.log(response);
            const {data} = await axios.get(`/order/getManagerList/${response.data.userId}`);
            console.log(data);
            setConfirmerIdList(data);// 결재자 리스트 상태에 저장
            setConfirmerIdOptions(
                data.map(manager => ({value:manager.employeeId, label: manager.employeeName+' / ' + manager.employeeEmail}))
            );
        };
        fetchConfirmerIdList();
    }, []);


    // --- 테이블 정렬 기능

    // 정렬 상태와 방향을 저장하는 상태
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });

    // 정렬 함수
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortOrder = [...order].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            // 날짜 처리
            if (key === 'date') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            // 문자열 비교
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'ascending'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }

            // 숫자 비교
            return direction === 'ascending'
            ? aValue - bValue
            : bValue - aValue;
        });

        setOrder(sortOrder);
        setSortConfig({ key, direction });
    };


    // --- 테이블 정렬 기능

    /*==============jsy조건 검색==============*/
    const [prod, setProd] = useState([]);
    const [mycustomer, setMycustomer] = useState([]);

    const [confirmState] = useState(['임시저장', '대기', '승인', '반려']);//결재상태배열
    const [selectedConfirm, setSelectedConfrim] = useState('');

    //상품명 목록 Data
    useEffect(() => {
        let effectProd = async () => {
            let getProd = await fetch('/product/products').then(res => res.json());
            setProd(getProd);
        }
        effectProd();
    }, []);

    //고객명 목록 data
    useEffect(() => {
        let effectCustomer = async () => {
            let getCustomer = await fetch('/customer/customerAll').then(res => res.json());
            setMycustomer(getCustomer);//주문필터
            setOrderCustomer(getCustomer);//주문등록폼
        }
        effectCustomer();
    }, []);


    //입력된 조건 데이터 보내기
    const [form, setForm] = useState({});

    const handleChange = (e) => {
        let copy = {...form, [e.target.id]: e.target.value};
        setForm(copy);
    }

    // 검색 버튼 클릭 시 서버로 검색 조건 전송
    const handleSearchBtn = async () => {
        //서버로 데이터 보내기
        const date = form.date || null;
        const orderNo = form.orderNo ? form.orderNo.replace(/\s+/g, '') : null;
        const prod = form.prod || null;
        const mycustomer = form.mycustomer|| null;
        const manager = form.manager ? form.manager.replace(/\s+/g, '') : null;
        const status = form.selectedConfirm|| null;

        const res = await axios.post('/order/searchSelect', {
            inputDate: date,
            inputOrderNo: orderNo,
            inputProdNo: prod,
            inputCustomerNo: mycustomer,
            inputManager: manager,
            inputState: status
        }); //{매개변수 : 전달 값}

        const searchOrderData = res.data; //이렇게 먼저 묶고 반복 돌려야함.

        if (Array.isArray(searchOrderData)) {
            const getSearchOrder = searchOrderData.map(item => ({ //res.data.map안된다는 소리
                orderNo: item.orderNo,
                customerN: item.customer.customerName,
                manager: item.employee.employeeName,
                status: item.confirmStatus,
                date: item.regDate,
               managerId : item.employee.employeeId,
                managerGrade : item.employee.authorityGrade
            }))

            setOrder(getSearchOrder);
        } else {
            console.log('서버로부터 받은 데이터가 배열이 아닙니다.', searchOrderData);
        }
    };


    // =========== 조회 입력 초기화 ===========
    const handleReset = () => {
        setForm({
            inputDate: '',
            inputOrderNo: '',
            inputProdNo: '',
            inputCustomerNo: '',
            inputManager: '',
            inputState: ''
        })

        handleSearchBtn(); // 리셋 후 검색 기능 호출
    }

    

    /*---------------jsy조건 끝---------------*/

    /*==============jsy주문 등록 폼==============*/

    const [orderCustomer, setOrderCustomer] = useState([]);//고객번호목록
    const [registCustomer, setRegistCustomer] = useState(''); //선택된 고객명 저장
    const [customPrice, setCustomPrice] = useState([]);//판매가리스트
    const [addCheckProd, setAddCheckProd] = useState([]); //체크한 상품 추가된 리스트
    const [delDate, setDelDate] = useState('');//납품요청일 상태관리

    // 납품 요청일 변경 시 상태 업데이트
    const handleDateChange = (e) => {
        setDelDate(e.target.value);



        setAddCheckProd([]); //추가리스트 초기화
    }

    // 고객명 변경 시 고객번호 저장
    const handleCustomerChange = (e) => {
        setRegistCustomer(e.target.value);
        //목록 호출하는게 customoPrice임 ㅇㄴ

        setAddCheckProd([]); //추가리스트 초기화
        setCustomPrice([]); //판매가리스트 초기화
        setQuantities({}); //수량 초기화
    };



    // 세션 정보 가져오기
    const [my, setMy]= useState({id: '', name: '', role:''});
    const [roleList, setRoleList] = useState([]);
    console.log("ㅋㅋ글쓴이 값이야 " +  order.managerId);
    console.log("ㅋㅋ세션값이야" + JSON.stringify(my));
    //담당자명 세션에서 불러오기
    useEffect(() => {

        fetchData();
    }, []);

     const fetchData = async () => {
            try {
                // 세션에서 ID 가져오기
                const idRes = await axios.get('/order/getMyId');
                const myId = idRes.data;

                // 이름 가져오기
                const nameRes = await axios.post('/order/getMyName', { myId }); // 객체로 전달
                 const RoleRes = await axios.get('/order/getMyRole'); // 권한 가져오기


                const response = await axios.get(`/order/getManagerList/${myId}`);

                const data = response.data; // Assuming response.data contains the list
                   console.log(data);
                    // employeeId와 authorityGrade만 추출
                    const filteredList = data.map(data => ({
                        employeeId: data.employeeId,
                        authorityGrade: data.authorityGrade,
                    }));

                    setRoleList(filteredList);
                    console.log("Role List" + roleList.employeeId);
                    console.log("Role List" + roleList.employeeId);




                setMy({ id: myId, name: nameRes.data , role : RoleRes.data});
            } catch (error) {
                console.error('Error', error);
            }
        };






    // 고객이 선택되면 상품+판매가를 가져오는 함수
    useEffect(() => {
        console.log("zz",delDate);

        const now = new Date();
        if(new Date(delDate) < now){
            alert("납품요청일을 확인해주십시오.")
            return setDelDate('');
        }

        if (registCustomer) {
            const fetchPrice = async () => {
                try {
                    const resp = await axios.post('/order/getPrice', {
                        inputOrderCustomerNo: parseInt(registCustomer, 10),
                        inputOrderDelDate: delDate || null
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
                            saleEnd: value.endDate,
                            priceNo: value.priceNo
                        }));
                        setCustomPrice(getOrderCustomer);
                    } else {
                        console.error('등록폼 에러', OrderCustomerData);
                    }
                } catch (error) {
                    console.error('API 호출 오류', error);
                }
            };
            fetchPrice();
        } else {
            setCustomPrice([]); // 고객이 없을 때만 초기화
        }
    }, [registCustomer, delDate]); // registCustomer가 변경될 때만 실행


    //추가 클릭
    const handleAddProd = () => {


        if(!delDate){
            alert("납품요청일을 입력해주십시오.");
            return;
        }
        setAddCheckProd(prevAddCheckProd => {
            // 기존 addCheckProd에서 priceNo만 Set에 저장
            const existingPriceNos = new Set(prevAddCheckProd.map(item => item.priceNo));

            const newCheckProd = [];//중복 아닌 것들만 담을 용도

            let hasDuplicates = false; //중복확인

            if (orderListAllCheck) { // 체크 전체선택
                for (const element of customPrice) {
                    const {prodNo, prodCat, prodName, salePrice, saleStart, saleEnd, priceNo} = element; // 필요한 값 추출

                    //existingPriceNos에 priceNo 유무
                    if (existingPriceNos.has(priceNo)) { //중복
                        hasDuplicates = true;
                    } else { //중복 아닌 항목은 newCheckProd에 추가
                        newCheckProd.push({ prodNo, prodCat, prodName, salePrice, saleStart, saleEnd, priceNo });
                        existingPriceNos.add(priceNo); // Set에도 추가하여 중복 방지
                    }
                }
            } else {
                // 체크된 항목만 처리
                Object.keys(orderListCheckItem).forEach(index => {
                    if (orderListCheckItem[index]) {
                        const item = customPrice[index]; // 인덱스로 항목 찾기
                        if (item && !existingPriceNos.has(item.priceNo)) {
                            newCheckProd.push(item);
                            existingPriceNos.add(item.priceNo);
                        } else {
                            hasDuplicates = true;
                        }
                    }
                });
            }

            // 중복 항목이 있었으면 알림을 띄움
            if (hasDuplicates) {
                alert("이미 추가된 항목이 있습니다.");
            }

            // 새로운 항목만 addCheckProd에 추가
            return [...prevAddCheckProd, ...newCheckProd];
        });
    };

    //상품 수량
    const [quantities, setQuantities] = useState({});
    const handleQuantityChange = (index) => (e) => {
        const qty = Number(e.target.value) || 0;
        setQuantities(prevQuantities => ({ ...prevQuantities, [index]: qty }));
    };



    //등록하기 & 임시저장
    const handleRegistOrder = async (orderStatus) => {

        console.log(modifyItem.status);
        try {

            //데이터 유효성 검사(등록하기)
            if (orderStatus === "대기") {
                const hasInvalidQty = addCheckProd.some((_, index) => {
                    console.log("qty: ", quantities);
                    const qty = quantities[index] || 0;
                    return qty <= 0;
                });

                if (!registCustomer || !delDate || hasInvalidQty || !addCheckProd.length) {
                    alert("모두 입력해 주세요.");
                    return;
                }
            }

            //추가된 리스트 반복 돌리기
            const orderBList = addCheckProd.map((addProd, index) => {
                const orderProdNo = addProd.prodNo || 0; // 상품번호
                const orderPriceNo = addProd.priceNo || 0; // 판매가 번호
                const orderProdQty = quantities[index] || 0; // 각 상품에 맞는 수량 가져오기
                const orderProdTotal = orderProdQty * addProd.salePrice; // 수량 * 판매가

                return {
                    productNo: orderProdNo,
                    priceNo: orderPriceNo,
                    orderProductQty: orderProdQty,
                    prodTotal: orderProdTotal
                };
            });

            const response = await axios.post('/order/registOrder',{ // insert into oh
                inputDelDate: delDate || null,//납품요청일
                inputCustomerNo: registCustomer || null,//주문고객번호
                inputManager: my.id || null, //임의 값(로그인 시 해당 직원id 기입할 예정)
                inputConfirmer: modifyItem.confirmerId || null, //임의 값
                inputStatus: orderStatus,
                orderBList //ob데이터 배열 전달
            });

            const orderNo = response.data; // 서버에서 받은 주문 번호
            handleCloseClick(); // 등록 창 닫기 및 초기화

            if(orderStatus === "대기"){
                alert(`주문번호 ${orderNo} 등록이 완료되었습니다.`);
            }else{
                alert(`주문번호 ${orderNo} 임시저장되었습니다.`);
            }
        } catch (error) {
            console.error("주문등록 중 오류발생", error);
        }
    };

    //주문등록 - 상품검색
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const searchProd = customPrice.filter(product =>
        product.prodName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 추가리스트 체크 삭제
    const handleAddProdDelete = () => {
        setAddCheckProd(prevAddCheckProd => {
            let newAddCheckProd = prevAddCheckProd;

            if(!orderAddAllCheck){

                const checkedIndexes = Object.keys(orderAddCheckItem).filter(key => orderAddCheckItem[key]);//체크된 항목의 인덱스를 추출

                const checkedPriceNos = checkedIndexes.map(index => prevAddCheckProd[index].priceNo);//해당 인덱스의 priceNo를 추출

                const newAddCheckProd = prevAddCheckProd.filter(item => !checkedPriceNos.includes(item.priceNo)); //체크 안한 것만 남기기

                return newAddCheckProd; //개별 삭제 후 반환

            }else {
                if(addCheckProd.length > 0){
                    return []; //전체 삭제
                }else{
                    alert(`삭제할 항목이 없습니다.`);
                    return prevAddCheckProd; //이전 상태 유지
                }
            }

        });
    };



    /*---------------jsy주문 등록 끝---------------*/


    // ---  모달창 띄우는 스크립트

    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

    const handleAddClickCSV = () => {
        setIsVisibleCSV((prevState) => !prevState);
    };

    // 주문 등록 모달 상태
    const [isVisible, setIsVisible] = useState(false);

    const handleAddClick = () => {
        setIsVisible(true);
    };


    const handleCloseClick = () => {
        setCheckItemMal(false);
        setShowDeleteMal(false);
        setAllCheckMal(false);
        setIsVisible(false);
        setRegistCustomer(''); //고객선택 초기화
        setDelDate(''); //납품요청일 초기화
        setAddCheckProd([]); //추가리스트 초기화
    };

    // 수정 모달 상태 관리
    const [modifyItem, setModifyItem] = useState({
        orderNo: 0,
        title: '',
        details: '',
        manager: '',
        status: '',
        date: '',
        confirmerId: ''
    });


    // 상세보기 모달 상태 관리
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
    const [isModifyTempOrderModalOpen, setIsModifyTempOrderModalOpen] = useState(false);
    const [selectedOrderNo, setSelectedOrderNo] = useState(null);
    const [selectedOrderData, setSelectedOrderData] = useState(null);

    // 주문 상세보기 열기
    const handleDetailView = (orderNo) => {
        setSelectedOrderNo(orderNo);  // 주문 번호 설정
        setIsDetailModalVisible(true);  // 모달 열기
    };

    const handleModifyCloseClick = () => {
        setIsDetailModalVisible(false);
    };

    // 주문 수정 모달 열기
    const handleOpenModifyModal = (orderData) => {
        setSelectedOrderData(orderData);
        setIsDetailModalVisible(false); // 상세 조회 모달 닫기
        setIsModifyModalVisible(true); // 수정 모달 열기
    };

    const handleCloseModifyModal = () => {
        setIsModifyModalVisible(false);
    };

    // 임시 저장 모달 열기
    const handleOpenModifyTempOrderModal = (orderData) => {
        setSelectedOrderData(orderData);
        setIsModifyTempOrderModalOpen(true);
        setIsDetailModalVisible(false);
    };

    const handleCloseModifyTempOrderModal = () => {
        setIsModifyTempOrderModalOpen(false);
    };

    // 유선화 - 끝

    // --- 모달창 띄우는 스크립트

    // 수정된 주문 데이터 업데이트
    const handleOrderUpdate = (updatedOrder) => {
        // 수정된 주문 데이터를 반영하여 상태 업데이트
        setOrder(prevOrders => {
            const updatedOrders = prevOrders.map(order =>
                order.orderNo === updatedOrder.orderNo ? updatedOrder : order
            );
            return updatedOrders;
        });

        // 상세보기 모달에 수정된 데이터를 반영
        setSelectedOrderData(updatedOrder); // 이 부분을 추가하여 상세보기 모달에 수정된 데이터를 전달

        // 최신 데이터를 다시 불러오기
        fetchData();  // 서버에서 새로운 데이터를 가져오는 함수 (선택사항)

        // 모달 상태 업데이트 (일반 주문 수정과 임시 저장 구분)
        if (updatedOrder.confirmStatus.trim() === '임시저장') {
            setIsModifyTempOrderModalOpen(false);  // 임시 저장 모달 닫기
        } else {
            setIsModifyModalVisible(false);  // 일반 주문 수정 모달 닫기
        }

        setIsDetailModalVisible(true);  // 상세보기 모달 다시 열기

    };

    // 결재자 ID 리스트 상태
    const [confirmerIdList, setConfirmerIdList] = useState([]);
    const [confirmerIdOptions, setConfirmerIdOptions] = useState();
    const [confirmerName, setConfirmerName] = useState(''); //선택한 결재자 이름

    // 결재자 변경 처리
    const handleManagerChange = (name, value) => {
        setModifyItem((prev) => ({ ...prev, [name]: value }));
    }

/*    useEffect(() => {
        const selectedConfirmer = confirmerIdList.find(emp => emp.employeeId === modifyItem.confirmerId);
        if (selectedConfirmer) {
            setConfirmerName(selectedConfirmer.employeeName);
        } else {
            setConfirmerName(''); // 선택된 결재자가 없을 경우 빈 문자열로 설정
        }
        console.log("Selected confirmer name: ", confirmerName);
    }, [modifyItem.confirmerId]); // confirmerIdList도 의존성에 추가*/




    // =============================================== 페이지 네이션



    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // 페이지당 항목 수

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(order.length / itemsPerPage);

    // 현재 페이지에 맞는 데이터 필터링
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = order.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {

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

   const roleHierarchy = { S: 4, A: 3, B: 2, C: 1, D: 0 }; // Define the hierarchy

   const handleButtonClick = (item) => {
       const trimmedStatus = item.status.trim();
       const isManager = my.id === item.managerId;

       switch (trimmedStatus) {
           case '승인':
               console.log('승인 다 볼수있엉');
               handleDetailView(item.orderNo);
               break;
           case '대기':
               console.log('대기');
                  console.log(roleHierarchy[my.role]);
                              console.log(roleHierarchy[item.managerGrade]);
               if (roleHierarchy[my.role] > roleHierarchy[item.managerGrade] || isManager) {
                   console.log("Access granted for 대기");
                   handleDetailView(item.orderNo);
               } else {
                   alert("접근 권한이 없습니다.");
               }
               break;
           case '임시저장':
               console.log('임시저장');
               if (isManager) {
                   handleDetailView(item.orderNo);
               } else {
                   alert("접근 권한이 없습니다.");
               }
               break;
           case '반려':
               console.log('반려');
               console.log(roleHierarchy[my.role]);
               console.log(roleHierarchy[item.managerGrade]);
               if ((roleHierarchy[my.role] > roleHierarchy[item.managerGrade])  || isManager) {
                   handleDetailView(item.orderNo);
               } else {
                  alert("접근 권한이 없습니다.");
               }
               break;
           default:
               console.log('Unknown status');
               break;
       }
   };








    return (
        <div>

            <div className="pageHeader"><h1><i className="bi bi-chat-square-text-fill"></i> 주문 관리</h1></div>

            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="date">등록 일자</label>
                                <input className="filter-input" type="date" id="date" value={form.date || ''}
                                       onChange={handleChange} onKeyDown={(e) => { if(e.key ==="Enter") {handleSearchBtn();} }} required/>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="orderNo">주문 번호</label>
                                <input className="filter-input" type="text" id="orderNo" value={form.orderNo || ''}
                                       onChange={handleChange} onKeyDown={(e) => { if(e.key ==="Enter") {handleSearchBtn();} }} placeholder="주문 번호" required/>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="mycustomer">고객 명</label>
                                <select id="mycustomer" className="filter-input" value={form.mycustomer || ''}
                                        onChange={handleChange}>
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
                                <input className="filter-input" type="text" id="manager" value={form.manager || ''}
                                       onChange={handleChange} onKeyDown={(e) => { if(e.key ==="Enter") {handleSearchBtn();} }} placeholder="담당자명" required/>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="prod">상품명</label>
                                <select id="prod" className="filter-input" value={form.prod || ''}
                                        onChange={handleChange}>
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
                                <select className="filter-select" id="selectedConfirm"
                                        value={form.selectedConfirm || ''} onChange={handleChange}>
                                    <option value="">전체</option>
                                    {confirmState.map(state => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>


                        </div>
                    </div>
                    <div className="button-container">
                        <button type="button" className="reset-btn" onClick={handleReset}>  {/* 조회 입력값 초기화 버튼입니다! */}
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                        <button type="button" className="search-btn" id="searchOrder" onClick={handleSearchBtn}>
                            <i className="bi bi-search search-icon"></i>
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
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => {
                            const globalIndex = indexOfFirstItem + index + 1; // +1은 1부터 시작하기 위함

                            return (


                              <tr
                                  key={item.orderNo}
                                  className={checkItem[index + 1] ? 'selected-row' : ''}
                     /*             onDoubleClick={() => {
                                      if (roleHierarchy[item.managerGrade] > roleHierarchy[my.role] || my.id === item.managerId) {
                                          handleDetailView(item.orderNo); // 상세보기 모달 열기
                                      } else {
                                          alert("Access denied: Your role is not high enough."); // Optional alert for access denial
                                      }
                                  }}*/
                              >
                                  <td>{globalIndex}</td> {/* 전역 인덱스 사용 */}
                                  <td>{item.orderNo}</td>
                                  <td className="ellipsis">{item.manager}</td>
                                  <td className="ellipsis">{item.customerN}</td>
                                 {/* <td className="ellipsis" >{item.managerGrade}</td>*/}
                                  <td>{item.status}</td>
                                  <td>
                                      {new Date(item.date).toLocaleDateString('ko-KR', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit'
                                      }).replace(/\./g, '-').replace(/-$/, '')}
                                  </td>
                                  <td>
                             <button className="btn-common" onClick={() => handleButtonClick(item)}>
                                   상세보기
                               </button>
                                  </td>
                              </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7">등록된 주문이 없습니다😭</td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan="6"></td>
                        <td colSpan="1">{order.length} 건</td>
                    </tr>
                    </tbody>




                </table>



            </div>

            <div className="pagination">
                {renderPageNumbers()}
            </div>




            {/* 여기 아래는 모달이다. */}

            {/*jsy 주문등록 모달창 시작*/}
            {isVisible && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div className="form-header">
                                <h1>주문 등록</h1>

                                <div className="btns">
                                    <div className="btn-add2">
                                        {/* 임시 저장 버튼 */}
                                        <button type="button" onClick={() => {handleRegistOrder("임시저장");}}>
                                            임시 저장
                                            </button>

                                    </div>
                                    <div className="btn-add2">
                                        {/* 등록하기 버튼 */}
                                        <button type="button" onClick={() => {handleRegistOrder("대기"); }} >
                                            등록하기
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/*주문정보-헤더*/}
                            <div className="RegistForm">
                                <table className="formTable">
                                    <tbody>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="orderCustomer">고객사 명</label></th>
                                        <td colSpan="3">
                                            <select id="orderCustomer" value={registCustomer || ''} onChange={handleCustomerChange}>
                                                <option value="">선택</option>
                                                {orderCustomer.map(customer => (
                                                    <option key={customer.customerNo} value={customer.customerNo}>
                                                        {customer.customerName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <th colSpan="1"><label htmlFor="delDate">납품 요청일</label></th>
                                        <td colSpan="3"><input type="date" id="delDate" value={delDate} onChange={handleDateChange} /></td>
                                    </tr>

                                    <tr>
                                        <th colSpan="1"><label htmlFor="">담당자명</label></th>
                                        <td colSpan="3"><input type="text" id="" value={my.name} style={{border: 'none', background: 'white'}} /></td>

                                        <th colSpan="1"><label htmlFor="">결재자</label></th>
                                        <td colSpan="3">
                                            <Select name="confirmerId" options={confirmerIdOptions} placeholder="결재자 선택"
                                                    onChange={(option) => handleManagerChange('confirmerId', option.value)} />
                                        </td>

                                    </tr>

                                    </tbody>
                                </table>

                            </div>

                            <div className="bookSearchBox">
                                <div className="bookSearch">
                                    <input type="text"/>
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

                            {/*주문 가능한 상품 리스트*/}
                            <div className="RegistFormList">
                                <div style={{fontWeight: 'bold'}}> 총 {searchProd?.length || 0} 건</div>
                                <table className="formTableList">
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox" checked={orderListAllCheck} onChange={(e) => handleOrderListMasterCheckboxChange(e)}/></th>
                                        <th>no</th>
                                        <th>상품 코드</th>
                                        <th>상품 명</th>
                                        <th>저자</th>
                                        <th>판매가</th>
                                        <th>판매 기간</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {searchProd.map((prodList, index) => (
                                        <tr key={index} className={orderListCheckItem[index] ? 'selected-row' : ''}>
                                            <td><input type="checkbox" id="checkProdList" checked={orderListCheckItem[index] || false } onChange={(e) => handleOrderListCheckboxChange(e)}/></td>
                                            <td style={{display: 'none'}}>{index}</td>
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

                            {/*담아둔 상품 리스트*/}
                            <div className="RegistFormList">

                                <div style={{fontWeight: 'bold'}}> 총 {addCheckProd?.length || 0} 건</div>
                                {orderAddShowDelete && Object.values(orderAddCheckItem).some(isChecked => isChecked) &&
                                    <button className="delete-btn btn-common" onClick={() => {handleAddProdDelete(); handleOrderAddDelete();}}>삭제</button>}

                                <table className="formTableList" style={{marginTop: '5px'}}>

                                    <thead>
                                    <tr>
                                        <th><input type="checkbox" checked={orderAddAllCheck} onChange={(e)=>handleOrderAddMasterCheckboxChange(e)}/></th>
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
                                        console.log(`렌더링 중: 상품명 = ${addProd.prodName}, 수량 = ${quantities[index] || 0}`);
                                        const qty = quantities[index] || 0; // index에 맞는 수량 가져옴
                                        return (
                                            <tr key={index} className={orderAddCheckItem[index] ? 'selected-row' : ''}>
                                                <td><input type="checkbox" id="checkProdList"
                                                           checked={orderAddCheckItem[index] || false}
                                                           onChange={(e) => handleOrderAddCheckboxChange(e)}/></td>
                                                <td style={{display: 'none'}}>{index}</td>
                                                <td>{index + 1}</td>
                                                <td>{addProd.prodCat}</td>
                                                <td>{addProd.prodName}</td>
                                                <td>
                                                    <input type="number" id={`prodQty_${index}`} value={qty}
                                                           onChange={handleQuantityChange(index)} placeholder="수량"/>
                                                </td>
                                                <td>{addProd.salePrice * qty}</td>
                                                <td>{addProd.saleStart}</td>
                                                <td>{addProd.saleEnd}</td>
                                            </tr>
                                        );
                                    })}
                                    <tr style={{fontWeight: 'bold'}}>
                                        <td colSpan="5"> 합계</td>
                                        <td colSpan="3">
                                            {addCheckProd.reduce((total, addProd, index) => {
                                                const qty = quantities[index] || 0; //수량
                                                return total + (addProd.salePrice * qty);
                                            },0).toLocaleString()}원 {/*toLocaleString() : 숫자를 천 단위로 구분하고, 통화 기호 추가*/}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>


                        </div>


                    </div>
                </div>

            )}
            {/* 모달창의 끝  */}

            {/* 상세보기 모달 */}
            {isDetailModalVisible && (
                <DetailOrderModal
                    orderNo={selectedOrderNo}
                    isOpen={isDetailModalVisible}
                    onClose={handleModifyCloseClick}
                    onOpenModifyModal={handleOpenModifyModal}
                    fetchData={fetchData}
                      my={my}
                    roleHierarchy={roleHierarchy}
                    onOpenModifyTempOrderModal={handleOpenModifyTempOrderModal}
                />
            )}

            {/*수정 모달*/}
            {isModifyModalVisible && (
                <ModifyOrderModal
                    orderData={selectedOrderData}
                    isOpen={isModifyModalVisible}
                    onClose={handleCloseModifyModal}
                    onUpdate={handleOrderUpdate}
                />
            )}

            {/* 임시 저장 전용 수정 모달 */}
            {isModifyTempOrderModalOpen && (
                <ModifyTempOrderModal
                    orderNo={selectedOrderData.orderNo}
                    isOpen={isModifyTempOrderModalOpen}
                    onClose={handleCloseModifyTempOrderModal}
                    fetchData={fetchData}
                    onUpdate={handleOrderUpdate}
                />
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Order/>
);