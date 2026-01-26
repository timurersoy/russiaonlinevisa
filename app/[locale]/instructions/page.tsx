'use client';

import React, { useState } from 'react';
import { AlertCircle, Info, Globe, MapPin, FileText, CheckCircle, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { checkpointStructure } from './checkpointsData';

export default function InstructionsPage() {
    const t = useTranslations('InstructionsPage');

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4 uppercase leading-tight">
                        {t('title')}
                    </h1>
                </div>

                <div className="space-y-8">
                    {/* Key Conditions */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6">
                            <div className="flex gap-3">
                                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="space-y-2">
                                    <p className="text-amber-800 font-medium">{t('important.title')}</p>
                                    <p
                                        className="text-amber-900 text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: t.raw('important.text1') }}
                                    />
                                    <p className="text-amber-900 text-sm leading-relaxed">
                                        {t('important.text2')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p>{t('intro.p1')}</p>
                            <p>{t('intro.p2')}</p>
                        </div>
                    </section>

                    {/* Eligible Countries */}
                    <section id="eligible-countries" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-[#0039A6] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                            <Globe className="h-6 w-6" />
                            {t('countries.title')}
                        </h2>
                        <p className="text-gray-700 mb-6">
                            {t('countries.desc')}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-700">
                            {(t.raw('countries.list') as string[]).map((country, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <span className="text-[#D52B1E]">•</span> {country}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Border Crossing Points */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-[#D52B1E] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                            <MapPin className="h-6 w-6" />
                            {t('checkpoints.title')}
                        </h2>
                        <p className="text-gray-700 mb-6">
                            {t('checkpoints.desc')}
                        </p>

                        <div className="space-y-4">
                            {checkpointStructure.map((type) => (
                                <CollapsibleSection key={type.type} title={t(`checkpoints.types.${type.type}`)}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        {type.regions.map((region) => (
                                            <RegionGroup
                                                key={region.id}
                                                title={t(`checkpoints.regions.${region.id}`)}
                                                points={region.points.map(p => t(`checkpoints.points.${p}`))}
                                            />
                                        ))}
                                    </div>
                                </CollapsibleSection>
                            ))}
                        </div>
                    </section>

                    {/* Additional Rules & Application Info */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-[#0039A6] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                            <FileText className="h-6 w-6" />
                            {t('rules.title')}
                        </h2>

                        <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
                            {[
                                'noInvitations', 'activities', 'movement', 'extension',
                                'existing', 'timing', 'consent', 'correction',
                                'mandatory', 'minors', 'accuracy', 'insurance', 'refusals'
                            ].map((ruleKey) => (
                                <RuleBlock
                                    key={ruleKey}
                                    title={t(`rules.items.${ruleKey}.title`)}
                                    text={t(`rules.items.${ruleKey}.text`)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Status & Outcome */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                            <Info className="h-6 w-6" />
                            {t('status.title')}
                        </h2>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>
                                    <strong>{t('status.items.processing.title')}</strong> {t('status.items.processing.text')}
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>
                                    <strong>{t('status.items.completion.title')}</strong> {t('status.items.completion.text')}
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>
                                    <strong>{t('status.items.positive.title')}</strong> {t('status.items.positive.text')}
                                </span>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}

function CollapsibleSection({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-100 rounded-lg overflow-hidden bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <div>
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    {!isOpen && <p className="text-xs text-gray-500 mt-1">Click to view checkpoints</p>}
                </div>
                <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </button>
            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-6 border-t border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
}

function RegionGroup({ title, points }: { title: string, points: string[] }) {
    return (
        <div>
            <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
            <ul className="space-y-1">
                {points.map((point, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400">•</span> {point}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function RuleBlock({ title, text }: { title: string, text: string }) {
    return (
        <div>
            <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-gray-700">{text}</p>
        </div>
    );
}
