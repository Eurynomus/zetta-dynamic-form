import { render, screen, fireEvent } from '@testing-library/react';
import FormGenerator from '../components/FormGenerator/FormGenerator';


const sampleJson = `{
  "fields": [
    {
      "type": "dropdown",
      "label": "User Type",
      "name": "userType",
      "options": ["Person", "Business"],
      "validation": {
        "required": "User type is required"
      }
    }
  ]
}`;

describe('FormGenerator', () => {
  test('renders input and buttons', () => {
    render(<FormGenerator />);
    expect(screen.getByLabelText(/json schema/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset form/i })).toBeInTheDocument();
  });

  test('shows error when clicking generate without input', async () => {
    render(<FormGenerator />);
    fireEvent.click(screen.getByRole('button', { name: /generate form/i }));
    expect(await screen.findByText(/please enter json schema/i)).toBeInTheDocument();
  });

  test('generates form after valid JSON input', async () => {
    render(<FormGenerator />);

    const input = screen.getByLabelText(/json schema/i);

    fireEvent.change(input, { target: { value: sampleJson } });

    const button = screen.getByRole('button', { name: /generate form/i });
    fireEvent.click(button);

    const userTypeLabel = await screen.findByText(/user type/i);
    expect(userTypeLabel).toBeInTheDocument();
  });
});