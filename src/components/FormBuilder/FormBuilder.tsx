import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button, CircularProgress } from '@mui/material';
import { renderField } from './FormFieldRenderer';
import type { Field, Props } from './types';


export default function FormBuilder({ schema }: Props) {
    const { control, handleSubmit, watch, reset, setValue, getValues } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const previousVisibleFieldsRef = useRef<string[]>([]);
    const watchAllFields = watch();

    useEffect(() => {
        reset({}); // upon schema change, reset the form -- TO DO: add a loading state (spinner?)
    }, [schema, reset]);

    useEffect(() => {
        const formValues = getValues();
        const currentVisibleFields = getVisibleFieldNames(schema.fields, formValues);
        const previousVisibleFields = previousVisibleFieldsRef.current;

        // find fields that were visible before
        const fieldsToReset = previousVisibleFields.filter(
            (fieldName) => !currentVisibleFields.includes(fieldName)
        );

        // reset values for fields that are no longer visible
        if (fieldsToReset.length > 0) {
            fieldsToReset.forEach((fieldName) => {
                setValue(fieldName, undefined, { shouldDirty: false });
            });
        }

        // update the reference to track current visible fields
        previousVisibleFieldsRef.current = currentVisibleFields;
    }, [watchAllFields, schema.fields]);

    const onSubmit = (data: any) => {
        setIsSubmitting(true);

        const visibleFieldNames = getVisibleFieldNames(schema.fields, data);
        const filteredData = Object.keys(data)
            .filter((key) => visibleFieldNames.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {} as Record<string, any>);

        setTimeout(() => {
            setIsSubmitting(false);
            console.log('Form Output:', filteredData);
            // TO DO: add a success message
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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {schema.fields.map((field) => (
                <div key={field.name}>{renderField(field, control, watch)}</div>
            ))}
            <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
        </form>
    );
};