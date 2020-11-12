#!/bin/bash

# define pg user, oterwise migrations fails
export PGUSER=postgres
export PGDATABASE=postgres

# execute migration as current user "postgres"
cd /usr/src/app
npx sequelize db:create
npx sequelize db:migrate

########################################################################
# STREETMIX Database
########################################################################

# change permission on the database streetmix to a new user streetmix
psql -v ON_ERROR_STOP=1 -d fvv_streetmix <<- EOSQL
    CREATE USER fvv_streetmix;
    GRANT ALL PRIVILEGES ON DATABASE fvv_streetmix TO fvv_streetmix;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fvv_streetmix;
    ALTER USER fvv_streetmix WITH ENCRYPTED PASSWORD 'password';
EOSQL

# create counter database
psql -v ON_ERROR_STOP=1 <<- EOSQL
    CREATE DATABASE fvv_counter;
EOSQL

########################################################################
# Counter Database
########################################################################

# change permission on the database counter to a new user counter
psql -v ON_ERROR_STOP=1 -d fvv_counter <<- EOSQL
    CREATE USER fvv_counter;
    GRANT ALL PRIVILEGES ON DATABASE fvv_counter TO fvv_counter;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fvv_counter;
    ALTER USER fvv_counter WITH ENCRYPTED PASSWORD 'password';
EOSQL

########################################################################
# Limesurvey Database
########################################################################

# create limesurvey database
psql -v ON_ERROR_STOP=1 <<- EOSQL
    CREATE DATABASE fvv_limesurvey;
EOSQL

# change permission on the database counter to a new user counter
psql -v ON_ERROR_STOP=1 -d fvv_limesurvey <<- EOSQL
    CREATE USER fvv_limesurvey;
    GRANT ALL PRIVILEGES ON DATABASE fvv_limesurvey TO fvv_limesurvey;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fvv_limesurvey;
    ALTER USER fvv_limesurvey WITH ENCRYPTED PASSWORD 'password';
EOSQL