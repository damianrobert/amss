FROM node:18-alpine AS build

WORKDIR /usr/local/server

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm audit --audit-level=critical --production

RUN npm run build



FROM nginx:alpine

COPY --from=build /usr/local/server/build /usr/share/nginx/html

ENV PORT 80
EXPOSE $PORT

CMD ["nginx", "-g", "daemon off;"]