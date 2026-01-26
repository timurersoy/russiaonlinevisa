"use client";

import { useState } from 'react';
import { ContactRequest } from '@prisma/client';
import { MessageSquare, X, Calendar, User, Mail, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminMessagesTableProps {
    messages: ContactRequest[];
}

export default function AdminMessagesTable({ messages: initialMessages }: AdminMessagesTableProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [selectedMessage, setSelectedMessage] = useState<ContactRequest | null>(null);
    const router = useRouter();

    const handleMessageClick = async (msg: ContactRequest) => {
        setSelectedMessage(msg);

        // If unread, mark as read
        if (!msg.read) {
            // Optimistic Update
            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));

            try {
                await fetch(`/api/contact/${msg.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ read: true })
                });
                router.refresh(); // Refresh server data in background
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" /> Contact Messages
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {messages.map((msg) => (
                            <tr
                                key={msg.id}
                                onClick={() => handleMessageClick(msg)}
                                className={`hover:bg-blue-50 cursor-pointer transition-colors ${!msg.read ? 'bg-blue-50/30' : ''}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                    REQ-{msg.publicId ?? '???'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm text-gray-900 ${!msg.read ? 'font-bold' : 'font-medium'}`}>
                                        {msg.name}
                                        {!msg.read && <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full" />}
                                    </div>
                                    <div className={`text-sm ${!msg.read ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>{msg.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`text-sm text-gray-900 ${!msg.read ? 'font-bold' : 'font-medium'}`}>{msg.subject}</div>
                                    <div className={`text-sm line-clamp-1 ${!msg.read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{msg.message}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {/* Hydration safe date format */}
                                    {new Date(msg.createdAt).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                            </tr>
                        ))}
                        {messages.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                    No messages yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                                Message #REQ-{selectedMessage.publicId ?? '???'}
                            </h3>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">

                            {/* Meta Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">From</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedMessage.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-sm font-semibold text-blue-600 hover:underline">
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {new Date(selectedMessage.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Subject</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedMessage.subject}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message Body */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Message Content</label>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                                    {selectedMessage.message}
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                            <a
                                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Reply via Email
                            </a>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
