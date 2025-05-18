export interface Field {
    type: string;
    label: string;
    name: string;
    options?: string[];
    validation?: ValidationRules;
    visibleIf?: { field: string; value: any };
    fields?: Field[];
    apiTrigger?: string[];
    apiAutoFill?: Record<string, string> | null;
}

export interface Props {
    schema: {
        fields: Field[];
    };
}

export type ValidationRules = {
    required?: boolean | string;
    minLength?: number | { value: number; message: string };
    maxLength?: number | { value: number; message: string };
    customValidation?: string;
    regex?: { value: RegExp; message: string };
    validate?: (value: any) => boolean | string | Promise<boolean | string>;
};