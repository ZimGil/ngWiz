import childProcess = require('child_process');
import fs = require('fs');
import path = require('path');
//
import { NgWizLogger } from './ngWizLogger';

const logger = new NgWizLogger('debug');

export class AngularProjectChecker {

    resolve: Function;
    reject: Function;
    errorProcess: childProcess.ChildProcess;

    check() {
      this.errorProcess = childProcess.exec('ng new');

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
        this.errorProcess.stderr.on('data', error => this.catchError(error));
      });
    }

    isMainProjectFolder() {
      const file = 'angular.json';

      fs.access(file, fs.constants.F_OK, (err) => {
        if (err) {
          process.chdir('../');
          this.isMainProjectFolder();

        } else {
          const projectName = process.cwd().split(path.sep).pop();
          logger.log.debug(`running inside main folder of "${projectName}" project`);
          this.resolve(true);
        }
      });
    }

    catchError(error) {
      if (error.includes('Invalid options, "name" is required')) {
        logger.log.debug('not running inside an angular project');
        this.reject(false);

      } else if (error.includes('This command can not be run inside of a CLI project')) {
        logger.log.debug('running inside an angular project, looking for main folder');
        this.isMainProjectFolder();
      }
    }
  }
