'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

type FAQItem = {
    question: string;
    answer: React.ReactNode;
};

type FAQSection = {
    title: string;
    items: FAQItem[];
};

function FAQItem({ item }: { item: FAQItem }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-start justify-between py-5 text-left focus:outline-none"
            >
                <h3 className="text-md sm:text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                </h3>
                <span className="flex-shrink-0 ml-2">
                    {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-[#0039A6]" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                </span>
            </button>
            {isOpen && (
                <div className="pb-5 text-gray-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                    {item.answer}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    const t = useTranslations('FaqPage');

    const sections = [
        {
            key: 'general',
            items: ['whatIs', 'guarantee', 'stayDuration', 'multiEntry', 'work', 'transit']
        },
        {
            key: 'requirements',
            items: ['documents', 'passport', 'insurance', 'children', 'dualCitizenship']
        },
        {
            key: 'process',
            items: ['duration', 'family', 'mistakes', 'language', 'parentsInfo']
        },
        {
            key: 'payment',
            items: ['cost', 'othersCard', 'refund']
        },
        {
            key: 'travel',
            items: ['entryPoints', 'freedom', 'hotel', 'registration', 'support']
        }
    ];

    const faqData: FAQSection[] = sections.map(section => ({
        title: t(`sections.${section.key}.title`),
        items: section.items.map(itemKey => ({
            question: t(`sections.${section.key}.items.${itemKey}.q`),
            answer: itemKey === 'support' ? (
                t.rich(`sections.${section.key}.items.${itemKey}.a`, {
                    email: (chunks) => <a href="mailto:info@timtur.com" className="text-blue-600 hover:underline">{chunks}</a>,
                    phone: (chunks) => <a href="tel:+905302028530" className="text-blue-600 hover:underline">{chunks}</a>
                })
            ) : (
                t(`sections.${section.key}.items.${itemKey}.a`)
            )
        }))
    }));

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
                    <p className="text-lg text-gray-600">
                        {t('description')}
                    </p>
                </div>

                <div className="space-y-8">
                    {faqData.map((section, index) => (
                        <section key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#0039A6] mb-4 border-b border-gray-100 pb-4">
                                {section.title}
                            </h2>
                            <div className="flex flex-col">
                                {section.items.map((item, i) => (
                                    <FAQItem key={i} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
