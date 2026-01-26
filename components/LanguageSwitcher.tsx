'use client';

import { usePathname, useRouter } from '@/app/i18n/navigation';
import { useLocale } from 'next-intl';
import { useState, useTransition } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ isMobile = false }: { isMobile?: boolean }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: 'EN' },
        { code: 'tr', name: 'Türkçe', flag: 'TR' },
        { code: 'ru', name: 'Русский', flag: 'RU' },
        { code: 'ar', name: 'العربية', flag: 'AR' },
        { code: 'zh', name: '中文', flag: 'ZH' },
    ];

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    const onSelectChange = (nextLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
            setIsOpen(false);
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#0039A6] transition-colors rounded-lg hover:bg-gray-50 bg-white/50 backdrop-blur-sm border border-transparent hover:border-gray-200"
                disabled={isPending}
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage.name}</span>
                <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
            </button>

            {isOpen && (
                <div className={`absolute w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200
                    ${isMobile
                        ? 'bottom-full mb-2 left-1/2 -translate-x-1/2 origin-bottom'
                        : 'top-full right-0 mt-2 origin-top-right'
                    }`}
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onSelectChange(lang.code)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors ${locale === lang.code
                                ? 'bg-blue-50 text-[#0039A6] font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-sm font-bold w-6 text-center">{lang.flag}</span>
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Overlay to close dropdown when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
