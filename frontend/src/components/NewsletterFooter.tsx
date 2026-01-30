'use client';

import React, { useState } from 'react';
import { Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function NewsletterFooter() {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log('Subscribe email:', email);
        setEmail('');
    };

    return (
        <footer className="bg-[#111420] text-white">
            {/* Newsletter Section */}
            <div className="border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">Subscribe To Our Newsletter</h2>
                            <p className="text-slate-300">Stay ahead with expert insights on the latest industry trends.</p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your Email"
                                className="px-6 py-3 rounded-lg bg-white text-gray-900 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                required
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 bg-white text-primary-900 font-semibold rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer Links Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="mb-6">
                            <video
                                src="/lasa-logo3.webm?v=2"
                                className="h-28 w-auto mb-4"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                            <p className="text-2xl md:text-3xl lg:text-2xl font-black mb-2 md:mb-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-700 to-yellow-500">Lasa Consultants & Organisations</p>
                        </div>
                        <div className="space-y-2 text-sm text-slate-300">
                            <p> lasainfra@hotmail.com</p>
                            <p> +91-9694919394</p>
                            <p className="pt-2">Jaipur, Rajasthan – 302026</p>
                        </div>
                        {/* Social Media */}
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="text-slate-300 hover:text-yellow-400 transition-colors" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="text-slate-300 hover:text-yellow-400 transition-colors" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-slate-300 hover:text-yellow-400 transition-colors" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-slate-300 hover:text-yellow-400 transition-colors" aria-label="YouTube">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links - Pages */}
                    <div className="justify-self-end">
                        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-2 text-base text-slate-300">
                            <li><a href="/" className="hover:text-orange-400 transition-colors">Home</a></li>
                            <li><a href="/about" className="hover:text-orange-400 transition-colors">About Us</a></li>
                            <li><a href="/services" className="hover:text-orange-400 transition-colors">Our Services</a></li>
                            <li><a href="/trainings" className="hover:text-orange-400 transition-colors">Training & Academy</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="justify-self-end">
                        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Resources</h3>
                        <ul className="space-y-2 text-base text-slate-300">
                            <li><a href="/consultation" className="hover:text-orange-400 transition-colors">Schedule Consultation</a></li>
                            <li><a href="/blogs" className="hover:text-orange-400 transition-colors">Insights & Blogs</a></li>
                            <li><a href="/#contact-us" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-slate-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <p className="text-center text-sm text-slate-400">
                        © {new Date().getFullYear()} Lasa Consultants & Organizations. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
