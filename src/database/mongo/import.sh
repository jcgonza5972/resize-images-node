#!/bin/bash

HOST=$1
PROJECT_DIRECTORY=$2
MONGO_USER=$3
MONGO_PASS=$4
MONGO_DB_NAME=$5

FILES=$(ls ${PROJECT_DIRECTORY}/database/data/*.json | sort -n -t _ -k 2)

while : ; do
    CHECK=$(mongosh --host ${HOST} --username ${MONGO_USER} --password ${MONGO_PASS} --authenticationDatabase admin ${MONGO_DB_NAME} --eval 'db.version()' | tail -1)
    echo $CHECK
    if [[ $CHECK == *"6"* ]]
    then
        break
    fi
    echo "[$(date)] Checking the connection to DB..."
    sleep 1
done

echo "[$(date)] I am connected to database!"

for AFILE in ${FILES[@]}
do
    echo -e "[$(date)] Processing \t$AFILE"
    COLLECTION=$(basename $AFILE .json)
    mongoimport --host ${HOST} --username ${MONGO_USER} --password ${MONGO_PASS} --authenticationDatabase admin --db ${MONGO_DB_NAME} --collection ${COLLECTION} --mode upsert --file ${AFILE} --jsonArray
    echo -e "[$(date)] Done \t\t$AFILE"
done

echo "[$(date)] All files have been processed 🍻"