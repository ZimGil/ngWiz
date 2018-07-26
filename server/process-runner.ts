import * as childProcess from 'child_process';

import { AngularCliProcessMap } from "./models/angular-cli-process-map.model";
import { AngularCliProcessStatus } from "./models/angular-cli-process-status.enum";

export class ProcessRunner {

    runningProcesses: AngularCliProcessMap = {};
  
    constructor() {}
  
    static guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  
    changeProjectFolder(runningProcess) {
      const commandValues = runningProcess.command.toString().split(' ');
      const projectName = commandValues[2];
      process.chdir(`${process.cwd()}\\${projectName}`)
    }
  
    handleErrorEvent(error, runningProcess) {
      if (error.includes('error')) {
        runningProcess.status = AngularCliProcessStatus.error;
      }
      console.log(error);
    }
  
    handleCloseEvent(runningProcess) {
      if (runningProcess.status != AngularCliProcessStatus.error) {
        runningProcess.status = AngularCliProcessStatus.done;
        if (runningProcess.command.toString().includes(' new ')) {
          this.changeProjectFolder(runningProcess);
        }
      }
      console.log('###################################################################################');
    }

    run(currentProcess) {
      this.runningProcesses[currentProcess.id] = {
        process: null,
        status: AngularCliProcessStatus.working,
        command: currentProcess.params
      };

      const runningProcess = this.runningProcesses[currentProcess.id];

      const callback = (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          runningProcess.status = AngularCliProcessStatus.error;
          return;
        }
      };

      runningProcess.process = childProcess.exec(currentProcess.params, callback);

      runningProcess.process.stdout.on('data', (data) => console.log(data));
      runningProcess.process.stderr.on('data', (error) => this.handleErrorEvent(error, runningProcess));
      runningProcess.process.stdout.on('close', () => this.handleCloseEvent(runningProcess));
    }
  }
