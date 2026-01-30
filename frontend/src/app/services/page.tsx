'use client';

import React from 'react';
import Header from '@/components/Header';
import { Shield, Settings, Users, Activity, FileText } from 'lucide-react';
import NewsletterFooter from '@/components/NewsletterFooter';

export default function ServicesPage() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <Header />

            {/* Header Section */}
            <div className="bg-[#111420] py-20 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    Services & Practice Areas
                </h1>
                <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
                <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg px-4">
                    Expert consultancy across legal, election management, IPR, and infrastructure sectors.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">

                {/* Section 1: Strategic & Election Campaign */}
                <div className="grid md:grid-cols-12 gap-12 items-start">
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                <Users className="text-orange-600" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                                Strategic & Election Campaign
                            </h2>
                            <h3 className="text-xl font-semibold text-orange-600 mb-4">
                                Branding & Promotion Consultancy
                            </h3>
                            <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Consulting & management support only. No political representation or solicitation.
                            </p>
                        </div>
                    </div>
                    <div className="md:col-span-8 space-y-8">
                        <div className="p-8 rounded-2xl shadow-sm border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                            <h4 className="font-bold text-lg mb-4 border-b pb-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Elections Covered</h4>
                            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Bar Councils, Trade Bodies, Chambers of Commerce, Cooperative Societies, Professional Councils, Associations, Unions, Federations, NGOs & Registered Societies.
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl shadow-sm border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                            <h4 className="font-bold text-lg mb-6 border-b pb-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Key Services</h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Election strategy & roadmap planning",
                                    "Stakeholder & voter data research",
                                    "Booth / unit / district-wise planning",
                                    "Budget planning & fund utilisation tracking",
                                    "Compliance-driven campaign execution",
                                    "Campaign branding, creatives & digital outreach",
                                    "Event, meeting & rally coordination",
                                    "Influencer & opinion-leader mapping"
                                ].map((service, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5"></div>
                                        <span style={{ color: 'var(--text-secondary)' }}>{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Trademark & IPR */}
                <div className="grid md:grid-cols-12 gap-12 items-start pt-16 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                <FileText className="text-blue-600" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                                Trademark & Intellectual Property (IPR) Advisory
                            </h2>
                            <p className="leading-relaxed text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
                                Documentation & coordination support only. Litigation through authorised professionals.
                            </p>
                        </div>
                    </div>
                    <div className="md:col-span-8">
                        <div className="p-8 rounded-2xl shadow-sm border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                            <h4 className="font-bold text-lg mb-6 border-b pb-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Key Services</h4>
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                                {[
                                    "Trademark search & classification advisory",
                                    "Trademark registration & renewal coordination",
                                    "Reply drafting for objections & oppositions",
                                    "Copyright registration advisory",
                                    "IP assignment & licensing documentation",
                                    "Brand protection strategy (non-litigation)"
                                ].map((service, i) => (
                                    <div key={i} className="flex items-start gap-3 border-b pb-3 last:border-0 sm:last:border-b" style={{ borderColor: 'var(--border-color)' }}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
                                        <span style={{ color: 'var(--text-secondary)' }}>{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Energy & Environment */}
                <div className="grid md:grid-cols-12 gap-12 items-start pt-16 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                <Shield className="text-green-600" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                                Energy, Environment & Sustainability Advisory
                            </h2>
                            <p className="leading-relaxed text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
                                <span className="font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>Sectors:</span>
                                Industries, Hospitals, Infrastructure, Commercial Buildings, Government & Facility Projects.
                            </p>
                        </div>
                    </div>
                    <div className="md:col-span-8">
                        <div className="p-8 rounded-2xl shadow-sm border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                            <h4 className="font-bold text-lg mb-6 border-b pb-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Key Services</h4>
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                                {[
                                    "Energy audit coordination",
                                    "Water audit & conservation advisory",
                                    "Air & pollution compliance advisory",
                                    "PCB compliance, CTE / CTO documentation",
                                    "Environmental Impact documentation support",
                                    "ESG & sustainability advisory"
                                ].map((service, i) => (
                                    <div key={i} className="flex items-start gap-3 border-b pb-3 last:border-0 sm:last:border-b" style={{ borderColor: 'var(--border-color)' }}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5"></div>
                                        <span style={{ color: 'var(--text-secondary)' }}>{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Hospital & Healthcare */}
                <div className="grid md:grid-cols-12 gap-12 items-start pt-16 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                <Activity className="text-red-600" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                                Hospital, Healthcare & Ambulance Services Advisory
                            </h2>
                        </div>
                    </div>
                    <div className="md:col-span-8 space-y-8">
                        <div className="p-8 rounded-2xl shadow-sm border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                            <h4 className="font-bold text-lg mb-6 border-b pb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                                <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                                Hospital & Healthcare
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Hospital registration & licensing advisory",
                                    "Clinical Establishments Act compliance",
                                    "Fire, biomedical waste & pollution compliance",
                                    "NABH / NABL documentation support (non-certifying)",
                                    "Hospital SOPs & medico-legal formats",
                                    "Healthcare GST & statutory compliance coordination"
                                ].map((service, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5"></div>
                                        <span style={{ color: 'var(--text-secondary)' }}>{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl shadow-sm border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                            <h4 className="font-bold text-lg mb-6 border-b pb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                                <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                                Ambulance & EMS
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Ambulance registration & permit advisory",
                                    "Motor Vehicles Act & EMS compliance research",
                                    "State, PSU & NHM ambulance tender advisory",
                                    "GeM & e-procurement support for EMS",
                                    "SLA, penalty & contract compliance review"
                                ].map((service, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5"></div>
                                        <span style={{ color: 'var(--text-secondary)' }}>{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Newsletter & Footer Section */}
            <NewsletterFooter />
        </div>
    );
}
