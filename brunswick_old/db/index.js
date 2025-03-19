const debug = require("debug")("sql");
const chalk = require("chalk");
const Sequelize = require("sequelize");
const pkg = require("../package.json");

const name = process.env.DATABASE_NAME || pkg.name;
let PRODUCTION;
PRODUCTION = process.env.NODE_ENV === 'production';
// DEV
// `postgres://localhost:5432/${name}`;

// TEST
// `postgres://postgres:89b64e8eac2c47dd54b0f60e604969a5@nodejs01.imust.org:28081/brunswick_test`;

// PROD
// `postgres://postgres:1743025f4243cd02d480fdc6f3cd9f36@nodejs01.imust.org:5432/brunswick_prod`;
const database_test = `postgres://postgres:postgres@postgres:5432/brunswick_test`;
const database_prod =  `postgres://postgres:74c34d89269f90c9928b6e717b12e729@dokku-postgres-brunswick-prod:5432/brunswick_prod`;
const url = PRODUCTION ? database_prod : database_test;


console.log(chalk.yellow(`Opening database connection to ${url} / ${name}`));

// create the database instance
const db = (module.exports = new Sequelize(url, {
  logging: console.log, // export DEBUG=sql in the environment to get SQL queries
  define: {
    underscored: true, // use snake_case rather than camelCase column names
    freezeTableName: true, // don't change table names from the one specified
    timestamps: true // automatically include timestamp columns
  }
}));

// pull in our models
require("./models");

// sync the db, creating it if necessary
function sync(retries = 0, maxRetries = 5) {
  return db
    .sync({ force: false })
    .then(ok => console.log(`Synced models to db ${url}`))
    .catch(fail => {
      console.log(fail);
    });
}

db.didSync = sync();
