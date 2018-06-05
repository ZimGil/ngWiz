import { NgGenerateComponentOptions } from '../default-values/ng-generate-component-options';
import { AngularCommandOptions } from './angular-command-options.interface';
import { NgOptions } from './angular-options';

export interface AngularCliCommand {
    name: string;
    options: NgOptions;
}
