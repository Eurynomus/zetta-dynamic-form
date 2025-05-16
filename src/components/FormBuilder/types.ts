export interface Field {
    type: string;
    label: string;
    name: string;
    options?: string[];
    // validations?: any; // TO DO
    visibleIf?: { field: string; value: any };
    fields?: Field[];
}

export interface Props {
    schema: {
        fields: Field[];
    };
}