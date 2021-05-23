# build environment
FROM node:14-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
RUN apk add --no-cache --virtual .gyp python make g++
RUN npm install yarn
RUN yarn install
COPY . ./
RUN yarn run build

# production environment
FROM nginx:stable-alpine
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
