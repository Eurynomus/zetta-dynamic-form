export default function applyCustomValidation(validation?: any) {
    if (!validation) return {};

    const rules: any = { ...validation };

    if (validation.customValidation === 'string') {
        rules.validate = (value: string) =>
            /^[A-Za-z\s]+$/.test(value) || 'Only letters are allowed';
    }

    if (validation.customValidation === 'number') {
        rules.validate = (value: string) =>
            /^[0-9]+$/.test(value) || 'Only numbers are allowed';
    }

    if (validation.customValidation === 'email') {
        rules.validate = (value: string) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email format';
    }

    if (validation.regex?.value) {
        const regex = new RegExp(validation.regex.value);
        const message = validation.regex.message || 'Invalid format';

        const existingValidate = rules.validate;
        rules.validate = (value: string) => {
            if (existingValidate) {
                const result = existingValidate(value);
                if (result !== true) return result;
            }
            return regex.test(value) || message;
        };
    }

    return rules;
}