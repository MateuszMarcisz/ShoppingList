import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {AuthContext} from '../../../contexts/AuthContext';
import Login from '../Login';
import {BrowserRouter as Router} from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

const renderComponent = () => {
    return render(
        <AuthContext.Provider value={{login: mockLogin}}>
            <Router>
                <Login/>
            </Router>
        </AuthContext.Provider>
    );
};

describe('Login Component', () => {
    beforeEach(() => {
        mockLogin.mockReset();
        mockNavigate.mockReset();
    });

    test('renders the login form', () => {
        renderComponent();

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument();
    });

    test('displays error message for empty username', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'validPassword'}});

        fireEvent.click(screen.getByRole('button', {name: /login/i}));

        await waitFor(() => {
            expect(screen.getByText(/username and password are required/i)).toBeInTheDocument();
        });
    });

    test('displays error message for empty password', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'validUser'}});

        fireEvent.click(screen.getByRole('button', {name: /login/i}));

        await waitFor(() => {
            expect(screen.getByText(/username and password are required/i)).toBeInTheDocument();
        });
    });

    test('shows error message for invalid login', async () => {
        mockLogin.mockRejectedValueOnce({
            response: {
                status: 400,
                data: {message: 'Invalid username or password'},
            },
        });

        renderComponent();

        fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'invalidUser'}});
        fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'invalidPassword'}});

        fireEvent.click(screen.getByRole('button', {name: /login/i}));

        await waitFor(() => {
            expect(screen.getByText(/wrong credentials/i)).toBeInTheDocument();
        });
    });

    test('logs in successfully with valid credentials', async () => {
        mockLogin.mockResolvedValueOnce();

        renderComponent();

        fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'validUser'}});
        fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'validPassword'}});

        fireEvent.click(screen.getByRole('button', {name: /login/i}));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('validUser', 'validPassword');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});
