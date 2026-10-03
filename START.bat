@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js не установлен. Установите Node.js LTS.
  pause
  exit /b 1
)
if not exist .env (
  copy .env.example .env >nul
  echo Создан .env. Откройте его и укажите BOT_TOKEN и CHAT_ID.
)
if not exist node_modules (
  call npm install
)
call npm start
pause
