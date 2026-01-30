'use client';

import React, { useState, useMemo } from 'react';
import { Linkedin, Facebook, Instagram, Youtube, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight, User, Briefcase, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import NewsletterFooter from '@/components/NewsletterFooter';
import { supabase } from '@/lib/supabaseClient';

const SERVICES = [
    { id: 'strategic_election_campaign', label: 'Strategic & Election Campaign Branding & Promotion Consultancy' },
    { id: 'trademark_intellectual_property_advisory', label: 'Trademark & Intellectual Property (IPR) Advisory' },
    { id: 'energy_environment_sustainability_advisory', label: 'Energy, Environment & Sustainability Advisory' },
    { id: 'hospital_healthcare_ambulance_services_advisory', label: 'Hospital, Healthcare & Ambulance Services Advisory' }
];

const CONSULTANTS = [
    { id: 'sanjay_singh', label: 'Mr. Sanjay Singh', role: 'Senior Strategy Consultant' }
];

const TIME_SLOTS = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '04:00 PM',
    '05:30 PM'
];

export default function ConsultationPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string>('');
    const [selectedConsultant, setSelectedConsultant] = useState<string>('');

    // New State for Multi-step Flow
    const [step, setStep] = useState<'calendar' | 'details' | 'confirmed'>('calendar');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Form Data State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        methodOfContact: 'email' // Default
    });

    // Calendar helper functions
    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null); // Reset selection on month change
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const handleDateClick = (day: number) => {
        // Prevent selecting past dates if current month is current month
        const today = new Date();
        const selectionDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

        // Simple check: disable previous days
        if (selectionDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) return;

        setSelectedDate(day);
        setSelectedTime(null); // Reset time when date changes
    };

    const handleContinue = () => {
        if (selectedDate && selectedTime && selectedService && selectedConsultant) {
            setStep('details');
            setSubmitError(null);
        }
    };

    const handleBack = () => {
        setStep('calendar');
        setSubmitError(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
            setSubmitError('Please fill in all required fields.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Construct the scheduled date string
            const scheduledDateStr = `${selectedDate} ${monthName} ${year}`;

            const { error } = await supabase
                .from('Consultations')
                .insert([{
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    method_of_contact: formData.methodOfContact,
                    service_id: selectedService,
                    consultant_id: selectedConsultant,
                    scheduled_date: scheduledDateStr,
                    scheduled_time: selectedTime,
                    status: 'pending'
                }]);

            if (error) throw error;

            setStep('confirmed');
        } catch (err: any) {
            console.error('Error submitting consultation:', err);
            setSubmitError(err.message || 'Failed to submit booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setStep('calendar');
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedService('');
        setSelectedConsultant('');
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            methodOfContact: 'email'
        });
    };

    // Derived values for calendar render
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    // Adjust startDay for Monday start if desired, keeping standard Sunday=0 for now
    const startDayIndex = startDay === 0 ? 6 : startDay - 1;

    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
    const blanksArray = Array.from({ length: startDayIndex }, (_, i) => i);

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const isPast = (day: number) => {
        const today = new Date();
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return checkDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* Left Column - Contact Info */}
                    <div className="fade-in">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-900 via-orange-700 to-yellow-600">
                            Schedule Consultation
                        </h1>
                        <div className="w-24 h-1.5 mb-8 md:mb-10" style={{ background: 'var(--accent-gold)' }}></div>

                        <p className="text-lg md:text-xl mb-10 leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                            Thank you for your interest in Lasa Consultants & Organizations. We're looking forward to
                            learning more about you and your organization.
                        </p>

                        <div className="space-y-8 md:space-y-10">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70" style={{ color: 'var(--text-secondary)' }}>Email</h3>
                                <a href="mailto:lasainfra@hotmail.com" className="text-xl md:text-2xl font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--primary-brand)' }}>
                                    lasainfra@hotmail.com
                                </a>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70" style={{ color: 'var(--text-secondary)' }}>Phone</h3>
                                <a href="tel:+919694919394" className="text-xl md:text-2xl font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--primary-brand)' }}>
                                    +91-9694919394
                                </a>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Head Office</h3>
                                    <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        Lasa Consultants & Organizations<br />
                                        Jaipur, Rajasthan – 302026
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Mailing Address</h3>
                                    <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        Lasa Consultants & Organizations<br />
                                        Jaipur, Rajasthan – 302026
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Scheduling Card */}
                    <div className="slide-up relative perspective-1000">
                        <div className={`rounded-3xl shadow-2xl overflow-hidden border p-1 transition-all duration-500 transform ${step === 'details' ? 'rotate-y-0' : ''}`} style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                            <div className="rounded-2xl p-6 md:p-8 relative min-h-[600px]" style={{ background: 'var(--background)' }}>

                                {step === 'confirmed' && (
                                    <div className="text-center py-12 fade-in">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="text-green-600" size={40} />
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Booking Confirmed!</h2>
                                        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                                            Your session with {CONSULTANTS.find(c => c.id === selectedConsultant)?.label} has been scheduled.
                                        </p>
                                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl text-left max-w-sm mx-auto border border-gray-100 dark:border-white/10">
                                            <p className="mb-2"><strong className="mr-2">Date:</strong> {selectedDate} {monthName} {year}</p>
                                            <p className="mb-2"><strong className="mr-2">Time:</strong> {selectedTime}</p>
                                            <p><strong className="mr-2">Service:</strong> {SERVICES.find(s => s.id === selectedService)?.label}</p>
                                        </div>
                                        <button
                                            onClick={handleReset}
                                            className="mt-8 text-sm font-semibold hover:underline"
                                            style={{ color: 'var(--primary-brand)' }}
                                        >
                                            Book Another Session
                                        </button>
                                    </div>
                                )}

                                {step === 'calendar' && (
                                    <div className="fade-in">
                                        <div className="text-center mb-8">
                                            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
                                                <Calendar className="text-orange-600 dark:text-orange-400" size={32} />
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                                Book a Session
                                            </h2>
                                            <p style={{ color: 'var(--text-secondary)' }}>Select your preferences below</p>
                                        </div>

                                        {/* Dropdowns */}
                                        <div className="space-y-4 mb-6">
                                            <div className="group">
                                                <label className="block text-sm font-bold mb-2 ml-1" style={{ color: 'var(--text-secondary)' }}>Choose Service</label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" size={18} style={{ color: 'var(--text-primary)' }} />
                                                    <select
                                                        value={selectedService}
                                                        onChange={(e) => setSelectedService(e.target.value)}
                                                        className="w-full appearance-none pl-12 pr-4 py-3 rounded-xl border font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer"
                                                        style={{
                                                            background: 'var(--input-bg, var(--background))',
                                                            borderColor: 'var(--border-color)',
                                                            color: 'var(--text-primary)'
                                                        }}
                                                    >
                                                        <option value="" disabled>Select a service type</option>
                                                        {SERVICES.map(service => (
                                                            <option key={service.id} value={service.id}>{service.label}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-sm font-bold mb-2 ml-1" style={{ color: 'var(--text-secondary)' }}>Choose Consultant</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" size={18} style={{ color: 'var(--text-primary)' }} />
                                                    <select
                                                        value={selectedConsultant}
                                                        onChange={(e) => setSelectedConsultant(e.target.value)}
                                                        className="w-full appearance-none pl-12 pr-4 py-3 rounded-xl border font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer"
                                                        style={{
                                                            background: 'var(--input-bg, var(--background))',
                                                            borderColor: 'var(--border-color)',
                                                            color: 'var(--text-primary)'
                                                        }}
                                                    >
                                                        <option value="" disabled>Select expert consultant</option>
                                                        {CONSULTANTS.map(consultant => (
                                                            <option key={consultant.id} value={consultant.id}>
                                                                {consultant.label} — {consultant.role}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Calendar */}
                                        <div className="border rounded-2xl p-6 mb-6" style={{ borderColor: 'var(--border-color)', background: 'var(--card-bg)' }}>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{monthName} {year}</h3>
                                                <div className="flex gap-2">
                                                    <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                        <ChevronLeft size={20} style={{ color: 'var(--text-primary)' }} />
                                                    </button>
                                                    <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                        <ChevronRight size={20} style={{ color: 'var(--text-primary)' }} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold mb-4 opacity-60" style={{ color: 'var(--text-secondary)' }}>
                                                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                                                    <div key={day} className="py-2">{day}</div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-8">
                                                {blanksArray.map((_, i) => <div key={`blank-${i}`}></div>)}

                                                {daysArray.map((day) => {
                                                    const today = isToday(day);
                                                    const selected = selectedDate === day;
                                                    const past = isPast(day);

                                                    return (
                                                        <button
                                                            key={day}
                                                            onClick={() => handleDateClick(day)}
                                                            disabled={past}
                                                            className={`
                                                                py-2 rounded-lg w-full flex items-center justify-center relative
                                                                ${selected ? 'bg-orange-600 text-white font-bold shadow-lg scale-110' : ''}
                                                                ${today && !selected ? 'border border-orange-600 text-orange-600 font-bold' : ''}
                                                                ${!selected && !today && !past ? 'hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer' : ''}
                                                                ${past ? 'opacity-30 cursor-not-allowed' : ''}
                                                            `}
                                                            style={{ color: !selected && !today ? 'var(--text-primary)' : '' }}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Time Slots */}
                                            {selectedDate && (
                                                <div className="space-y-3 pt-6 border-t animate-fade-in" style={{ borderColor: 'var(--border-color)' }}>
                                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Available Times</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {TIME_SLOTS.map((time) => (
                                                            <button
                                                                key={time}
                                                                onClick={() => setSelectedTime(time)}
                                                                className={`
                                                                    py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 group
                                                                    ${selectedTime === time
                                                                        ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 shadow-md ring-2 ring-orange-200 dark:ring-orange-900'
                                                                        : 'hover:border-orange-500 hover:text-orange-600'
                                                                    }
                                                                `}
                                                                style={selectedTime !== time ? {
                                                                    borderColor: 'var(--border-color)',
                                                                    color: 'var(--text-primary)',
                                                                    background: 'var(--background)'
                                                                } : {}}
                                                            >
                                                                <Clock size={14} className={selectedTime === time ? 'text-orange-600' : 'group-hover:text-orange-600 transition-colors'} />
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleContinue}
                                            disabled={!selectedDate || !selectedTime || !selectedService || !selectedConsultant}
                                            className={`
                                                w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2
                                                ${(!selectedDate || !selectedTime || !selectedService || !selectedConsultant)
                                                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-70'
                                                    : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-orange-600/20 hover:scale-[1.02] active:scale-[0.98]'
                                                }
                                            `}
                                        >
                                            Continue
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                )}

                                {step === 'details' && (
                                    <div className="animate-fade-in">
                                        <div className="text-center mb-8">
                                            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Personal Information</h2>
                                            <p className="text-sm px-4" style={{ color: 'var(--text-secondary)' }}>
                                                Provide your personal details to help us tailor our services to your needs. This information will be kept confidential and used solely for your appointment and service customization.
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        placeholder="First name"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder-gray-500"
                                                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        placeholder="Last name"
                                                        value={formData.lastName}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder-gray-500"
                                                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="Your email address"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder-gray-500"
                                                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        placeholder="Your phone number"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder-gray-500"
                                                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="relative">
                                                        <select
                                                            name="methodOfContact"
                                                            value={formData.methodOfContact}
                                                            onChange={handleInputChange}
                                                            className="w-full appearance-none px-4 py-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer"
                                                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                                        >
                                                            <option value="email">Email</option>
                                                            <option value="phone">Phone</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {submitError && (
                                                <div className="text-red-500 text-sm p-2 text-center bg-red-500/10 rounded">
                                                    {submitError}
                                                </div>
                                            )}

                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={handleBack}
                                                    className="w-1/3 py-4 rounded-xl font-bold transition-all bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10"
                                                    style={{ color: 'var(--text-primary)' }}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-2/3 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-orange-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                                    {!isSubmitting && <ArrowRight size={18} />}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <NewsletterFooter />
        </div>
    );
}
