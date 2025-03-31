import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTelegram } from '../../context/TelegramContext';
import SearchModal from '../SearchModal/SearchModal';
import './Header.css';

const Header = () => {
  const { webApp } = useTelegram();
  const location = useLocation();
  const navigate = useNavigate();
  const isTelegramWebApp = !!webApp;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Проверяем, находимся ли мы на главной странице
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY, isHomePage]);

  // Если не главная страница, не рендерим меню
  if (!isHomePage) {
    return null;
  }

  const handleSearchClick = (e) => {
    e.preventDefault();
    setIsSearchModalOpen(true);
  };

  return (
    <>
      <header className={`header ${isTelegramWebApp ? 'telegram-webapp' : ''} ${!isVisible ? 'header-hidden' : ''}`}>
        <nav className="header-nav">
          <button 
            onClick={() => navigate('/')}
            className={`nav-button ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Главная</span>
          </button>
          
          <button 
            onClick={() => navigate('/recipe-of-day')}
            className={`nav-button ${location.pathname === '/recipe-of-day' ? 'active' : ''}`}
          >
            <span className="nav-icon">⭐</span>
            <span className="nav-text">Рецепт дня</span>
          </button>
          
          <button 
            className="nav-button"
            onClick={handleSearchClick}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-text">Поиск</span>
          </button>
        </nav>
      </header>

      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default Header; 