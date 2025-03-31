import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import ScrollToTop from './ScrollToTop';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(20);
  const [showScrollButton, setShowScrollButton] = useState(false);
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
        `${config.API_URL}/api/recipes?page=${page}&limit=${limit}&sort=views`,
        { withCredentials: true }
      );

      const { recipes: newRecipes, pagination } = response.data;
      
      setRecipes(prevRecipes => {
        if (page === 1) return newRecipes;
        return [...prevRecipes, ...newRecipes];
      });

      setHasMore(pagination.hasMore);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, limit]);

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

  useEffect(() => {
    if (isFirstLoad.current) {
      loadRecipes();
      isFirstLoad.current = false;
    }
  }, [loadRecipes]);

  return (
    <>
      <div className="recipe-grid">
        {recipes.map((recipe, index) => {
          const mainPhoto = recipe.mainPhoto ? 
            `${config.IMAGE_BASE_URL}/${recipe.mainPhoto.replace('.jpg', '_m.jpg')}` : 
            null;
          const title = recipe.title.replace(/&quot;/g,'"');

          return (
            <div 
              key={recipe._id} 
              ref={index === recipes.length - 1 ? lastRecipeElementRef : null}
              className="recipe-item"
            >
              <Link to={`/recipe/${recipe._id}`}>
                {mainPhoto && (
                  <img 
                    src={mainPhoto} 
                    alt={title} 
                    className="recipe-image" 
                    loading="lazy" 
                    onError={(e) => {e.target.style.display = 'none'}} 
                  />
                )}
                <h3>{title}</h3>
              </Link>
            </div>
          );
        })}
        {loading && <div>Loading more recipes...</div>}
        {!hasMore && <div>No more recipes to load</div>}
      </div>
      {showScrollButton && <ScrollToTop />}
    </>
  );
};

export default RecipeList;