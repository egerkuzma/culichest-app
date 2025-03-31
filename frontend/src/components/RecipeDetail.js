import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Замените useHistory на useNavigate
import axios from 'axios';
import ImageModal from './ImageModal'; // Импортируем наш новый компонент
import ScrollToTop from './ScrollToTop';
import config from '../config';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Замените history на navigate
  const [recipe, setRecipe] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    axios.get(`${config.API_URL}/api/recipes/${id}`, { withCredentials: true })
      .then(response => {
        setRecipe(response.data);
      })
      .catch(error => {
        console.error('Error fetching recipe:', error);
      });
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1); // Используйте navigate(-1) для возврата назад
  }, [navigate]);

  const handleCategoryClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (!recipe) return <div>Загрузка...</div>;

  return (
    <>
      <div className="RecipeDetail">
        <div className="recipe-header">
          <button onClick={handleBack} className="back-button">
            &lt;
          </button>
          <div className="title-container">
            <h2>{recipe.title.replace(/&quot;/g, '"')}</h2>
          </div>
        </div>
        {recipe.mainPhoto && (
          <img 
            src={`${config.IMAGE_BASE_URL}/${recipe.mainPhoto}`}
            alt={recipe.title}
            className="recipe-main-photo"
          />
        )}
        <div 
          className="recipe-description"
          dangerouslySetInnerHTML={{ __html: recipe.description }}
        />

        <div className="recipe-categories">
          {recipe.categories.map((categoryGroup, index) => (
            <div key={index}>
              {categoryGroup.forWhat?.length > 0 && (
                <div>
                  <h4>Назначение:</h4>
                  <ul>
                    {categoryGroup.forWhat.map((cat, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => handleCategoryClick(cat)}
                        style={{ cursor: 'pointer' }}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {categoryGroup.mainIngred?.length > 0 && (
                <div>
                  <h4>Основные ингредиенты:</h4>
                  <ul>
                    {categoryGroup.mainIngred.map((cat, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => handleCategoryClick(cat)}
                        style={{ cursor: 'pointer' }}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {categoryGroup.dish?.length > 0 && (
                <div>
                  <h4>Тип блюда:</h4>
                  <ul>
                    {categoryGroup.dish.map((cat, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => handleCategoryClick(cat)}
                        style={{ cursor: 'pointer' }}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {categoryGroup.geo?.length > 0 && (
                <div>
                  <h4>Кухня:</h4>
                  <ul>
                    {categoryGroup.geo.map((cat, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => handleCategoryClick(cat)}
                        style={{ cursor: 'pointer' }}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="recipe-meta">
          <div className="recipe-meta-item">
            <span className="meta-icon">⏰</span>
            <div className="meta-content">
              <span className="meta-label">Время приготовления</span>
              <span className="meta-value">{recipe.cookTime}</span>
            </div>
          </div>
          <div className="recipe-meta-item">
            <span className="meta-icon">🍽️</span>
            <div className="meta-content">
              <span className="meta-label">Количество порций</span>
              <span className="meta-value">{recipe.servings}</span>
            </div>
          </div>
        </div>
        <h3>Ингредиенты:</h3>
        <ul className="recipe-ingredients">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h3>Инструкции:</h3>
        <ul className="recipe-instructions">
          {recipe.instructions.map((step, index) => (
            <li key={index}>
              <p>{step.text.replace(/&quot;/g, '"')}</p>
              {step.photoUrl && (
                  <img
                  src={`${config.IMAGE_BASE_URL}/${step.photoUrl.replace('.jpg', '_m.jpg')}`}
                  alt={`Шаг ${index + 1}`} 
                  className="step-photo" 
                  onClick={() => openModal(`${config.IMAGE_BASE_URL}/${step.photoUrl}`)}
                  />
              )}
            </li>
          ))}
        </ul>

        <ImageModal 
          isOpen={modalIsOpen} 
          onClose={closeModal} 
          imageSrc={modalImage} 
        />
      </div>
      {showScrollButton && <ScrollToTop />}
    </>
  );
};

export default RecipeDetail;