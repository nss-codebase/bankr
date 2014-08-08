#!/bin/bash

mongoimport --jsonArray --drop --db $1 --collection accounts     --file ../../db/accounts.json
mongoimport --jsonArray --drop --db $1 --collection transactions --file ../../db/transactions.json
mongoimport --jsonArray --drop --db $1 --collection transfers    --file ../../db/transfers.json

