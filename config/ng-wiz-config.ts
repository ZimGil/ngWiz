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
  url: 'http://localhost',
  launchBrowser: true,
  logDirectory: getAppDataPath(`npm${path.sep}ngWiz${path.sep}logs`),
  logDateFormat: 'DDMMYYTHHmmZZ'
};

function handleJSONFile(data): NgWizConfig {
  const config: NgWizConfig = defaultConfig;
  const configFile = JSON.parse(data);

  // The port ngWiz server is listening to.
  configFile.port ? config.port = configFile.port : config.port = defaultConfig.port;

  // The URL ngWiz will be accessible from.
  configFile.url ? config.url = configFile.url : config.url = defaultConfig.url;

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

  return config;
}
