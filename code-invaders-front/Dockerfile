# Этап сборки
FROM node:18 as build
WORKDIR /RadioHachKonturCase
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап запуска
FROM nginx:alpine
COPY --from=build /RadioHachKonturCase/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80