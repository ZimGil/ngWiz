import fs = require('fs');
import path = require('path');
//
import { ConfigInterface } from './config.interface';
import getAppDataPath from 'appdata-path';

export function configMaker(): ConfigInterface {
  return handleJSONFile(fs.readFileSync('./config/config.json'));
}

function handleJSONFile(data): ConfigInterface {
  const config: ConfigInterface = {};
  const configFile = JSON.parse(data);

  // The port ngWiz server is listening to.
  configFile.port ? config.port = configFile.port : config.port = null;

  // The URL ngWiz will be accessible from.
  configFile.url ? config.url = configFile.url : config.url = null;

  // Launch ngWiz browser window when ngWiz starts.
  configFile.launchBrowser ? config.launchBrowser = configFile.launchBrowser : config.launchBrowser = null;

  // Directory to output log files.
  configFile.logDateFormat ? config.logDateFormat = configFile.logDateFormat : config.logDateFormat = null;

  // Date format for logging.
  if (configFile.logDirectory !== null && configFile.logDirectory !== undefined) {
    if (configFile.logDirectory === '') {
      config.logDirectory = getAppDataPath(`npm${path.sep}ngWiz${path.sep}logs`);
    } else {
      config.logDirectory = configFile.logDirectory;
    }
  }

  return config;
}
