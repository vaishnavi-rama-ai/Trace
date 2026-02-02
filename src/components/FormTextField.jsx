// src/components/FormTextField.jsx
// Reusable form text field component with consistent styling

import React from 'react';
import { TextField } from '@mui/material';
import { COMMON_INPUT_STYLES } from '../theme/commonStyles';

const FormTextField = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  disabled,
  type = 'text',
  fullWidth = true,
  sx = {},
  ...props
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={!!error}
      helperText={error || helperText}
      sx={{
        ...COMMON_INPUT_STYLES.textFieldWithError(!!error),
        ...sx,
      }}
      {...props}
    />
  );
};

export default FormTextField;
