// src/theme/commonStyles.js
// Reusable style constants to reduce redundancy across components

export const COMMON_BUTTON_STYLES = {
  // Primary white button with black border (used in login/register/start screens)
  whiteBordered: {
    bgcolor: 'white',
    color: 'text.primary',
    border: '4px solid #FA582D',
    padding: '12px 32px',
    fontSize: '16px',
    borderRadius: '4px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    '&:hover': {
      bgcolor: '#f5f5f5',
    },
    '&:disabled': {
      bgcolor: '#f5f5f5',
      color: 'text.primary',
    },
  },
  // Icon button base styling
  iconButton: {
    width: '48px',
    height: '48px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
};

export const COMMON_INPUT_STYLES = {
  // Text field with black border (used in login/register forms)
  textField: {
    '& .MuiOutlinedInput-root': {
      bgcolor: 'white',
      '& fieldset': {
        borderColor: '#000000',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#000000',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#000000',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'text.primary',
      '&.Mui-focused': {
        color: 'text.primary',
      },
    },
  },
  // Text field with error state handling
  textFieldWithError: (hasError) => ({
    '& .MuiOutlinedInput-root': {
      bgcolor: 'white',
      '& fieldset': {
        borderColor: hasError ? 'error.main' : '#000000',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: hasError ? 'error.main' : '#000000',
      },
      '&.Mui-focused fieldset': {
        borderColor: hasError ? 'error.main' : '#000000',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'text.primary',
      '&.Mui-focused': {
        color: 'text.primary',
      },
    },
  }),
};

export const COMMON_TYPOGRAPHY = {
  // Page heading (h1 style used throughout)
  pageHeading: {
    fontSize: { xs: '36px', sm: '48px' },
    fontFamily: 'Georgia, serif',
    m: '0 0 10px 0',
    color: 'text.primary',
    fontWeight: 400,
  },
  // Smaller page heading
  smallHeading: {
    fontSize: { xs: '32px', sm: '40px' },
    fontFamily: 'Georgia, serif',
    m: '0 0 10px 0',
    color: 'text.primary',
    fontWeight: 400,
  },
  // Header title in nav bar
  navTitle: {
    fontSize: '28px',
    fontFamily: 'Georgia, serif',
    m: 0,
    color: 'text.primary',
    fontWeight: 400,
  },
};

export const COMMON_CONTAINER_STYLES = {
  // Auth screen card container
  authCard: {
    bgcolor: 'primary.main',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  // Header/AppBar styling
  header: {
    bgcolor: 'primary.main',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};
