import React from 'react';

const PriceTable = ({
    currentPage,
    amount,
                        price,
                        checkItem,
                        setCheckItem,
                        allCheck,
                        handleCheckboxChange,
                        handleMasterCheckboxChange,
                        handleModify,
                        handleAddClickDetail,
                        sortData,
                        sortConfig,
                        showDelete,
                        handleDelete
                    }) => {
    return (
        <table className="search-table" style={{marginTop: '50px'}}>
            {showDelete && <button className="delete-btn btn-common" onClick={handleDelete}>삭제</button>}
            <thead>
            <tr>
                <th>No.</th>
                <th>
                    등록일
                    <button className="sortBtn" onClick={() => sortData('registerDate')}>
                        {sortConfig.key === 'registerDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                    </button>
                </th>
                <th>
                    상품명
                    <button className="sortBtn" onClick={() => sortData('productNo')}>
                        {sortConfig.key === 'productNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                    </button>
                </th>
                <th>
                    업체명
                    <button className="sortBtn" onClick={() => sortData('customerNo')}>
                        {sortConfig.key === 'customerNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                    </button>
                </th>
                <th>
                    가격
                    <button className="sortBtn" onClick={() => sortData('customPrice')}>
                        {sortConfig.key === 'customPrice' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                    </button>
                </th>
                <th>
                    통화
                    <button className="sortBtn" onClick={() => sortData('currency')}>
                        {sortConfig.key === 'currency' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                    </button>
                </th>
                <th>
                    할인율(%)
                    <button className="sortBtn" onClick={() => sortData('discount')}>
                        {sortConfig.key === 'discount' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                    </button>
                </th>
                <th>
                    시작일
                    <button className="sortBtn" onClick={() => sortData('startDate')}>
                        {sortConfig.key === 'startDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                    </button>
                </th>
                <th>
                    종료일
                    <button className="sortBtn" onClick={() => sortData('endDate')}>
                        {sortConfig.key === 'endDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                    </button>
                </th>
            </tr>
            </thead>
            <tbody>
            {price.length > 0 ? (
                price.map((item, index) => (
                    <tr key={index} onDoubleClick={() => {
                        handleModify(item)
                    }}>
                        <td>{((currentPage-1)*amount) + index + 1}</td>
                        <td>{item.registerDate.substring(0, 10)}</td>
                        <td>
                            {item.productName}
                            <i className="bi bi-search details"
                               onClick={() => handleAddClickDetail('product', item.productNo)}/>
                        </td>
                        <td>
                            {item.customerName}
                            <i className="bi bi-search details"
                               onClick={() => handleAddClickDetail('customer', item.customerNo)}/>
                        </td>
                        <td>{item.customPrice}</td>
                        <td>{item.currency}</td>
                        <td>{item.discount}</td>
                        <td>{item.startDate}</td>
                        <td>{item.endDate}</td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="10">등록된 상품이 없습니다
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-emoji-tear" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path
                                d="M6.831 11.43A3.1 3.1 0 0 1 8 11.196c.916 0 1.607.408 2.25.826.212.138.424-.069.282-.277-.564-.83-1.558-2.049-2.532-2.049-.53 0-1.066.361-1.536.824q.126.27.232.535.069.174.135.373ZM6 11.333C6 12.253 5.328 13 4.5 13S3 12.254 3 11.333c0-.706.882-2.29 1.294-2.99a.238.238 0 0 1 .412 0c.412.7 1.294 2.284 1.294 2.99M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5m-1.5-3A.5.5 0 0 1 10 3c1.162 0 2.35.584 2.947 1.776a.5.5 0 1 1-.894.448C11.649 4.416 10.838 4 10 4a.5.5 0 0 1-.5-.5M7 3.5a.5.5 0 0 0-.5-.5c-1.162 0-2.35.584-2.947 1.776a.5.5 0 1 0 .894.448C4.851 4.416 5.662 4 6.5 4a.5.5 0 0 0 .5-.5"/>
                        </svg>
                    </td>
                </tr>
            )}
            <tr>
                <td colSpan="8"></td>
                <td colSpan="1"> {price.length} 건</td>
            </tr>
            </tbody>
        </table>
    );
};

export default PriceTable;
