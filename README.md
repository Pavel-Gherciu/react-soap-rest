# react-soap-rest

Telecom SudParis Service Oriented Computing Project

Train filtering and booking application

Architecture:
Frontend -> Proxy -> SOAP Backend ->  REST Backend

Guide to run:

First modify the knex.js files in both soap and rest folders with the correct MySQL database credentials according to your system.
Then run:

`cd filtering-rest

npx knex migrate:latest

npx knex seed:run 
`
