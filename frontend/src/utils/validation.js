// Email validation function
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation function
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// Empty field check
export const isEmpty = (value) => {
  return value.trim() === "";
};

// Validate login form
export const validateLoginForm = (email, password) => {
  const errors = {};
  let isValid = true;

  if (isEmpty(email)) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
    isValid = false;
  }

  if (isEmpty(password)) {
    errors.password = "Password is required";
    isValid = false;
  }

  return { isValid, errors };
};

// Validate registration form
export const validateRegistrationForm = (formData) => {
  const { name, email, password, confirmPassword, role } = formData;
  const errors = {};
  let isValid = true;

  if (isEmpty(name)) {
    errors.name = "Name is required";
    isValid = false;
  }

  if (isEmpty(email)) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
    isValid = false;
  }

  if (isEmpty(password)) {
    errors.password = "Password is required";
    isValid = false;
  } else if (!isValidPassword(password)) {
    errors.password = "Password must be at least 6 characters";
    isValid = false;
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  if (isEmpty(role)) {
    errors.role = "Role is required";
    isValid = false;
  }

  return { isValid, errors };
};
