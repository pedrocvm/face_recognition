FROM node:12-alpine

RUN apk add --no-cache python2 g++ make

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

RUN npm rebuild node-sass

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]