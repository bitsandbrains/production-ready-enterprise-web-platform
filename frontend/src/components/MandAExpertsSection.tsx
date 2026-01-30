'use client';

import React from 'react';
import Image from 'next/image';

export default function MandAExpertsSection() {
    const handleLearnMore = () => {
        // Navigate to about page
        window.location.href = '/about';
    };

    return (
        <>
            {/* First Section - About */}
            {/* about Us Header */}
            <div className="pt-10 md:pt-14 pb-5 md:pb-7 text-center" style={{ background: 'var(--card-bg)' }}>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-100 via-orange-700 to-yellow-600">
                    About Us 
                </h3>
            </div>

            {/* First Section - About */}
            <div className="flex items-center pb-12 md:pb-16" style={{ background: 'var(--card-bg)' }}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
                        {/* Left Column - Text Content */}
                        <div className="space-y-4 md:space-y-6">

                            <h4 className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Who We Are</h4>
                            <div className="w-20 h-1" style={{ background: 'var(--accent-gold)' }}></div>

                            <div className="space-y-3 md:space-y-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                <p className="text-base md:text-lg">Lasa Consultants & Organisation is a Jaipur-based integrated consultancy and professional services organisation delivering legal, business, procurement, governance, healthcare, intellectual property, environmental and skill-development solutions across India.</p>
                                <p className="text-base md:text-lg">We operate at the intersection of:<br />
                                    - Law & compliance<br />
                                    - Business & corporate strategy<br />
                                    - Public Procurement & GEM<br />
                                    - Governance & risk<br />
                                    - Healthcare & technology<br />
                                    - Intellectual property & innovation<br />
                                    - Environmental & sustainability<br />
                                    - Skill development & education<br />
                                </p>
                                <p className="text-base md:text-lg">Our solutions are legally sound, commercially viable, operationally executable, ethically compliantand sector-specific.</p>
                                <button
                                    onClick={handleLearnMore}
                                    className="mt-4 md:mt-6 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-md font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                                >
                                    Learn More
                                    <span>→</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Single Image */}
                        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-xl">
                            <Image
                                src="/mna-experts-team.webp"
                                alt="M&amp;A Experts Team"
                                fill
                                className="object-cover"
                            />
                        </div>

                    </div>
                </div>
            </div>

            {/* Second Section - Our Philosophy */}
            <div className="min-h-screen flex items-center py-12 md:py-16" style={{ background: 'var(--background)' }}>
                <div className="max-w-7xl mx-auto px-4">
                    {/* Centered Header */}
                    <div className="text-center mb-10 md:mb-14">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-900 via-orange-700 to-yellow-600">
                            Our Philosophy
                        </h2>
                        <div className="w-24 h-1.5 mx-auto mb-4 md:mb-6" style={{ background: 'var(--accent-gold)' }}></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
                        {/* Left Column - Philosophy Content */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="space-y-4 md:space-y-6" style={{ color: 'var(--text-secondary)' }}>
                                <p className="text-base md:text-lg leading-relaxed">
                                    Client-centric advisory approach
                                </p>
                                <p className="text-base md:text-lg leading-relaxed">
                                    Lawful, ethical & compliant engagement
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Sector-focused operational understanding
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Skill-to-employment orientation
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Process-driven execution
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Transparency & accountability
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Long-term value creation
                                </p>
                            </div>

                            <button
                                onClick={handleLearnMore}
                                className="mt-4 md:mt-6 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-md font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                            >
                                Learn More
                                <span>→</span>
                            </button>
                        </div>

                        {/* Right Column - Single Image */}
                        <div className="relative h-[375px] md:h-[375px] lg:h-[450px] rounded-lg overflow-hidden shadow-xl">
                            <Image
                                src="/mna-experts-team2.webp"
                                alt="M&amp;A Experts Team - Strategy"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
