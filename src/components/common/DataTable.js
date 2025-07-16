import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DataTable = ({
  data = [],
  columns = [],
  title,
  searchable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  actions = null,
  loading = false,
  emptyMessage = "No data available",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getSortIcon = (columnKey) => {
    if (!sortable || sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    
    const value = item[column.key];
    
    // Handle different data types
    if (typeof value === 'boolean') {
      return (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      );
    }
    
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    
    if (column.type === 'currency' && typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    
    if (column.type === 'percentage' && typeof value === 'number') {
      return `${value}%`;
    }
    
    return value || '-';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className={`data-table-container ${className}`}>
        <div className="table-loading">
          <motion.div
            className="loading-spinner-main"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`data-table-container ${className}`}>
      {/* Table Header */}
      <div className="table-header">
        {title && <h3 className="table-title">{title}</h3>}
        
        <div className="table-actions">
          {searchable && (
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          )}
          
          {actions && (
            <div className="table-custom-actions">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className={`${sortable ? 'sortable' : ''} ${column.className || ''}`}
                  style={{ width: column.width }}
                >
                  <div className="th-content">
                    <span>{column.title}</span>
                    {sortable && (
                      <span className="sort-icon">
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            <AnimatePresence>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="empty-cell">
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <p>{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <motion.tr
                    key={item.id || index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className={column.className || ''}>
                        {renderCell(item, column)}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && sortedData.length > pageSize && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <div className="pagination-controls">
            <motion.button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
              whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
            >
              Previous
            </motion.button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <motion.button
                  key={pageNumber}
                  className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {pageNumber}
                </motion.button>
              );
            })}
            
            <motion.button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
              whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
            >
              Next
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;