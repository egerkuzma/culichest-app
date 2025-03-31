import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchQuery.length < 3) {
      alert('Введите минимум 3 символа для поиска');
      return;
    }

    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    onClose();
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск рецептов..."
            className="search-modal-input"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

export default SearchModal; 