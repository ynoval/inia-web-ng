# FROM node:14-slim
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install -g @angular/cli
# RUN npm install
# COPY . ./
# RUN npm run build --configuration=production
# EXPOSE 8080
# CMD [ "node", "server.js" ]

FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update && apk add yarn && yarn global add @angular/cli

RUN yarn install

COPY . .

RUN ng build --configuration=production

EXPOSE 8080

CMD [ "node", "server.js" ]