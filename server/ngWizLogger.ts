import { configure, getLogger, Logger } from 'log4js';
import { getAppDataPath } from 'appdata-path';
//
import moment = require('moment');
import fs = require('fs');
import path = require('path');

const LOG_FILES_DIR = getAppDataPath(`ngWiz${path.sep}logs`);
const dateInFormat = moment().format('DDMMYYTHHmmZZ'); // [171118T1510+0200]
const logFileName = `${this.LOG_FILES_DIR}/[${dateInFormat}].debug.log`;

export class ngWizLogger {

  constructor (level: string) {
    this.log = getLogger();
    this.log.level = level;
    configureLogger();
    deleteOldLogs(this.log);
  }

  log: Logger;
}

function configureLogger(): void {
  configure({
    appenders: {
      stdout: { type: 'stdout' },
      stderr: { type: 'stderr' },
      debug: { type: 'file', filename: logFileName },
      fileFilter: { type: 'logLevelFilter', appender: 'debug', level: 'DEBUG' },
      stderrFilter: { type: 'logLevelFilter', appender: 'stderr', level: 'ERROR' }
    },
    categories: {
      default: { appenders: [ 'fileFilter', 'stderrFilter', 'stdout' ], level: 'DEBUG' }
    }
  });
}

function deleteOldLogs(log: Logger): void {
  fs.readdir(LOG_FILES_DIR, (err, files) => {
    files.forEach(file => {

      if (path.extname(file) === '.log') {
        const filePath = LOG_FILES_DIR + path.sep + file;
        fs.stat(filePath, (statsErr, stats) => {
          const lastModify = moment(stats.mtime);

          if (lastModify.isBefore(moment().subtract(1, 'weeks'))) {
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
