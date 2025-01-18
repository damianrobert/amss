FROM node:18-alpine AS node-base
WORKDIR /usr/local/server

COPY ./ ./

RUN npm ci

RUN npm audit --audit-level=critical --production
RUN npm run build

ENV PORT 8000
EXPOSE $PORT
ENTRYPOINT ["node", "./build/server.js"]