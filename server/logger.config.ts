import { configure } from "log4js";
import { getAppDataPath } from "appdata-path";
import moment = require('moment');

export function loggerConfig(): void {

    const dateInFormat = moment().format('DDMMYYTHHmmZZ');
    // const utcOffset = moment().zone();
    const logFileName = `${getAppDataPath('ngWiz')}/logs/[${dateInFormat}].debug.log`;

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
