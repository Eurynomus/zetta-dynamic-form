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
