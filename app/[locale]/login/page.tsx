import { setRequestLocale } from 'next-intl/server';
import LoginContent from './Content';

export default async function AdminLoginPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <LoginContent />;
}
