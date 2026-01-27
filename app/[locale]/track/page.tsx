import { setRequestLocale } from 'next-intl/server';
import TrackContent from './Content';

export default async function TrackPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <TrackContent />;
}
