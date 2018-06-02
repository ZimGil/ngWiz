import { AngularClass } from '../models/angular-class.enum';
import { AngularCommandOptions } from "../models/angular-command-options.interface";
import { NgOptions } from "../models/angular-options";

// No options for Service Generation yet
export class NgGenerateServiceOptions implements NgOptions {

    mandatoryArgs = {
        name: null,
        type: AngularClass.service
    }

    optionalFlags = {}

    constructor(name: string = null) {
        this.mandatoryArgs.name = name;
    }
    
    createCommandString(): string {

        let command = ['ng generate', AngularClass[this.mandatoryArgs.type], this.mandatoryArgs.name];

        Object.keys(this.optionalFlags).forEach(optionName => {
            const option = this.optionalFlags[optionName];

            if (option.isActive) {
                command.push(option.flag);
                if (option.params) {
                    command.push(option.params.toString());
                }
            }  
        })

        return command.join(' ');
    }
}
