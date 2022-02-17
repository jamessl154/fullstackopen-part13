## part13 
https://fullstackopen.com/en/part13

### Relational databases

Throughout the course we used MongoDB for storing data, a schemaless document database. Among [other comparisons](https://www.mongodb.com/compare/relational-vs-non-relational-databases), some advantages of a non-relational database are flexibility and speed/scale at the cost of structure and reliability ([ACID Transactions](https://www.mongodb.com/basics/acid-transactions)). The end product of this part, found in this repository, is a backend for the bloglist app built in part [4](https://github.com/jamessl154/fullstackopen/tree/main/part4) but replacing MongoDB and Mongoose with the relational database [PostgreSQL](https://www.postgresql.org/) and the ORM [Sequelize](https://sequelize.org/v6/) for the process of storing data.

To simplify development we used [Heroku Postgres](https://devcenter.heroku.com/articles/heroku-postgresql) to host the database. The database configuration can be found in ```util/db.js```. We used [migrations](https://sequelize.org/master/manual/migrations.html) to keep a record of changes to the database which also allowed us to roll back single changes that I made possible using the command ```npm run migration:down```. Used [express-async-errors](https://github.com/davidbanham/express-async-errors) allowing us to remove try catch boilerplate, because asynchronous errors are not caught by express by default. Centralized error handling into an error handling middleware found in ```controllers/errorHandler.js```.