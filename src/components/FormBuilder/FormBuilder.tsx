import { useForm } from 'react-hook-form';
import { renderField } from './FormFieldRenderer';
import { useVisibleFields } from './hooks/useVisibleFields';
import { useApiAutoFill } from './hooks/useApiAutoFill';
import SubmitButton from './components/SubmitButton';
import FormErrorAlert from './components/FormErrorAlert';
import SuccessNotification from './components/SuccessNotification';
import { useFormSubmission } from './hooks/useFormSubmission';
import type { Props } from './types';

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

    const watchAllFields = watch();
    const { showSuccess, setShowSuccess, isSubmitting, handleFormSubmit } = useFormSubmission(reset, schema.fields);

    // useEffect(() => {
    //     reset();
    // }, [schema, reset]);

    // useEffect(() => {
    //     if (Object.keys(apiErrors).length > 0) {
    //         setApiErrors({});
    //     }
    // }, [watchAllFields]);


    useVisibleFields(schema.fields, watchAllFields, getValues, setValue, clearErrors);
    useApiAutoFill(schema.fields, watchAllFields, getValues, setValue);

    const onSubmit = (data: any) => {
        handleFormSubmit(data);
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {schema.fields.map((field, index) => (
                    <div key={index}>{renderField(field, control, watch)}</div>
                ))}

                <FormErrorAlert errors={errors} />

                <SubmitButton isSubmitting={isSubmitting} />
            </form>

            <SuccessNotification
                open={showSuccess}
                onClose={handleCloseSuccess}
            />
        </>
    );
}