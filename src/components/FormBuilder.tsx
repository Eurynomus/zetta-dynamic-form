import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, RadioGroup, FormControlLabel, Radio, Button, CircularProgress } from '@mui/material';

interface Field {
    type: string;
    label: string;
    name: string;
    options?: string[];
    // validations?: any; // TO DO
    visibleIf?: { field: string; value: any };
    fields?: Field[];
}

interface Props {
    schema: {
        fields: Field[]
    };
}

export default function FormBuilder({ schema }: Props) {
    const { control, handleSubmit, watch, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        reset({}); // upon schema change, reset the form -- TO DO: add a loading state (spinner?)
    }, [schema, reset]);

    const onSubmit = (data: any) => {
        setIsSubmitting(true);

        const visibleFieldNames = getVisibleFieldNames(schema.fields, data);
        const filteredData = Object.keys(data)
            .filter((key) => visibleFieldNames.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {} as Record<string, any>);

        console.log('Form Output:', filteredData);

        setTimeout(() => {
            setIsSubmitting(false);
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

    const renderField = (field: Field) => {
        const watchedValue = field.visibleIf?.field ? watch(field.visibleIf.field) : true;
        const isVisible = field.visibleIf ? watchedValue === field.visibleIf.value : true;

        if (!isVisible) return null;

        {/* TO DO: Add validation for each field type and animations */ }

        switch (field.type) {
            case 'text':
            case 'textarea':
                return (
                    <Controller
                        key={field.name}
                        name={field.name}
                        control={control}
                        defaultValue=""
                        render={({ field: rhfField }) => (
                            <TextField
                                {...rhfField}
                                label={field.label}
                                fullWidth
                                multiline={field.type === 'textarea'}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />
                );
            case 'dropdown':
                return (
                    <FormControl fullWidth sx={{ mb: 2 }} key={field.name}>
                        <InputLabel>{field.label}</InputLabel>
                        <Controller
                            name={field.name}
                            control={control}
                            defaultValue=""
                            render={({ field: rhfField }) => (
                                <Select {...rhfField} label={field.label}>
                                    {field.options?.map((opt) => (
                                        <MenuItem key={opt} value={opt}>
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                );
            case 'checkbox':
                return (
                    <FormControlLabel
                        key={field.name}
                        control={
                            <Controller
                                name={field.name}
                                control={control}
                                defaultValue={false}
                                render={({ field: rhfField }) => (
                                    <Checkbox {...rhfField} checked={rhfField.value || false} />
                                )}
                            />
                        }
                        label={field.label}
                    />
                );
            case 'radio':
                return (
                    <FormControl key={field.name}>
                        <label>{field.label}</label>
                        <Controller
                            name={field.name}
                            control={control}
                            defaultValue=""
                            render={({ field: rhfField }) => (
                                <RadioGroup {...rhfField}>
                                    {field.options?.map((opt) => (
                                        <FormControlLabel
                                            key={opt}
                                            value={opt}
                                            control={<Radio />}
                                            label={opt}
                                        />
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                );

            // TO DO: add "text with custom validations" field type

            case 'group':
                return (
                    <Box sx={{ border: '1px solid #ccc', p: 2, mb: 2, borderRadius: 2 }} key={field.name}>
                        <InputLabel sx={{ mb: 2 }}>{field.label}</InputLabel>
                        {field.fields?.map((subField) => renderField(subField))}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {schema.fields.map((field) => (
                <div key={field.name}>{renderField(field)}</div>
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