#syntax=docker/dockerfile:1
ARG NODE_VERSION=22.9.0

FROM node:${NODE_VERSION}-alpine as base

RUN mkdir -p /home/app
WORKDIR /home/app
EXPOSE ${PORT}

# Production stage
FROM base as prod
RUN npm cache clean --force
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \ 
    npm ci --omit=dev --loglevel verbose
RUN npm update
# Install PM2 globally
RUN npm install -g pm2

COPY . .
RUN mkdir -p /home/app/logs && chown -R node:node /home/app/logs
ENV NODE_ENV=production
USER node
RUN npm cache clean --force
CMD ["pm2-runtime", "server.js", "-i", "max"]

# development
FROM base as dev
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev --loglevel verbose

COPY . .
RUN mkdir -p /home/app/logs && chown -R node:node /home/app/logs
ENV NODE_ENV=development
USER node
RUN npm cache clean --force
CMD ["npm", "run", "dev"]