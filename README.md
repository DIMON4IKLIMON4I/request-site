# Сайт для приема заявок + Telegram

Публичная версия для Render.

## Что делает
- Сайт доступен по публичной ссылке.
- Заявки отправляются в Telegram.
- В Telegram нет кнопок «Принять» и «Отклонить».
- Токен Telegram хранится только в переменных окружения Render.

## Запуск локально
1. Установите Node.js LTS.
2. Скопируйте `.env.example` в `.env`.
3. Укажите новый BOT_TOKEN и CHAT_ID.
4. Выполните `npm install`.
5. Выполните `npm start`.
6. Откройте `http://localhost:3000`.

## Размещение на Render
1. Создайте GitHub-репозиторий и загрузите содержимое этой папки.
2. На Render выберите New → Web Service и подключите репозиторий.
3. Runtime: Node.
4. Build Command: `npm install`.
5. Start Command: `npm start`.
6. Plan: Free.
7. В Environment добавьте:
   - `BOT_TOKEN` = новый токен Telegram-бота
   - `CHAT_ID` = ваш Telegram chat ID
8. Нажмите Create Web Service.

После успешного deploy Render выдаст публичный адрес вида `https://имя.onrender.com`.
