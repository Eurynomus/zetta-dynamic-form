import applyCustomValidation from "../components/FormBuilder/utils/validationHelper";

describe('applyCustomValidation', () => {
  it('validates email correctly', () => {
    const validation = {
      required: 'Email is required',
      customValidation: 'email',
    };

    const rules = applyCustomValidation(validation);

    expect(typeof rules.validate).toBe('function');

    expect(rules.validate('test@example.com')).toBe(true);
    expect(rules.validate('user.name+tag+sorting@example.com')).toBe(true);

    expect(rules.validate('invalid-email')).toBe('Invalid email format');
    expect(rules.validate('')).toBe('Invalid email format');
  });

  it('validates string only input', () => {
    const validation = {
      customValidation: 'string',
    };
    const rules = applyCustomValidation(validation);
    expect(rules.validate('hello')).toBe(true);
    expect(rules.validate('Hello World')).toBe(true);
    expect(rules.validate('123')).toBe('Only letters are allowed');
  });

  it('validates number only input', () => {
    const validation = {
      customValidation: 'number',
    };
    const rules = applyCustomValidation(validation);
    expect(rules.validate('123456')).toBe(true);
    expect(rules.validate('abc')).toBe('Only numbers are allowed');
  });

  it('validates regex properly', () => {
    const validation = {
      regex: {
        value: '^[A-Z]{3}[0-9]{3}$',
        message: 'Must be in format AAA999',
      },
    };
    const rules = applyCustomValidation(validation);
    expect(rules.validate('ABC123')).toBe(true);
    expect(rules.validate('abc123')).toBe('Must be in format AAA999');
  });
});
