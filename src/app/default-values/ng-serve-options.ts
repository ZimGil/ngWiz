import { NgOptions } from '../models/angular-options';

export class NgserveOptions implements NgOptions {
    mandatoryArgs = {
    }

    optionalFlags = {
        host: {
            name: 'host',
            isActive: false,
            value: 'localhost',
            flag: '--host'
        },
        port: {
            name: 'port',
            isActive: false,
            value: 4200,
            flag: '--port'
        },
        open: {
            name: 'open',
            isActive: false,
            value: null,
            flag: '--open'
        }
    }

    createCommandString(): string {
        let command = ['ng serve'];

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
