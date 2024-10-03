FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update && apk add yarn && yarn global add @angular/cli
RUN yarn add typescript@5.4.5 --dev
RUN yarn install

COPY . .

RUN ng build --configuration=production

EXPOSE 8080

CMD [ "node", "server.js" ]
