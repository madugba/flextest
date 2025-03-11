#syntax=docker/dockerfile:1

FROM node:22.9.0-alpine

RUN mkdir -p /home/app
WORKDIR /home/app
EXPOSE 3001

RUN npm cache clean --force
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \ 
    npm ci --include=dev --loglevel verbose

COPY . .
RUN mkdir -p /home/app/logs && chown -R node:node /home/app/logs
ENV NODE_ENV=production
USER node
RUN npm cache clean --force
CMD ["sh", "-c", "npm run dev"]
