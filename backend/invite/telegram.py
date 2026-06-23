import os

import requests


class TelegramConfigError(RuntimeError):
    pass


def send_telegram_message(text):
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        raise TelegramConfigError("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required")

    response = requests.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        json={
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": True,
        },
        timeout=10,
    )

    try:
        data = response.json()
    except ValueError as exc:
        raise RuntimeError("Telegram returned a non-JSON response") from exc

    if response.status_code >= 400 or not data.get("ok"):
        description = data.get("description") or response.text
        raise RuntimeError(f"Telegram send failed: {description}")

    return data
