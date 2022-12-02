FROM node:latest

WORKDIR /app
COPY package.json /app

RUN npm install
COPY . /app

EXPOSE 5000

ENTRYPOINT ["node", "src/app.js"]
