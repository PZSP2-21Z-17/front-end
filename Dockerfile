# Build
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit
COPY . ./
RUN npm run build

# Serve
FROM nginx:1.21.6-alpine
COPY --from=builder /app/build /usr/share/nginx/html
