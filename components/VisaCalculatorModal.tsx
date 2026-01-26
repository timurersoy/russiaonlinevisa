'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { enUS, ru, tr, ar, zhCN } from 'date-fns/locale';
import { useLocale } from 'next-intl';

// Register locales
registerLocale('en', enUS);
registerLocale('ru', ru);
registerLocale('tr', tr);
registerLocale('ar', ar);
registerLocale('zh', zhCN);

interface VisaCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function VisaCalculatorModal({ isOpen, onClose }: VisaCalculatorModalProps) {
    const t = useTranslations('VisaCalculator');
    const locale = useLocale();
    const [entryDate, setEntryDate] = useState<Date | null>(null);
    const [resultDate, setResultDate] = useState<string | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setEntryDate(null);
            setResultDate(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCalculate = () => {
        if (!entryDate) return;

        const entry = new Date(entryDate);
        // Add 29 days (since entry day counts as day 1)
        const exit = new Date(entry);
        exit.setDate(entry.getDate() + 29);

        const exitDay = String(exit.getDate()).padStart(2, '0');
        const exitMonth = String(exit.getMonth() + 1).padStart(2, '0');
        const exitYear = exit.getFullYear();

        setResultDate(`${exitDay}.${exitMonth}.${exitYear}`);
    };

    // Calculate min and max dates
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 5);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 89);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-3xl transform rounded-lg bg-white p-6 shadow-xl transition-all sm:p-8">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="mt-2">
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                        {t('intro')}
                    </h3>

                    <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <label htmlFor="entry-date" className="block text-sm font-medium text-gray-700">
                                {t('entryDateLabel')}<span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-2 visa-calendar-wrapper">
                                <DatePicker
                                    selected={entryDate}
                                    onChange={(date) => setEntryDate(date)}
                                    locale={locale} // Uses the current app locale
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    dateFormat="dd.MM.yyyy"
                                    placeholderText={t('placeholder')}
                                    className="block w-full rounded-md border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-[#0039A6] focus:ring-[#0039A6] sm:text-sm border"
                                    calendarClassName="visa-calendar"
                                    wrapperClassName="w-full"
                                />
                            </div>
                        </div>
                        <div className="flex-1 sm:flex-none">
                            <button
                                onClick={handleCalculate}
                                className="w-full rounded-md bg-[#2B4B80] px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1E3A66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4B80] transition-colors"
                            >
                                {t('calculateButton')}
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-500">
                        {t('helperText')}
                    </div>

                    {resultDate && (
                        <div className="mt-6 text-base text-gray-900">
                            {t('resultText')} <span className="font-semibold">{resultDate} 23:59</span> {t('resultSubtext')}
                        </div>
                    )}
                </div>
            </div>
            {/* Styles for overriding DatePicker defaults if needed */}
            <style jsx global>{`
                .react-datepicker-wrapper {
                    width: 100%;
                }
                .react-datepicker__input-container input {
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
