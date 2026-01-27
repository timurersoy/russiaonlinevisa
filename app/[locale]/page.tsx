import { Link } from '@/app/i18n/navigation';
import { ShieldCheck, Globe, Clock, UserCheck, FileEdit, CreditCard, MailCheck, Printer, Plane, ChevronRight } from 'lucide-react';
import InteractiveMap from '@/components/InteractiveMap';
import { useTranslations } from 'next-intl';

import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function Home({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('HomePage');
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative py-16 sm:py-32 overflow-hidden">
                {/* Russian Flag Background */}
                <div className="absolute inset-0 z-0 flex flex-col">
                    <div className="h-1/3 w-full bg-white"></div>
                    <div className="h-1/3 w-full bg-[#0039A6]"></div>
                    <div className="h-1/3 w-full bg-[#D52B1E]"></div>
                    {/* Overlay for subtle depth */}
                    <div className="absolute inset-0 bg-black/5"></div>
                </div>

                <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-12 shadow-2xl border border-white/50">
                        <h1 className="text-3xl font-bold tracking-tight text-[#0039A6] sm:text-6xl text-center mb-6">
                            {t('heroTitle')}
                        </h1>
                        <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-700 mb-8 sm:mb-10 leading-relaxed">
                            {t('heroSubtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/apply"
                                className="inline-flex items-center justify-center rounded-md bg-[#D52B1E] px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-[#B01F15] hover:shadow-xl transition-all active:scale-[0.98]"
                            >
                                {t('startApplication')}
                            </Link>
                            <Link
                                href="/tracking"
                                className="inline-flex items-center justify-center rounded-md bg-[#0039A6] px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-[#002D80] hover:shadow-xl transition-all active:scale-[0.98]"
                            >
                                {t('trackApplication')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-8 sm:py-12 border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
                        <div className="flex flex-col items-center">
                            <dt className="text-4xl font-bold text-[#0039A6]">{t('stats.daysTitle')}</dt>
                            <dd className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">{t('stats.daysDesc')}</dd>
                        </div>
                        <div className="flex flex-col items-center">
                            <dt className="text-4xl font-bold text-[#0039A6]">{t('stats.countriesTitle')}</dt>
                            <dd className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">{t('stats.countriesDesc')}</dd>
                        </div>
                        <div className="flex flex-col items-center">
                            <dt className="text-4xl font-bold text-[#0039A6]">{t('stats.supportTitle')}</dt>
                            <dd className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">{t('stats.supportDesc')}</dd>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info / Guide Section */}
            <section className="py-12 sm:py-24 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-[#D52B1E]">{t('info.subheading')}</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-[#0039A6] sm:text-4xl">
                            {t('info.title')}
                        </p>
                        <p className="mt-2 text-xl font-medium text-[#D52B1E] sm:text-2xl italic">
                            {t('info.italic')}
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            {t('info.desc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {/* Card 1 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                                <ShieldCheck className="h-6 w-6 text-[#0039A6]" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('info.card1Title')}</h3>
                            <p className="text-gray-600">
                                {t('info.card1Desc')}
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                                <Globe className="h-6 w-6 text-[#0039A6]" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('info.card2Title')}</h3>
                            <p className="text-gray-600">
                                {t('info.card2Desc')}
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                                <Clock className="h-6 w-6 text-[#0039A6]" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('info.card3Title')}</h3>
                            <p className="text-gray-600">
                                {t('info.card3Desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How Does It Work Section */}
            <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#0039A6] blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#D52B1E] blur-3xl"></div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12 sm:mb-20">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl uppercase mb-4">
                            {t('how.title')}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t('how.desc')}
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-12 left-[10%] w-[80%] h-0.5 bg-gray-200 -z-10">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0039A6] to-[#D52B1E] opacity-20 w-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/5 group-hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#D52B1E] text-white text-sm font-bold flex items-center justify-center rounded-full shadow-md ring-4 ring-white">1</div>
                                    <div className="text-[#0039A6]">
                                        <FileEdit className="h-10 w-10" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 uppercase mb-3 group-hover:text-[#0039A6] transition-colors">
                                    {t('how.step1Title')}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">
                                    {t('how.step1Desc')}
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/5 group-hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#D52B1E] text-white text-sm font-bold flex items-center justify-center rounded-full shadow-md ring-4 ring-white">2</div>
                                    <div className="text-[#0039A6]">
                                        <Clock className="h-10 w-10" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 uppercase mb-3 group-hover:text-[#0039A6] transition-colors">
                                    {t('how.step2Title')}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">
                                    {t('how.step2Desc')}
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/5 group-hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#D52B1E] text-white text-sm font-bold flex items-center justify-center rounded-full shadow-md ring-4 ring-white">3</div>
                                    <div className="text-[#0039A6]">
                                        <Printer className="h-10 w-10" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 uppercase mb-3 group-hover:text-[#0039A6] transition-colors">
                                    {t('how.step3Title')}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">
                                    {t('how.step3Desc')}
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/5 group-hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#D52B1E] text-white text-sm font-bold flex items-center justify-center rounded-full shadow-md ring-4 ring-white">4</div>
                                    <div className="text-[#0039A6]">
                                        <Plane className="h-10 w-10" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 uppercase mb-3 group-hover:text-[#0039A6] transition-colors">
                                    {t('how.step4Title')}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">
                                    {t('how.step4Desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Eligible Countries Preview */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl uppercase mb-4">{t('eligible.title')}</h2>
                    </div>
                    <div className="prose prose-blue max-w-none text-gray-600">
                        <p className="mb-6 text-center max-w-4xl mx-auto">
                            {t.rich('eligible.desc', {
                                link: (chunks) => <Link href="/instructions#eligible-countries" className="text-[#0039A6] font-semibold hover:underline">{chunks}</Link>
                            })}
                        </p>

                        <div className="my-8">
                            <InteractiveMap />
                        </div>

                        <div className="mt-8 text-center">
                            <Link href="/instructions#eligible-countries" className="inline-flex items-center gap-2 rounded-full bg-[#0039A6]/10 px-6 py-2.5 text-sm font-semibold text-[#0039A6] hover:bg-[#0039A6]/20 transition-all">
                                {t('eligible.checkList')} &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[#111827] py-12 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                        {t('cta.title')}
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
                        {t('cta.desc')}
                    </p>
                    <Link
                        href="/apply"
                        className="inline-flex items-center justify-center rounded-md bg-[#D52B1E] px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#B01F15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D52B1E] transition-all"
                    >
                        {t('cta.button')}
                    </Link>
                </div>
            </section>
        </div>
    );
}
