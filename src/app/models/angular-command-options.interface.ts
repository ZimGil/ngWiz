export interface AngularCommandOptions {
    [optionName: string]: {
        name: string;
        isActive: boolean;
        params: string | number;
        flag: string;
    }
}
