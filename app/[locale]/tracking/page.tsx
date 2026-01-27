import { useTranslations } from 'next-intl';

import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function TrackingPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('TrackingPage');
    return (
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="mt-4 text-gray-600">{t('description')}</p>
        </div>
    );
}
