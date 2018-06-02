import { NgGenerateComponentOptions } from '../default-values/ng-generate-component-options';
import { AngularCommandOptions } from './angular-command-options.interface';

export interface AngularCliCommand {
    name: string;
    options: NgGenerateComponentOptions;
}
