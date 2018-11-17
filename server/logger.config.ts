import { configure, getLogger } from "log4js";
import { getAppDataPath } from "appdata-path";
//
import moment = require('moment');
import fs = require('fs');
import path = require('path');

const LOG_FILES_DIR = getAppDataPath(`ngWiz${path.sep}logs`);
const logger = getLogger();

export function loggerConfig(): void {

    const dateInFormat = moment().format('DDMMYYTHHmmZZ'); // [171118T1510+0200]
    const logFileName = `${LOG_FILES_DIR}/[${dateInFormat}].debug.log`;

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

      deleteOldLogs();
}

function deleteOldLogs(): void {
  fs.readdir(LOG_FILES_DIR, (err, files) => {
    files.forEach(file => {

      if (path.extname(file) === '.log'){
        let filePath = LOG_FILES_DIR + path.sep + file;
        fs.stat(filePath, (err, stats) => {
          let lastModify = moment(stats.mtime);

          if (lastModify.isBefore(moment().subtract(1, 'weeks'))) {
            fs.unlink(filePath, err => {
              if (err) {
                throw err;
              }
              logger.info(`deleted old log file ${file}`)
            });
          }
        })
      }
    })
  })
}
