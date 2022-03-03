FROM node:12

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3500

CMD ["npm","run", "start:dev"]