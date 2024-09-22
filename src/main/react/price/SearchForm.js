import React from 'react';

const SearchForm = ({ searchPrice, setSearchPrice, product, customer, handleSearchBtn, handleSearchResetBtn }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchPrice((prev) => ({ ...prev, [name]: value }));
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleSearchBtn();
        }
    }

    return (
        <div className="main-container">
            <div className="filter-containers">
                <div className="filter-container">
                    <div className="filter-items">
                        {/* Product Filter */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="product">상품</label>
                            <input
                                name="productName"
                                className="filter-label"
                                type="text"
                                list="productDataList"
                                id="product"
                                placeholder="상품"
                                onKeyUp={handleKeyUp}
                                onChange={handleInputChange}
                            />
                            <datalist id="productDataList">
                                {product.map((item) => (
                                    <option value={item.productName} key={item.productNo}></option>
                                ))}
                            </datalist>
                        </div>

                        {/* Customer Filter */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="customer">업체</label>
                            <input
                                name="customerName"
                                className="filter-label"
                                type="text"
                                list="customerDataList"
                                id="customer"
                                placeholder="고객"
                                onChange={handleInputChange}
                            />
                            <datalist id="customerDataList">
                                {customer.map((item) => (
                                    <option value={item.customerName} key={item.customerNo}></option>
                                ))}
                            </datalist>
                        </div>

                        {/* Date Filters */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="registerDate">등록일자</label>
                            <input
                                name="registerDate"
                                className="filter-input"
                                type="date"
                                id="registerDate"
                                value={searchPrice.registerDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="filter-item">
                            <label className="filter-label" htmlFor="startDate">시작일자</label>
                            <input
                                name="startDate"
                                className="filter-input"
                                type="date"
                                id="startDate"
                                value={searchPrice.startDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="filter-item">
                            <label className="filter-label" htmlFor="endDate">종료일자</label>
                            <input
                                name="endDate"
                                className="filter-input"
                                type="date"
                                id="endDate"
                                value={searchPrice.endDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="button-container">
                    {/* <button type="button" className="reset-btn" onClick={handleReset}> //입력값 초기화 버튼입니다! 
                        <i class="bi bi-arrow-clockwise"></i>
                    </button> */}
                    <button type="button" className="search-btn" onClick={handleSearchBtn}>
                        <i className="bi bi-search search-icon"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchForm;
