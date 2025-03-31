import express from 'express';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './connectDB.js'; // Подключение к базе данных
import recipeRoutes from './routes.js';
import bot from './bot.js';

const app = express();

// Парсинг JSON в теле запроса
app.use(bodyParser.json());

const corsOptions = {
  // Разрешаем запросы как с React-приложения, так и с Telegram WebApp
  origin: [
    'https://web.telegram.org',
    process.env.WEBAPP_URL
  ],
  credentials: true, // Разрешить отправку и получение cookies
};

// CORS для кроссдоменных запросов
app.use(cors(corsOptions));

// Подключение к базе данных
connectDB();

// Настройка сессий
app.use(session({
  // Секретный ключ для подписи cookie сессии
  secret: 'culichest2002', // Замените на свой сложный секретный ключ
  // Запрещает повторное сохранение сессии, если она не была изменена
  resave: false,
  // Сохраняет новую сессию, даже если она не была изменена
  saveUninitialized: true,
  // Настройки cookie
  cookie: { 
    // secure: true в продакшене, чтобы cookie передавались только по HTTPS
    secure: false,
    // Время жизни сессии в миллисекундах (например, 1 час)
    maxAge: 60 * 60 * 1000
  }
}));

// Middleware для проверки данных Telegram
const telegramAuthMiddleware = (req, res, next) => {
  // Если запрос идет не из Telegram, пропускаем проверку
  if (!req.headers['x-telegram-web-app-data']) {
    return next();
  }
  
  // TODO: Добавить валидацию данных Telegram
  // Пока просто пропускаем для тестирования
  next();
};

// Другие настройки middleware
app.use(express.json());

// Использование маршрутов
app.use('/api/recipes', telegramAuthMiddleware, recipeRoutes);

// Маршрут для получения информации о пользователе Telegram
app.get('/api/telegram-user', (req, res) => {
  const telegramData = req.headers['x-telegram-web-app-data'];
  if (telegramData) {
    // В реальном приложении здесь будет валидация данных
    res.json({ 
      success: true, 
      user: telegramData 
    });
  } else {
    res.json({ 
      success: true, 
      user: null 
    });
  }
});

// Запуск бота
bot.launch()
  .then(() => console.log('Бот запущен'))
  .catch((err) => console.error('Ошибка запуска бота:', err));

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
