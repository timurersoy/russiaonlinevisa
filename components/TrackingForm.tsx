'use client';

import { useState } from 'react';
import { Search, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';

interface ApplicationStatus {
    applicationNumber: string;
    status: string;
    submittedDate: string;
    lastUpdated: string;
    nationality: string;
    travelDate: string;
}

export default function TrackingForm() {
    const [applicationNumber, setApplicationNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<ApplicationStatus | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch(`/api/applications/track?applicationNumber=${encodeURIComponent(applicationNumber)}`);
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to track application');
                return;
            }

            setResult(data.application);
        } catch (err) {
            setError('Failed to track application');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED':
            case 'CONFIRMED':
                return <CheckCircle2 className="h-12 w-12 text-green-500" />;
            case 'REJECTED':
            case 'DECLINED':
                return <XCircle className="h-12 w-12 text-red-500" />;
            case 'PENDING':
            case 'PROCESSING':
                return <Clock className="h-12 w-12 text-yellow-500" />;
            default:
                return <FileText className="h-12 w-12 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
            case 'CONFIRMED':
                return 'bg-green-50 text-green-700 ring-green-600/20';
            case 'REJECTED':
            case 'DECLINED':
                return 'bg-red-50 text-red-700 ring-red-600/20';
            case 'PENDING':
            case 'PROCESSING':
                return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';
            default:
                return 'bg-gray-50 text-gray-600 ring-gray-500/10';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Application</h1>
                    <p className="text-gray-600">Enter your application number to check its status.</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="applicationNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                Application Number
                            </label>
                            <input
                                type="text"
                                id="applicationNumber"
                                value={applicationNumber}
                                onChange={(e) => setApplicationNumber(e.target.value)}
                                placeholder="APP-1008"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0039A6] focus:border-transparent"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#0039A6] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#002D80] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Search className="h-5 w-5" />
                            {loading ? 'Checking...' : 'Check Status'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="mt-8 space-y-6">
                            <div className="flex flex-col items-center justify-center py-6 border-b border-gray-200">
                                {getStatusIcon(result.status)}
                                <h3 className="mt-4 text-2xl font-bold text-gray-900">{result.applicationNumber}</h3>
                                <span className={`mt-2 inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset ${getStatusColor(result.status)}`}>
                                    {result.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Submitted Date</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(result.submittedDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(result.lastUpdated).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nationality</p>
                                    <p className="text-sm font-medium text-gray-900">{result.nationality}</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Travel Date</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(result.travelDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {(result.status === 'APPROVED' || result.status === 'CONFIRMED') && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm text-green-800">
                                        <strong>Congratulations!</strong> Your visa application has been approved. You should receive your e-visa via email shortly.
                                    </p>
                                </div>
                            )}

                            {(result.status === 'REJECTED' || result.status === 'DECLINED') && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-800">
                                        <strong>Application Declined.</strong> Unfortunately, your visa application was not approved. Please contact support for more information.
                                    </p>
                                </div>
                            )}

                            {(result.status === 'PENDING' || result.status === 'PROCESSING') && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Application in Progress.</strong> Your application is currently being reviewed. This typically takes 6 business days.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Need help? <a href="/contact" className="text-[#0039A6] hover:underline font-medium">Contact Support</a></p>
                </div>
            </div>
        </div>
    );
}
