import { AngularCommandOptions } from './angular-command-options.interface';

export interface NgOptions {
    mandatoryArgs: {
        [argName: string]: number | string;
    };
    optionalFlags: AngularCommandOptions;

    createCommandString(): string;
}
