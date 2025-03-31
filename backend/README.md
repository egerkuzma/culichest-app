# Culichest

Проект на Node.js с использованием Express и MongoDB для управления данными и интеграцией с Telegram ботом.

## Технологии

- Node.js
- Express.js
- MongoDB
- Telegraf (Telegram Bot API)
- TypeScript (для типов)

## Установка

1. Клонируйте репозиторий:
```bash
git clone [URL репозитория]
cd culichest
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корневой директории проекта и добавьте необходимые переменные окружения:
```
MONGODB_URI=your_mongodb_uri
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

## Структура проекта

- `app.js` - основной файл приложения
- `bot.js` - конфигурация Telegram бота
- `routes.js` - маршруты API
- `connectDB.js` - подключение к MongoDB
- `models/` - модели данных

## Запуск

Для запуска проекта выполните:
```bash
npm start
```

## API Endpoints

API предоставляет следующие эндпоинты:
- `/api/data` - работа с данными
- `/api/auth` - аутентификация
- `/api/users` - управление пользователями

## Telegram Bot

Проект включает интеграцию с Telegram ботом для удобного взаимодействия с системой через мессенджер.

## Лицензия

ISC