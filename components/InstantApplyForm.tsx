'use strict';
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler, UseFormRegisterReturn } from 'react-hook-form';
import { ChevronRight, ChevronLeft, CheckCircle, Upload, Info, X, CreditCard } from 'lucide-react';
import FileUpload from './ui/FileUpload';
import { useTranslations, useMessages, useLocale } from 'next-intl';
import PersonalDataContent from './policies/PersonalDataContent';
import ServicesAgreementContent from './policies/ServicesAgreementContent';

type FormInputs = {
    // Step 1: Personal & Document Information
    firstName: string;
    lastName: string;
    nationality: string;
    passportNumber: string;
    photo: File | null;
    passportCover: File | null;
    passportExpiryDate: string;

    // Step 2: Contact Details
    phone: string;
    email: string;
    address: string;
    occupancy: string;
    // Conditional: Working
    companyName?: string;
    position?: string;
    // Conditional: Student
    schoolName?: string;

    // Step 3: Visit Information
    travelDate: string;
    visitType: string;
    purpose?: string;
    firstCity: string;
    accommodationType: string;
    // Conditional: Hotel
    hotelName?: string;
    // Conditional: Rental Apartment
    apartmentAddress?: string;
    // Conditional: Individual
    hostName?: string;
    relationship?: string;
    hostAddress?: string;
    hostPhone?: string;

    visitedCountries?: string;

    // Step 4: Personal Details
    gender: string;
    maritalStatus: string;
    // Conditional: Married
    partnerName?: string;
    partnerBirthday?: string;
    partnerBirthPlace?: string;

    // Parents (Optional)
    fatherName?: string;
    fatherBirthday?: string;
    fatherBirthPlace?: string;
    motherName?: string;
    motherBirthday?: string;
    motherBirthPlace?: string;

    // Legal
    privacyPolicy: boolean;
    serviceAgreement: boolean;
};

const countries = [
    "Austria", "Bahrain", "Belgium", "Bhutan", "Bulgaria", "Cambodia", "China", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Eswatini", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "India", "Indonesia",
    "Iran, Islamic Republic of", "Ireland", "Italy", "Japan", "Jordan", "Kenya", "Korea, Democratic People's Republic of",
    "Kuwait", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malaysia", "Malta", "Mexico", "Monaco", "Myanmar",
    "Netherlands", "North Macedonia", "Norway", "Oman", "Papua New Guinea", "Philippines", "Poland", "Portugal", "Romania",
    "Saint Lucia", "San Marino", "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland",
    "Taiwan, China", "Tonga", "Trinidad and Tobago", "Turkey", "Turkmenistan", "Vatican", "Viet Nam", "Zimbabwe"
];

function DateInput({ registration, ...props }: { registration: UseFormRegisterReturn } & React.InputHTMLAttributes<HTMLInputElement>) {
    const { onBlur, ...regRest } = registration;
    return (
        <input
            {...props}
            {...regRest}
            type="text"
            onFocus={(e) => {
                e.target.type = 'date';
                props.onFocus?.(e);
            }}
            onBlur={(e) => {
                if (!e.target.value) e.target.type = 'text';
                onBlur(e);
                props.onBlur?.(e);
            }}
        />
    );
}

export default function InstantApplyForm() {
    const t = useTranslations('ApplyForm');
    const messages = useMessages();
    const locale = useLocale();
    // Safe access to messages for lists (using any to bypass strict type check for now)
    const photoList = (messages.ApplyForm as any)?.modal?.photoList || [];
    const passportList = (messages.ApplyForm as any)?.modal?.passportList || [];

    const steps = [
        { id: 1, name: t('steps.1') },
        { id: 2, name: t('steps.2') },
        { id: 3, name: t('steps.3') },
        { id: 4, name: t('steps.4') },
        { id: 5, name: t('steps.5') },
    ];

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successData, setSuccessData] = useState<{ publicId?: number; id?: number; friendlyId?: string } | null>(null);

    const [showWarning, setShowWarning] = useState(false);
    const [activeHelp, setActiveHelp] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<FormInputs>({
        mode: 'onChange'
    });

    // Register file fields for validation
    useState(() => {
        register('photo', { required: t('errors.uploadPhoto') });
        register('passportCover', { required: t('errors.uploadPassport') });
    });

    const formData = watch();
    const occupancy = watch('occupancy');
    const accommodationType = watch('accommodationType');
    const maritalStatus = watch('maritalStatus');

    const handleFile = (field: keyof FormInputs, file: File | null) => {
        setValue(field, file);
        if (file) clearErrors(field);
        else setError(field, { type: 'required', message: t('errors.docRequired') });
    };

    const nextStep = () => {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setCurrentStep((prev) => prev - 1);
        window.scrollTo(0, 0);
    };

    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsSubmitting(true);
        try {
            // Convert files to Base64
            const photoBase64 = data.photo ? await toBase64(data.photo) : null;
            const passportCoverBase64 = data.passportCover ? await toBase64(data.passportCover) : null;

            // Structure data for API
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                passportNumber: data.passportNumber,
                nationality: data.nationality,
                gender: data.gender,
                phone: data.phone,
                email: data.email,
                address: data.address,
                travelDate: data.travelDate,
                passportExpiryDate: data.passportExpiryDate,
                visitType: data.visitType,
                firstCity: data.firstCity,
                accommodationType: data.accommodationType,
                occupancy: data.occupancy,
                maritalStatus: data.maritalStatus,
                // Conditional fields
                companyName: data.companyName,
                position: data.position,
                schoolName: data.schoolName,
                purpose: data.purpose,
                hotelName: data.hotelName,
                apartmentAddress: data.apartmentAddress,
                hostName: data.hostName,
                relationship: data.relationship,
                hostAddress: data.hostAddress,
                hostPhone: data.hostPhone,
                visitedCountries: data.visitedCountries,
                partnerName: data.partnerName,
                partnerBirthday: data.partnerBirthday,
                partnerBirthPlace: data.partnerBirthPlace,
                fatherName: data.fatherName,
                fatherBirthday: data.fatherBirthday,
                fatherBirthPlace: data.fatherBirthPlace,
                motherName: data.motherName,
                motherBirthday: data.motherBirthday,
                motherBirthPlace: data.motherBirthPlace,
                privacyPolicy: data.privacyPolicy,
                serviceAgreement: data.serviceAgreement,
                images: {
                    photo: photoBase64,
                    passport: passportCoverBase64
                },
                locale: locale
            };

            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Submission failed');

            const result = await response.json();
            setSuccessData(result);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            // Handle error (maybe show a toast)
        } finally {
            setIsSubmitting(false);
        }
    };

    const onError = (errors: any) => {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 4000);

        // Determine the earliest step with an error
        const step1Fields = ['firstName', 'lastName', 'passportNumber', 'nationality', 'photo', 'passportCover', 'passportExpiryDate'];
        const step2Fields = ['phone', 'email', 'address', 'occupancy', 'companyName', 'position', 'schoolName'];
        const step3Fields = ['travelDate', 'visitType', 'firstCity', 'accommodationType', 'hotelName', 'apartmentAddress', 'hostName', 'relationship', 'hostAddress', 'hostPhone'];
        const step4Fields = ['gender', 'maritalStatus', 'partnerName', 'partnerBirthday', 'partnerBirthPlace'];

        const hasError = (fields: string[]) => fields.some(field => errors[field]);

        if (hasError(step1Fields)) setCurrentStep(1);
        else if (hasError(step2Fields)) setCurrentStep(2);
        else if (hasError(step3Fields)) setCurrentStep(3);
        else if (hasError(step4Fields)) setCurrentStep(4);

        window.scrollTo(0, 0);
    };

    if (isSuccess) {
        return (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center max-w-2xl mx-auto animate-in zoom-in duration-300">
                <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('success.title')}</h2>
                <p className="text-gray-600 mb-8 text-lg">
                    {t('success.desc')} <strong>{t('success.days')}</strong>.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg inline-block mb-8">
                    <span className="text-gray-500 text-sm block mb-1">{t('success.appId')}</span>
                    <span className="font-mono font-bold text-xl tracking-wider">{successData?.publicId || successData?.id || 'PENDING'}</span>
                </div>
                <div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="inline-flex items-center justify-center rounded-md bg-[#0039A6] px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#002D80] transition-all"
                    >
                        {t('buttons.returnHome')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto relative">
            {/* Warning Notification */}
            {showWarning && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-800 px-6 py-4 rounded-lg shadow-lg border border-red-200 z-50 animate-in slide-in-from-top-4 fade-in duration-300 flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                        <Upload className="h-5 w-5 text-red-600 rotate-180" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">{t('warning.title')}</h4>
                        <p className="text-sm">{t('warning.desc')}</p>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="mb-12">
                <div className="relative flex justify-between">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-[#0039A6] -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((step) => (
                        <div
                            key={step.id}
                            onClick={() => setCurrentStep(step.id)}
                            className="flex flex-col items-center gap-2 px-1 cursor-pointer group"
                        >
                            <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all duration-300 z-10 bg-white
                  ${currentStep >= step.id
                                        ? 'border-[#0039A6] text-[#0039A6] shadow-sm'
                                        : 'border-gray-200 text-gray-400 group-hover:border-[#0039A6] group-hover:text-[#0039A6]'
                                    } ${currentStep === step.id ? 'bg-[#0039A6] text-white border-[#0039A6] scale-110' : ''}`}
                            >
                                {step.id}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-medium text-center max-w-[60px] leading-tight ${currentStep >= step.id ? 'text-[#0039A6]' : 'text-gray-400 group-hover:text-[#0039A6]'} ${currentStep === step.id ? 'font-bold' : ''}`}>
                                {step.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 sm:p-10">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#0039A6]">
                            {currentStep === 1 && <Upload className="h-6 w-6" />}
                            {currentStep > 1 && <span className="text-lg font-bold">{currentStep}</span>}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{steps[currentStep - 1].name}</h2>
                            <p className="text-sm text-gray-500">Step {currentStep} of {steps.length}</p>
                        </div>
                    </div>

                    {/* Help Modal */}
                    {activeHelp && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setActiveHelp(null)}>
                            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 overflow-hidden relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                <button onClick={() => setActiveHelp(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6" />
                                </button>

                                {activeHelp === 'photo' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                                            {/* Using the copied example photo */}
                                            <img src="/example-photo.jpg" alt="Example Personal Photo" className="max-h-[60vh] object-contain rounded shadow-sm" />
                                        </div>
                                        <div className="overflow-y-auto max-h-[60vh]">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('modal.photoTitle')}</h3>
                                            <ul className="space-y-3 text-sm text-gray-600 list-disc pl-4">
                                                {Array.isArray(photoList) && photoList.map((item: any, i: number) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : activeHelp === 'privacy' ? (
                                    <div className="overflow-y-auto max-h-[80vh]">
                                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <Info className="h-6 w-6 text-[#0039A6]" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">Privacy Policy</h3>
                                        </div>
                                        <PersonalDataContent />
                                    </div>
                                ) : activeHelp === 'service' ? (
                                    <div className="overflow-y-auto max-h-[80vh]">
                                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                            <div className="p-2 bg-red-50 rounded-lg">
                                                <Info className="h-6 w-6 text-[#D52B1E]" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">Service Agreement</h3>
                                        </div>
                                        <ServicesAgreementContent />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                                            {/* Using the copied example passport */}
                                            <img src="/example-passport.jpg" alt="Example Passport" className="max-h-[60vh] object-contain rounded shadow-sm" />
                                        </div>
                                        <div className="overflow-y-auto max-h-[60vh]">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('modal.passportTitle')}</h3>
                                            <ul className="space-y-3 text-sm text-gray-600 list-disc pl-4">
                                                {Array.isArray(passportList) && passportList.map((item: any, i: number) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">

                        {/* STEP 1: PERSONAL & DOCUMENT INFORMATION */}
                        {currentStep === 1 && (
                            <div className="animate-in slide-in-from-right duration-500 space-y-8">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">{t('labels.firstName')} <span className="text-red-500">*</span></label>
                                        <input
                                            {...register('firstName', { required: t('errors.required') })}
                                            className="w-full rounded-md border border-gray-300 px-4 py-3"
                                            placeholder={t('placeholders.firstName')}
                                        />
                                        {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">{t('labels.lastName')} <span className="text-red-500">*</span></label>
                                        <input
                                            {...register('lastName', { required: t('errors.required') })}
                                            className="w-full rounded-md border border-gray-300 px-4 py-3"
                                            placeholder={t('placeholders.lastName')}
                                        />
                                        {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
                                    </div>
                                </div>

                                {/* Passport Number */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.passportNumber')} <span className="text-red-500">*</span></label>
                                    <input
                                        {...register('passportNumber', { required: t('errors.required') })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3"
                                        placeholder={t('placeholders.passportNumber')}
                                    />
                                    {errors.passportNumber && <span className="text-red-500 text-xs">{errors.passportNumber.message}</span>}
                                </div>

                                {/* Nationality */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.nationality')} <span className="text-red-500">*</span></label>
                                    <select
                                        {...register('nationality', { required: t('errors.required') })}
                                        suppressHydrationWarning
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 bg-white"
                                    >
                                        <option value="">{t('options.selectCountry')}</option>
                                        {countries.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    {errors.nationality && <span className="text-red-500 text-xs">{errors.nationality.message}</span>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-semibold text-gray-700">{t('labels.passportExpiry')} <span className="text-red-500">*</span></label>
                                        <div className="group relative">
                                            <Info className="h-4 w-4 text-gray-400 cursor-help" />
                                            <div className="absolute left-1/2 bottom-full mb-2 w-64 -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                                                {t('help.passportExpiryInfo')}
                                                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex gap-3 text-sm text-yellow-800 mb-2">
                                        <Info className="h-5 w-5 shrink-0 text-yellow-600" />
                                        <p>{t('warning.passportValidity')}</p>
                                    </div>

                                    <DateInput
                                        registration={register('passportExpiryDate', {
                                            required: t('errors.required'),
                                            validate: (value) => {
                                                if (!value) return true;
                                                const selectedDate = new Date(value);
                                                const minDate = new Date();
                                                minDate.setDate(minDate.getDate() + 180); // Today + 180 days

                                                if (selectedDate < minDate) {
                                                    return t('errors.passportExpiryInvalid');
                                                }
                                                return true;
                                            }
                                        })}
                                        min={(() => {
                                            const d = new Date();
                                            d.setDate(d.getDate() + 180);
                                            return d.toISOString().split('T')[0];
                                        })()}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3"
                                        placeholder={t('placeholders.entryDate')}
                                    />
                                    {errors.passportExpiryDate && <span className="text-red-500 text-xs">{errors.passportExpiryDate.message}</span>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <FileUpload
                                            label={
                                                <div className="flex items-center gap-2">
                                                    {t('labels.personalPhoto')} <span className="text-red-500">*</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveHelp('photo')}
                                                        className="text-gray-400 hover:text-blue-600 focus:outline-none"
                                                        title={t('help.viewPhotoReq')}
                                                    >
                                                        <Info className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            }
                                            accept="image/*,.pdf"
                                            onChange={(file) => handleFile('photo', file)}
                                            error={errors.photo?.message}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            {t('help.photo')}
                                        </p>
                                    </div>
                                    <div>
                                        <FileUpload
                                            label={
                                                <div className="flex items-center gap-2">
                                                    {t('labels.passportCover')} <span className="text-red-500">*</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveHelp('passport')}
                                                        className="text-gray-400 hover:text-blue-600 focus:outline-none"
                                                        title={t('help.viewPassportReq')}
                                                    >
                                                        <Info className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            }
                                            accept="image/*,.pdf"
                                            onChange={(file) => handleFile('passportCover', file)}
                                            error={errors.passportCover?.message}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            {t('help.passport')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: CONTACT DETAILS */}
                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right duration-500">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.phone')} <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        {...register('phone', { required: t('errors.required') })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3"
                                        placeholder={t('placeholders.phone')}
                                    />
                                    {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.email')} <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        {...register('email', { required: t('errors.required') })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3"
                                        placeholder={t('placeholders.email')}
                                    />
                                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.address')} <span className="text-red-500">*</span></label>
                                    <input
                                        {...register('address', { required: t('errors.required') })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3"
                                        placeholder={t('placeholders.address')}
                                    />
                                    {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.occupancy')} <span className="text-red-500">*</span></label>
                                    <select
                                        {...register('occupancy', { required: t('errors.required') })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 bg-white"
                                    >
                                        <option value="">{t('options.selectOccupancy')}</option>
                                        <option value="working">{t('options.working')}</option>
                                        <option value="student">{t('options.student')}</option>
                                        <option value="unemployed">{t('options.unemployed')}</option>
                                    </select>
                                    {errors.occupancy && <span className="text-red-500 text-xs">{errors.occupancy.message}</span>}
                                </div>

                                {occupancy === 'working' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">{t('labels.companyName')} <span className="text-red-500">*</span></label>
                                            <input
                                                {...register('companyName', { required: t('errors.required') })}
                                                className="w-full rounded-md border border-gray-300 px-4 py-3"
                                                placeholder={t('placeholders.company')}
                                            />
                                            {errors.companyName && <span className="text-red-500 text-xs">{errors.companyName.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">{t('labels.position')} <span className="text-red-500">*</span></label>
                                            <input
                                                {...register('position', { required: t('errors.required') })}
                                                className="w-full rounded-md border border-gray-300 px-4 py-3"
                                                placeholder={t('placeholders.position')}
                                            />
                                            {errors.position && <span className="text-red-500 text-xs">{errors.position.message}</span>}
                                        </div>
                                    </>
                                )}

                                {occupancy === 'student' && (
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">{t('labels.schoolName')} <span className="text-red-500">*</span></label>
                                        <input
                                            {...register('schoolName', { required: t('errors.required') })}
                                            className="w-full rounded-md border border-gray-300 px-4 py-3"
                                            placeholder={t('placeholders.school')}
                                        />
                                        {errors.schoolName && <span className="text-red-500 text-xs">{errors.schoolName.message}</span>}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: VISIT INFORMATION */}
                        {currentStep === 3 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right duration-500">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.travelDate')} <span className="text-red-500">*</span></label>
                                    <DateInput
                                        registration={register('travelDate', { required: t('errors.required') })}
                                        min={(() => {
                                            const d = new Date();
                                            d.setDate(d.getDate() + 5);
                                            return d.toISOString().split('T')[0];
                                        })()}
                                        max={(() => {
                                            const d = new Date();
                                            d.setDate(d.getDate() + 89);
                                            return d.toISOString().split('T')[0];
                                        })()}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3"
                                        placeholder={t('placeholders.entryDate')}
                                    />
                                    {errors.travelDate && <span className="text-red-500 text-xs">{errors.travelDate.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.visitType')} <span className="text-red-500">*</span></label>
                                    <select
                                        {...register('visitType', { required: t('errors.required') })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 bg-white"
                                    >
                                        <option value="">{t('options.selectType')}</option>
                                        <option value="guestVisit">{t('options.guestVisit')}</option>
                                        <option value="tourism">{t('options.tourism')}</option>
                                        <option value="businessTrip">{t('options.businessTrip')}</option>
                                        <option value="eventParticipation">{t('options.eventParticipation')}</option>
                                    </select>
                                    {errors.visitType && <span className="text-red-500 text-xs">{errors.visitType.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.purpose')} <span className="text-gray-400 font-normal">{t('labels.optional')}</span></label>
                                    <input
                                        {...register('purpose', { required: false })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3"
                                        placeholder={t('placeholders.optional')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.firstCity')} <span className="text-red-500">*</span></label>
                                    <input
                                        {...register('firstCity', { required: t('errors.required') })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3"
                                    />
                                    {errors.firstCity && <span className="text-red-500 text-xs">{errors.firstCity.message}</span>}
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.accommodationType')} <span className="text-red-500">*</span></label>
                                    <select
                                        {...register('accommodationType', { required: t('errors.required') })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 bg-white"
                                    >
                                        <option value="">{t('options.selectAccommodation')}</option>
                                        <option value="hotel">{t('options.hotel')}</option>
                                        <option value="rentalApartment">{t('options.rentalApartment')}</option>
                                        <option value="individual">{t('options.individual')}</option>
                                    </select>
                                    {errors.accommodationType && <span className="text-red-500 text-xs">{errors.accommodationType.message}</span>}
                                </div>

                                {accommodationType === 'hotel' && (
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">{t('labels.hotelName')} <span className="text-red-500">*</span></label>
                                        <input
                                            {...register('hotelName', { required: t('errors.required') })}
                                            className="w-full rounded-md border border-gray-300 px-4 py-3"
                                            placeholder={t('placeholders.hotel')}
                                        />
                                        {errors.hotelName && <span className="text-red-500 text-xs">{errors.hotelName.message}</span>}
                                    </div>
                                )}

                                {accommodationType === 'rentalApartment' && (
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">{t('labels.apartmentAddress')} <span className="text-red-500">*</span></label>
                                        <input
                                            {...register('apartmentAddress', { required: t('errors.required') })}
                                            className="w-full rounded-md border border-gray-300 px-4 py-3"
                                            placeholder={t('placeholders.address')}
                                        />
                                        {errors.apartmentAddress && <span className="text-red-500 text-xs">{errors.apartmentAddress.message}</span>}
                                    </div>
                                )}

                                {accommodationType === 'individual' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">{t('labels.hostName')} <span className="text-red-500">*</span></label>
                                            <input
                                                {...register('hostName', { required: t('errors.required') })}
                                                className="w-full rounded-md border border-gray-300 px-4 py-3"
                                                placeholder={t('placeholders.host')}
                                            />
                                            {errors.hostName && <span className="text-red-500 text-xs">{errors.hostName.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">{t('labels.relationship')} <span className="text-red-500">*</span></label>
                                            <input
                                                {...register('relationship', { required: t('errors.required') })}
                                                className="w-full rounded-md border border-gray-300 px-4 py-3"
                                                placeholder={t('placeholders.relationship')}
                                            />
                                            {errors.relationship && <span className="text-red-500 text-xs">{errors.relationship.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">{t('labels.hostAddress')} <span className="text-red-500">*</span></label>
                                            <input
                                                {...register('hostAddress', { required: t('errors.required') })}
                                                className="w-full rounded-md border border-gray-300 px-4 py-3"
                                                placeholder={t('placeholders.hostAddress')}
                                            />
                                            {errors.hostAddress && <span className="text-red-500 text-xs">{errors.hostAddress.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">{t('labels.hostPhone')} <span className="text-red-500">*</span></label>
                                            <input
                                                {...register('hostPhone', { required: t('errors.required') })}
                                                className="w-full rounded-md border border-gray-300 px-4 py-3"
                                                placeholder={t('placeholders.hostPhone')}
                                            />
                                            {errors.hostPhone && <span className="text-red-500 text-xs">{errors.hostPhone.message}</span>}
                                        </div>
                                    </>
                                )}

                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('labels.visitedCountries')} <span className="text-gray-400 font-normal">{t('labels.optional')}</span></label>
                                    <input
                                        {...register('visitedCountries', { required: false })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3"
                                        placeholder={t('placeholders.countries')}
                                    />
                                    {errors.visitedCountries && <span className="text-red-500 text-xs">{errors.visitedCountries.message}</span>}
                                </div>
                            </div>
                        )}

                        {/* STEP 4: PERSONAL DETAILS */}
                        {currentStep === 4 && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">{t('labels.gender')} <span className="text-red-500">*</span></label>
                                        <select
                                            {...register('gender', { required: t('errors.required') })}
                                            className="w-full rounded-md border border-gray-300 px-4 py-3 bg-white"
                                        >
                                            <option value="">{t('options.selectGender')}</option>
                                            <option value="male">{t('options.male')}</option>
                                            <option value="female">{t('options.female')}</option>
                                        </select>
                                        {errors.gender && <span className="text-red-500 text-xs">{errors.gender.message}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">{t('labels.maritalStatus')} <span className="text-red-500">*</span></label>
                                        <select
                                            {...register('maritalStatus', { required: t('errors.required') })}
                                            className="w-full rounded-md border border-gray-300 px-4 py-3 bg-white"
                                        >
                                            <option value="">{t('options.selectStatus')}</option>
                                            <option value="single">{t('options.single')}</option>
                                            <option value="married">{t('options.married')}</option>
                                        </select>
                                        {errors.maritalStatus && <span className="text-red-500 text-xs">{errors.maritalStatus.message}</span>}
                                    </div>

                                    {maritalStatus === 'married' && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-md">
                                            <div className="col-span-1 md:col-span-3 font-semibold text-blue-900 mb-2">{t('labels.partnerDetails')}</div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-700">{t('labels.partnerName')} <span className="text-red-500">*</span></label>
                                                <input {...register('partnerName', { required: t('errors.required') })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                                                {errors.partnerName && <span className="text-red-500 text-xs">{errors.partnerName.message}</span>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-700">{t('labels.partnerBirthday')} <span className="text-red-500">*</span></label>
                                                <DateInput registration={register('partnerBirthday', { required: t('errors.required') })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder={t('placeholders.entryDate')} />
                                                {errors.partnerBirthday && <span className="text-red-500 text-xs">{errors.partnerBirthday.message}</span>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-700">{t('labels.partnerBirthPlace')} <span className="text-red-500">*</span></label>
                                                <input {...register('partnerBirthPlace', { required: t('errors.required') })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                                                {errors.partnerBirthPlace && <span className="text-red-500 text-xs">{errors.partnerBirthPlace.message}</span>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Father's Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                                        <div className="col-span-1 md:col-span-3 font-semibold text-gray-900">{t('labels.father')} <span className="text-gray-400 font-normal text-sm ml-2">{t('labels.optional')}</span></div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-700">{t('labels.nameSurname')}</label>
                                            <input {...register('fatherName', { required: false })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-700">{t('labels.birthday')}</label>
                                            <DateInput registration={register('fatherBirthday', { required: false })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder={t('placeholders.entryDate')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-700">{t('labels.birthPlace')}</label>
                                            <input {...register('fatherBirthPlace', { required: false })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                                        </div>
                                    </div>

                                    {/* Mother's Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                                        <div className="col-span-1 md:col-span-3 font-semibold text-gray-900">{t('labels.mother')} <span className="text-gray-400 font-normal text-sm ml-2">{t('labels.optional')}</span></div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-700">{t('labels.nameSurname')}</label>
                                            <input {...register('motherName', { required: false })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-700">{t('labels.birthday')}</label>
                                            <DateInput registration={register('motherBirthday', { required: false })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder={t('placeholders.entryDate')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-700">{t('labels.birthPlace')}</label>
                                            <input {...register('motherBirthPlace', { required: false })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: REVIEW */}
                        {currentStep === 5 && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                                        <p className="text-sm text-blue-800">
                                            {t('review.title')}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* LEFT COLUMN: APPLICATION DATA */}
                                        <div className="lg:col-span-2 space-y-6">

                                            {/* Personal Details Section */}
                                            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                                <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 font-bold text-gray-700">
                                                    {t('review.personalDetails')}
                                                </div>
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                                    <div>
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.nationality')}</span>
                                                        <span className="font-medium text-gray-900">{formData.nationality}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.gender')}</span>
                                                        <span className="font-medium text-gray-900 capitalize">{formData.gender}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.maritalStatus')}</span>
                                                        <span className="font-medium text-gray-900 capitalize">{formData.maritalStatus}</span>
                                                    </div>
                                                    {/* Parents & Partner (if applicable) */}
                                                    {formData.partnerName && (
                                                        <div className="col-span-1 md:col-span-2 mt-2 pt-2 border-t border-gray-200/50">
                                                            <span className="block text-xs text-gray-500 uppercase font-semibold">{t('review.partner')}</span>
                                                            <span className="font-medium text-gray-900">{formData.partnerName} ({t('review.born')} {formData.partnerBirthday}, {formData.partnerBirthPlace})</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Passport & Travel Section */}
                                            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                                <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 font-bold text-gray-700">
                                                    {t('review.passportTravel')}
                                                </div>
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                                    <div>
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.passportExpiry')}</span>
                                                        <span className="font-medium text-gray-900">{formData.passportExpiryDate}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.travelDate')}</span>
                                                        <span className="font-medium text-gray-900">{formData.travelDate}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.firstCity')}</span>
                                                        <span className="font-medium text-gray-900">{formData.firstCity}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.visitType')}</span>
                                                        <span className="font-medium text-gray-900 capitalize">{formData.visitType?.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    </div>
                                                    {/* Accommodation */}
                                                    <div className="col-span-1 md:col-span-2 mt-2 pt-2 border-t border-gray-200/50">
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.accommodationType')} ({formData.accommodationType})</span>
                                                        <span className="font-medium text-gray-900">
                                                            {formData.accommodationType === 'hotel' && formData.hotelName}
                                                            {formData.accommodationType === 'rentalApartment' && formData.apartmentAddress}
                                                            {formData.accommodationType === 'individual' && `${formData.hostName} (${formData.hostAddress})`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contact Section */}
                                            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                                <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 font-bold text-gray-700">
                                                    {t('review.contactInfo')}
                                                </div>
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                                    <div>
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.email')}</span>
                                                        <span className="font-medium text-gray-900">{formData.email}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.phone')}</span>
                                                        <span className="font-medium text-gray-900">{formData.phone}</span>
                                                    </div>
                                                    <div className="col-span-1 md:col-span-2">
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('labels.address')}</span>
                                                        <span className="font-medium text-gray-900">{formData.address}</span>
                                                    </div>
                                                    <div className="col-span-1 md:col-span-2 mt-2 pt-2 border-t border-gray-200/50">
                                                        <span className="block text-xs text-gray-500 uppercase font-semibold">{t('review.employment')} ({formData.occupancy})</span>
                                                        <span className="font-medium text-gray-900">
                                                            {formData.occupancy === 'working' && `${formData.position} at ${formData.companyName}`}
                                                            {formData.occupancy === 'student' && `${t('review.studentAt')} ${formData.schoolName}`}
                                                            {formData.occupancy === 'unemployed' && t('review.unemployed')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Documents */}
                                            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                                <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 font-bold text-gray-700">
                                                    {t('review.uploadedDocs')}
                                                </div>
                                                <div className="p-6 flex flex-col sm:flex-row gap-4 text-sm">
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${formData.photo ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                                                        {formData.photo ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                                        {t('labels.personalPhoto')}: {formData.photo ? t('review.uploaded') : t('review.missing')}
                                                    </div>
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${formData.passportCover ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                                                        {formData.passportCover ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                                        {t('labels.passportCover')}: {formData.passportCover ? t('review.uploaded') : t('review.missing')}
                                                    </div>
                                                </div>
                                                {(!formData.photo || !formData.passportCover) && (
                                                    <div className="px-6 pb-6 text-red-600 text-xs">
                                                        {t('review.uploadWarning')}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Legal Consent */}
                                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                                <h4 className="font-bold text-gray-900 border-b pb-2">{t('review.legalConsent')}</h4>
                                                <div className="space-y-3">
                                                    <label className="flex items-start gap-3 cursor-pointer group">
                                                        <input
                                                            type="checkbox"
                                                            {...register('privacyPolicy', { required: t('errors.required') })}
                                                            className="mt-1 h-4 w-4 text-[#0039A6] rounded border-gray-300 focus:ring-[#0039A6]"
                                                        />
                                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                                            {t('review.privacyAgree')} <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveHelp('privacy'); }} className="text-blue-600 hover:underline text-left">Privacy Policy</button>.
                                                        </span>
                                                    </label>
                                                    {errors.privacyPolicy && <p className="text-red-500 text-xs pl-7">{errors.privacyPolicy.message}</p>}

                                                    <label className="flex items-start gap-3 cursor-pointer group">
                                                        <input
                                                            type="checkbox"
                                                            {...register('serviceAgreement', { required: t('errors.required') })}
                                                            className="mt-1 h-4 w-4 text-[#0039A6] rounded border-gray-300 focus:ring-[#0039A6]"
                                                        />
                                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                                            {t('review.serviceAgree')} <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveHelp('service'); }} className="text-blue-600 hover:underline text-left">Service Agreement</button> {t('review.terms')}
                                                        </span>
                                                    </label>
                                                    {errors.serviceAgreement && <p className="text-red-500 text-xs pl-7">{errors.serviceAgreement.message}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT COLUMN: FEE SUMMARY */}
                                        <div className="lg:col-span-1">
                                            <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                                <div className="p-6 space-y-6">
                                                    <h3 className="text-lg font-bold text-gray-900">{t('review.feeSummary')}</h3>

                                                    <div className="space-y-3 text-sm text-gray-600">
                                                        <div className="flex justify-between items-baseline py-2">
                                                            <span className="text-lg font-bold text-gray-900">{t('review.totalFee')}</span>
                                                            <span className="text-2xl font-bold text-[#0039A6]">$110</span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-blue-50 rounded-lg p-4 space-y-1">
                                                        <span className="block text-xs font-semibold text-blue-800 uppercase tracking-wide">{t('review.processingTime')}</span>
                                                        <span className="block text-lg font-bold text-[#0039A6]">{t('review.days')}</span>
                                                    </div>

                                                    <div className="bg-green-50 rounded-lg p-4 space-y-2 text-xs text-green-800">
                                                        <div className="flex items-center gap-2">
                                                            <CreditCard className="h-4 w-4" />
                                                            <span className="font-medium">{t('review.securePayment')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="h-4 w-4" />
                                                            <span className="font-medium">{t('review.support')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BUTTONS */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold
                  ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <ChevronLeft className="h-4 w-4" /> {t('buttons.back')}
                            </button>

                            {currentStep < 5 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 bg-[#0039A6] text-white px-8 py-2.5 rounded-md text-sm font-semibold hover:bg-[#002D80]"
                                >
                                    {t('buttons.next')} <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 bg-[#D52B1E] text-white px-8 py-2.5 rounded-md text-sm font-semibold hover:bg-[#B01F15]"
                                >
                                    {isSubmitting ? t('buttons.processing') : t('buttons.submit')}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
