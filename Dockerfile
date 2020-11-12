###############################################################################################
# Streetmix Image
###############################################################################################
FROM node:latest as streetmix

# define folder where app will be placed
WORKDIR /usr/src/app

# set environment variables
ENV NODE_ENV=production 

# update the image, because of some timing difference temporaly disable it
# install additionally some debugging tools
RUN apt-get -o Acquire::Check-Valid-Until=false -o Acquire::Check-Date=false update
RUN apt-get upgrade -y
RUN apt-get install vim -y
RUN apt-get install net-tools -y

# Bundle app source
COPY . .
RUN npm install --only=production && npm cache clean --force --loglevel=error
RUN npm run postinstall

# publish app using entry script
RUN chmod +x docker/entrypoint.sh
EXPOSE 8000
ENTRYPOINT [ "docker/entrypoint.sh" ]

###############################################################################################
# Postgres Image
###############################################################################################
FROM postgres:latest as streetmix-postgres

# define where project data will be copied
WORKDIR /usr/src/app

# update image and install postgis, nodejs, npm
RUN apt-get -o Acquire::Check-Valid-Until=false -o Acquire::Check-Date=false update
RUN apt-get upgrade -y
RUN apt-get install postgis -y
RUN apt-get install postgresql-13-postgis-2.5 -y
RUN apt-get install nodejs -y
RUN apt-get install curl -y
RUN curl -L https://www.npmjs.com/install.sh | sh
RUN apt-get install vim -y 
RUN apt-get install net-tools -y

# copy git project into image and install it, so migration can be executed
# install some prerequists before, because the build fails otherwise
COPY . ./
RUN npm install -g sequelize
RUN npm install -g sequelize-cli
RUN RUN npm install phantomjs-prebuilt@2.1.14 --ignore-scripts
RUN npm install --only=production

# copy init shell scripts to docker init
COPY ./docker/*.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/*.sh

# copy postgressql to conf folder
COPY docker/postgresql.conf /etc/postgresql/

# Expose the PostgreSQL port
EXPOSE 5432