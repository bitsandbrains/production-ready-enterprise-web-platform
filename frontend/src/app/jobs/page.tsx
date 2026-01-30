'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import JobStatus from '@/components/JobStatus';
import DownloadLink from '@/components/DownloadLink';
import Header from '@/components/Header';
import NewsletterFooter from '@/components/NewsletterFooter';
import { TaskResult } from '@/lib/api';

function JobsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const taskId = searchParams.get('id');

    const [result, setResult] = useState<TaskResult | null>(null);

    useEffect(() => {
        if (!taskId) {
            // No task ID, redirect to home
            router.push('/');
        }
    }, [taskId, router]);

    const handleComplete = (result: { 
        processed_files: number; 
        total_files: number; 
        download_url?: string | undefined; 
    } | undefined) => {
        if (result) {
            // Convert the result object back to full TaskResult
            setResult({
                task_id: taskId || '',
                status: 'completed',
                processed_files: result.processed_files,
                total_files: result.total_files,
                download_url: result.download_url,
            });
        }
    };

    const handleReset = () => {
        router.push('/#upload-pdf');
    };

    if (!taskId) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No job ID provided. Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            {/* Navigation Header */}
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                {/* Hero Section */}
                <div className="text-center mb-8 md:mb-12 fade-in">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-900 via-orange-700 to-yellow-600">
                        Job Processing
                    </h1>
                    <div className="w-24 h-1 mx-auto mb-4 md:mb-6" style={{ background: 'var(--accent-gold)' }}></div>
                    <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        Track your file processing status in real-time
                    </p>
                </div>

                {/* Main Card */}
                <div className="rounded-3xl shadow-2xl overflow-hidden slide-up" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: '1px' }}>
                    <div className="p-6 md:p-8">
                        {!result ? (
                            <JobStatus taskId={taskId} onComplete={handleComplete} />
                        ) : (
                            <DownloadLink taskId={taskId} result={result} onReset={handleReset} />
                        )}
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="mt-6 md:mt-8 text-center text-sm md:text-base font-medium fade-in" style={{ color: 'var(--text-secondary)' }}>
                    <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                        <span>Supported format: <span style={{ color: 'var(--primary-brand)' }}>PDF</span></span>
                        <span className="w-1 h-1 rounded-full" style={{ background: 'var(--text-secondary)', opacity: 0.5 }}></span>
                        <span>Max size: <span style={{ color: 'var(--primary-brand)' }}>50MB</span></span>
                    </div>
                    <p className="mt-3 md:mt-4 opacity-70">Enterprise-grade security for all your documents</p>
                </div>
            </div>

            {/* Newsletter & Footer Section */}
            <NewsletterFooter />
        </div>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
            </div>
        }>
            <JobsPageContent />
        </Suspense>
    );
}
