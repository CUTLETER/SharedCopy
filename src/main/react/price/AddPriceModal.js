import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Price.css';
import '../js/modalAdd.css';

const AddPriceModal = ({
                           isVisible,
                           setIsVisible,
                           product,
                           customer,
                           fetchData,
                           handleCloseClick
                       }) => {

    // 전 세계 주요 화폐 코드 및 이름 목록
    const currencyOptions = [
        { value: 'USD', label: 'United States Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
        { value: 'JPY', label: 'Japanese Yen (JPY)' },
        { value: 'GBP', label: 'British Pound Sterling (GBP)' },
        { value: 'AUD', label: 'Australian Dollar (AUD)' },
        { value: 'CAD', label: 'Canadian Dollar (CAD)' },
        { value: 'CHF', label: 'Swiss Franc (CHF)' },
        { value: 'CNY', label: 'Chinese Yuan (CNY)' },
        { value: 'SEK', label: 'Swedish Krona (SEK)' },
        { value: 'NZD', label: 'New Zealand Dollar (NZD)' },
        { value: 'KRW', label: 'South Korean Won (KRW)' },
    ];
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    const [productPrice, setProductPrice] = useState(null);

    const handleChange = (selectedOption) => {
        handleInsertPrice('currency', selectedOption.value);
        setSelectedCurrency(selectedOption);
    };

    const [insertPrice, setInsertPrice] = useState({
        productNo: '',
        customerNo: '',
        customPrice: '',
        currency: '',
        discount: '',
        startDate: '',
        endDate: ''
    });

    const handleInsertPrice = (name, value) => {
        setInsertPrice((prev) => ({...prev, [name]: value}));
    }

    const handleRegister = async () => {
        if (insertPrice.productNo === '') {
            alert('제품을 선택해 주세요.');
            return;
        }
        if (insertPrice.customerNo === '') {
            alert('고객을 선택해 주세요.');
            return;
        }
        if (insertPrice.customPrice === '') {
            alert('가격을 입력해 주세요.');
            return;
        }
        if (insertPrice.currency === '') {
            alert('화폐 통화를 입력해 주세요.');
            return;
        }
        if (insertPrice.startDate === '') {
            alert('판매가 적용 시작일을 선택해 주세요.');
            return;
        }
        if (insertPrice.endDate === '') {
            alert('판매가 적용 기한을 선택해 주세요.');
            return;
        }

        console.log(insertPrice);

        try {
            await axios.post('/price/register', insertPrice, {
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            fetchData();
            alert('등록 되었습니다');

            handleCloseClickModal();
        } catch (error) {
            console.error('등록 중 오류 발생:', error);
        }
    };

    const productOptions = product.map(prod => ({
        value: prod.productNo,
        label: prod.productName
    }));

    const customerOptions = customer.map(cust => ({
        value: cust.customerNo,
        label: cust.customerName
    }));

    const handleCustomPriceChange = (customPrice) => {
        let discount = customPrice === productPrice || customPrice === 0 ? 0 : Math.round((productPrice - customPrice) / productPrice * 100);
        setInsertPrice((prev) => ({...prev, customPrice: customPrice, discount: discount}));

        // setInsertPrice((prev) => ({...prev, discount: discount}));
    }

    const handleDiscountChange = (discount) => {
        let price = discount === '' ? productPrice : Math.round(productPrice * ((100 - discount) / 100));
        setInsertPrice((prev) => ({...prev, discount: discount, customPrice: price}));
    }

    const handleProductChange = async (value) => {
        setInsertPrice((prev) => ({...prev, productNo: value}));
        let price = await getProductPrice(value);
        setProductPrice(price);
        handleCustomPriceChange(price);
    }

    useEffect(() => {
        if (productPrice !== null) {
            handleCustomPriceChange(productPrice);
        }
    }, [productPrice]);

    const getProductPrice = async (productNo) => {
        let {data} = await axios.get('/product/getProduct?productNo=' + productNo);
        console.log(data);

        setProductPrice(data.productPrice);
        return data.productPrice;
    }

    const handleCloseClickModal = () => {
        setInsertPrice({
            productNo: '',
            customerNo: '',
            customPrice: '',
            currency: '',
            discount: '',
            startDate: '',
            endDate: ''
        });
        setSelectedCurrency(null);
        setProductPrice(null);
        handleCloseClick();
    }

    return (isVisible &&
        <div className="confirmRegist">
            <div className="fullBody">
                <div className="form-container">
                    <button className="close-btn" onClick={handleCloseClickModal}> &times;
                    </button>
                    <div className="form-header">
                        <h1>고객 별 제품 판매가 등록</h1>

                        <div className="btns">
                            <div className="btn-add2">
                                <button onClick={handleRegister}>등록하기</button>
                            </div>
                        </div>
                    </div>

                    <div className="RegistForm">
                        <table className="formTable">
                            <thead>
                            <tr>
                                <th colSpan="1"><label htmlFor="registProductNo">상품</label></th>
                                <td colSpan="3">
                                    <Select
                                        name="productNo"
                                        options={productOptions}
                                        placeholder="상품 선택"
                                        onChange={(option) => {handleProductChange(option.value)}}
                                    />
                                </td>

                                <th colSpan="1"><label htmlFor="registCustomerNo">고객</label></th>
                                <td colSpan="3">
                                    <Select
                                        name="customerNo"
                                        options={customerOptions}
                                        placeholder="고객 선택"
                                        onChange={(option) => handleInsertPrice('customerNo', option.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th><label htmlFor="registCustomPrice">가격</label></th>
                                <td><input name="customPrice" type="number" placeholder="필드 입력"
                                           id="registCustomPrice"
                                           value={insertPrice.customPrice} onChange={(e) => {
                                    handleCustomPriceChange(e.target.value)
                                }}/></td>

                                <th><label htmlFor="registDiscount">할인율(%)</label></th>
                                <td><input name="discount" type="number" placeholder="필드 입력" id="registDiscount"
                                           value={insertPrice.discount} onChange={(e) => {
                                    handleDiscountChange(e.target.value)
                                }}/></td>

                                <th><label htmlFor="registCurrency">통화</label></th>
                                <td>
                                    <Select
                                        id="registCurrency"
                                        value={selectedCurrency}
                                        onChange={handleChange}
                                        options={currencyOptions}
                                        placeholder="화폐 통화 선택"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th colSpan="1"><label htmlFor="registStartDate">시작일</label></th>
                                <td colSpan="3"><input name="startDate" type="date" placeholder="필드 입력"
                                                       id="registStartDate"
                                                       value={insertPrice.startDate} onChange={(e) => {
                                    handleInsertPrice('startDate', e.target.value)
                                }}/></td>

                                <th colSpan="1"><label htmlFor="registEndDate">종료일</label></th>
                                <td colSpan="3"><input name="endDate" type="date" placeholder="필드 입력"
                                                       id="registEndDate"
                                                       value={insertPrice.endDate} onChange={(e) => {
                                    handleInsertPrice('endDate', e.target.value)
                                }}/></td>
                            </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPriceModal;
