import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {AuthContext} from '../../../contexts/AuthContext';
import Register from '../Register';
import {BrowserRouter as Router} from 'react-router-dom';


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

const mockRegister = jest.fn();

const renderComponent = () => {
    return render(
        <AuthContext.Provider value={{register: mockRegister}}>
            <Router>
                <Register/>
            </Router>
        </AuthContext.Provider>
    );
};

describe('Register Component', () => {
    beforeEach(() => {
        mockRegister.mockReset();
    });

    test('renders registration form', () => {
        renderComponent();

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /sign up/i})).toBeInTheDocument();
    });

    test('displays validation messages for invalid username', () => {
        renderComponent();

        const usernameInput = screen.getByLabelText(/username/i);
        fireEvent.change(usernameInput, {target: {value: 'abc'}});
        fireEvent.blur(usernameInput);

        expect(screen.getByText(/4 to 24 characters/i)).toBeInTheDocument();
    });

    test('displays validation messages for invalid password', () => {
        renderComponent();

        const passwordInput = screen.getByTestId('password-input');
        fireEvent.change(passwordInput, {target: {value: 'password'}});
        fireEvent.blur(passwordInput);

        expect(screen.getByText(/8 to 24 characters/i)).toBeInTheDocument();
    });

    test('displays validation message when passwords do not match', () => {
        renderComponent();

        const passwordInput = screen.getByTestId('password-input');
        const confirmPasswordInput = screen.getByTestId('confirm-password-input');

        fireEvent.change(passwordInput, {target: {value: 'Password123!'}});
        fireEvent.change(confirmPasswordInput, {target: {value: 'Password123'}});
        fireEvent.blur(confirmPasswordInput);

        expect(screen.getByText(/must match the password input field/i)).toBeInTheDocument();
    });

    test('submits the form successfully', async () => {
        renderComponent();

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByTestId('password-input');
        const confirmPasswordInput = screen.getByTestId('confirm-password-input');
        const submitButton = screen.getByRole('button', {name: /sign up/i});

        fireEvent.change(usernameInput, {target: {value: 'ValidUser123'}});
        fireEvent.change(passwordInput, {target: {value: 'ValidPassword123!'}});
        fireEvent.change(confirmPasswordInput, {target: {value: 'ValidPassword123!'}});

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith('ValidUser123', 'ValidPassword123!');
        });

        await waitFor(() => {
            expect(screen.getByText(/you have successfully registered/i)).toBeInTheDocument();
        });
    });

    test('handles registration error', async () => {
        mockRegister.mockRejectedValueOnce({
            response: {
                status: 400,
                data: {username: ['Username already taken']},
            },
        });

        renderComponent();

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByTestId('password-input');
        const confirmPasswordInput = screen.getByTestId('confirm-password-input');
        const submitButton = screen.getByRole('button', {name: /sign up/i});

        fireEvent.change(usernameInput, {target: {value: 'TakenUser'}});
        fireEvent.change(passwordInput, {target: {value: 'ValidPassword123!'}});
        fireEvent.change(confirmPasswordInput, {target: {value: 'ValidPassword123!'}});

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/username already taken/i)).toBeInTheDocument();
        });
    });
});
