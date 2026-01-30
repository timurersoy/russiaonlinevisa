'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Eye, FileText, X } from 'lucide-react';
import { Application } from '@prisma/client';
import { decrypt } from '@/lib/crypto';

interface AdminApplicationListProps {
    applications: Application[];
    locale: string;
}

const FileViewer = ({ label, dataUrl }: { label: string, dataUrl?: string }) => {
    if (!dataUrl) {
        return (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm bg-white rounded border border-dashed border-gray-300">
                    No Document
                </div>
            </div>
        );
    }

    const isPdf = dataUrl.startsWith('data:application/pdf');

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-gray-500">{label}</p>
                {isPdf && <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded">PDF</span>}
            </div>

            {isPdf ? (
                <div className="h-64 bg-white rounded border border-gray-200 relative group">
                    <iframe src={dataUrl} className="w-full h-full rounded" title={label}></iframe>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={dataUrl} download={`${label.toLowerCase().replace(' ', '-')}.pdf`} className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg hover:bg-gray-100">
                            Download PDF
                        </a>
                    </div>
                </div>
            ) : (
                <img
                    src={dataUrl}
                    alt={label}
                    className="w-full h-48 object-contain bg-white rounded border border-gray-200"
                />
            )}
        </div>
    );
};

export default function AdminApplicationList({ applications, locale }: AdminApplicationListProps) {
    const router = useRouter();
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [localApplications, setLocalApplications] = useState<Application[]>(applications);
    const [parsedData, setParsedData] = useState<any>(null);

    const formatDate = (dateInput: Date | string | null, includeTime = false) => {
        if (!dateInput) return 'N/A';
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return 'N/A';

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        let dateStr = '';
        if (locale === 'zh') dateStr = `${year}-${month}-${day}`;
        else if (locale === 'ar') dateStr = `${year}/${month}/${day}`;
        else if (locale === 'en') dateStr = `${day}-${month}-${year}`;
        else dateStr = `${day}.${month}.${year}`;

        if (includeTime) {
            const hour = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return `${dateStr} ${hour}:${min}`;
        }
        return dateStr;
    };

    // Sync prop changes to state (important if parent re-renders)
    useEffect(() => {
        setLocalApplications(applications);
    }, [applications]);

    const handleView = (app: Application) => {
        setSelectedApp(app);
        // Parse the additionalData JSON string which contains the images
        try {
            if (app.additionalData) {
                setParsedData(JSON.parse(app.additionalData));
            } else {
                setParsedData({});
            }
        } catch (e) {
            console.error('Failed to parse additional data:', e);
            setParsedData({});
        }
    };

    const closeView = () => {
        setSelectedApp(null);
        setParsedData(null);
    };

    return (
        <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Recent Applications
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Passport</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {localApplications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                    APP-{app.publicId ?? '???'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{decrypt(app.firstName)} {decrypt(app.lastName)}</div>
                                    <div className="text-sm text-gray-500">{decrypt(app.email)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{app.nationality}</div>
                                    <div className="text-sm text-gray-500">{decrypt(app.passportNumber)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${app.status === 'APPROVED' || app.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                        app.status === 'REJECTED' || app.status === 'DECLINED' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                            'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                        }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${app.paymentStatus === 'PAID' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                                        'bg-gray-50 text-gray-600 ring-gray-500/10'
                                        }`}>
                                        {app.paymentStatus === 'PAID' ? 'Paid' : 'Unpaid'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(app.createdAt, true)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleView(app)}
                                        className="text-[#0039A6] hover:text-[#002D80] flex items-center justify-end gap-1"
                                    >
                                        <Eye className="h-4 w-4" /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {localApplications.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                                    No applications yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* DETAILS MODAL */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeView}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Application Details
                                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-600">APP-{selectedApp.publicId ?? '???'}</span>
                                </h3>
                                <p className="text-sm text-gray-500 font-mono text-xs mt-1">System UUID: {selectedApp.id}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <select
                                    value={selectedApp.status}
                                    onChange={async (e) => {
                                        const newStatus = e.target.value;

                                        // 1. Optimistic Update (Modal)
                                        const updatedApp = { ...selectedApp, status: newStatus };
                                        setSelectedApp(updatedApp);

                                        // 2. Optimistic Update (List)
                                        setLocalApplications(prev =>
                                            prev.map(app => app.id === selectedApp.id ? { ...app, status: newStatus } : app)
                                        );

                                        // 3. Update Backend
                                        try {
                                            const res = await fetch(`/api/applications/${selectedApp.id}`, {
                                                method: 'PATCH',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ status: newStatus })
                                            });

                                            let errorMsg = 'Unknown error';
                                            if (!res.ok) {
                                                try {
                                                    const data = await res.json();
                                                    errorMsg = data.message || res.statusText;
                                                } catch (e) {
                                                    errorMsg = res.statusText;
                                                }
                                                throw new Error(errorMsg);
                                            }

                                            // 4. Server Sync
                                            router.refresh();

                                        } catch (err: any) {
                                            console.error('Status update error:', err);
                                            alert(`Failed to update status: ${err.message}`);

                                            // Revert on failure
                                            // (Optional but good practice - logic omitted for brevity as per user request to just fix list update)
                                            router.refresh();
                                        }
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border-0 ring-1 ring-inset cursor-pointer focus:ring-2 focus:ring-indigo-600 ${selectedApp.status === 'APPROVED' || selectedApp.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                        selectedApp.status === 'REJECTED' || selectedApp.status === 'DECLINED' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                            'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                        }`}
                                >
                                    <option value="PROCESSING">PROCESSING</option>
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="DECLINED">DECLINED</option>
                                </select>
                                <button onClick={closeView} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Text Data */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Personal Information</h4>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="font-semibold text-gray-700">Name:</span>
                                            <span className="col-span-2">{decrypt(selectedApp.firstName)} {decrypt(selectedApp.lastName)}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="font-semibold text-gray-700">Nationality:</span>
                                            <span className="col-span-2">{selectedApp.nationality}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="font-semibold text-gray-700">Gender:</span>
                                            <span className="col-span-2">{selectedApp.gender || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Passport & Travel</h4>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="font-semibold text-gray-700">Passport No:</span>
                                            <span className="col-span-2 font-mono">{decrypt(selectedApp.passportNumber)}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="font-semibold text-gray-700">Expiry:</span>
                                            <span className="col-span-2">{formatDate(selectedApp.passportExpiry)}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="font-semibold text-gray-700">Travel Date:</span>
                                            <span className="col-span-2">{formatDate(selectedApp.travelDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Details</h4>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="font-semibold text-gray-700">Email:</span>
                                            <span className="col-span-2">{decrypt(selectedApp.email)}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="font-semibold text-gray-700">Phone:</span>
                                            <span className="col-span-2">{decrypt(selectedApp.phone)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Encrypted Images */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Secure Documents</h4>

                                <div className="space-y-4">
                                    <FileViewer
                                        label="PASSPORT COVER"
                                        dataUrl={parsedData?.images?.passport}
                                    />
                                    <FileViewer
                                        label="PERSONAL PHOTO"
                                        dataUrl={parsedData?.images?.photo}
                                    />
                                </div>
                                <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-md">
                                    <strong>Security Note:</strong> These documents have been decrypted for your session only.
                                </div>
                            </div>

                            {/* Full Dynamic Data Dump */}
                            <div className="col-span-1 md:col-span-2 border-t pt-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Detailed Information (All Fields)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                    {parsedData && Object.entries(parsedData).map(([key, value]) => {
                                        // Skip known images and internal flags
                                        if (['images', 'passportCover', 'photo', 'passportCoverImage', 'privacyPolicy', 'serviceAgreement'].includes(key)) return null;
                                        if (typeof value === 'object') return null; // Skip nested objects if any

                                        // Format Key
                                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                                        return (
                                            <div key={key} className="break-words">
                                                <span className="block text-xs font-semibold text-gray-500 uppercase">{label}</span>
                                                <span className="text-sm text-gray-900">{String(value)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Legal Consent Log */}
                            <div className="col-span-1 md:col-span-2 border-t pt-6 mb-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Legal Consent Log
                                </h4>
                                <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 space-y-2 overflow-x-auto">
                                    <div className="grid grid-cols-12 gap-2 border-b border-gray-700 pb-2 mb-2 text-gray-500 uppercase">
                                        <div className="col-span-3">Timestamp</div>
                                        <div className="col-span-3">Action</div>
                                        <div className="col-span-3">IP Address</div>
                                        <div className="col-span-3">User Agent</div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-2 hover:bg-white/5 py-1 rounded">
                                        <div className="col-span-3 text-green-400">
                                            {formatDate(selectedApp.createdAt, true)}
                                        </div>
                                        <div className="col-span-3 text-white">
                                            <span className="text-green-500">✓</span> Privacy Policy
                                        </div>
                                        <div className="col-span-3 truncate" title={selectedApp.ipAddress || 'Unknown'}>{selectedApp.ipAddress || 'Unknown'}</div>
                                        <div className="col-span-3 truncate" title={selectedApp.userAgent || 'Unknown'}>{selectedApp.userAgent || 'Unknown'}</div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-2 hover:bg-white/5 py-1 rounded">
                                        <div className="col-span-3 text-green-400">
                                            {formatDate(selectedApp.createdAt, true)}
                                        </div>
                                        <div className="col-span-3 text-white">
                                            <span className="text-green-500">✓</span> Service Agreement
                                        </div>
                                        <div className="col-span-3 truncate" title={selectedApp.ipAddress || 'Unknown'}>{selectedApp.ipAddress || 'Unknown'}</div>
                                        <div className="col-span-3 truncate" title={selectedApp.userAgent || 'Unknown'}>{selectedApp.userAgent || 'Unknown'}</div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 italic">
                                    * Consent was digitally recorded at the time of submission alongside the applicants IP and Device information.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
