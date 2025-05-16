import { Controller, type UseFormWatch, type Control } from 'react-hook-form';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';
import type { Field } from './types';
import type { JSX } from 'react';

export function renderField(
  field: Field,
  control: Control<any>,
  watch: UseFormWatch<any>
): JSX.Element | null {
  const watchedValue = field.visibleIf?.field ? watch(field.visibleIf.field) : true;
  const isVisible = field.visibleIf ? watchedValue === field.visibleIf.value : true;

  if (!isVisible) return null;

  switch (field.type) {
    case 'text':
    case 'textarea':
      return (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          defaultValue=""
          rules={field.validation}
          render={({ field: rhfField, fieldState: { error } }) => (
            <TextField
              {...rhfField}
              label={field.label}
              fullWidth
              multiline={field.type === 'textarea'}
              error={!!error}
              helperText={error?.message}
              sx={{ mb: 2 }}
            />
          )}
        />
      );
    case 'dropdown':
      return (
        <FormControl 
          fullWidth 
          sx={{ mb: 2 }} 
          key={field.name} 
          error={!!control._formState.errors[field.name]}
        >
          <InputLabel>{field.label}</InputLabel>
          <Controller
            name={field.name}
            control={control}
            defaultValue=""
            rules={field.validation}
            render={({ field: rhfField, fieldState: { error } }) => (
              <>
                <Select {...rhfField} label={field.label}>
                  {field.options?.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </>
            )}
          />
        </FormControl>
      );
    case 'checkbox':
      return (
        <FormControl 
          key={field.name} 
          error={!!control._formState.errors[field.name]}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            control={
              <Controller
                name={field.name}
                control={control}
                defaultValue=""
                rules={field.validation}
                render={({ field: rhfField }) => (
                  <Checkbox {...rhfField} checked={rhfField.value || false} />
                )}
              />
            }
            label={field.label}
          />
          {control._formState.errors[field.name] && (
            <FormHelperText>
              {control._formState.errors[field.name]?.message?.toString()}
            </FormHelperText>
          )}
        </FormControl>
      );
    case 'radio':
      return (
        <FormControl 
          key={field.name} 
          error={!!control._formState.errors[field.name]}
          sx={{ mb: 2 }}
        >
          <Box sx={{ mb: 1 }}>{field.label}</Box>
          <Controller
            name={field.name}
            control={control}
            defaultValue=""
            rules={field.validation}
            render={({ field: rhfField, fieldState: { error } }) => (
              <>
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
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </>
            )}
          />
        </FormControl>
      );
    case 'group':
      return (
        <Box
          sx={{ border: '1px solid #ccc', p: 2, mb: 2, borderRadius: 2 }}
          key={field.name}
        >
          <InputLabel sx={{ mb: 2 }}>{field.label}</InputLabel>
          {field.fields?.map((subField) => renderField(subField, control, watch))}
        </Box>
      );
    default:
      return null;
  }
}