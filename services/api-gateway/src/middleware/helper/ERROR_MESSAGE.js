const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access, please provide a valid authentication token',
    TOKEN_EXPIRED: 'Token has expired. Please log in again.',
    INVALID_TOKEN: 'Invalid token, request has been canceled',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable, please try again later',
    TOKEN_NOT_FOUND: 'Token not found or expired.',
    USER_NOT_FOUND: 'User not found, please try again',
    UNEXPECTED_ERROR: 'An unexpected error occurred during authentication',
    MISSING_FIELDS: 'Please provide all required information',
    PASSWORD_MISMATCH: 'Passwords do not match',
    EMAIL_IN_USE: 'Email already in use. Please use a different email address.',
    USERNAME_IN_USE: 'Username already in use. Please use a different username.',
    EMAIL_SEND_FAILED: 'Failed to send verification email.',
    INVALID_REQUEST: 'Invalid Request, please provide the correct details',
    ACCOUNT_VERIFICATION_PENDING: 'Account verification is pending, please provide the OTP sent to your email address',
    INVALID_CREDENTIALS: 'Invalid username or password',
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred while logging in',
    INVALID_OTP: 'Invalid or expired token/OTP',
    OTP_FAILED: 'Failed to store OTP. Please try again.',
    GATE_WAY_ERROR: 'No healthy instances for service'
  };
  
  export default ERROR_MESSAGES;