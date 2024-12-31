interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  terms: boolean;
}

export function validateSignUp(data: SignUpData): Partial<SignUpData> {
  const errors: Partial<SignUpData> = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!data.terms) {
    errors.terms = 'You must accept the terms and conditions';
  }

  return errors;
}