FROM node:20-alpine

USER node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "start"]