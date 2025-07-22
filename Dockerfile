# ---------- Build Frontend ----------
FROM node:slim AS frontend

WORKDIR /app/frontend
COPY viejourney-ui/package*.json ./
RUN npm install
COPY viejourney-ui/ ./
RUN npm run build

# ---------- Build Backend ----------
FROM node:slim AS backend

WORKDIR /app
COPY viejourney-api/package*.json ./viejourney-api/
RUN cd viejourney-api && npm install
COPY viejourney-api ./viejourney-api
COPY --from=frontend /app/frontend/dist ./viejourney-api/public
RUN cd viejourney-api && npm run build

# ---------- Production Container ----------
FROM node:22.14.0-alpine AS production

WORKDIR /app
COPY --from=backend /app/viejourney-api/dist ./dist
COPY --from=backend /app/viejourney-api/node_modules ./node_modules
COPY --from=backend /app/viejourney-api/package*.json ./
COPY --from=frontend /app/frontend/dist ./public

EXPOSE 5000
CMD ["node", "dist/main"]
