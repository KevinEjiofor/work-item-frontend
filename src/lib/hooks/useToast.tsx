import toast from 'react-hot-toast';

export const useToastHook = () => {
    const showSuccess = (message: string) => {
        toast.success(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
            },
        });
    };

    const showError = (message: string) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
        });
    };

    const showWarning = (message: string) => {
        toast(message, {
            duration: 4000,
            position: 'top-right',
            icon: '⚠️',
            style: {
                background: '#fffbeb',
                color: '#92400e',
                border: '1px solid #fcd34d',
            },
        });
    };

    return {
        showSuccess,
        showError,
        showWarning,
    };
};