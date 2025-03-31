import React, { createContext, useContext, useEffect, useState } from 'react';

const TelegramContext = createContext();

export const TelegramProvider = ({ children }) => {
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setWebApp(tg);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  return useContext(TelegramContext);
}; 