'use client';

import { UploadCloud, X, FileText } from 'lucide-react';
import { useState, useRef } from 'react';

import { useTranslations } from 'next-intl';

interface FileUploadProps {
    label: React.ReactNode;
    accept?: string;
    onChange: (file: File | null) => void;
    error?: string;
}

export default function FileUpload({ label, accept = "image/*,.pdf", onChange, error }: FileUploadProps) {
    const t = useTranslations('FileUpload');
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            onChange(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            setFile(selectedFile);
            onChange(selectedFile);
        }
    };

    const removeFile = () => {
        setFile(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>

            {!file ? (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-colors active:bg-gray-100
                ${error
                            ? 'border-red-300 bg-red-50'
                            : isDragging
                                ? 'border-[#0039A6] bg-blue-50'
                                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                        }
            `}
                >
                    <UploadCloud className={`h-8 w-8 mb-2 ${error ? 'text-red-500' : isDragging ? 'text-[#0039A6]' : 'text-gray-400'}`} />
                    <p className="text-sm text-gray-600 font-medium">{isDragging ? t('dragDrop') : t('dragDrop')}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('formats')}</p>
                    <input
                        type="file"
                        ref={inputRef}
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </div>
            ) : (
                <div className="relative border border-gray-200 rounded-lg p-4 flex items-center gap-3 bg-white">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>
    );
}
