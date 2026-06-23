import html
import json
import logging
import os
import time

from django.conf import settings
from django.http import FileResponse, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .telegram import TelegramConfigError, send_telegram_message


logger = logging.getLogger(__name__)

ANSWER_LABELS = {
    "yes": "Да",
}

_SUBMISSIONS = {}


def _env_text(name, default):
    value = os.getenv(name, "").strip()
    return value or default


def _client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "unknown")


def _clean(value, limit):
    if not isinstance(value, str):
        return ""
    return " ".join(value.replace("\r", "\n").split())[:limit]


def _format_date(value):
    parts = value.split("-")
    if len(parts) == 3 and all(part.isdigit() for part in parts):
        year, month, day = parts
        return f"{day}.{month}.{year}"
    return value


def _submission_message(payload, request):
    answer_code = payload["answer"]
    girl_name = _env_text("INVITE_GIRL_NAME", "любимая")
    from_name = _env_text("INVITE_FROM_NAME", "я")
    selected_date = _clean(payload.get("date"), 40)
    selected_time = _clean(payload.get("time"), 20)
    dress_code = _clean(payload.get("dressCode"), 80) or "не выбран"
    food = _clean(payload.get("food"), 80)
    note = _clean(payload.get("note"), 800) or "без комментария"

    lines = [
        "<b>Ответ с сайта-приглашения</b>",
        f"<b>Для:</b> {html.escape(girl_name)}",
        f"<b>От:</b> {html.escape(from_name)}",
        f"<b>Ответ:</b> {html.escape(ANSWER_LABELS[answer_code])}",
        f"<b>Дата:</b> {html.escape(_format_date(selected_date))}",
        f"<b>Время:</b> {html.escape(selected_time)}",
        f"<b>Дресс-код:</b> {html.escape(dress_code)}",
        f"<b>Еда:</b> {html.escape(food)}",
        f"<b>Комментарий:</b> {html.escape(note)}",
        f"<b>IP:</b> {html.escape(_client_ip(request))}",
    ]
    return "\n".join(lines)


@csrf_exempt
@require_POST
def response_view(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return JsonResponse({"ok": False, "error": "bad_json"}, status=400)

    # Hidden field for simple bot noise; real users never fill it.
    if _clean(payload.get("website"), 200):
        return JsonResponse({"ok": True})

    answer = payload.get("answer")
    if answer not in ANSWER_LABELS:
        return JsonResponse({"ok": False, "error": "bad_answer"}, status=400)

    selected_date = _clean(payload.get("date"), 40)
    selected_time = _clean(payload.get("time"), 20)
    food = _clean(payload.get("food"), 80)
    if not selected_date or not selected_time or not food:
        return JsonResponse({"ok": False, "error": "missing_details"}, status=400)

    cooldown_seconds = int(os.getenv("SUBMIT_COOLDOWN_SECONDS", "20"))
    ip = _client_ip(request)
    now = time.monotonic()
    previous = _SUBMISSIONS.get(ip)
    if previous and now - previous < cooldown_seconds:
        return JsonResponse({"ok": False, "error": "too_many_requests"}, status=429)

    try:
        send_telegram_message(_submission_message(payload, request))
    except TelegramConfigError as exc:
        logger.warning("Telegram is not configured: %s", exc, exc_info=True)
        return JsonResponse({"ok": False, "error": "telegram_not_configured"}, status=500)
    except RuntimeError as exc:
        logger.warning("Telegram send failed: %s", exc, exc_info=True)
        return JsonResponse({"ok": False, "error": "telegram_failed"}, status=502)

    _SUBMISSIONS[ip] = now
    logger.info("Telegram message sent successfully for ip=%s", ip)
    return JsonResponse({"ok": True})


@require_GET
def spa_index(request):
    if settings.FRONTEND_INDEX.exists():
        return FileResponse(settings.FRONTEND_INDEX.open("rb"), content_type="text/html")

    return HttpResponse(
        "React build is missing. Run pnpm run build in frontend or build the Docker image.",
        status=503,
        content_type="text/plain; charset=utf-8",
    )
