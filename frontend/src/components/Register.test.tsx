import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import apiCall from '../apiCall';
import Register from './Register'

jest.mock('../apiCall', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('<RegisterForm>', () => {
  it('renders the email field, password field, name field and register button', () => {
    render(<Register />)

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  })

  it('renders the email password and name inputs as required fields', () => {
    render(<Register />)

    const emailInput = screen.getByLabelText('Email Address').querySelector('input');
    expect(emailInput).toBeRequired()
    const passwordInput = screen.getByLabelText('Password').querySelector('input');
    expect(passwordInput).toBeRequired()
    const nameInput = screen.getByLabelText('Name').querySelector('input');
    expect(nameInput).toBeRequired()
  })

  it('renders the email, password and name inputs as valid if there are no errors', () => {
    const inputs = {
      email: 'soorria@email.com',
      password: 'super secure password',
      name: 'bob'
    }

    render(<Register />)

    userEvent.type(screen.getByLabelText('Email Address'), inputs.email)
    userEvent.type(screen.getByLabelText('Password'), inputs.password)
    userEvent.type(screen.getByLabelText('Name'), inputs.password)

    expect(screen.getByLabelText('Email Address')).toBeValid()
    expect(screen.getByLabelText('Password')).toBeValid()
    expect(screen.getByLabelText('Name')).toBeValid()
  })

  it('shows the aria-labels for the text fields', () => {
    render(<Register />)

    expect(screen.getByLabelText('Email Address')).toHaveAttribute('aria-label');
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-label');
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-label');
  })

  it('updates all states when onChange function is called', () => {
    const { getByTestId } = render(<Register />);
    const nameInput = getByTestId('name-input') as HTMLInputElement;
    const emailInput = getByTestId('email-input') as HTMLInputElement;
    const passwordInput = getByTestId('password-input') as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'John@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'John123' } });

    expect(nameInput.value).toBe('John');
    expect(emailInput.value).toBe('John@email.com');
    expect(passwordInput.value).toBe('John123');
  });

  it('calls apiCall with the right data', async () => {
    const { getByTestId, getByRole } = render(<Register />);
    const nameInput = getByTestId('name-input') as HTMLInputElement;
    const emailInput = getByTestId('email-input') as HTMLInputElement;
    const passwordInput = getByTestId('password-input') as HTMLInputElement;
    const submitButton = getByRole('button', { name: 'Register' });

    const token = 'fake-token';
    const mockedApiCall = apiCall as jest.MockedFunction<typeof apiCall>;
    mockedApiCall.mockResolvedValueOnce({ token });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    fireEvent.click(submitButton);

    expect(apiCall).toHaveBeenCalledWith('/admin/auth/register', 'POST', {
      email: 'test@example.com',
      password: 'password',
      name: 'John Doe',
    });
  });
})
