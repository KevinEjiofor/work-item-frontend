import { apiClient } from './client';
import { LoginCredentials, SignupData } from '@/types';

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const { data } = await apiClient.post('/admin/login', credentials);
        return data;
    },

    signup: async (signupData: SignupData) => {
        const { data } = await apiClient.post('/admin/signup', signupData);
        return data;
    },

    verifyEmail: async (email: string, pin: string) => {
        const { data } = await apiClient.post('/admin/verify-email', { email, pin });
        return data;
    },

    resendVerificationPin: async (email: string) => {
        const { data } = await apiClient.post('/admin/resend-verification-pin', { email });
        return data;
    },

    logout: async () => {
        const { data } = await apiClient.post('/admin/logout');
        return data;
    },

    forgotPassword: async (email: string) => {
        const { data } = await apiClient.post('/admin/forgot-password', { email });
        return data;
    },

    verifyResetToken: async (email: string, token: string) => {
        const { data } = await apiClient.post('/admin/validate-reset-token', { email, token });
        return data;
    },

    resetPassword: async (token: string, newPassword: string) => {
        const { data } = await apiClient.post('/admin/reset-password', { token, newPassword });
        return data;
    },

    changePassword: async (oldPassword: string, newPassword: string) => {
        const { data } = await apiClient.put('/admin/change-password', { oldPassword, newPassword });
        return data;
    },
};