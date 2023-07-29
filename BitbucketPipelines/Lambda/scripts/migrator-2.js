'use strict';

/**
 * This is a Lambda function handler that is responsible for running the database migrations.
 */

require('dotenv').config();
const { join } = require('path');
const fs = require('fs');

const { Sequelize } = require('sequelize');
const Umzug = require('umzug');

let databasePath = 'database';
if (process.env.NODE_ENV == 'local') {
  databasePath = '../database';
}
const configFile = join(__dirname, `${databasePath}/config.json`);
const binary = fs.readFileSync(configFile);
const config = JSON.parse(binary.toString());

function getSequelizeInstance() {
  const { NODE_ENV, DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;
  const dbConfig = config[NODE_ENV];
  console.log('DB Name', DB_NAME);
  console.log('Deploying DB changes for ', NODE_ENV);
  if (!dbConfig) {
    console.log('undefined env');
    process.exit(1);
  }
  dbConfig.host = DB_HOST;
  dbConfig.database = DB_NAME;
  dbConfig.username = DB_USER;
  dbConfig.password = DB_PASS;

  return new Sequelize(dbConfig);
}

function setupMigrator(isSeeder = false) {
  const sequelize = getSequelizeInstance();
  let migrationPath = join(__dirname, `${databasePath}/migrations`);
  let storage = 'sequelize';
  if (isSeeder) {
    migrationPath = join(__dirname, `${databasePath}/seeders`);
    storage = {
      logMigration() {},
      unlogMigration() {},
      executed() {
        return [];
      },
    };
  }
  const umzug = new Umzug({
    migrations: {
      path: migrationPath,
      params: [sequelize.getQueryInterface(), Sequelize],
      pattern: /^(?!.*\.d\.ts$).*\.(cjs|js|cts|ts)$/,
    },
    storage,
    storageOptions: {
      sequelize: sequelize,
    },
    logger: false,
  });

  return umzug;
}

function outputResults(results) {
  results.forEach(({ file }) => {
    console.log(`===== ${file}`);
  });
}

async function runMigration() {
  const migrator = setupMigrator();
  console.log('Running migrations...');
  const results = await migrator.up();
  outputResults(results);
  return 'Migration complete!';
}

async function undoMigration(undoAll = false) {
  const migrator = setupMigrator();
  console.log('Undoing migrations...');
  let results = [];
  if (undoAll) {
    await migrator.down({ to: 0 });
  } else {
    await migrator.down();
  }
  outputResults(results);
  return 'Undo migration complete!';
}

async function runSeeder() {
  const migrator = setupMigrator(true);
  console.log('Running seeder...');
  const results = await migrator.up();
  outputResults(results);
  return 'Seeding complete!';
}

async function migrationInfo() {
  const migrator = setupMigrator();
  console.log('Running migration info...');
  const pending = await migrator.pending();
  const executed = await migrator.executed();
  console.log('Pending Migrations:');
  if (pending.length) {
    outputResults(pending);
  } else {
    console.log('No pending migration');
  }
  console.log('Executed migrations:');
  if (executed.length) {
    outputResults(executed);
  } else {
    console.log('No executed migration');
  }
  return 'DB info complete!';
}

async function dbReset() {
  await undoMigration(true);
  await runMigration();
  await runSeeder();
  return 'Reset Complete!';
}

async function showMigrationMeta() {
  const sequelize = getSequelizeInstance();
  const result = await sequelize
    .getQueryInterface()
    .rawSelect('SequelizeMeta', { raw: true, plain: false }, ['name']);
  console.log(result);
  return result;
}

async function showAllTables() {
  const sequelize = getSequelizeInstance();
  const result = await sequelize.getQueryInterface().showAllTables();
  console.log(result);
  return result;
}

async function describeTable(describeTable) {
  const parts = describeTable.split(':');
  if (parts.length != 2) {
    console.log(`Invalid describe action: ${describeTable}`);
    return;
  }
  const tableName = parts[1];
  const sequelize = getSequelizeInstance();
  const result = await sequelize.getQueryInterface().describeTable(tableName);
  console.log(result);
  return result;
}

exports.handler = async function (event) {
  const action = event.action;
  let message = '';
  switch (action) {
    case 'migrate':
      message = await runMigration();
      break;
    case 'migrate:undo':
      message = await undoMigration();
      break;
    case 'migrate:undo:all':
      message = await undoMigration(true);
      break;
    case 'seed':
      message = await runSeeder();
      break;
    case 'db:info':
      message = await migrationInfo();
      break;
    case 'reset:all':
      message = await dbReset();
      break;
    case 'db:meta':
      message = await showMigrationMeta();
      break;
    case 'all:tables':
      message = await showAllTables();
      break;
    default:
      if (action.includes('describe:')) {
        message = await describeTable(action);
      } else {
        console.log(`Unsupported action: ${action}`);
      }
  }

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: message,
  };
  return response;
};
