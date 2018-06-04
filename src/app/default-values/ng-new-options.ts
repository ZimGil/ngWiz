import { NgOptions } from '../models/angular-options';
import { AngularCommandOptions } from "../models/angular-command-options.interface";

export class NgNewOptions implements NgOptions {

    mandatoryArgs = {
        name: null
    }

    optionalFlags = {
        inLineTemplate: {
            name: 'inline-template',
            isActive: false,
            value: null,
            flag: '-t'
        },
        inLineStyle: {
            name: 'inline-style',
            isActive: false,
            value: null,
            flag: '-s'
        },
        routing: {
            name: 'routing',
            isActive: false,
            value: null,
            flag: '--routing'
        }
    }

    createCommandString(): string {

        let command = ['ng new',this.mandatoryArgs.name];

        Object.keys(this.optionalFlags).forEach(optionName => {
            const option = this.optionalFlags[optionName];

            if (option.isActive) {
                command.push(option.flag);
                if (option.value) {
                    command.push(option.value.toString());
                }
            }  
        })

        return command.join(' ');
    }
}
