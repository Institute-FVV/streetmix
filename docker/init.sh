#!/bin/bash

# define pg user, oterwise migrations fails
export PGUSER=postgres
export PGDATABASE=postgres

# execute migration as current user "postgres"
cd /usr/src/app
npx sequelize db:create
npx sequelize db:migrate

# change permission on the database streetmix to a new user streetmix
psql -v ON_ERROR_STOP=1 -d streetmi <<- EOSQL
    CREATE USER streetmix;
    GRANT ALL PRIVILEGES ON DATABASE streetmix TO streetmix;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO streetmix;
    ALTER USER streetmix WITH ENCRYPTED PASSWORD 'password';
EOSQL