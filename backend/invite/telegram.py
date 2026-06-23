import os

import requests


class TelegramConfigError(RuntimeError):
    pass


def _env_text(name):
    return os.getenv(name, "").strip()


def _request_timeout():
    value = _env_text("TELEGRAM_REQUEST_TIMEOUT_SECONDS")
    if not value:
        return 10

    try:
        timeout = float(value)
    except ValueError as exc:
        raise TelegramConfigError("TELEGRAM_REQUEST_TIMEOUT_SECONDS must be a number") from exc

    if timeout <= 0:
        raise TelegramConfigError("TELEGRAM_REQUEST_TIMEOUT_SECONDS must be greater than 0")

    return timeout


def _telegram_proxies():
    default_proxy = _env_text("TELEGRAM_PROXY_URL")
    http_proxy = _env_text("TELEGRAM_HTTP_PROXY") or default_proxy
    https_proxy = _env_text("TELEGRAM_HTTPS_PROXY") or default_proxy

    proxies = {}
    if http_proxy:
        proxies["http"] = http_proxy
    if https_proxy:
        proxies["https"] = https_proxy

    return proxies or None


def send_telegram_message(text):
    token = _env_text("TELEGRAM_BOT_TOKEN")
    chat_id = _env_text("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        raise TelegramConfigError("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required")

    try:
        response = requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={
                "chat_id": chat_id,
                "text": text,
                "parse_mode": "HTML",
                "disable_web_page_preview": True,
            },
            proxies=_telegram_proxies(),
            timeout=_request_timeout(),
        )
    except requests.RequestException as exc:
        raise RuntimeError(f"Telegram request failed before response: {exc}") from exc

    try:
        data = response.json()
    except ValueError as exc:
        raise RuntimeError("Telegram returned a non-JSON response") from exc

    if response.status_code >= 400 or not data.get("ok"):
        description = data.get("description") or response.text
        raise RuntimeError(f"Telegram send failed: {description}")

    return data
