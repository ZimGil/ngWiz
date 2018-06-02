import { NgOptions } from './../models/angular-options';
import { AngularCommandOptions } from './../models/angular-command-options.interface';
import { AngularClass } from './../models/angular-class.enum';

export class NgGenerateComponentOptions implements NgOptions {

    mandatoryArgs = {
        name: null,
        type: AngularClass.component
    }

    optionalFlags = {
        inLineTemplate: {
            name: 'inline-template',
            isActive: false,
            params: null,
            flag: '-t'
        },
        inLineStyle: {
            name: 'inline-style',
            isActive: false,
            params: null,
            flag: '-s'
        }
    }

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
