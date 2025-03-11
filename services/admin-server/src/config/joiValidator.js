import joi from 'joi';

const userValidationSchema = joi.object({
    password: joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$'))
        .required()
        .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*).',
        'string.min': 'Password must be at least 8 characters long.',
        'string.max': 'Password must not exceed 100 characters.',
        }),
    email: joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
});

export default userValidationSchema;
