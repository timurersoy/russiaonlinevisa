import React from 'react';
import Image from 'next/image';
import { Link } from '@/app/i18n/navigation';
import { FileText, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
    const t = useTranslations('AboutPage');

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Content */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 uppercase tracking-wide">
                        {t('title')}
                    </h1>

                    <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed text-justify">
                        <p className="mb-6">
                            {t.rich('description.p1', {
                                strong: (chunks) => <strong>{chunks}</strong>
                            })}
                        </p>
                        <p className="mb-6">
                            {t('description.p2')}
                        </p>
                        <p className="mb-6">
                            {t.rich('description.p3', {
                                strong: (chunks) => <strong>{chunks}</strong>
                            })}
                        </p>
                        <p>
                            {t.rich('description.p4', {
                                link: (chunks) => <a href="https://www.timtur.com" target="_blank" rel="noopener noreferrer" className="text-[#0039A6] font-semibold hover:underline">{chunks}</a>
                            })}
                        </p>
                    </div>
                </div>

                {/* Policy Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <Link
                        href="/policies/services-agreement"
                        className="group flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#0039A6] hover:shadow-md transition-all cursor-pointer"
                    >
                        <FileText className="h-10 w-10 text-gray-400 group-hover:text-[#0039A6] mb-4 transition-colors" />
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0039A6] transition-colors">
                            {t('links.termsTitle')}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            {t('links.termsDesc')}
                        </p>
                    </Link>

                    <Link
                        href="/policies/personal-data"
                        className="group flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#D52B1E] hover:shadow-md transition-all cursor-pointer"
                    >
                        <Shield className="h-10 w-10 text-gray-400 group-hover:text-[#D52B1E] mb-4 transition-colors" />
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#D52B1E] transition-colors">
                            {t('links.privacyTitle')}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            {t('links.privacyDesc')}
                        </p>
                    </Link>
                </div>

                {/* Logo */}
                <div className="flex justify-center border-t border-gray-100 pt-12">
                    <div className="relative w-64 h-32">
                        <Image
                            src="/timtur-logo.png"
                            alt="Timtur Travel Agency Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
