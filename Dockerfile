FROM docker.io/node:22-alpine
WORKDIR /server
COPY . /server
RUN yarn
RUN npm run build
CMD ["npm","run","start"]
