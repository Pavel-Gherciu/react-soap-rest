# react-soap-rest

## Telecom SudParis Service Oriented Computing Project

Train filtering and booking application

Architecture:
Frontend -> Proxy -> SOAP Backend ->  REST Backend

**Guide to run:**

First modify the knex.js files in both soap and rest folders with the correct MySQL database credentials according to your system.
Then run:

`cd filtering-rest`

`npx knex migrate:latest`

`npx knex seed:run `

`npm start `

Now that you are already running the REST service, open another terminal and run this for the SOAP service:

`cd booking-soap`

`node server.js`

Now open another terminal and run:

`node proxy.js`

And finally for the frontend from yet another terminal:

`cd front`

`npm start`
