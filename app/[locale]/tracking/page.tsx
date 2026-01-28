import { setRequestLocale } from 'next-intl/server';
import TrackingForm from '@/components/TrackingForm';

export default async function TrackingPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <TrackingForm />;
}
