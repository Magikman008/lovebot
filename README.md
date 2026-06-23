# Date invitation site

Персональный сайт-приглашение на свидание: React отвечает за открытку из нескольких экранов, Django отдает собранный SPA и принимает ответ, Telegram Bot API отправляет ответ лично тебе. База данных не используется.

Тексты открытки запечены во фронтенде: редактируй их в `frontend/src/content.js`.

## Быстрый запуск

1. Скопируй переменные окружения:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Заполни `.env`:

   - `INVITE_GIRL_NAME` - имя в Telegram-сообщении.
   - `INVITE_FROM_NAME` - подпись в Telegram-сообщении.
   - `TELEGRAM_BOT_TOKEN` - токен бота от BotFather.
   - `TELEGRAM_CHAT_ID` - твой личный chat id, не id бота из токена.
   - `TELEGRAM_PROXY_URL` - необязательный прокси для отправки в Telegram.
   - `TELEGRAM_REQUEST_TIMEOUT_SECONDS` - таймаут запроса к Telegram.

3. Запусти контейнер:

   ```powershell
   docker compose up --build
   ```

4. Открой сайт:

   ```text
   http://localhost:8000
   ```

## Telegram

Создай бота через BotFather, отправь своему боту любое сообщение, затем получи свой chat id через:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates
```

В ответе найди `message.chat.id` и запиши его в `TELEGRAM_CHAT_ID`.
Если `TELEGRAM_CHAT_ID` совпадает с числом перед двоеточием в `TELEGRAM_BOT_TOKEN`, это id самого бота, а не твой chat id.

### Прокси для Telegram

Если сервер не может напрямую достучаться до `api.telegram.org`, пропиши прокси в `.env`:

```env
TELEGRAM_PROXY_URL=socks5://user:password@127.0.0.1:1080
TELEGRAM_REQUEST_TIMEOUT_SECONDS=20
```

`TELEGRAM_PROXY_URL` применяется и для HTTP, и для HTTPS-запросов. Если нужно разделить прокси по схемам, используй:

```env
TELEGRAM_HTTP_PROXY=http://user:password@proxy.example.com:8080
TELEGRAM_HTTPS_PROXY=http://user:password@proxy.example.com:8080
```

Для обычного HTTP-прокси тоже можно использовать только `TELEGRAM_PROXY_URL`:

```env
TELEGRAM_PROXY_URL=http://user:password@proxy.example.com:8080
```

## Локальная разработка

Backend:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python backend\manage.py check
```

Frontend удобнее запускать через Docker, если Node.js не установлен локально. Для локальной разработки с Node.js и pnpm:

```powershell
cd frontend
pnpm install
pnpm run dev
```

В production-контейнере отдельный frontend-сервер не нужен: React собирается в `frontend/dist`, а Django отдает готовые файлы.
