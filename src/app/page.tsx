'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function Home() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );
}
