import { Button, CircularProgress } from '@mui/material';

interface SubmitButtonProps {
    isSubmitting: boolean;
}

export default function SubmitButton({ isSubmitting }: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ mt: 2 }}
        >
            {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
    );
}