'use client';

import React from 'react';
import Header from '@/components/Header';
import { BookOpen, ArrowRight } from 'lucide-react';
import NewsletterFooter from '@/components/NewsletterFooter';

export default function BlogsPage() {
    const blogCategories = [
        {
            title: "Startup & Corporate Compliance Guides",
            description: "Essential guides for navigating the complex regulatory landscape for startups and corporates in India.",
            date: "Latest",
            readTime: "5 min read",
            icon: "🚀"
        },
        {
            title: "GeM & Tender Strategies",
            description: "Winning strategies for Government e-Marketplace bidding and public procurement tenders.",
            date: "Popular",
            readTime: "7 min read",
            icon: "💼"
        },
        {
            title: "Election Campaigns & Branding Insights",
            description: "Data-driven insights into modern election management, voter psychology, and political branding.",
            date: "Trending",
            readTime: "6 min read",
            icon: "🗳️"
        },
        {
            title: "Trademark & IP Compliance Updates",
            description: "Stay ahead with the latest updates on trademark registration, copyright laws, and IP protection.",
            date: "New",
            readTime: "4 min read",
            icon: "®️"
        },
        {
            title: "Energy, Environment & ESG Articles",
            description: "Expert analysis on environmental compliance, sustainability audits, and ESG reporting standards.",
            date: "Featured",
            readTime: "8 min read",
            icon: "🌿"
        },
        {
            title: "Hospital & Ambulance Compliance Updates",
            description: "Critical compliance checklists for healthcare providers, hospitals, and ambulance service operators.",
            date: "Latest",
            readTime: "5 min read",
            icon: "🚑"
        },
        {
            title: "Training & Career Development Articles",
            description: "Career advice, skill development tips, and industry trends for students and professionals.",
            date: "Guide",
            readTime: "6 min read",
            icon: "🎓"
        }
    ];

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <Header />

            {/* Header Section */}
            <div className="bg-[#111420] py-20 text-center px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    INSIGHTS & BLOGS
                </h1>
                <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
                <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
                    Expert perspectives on law, business, governance, and compliance.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogCategories.map((blog, i) => (
                        <div
                            key={i}
                            className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col"
                            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                        >
                            {/* Card Header similar to image placeholder */}
                            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden">
                                <span className="text-6xl animate-pulse-custom filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-50">{blog.icon}</span>
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm border border-orange-100 dark:border-orange-900/30">
                                    {blog.date}
                                </div>
                            </div>

                            <div className="p-8 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 mb-4 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    <span>LASA Insights</span>
                                    <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                                    <span>{blog.readTime}</span>
                                </div>

                                <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-orange-600 transition-colors" style={{ color: 'var(--text-primary)' }}>
                                    {blog.title}
                                </h3>

                                <p className="mb-6 line-clamp-3 leading-relaxed flex-grow" style={{ color: 'var(--text-secondary)' }}>
                                    {blog.description}
                                </p>

                                <button className="flex items-center gap-2 text-sm font-bold text-orange-600 group-hover:gap-3 transition-all mt-auto">
                                    read article <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coming Soon / Load More */}
                <div className="mt-20 text-center">
                    <div className="inline-block p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50">
                        <p className="text-slate-900 dark:text-orange-500 font-medium">
                            More in-depth articles and case studies coming soon.
                        </p>
                    </div>
                </div>
            </div>

            <NewsletterFooter />
        </div>
    );
}
