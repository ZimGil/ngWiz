import { NgOptions } from '../models/angular-options';
import { AngularClass } from '../models/angular-class.enum';

export class NgGenerateComponentOptions implements NgOptions {

    mandatoryArgs = {
        name: null,
        type: AngularClass.component
    };

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
        }
    };

    constructor(name: string = null) {
        this.mandatoryArgs.name = name;
    }

    createCommandString(): string {

        const command = ['ng generate', AngularClass[this.mandatoryArgs.type], this.mandatoryArgs.name];

        Object.keys(this.optionalFlags).forEach(optionName => {
            const option = this.optionalFlags[optionName];

            if (option.isActive) {
                command.push(option.flag);
                if (option.value) {
                    command.push(option.value.toString());
                }
            }
        });

        return command.join(' ');
    }
}
