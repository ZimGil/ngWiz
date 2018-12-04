#!/usr/bin/env node
import path = require('path');
import opn = require('opn');
//
import { runServer as ngWiz } from '../server/server';
import { ngWizConfig } from '../server/config/ng-wiz-config';

const STATIC_FILES_LOCATION = path.join(__dirname, '../ngWiz');
const config = ngWizConfig();
let launchBrowser = config.launchBrowser;

process.argv.forEach((val, index, array) => {
  if (val === '-l') {
    launchBrowser = true;
  }
  if (val === '-dl') {
    launchBrowser = false;
  }
});

// run the app
ngWiz(config.port, STATIC_FILES_LOCATION)
// Opens the url in the default browser
.then(() => launchBrowser ? opn(`http://localhost:${ config.port }`) : null)
.catch((error) => console.error(error));
