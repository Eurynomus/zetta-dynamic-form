import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { renderField } from './FormFieldRenderer';
import type { Field, Props } from './types';

export default function FormBuilder({ schema }: Props) {
    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        clearErrors,
        formState: { errors }
    } = useForm({
        mode: 'onBlur'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const previousVisibleFieldsRef = useRef<string[]>([]);
    const watchAllFields = watch();

    useEffect(() => {
        reset(); // upon schema change, reset the form
    }, [schema, reset]);

    
    useEffect(() => { // find fields that are no longer visible and reset them
        const formValues = getValues();
        const currentVisibleFields = getVisibleFieldNames(schema.fields, formValues);
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
    }, [watchAllFields, schema.fields, setValue, getValues, clearErrors]);

    const onSubmit = (data: any) => {
        setIsSubmitting(true);

        const visibleFieldNames = getVisibleFieldNames(schema.fields, data);
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

    const getVisibleFieldNames = (fields: Field[], values: any): string[] => {
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

    const handleCloseSuccess = () => {
        setShowSuccess(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {schema.fields.map((field) => (
                    <div key={field.name}>{renderField(field, control, watch)}</div>
                ))}

                {Object.keys(errors).length > 0 && (
                    <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                        Please fix the errors above before submitting
                    </Alert>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ mt: 2 }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </form>

            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSuccess} severity="success">
                    Form submitted successfully!
                </Alert>
            </Snackbar>
        </>
    );
};