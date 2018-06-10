import { AngularCliCommand } from './angular-cli-command.interface';
export class CommandRequest {
    constructor(
        public command: string,
        public folder: string
    ) {}
}
