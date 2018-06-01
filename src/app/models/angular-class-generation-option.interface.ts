export interface AngularClassGenerationOption {
    [optionName: string]: {
        isActive: boolean;
        params: AngularClassGenerationOptionParam[]
    }
}

export interface AngularClassGenerationOptionParam {
    [paramName: string]: number | string;
}



export const COMPONENT_GENERATION_OPTIONS: AngularClassGenerationOption = {
    inLineTemplate: {
        isActive: false,
        params: null
    },
    inLineStyle: {
        isActive: false,
        params: null
    }
}
