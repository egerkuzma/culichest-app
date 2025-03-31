import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Обработка команды /start
bot.command('start', (ctx) => {
  ctx.reply('Добро пожаловать во Вкусный Сундучок! 🍳', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "Открыть приложение",
          web_app: { url: process.env.WEBAPP_URL }
        }
      ]]
    }
  });
});

export default bot; 