### STAGE 1: Build ###
FROM node:16.13.2 AS build
WORKDIR /usr/src/app
ARG environment
ENV PORT=$environment
RUN echo "Oh dang look at port ${PORT}"

COPY package.json ./
RUN npm config set registry http://registry.npmjs.org/
RUN npm install --force
RUN npm install ngx-toastr@^16.0.2 --save
RUN npm install socket.io-client@4.5.1 --save
RUN npm install engine.io-parser@5.2.1 --save


COPY . .
#RUN ng serve

#RUN npm run build:${PORT}
RUN npm run build
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/uap /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
