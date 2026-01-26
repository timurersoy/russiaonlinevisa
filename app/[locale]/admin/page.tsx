import { decrypt } from '@/lib/crypto';
import AdminApplicationList from '@/components/AdminApplicationList';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { Link } from '@/app/i18n/navigation';
import { LogOut } from 'lucide-react';
import AdminMessagesTable from '@/components/AdminMessagesTable';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

async function getAdminSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export default async function AdminDashboardPage() {
    const session = await getAdminSession();
    if (!session) {
        redirect('/login');
    }

    // Fetch Data
    const rawApplications = await prisma.application.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    // Decrypt Data for Display
    const applications = rawApplications.map(app => ({
        ...app,
        firstName: decrypt(app.firstName),
        lastName: decrypt(app.lastName),
        email: decrypt(app.email),
        phone: decrypt(app.phone),
        passportNumber: decrypt(app.passportNumber),
        additionalData: decrypt(app.additionalData || ''),
    }));

    const messages = await prisma.contactRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar (Keep existing) */}
            <nav className="bg-[#0039A6] text-white shadow-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <span className="font-bold text-xl tracking-tight">Admin Portal</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm opacity-80">{(session as any).email}</span>
                            <Link href="/login" className="p-2 hover:bg-[#002D80] rounded-full">
                                <LogOut className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Overview of recent activity</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">Total Applications</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{applications.length}</dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">Pending Review</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">
                            {applications.filter(a => a.status === 'PENDING').length}
                        </dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">Unread Messages</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {messages.filter(m => !m.read).length}
                        </dd>
                    </div>
                </div>

                {/* Applications List with Decryption and Modal Support */}
                <AdminApplicationList applications={applications} />

                {/* Messages Table */}
                <AdminMessagesTable messages={messages} />

            </main>
        </div>
    );
}


