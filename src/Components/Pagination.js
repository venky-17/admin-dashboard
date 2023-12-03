import React, { useState, useEffect } from 'react';
import "../Styles/Pagination.css"


const Pagination = ({ users, currentPg, setCurrentPg }) => {
  const [currentPage, setCurrentPage] = useState(currentPg);
  const usersPerPage = 10;

  useEffect(() => {
    setCurrentPage(currentPg);
  }, [currentPg]);

  const lastUser = currentPage * usersPerPage;
  const firstUser = lastUser - usersPerPage;

  const totalPages = Math.ceil(users.length / usersPerPage);

  
  if (!Array.isArray(users)) {
    console.error("Invalid users data:", users);
    return null; 
  }


  if (!Number.isInteger(totalPages) || totalPages < 0) {
    console.error("Invalid totalPages:", totalPages);
    return null; 
  }


  const numOfPages = totalPages > 0 ? [...Array(totalPages).keys()].map((num) => num + 1) : [];

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setCurrentPg(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setCurrentPg(currentPage + 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    setCurrentPg(pageNumber);
  };

  return (
    <>
      <div className="pagination">
        <button className='pgBtn' onClick={prevPage}>
          <a href="#">&laquo; Prev</a>
        </button>
        {numOfPages.map((num, index) => (
          <button className='pgBtn' key={index} onClick={() => goToPage(num)}>
            <a href="#">{num}</a>
          </button>
        ))}
        <button className='pgBtn' onClick={nextPage}>
          <a href="#">Next &raquo;</a>
        </button>
      </div>
    </>
  );
};

export default Pagination;
