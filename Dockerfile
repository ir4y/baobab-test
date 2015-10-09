FROM node:4.1.1
RUN npm install -g webpack
RUN mkdir /data
WORKDIR /data
