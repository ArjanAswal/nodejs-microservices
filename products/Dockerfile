# FROM node:14-slim also works here
FROM node:14-alpine as base

# install curl for debugging
RUN apk add curl

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

# you'll likely want the latest npm, regardless of node version, for speed and fixes
# but pin this version for the best stability
RUN npm i npm@latest -g

# install dependencies first
# we have to create the dir with root and change perms
RUN mkdir app && chown node:node app
WORKDIR /app
# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app.

USER node
COPY --chown=node:node package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH app/node_modules/.bin:$PATH


# a dev and build-only stage. we don't need to
# copy in code since we bind-mount it
FROM base as dev
ENV NODE_ENV=development
RUN npm install --only=development
# We use "npm start" here in development and node in production
CMD ["npm", "start"]


FROM dev as test
# copy in our source code last, as it changes the most
# copy in as node user, so permissions match what we need
COPY --chown=node:node . .
CMD ["npm", "test"]
# you would also run your tests here


# this only has minimal deps and files
FROM base as prod
# copy in as node user, so permissions match what we need
COPY --chown=node:node . .
# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=600s CMD node ./src/healthcheck.js
CMD ["node", "./index.js"]