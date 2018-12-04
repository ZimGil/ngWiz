import fs = require('fs');
import path = require('path');
//
import getAppDataPath from 'appdata-path';
//
import { NgWizConfig } from './ng-wiz-config.interface';

export function ngWizConfig(): NgWizConfig {
  try {
    return handleJSONFile(fs.readFileSync('./config/config.json'));
  } catch {
    return defaultConfig;
  }
}

const defaultConfig = {
  port: 3000,
  launchBrowser: true,
  logDirectory: getAppDataPath(`npm${path.sep}node_modules${path.sep}ngWiz${path.sep}logs`),
  logDateFormat: 'DDMMYYTHHmmZZ',
  ngServeLaunchBrowser: true,
  ngServePort: 4200
};

function handleJSONFile(data): NgWizConfig {
  const config: NgWizConfig = defaultConfig;
  const configFile = JSON.parse(data);

  // The port ngWiz server is listening to.
  configFile.port ? config.port = configFile.port : config.port = defaultConfig.port;

  // Launch ngWiz browser window when ngWiz starts.
  configFile.launchBrowser ? config.launchBrowser = configFile.launchBrowser : config.launchBrowser = defaultConfig.launchBrowser;

  // Directory to output log files.
  configFile.logDateFormat ? config.logDateFormat = configFile.logDateFormat : config.logDateFormat = defaultConfig.logDateFormat;

  // Date format for logging.
  if (configFile.logDirectory !== null && configFile.logDirectory !== undefined && configFile.logDirectory !== '') {
    config.logDirectory = configFile.logDirectory;
  } else {
    config.logDirectory = defaultConfig.logDirectory;
  }

  // Launch browser when running development server with "ng serve -o"
  if (configFile.ngServeLaunchBrowser) {
    config.ngServeLaunchBrowser = configFile.ngServeLaunchBrowser;
   } else {
    config.ngServeLaunchBrowser = defaultConfig.ngServeLaunchBrowser;
   }

  // The port the development server run at
  configFile.ngservePort ? config.ngServePort = configFile.ngServePort : config.ngServePort = defaultConfig.ngServePort;

  return config;
}
