'use client';

import React from 'react';
import Header from '@/components/Header';
import { Target, Shield, Zap, Users, Trophy, Lightbulb } from 'lucide-react';
import NewsletterFooter from '@/components/NewsletterFooter';

export default function AboutPage() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <Header />

            {/* Header Section */}
            <div className="bg-[#111420] py-20 text-center px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    LASA CONSULTANTS & ORGANISATION
                </h1>
                <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
                <p className="text-gray-300 mt-6 max-w-4xl mx-auto text-lg md:text-xl font-light">
                    Integrated Legal, Business, Strategic, Healthcare, Environmental & Skill Development Advisory
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">

                {/* Introduction */}
                <div className="grid md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-12">
                        <p className="text-lg md:text-xl leading-relaxed font-light" style={{ color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>LASA Consultants & Organisation</strong> delivers compliance-driven legal research, business consultancy,
                            public procurement and GeM advisory, tender & bid support, infrastructure and healthcare project
                            advisory, election campaign management with branding & promotions, intellectual property
                            compliance, environmental & sustainability advisory, and industry-oriented education, training &
                            placement solutions for individuals, startups, MSMEs, corporates, institutions, healthcare providers and
                            government-linked projects across India.
                        </p>
                    </div>
                </div>

                {/* Who We Are */}
                <div className="grid md:grid-cols-2 gap-12 items-start bg-gradient-to-br from-orange-50 to-transparent p-8 md:p-12 rounded-3xl" style={{ border: '1px solid var(--border-color)' }}>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black mb-4 md:mb-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-500 to-yellow-600">
                            Who We Are
                        </h2>
                        <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
                            Lasa Consultants & Organisation is a Jaipur-based integrated consultancy and professional services
                            organisation delivering legal, business, procurement, governance, healthcare, intellectual property,
                            environmental and skill-development solutions across India.
                        </p>
                        <p className="text-lg font-medium italic" style={{ color: 'var(--text-primary)' }}>
                            Our solutions are legally sound, commercially viable, operationally executable, ethically compliant
                            and sector-specific.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>We operate at the intersection of:</h3>
                        <ul className="grid gap-3">
                            {[
                                "Law & compliance",
                                "Business & corporate strategy",
                                "Public procurement & GeM",
                                "Infrastructure & technical projects",
                                "Healthcare & emergency services",
                                "Elections, campaigns, branding & promotions",
                                "Trademark & intellectual property protection",
                                "Energy, environment & sustainability compliance",
                                "Education, training & workforce development"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Why LASA */}
                <div>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Why Choose LASA</h2>
                        <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { text: "10+ years of multidisciplinary experience", icon: <Trophy /> },
                            { text: "Startup, MSME, enterprise & healthcare-focused advisory", icon: <Lightbulb /> },
                            { text: "Public procurement, GeM & tender expertise", icon: <Target /> },
                            { text: "Hospital, ambulance & EMS compliance support", icon: <ActivityIcon /> }, // Added custom icon
                            { text: "Election campaigns, branding & promotion consultancy", icon: <Users /> },
                            { text: "Trademark, IPR & regulatory compliance support", icon: <Shield /> },
                            { text: "Energy, water, air & environmental compliance advisory", icon: <Zap /> },
                            { text: "Ethics-driven, non-litigation consultancy model", icon: <ScaleIcon /> }, // Added custom icon
                            { text: "Industry-aligned training & placement ecosystem", icon: <GraduationCapIcon /> }, // Added custom icon
                            { text: "Pan-India senior expert & consultant network", icon: <NetworkIcon /> }, // Added custom icon
                            { text: "Transparent, scalable & retainer-friendly engagement models", icon: <HandshakeIcon /> } // Added custom icon
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-6 rounded-xl border transition-all hover:shadow-lg" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                                <div className="text-orange-600">
                                    {item.icon}
                                </div>
                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Practice Areas */}
                <div className="rounded-3xl p-8 md:p-16 text-white bg-[#111420]">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Core Practice Areas</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                A quick view of our specialized services designed to drive growth and compliance.
                            </p>
                            <a href="/services" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                                Explore All Services
                            </a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Startup & Corporate Advisory",
                                "Taxation, GST & ITR Services",
                                "Tender, Bid & Procurement Advisory",
                                "GeM & e-Procurement Consultancy",
                                "Infrastructure & Project Advisory",
                                "Hospital, Healthcare & Ambulance Advisory",
                                "Election Campaign & Branding",
                                "Trademark & IPR Advisory",
                                "Energy & Sustainability Advisory",
                                "Compliance, Risk & Governance",
                                "Education & Training Academy"
                            ].map((area, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm md:text-base">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-300">{area}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <NewsletterFooter />
        </div>
    );
}

// Helper components for icons to replace unavailable lucide imports if needed
function ActivityIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>; }
function ScaleIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></svg>; }
function GraduationCapIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>; }
function NetworkIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" /><path d="M12 12V8" /></svg>; }
function HandshakeIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-1.42l-2.7-2.7c.3-.83 1.13-1.88 2.7-1.88a2.5 2.5 0 0 1 2.5 2.5c0 1.05-.6 2.05-1.77 2.65-.63.3-1.15.58-1.73.88" /><path d="M4.5 13.5a2.5 2.5 0 0 1 2.5-2.5c1.1 0 2 .5 2.5 1.5" /><path d="M7.78 12.08a2.5 2.5 0 0 1 2.72-.88" /><path d="M10.5 13.9a2.5 2.5 0 0 1 2.5 2.1" /><path d="M20.3 8.3a2.5 2.5 0 0 0-2.5-2.1c-1.1 0-2 .5-2.5 1.5" /><path d="M17.7 8.1a2.5 2.5 0 0 0-2.7-.9" /></svg>; }
