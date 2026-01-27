import { Link } from '@/app/i18n/navigation';
import { Zap, User, Upload, Clock, CheckCircle, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function ApplySelectionPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('ApplyPage');
    return (
        <div className="min-h-screen bg-gray-50 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {t('title')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Option 1: Instant Application */}
                    <div className="relative flex flex-col rounded-2xl bg-white p-8 shadow-sm border-2 border-[#0039A6] ring-4 ring-[#0039A6]/5 transition-transform hover:-translate-y-1 hover:shadow-lg">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0039A6] text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                            {t('Instant.recommended')}
                        </div>

                        <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-[#0039A6] rounded-full mb-6 mx-auto">
                            <Zap className="h-8 w-8" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">{t('Instant.title')}</h2>
                        <p className="text-center text-gray-600 mb-8">
                            {t('Instant.desc')}
                        </p>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3">
                                <Upload className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <span className="text-gray-700 text-sm">{t('Instant.features.upload')}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <span className="text-gray-700 text-sm">{t('Instant.features.form')}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <span className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: t.raw('Instant.features.processing') }}></span>
                            </li>
                        </ul>

                        <Link
                            href="/apply/instant"
                            className="w-full inline-flex items-center justify-center rounded-md bg-[#0039A6] px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#002D80] transition-all"
                        >
                            {t('Instant.button')}
                        </Link>
                    </div>

                    {/* Option 2: Offline Application */}
                    <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
                        <div className="flex items-center justify-center h-16 w-16 bg-gray-100 text-gray-600 rounded-full mb-6 mx-auto">
                            <User className="h-8 w-8" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">{t('Offline.title')}</h2>
                        <p className="text-center text-gray-600 mb-8">
                            {t('Offline.desc')}
                        </p>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                <span className="text-gray-700 text-sm">{t('Offline.features.consultation')}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                <span className="text-gray-700 text-sm">{t('Offline.features.itinerary')}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                <span className="text-gray-700 text-sm">{t('Offline.features.processing')}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                <span className="text-gray-700 text-sm">{t('Offline.features.groups')}</span>
                            </li>
                        </ul>

                        <Link
                            href="/contact"
                            className="w-full inline-flex items-center justify-center rounded-md bg-white border-2 border-gray-300 px-8 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                        >
                            {t('Offline.button')}
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
