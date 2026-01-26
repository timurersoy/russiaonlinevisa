import { useTranslations } from 'next-intl';

export default function TrackingPage() {
    const t = useTranslations('TrackingPage');
    return (
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="mt-4 text-gray-600">{t('description')}</p>
        </div>
    );
}
