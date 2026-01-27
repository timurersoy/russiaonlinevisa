import InstantApplyForm from '@/components/InstantApplyForm';
import { useTranslations } from 'next-intl';

import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function InstantApplyPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('ApplyInstantPage');
    return (
        <div className="bg-gray-50 min-h-screen py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {t('title')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        {t('description')}
                    </p>
                </div>

                <InstantApplyForm />
            </div>
        </div>
    );
}
