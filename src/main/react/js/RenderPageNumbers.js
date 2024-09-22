import React, { useState, useEffect, useCallback } from "react";
import './RenderPageNumbers.css';

const RenderPageNumbers = ({
                               onPageChange,
                               setAllCheckMain,
                               setCheckItemMain,
                               setShowDeleteMain,
                               setCurrentPage,
                               currentPage,
                               totalPages
                           }) => {
    const [pageNumbers, setPageNumbers] = useState([]);
    const maxButtons = 5 < totalPages ? 5 : totalPages; // 고정된 버튼 수

    // handlePageChange를 useCallback으로 감싸서 메모이제이션
    const handlePageChange = useCallback((pageNumber) => {
        console.log(pageNumber);
        onPageChange(pageNumber);
        setAllCheckMain(false);
        setCheckItemMain(false);
        setShowDeleteMain(false);
        setCurrentPage(pageNumber);
    }, [onPageChange, setAllCheckMain, setCheckItemMain, setShowDeleteMain, setCurrentPage]);

    useEffect(() => {
        const newPageNumbers = [];

        // 맨 처음 페이지 버튼
        newPageNumbers.push(
            <span
                key="first"
                onClick={() => handlePageChange(1)}
                className={`pagination_link ${currentPage === 1 ? 'disabled' : ''}`}
            >
                &laquo;&laquo;
            </span>
        );

        // 이전 페이지 버튼
        newPageNumbers.push(
            <span
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                className={`pagination_link ${currentPage === 1 ? 'disabled' : ''}`}
            >
                &laquo;
            </span>
        );

        // 중간 페이지 버튼
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = startPage + maxButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            newPageNumbers.push(
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
            newPageNumbers.push(<span key="dots" className="pagination_link">...</span>);
            newPageNumbers.push(
                <span
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="pagination_link"
                >
                    {totalPages}
                </span>
            );
        }

        // 다음 페이지 버튼
        newPageNumbers.push(
            <span
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                className={`pagination_link ${currentPage === totalPages ? 'disabled' : ''}`}
            >
                &raquo;
            </span>
        );

        // 맨 마지막 페이지 버튼
        newPageNumbers.push(
            <span
                key="last"
                onClick={() => handlePageChange(totalPages)}
                className={`pagination_link ${currentPage === totalPages ? 'disabled' : ''}`}
            >
                &raquo;&raquo;
            </span>
        );

        // 페이지 번호 배열을 업데이트
        setPageNumbers(newPageNumbers);
    }, [currentPage, totalPages, handlePageChange]);  // 의존성 배열: currentPage와 totalPages가 변경될 때만 실행

    return <div className="pagination">{pageNumbers}</div>;
};

export default RenderPageNumbers;
