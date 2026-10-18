FROM node:20-alpine

WORKDIR /usr/src/app

# Use the project's lockfile and Angular CLI (devDependencies) instead of the latest global CLI
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn ng build --configuration=production

EXPOSE 8080

CMD [ "node", "server.js" ]
