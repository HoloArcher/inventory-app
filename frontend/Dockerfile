FROM node:12 as nodeInstance
WORKDIR /app

# install dependencies
COPY /package.json /app/
COPY /package-lock.json /app/
RUN npm i
RUN npm audit fix
COPY . /app

# get API_PORT from docker-compose
ARG API_PORT

# set PORT for the backend connection
RUN touch .env 
RUN echo VUE_APP_API_PORT=${API_PORT} > .env

# compile frontend
RUN npm run build

# move to dispatch
FROM httpd:2.4
#  import config
COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf
#  load config
COPY --from=nodeInstance /app/.htaccess /usr/local/apache2/htdocs/
COPY --from=nodeInstance /app/dist/ /usr/local/apache2/htdocs/