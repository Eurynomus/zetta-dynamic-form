import { useEffect, useRef } from 'react';
import { getVisibleFieldNames } from '../utils/formUtils';
import type { Field } from '../types';

export function useVisibleFields(
    fields: Field[],
    watchAllFields: any,
    getValues: Function,
    setValue: Function,
    clearErrors: Function
) {
    const previousVisibleFieldsRef = useRef<string[]>([]);

    useEffect(() => {
        const formValues = getValues();
        const currentVisibleFields = getVisibleFieldNames(fields, formValues);
        const previousVisibleFields = previousVisibleFieldsRef.current;

        const fieldsToReset = previousVisibleFields.filter(
            (fieldName) => !currentVisibleFields.includes(fieldName)
        );

        if (fieldsToReset.length > 0) {
            fieldsToReset.forEach((fieldName) => {
                setValue(fieldName, undefined, {
                    shouldDirty: false,
                    shouldValidate: false
                });

                clearErrors(fieldName);
            });
        }

        previousVisibleFieldsRef.current = currentVisibleFields;
    }, [watchAllFields, fields, setValue, getValues, clearErrors]);
}