import { useState, useEffect } from 'react';
import { TextField, Container, Button, Alert, Box, Typography } from '@mui/material';
import FormBuilder from './components/FormBuilder';

export default function App() {
  // For testing purposes only
  // Move everything from the APP to other folder structures

  const [jsonInput, setJsonInput] = useState('');
  const [formSchema, setFormSchema] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    try {
      setError(null);
      const parsed = JSON.parse(jsonInput);

      if (!parsed.fields || !Array.isArray(parsed.fields)) {
        setError('JSON must contain a "fields" array');
        return;
      }

      setFormSchema(parsed);
    } catch (err) {
      setError('Invalid JSON format');
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
          minRows={6}
          fullWidth
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          error={!!error}
          helperText={error || "Enter a valid JSON schema with a 'fields' array"}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button onClick={handleParse} variant="contained">
            Generate Form
          </Button>
          {/*TO DO: disable the button on click (loading state) */}
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
};