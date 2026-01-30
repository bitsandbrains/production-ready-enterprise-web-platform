'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileCheck, CheckCircle } from 'lucide-react';
import FileUploader from '@/components/FileUploader';
import HeroCarousel from '@/components/HeroCarousel';
import StatsSection from '@/components/StatsSection';
import MandAExpertsSection from '@/components/MandAExpertsSection';
import ServicesSection from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';
import Header from '@/components/Header';
import NewsletterFooter from '@/components/NewsletterFooter';
import ThemeToggle from '@/components/ThemeToggle';
import EngagementAndTeamSection from '@/components/EngagementAndTeamSection';

export default function Home() {
  const router = useRouter();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUploadComplete = (taskId: string) => {
    // Navigate to jobs page with task ID
    router.push(`/jobs?id=${taskId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50" style={{ background: 'var(--background)' }}>
      {/* Navigation Header */}
      <Header />

      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Stats Section */}
      <StatsSection />

      {/* M&A Experts Section */}
      <MandAExpertsSection />

      {/* Services Section */}
      <ServicesSection />

      {/* PDF Upload Section */}
      <div id="upload-pdf" className="min-h-[500px] md:min-h-[550px] flex items-center py-1 md:py-2" style={{ background: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto px-4 w-full">
          {/* Section Header */}
          <div className="text-center mb-1 md:mb-2 fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-900 via-orange-700 to-yellow-600">
              Lasa Consultants &amp; Organizations
            </h2>
            <div className="w-24 h-1 mx-auto mb-1 md:mb-2" style={{ background: 'var(--accent-gold)' }}></div>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Securely upload your PDF contracts for intelligent data extraction and analysis.
            </p>
          </div>

          {/* Main Card */}
          <div className="rounded-3xl shadow-2xl overflow-hidden slide-up" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: '1px' }}>
            <div className="p-3 md:p-5">
              <div className="p-3 md:p-4 rounded-2xl" style={{ background: 'var(--background)', border: '1px dashed var(--border-color)' }}>
                <FileUploader onUploadComplete={handleUploadComplete} />
              </div>
            </div>

            {/* Footer Info */}
            <div className="px-5 md:px-8 py-3 md:py-4 border-t" style={{ background: 'rgba(var(--primary-brand-rgb), 0.03)', borderColor: 'var(--border-color)' }}>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex flex-col justify-center">
                  <h4 className="text-base md:text-lg font-bold mb-1 md:mb-2" style={{ color: 'var(--text-primary)' }}>Why Choose Our Platform?</h4>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Our proprietary AI engine extracts essential data from complex PDFs automatically, delivering structured Excel outputs that save hours of manual entry.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  <div className="flex items-center gap-3 p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <CheckCircle className="text-green-600" size={16} />
                    </div>
                    <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Fast and accurate data extraction</span>
                  </div>
                  <div className="flex items-center gap-3 p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <CheckCircle className="text-green-600" size={16} />
                    </div>
                    <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Organized Excel output with multi-sheet support</span>
                  </div>
                  <div className="flex items-center gap-3 p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <CheckCircle className="text-green-600" size={16} />
                    </div>
                    <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Secure end-to-end background processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-2 md:mt-4 text-center text-xs md:text-sm font-medium fade-in" style={{ color: 'var(--text-secondary)' }}>
            <div className="inline-flex items-center gap-4 bg-gray-100 dark:bg-slate-800 px-6 py-1 rounded-full border border-gray-200 dark:border-slate-700">
              <span>Supported format: <span className="text-primary-600">PDF</span></span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Max size: <span className="text-primary-600">50MB</span></span>
            </div>
            <p className="mt-1 md:mt-1.5 opacity-70">Enterprise-grade security for all your documents</p>
          </div>
        </div>
      </div>

      {/* Engagement Models & Team Section */}
      <EngagementAndTeamSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Newsletter & Footer Section */}
      <NewsletterFooter />
    </div>
  );
}
