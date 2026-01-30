import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Link } from '@/app/i18n/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Facebook, Linkedin, Instagram } from 'lucide-react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
    return ['en', 'tr', 'ru', 'ar', 'zh'].map((locale) => ({ locale }));
}

export const metadata: Metadata = {
    title: 'Russia Online Visa',
    description: 'Apply for your Russia e-Visa instantly. The official, secure, and fast way to obtain electronic visas for tourism and business travel to the Russian Federation.',
    icons: {
        icon: '/navbar-logo.png',
    },
};

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Await params if necessary in newer Next.js versions, but currently params is prop
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!['en', 'tr', 'ru', 'ar', 'zh'].includes(locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();
    const tFooter = await getTranslations('Footer');

    // Set direction for Arabic
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <html lang={locale} dir={dir} className="scroll-smooth">
            <body className={inter.className} suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <div className="flex min-h-screen flex-col">
                        <Navbar />

                        {/* Main Content */}
                        <main className="flex-1">
                            {children}
                        </main>

                        {/* Floating WhatsApp Button */}
                        <a
                            href="https://wa.me/905302028530"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300`}
                            aria-label="Contact us on WhatsApp"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </a>

                        {/* Footer */}
                        {/* Footer */}
                        <footer className="bg-[#111827] text-white">
                            <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                                    <div className="col-span-1 lg:col-span-2 space-y-4">
                                        <Link href="/" className="inline-block">
                                            <span className="text-xl font-bold">russiaonlinevisa.com</span>
                                        </Link>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {tFooter('description')}
                                        </p>
                                        <div className="pt-2">
                                            <Image
                                                src="/timtur-logo.png"
                                                alt="Timtur Travel Agency Logo"
                                                width={120}
                                                height={40}
                                                className="h-10 w-auto opacity-80"
                                            />
                                        </div>
                                        <div className="mt-6 flex space-x-6">
                                            <a href="https://www.facebook.com/profile.php?id=61586953797530" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                                <span className="sr-only">Facebook</span>
                                                <Facebook className="h-6 w-6" />
                                            </a>
                                            <a href="https://tr.linkedin.com/company/timtur-travel-agency" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                                <span className="sr-only">LinkedIn</span>
                                                <Linkedin className="h-6 w-6" />
                                            </a>
                                            <a href="https://www.instagram.com/russiaonlinevisa" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                                <span className="sr-only">Instagram</span>
                                                <Instagram className="h-6 w-6" />
                                            </a>
                                            <a href="https://www.tiktok.com/@russiaonlinevisa" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                                <span className="sr-only">TikTok</span>
                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.03 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">{tFooter('headings.application')}</h3>
                                        <ul className="mt-4 space-y-3">
                                            <li><Link href="/apply" className="text-sm text-gray-400 hover:text-white transition-colors">{tFooter('links.apply')}</Link></li>
                                            <li><Link href="/tracking" className="text-sm text-gray-400 hover:text-white transition-colors">{tFooter('links.track')}</Link></li>
                                            <li><Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">{tFooter('links.services')}</Link></li>
                                            <li><Link href="/instructions" className="text-sm text-gray-400 hover:text-white transition-colors">{tFooter('links.instructions')}</Link></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">{tFooter('headings.company')}</h3>
                                        <ul className="mt-4 space-y-3">
                                            <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">{tFooter('links.about')}</Link></li>
                                            <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">{tFooter('links.contact')}</Link></li>
                                            <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">{tFooter('links.faq')}</Link></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">{tFooter('headings.legal')}</h3>
                                        <ul className="mt-4 space-y-3">
                                            <li><Link href="/policies/personal-data" className="text-sm text-gray-400 hover:text-white transition-colors">{tFooter('links.privacy')}</Link></li>
                                            <li><Link href="/policies/services-agreement" className="text-sm text-gray-400 hover:text-white transition-colors">{tFooter('links.terms')}</Link></li>
                                            <li><Link href="/policies/services-agreement#refund-policy" className="text-sm text-gray-400 hover:text-white transition-colors">{tFooter('links.refund')}</Link></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                                    <p className="text-xs text-gray-500">{tFooter('copyright', { year: new Date().getFullYear() })}</p>
                                    <p className="text-xs text-gray-500 mt-2 md:mt-0">{tFooter('brand')}</p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
