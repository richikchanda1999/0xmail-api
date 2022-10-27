FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run compile

EXPOSE 4000
CMD [ "npm", "start" ]