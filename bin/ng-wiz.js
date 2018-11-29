#!/usr/bin/env node
const concurrently = require('concurrently');
const path = require('path');
const opn = require('opn');
const ngWiz = require('../dist/server/server');

const PORT = 3000;
const STATIC_FILES_LOCATION = path.join(__dirname, '../dist/ngWiz');

let isOpenBrowser;

process.argv.forEach((val, index, array) => {
  if (val === '-o') {
      isOpenBrowser = true;
  }
});


// run the app
ngWiz(PORT, STATIC_FILES_LOCATION, isOpenBrowser)
// Opens the url in the default browser
.then(() => isOpenBrowser ? opn(`http://localhost:${ PORT }`) : null)
.catch((error) => console.error(error));
