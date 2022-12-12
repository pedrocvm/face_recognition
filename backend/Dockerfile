FROM node:16-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@9.2.0

RUN npm install --force

COPY . .

EXPOSE 3345

CMD npm run start:dev