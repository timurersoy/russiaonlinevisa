"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginContent() {
    const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        if (token) formData.append('token', token);

        try {
            // Call the standard API route
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Login failed');
                setLoading(false);
                return;
            }

            if (result.require2fa) {
                setLoading(false);
                setStep('2fa');
                return;
            }

            if (result.success) {
                router.push('/admin');
            }

        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-[#0039A6] text-white rounded-full flex items-center justify-center mb-6">
                        {step === 'credentials' ? <Lock className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        {step === 'credentials' ? 'Admin Access' : 'Two-Factor Auth'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {step === 'credentials'
                            ? 'Please sign in to access the control panel'
                            : 'Enter the 6-digit code from your authenticator app'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {step === 'credentials' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0039A6] focus:ring-[#0039A6] sm:text-sm p-3 border"
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0039A6] focus:ring-[#0039A6] sm:text-sm p-3 border"
                                />
                            </div>
                        </div>
                    )}

                    {step === '2fa' && (
                        <div>
                            <label htmlFor="token" className="block text-sm font-medium text-gray-700">Authenticator Code</label>
                            <input
                                id="token"
                                name="token"
                                type="text"
                                required
                                maxLength={6}
                                value={token}
                                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0039A6] focus:ring-[#0039A6] text-center text-3xl tracking-widest p-3 border font-mono"
                                placeholder="000000"
                                autoFocus
                            />
                        </div>
                    )}

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-[#0039A6] px-3 py-3 text-sm font-semibold text-white hover:bg-[#002D80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0039A6] disabled:opacity-70 transition-all"
                        >
                            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {!loading && (step === 'credentials' ?
                                <>Next Step <ArrowRight className="ml-2 h-5 w-5" /></> :
                                'Verify & Login'
                            )}
                        </button>
                    </div>

                    {step === '2fa' && (
                        <button
                            type="button"
                            onClick={() => setStep('credentials')}
                            className="w-full text-center text-sm text-gray-500 hover:text-gray-900"
                        >
                            Back to credentials
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
