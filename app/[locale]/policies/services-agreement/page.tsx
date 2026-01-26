import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from '@/app/i18n/navigation';
import { useTranslations } from 'next-intl';
import ServicesAgreementContent from '@/components/policies/ServicesAgreementContent';

export default function ServicesAgreementPage() {
    const t = useTranslations('ServicesAgreementPage');

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/about" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#D52B1E] mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('backLink')}
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#D52B1E] px-8 py-10 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <FileText className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-red-100 font-medium tracking-wide text-sm uppercase">{t('header.tag')}</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{t('header.title')}</h1>
                        <p className="text-red-100">{t('header.scope')}</p>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12">
                        <ServicesAgreementContent />
                    </div>
                </div>
            </div>
        </div>
    );
}
