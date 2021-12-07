FROM node:14-stretch

WORKDIR /app

COPY package*.json ./
RUN npm --production=false install

COPY . .
