'use client';

import React from 'react';

export default function StatsSection() {
    const stats = [
        {
            value: '11+ Core Domains',
            label: 'Integrated Practice Areas'
        },
        {
            value: 'Pan-India',
            label: 'Expert & Consultant Network'
        },
        {
            value: '10+ Years',
            label: 'Multidisciplinary Advisory Experience'
        }
    ];

    return (
        <section className="py-4 md:py-6" style={{ background: 'var(--background)' }}>
            <div className="max-w-7xl mx-auto px-4">
                <div
                    className="rounded-3xl shadow-2xl p-6 md:p-8 transform -translate-y-12 mb-[-3rem] relative z-20"
                    style={{
                        background: 'var(--card-bg)',
                        borderColor: 'var(--border-color)',
                        borderWidth: '1px'
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col items-center justify-center"
                            >
                                <h3
                                    className="text-3xl md:text-4xl lg:text-5xl font-light mb-2 md:mb-3"
                                    style={{
                                        color: '#800020', // Maroon from the logo
                                        fontFamily: 'Georgia, serif'
                                    }}
                                >
                                    {stat.value}
                                </h3>
                                <p
                                    className="text-sm md:text-base font-medium tracking-widest uppercase text-slate-500 max-w-[200px]"
                                >
                                    {stat.label}
                                </p>
                                {index < stats.length - 1 && (
                                    <div className="hidden md:block absolute right-[-1rem] top-1/4 bottom-1/4 w-[1px] bg-slate-200"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
