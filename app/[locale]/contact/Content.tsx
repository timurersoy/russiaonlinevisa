'use client';

import { useState } from 'react';
import { Mail, Phone, Send, CheckCircle, HelpCircle } from 'lucide-react';
import { Link } from '@/app/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function ContactContent() {
    const t = useTranslations('ContactPage');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        
        // DÜZELTME BURADA YAPILDI:
        // FormData'yı düz bir nesneye (object) çeviriyoruz ki sunucu okuyabilsin.
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                body: JSON.stringify(data), // Artık 'formData' değil, düzeltilmiş 'data' gidiyor
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setIsSent(true);
                form.reset();
            } else {
                const responseData = await response.json();
                if (responseData.errors && Array.isArray(responseData.errors)) {
                    alert(responseData["errors"].map((error: any) => error["message"]).join(", "));
                } else {
                    alert(t('form.error'));
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                alert('Message could not be sent. Please disable any ad-blockers (like uBlock Origin)