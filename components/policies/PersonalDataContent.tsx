import React from 'react';
import { Shield, Mail, MapPin, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PersonalDataContent() {
    const t = useTranslations('PersonalDataPage');

    return (
        <div className="text-gray-700 leading-relaxed">
            <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-6 mb-8">
                <span>{t.rich('header.lastUpdated', { strong: (chunks) => <strong>{chunks}</strong> })}</span>
            </div>

            {/* Section 1 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#0039A6] text-sm font-bold">1</span>
                    {t('sections.0.title')}
                </h2>
                <p className="mb-4">
                    {t.rich('sections.0.content.0', { strong: (chunks) => <strong>{chunks}</strong> })}
                </p>
                <p className="mb-4">
                    {t.rich('sections.0.content.1', { blue: (chunks) => <span className="text-[#0039A6]">{chunks}</span> })}
                </p>
                <p>
                    {t('sections.0.content.2')}
                </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#0039A6] text-sm font-bold">2</span>
                    {t('sections.1.title')}
                </h2>
                <p className="mb-4">{t('sections.1.content')}</p>
                <ul className="list-disc pl-14 space-y-2">
                    <li>{t.rich('sections.1.list.0', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.1.list.1', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.1.list.2', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.1.list.3', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>
                        {t.rich('sections.1.list.4', {
                            strong: (chunks) => <strong>{chunks}</strong>,
                            br: () => <br />,
                            em: (chunks) => <em className="text-sm text-gray-500">{chunks}</em>
                        })}
                    </li>
                </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#0039A6] text-sm font-bold">3</span>
                    {t('sections.2.title')}
                </h2>
                <p className="mb-4">{t('sections.2.content')}</p>
                <div className="grid md:grid-cols-2 gap-4 pl-11">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sections.2.cards.0.title')}</h4>
                        <p className="text-sm">{t('sections.2.cards.0.text')}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sections.2.cards.1.title')}</h4>
                        <p className="text-sm">{t('sections.2.cards.1.text')}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sections.2.cards.2.title')}</h4>
                        <p className="text-sm">{t('sections.2.cards.2.text')}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sections.2.cards.3.title')}</h4>
                        <p className="text-sm">{t('sections.2.cards.3.text')}</p>
                    </div>
                </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#0039A6] text-sm font-bold">4</span>
                    {t('sections.3.title')}
                </h2>
                <p className="mb-4">{t('sections.3.content')}</p>
                <ol className="list-decimal pl-14 space-y-2 marker:font-bold marker:text-gray-500">
                    <li>{t('sections.3.list.0')}</li>
                    <li>{t('sections.3.list.1')}</li>
                    <li>{t('sections.3.list.2')}</li>
                </ol>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#0039A6] text-sm font-bold">5</span>
                    {t('sections.4.title')}
                </h2>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                    <p className="mb-3">
                        {t('sections.4.box.p1')}
                    </p>
                    <p className="font-medium text-[#0039A6]">
                        {t('sections.4.box.p2')}
                    </p>
                </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#0039A6] text-sm font-bold">6</span>
                    {t('sections.5.title')}
                </h2>
                <p className="mb-4">{t('sections.5.content')}</p>
                <ul className="list-disc pl-14 space-y-2">
                    <li>{t.rich('sections.5.list.0', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.5.list.1', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#0039A6] text-sm font-bold">7</span>
                    {t('sections.6.title')}
                </h2>
                <p className="mb-4">{t('sections.6.content')}</p>
                <ul className="list-disc pl-14 space-y-4">
                    <li>
                        {t.rich('sections.6.list.0', { strong: (chunks) => <strong>{chunks}</strong> })}
                    </li>
                    <li>
                        {t.rich('sections.6.list.1', { strong: (chunks) => <strong>{chunks}</strong> })}
                        <ul className="list-circle pl-5 mt-2 space-y-1 text-gray-600">
                            <li>{t('sections.6.sublist.0')}</li>
                            <li>{t('sections.6.sublist.1')}</li>
                            <li>{t('sections.6.sublist.2')}</li>
                        </ul>
                    </li>
                </ul>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#0039A6] text-sm font-bold">8</span>
                    {t('sections.7.title')}
                </h2>
                <p className="mb-4">{t('sections.7.content')}</p>
                <ul className="grid md:grid-cols-2 gap-2 pl-11 text-sm">
                    <li className="flex items-start gap-2"><span className="text-[#0039A6] mt-1">•</span> {t('sections.7.list.0')}</li>
                    <li className="flex items-start gap-2"><span className="text-[#0039A6] mt-1">•</span> {t('sections.7.list.1')}</li>
                    <li className="flex items-start gap-2"><span className="text-[#0039A6] mt-1">•</span> {t('sections.7.list.2')}</li>
                    <li className="flex items-start gap-2"><span className="text-[#0039A6] mt-1">•</span> {t('sections.7.list.3')}</li>
                    <li className="flex items-start gap-2"><span className="text-[#0039A6] mt-1">•</span> {t('sections.7.list.4')}</li>
                    <li className="flex items-start gap-2"><span className="text-[#0039A6] mt-1">•</span> {t('sections.7.list.5')}</li>
                    <li className="flex items-start gap-2"><span className="text-[#0039A6] mt-1">•</span> {t('sections.7.list.6')}</li>
                    <li className="flex items-start gap-2"><span className="text-[#0039A6] mt-1">•</span> {t('sections.7.list.7')}</li>
                </ul>
                <p className="mt-4 pl-11 italic text-gray-500">{t('sections.7.note')}</p>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#0039A6] text-sm font-bold">9</span>
                    {t('sections.8.title')}
                </h2>
                <p className="mb-4">{t('sections.8.content')}</p>
                <ul className="list-disc pl-14 space-y-2">
                    <li>{t.rich('sections.8.list.0', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                    <li>{t.rich('sections.8.list.1', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                </ul>
            </section>

            {/* Section 10 */}
            <section className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0039A6] text-white text-sm font-bold">10</span>
                    {t('sections.9.title')}
                </h2>
                <p className="mb-6">{t('sections.9.content')}</p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.9.details.company')}</h4>
                        <p>TİM-TUR TURİZM İÇ-DIŞ TİC.LTD.ŞTİ.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.9.details.address')}</h4>
                        <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p>SEHREMİNİ MAH. KIZILELMA CAD. No:2 FATİH/ İSTANBUL, 34104 TÜRKİYE</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.9.details.email')}</h4>
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <a href="mailto:info@russiaonlinevisa.com" className="text-[#0039A6] hover:underline">info@russiaonlinevisa.com</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{t('sections.9.details.website')}</h4>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-gray-400" />
                            <a href="https://www.russiaonlinevisa.com" className="text-[#0039A6] hover:underline">www.russiaonlinevisa.com</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
