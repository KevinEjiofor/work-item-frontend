'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { LoginCredentials, SignupData } from '@/types';
import { useToastHook } from './useToast';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { showSuccess, showError } = useToastHook();

    const handleAuth = async (
        operation: Promise<any>,
        successMessage?: string,
        redirectPath?: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const result = await operation;
            if (successMessage) {
                showSuccess(successMessage);
            }
            if (redirectPath) {
                router.push(redirectPath);
            }
            return result;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'An error occurred';
            setError(message);
            showError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = (credentials: LoginCredentials) =>
        handleAuth(authApi.login(credentials), 'Login successful', '/dashboard');

    const signup = (signupData: SignupData) =>
        handleAuth(authApi.signup(signupData), 'Account created successfully. Please check your email for verification.');

    const verifyEmail = (email: string, pin: string) =>
        handleAuth(authApi.verifyEmail(email, pin), 'Email verified successfully', '/login');

    const resendVerification = (email: string) =>
        handleAuth(authApi.resendVerificationPin(email), 'New verification PIN sent to your email');

    const forgotPassword = (email: string) =>
        handleAuth(authApi.forgotPassword(email), 'Password reset token sent to your email');

    const resetPassword = (token: string, newPassword: string) =>
        handleAuth(authApi.resetPassword(token, newPassword), 'Password reset successfully', '/login');

    const changePassword = (oldPassword: string, newPassword: string) =>
        handleAuth(authApi.changePassword(oldPassword, newPassword), 'Password changed successfully');

    const logout = () =>
        handleAuth(authApi.logout(), 'Logged out successfully', '/login');

    return {
        loading,
        error,
        setError,
        login,
        signup,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        changePassword,
        logout,
    };
};