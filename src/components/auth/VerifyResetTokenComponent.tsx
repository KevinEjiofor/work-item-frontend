"use client"

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyResetTokenComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const emailParam = searchParams.get('email') || '';

    const [email, setEmail] = useState(emailParam);
    const [token, setToken] = useState(['', '', '', '', '', '']);
    const [resendLoading, setResendLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { verifyResetToken, resendPasswordToken, loading, error } = useAuth();

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    const handleTokenChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newToken = [...token];
        newToken[index] = value.slice(-1); // Only take the last character
        setToken(newToken);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !token[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        if (/^\d{6}$/.test(pastedData)) {
            const newToken = pastedData.split('');
            setToken(newToken);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async () => {
        const tokenCode = token.join('');

        if (tokenCode.length !== 6) {
            return;
        }

        if (!email) {
            return;
        }

        try {
            // Verify the token with backend
            await verifyResetToken(email, tokenCode);
            // If verification successful, redirect to reset password with verified token
            router.push(`/reset-password?token=${encodeURIComponent(tokenCode)}&email=${encodeURIComponent(email)}`);
        } catch (err) {
            // Error is handled by useAuth hook
            // Clear token on error
            setToken(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    const handleResend = async () => {
        if (!email) return;

        setResendLoading(true);
        try {
            await resendPasswordToken(email);
            setToken(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            // Error is handled by useAuth hook
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDM2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

            <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 shadow-2xl border-0 relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-2">
                        <Mail className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Verify Reset Token
                    </CardTitle>
                    <CardDescription className="text-base">
                        Enter the 6-digit token sent to {email || 'your email'}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <div className="flex justify-center gap-2">
                                {token.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleTokenChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 text-center text-xl font-semibold"
                                    />
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                            disabled={loading || token.join('').length !== 6 || !email}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify Token'
                            )}
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3">
                    <p className="text-center text-sm text-gray-600">
                        Didn&apos;t receive the token?{' '}
                        <button
                            onClick={handleResend}
                            disabled={resendLoading || loading || !email}
                            className="text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendLoading ? 'Sending...' : 'Resend'}
                        </button>
                    </p>
                    <Link href="/login" className="text-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}