#!/usr/bin/env node

console.log(process.cwd());
console.log(__dirname);

const concurrently = require('concurrently');
const path = require('path');

concurrently([
  { command: `node ${ path.join(__dirname, '../dist/server/server.js') }`, name: 'server' },
  { command: `${ path.join(__dirname, '../node_modules/.bin/http-server') } ${ path.join(__dirname, '../dist/ngWiz') } -p 10111`, name: 'client' }
], {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 3,
}).catch((err) => console.error(err));
