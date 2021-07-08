FROM node:16-alpine3.11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN yarn

EXPOSE 8080

CMD [ "yarn", "dev" ]