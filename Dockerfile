FROM node:13.8-alpine3.11 as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN mkdir ./www
COPY www/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./www/ .

RUN npm run build --prod


FROM node:13.8-alpine3.11
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist/iotweb /usr/src/app/dist
COPY package*.json ./
RUN npm install

COPY index.js .
COPY src ./src

CMD ["node", "index.js"]
