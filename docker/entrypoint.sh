#!/bin/bash
node app/bundle.js
npx sequelize db:migrate
node index.js