//работа API, маршруты
import express from 'express';
import session from 'express-session';
import Recipe from './models/Recipe.js';

const router = express.Router();


//Основной эндпоинт с пагинацией
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-views'; // По умолчанию сортируем по просмотрам по убыванию

    // Получаем рецепты с сортировкой
    const recipes = await Recipe.find()
      .select('title mainPhoto categories views') // Добавили views в выборку
      .sort(sort) // Добавили сортировку
      .skip(skip)
      .limit(limit)
      .lean();

    // Получаем общее количество только если это первая страница
    let totalRecipes = null;
    if (page === 1) {
      totalRecipes = await Recipe.countDocuments();
    }

    const response = {
      recipes,
      pagination: {
        currentPage: page,
        totalRecipes: totalRecipes,
        hasMore: recipes.length === limit
      }
    };
    
    res.json(response);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: err.message });
  }
});

//Поиск (перемещаем выше)
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Search query:', query); // Для отладки

    if (!query || query.length < 3) {
      return res.json([]);
    }

    // Экранируем специальные символы
    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(sanitizedQuery, 'i');

    const recipes = await Recipe.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { ingredients: searchRegex }
      ]
    })
    .select('_id title mainPhoto') // Выбираем только нужные поля
    .limit(20)
    .lean();

    //console.log(`Found ${recipes.length} recipes`); // Для отладки
    res.json(recipes);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Ошибка при поиске рецептов',
      details: error.message 
    });
  }
});

// Получение случайного рецепта (рецепт дня)
router.get('/random', async (req, res) => {
  try {
    // Получаем общее количество рецептов
    const count = await Recipe.countDocuments();
    
    // Генерируем случайный индекс
    const random = Math.floor(Math.random() * count);
    
    // Получаем только ID случайного рецепта
    const recipe = await Recipe.findOne()
      .select('_id')
      .skip(random)
      .lean();

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ id: recipe._id });
  } catch (err) {
    console.error('Error fetching random recipe:', err);
    res.status(500).json({ message: err.message });
  }
});


// Создание нового рецепта
//router.post('/', async (req, res) => {
//    const recipe = new Recipe(req.body);

//    try {
//        const newRecipe = await recipe.save();
//        res.status(201).json(newRecipe);
//    } catch (err) {
//        res.status(400).json({ message: err.message });
//    }
//});

// Получение одного рецепта по ID и увеличение счетчика просмотров
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const sessionKey = `viewed_${id}`;

        if (!req.session[sessionKey]) {
            req.session[sessionKey] = true;
            
            const recipe = await Recipe.findByIdAndUpdate(
                id,
                { $inc: { views: 1 } }, // Увеличиваем счетчик просмотров на 1
                { new: true }
            );

            if (recipe == null) {
                return res.status(404).json({ message: 'Recipe not found' });
            }
            res.json(recipe);
        } else {
            // Если уже просмотрено в этой сессии, просто возвращаем рецепт без увеличения счетчика
            const recipe = await Recipe.findById(id);
            if (recipe == null) {
                return res.status(404).json({ message: 'Recipe not found' });
            }
            res.json(recipe);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Получение рецептов по категории
router.get('/category/:category', async (req, res) => {
    try {
      const category = decodeURIComponent(req.params.category);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
      
      // Ищем рецепты с пагинацией
      const recipes = await Recipe.find({
        $or: [
          { 'categories.forWhat': category },
          { 'categories.mainIngred': category },
          { 'categories.dish': category },
          { 'categories.geo': category }
        ]
      })
        .skip(skip)
        .limit(limit)
        .select('title mainPhoto categories') // Оптимизируем загрузку, выбирая только нужные поля
        .lean();
  
      if (recipes.length === 0 && page === 1) {
        return res.status(404).json({ message: 'No recipes found in this category' });
      }
  
      res.json(recipes);
    } catch (err) {
      console.error('Error fetching category recipes:', err);
      res.status(500).json({ message: err.message });
    }
  });
 
  
// Обновление рецепта
//router.put('/:id', async (req, res) => {
//    try {
//        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//        if (updatedRecipe == null) {
//            return res.status(404).json({ message: 'Recipe not found' });
//        }
//        res.json(updatedRecipe);
//    } catch (err) {
//        res.status(400).json({ message: err.message });
//    }
//});

// Удаление рецепта
//router.delete('/:id', async (req, res) => {
//    try {
//        const result = await Recipe.findByIdAndDelete(req.params.id);
//        if (result == null) {
//            return res.status(404).json({ message: 'Recipe not found' });
//        }
//        res.json({ message: 'Recipe deleted' });
//    } catch (err) {
//        res.status(500).json({ message: err.message });
//    }
//});

export default router;
