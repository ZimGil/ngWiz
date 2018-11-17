import { configure } from "log4js";
import moment = require('moment');

export function loggerConfig(): void {

    const dateInFormat = moment().format('DD-MM-YYYY');
    const logFileName = `../logs/[${dateInFormat}].debug.log`;

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
