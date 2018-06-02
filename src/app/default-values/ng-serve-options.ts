import { NgOptions } from '../models/angular-options';

export class NgserveOptions implements NgOptions {
    mandatoryArgs = {
    }

    optionalFlags = {
        host: {
            name: 'host',
            isActive: false,
            params: 'localhost',
            flag: '--host'
        },
        port: {
            name: 'port',
            isActive: false,
            params: 4200,
            flag: '--port'
        },
        open: {
            name: 'open',
            isActive: false,
            params: null,
            flag: '--open'
        }
    }

    createCommandString(): string {
        let command = ['ng serve'];

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
