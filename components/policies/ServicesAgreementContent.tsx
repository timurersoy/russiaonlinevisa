import React from 'react';
import { FileText, Globe, Mail, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ServicesAgreementContent() {
    const t = useTranslations('ServicesAgreementPage');

    return (
        <div className="text-gray-700 leading-relaxed">
            <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-6 mb-8">
                <span>{t.rich('header.lastUpdated', { strong: (chunks) => <strong>{chunks}</strong> })}</span>
            </div>

            {/* Section 1 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#D52B1E] text-sm font-bold">1</span>
                    {t('sections.0.title')}
                </h2>
                <p className="mb-4">{t('sections.0.content')}</p>
                <ul className="list-disc pl-14 space-y-2 mb-4">
                    <li>
                        {t.rich('sections.0.list.0', {
                            strong: (chunks) => <strong>{chunks}</strong>,
                            red: (chunks) => <span className="text-[#D52B1E]">{chunks}</span>
                        })}
                    </li>
                    <li>
                        {t.rich('sections.0.list.1', {
                            strong: (chunks) => <strong>{chunks}</strong>
                        })}
                    </li>
                </ul>
                <p className="pl-11 italic text-gray-600">
                    {t('sections.0.note')}
                </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#D52B1E] text-sm font-bold">2</span>
                    {t('sections.1.title')}
                </h2>
                <p className="mb-4">
                    {t('sections.1.content')}
                </p>
                <div className="bg-red-50 border border-red-100 rounded-lg p-5 ml-11">
                    <p className="font-semibold text-[#D52B1E] mb-2">{t('sections.1.disclaimer.title')}</p>
                    <p className="text-sm">
                        {t('sections.1.disclaimer.text')}
                    </p>
                </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#D52B1E] text-sm font-bold">3</span>
                    {t('sections.2.title')}
                </h2>
                <p className="mb-4">{t('sections.2.content')}</p>
                <ul className="list-disc pl-14 space-y-2">
                    <li>{t.rich('sections.2.list.0', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.2.list.1', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.2.list.2', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.2.list.3', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.2.list.4', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#D52B1E] text-sm font-bold">4</span>
                    {t('sections.3.title')}
                </h2>
                <p className="mb-4">{t('sections.3.content')}</p>
                <ol className="list-decimal pl-14 space-y-2 mb-4 marker:font-bold marker:text-gray-500">
                    <li>{t.rich('sections.3.list.0', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.3.list.1', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.3.list.2', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.3.list.3', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                </ol>
                <p className="pl-11">
                    {t.rich('sections.3.note', { strong: (chunks) => <strong>{chunks}</strong> })}
                </p>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#D52B1E] text-sm font-bold">5</span>
                    {t('sections.4.title')}
                </h2>
                <p className="mb-4">{t('sections.4.content')}</p>
                <div className="space-y-4 pl-11">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.4.subsections.0.title')}</h4>
                        <p className="text-sm">{t('sections.4.subsections.0.text')}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.4.subsections.1.title')}</h4>
                        <p className="text-sm">{t('sections.4.subsections.1.text')}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.4.subsections.2.title')}</h4>
                        <p className="text-sm">{t('sections.4.subsections.2.text')}</p>
                    </div>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>{t.rich('sections.4.endList.0', {
                            strong: (chunks) => <strong>{chunks}</strong>,
                            link: (chunks) => <a href="mailto:info@russiaonlinevisa.com" className="text-[#D52B1E] hover:underline">{chunks}</a>
                        })}</li>
                        <li>{t.rich('sections.4.endList.1', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    </ul>
                </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#D52B1E] text-sm font-bold">6</span>
                    {t('sections.5.title')}
                </h2>
                <p className="mb-4">{t('sections.5.content')}</p>
                <ul className="list-disc pl-14 space-y-2">
                    <li>{t('sections.5.list.0')}</li>
                    <li>{t('sections.5.list.1')}</li>
                    <li>{t('sections.5.list.2')}</li>
                    <li>{t('sections.5.list.3')}</li>
                </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#D52B1E] text-sm font-bold">7</span>
                    {t('sections.6.title')}
                </h2>
                <ul className="list-disc pl-14 space-y-2">
                    <li>{t.rich('sections.6.list.0', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.6.list.1', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.6.list.2', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                </ul>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#D52B1E] text-sm font-bold">8</span>
                    {t('sections.7.title')}
                </h2>
                <p className="pl-11">
                    {t('sections.7.content')}
                </p>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#D52B1E] text-sm font-bold">9</span>
                    {t('sections.8.title')}
                </h2>
                <p className="pl-11">
                    {t.rich('sections.8.content', { red: (chunks) => <span className="text-[#D52B1E]">{chunks}</span> })}
                </p>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#D52B1E] text-sm font-bold">10</span>
                    {t('sections.9.title')}
                </h2>
                <p className="pl-11">
                    {t('sections.9.content')}
                </p>
            </section>

            {/* Section 11 */}
            <section className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D52B1E] text-white text-sm font-bold">11</span>
                    {t('sections.10.title')}
                </h2>
                <p className="mb-6">{t('sections.10.content')}</p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.10.details.company')}</h4>
                        <p>TİM-TUR TURİZM İÇ-DIŞ TİC.LTD.ŞTİ.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.10.details.address')}</h4>
                        <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p>SEHREMİNİ MAH. KIZILELMA CAD. No:2 FATİH/ İSTANBUL, 34104 TÜRKİYE</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.10.details.email')}</h4>
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <a href="mailto:info@russiaonlinevisa.com" className="text-[#D52B1E] hover:underline">info@russiaonlinevisa.com</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.10.details.website')}</h4>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-gray-400" />
                            <a href="https://www.russiaonlinevisa.com" className="text-[#D52B1E] hover:underline">www.russiaonlinevisa.com</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
