import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import apiCall from '../apiCall'
import Login from './Login'

jest.mock('../apiCall', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('<LoginForm>', () => {
  it('renders the email field, password field and login button', () => {
    render(<Login />)

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  })

  it('renders the email and password inputs as required fields', () => {
    render(<Login />)

    const emailInput = screen.getByLabelText('Email Address').querySelector('input');
    expect(emailInput).toBeRequired()
    const passwordInput = screen.getByLabelText('Password').querySelector('input');
    expect(passwordInput).toBeRequired()
  })

  it('renders the email and password inputs as valid if there are no errors', () => {
    const inputs = {
      email: 'soorria@email.com',
      password: 'super secure password',
    }

    render(<Login />)

    userEvent.type(screen.getByLabelText('Email Address'), inputs.email)
    userEvent.type(screen.getByLabelText('Password'), inputs.password)

    expect(screen.getByLabelText('Email Address')).toBeValid()
    expect(screen.getByLabelText('Password')).toBeValid()
  })

  it('shows the aria-labels for the text fields', () => {
    render(<Login />)

    expect(screen.getByLabelText('Email Address')).toHaveAttribute('aria-label');
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-label');
  })

  it('updates all states when onChange function is called', () => {
    const { getByTestId } = render(<Login />);
    const emailInput = getByTestId('email-input') as HTMLInputElement;
    const passwordInput = getByTestId('password-input') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'John@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'John123' } });

    expect(emailInput.value).toBe('John@email.com');
    expect(passwordInput.value).toBe('John123');
  });

  it('calls apiCall with the right data', async () => {
    const { getByTestId, getByRole } = render(<Login />);
    const emailInput = getByTestId('email-input') as HTMLInputElement;
    const passwordInput = getByTestId('password-input') as HTMLInputElement;
    const submitButton = getByRole('button', { name: 'Login' });

    const token = 'fake-token';
    const mockedApiCall = apiCall as jest.MockedFunction<typeof apiCall>;
    mockedApiCall.mockResolvedValueOnce({ token });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(submitButton);

    expect(apiCall).toHaveBeenCalledWith('/admin/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'password',
    });
  });
})
