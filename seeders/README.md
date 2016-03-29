# Getting Started

## Database Set-up

1. npm install
2. npm install -g sequelize sequelize-cli pg pg-hstore
3. psql postgres, then CREATE DATABASE photonai;
4. sequelize db:migrate (psql photonai, then \d to check tables were created)

## Seed Database

1. node seeders/seed_photos.js
2. node seeders/seed_users.js
3. node seeders/seed_tags.js
