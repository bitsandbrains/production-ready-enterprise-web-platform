'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LawFirmFormData {
    organization_name: string;
    email_address: string;
    subject: string;
    message: string;
}

interface CandidateFormData {
    candidate_name: string;
    email_address: string;
    subject: string;
    message: string;
}

export default function ContactSection() {
    const [activeTab, setActiveTab] = useState<'lawfirm' | 'candidate'>('lawfirm');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Law Firm Form State
    const [lawFirmForm, setLawFirmForm] = useState<LawFirmFormData>({
        organization_name: '',
        email_address: '',
        subject: '',
        message: ''
    });

    // Candidate Form State
    const [candidateForm, setCandidateForm] = useState<CandidateFormData>({
        candidate_name: '',
        email_address: '',
        subject: '',
        message: ''
    });

    const handleTabChange = (tab: 'lawfirm' | 'candidate') => {
        if (activeTab === tab || isAnimating) return;

        setIsAnimating(true);
        setSubmitMessage(null); // Clear any messages when switching tabs
        setTimeout(() => {
            setActiveTab(tab);
            setIsAnimating(false);
        }, 300); // 300ms delay for the transition
    };

    // Handle Law Firm Form Submission
    const handleLawFirmSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage(null);

        // Basic validation
        if (!lawFirmForm.organization_name || !lawFirmForm.email_address || !lawFirmForm.subject) {
            setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('Submitting law firm form...', lawFirmForm);
            const { data, error } = await supabase
                .from('Reach Out - Law Firm')
                .insert([lawFirmForm]);

            console.log('Supabase response:', { data, error });

            if (error) {
                console.error('Supabase error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }

            setSubmitMessage({ type: 'success', text: 'Message sent successfully! We\'ll get back to you soon.' });
            // Reset form
            setLawFirmForm({
                organization_name: '',
                email_address: '',
                subject: '',
                message: ''
            });
        } catch (error: any) {
            console.error('Error submitting law firm form:', error);
            setSubmitMessage({ type: 'error', text: `Failed to send message: ${error.message || 'Please try again.'}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Candidate Form Submission
    const handleCandidateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage(null);

        // Basic validation
        if (!candidateForm.candidate_name || !candidateForm.email_address || !candidateForm.subject) {
            setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('Submitting candidate form...', candidateForm);
            const { data, error } = await supabase
                .from('Reach Out - Candidate')
                .insert([candidateForm]);

            console.log('Supabase response:', { data, error });

            if (error) {
                console.error('Supabase error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }

            setSubmitMessage({ type: 'success', text: 'Application submitted successfully! We\'ll review it and get back to you.' });
            // Reset form
            setCandidateForm({
                candidate_name: '',
                email_address: '',
                subject: '',
                message: ''
            });
        } catch (error: any) {
            console.error('Error submitting candidate form:', error);
            setSubmitMessage({ type: 'error', text: `Failed to submit application: ${error.message || 'Please try again.'}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const href = e.currentTarget.href;
        const targetId = href.replace(/.*\#/, "");
        const elem = document.getElementById(targetId);
        elem?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <div id="contact-us" className="py-20 md:py-28" style={{ background: 'var(--background)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Left Column - Text */}
                    <div className="max-w-lg">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
                            Reach Out
                        </h2>
                        <p className="text-xl md:text-2xl leading-relaxed font-light" style={{ color: 'var(--text-secondary)' }}>
                            Ready to partner with Lasa for your legal talent and consulting needs? Contact us today to explore how we can support your growth and success.
                        </p>
                    </div>

                    {/* Right Column - Form */}
                    <div className="bg-[#111420] p-8 md:p-12 rounded-sm shadow-2xl">
                        {/* Tabs */}
                        <div className="flex gap-8 mb-10 border-b border-gray-800">
                            <button
                                onClick={() => handleTabChange('lawfirm')}
                                className={`pb-4 text-xl font-medium transition-colors relative ${activeTab === 'lawfirm'
                                    ? 'text-white'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                Law firm
                                {activeTab === 'lawfirm' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>
                                )}
                            </button>
                            <button
                                onClick={() => handleTabChange('candidate')}
                                className={`pb-4 text-xl font-medium transition-colors relative ${activeTab === 'candidate'
                                    ? 'text-white'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                Candidate
                                {activeTab === 'candidate' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>
                                )}
                            </button>
                        </div>

                        {/* Form Container with Fade Transition */}
                        <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                            {activeTab === 'lawfirm' ? (
                                <form onSubmit={handleLawFirmSubmit} className="space-y-8">
                                    <div className="space-y-2">
                                        <label htmlFor="firm-name" className="block text-sm font-medium text-gray-400">
                                            Organization Name*
                                        </label>
                                        <input
                                            type="text"
                                            id="firm-name"
                                            value={lawFirmForm.organization_name}
                                            onChange={(e) => setLawFirmForm({ ...lawFirmForm, organization_name: e.target.value })}
                                            disabled={isSubmitting}
                                            className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors text-lg disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="firm-email" className="block text-sm font-medium text-gray-400">
                                            Email Address*
                                        </label>
                                        <input
                                            type="email"
                                            id="firm-email"
                                            value={lawFirmForm.email_address}
                                            onChange={(e) => setLawFirmForm({ ...lawFirmForm, email_address: e.target.value })}
                                            disabled={isSubmitting}
                                            className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors text-lg disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="firm-subject" className="block text-sm font-medium text-gray-400">
                                            Subject*
                                        </label>
                                        <input
                                            type="text"
                                            id="firm-subject"
                                            value={lawFirmForm.subject}
                                            onChange={(e) => setLawFirmForm({ ...lawFirmForm, subject: e.target.value })}
                                            disabled={isSubmitting}
                                            className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors text-lg disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="space-y-2 pt-4">
                                        <label htmlFor="firm-message" className="block text-sm font-medium text-gray-400">
                                            Message
                                        </label>
                                        <textarea
                                            id="firm-message"
                                            rows={1}
                                            value={lawFirmForm.message}
                                            onChange={(e) => setLawFirmForm({ ...lawFirmForm, message: e.target.value })}
                                            disabled={isSubmitting}
                                            className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors text-lg resize-none disabled:opacity-50"
                                        ></textarea>
                                    </div>

                                    {/* Success/Error Message */}
                                    {submitMessage && (
                                        <div className={`p-4 rounded ${submitMessage.type === 'success' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                                            {submitMessage.text}
                                        </div>
                                    )}

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="group w-full bg-[#d4f995] hover:bg-[#c2e884] text-black font-medium py-4 px-6 rounded transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send message'}
                                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleCandidateSubmit} className="space-y-8">
                                    <div className="space-y-2">
                                        <label htmlFor="cand-name" className="block text-sm font-medium text-gray-400">
                                            Candidate Name*
                                        </label>
                                        <input
                                            type="text"
                                            id="cand-name"
                                            value={candidateForm.candidate_name}
                                            onChange={(e) => setCandidateForm({ ...candidateForm, candidate_name: e.target.value })}
                                            disabled={isSubmitting}
                                            className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors text-lg disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="cand-email" className="block text-sm font-medium text-gray-400">
                                            Email Address*
                                        </label>
                                        <input
                                            type="email"
                                            id="cand-email"
                                            value={candidateForm.email_address}
                                            onChange={(e) => setCandidateForm({ ...candidateForm, email_address: e.target.value })}
                                            disabled={isSubmitting}
                                            className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors text-lg disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="cand-role" className="block text-sm font-medium text-gray-400">
                                            Subject*
                                        </label>
                                        <input
                                            type="text"
                                            id="cand-role"
                                            value={candidateForm.subject}
                                            onChange={(e) => setCandidateForm({ ...candidateForm, subject: e.target.value })}
                                            disabled={isSubmitting}
                                            className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors text-lg disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="space-y-2 pt-4">
                                        <label htmlFor="cand-message" className="block text-sm font-medium text-gray-400">
                                            Message
                                        </label>
                                        <textarea
                                            id="cand-message"
                                            rows={1}
                                            value={candidateForm.message}
                                            onChange={(e) => setCandidateForm({ ...candidateForm, message: e.target.value })}
                                            disabled={isSubmitting}
                                            className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors text-lg resize-none disabled:opacity-50"
                                        ></textarea>
                                    </div>

                                    {/* Success/Error Message */}
                                    {submitMessage && (
                                        <div className={`p-4 rounded ${submitMessage.type === 'success' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                                            {submitMessage.text}
                                        </div>
                                    )}

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="group w-full bg-[#d4f995] hover:bg-[#c2e884] text-black font-medium py-4 px-6 rounded transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
