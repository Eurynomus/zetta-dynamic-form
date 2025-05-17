import { useEffect, useRef } from 'react';
import { mockApiCall } from '../../../services/mockApi';
import type { Field } from '../types';

export function useApiAutoFill(
    fields: Field[],
    watchAllFields: any,
    getValues: Function,
    setValue: Function
) {
    const lastApiInputsRef = useRef<Record<string, Record<string, string>>>({});

    useEffect(() => {
        const formValues = getValues();

        const callApis = async () => {
            for (const field of fields) {
                if (field.apiTrigger && field.apiAutoFill) {
                    const shouldCallApi = field.apiTrigger.every((trigger) => formValues[trigger]);

                    if (shouldCallApi) {
                        const currentInput = Object.fromEntries(
                            field.apiTrigger.map((key) => [key, formValues[key]])
                        );

                        const lastFieldInput = lastApiInputsRef.current[field.name] || {};

                        if (
                            JSON.stringify(currentInput) === JSON.stringify(lastFieldInput)
                        ) {
                            continue;
                        }

                        lastApiInputsRef.current[field.name] = currentInput;

                        try {
                            const apiData = await mockApiCall(currentInput);

                            Object.entries(field.apiAutoFill).forEach(([apiKey, formField]) => {
                                if (apiKey in apiData) {
                                    setValue(formField, apiData[apiKey], {
                                        shouldDirty: true,
                                        shouldValidate: true
                                    });
                                }
                            });
                        } catch (err) {
                            console.error('Error:', err);
                        }
                    }
                }
            }
        };

        const debounced = setTimeout(callApis, 500);
        return () => clearTimeout(debounced);
    }, [watchAllFields, fields, setValue, getValues]);
}