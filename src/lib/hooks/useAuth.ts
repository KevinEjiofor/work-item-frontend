'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { LoginCredentials, SignupData } from '@/types';
import { useToastHook } from './useToast';
import { useAuthStore } from '@/lib/store/authStore';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { showSuccess, showError } = useToastHook();
    const { setAuth, clearAuth } = useAuthStore();

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

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.login(credentials);

            const { token, admin } = response.data;

            if (!token || !admin) {
                throw new Error('Missing credentials in response');
            }

            const user = {
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role,
                isEmailVerified: admin.isEmailVerified,
            };

            setAuth(user, token);
            showSuccess('Login successful');
            router.push('/dashboard');

            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'An error occurred';
            setError(message);
            showError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (signupData: SignupData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await authApi.signup(signupData);
            showSuccess('Account created successfully. Please check your email for verification.');
            router.push(`/verify-email?email=${encodeURIComponent(signupData.email)}`);
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

    const verifyEmail = (email: string, pin: string) =>
        handleAuth(authApi.verifyEmail(email, pin), 'Email verified successfully', '/login');

    const resendVerification = (email: string) =>
        handleAuth(authApi.resendVerificationPin(email), 'New verification PIN sent to your email');

    const forgotPassword = (email: string) =>
        handleAuth(authApi.forgotPassword(email), 'Password reset token sent to your email', `/verify-reset-token?email=${encodeURIComponent(email)}`);

    const verifyResetToken = (email: string, token: string) =>
        handleAuth(authApi.verifyResetToken(email, token), 'Token verified successfully');

    const resendPasswordToken = (email: string) =>
        handleAuth(authApi.forgotPassword(email), 'New password reset token sent to your email');

    const resetPassword = (token: string, newPassword: string) =>
        handleAuth(authApi.resetPassword(token, newPassword), 'Password reset successfully', '/login');

    const changePassword = (oldPassword: string, newPassword: string) =>
        handleAuth(authApi.changePassword(oldPassword, newPassword), 'Password changed successfully');

    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            await authApi.logout();
            clearAuth();
            showSuccess('Logged out successfully');
            router.push('/login');
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'An error occurred';
            setError(message);
            showError(message);
            clearAuth();
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        setError,
        login,
        signup,
        verifyEmail,
        resendVerification,
        forgotPassword,
        verifyResetToken,
        resendPasswordToken,
        resetPassword,
        changePassword,
        logout,
    };
};