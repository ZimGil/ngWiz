export interface AngularCommandOptions {
    [optionName: string]: {
        name: string;
        isActive: boolean;
        value: string | number;
        flag: string;
    };
}
