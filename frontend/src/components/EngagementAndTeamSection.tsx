'use client';

import React from 'react';
import { Briefcase, Users, Target, Zap, Award } from 'lucide-react';

export default function EngagementAndTeamSection() {
    const engagementModels = [
        "Monthly Retainer Model",
        "Project-Based Consultancy",
        "Milestone-Linked Billing",
        "Strategic Advisory Assignments",
        "Short-Term Bid, Election, Branding, Environmental & Training Engagements"
    ];

    return (
        <div className="py-16 md:py-24" style={{ background: 'var(--background)' }}>
            <div className="max-w-7xl mx-auto px-4">

                {/* Engagement Models Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-700 to-yellow-300">
                            Engagement Models
                        </h2>
                        <div className="w-24 h-1 mx-auto" style={{ background: 'var(--accent-gold)' }}></div>
                        <p className="text-lg mt-6 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                            Flexible engagement options designed to match your needs and budget
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {engagementModels.map((model, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                                style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30 transition-colors">
                                        <Briefcase className="text-orange-600" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg leading-snug" style={{ color: 'var(--text-primary)' }}>
                                            {model}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Team Section */}
                <div>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-700 to-yellow-300">
                            Our Team
                        </h2>
                        <div className="w-24 h-1 mx-auto" style={{ background: 'var(--accent-gold)' }}></div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                        {/* Founder Card */}
                        <div
                            className="p-8 md:p-10 rounded-2xl border shadow-lg"
                            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600">
                                    <Award className="text-white" size={32} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-orange-600 mb-1">Founder & Principal Consultant</p>
                                    <h3 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                        Mr. Sanjay Singh
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2"></div>
                                    <p className="flex-1">
                                        <span className="font-semibold">Qualifications:</span> B.Tech – Electrical | LL.B | AIBE Qualified | Human Rights Certification
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2"></div>
                                    <p className="flex-1">
                                        <span className="font-semibold">Expertise:</span> Infrastructure, Public Procurement, Healthcare Projects, Elections, IPR, Environmental Advisory & Skill Development
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Expert Network Card */}
                        <div
                            className="p-8 md:p-10 rounded-2xl border shadow-lg"
                            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                                    <Users className="text-white" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                        Expert Network
                                    </h3>
                                </div>
                            </div>

                            <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Our extensive network of specialized professionals ensures comprehensive support across all domains:
                            </p>

                            <div className="grid sm:grid-cols-2 gap-3">
                                {[
                                    "Legal",
                                    "Taxation",
                                    "Procurement",
                                    "Healthcare",
                                    "Election Strategy",
                                    "IPR",
                                    "Environmental",
                                    "Training & Placement"
                                ].map((expertise, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                            {expertise}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
