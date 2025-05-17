import type { Field } from '../types';

export const getVisibleFieldNames = (fields: Field[], values: any): string[] => {
    let names: string[] = [];

    fields.forEach((field) => {
        const isVisible = !field.visibleIf || values[field.visibleIf.field] === field.visibleIf.value;

        if (isVisible) {
            if (field.type === 'group' && field.fields) {
                names = names.concat(getVisibleFieldNames(field.fields, values));
            } else {
                names.push(field.name);
            }
        }
    });

    return names;
};