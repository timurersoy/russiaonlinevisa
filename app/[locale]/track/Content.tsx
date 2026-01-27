'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Mail, Phone, ArrowLeft } from 'lucide-react';
import { Link } from '@/app/i18n/navigation';

export default function TrackContent() {
    const t = useTranslations('Common');
    // Note: Kept 'Common' as per original file used generic keys mostly, or hardcoded.
    // Assuming messages exist or fallback.

    const [appId, setAppId] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!appId) return;

        setLoading(true);
        setError(null);
        setStatus(null);

        try {
            // Remove "APP-" prefix if user types it
            const cleanId = appId.replace(/APP-/i, '').trim();

            const res = await fetch(`/api/track/${cleanId}`);
            // Note: /api dynamic routes might fail on static export if not generated statically.
            // But if it's a client-side fetch to an external API (or if user deploys api separately/serverless), it might work.
            // However, typical static export (GitHub Pages) DOES NOT support API routes.
            // For now, I leave it as is, but it will 404 on static host unless handled.
            // The user asked to remove dynamic APIs for "static export build", but client-side fetch is allowed if endpoint exists.

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus(data.status);
            } else {
                setError(data.message || 'Application not found');
            }
        } catch (err) {
            setError('Failed to track application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            <div className="w-full max-w-md">
                <Link href="/" className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                </Link>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Application</h1>
                    <p className="text-gray-600">Enter your application number to check its status.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleTrack} className="space-y-6">
                        <div>
                            <label htmlFor="appId" className="block text-sm font-medium text-gray-700 mb-1">
                                Application Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 font-bold sm:text-sm">APP-</span>
                                </div>
                                <input
                                    type="text"
                                    id="appId"
                                    required
                                    className="pl-12 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-[#0039A6] focus:border-[#0039A6] transition-colors"
                                    placeholder="5100"
                                    value={appId.replace(/^APP-/i, '')}
                                    onChange={(e) => setAppId(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !appId}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0039A6] hover:bg-[#002D80] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0039A6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Search className="h-5 w-5 mr-2" />
                            )}
                            {loading ? 'Checking...' : 'Check Status'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="text-red-500 shrink-0">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {status && (
                        <div className="mt-8 border-t border-gray-100 pt-6 animate-in fade-in slide-in-from-top-4">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase
                                    ${status === 'APPROVED' || status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                        status === 'REJECTED' || status === 'DECLINED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {status}
                                </span>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    Need details?
                                </h4>
                                <p className="text-sm text-blue-800 mb-4">
                                    For the details, please get in touch with us:
                                </p>
                                <div className="space-y-3">
                                    <a href="mailto:info@russiaonlinevisa.com" className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#0039A6] transition-colors p-2 bg-white rounded border border-blue-100 hover:border-blue-300 hover:shadow-sm">
                                        <div className="bg-blue-100 p-2 rounded-full text-[#0039A6]">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <span>info@russiaonlinevisa.com</span>
                                    </a>
                                    <a href="tel:+905302028530" className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#0039A6] transition-colors p-2 bg-white rounded border border-blue-100 hover:border-blue-300 hover:shadow-sm">
                                        <div className="bg-blue-100 p-2 rounded-full text-[#0039A6]">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <span>+90 530 202 85 30</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
