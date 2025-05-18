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
import applyCustomValidation from './utils/validationHelper';

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
          rules={applyCustomValidation(field.validation)}
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
        <FormControl fullWidth sx={{ mb: 2 }} key={field.name}>
          <InputLabel>{field.label}</InputLabel>
          <Controller
            name={field.name}
            control={control}
            defaultValue=""
            rules={field.validation}
            render={({ field: rhfField, fieldState: { error } }) => (
              <>
                <Select {...rhfField} label={field.label} error={!!error}>
                  {field.options?.map((option, index) => (
                    <MenuItem key={`${field.name}-${option}-${index}`} value={option}>
                      {option}
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
        <FormControl key={field.name} sx={{ mb: 2 }}>
          <Controller
            name={field.name}
            control={control}
            defaultValue={false}
            rules={field.validation}
            render={({ field: rhfField, fieldState: { error } }) => (
              <>
                <FormControlLabel
                  control={<Checkbox {...rhfField} checked={!!rhfField.value} />}
                  label={field.label}
                />
                {error && <FormHelperText error>{error.message}</FormHelperText>}
              </>
            )}
          />
        </FormControl>
      );

    case 'radio':
      return (
        <FormControl key={field.name} sx={{ mb: 2 }}>
          <Box sx={{ mb: 1 }}>{field.label}</Box>
          <Controller
            name={field.name}
            control={control}
            defaultValue=""
            rules={field.validation}
            render={({ field: rhfField, fieldState: { error } }) => (
              <>
                <RadioGroup {...rhfField}>
                  {field.options?.map((option, index) => (
                    <FormControlLabel
                      key={`${field.name}-${option}-${index}`}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
                {error && <FormHelperText error>{error.message}</FormHelperText>}
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
          {field.fields?.map((subField) => (
            <div key={subField.name}>
              {renderField(subField, control, watch)}
            </div>
          ))}
        </Box>
      );

    default:
      return null;
  }
}