'use client';

import React from 'react';
import { TrendingUp, Megaphone, ShieldCheck, Leaf, Stethoscope, Truck, Lightbulb, Briefcase } from 'lucide-react';

interface Service {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
}

const services: Service[] = [
    {
        id: 1,
        icon: <TrendingUp size={48} />,
        title: 'Strategic & Election Campaign',
        description: 'Clear, actionable strategies that enable leadership teams to make informed decisions, navigate complexity, and achieve sustainable growth.',
    },
    {
        id: 2,
        icon: <Megaphone size={48} />,
        title: 'Branding & Promotion Consultancy',
        description: 'Strengthening structures, processes, and leadership frameworks to improve efficiency, alignment, and execution across the organization.',
    },
    {
        id: 3,
        icon: <ShieldCheck size={48} />,
        title: 'Trademark & Intellectual Property (IPR) Advisory',
        description: 'In-depth insights into market dynamics, competitive landscapes, and growth opportunities to support confident strategic planning.',
    },
    {
        id: 4,
        icon: <Leaf size={48} />,
        title: 'Energy, Environment & Sustainability Advisory',
        description: 'Identifying inefficiencies and implementing optimized workflows that enhance productivity, scalability, and operational resilience.',
    },
    {
        id: 5,
        icon: <Stethoscope size={48} />,
        title: ' Hospital & Healthcare Advisory',
        description: 'Strategic guidance for market entry, business expansion, diversification, and scaling initiatives aligned with long-term objectives.',
    },
    {
        id: 6,
        icon: <Truck size={48} />,
        title: 'Ambulance Services Advisory',
        description: 'Developing leadership capabilities, governance practices, and decision-making frameworks that empower organizations to lead effectively.',
    },
    {
        id: 7,
        icon: <Lightbulb size={48} />,
        title: 'Training Programs',
        description: 'Designing and executing high-impact initiatives that strengthen competitive positioning and ensure long-term organizational longevity.',
    },
    {
        id: 8,
        icon: <Briefcase size={48} />,
        title: 'Hiring & Placement Services',
        description: 'Comprehensive support for executing complex transactions and ensuring seamless post-merger integration to realize full synergy value.',
    },
];

export default function ServicesSection() {
    const handleLearnMore = () => {
        // Navigate to services page
        window.location.href = '/services';
    };

    return (
        <div id="services-section" className="py-16 md:py-24" style={{ background: 'var(--background)' }}>
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl  font-black mb-4 md:mb-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-700 to-yellow-300">
                        Our Services And Practices
                    </h2>
                    <div className="w-20 h-1 mx-auto" style={{ background: 'var(--accent-gold)' }}></div>
                    <p className="text-lg mt-6 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        At Lasa Consultants & Organizations, we partner with businesses at every stage of growth to provide strategic clarity, operational strength, and long-term value creation.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                            style={{ background: 'var(--card-bg)' }}
                        >
                            <div className="mb-4 text-primary-600 group-hover:text-orange-600 transition-colors duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-semibold mb-3 group-hover:text-orange-600 transition-colors duration-300 cursor-default" style={{ color: 'var(--text-primary)' }}>
                                {service.title}
                            </h3>
                            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Learn More Button */}
                <div className="text-center">
                    <button
                        onClick={handleLearnMore}
                        className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                    >
                        Learn More
                        <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
