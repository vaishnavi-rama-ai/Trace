// src/hooks/useFormField.js
// Custom hook to reduce redundancy in form field handling

import { useState, useCallback } from 'react';

export const useFormField = (initialValues = {}, onValidate = null) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    if (onValidate) {
      const newErrors = onValidate(formData);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    return true;
  }, [formData, onValidate]);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldError = useCallback((fieldName, errorMsg) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMsg,
    }));
  }, []);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validateForm,
    resetForm,
    setFieldError,
  };
};
