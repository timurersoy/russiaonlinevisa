import React from 'react';
import Image from 'next/image';
import { CheckCircle, Briefcase } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ServicesPage() {
    const t = useTranslations('ServicesPage');

    const serviceKeys = [
        'travelPlanning',
        'corporate',
        'accommodation',
        'flights',
        'meetGreet',
        'guiding',
        'transfers',
        'tours',
        'visa',
        'meetings',
        'tradeFairs',
        'yachts'
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                        {t('title')}
                    </h1>
                    <div className="w-24 h-1 bg-[#D52B1E] mx-auto rounded-full mb-8"></div>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        {t.rich('description', {
                            blue: (chunks) => <span className="font-semibold text-[#0039A6]">{chunks}</span>
                        })}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
                    <div className="bg-[#0039A6] px-8 py-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Briefcase className="h-6 w-6" />
                            {t('networkTitle')}
                        </h2>
                    </div>
                    <div className="p-8 md:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            {serviceKeys.map((key) => (
                                <div key={key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-5 w-5 text-[#D52B1E]" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{t(`list.${key}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center mb-16">
                    <p className="text-gray-700 text-lg">
                        {t.rich('contact', {
                            link: (chunks) => (
                                <a
                                    href="https://www.timtur.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0039A6] font-semibold hover:underline"
                                >
                                    {chunks}
                                </a>
                            ),
                            mail: (chunks) => (
                                <a
                                    href="mailto:timtur@timtur.com"
                                    className="text-[#0039A6] font-semibold hover:underline"
                                >
                                    {chunks}
                                </a>
                            )
                        })}
                    </p>
                </div>

                {/* Logo */}
                <div className="flex justify-center">
                    <div className="relative w-64 h-32">
                        <Image
                            src="/timtur-logo.png"
                            alt="Timtur Travel Agency"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
