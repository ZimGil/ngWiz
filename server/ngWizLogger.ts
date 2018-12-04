import { configure, getLogger, Logger } from 'log4js';
import moment = require('moment');
import fs = require('fs');
import path = require('path');
//
import { ngWizConfig } from './config/ng-wiz-config';

const config = ngWizConfig();
const dateInFormat = moment().format(config.logDateFormat);
const logFileName = `${config.logDirectory}/[${dateInFormat}].debug.log`;

export class NgWizLogger {

  log: Logger;

  constructor (level: string) {
    this.log = getLogger();
    this.log.level = level;
    this.configureLogger();
    this.deleteOldLogs(this.log);
  }

  configureLogger(): void {
    configure({
      appenders: {
        stdout: { type: 'stdout' },
        logFile: { type: 'file', filename: logFileName },
      },
      categories: {
        default: { appenders: [ 'logFile', 'stdout' ], level: 'DEBUG' }
      }
    });
  }

  private deleteOldLogs(log: Logger): void {
    fs.readdir(config.logDirectory, (err, files) => {
      files.forEach(file => {

        if (path.extname(file) === '.log') {
          const filePath = config.logDirectory + path.sep + file;
          fs.stat(filePath, (statsErr, stats) => {
            const lastModify = moment(stats.mtime);

            if (lastModify.isBefore(moment().subtract(3, 'days'))) {
              fs.unlink(filePath, unlinkErr => {
                if (unlinkErr) {
                  throw unlinkErr;
                }
                log.info(`Deleted old log file ${file}`);
              });
            }
          });
        }
      });
    });
  }
}
