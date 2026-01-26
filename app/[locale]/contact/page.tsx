'use client';

import { useState } from 'react';
import { Mail, Phone, Send, CheckCircle, HelpCircle } from 'lucide-react';
import { Link, useRouter, usePathname } from '@/app/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
    const t = useTranslations('ContactPage');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsSent(true);
            } else {
                alert(t('form.error'));
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert(t('form.error'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl uppercase">
                        {t('title')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Contact Information Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Info Cards */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg shadow-blue-900/5 border border-gray-100 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>

                            <div className="flex items-start gap-4 relative z-10">
                                <div className="bg-[#0039A6]/10 p-3 rounded-xl">
                                    <Phone className="h-6 w-6 text-[#0039A6]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('sidebar.phoneTitle')}</h3>
                                    <a href="https://wa.me/905302028530" target="_blank" rel="noopener noreferrer" className="block mt-2 text-gray-600 hover:text-[#0039A6] transition-colors font-medium">
                                        +90 530 202 85 30
                                    </a>
                                    <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">{t('sidebar.phoneSupport')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 relative z-10">
                                <div className="bg-[#D52B1E]/10 p-3 rounded-xl">
                                    <Mail className="h-6 w-6 text-[#D52B1E]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('sidebar.emailTitle')}</h3>
                                    <a href="mailto:info@russiaonlinevisa.com" className="block mt-2 text-gray-600 hover:text-[#D52B1E] transition-colors font-medium">
                                        info@russiaonlinevisa.com
                                    </a>
                                    <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">{t('sidebar.emailResponse')}</p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Link Card */}
                        <div className="bg-gradient-to-br from-[#0039A6] to-[#002875] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <HelpCircle className="w-24 h-24" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 relative z-10">{t('sidebar.faqTitle')}</h3>
                            <p className="text-blue-100 mb-6 relative z-10 text-sm leading-relaxed">
                                {t('sidebar.faqDesc')}
                            </p>
                            <Link href="/faq" className="inline-flex items-center text-sm font-bold bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all relative z-10">
                                {t('sidebar.faqButton')} <span className="ml-2 rtl:rotate-180">&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-gray-100 p-8 sm:p-12 relative">
                            {isSent ? (
                                <div className="text-center py-12">
                                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('form.success.title')}</h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        {t.rich('form.success.message', {
                                            strong: (chunks) => <strong>{chunks}</strong>
                                        })}
                                    </p>
                                    <button
                                        onClick={() => setIsSent(false)}
                                        className="mt-8 text-[#0039A6] font-semibold hover:underline"
                                    >
                                        {t('form.success.sendAnother')}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('form.title')}</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-bold text-gray-700">{t('form.name')}</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    required
                                                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#0039A6] focus:ring-4 focus:ring-[#0039A6]/5 transition-all bg-gray-50 focus:bg-white"
                                                    placeholder={t('form.placeholders.name')}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-bold text-gray-700">{t('form.email')}</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#0039A6] focus:ring-4 focus:ring-[#0039A6]/5 transition-all bg-gray-50 focus:bg-white"
                                                    placeholder={t('form.placeholders.email')}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-bold text-gray-700">{t('form.subject')}</label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#0039A6] focus:ring-4 focus:ring-[#0039A6]/5 transition-all bg-gray-50 focus:bg-white cursor-pointer"
                                            >
                                                <option value="General Inquiry">{t('form.subjects.general')}</option>
                                                <option value="Application Status">{t('form.subjects.status')}</option>
                                                <option value="Payment Issue">{t('form.subjects.payment')}</option>
                                                <option value="Technical Support">{t('form.subjects.tech')}</option>
                                                <option value="Partnership">{t('form.subjects.partnership')}</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-bold text-gray-700">{t('form.message')}</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                rows={6}
                                                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#0039A6] focus:ring-4 focus:ring-[#0039A6]/5 transition-all bg-gray-50 focus:bg-white resize-none"
                                                placeholder={t('form.placeholders.message')}
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-[#D52B1E] px-8 py-4 text-base font-bold text-white shadow-lg shadow-red-600/20 hover:bg-[#B01F15] hover:shadow-red-600/30 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D52B1E] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {isSubmitting ? t('form.submitting') : t('form.submit')}
                                            {!isSubmitting && <Send className="ml-2 h-4 w-4 rtl:rotate-180" />}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
