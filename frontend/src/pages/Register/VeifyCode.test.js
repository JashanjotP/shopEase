import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyCode from './VerifyCode';
import { useDispatch } from 'react-redux';
import { verifyAPI } from '../../api/authentication';
import { setLoading } from '../../store/features/common';

// Mocks
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));
jest.mock('../../api/authentication', () => ({
    verifyAPI: jest.fn(),
}));
jest.mock('../../store/features/common', () => ({
    setLoading: jest.fn(),
}));
// Mock useNavigate just in case, though not used in the snippet provided, 
// the import is there in your code.
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));

describe('VerifyCode Component', () => {
    const mockDispatch = jest.fn();
    const mockEmail = 'test@example.com';

    beforeEach(() => {
        jest.clearAllMocks();
        useDispatch.mockReturnValue(mockDispatch);
    });

    test('renders initial state correctly', () => {
        render(<VerifyCode email={mockEmail} />);

        // Kill: ConditionalExpression {!message} -> {message} or {false}
        // If !message was false (or inverted), these wouldn't show.
        expect(screen.getByText(/Registration successful!/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('6 digit code')).toBeInTheDocument();
        
        // Kill: ConditionalExpression {message && ...} -> {true}
        // Ensure success message is NOT there initially
        expect(screen.queryByText('Thank you! Your email has been successfully verified.')).not.toBeInTheDocument();
        
        // Kill: ConditionalExpression {error && ...} -> {true}
        // Ensure error message is NOT there initially
        const errorText = screen.queryByText(/incorrect or has expired/i);
        expect(errorText).not.toBeInTheDocument();
    });

    test('updates input value on change', () => {
        render(<VerifyCode email={mockEmail} />);
        
        const input = screen.getByPlaceholderText('6 digit code');
        
        // Kill: handleOnChange BlockStatement / ArrowFunction mutants
        // If handleOnChange is empty or returns undefined, the input value won't update in the DOM
        fireEvent.change(input, { target: { name: 'code', value: '123456' } });
        
        expect(input.value).toBe('123456');
    });

    test('handles successful verification flow', async () => {
        verifyAPI.mockResolvedValueOnce({ success: true });
        
        render(<VerifyCode email={mockEmail} />);
        
        const input = screen.getByPlaceholderText('6 digit code');
        const button = screen.getByRole('button', { name: /Verify/i });

        fireEvent.change(input, { target: { name: 'code', value: '123456' } });
        
        // Trigger Submit
        fireEvent.click(button);

        // Kill: setLoading(false) mutant (at start of submit)
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));

        // Kill: BlockStatement/ArrowFunction in onSubmit
        // Ensure API is actually called with correct values
        expect(verifyAPI).toHaveBeenCalledWith({
            userName: mockEmail,
            code: '123456'
        });

        // Wait for success message
        await waitFor(() => {
            expect(screen.getByText(/Thank you! Your email has been successfully verified/i)).toBeInTheDocument();
        });

        // Kill: ConditionalExpression {!message} -> {true}
        // If !message logic is broken (e.g. always true), the form would still be visible.
        expect(screen.queryByPlaceholderText('6 digit code')).not.toBeInTheDocument();

        // Kill: finally block mutants (setLoading(false) at end)
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });

    test('handles failed verification flow', async () => {
        // Kill: BlockStatement/ArrowFunction in catch block
        verifyAPI.mockRejectedValueOnce(new Error('Invalid code'));
        
        render(<VerifyCode email={mockEmail} />);
        
        const input = screen.getByPlaceholderText('6 digit code');
        const button = screen.getByRole('button', { name: /Verify/i });
        
        fireEvent.change(input, { target: { name: 'code', value: '999999' } });
        fireEvent.click(button);

        // Wait for error UI
        await waitFor(() => {
            // Kill: ConditionalExpression {error && ...} -> {false}
            expect(screen.getByText('The verification code you entered is incorrect or has expired.')).toBeInTheDocument();
        });

        // Kill: finally block mutants (even on error)
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
        
        // Form should still be visible on error
        expect(screen.getByPlaceholderText('6 digit code')).toBeInTheDocument();
    });
});