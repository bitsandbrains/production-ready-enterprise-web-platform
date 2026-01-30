'use client';

import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
        // Only handle scroll if we are on the home page
        if (window.location.pathname === '/') {
            e.preventDefault();
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If not on home page, allow default navigation to the href (e.g. /#upload-pdf)
            // or manually redirect if prefer explicit handling
            // Since the hrefs are set to "/#upload-pdf" etc, we can just return and let the browser handle it.
            // But to be safe ensuring the hash prevents a full reload if somehow we are on /something:
            // Actually, we WANT a navigation to /. Default href work.
            // Just removing the preventDefault and hardcoded logic is sufficient.
            return;
        }
    };

    return (
        <header className="bg-[#111420] backdrop-blur-md sticky top-0 z-50 border-b border-yellow-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <a href="/" className="flex-shrink-0 flex items-center" aria-label="Lasa Home">
                        <video
                            src="/lasa-logo3.webm?v=2"
                            className="h-20 w-auto"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    </a>

                    {/* Navigation Links - Hidden on mobile */}
                    <nav className="hidden md:flex space-x-8">
                        <a href="/about" className="text-white hover:text-yellow-400 font-medium transition-colors">About Us</a>
                        <a href="/services" className="text-white hover:text-yellow-400 font-medium transition-colors">Our Services</a>
                        <a
                            href="/#upload-pdf"
                            onClick={(e) => handleScroll(e, 'upload-pdf')}
                            className="text-white hover:text-yellow-400 font-medium transition-colors"
                        >
                            Upload PDF
                        </a>
                        <a
                            href="/#contact-us"
                            onClick={(e) => handleScroll(e, 'contact-us')}
                            className="text-white hover:text-yellow-400 font-medium transition-colors"
                        >
                            Contact Us
                        </a>
                    </nav>

                    {/* CTA Button & Theme Toggle */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <a href="/blogs" className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide hover:from-orange-700 hover:to-orange-800 transition-all shadow-md hover:shadow-lg inline-block text-center">
                            GET STARTED WITH BLOGS
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
