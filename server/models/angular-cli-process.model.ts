import { ChildProcess } from 'child_process';
//
import { AngularCliProcessStatus } from './angular-cli-process-status.enum';

export interface AngularCliProcess {
    process: ChildProcess;
    status: AngularCliProcessStatus;
    command: string;
  }
