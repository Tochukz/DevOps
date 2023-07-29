const {join } = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV.trim();
console.info('running prebuild script...');
console.info('env=', env);

function copyFile(source, target) {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(target);
    readStream.pipe(writeStream);
}

const config = join(__dirname, '../src/config/config.js');

let soureFile;
if (env == 'development') {
    soureFile = 'dev.js';
} else if (env == 'uat') {
    soureFile = 'uat.js';
} else if(env ==  'production'){
    soureFile =  'prod.js';
} else {
    throw new Error(`invalid env: ${env}`);
}

const source = join(__dirname, `../src/config/${soureFile}`);
copyFile(source, config);