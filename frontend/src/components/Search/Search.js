import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import './Search.css';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async () => {
    if (!searchQuery || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${config.API_URL}/api/recipes/search?query=${encodeURIComponent(searchQuery)}`,
        { withCredentials: true }
      );
      
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching recipes:', error);
      setError('Произошла ошибка при поиске. Пожалуйста, попробуйте снова.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  return (
    <div className="search-container">
      <div className="recipe-header">
        <button onClick={() => navigate(-1)} className="back-button">
          &lt;
        </button>
        <div className="title-container">
            <h2>{searchQuery}</h2>
        </div>
      </div>

      <div className="search-results">
        {loading ? (
          <div className="search-loading">Поиск рецептов...</div>
        ) : error ? (
          <div className="search-error">{error}</div>
        ) : searchResults.length === 0 ? (
          <div className="no-results">
            По вашему запросу ничего не найдено
          </div>
        ) : (
          <div className="recipe-grid">
            {searchResults.map(recipe => (
              <div key={recipe._id} className="recipe-item">
                <Link to={`/recipe/${recipe._id}`}>
                  {recipe.mainPhoto && (
                    <img
                      src={`${config.IMAGE_BASE_URL}/${recipe.mainPhoto.replace('.jpg', '_m.jpg')}`}
                      alt={recipe.title}
                      className="recipe-image"
                      loading="lazy"
                      onError={(e) => {e.target.style.display = 'none'}}
                    />
                  )}
                  <h3>{recipe.title.replace(/&quot;/g, '"')}</h3>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search; 