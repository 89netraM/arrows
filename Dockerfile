FROM node:18-slim AS build
ENV BASE_URL="/arrows/"
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM nginx:1.22.0
COPY --from=build /app/dist /usr/share/nginx/html
