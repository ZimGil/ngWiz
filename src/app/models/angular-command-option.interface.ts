export interface AngularCommandOption {
    [optionName: string]: {
        isActive: boolean;
        params: AngularCommandOptionParam
    }
}

export interface AngularCommandOptionParam {
    [paramName: string]: number | string;
}
