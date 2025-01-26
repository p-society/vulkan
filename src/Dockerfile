FROM node:latest

WORKDIR /app

COPY ./repo/package*.json ./

RUN npm install

COPY repo/ .

EXPOSE 6969

CMD ["npm", "start"]