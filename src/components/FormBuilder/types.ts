export interface Field {
    type: string;
    label: string;
    name: string;
    options?: string[];
    validation?: ValidationRules;
    validationKey?: string; // for custom validations
    visibleIf?: { field: string; value: any };
    fields?: Field[];
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
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: any) => boolean | string | Promise<boolean | string>;
  email?: boolean | { message: string };
};