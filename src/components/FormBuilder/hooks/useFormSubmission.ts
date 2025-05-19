import { useState } from 'react';
import { getVisibleFieldNames } from '../utils/formUtils';
import type { Field } from '../types';
import { transformFormData } from '../utils/transformFormData';

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

        const nestedData = transformFormData(fields, filteredData);

        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            reset();
            console.log('Form Output:', nestedData);
        }, 2000);
    };

    return {
        isSubmitting,
        showSuccess,
        setShowSuccess,
        handleFormSubmit
    };
}