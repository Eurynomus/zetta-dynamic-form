import { Alert, Snackbar } from '@mui/material';

interface SuccessNotificationProps {
    open: boolean;
    onClose: () => void;
}

export default function SuccessNotification({ open, onClose }: SuccessNotificationProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={onClose} severity="success">
                Form submitted successfully! Check console for output.
            </Alert>
        </Snackbar>
    );
}