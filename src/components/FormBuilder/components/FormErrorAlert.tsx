import { Alert } from '@mui/material';
import type { FieldErrors } from 'react-hook-form';

interface FormErrorAlertProps {
    errors: FieldErrors;
}

export default function FormErrorAlert({ errors }: FormErrorAlertProps) {
    if (Object.keys(errors).length === 0) {
        return null;
    }

    return (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            Please fix the errors above before submitting
        </Alert>
    );
}