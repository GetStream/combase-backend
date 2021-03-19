FROM node:15.12.0-alpine3.10

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