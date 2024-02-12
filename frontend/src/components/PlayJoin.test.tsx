import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import apiCall from '../apiCall';
import PlayJoin from './PlayJoin';

jest.mock('../apiCall', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('PlayJoin', () => {
  it('renders the session id field, name field', () => {
    render(
      <MemoryRouter>
        <PlayJoin />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Session ID field')).toBeInTheDocument();
    expect(screen.getByLabelText('Name field')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Join button' })).toBeInTheDocument();
  })

  it('shows aria-labels', async () => {
    render(
      <MemoryRouter>
        <PlayJoin />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Session ID field')).toHaveAttribute('aria-label');
    expect(screen.getByLabelText('Name field')).toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: 'Join button' })).toHaveAttribute('aria-label', 'Join button');
  });

  it('calls apiCall with the right data', async () => {
    const { getByRole } = render(
      <MemoryRouter>
        <PlayJoin />
      </MemoryRouter>
    );
    const sessionInput = screen.getByLabelText('Session ID field') as HTMLInputElement;
    const nameInput = screen.getByLabelText('Name field') as HTMLInputElement;
    const submitButton = getByRole('button', { name: 'Join button' });

    const token = 'fake-token';
    const mockedApiCall = apiCall as jest.MockedFunction<typeof apiCall>;
    mockedApiCall.mockResolvedValueOnce({ token });

    await userEvent.type(sessionInput, '123');
    await userEvent.type(nameInput, 'John Doe');
    fireEvent.click(submitButton);

    expect(apiCall).toHaveBeenCalledWith('/play/join/', 'POST', {
      name: '',
    });
  });
});
