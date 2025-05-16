import { useState, useEffect } from 'react';
import {
    TextField,
    Container,
    Button,
    Alert,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import FormBuilder from '../FormBuilder/FormBuilder';

export default function FormGenerator() {
    const [jsonInput, setJsonInput] = useState('');
    const [formSchema, setFormSchema] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleParse = () => {
        try {
            setError(null);
            setIsGenerating(true);

            const parsed = JSON.parse(jsonInput);

            if (!parsed.fields || !Array.isArray(parsed.fields)) {
                setError('JSON must contain a "fields" array');
                return;
            }

            setTimeout(() => {
                setFormSchema(parsed);
                setIsGenerating(false);
            }, 1000);

        } catch (err) {
            setError('Invalid JSON format');
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (jsonInput) {
                handleParse();
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [jsonInput]);

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 3 }}>Dynamic Form Builder</Typography>

            <Box sx={{ mb: 4 }}>
                <TextField
                    label="JSON Schema"
                    multiline
                    minRows={8}
                    maxRows={14}
                    fullWidth
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    error={!!error}
                    helperText={error || "Enter a valid JSON schema with a 'fields' array"}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                        onClick={handleParse}
                        variant="contained"
                        disabled={isGenerating}
                        startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Form'}
                    </Button>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {formSchema && (
                <Box sx={{ mt: 4, p: 3, border: '1px solid #eee', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Generated Form</Typography>
                    <FormBuilder schema={formSchema} />
                </Box>
            )}
        </Container>
    );
}