import childProcess = require('child_process');

import { AngularCliProcessMap } from './models/angular-cli-process-map.model';
import { AngularCliProcessStatus } from './models/angular-cli-process-status.enum';
import { AngularCliProcess } from './models/angular-cli-process.model';

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

    isAngularCommand(commandString: string): boolean {
      const command = commandString.split(' ');

      if (command[0] === 'ng') {
        return true;
      } else if (command[0] === 'npm' && command[1] === 'build') {
        return true;
      } else {
        return false;
      }
    }

    changeProjectFolder(runningProcess) {
      const commandValues = runningProcess.command.toString().split(' ');
      const projectName = commandValues[2];
      process.chdir(`${process.cwd()}\\${projectName}`);
    }

    handleDataEvent(data, runningProcess: AngularCliProcess) {
      console.log(data);
      if (runningProcess.command.includes('ng serve ')){
        this.handleServeData(data, runningProcess);
      }
    }

    handleErrorEvent(error, runningProcess: AngularCliProcess) {
      if (runningProcess.command.includes('ng serve ')){
        this.handleServeErrorEvent(error, runningProcess);
      }else if (error.includes('error')) {
        runningProcess.status = AngularCliProcessStatus.error;
      }
      console.log(error);
    }

    handleServeData(data, runningProcess: AngularCliProcess) {
      if (data.includes('Compiled successfully')){
        runningProcess.status = AngularCliProcessStatus.done;
      }
    }

    handleServeErrorEvent(error, runningProcess: AngularCliProcess) {
      if (error.includes('Error: Command failed: ng serve')){
        runningProcess.status = AngularCliProcessStatus.error;
      }
    }

    handleCloseEvent(runningProcess) {
      if (runningProcess.status !== AngularCliProcessStatus.error) {
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

      if (this.isAngularCommand(runningProcess.command)) {
        runningProcess.process = childProcess.exec(currentProcess.params, callback);

        runningProcess.process.stdout.on('data', (data) => this.handleDataEvent(data, runningProcess));
        runningProcess.process.stderr.on('data', (error) => this.handleErrorEvent(error, runningProcess));
        runningProcess.process.stdout.on('close', () => this.handleCloseEvent(runningProcess));
      } else {
        this.handleErrorEvent('error: not angular command', runningProcess);
      }
    }
  }
