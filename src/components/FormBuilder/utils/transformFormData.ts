import type { Field } from "../types";


const toKey = (label: string) =>
    label.replace(/\s+/g, '').replace(/^./, c => c.toLowerCase());

export function transformFormData(
    fields: Field[],
    data: Record<string, any>
): Record<string, any> {
    const result: Record<string, any> = {};

    for (const field of fields) {
        if (field.type === 'group') {
            const groupKey = toKey(field.label);
            const nested = transformFormData(field.fields || [], data);

            if (Object.keys(nested).length > 0) {
                result[groupKey] = nested;
            }

        } else if (field.type === 'dropdown' && field.name && field.options) {
            const selected = field.options.find(opt => opt.label === data[field.name]);
            if (selected) result[field.name] = selected.value;
        } else if (field.name && data.hasOwnProperty(field.name)) {
            result[field.name] = data[field.name];
        }
    }

    return result;
}