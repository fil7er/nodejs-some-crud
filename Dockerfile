FROM node:alpine
WORKDIR /home/node/app
COPY . /home/node/app

RUN apk add --update --no-cache netcat-openbsd
RUN npm install
EXPOSE 3013
CMD ["node", "index.js"]