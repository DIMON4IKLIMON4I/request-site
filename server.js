require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn("⚠️ BOT_TOKEN или CHAT_ID не настроен. Создайте .env по образцу .env.example");
}

app.use(express.json({ limit: "50kb" }));
app.use(express.static(path.join(__dirname, "public")));

// Явно отдаём главную страницу на / для хостингов вроде Render.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function escapeTelegram(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

app.post("/api/requests", async (req, res) => {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ ok: false, error: "Telegram не настроен на сервере." });
    }

    const { name, contact, topic, message, date } = req.body;

    if (!name || !contact || !message) {
      return res.status(400).json({ ok: false, error: "Заполните обязательные поля." });
    }

    const text =
      "🔔 <b>НОВАЯ ЗАЯВКА</b>\n" +
      "━━━━━━━━━━━━━━━━\n\n" +
      `👤 <b>Имя:</b>\n${escapeTelegram(name)}\n\n` +
      `📞 <b>Контакт:</b>\n${escapeTelegram(contact)}\n\n` +
      `📌 <b>Тема:</b>\n${escapeTelegram(topic || "Не указана")}\n\n` +
      `💬 <b>Сообщение:</b>\n${escapeTelegram(message)}\n\n` +
      `🕒 <b>Дата:</b> ${escapeTelegram(date || new Date().toLocaleString("ru-RU"))}\n\n` +
      "━━━━━━━━━━━━━━━━\n" +
      "🟢 <b>Новая заявка</b>";

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${encodeURIComponent(BOT_TOKEN)}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "HTML"
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram API:", telegramResult);
      return res.status(502).json({
        ok: false,
        error: "Telegram не принял сообщение. Проверьте BOT_TOKEN и CHAT_ID."
      });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Внутренняя ошибка сервера." });
  }
});

app.listen(PORT, () => {
  console.log(`Сайт запущен на порту ${PORT}`);
});
