#!/usr/bin/env node
const concurrently = require('concurrently');
const path = require('path');
const opn = require('opn');

const clientSideDistFolder = path.join(__dirname, '../dist/ngWiz');
const serverSideDistFolder = path.join(__dirname, '../dist/server/server.js');
const httpServer = path.join(__dirname, '../node_modules/.bin/http-server');

concurrently([
  { command: `node ${ serverSideDistFolder }`, name: 'server', prefixColor: 'bgBlue.bold' },
  { command: `${ httpServer } ${ clientSideDistFolder } -p 10111`, name: 'client', prefixColor: 'bgMagenta.bold' }
], {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 3,
});

// Opens the url in the default browser
// it will wait 1 second since servers will run until the app exits
// so we can't just 'then' them
wait(1000)
.then(() => opn('http://localhost:10111'))
.catch((error) => console.error(error));


function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds || 0);
  })
}
