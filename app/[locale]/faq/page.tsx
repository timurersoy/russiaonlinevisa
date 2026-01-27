import { setRequestLocale } from 'next-intl/server';
import FAQContent from './Content';

export default async function FAQPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <FAQContent />;
}
