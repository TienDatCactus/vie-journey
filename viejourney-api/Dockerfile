FROM node:22.14.0-alpine as backend

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22.14.0-alpine

WORKDIR /app
COPY --from=backend /app/package*.json ./
COPY --from=backend /app/dist ./dist
COPY --from=backend /app/node_modules ./node_modules
COPY --from=backend /app/src/templates ./src/templates
COPY .env .env

EXPOSE 5000

CMD ["node", "dist/main"]
