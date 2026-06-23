FROM node:22-alpine AS frontend

ENV CI=true

WORKDIR /app/frontend
RUN corepack enable && corepack prepare pnpm@11.5.3 --activate
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm run build


FROM python:3.12-slim AS app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=lovesite.settings

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend ./backend
COPY --from=frontend /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "lovesite.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "60"]
