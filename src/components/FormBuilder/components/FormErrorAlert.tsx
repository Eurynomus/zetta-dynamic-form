import { Alert } from '@mui/material';
import type { FieldErrors } from 'react-hook-form';

interface FormErrorAlertProps {
    errors: FieldErrors;
    apiError: Error | null;
}

export default function FormErrorAlert({ errors, apiError }: FormErrorAlertProps) {
    if (Object.keys(errors).length === 0 && !apiError) {
        return null;
    }

    return (
        <>
            {apiError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    API Error: {apiError.message}
                </Alert>
            )}
            {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    Please fix the errors above before submitting
                </Alert>
            )}
        </>
    );
}