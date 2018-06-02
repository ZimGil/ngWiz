import { AngularCommandOption } from "../models/angular-command-option.interface";

export const NG_SERVE_OPTIONS: AngularCommandOption = {
    host: {
        isActive: false,
        params: {
             hostname: 'localhost'
        }        
    },
    port: {
        isActive: false,
        params: {
            port: 4200
        }
    },
    open: {
        isActive: true,
        params: null
    },
    ssl: {
        isActive: false,
        params: null
    }
}
