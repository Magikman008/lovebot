export function errorText(code) {
  if (code === "telegram_not_configured") {
    return "Telegram еще не настроен на сервере.";
  }
  if (code === "too_many_requests") {
    return "Ответ уже отправляется, попробуй еще раз чуть позже.";
  }
  if (code === "missing_details") {
    return "Нужно выбрать дату, время и еду.";
  }
  return "Не получилось отправить. Проверь настройки Telegram и попробуй снова.";
}
