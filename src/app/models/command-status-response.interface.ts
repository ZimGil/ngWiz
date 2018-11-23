import { AngularCliProcessStatus } from './angular-cli-process-status.enum';

export interface CommandStatusResponse {
  id: string;
  status: AngularCliProcessStatus;
}
