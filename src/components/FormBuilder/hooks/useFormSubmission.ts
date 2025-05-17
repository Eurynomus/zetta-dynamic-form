import { useState } from 'react';
import { getVisibleFieldNames } from '../utils/formUtils';
import type { Field } from '../types';

export function useFormSubmission(
    reset: Function,
    fields: Field[]
) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFormSubmit = (data: any) => {
        setIsSubmitting(true);

        const visibleFieldNames = getVisibleFieldNames(fields, data);
        const filteredData = Object.keys(data)
            .filter(key => visibleFieldNames.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {} as Record<string, any>);

        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            reset();
            console.log('Form Output:', filteredData);
        }, 2000);
    };

    return {
        isSubmitting,
        showSuccess,
        setShowSuccess,
        handleFormSubmit
    };
}