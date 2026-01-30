'use client';

import { useState } from 'react';
import { Link } from '@/app/i18n/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import VisaCalculatorModal from './VisaCalculatorModal';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Navbar() {
    const t = useTranslations('Navbar');
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <VisaCalculatorModal
                isOpen={isCalculatorOpen}
                onClose={() => setIsCalculatorOpen(false)}
            />
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/navbar-logo.png"
                            alt="Russia Online Visa"
                            width={150}
                            height={60}
                            className="h-10 w-auto object-contain mix-blend-multiply sm:h-12"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[#0039A6] transition-colors whitespace-nowrap">
                            {t('home')}
                        </Link>
                        <button
                            onClick={() => setIsCalculatorOpen(true)}
                            className="text-sm font-medium text-gray-700 hover:text-[#0039A6] transition-colors whitespace-nowrap"
                        >
                            {t('calculator')}
                        </button>
                        <Link href="/instructions" className="text-sm font-medium text-gray-700 hover:text-[#0039A6] transition-colors whitespace-nowrap">
                            {t('instructions')}
                        </Link>
                        <Link href="/faq" className="text-sm font-medium text-gray-700 hover:text-[#0039A6] transition-colors whitespace-nowrap">
                            {t('faq')}
                        </Link>
                        <Link href="/services" className="text-sm font-medium text-gray-700 hover:text-[#0039A6] transition-colors whitespace-nowrap">
                            {t('services')}
                        </Link>
                        <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-[#0039A6] transition-colors whitespace-nowrap">
                            {t('contact')}
                        </Link>
                        <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#0039A6] transition-colors whitespace-nowrap">
                            {t('about')}
                        </Link>
                    </nav>

                    {/* Desktop Right Actions */}
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/apply"
                                className="rounded-md bg-[#D52B1E] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#B01F15] transition-all"
                            >
                                {t('apply')}
                            </Link>
                            <Link
                                href="/track"
                                className="rounded-md bg-[#0039A6] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#002D80] transition-all"
                            >
                                {t('track')}
                            </Link>
                        </div>

                        <div className="h-6 w-px bg-gray-300"></div>

                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu Button - Visible on screens smaller than lg */}
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Visible on screens smaller than lg */}
                {isOpen && (
                    <div className="absolute top-16 left-0 w-full border-t border-gray-100 bg-white shadow-xl lg:hidden animate-in slide-in-from-top-2 duration-200 z-40">
                        <div className="space-y-1 px-4 pb-6 pt-4">
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0039A6] transition-colors"
                            >
                                {t('home')}
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsCalculatorOpen(true);
                                }}
                                className="block w-full text-left rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0039A6] transition-colors"
                            >
                                {t('calculator')}
                            </button>
                            <Link
                                href="/instructions"
                                onClick={() => setIsOpen(false)}
                                className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0039A6] transition-colors"
                            >
                                {t('instructions')}
                            </Link>
                            <Link
                                href="/faq"
                                onClick={() => setIsOpen(false)}
                                className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0039A6] transition-colors"
                            >
                                {t('faq')}
                            </Link>
                            <Link
                                href="/services"
                                onClick={() => setIsOpen(false)}
                                className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0039A6] transition-colors"
                            >
                                {t('services')}
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0039A6] transition-colors"
                            >
                                {t('contact')}
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setIsOpen(false)}
                                className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0039A6] transition-colors"
                            >
                                {t('about')}
                            </Link>
                        </div>
                        <div className="border-t border-gray-100 px-6 py-6 space-y-4 bg-gray-50/50">
                            <Link
                                href="/apply"
                                onClick={() => setIsOpen(false)}
                                className="block w-full items-center justify-center rounded-lg bg-[#D52B1E] px-4 py-3.5 text-center text-base font-bold text-white shadow-md hover:bg-[#B01F15] transition-all active:scale-[0.98]"
                            >
                                {t('apply')}
                            </Link>
                            <Link
                                href="/track"
                                onClick={() => setIsOpen(false)}
                                className="block w-full items-center justify-center rounded-lg bg-[#0039A6] px-4 py-3.5 text-center text-base font-bold text-white shadow-md hover:bg-[#002D80] transition-all active:scale-[0.98]"
                            >
                                {t('track')}
                            </Link>
                            <div className="flex justify-center pt-2">
                                <LanguageSwitcher isMobile={true} />
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
