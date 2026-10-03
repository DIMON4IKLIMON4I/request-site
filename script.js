const STORAGE_KEY = "request_site_data";

function getRequests() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveRequests(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

document.getElementById("requestForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const submitBtn = this.querySelector(".submit-btn");
  const success = document.getElementById("success");

  const request = {
    id: Date.now(),
    name: document.getElementById("name").value.trim(),
    contact: document.getElementById("contact").value.trim(),
    topic: document.getElementById("topic").value,
    message: document.getElementById("message").value.trim(),
    date: new Date().toLocaleString("ru-RU")
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Отправляем...";

  try {
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Ошибка отправки");
    }

    // Local copy for the "Мои заявки" section.
    const requests = getRequests();
    requests.unshift(request);
    saveRequests(requests);

    this.reset();
    success.textContent = "✓ Заявка отправлена в Telegram!";
    success.hidden = false;
    setTimeout(() => success.hidden = true, 4000);
  } catch (error) {
    success.textContent = "✕ Не удалось отправить заявку. Проверьте подключение сервера.";
    success.hidden = false;
    console.error(error);
    setTimeout(() => success.hidden = true, 5000);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить заявку";
  }
});

function openAdmin() {
  document.getElementById("adminModal").hidden = false;
  renderRequests();
}

function closeAdmin() {
  document.getElementById("adminModal").hidden = true;
}

function renderRequests() {
  const list = document.getElementById("requestsList");
  const requests = getRequests();

  if (!requests.length) {
    list.innerHTML = '<div class="empty">Пока заявок нет.</div>';
    return;
  }

  list.innerHTML = requests.map(r => `
    <div class="request-item">
      <h3>${escapeHtml(r.name)}</h3>
      <div class="request-meta">${escapeHtml(r.date)} · ${escapeHtml(r.topic)}</div>
      <p><b>Контакт:</b> ${escapeHtml(r.contact)}</p>
      <p>${escapeHtml(r.message)}</p>
      <button class="delete-one" onclick="deleteRequest(${r.id})">Удалить</button>
    </div>
  `).join("");
}

function deleteRequest(id) {
  saveRequests(getRequests().filter(r => r.id !== id));
  renderRequests();
}

function clearRequests() {
  if (confirm("Удалить все заявки?")) {
    localStorage.removeItem(STORAGE_KEY);
    renderRequests();
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.getElementById("adminModal").addEventListener("click", function(e) {
  if (e.target === this) closeAdmin();
});
