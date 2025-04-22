FROM docker.io/node:22-alpine
WORKDIR /server
COPY . /server
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm run build
CMD ["pnpm","run","start"]
