#!/bin/bash

# build node app again with docker env variables
node app/bundle.js

# execute latest migration
npx sequelize db:migrate

# publish app
node index.js