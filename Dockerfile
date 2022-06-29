FROM node:alpine
WORKDIR /home/node/app
COPY . /home/node/app
CMD ["node", "index.js"]