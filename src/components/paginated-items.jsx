import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'

const PaginatedItems = ({ items = [], itemsPerPage = 10, render }) => {
    const [currentItems, setCurrentItems] = useState(null)
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage
        setCurrentItems(items.slice(itemOffset, endOffset))
        setPageCount(Math.ceil(items.length / itemsPerPage))
    }, [itemOffset, itemsPerPage, items])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length
        setItemOffset(newOffset)
    }

    return (
        <>
            {currentItems && render(currentItems)}
            <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="Previous"
                renderOnZeroPageCount={null}
                className="pagination flex my-3 float-right"
            />
        </>
    )
}

export default PaginatedItems
