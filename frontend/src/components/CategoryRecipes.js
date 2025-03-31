import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import ScrollToTop from './ScrollToTop';

const CategoryRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(10);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { category } = useParams();
  const navigate = useNavigate();
  const observer = useRef();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadRecipes = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `${config.API_URL}/api/recipes/category/${category}?page=${page}&limit=${limit}`
      );
      setRecipes(prevRecipes => [...prevRecipes, ...response.data]);
      setHasMore(response.data.length >= limit);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [category, page, hasMore, loading, limit]);

  useEffect(() => {
    if (isFirstLoad.current) {
      loadRecipes();
      isFirstLoad.current = false;
    }
  }, [loadRecipes]);

  const lastRecipeElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadRecipes();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadRecipes]);

  return (
    <>
      <div className="RecipeDetail">
        <div className="recipe-header">
          <button onClick={() => navigate(-1)} className="back-button">
            &lt;
          </button>
          <div className="title-container">
            <h2>{decodeURIComponent(category)}</h2>
          </div>
        </div>

        <div className="recipe-grid">
          {recipes.map((recipe, index) => (
            <div 
              key={recipe._id} 
              ref={index === recipes.length - 1 ? lastRecipeElementRef : null}
              className="recipe-item"
            >
              <Link to={`/recipe/${recipe._id}`}>
                <img 
                  src={`${config.IMAGE_BASE_URL}/${recipe.mainPhoto.replace('.jpg', '_m.jpg')}`}
                  alt={recipe.title} 
                  className="recipe-image"
                  loading="lazy"
                  onError={(e) => {e.target.style.display = 'none'}}
                />
                <h3>{recipe.title.replace(/&quot;/g, '"')}</h3>
              </Link>
            </div>
          ))}
        </div>
        {loading && <div>Загрузка рецептов...</div>}
        {!hasMore && <div>Больше рецептов нет</div>}
      </div>
      {showScrollButton && <ScrollToTop />}
    </>
  );
};

export default CategoryRecipes; 