// Pagination.js
import React from "react";
import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import './Pagination.css';

const Pagination = ({ pageCount, onPageChange, currentPage, total }) => {
    return (
        <ReactPaginate
            breakLabel="..."
            previousLabel={<FiChevronLeft />}
            nextLabel={<FiChevronRight />}
            activePage={currentPage}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            onPageChange={onPageChange}
            totalItemsCount={total}
            containerClassName={"pagination"}
            pageLinkClassName={"pagination_link"}
            activeLinkClassName={"pagination_link_active"}
        />
    );
};

export default Pagination;