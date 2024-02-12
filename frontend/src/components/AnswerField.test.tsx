import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnswerField from './AnswerField';

// NOTE: This test is outdated
describe('<AnswerField>', () => {
  const props = {
    i: 1,
    initialText: '',
    initialIsCorrect: false,
    required: true,
    checked: false,
    answerOnChange: jest.fn(),
    correctOnChange: jest.fn(),
  };

  it('renders a text field and a checkbox', () => {
    render(<AnswerField {...props} />);

    expect(screen.getByLabelText(`Answer ${props.i}`)).toBeInTheDocument();
    expect(screen.getByLabelText('Correct')).toBeInTheDocument();
  });

  it('calls answerOnChange when the answer text field is changed', () => {
    render(<AnswerField {...props} />);

    const answerField = screen.getByLabelText(`Answer ${props.i}`);
    const answerValue = 'Example answer';
    fireEvent.change(answerField, { target: { value: answerValue } });

    expect(props.answerOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls correctOnChange when the correct checkbox is changed', () => {
    render(<AnswerField {...props} />);

    const correctCheckbox = screen.getByLabelText('Correct');
    const checkedValue = true;
    fireEvent.click(correctCheckbox, { target: { checked: checkedValue } });

    expect(props.correctOnChange).toHaveBeenCalledTimes(1);
  });

  it('should show the aria-labels for the textfield and form checkbox', () => {
    render(<AnswerField {...props} />);

    const answerField = screen.getByLabelText('Answer Field');
    const correctCheckbox = screen.getByLabelText('Checked');

    expect(answerField).toHaveAttribute('aria-label');
    expect(correctCheckbox).toHaveAttribute('aria-label');
  });
});
