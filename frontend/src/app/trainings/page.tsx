'use client';

import React from 'react';
import Header from '@/components/Header';
import { BookOpen, GraduationCap, Briefcase, Award } from 'lucide-react';
import NewsletterFooter from '@/components/NewsletterFooter';

export default function TrainingsPage() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <Header />

            {/* Header Section */}
            <div className="bg-[#111420] py-20 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-5xl mx-auto leading-tight">
                    Education, Training, Hiring & Placement Academy
                </h1>
                <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">

                {/* Academy Overview Cards */}
                <div className="rounded-3xl shadow-xl overflow-hidden" style={{ background: 'var(--card-bg)' }}>
                    <div className="grid md:grid-cols-2">
                        <div className="p-10 md:p-16 flex flex-col justify-center bg-gray-900 text-white">
                            <div className="mb-6">
                                <BookOpen size={48} className="text-yellow-500" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Academy Overview</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                The LASA Academy bridges the gap between education, employability and industry requirements across
                                legal, corporate, procurement, healthcare, infrastructure, election, IPR and environmental sectors.
                            </p>
                        </div>
                        <div className="p-10 md:p-16 flex items-center" style={{ background: 'var(--card-bg)' }}>
                            <ul className="space-y-6">
                                {[
                                    "Industry-aligned curriculum",
                                    "Practical skill development",
                                    "Expert-led workshops",
                                    "Cross-sector employability"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4">
                                        <div className="bg-yellow-100 p-2 rounded-full">
                                            <Award className="text-yellow-600" size={20} />
                                        </div>
                                        <span className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Training Programs */}
                <div>
                    <div className="text-center mb-12">
                        <div className="inline-block p-3 rounded-full bg-blue-100 mb-4">
                            <GraduationCap className="text-blue-600" size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Training Programs</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            "Legal & Compliance Training",
                            "Corporate & Business Training",
                            "Facility, Infrastructure & Healthcare Training",
                            "Elections, Branding, IPR & Environment Modules",
                            "Personal & Professional Development"
                        ].map((program, i) => (
                            <div key={i} className="p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-shadow group" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                                <div className="h-2 w-12 bg-blue-500 rounded-full mb-6 group-hover:w-20 transition-all"></div>
                                <h3 className="text-xl font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                                    {program}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hiring & Placement */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 md:p-16">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Briefcase size={200} />
                    </div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                                Hiring & Placement Services
                            </h2>
                            <p className="text-gray-400 mb-8 italic border-l-4 border-yellow-500 pl-4">
                                *Placement facilitation only. No employment guarantee.
                            </p>
                            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg transition-colors">
                                Apply for Placement
                            </button>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-4">Key Opportunities</h3>
                            <ul className="space-y-4">
                                {[
                                    "Industry-oriented placements",
                                    "Legal, compliance, procurement & operations roles",
                                    "Healthcare, EMS & infrastructure roles",
                                    "Corporate hiring & manpower sourcing"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                                        <span className="text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            {/* Newsletter & Footer Section */}
            <NewsletterFooter />
        </div>
    );
}
