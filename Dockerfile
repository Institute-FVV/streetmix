###############################################################################################
# Streetmix Image
###############################################################################################
FROM node:latest as streetmix

WORKDIR /usr/src/app

# update the image
RUN apt-get -o Acquire::Check-Valid-Until=false -o Acquire::Check-Date=false update
RUN apt-get upgrade -y

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force --loglevel=error

# Bundle app source
COPY . .

# publish app
EXPOSE 8000
CMD [ "node", "index.js" ]

###############################################################################################
# Postgres Image
###############################################################################################
FROM postgres:latest as streetmix-postgres

#ENV POSTGRES_PASSWORD=Pass
#ENV PGDATA=/var/lib/postgresql/data/some_name/

WORKDIR /usr/src/app

# update image and install postgis, nodejs, npm
RUN apt-get -o Acquire::Check-Valid-Until=false -o Acquire::Check-Date=false update
RUN apt-get upgrade -y
RUN apt-get install postgis -y
RUN apt-get install postgresql-13-postgis-2.5 -y
RUN apt-get install nodejs -y
RUN apt-get install curl -y
RUN curl -L https://www.npmjs.com/install.sh | sh

# copy git project into image and install it, so migration can be executed
COPY . ./
RUN npm install -g sequelize
RUN npm install -g sequelize-cli
RUN npm install phantomjs-prebuilt@2.1.14 --ignore-scripts
RUN npm install

# copy init shell scripts to docker init
COPY ./docker/*.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/*.sh

# copy postgressql to conf folder
COPY docker/postgresql.conf /etc/postgresql/

# Expose the PostgreSQL port
EXPOSE 5432