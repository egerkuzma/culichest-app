import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import CategoryRecipes from './components/CategoryRecipes';
import Header from './components/Header/Header';
import './App.css';
import { TelegramProvider } from './context/TelegramContext';
import Search from './components/Search/Search';
import RecipeOfDay from './components/RecipeOfDay/RecipeOfDay';

function App() {
  return (
    <TelegramProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route exact path="/" element={<RecipeList />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/category/:category" element={<CategoryRecipes />} />
              <Route path="/search" element={<Search />} />
              <Route path="/recipe-of-day" element={<RecipeOfDay />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TelegramProvider>
  );
}

export default App;