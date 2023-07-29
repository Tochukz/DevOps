'use strict';

/**
 * This is a Lambda function handler that is responsible for running the database migrations.
 */

require('dotenv').config();
const { exec } = require('child_process');
const { join } = require('path');
const fs = require('fs');

const sequelize = '/opt/nodejs/node_modules/sequelize-cli/lib/sequelize';
const configFile = join(__dirname, 'database/config.json');
const binary = fs.readFileSync(configFile);
const config = JSON.parse(binary.toString());
const tempConfig = '/tmp/config.json';
const preApprovedCommands = [
  'node /opt/nodejs/node_modules/sequelize-cli/lib/sequelize db:migrate',
  'node /opt/nodejs/node_modules/sequelize-cli/lib/sequelize db:migrate:undo',
  'node /opt/nodejs/node_modules/sequelize-cli/lib/sequelize db:migrate:undo:all',
  'node /opt/nodejs/node_modules/sequelize-cli/lib/sequelize db:seed:all',
  'node /opt/nodejs/node_modules/sequelize-cli/lib/sequelize db:seed:undo:all',
];
const NODE_ENV = process.env.NODE_ENV;

function setupConfig() {
  const { NODE_ENV, DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;
  const env = config[NODE_ENV];
  console.log('DB Name', DB_NAME);
  console.log('Deploying DB changes for ', NODE_ENV);
  if (!env) {
    console.log('undefined env');
    process.exit(1);
  }
  env.host = DB_HOST;
  env.database = DB_NAME;
  env.username = DB_USER;
  env.password = DB_PASS;
  fs.writeFileSync(tempConfig, JSON.stringify(config, null, 2));
}

function cleanupConfig() {
  console.log(`Config cleanup: ${tempConfig}`);
  fs.unlinkSync(tempConfig);
}

function defaultMigration(command, callbackFunc, callBackArg) {
  const migrationPath = join(__dirname, 'database/migrations');
  const migrationCommand = `node ${sequelize} ${command} --env ${NODE_ENV} --config ${tempConfig} --migrations-path ${migrationPath}`;
  if (preApprovedCommands.some((cmd) => migrationCommand.indexOf(cmd) == 0)) {
    console.log(`Running ${migrationCommand}`);
    exec(migrationCommand, (err, stdout, stderr) => {
      if (err || stderr) {
        cleanupConfig();
        const errorStr = `${err.toString() || stderr.toString()}`;
        console.log('Error: ', errorStr);
        callBackArg.reject(errorStr);
        return;
      }
      console.log('Success: ', stdout);
      callbackFunc(command, callBackArg, stdout);
    });
  } else {
    callBackArg.reject(`Unapproved command ${migrationCommand}`);
  }
}

function updateMigration(command, callbackFuncs, ouput) {
  const { NODE_ENV } = process.env;
  const { resolve, reject } = callbackFuncs;
  const migrationPath = join(__dirname, 'database/updates');
  const migrationCommand = `node ${sequelize} ${command} --migrations-path ${migrationPath} --env ${NODE_ENV} --config ${tempConfig}`;
  if (preApprovedCommands.some((cmd) => migrationCommand.indexOf(cmd) == 0)) {
    console.log(`Running ${migrationCommand}`);
    exec(migrationCommand, (err, stdout, stderr) => {
      if (err || stderr) {
        cleanupConfig();
        const errorStr = `${err.toString() || stderr.toString()}`;
        console.log('Error: ', errorStr);
        reject(errorStr);
        return;
      }
      console.log('Success: ', stdout);
      resolve(`Migrations: ${ouput} | Update: ${stdout}`);
      cleanupConfig();
    });
  } else {
    reject(`Unapproved command: ${migrationCommand}`);
  }
}

async function runMigration(undo = false) {
  setupConfig();
  let command = 'db:migrate';
  if (undo) {
    command = 'db:migrate:undo';
  }
  return new Promise((resolve, reject) => {
    defaultMigration(command, updateMigration, { resolve, reject });
  });
}

async function runSeeder() {
  setupConfig();
  return new Promise((resolve, reject) => {
    const seedPath = join(__dirname, 'database/seeders');
    const seederCommand = `node ${sequelize} db:seed:all --env ${NODE_ENV} --config ${tempConfig} --seeders-path ${seedPath}`;
    if (preApprovedCommands.some((cmd) => seederCommand.indexOf(cmd) == 0)) {
      console.log(`Running ${seederCommand}`);
      exec(seederCommand, (err, stdout, stderr) => {
        if (err || stderr) {
          const errorStr = `${err.toString() || stderr.toString()}`;
          console.log('Error: ', errorStr);
          reject(errorStr);
          return;
        }
        cleanupConfig();
        resolve(stdout);
      });
    } else {
      reject(`Unapproved commmand: ${seederCommand}`);
    }
  });
}

async function dbReset() {
  return new Promise((resolve, reject) => {
    setupConfig();
    const migrationPath = join(__dirname, 'database/migrations');
    const seedPath = join(__dirname, 'database/seeders');
    const undoSeedings = `node ${sequelize} db:seed:undo:all --env ${NODE_ENV} --config ${tempConfig} --seeders-path ${seedPath}`;
    const undoMigrations = `node ${sequelize} db:migrate:undo:all --migrations-path ${migrationPath} --env ${NODE_ENV} --config ${tempConfig}`;
    const redoMigrations = `node ${sequelize} db:migrate --migrations-path ${migrationPath} --env ${NODE_ENV} --config ${tempConfig}`;
    const seedDatabase = `node ${sequelize} db:seed:all --env ${NODE_ENV} --config ${tempConfig} --seeders-path ${seedPath}`;
    const commands = [
      undoSeedings,
      undoMigrations,
      redoMigrations,
      seedDatabase,
    ];
    let outputs;
    const rerun = (i) => {
      if (preApprovedCommands.some((cmd) => commands[i].indexOf(cmd) == 0)) {
        console.log(`Running ${commands[i]}`);
        exec(commands[i], (err, stdout, stderr) => {
          if (err || stderr) {
            const errorStr = `${err.toString() || stderr.toString()}`;
            console.log('Error: ', errorStr);
            reject(errorStr);
            return;
          }
          console.log(stdout);
          outputs += stdout + '\n';
          if (i == commands.length - 1) {
            cleanupConfig();
            resolve(outputs);
            return;
          }
          rerun(++i);
        });
      } else {
        reject(`Unapproved command ${commands[i]}`);
      }
    };
    rerun(0);
  });
}

exports.handler = async function (event) {
  const action = event.action;
  let message = '';
  switch (action) {
    case 'migrate':
      message = await runMigration();
      break;
    case 'undo':
      message = await runMigration(true);
      break;
    case 'seed':
      message = await runSeeder();
      break;
    case 'reset':
      message = await dbReset();
      break;
    default:
      message = `Unsupported action: ${action}`;
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
