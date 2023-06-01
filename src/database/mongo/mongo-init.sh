#!/bin/bash

echo "Creating user for db...👤"
mongo --eval "db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD'); db = db.getSiblingDB('$MONGO_DB_NAME'); db.createUser({ user: '$MONGO_USER', pwd: '$MONGO_PASS', roles: [{ role: 'readWrite', db: '$MONGO_DB_NAME' }] });"
echo "User created...✅"