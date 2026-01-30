'use client';

import React from 'react';
import { CheckCircle, Download, Upload } from 'lucide-react';
import { TaskResult, downloadFile } from '@/lib/api';

interface DownloadLinkProps {
    taskId: string;
    result: TaskResult;
    onReset: () => void;
}

export default function DownloadLink({ taskId, result, onReset }: DownloadLinkProps) {
    const handleDownload = () => {
        downloadFile(taskId);
    };

    return (
        <div className="text-center py-4 md:py-6 success-card">
            <div className="checkmark mb-6 md:mb-8 inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                <CheckCircle size={24} strokeWidth={2} style={{ color: '#22c55e' }} />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4" style={{ color: 'var(--text-primary)' }}>
                Processing Complete!
            </h3>
            <p className="mb-8 md:mb-10 text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
                Your Excel file with extracted data is ready to download
            </p>

            <div className="rounded-xl p-4 md:p-5 mb-6 md:mb-8 max-w-md mx-auto border" style={{ background: 'var(--background)', borderColor: 'var(--border-color)' }}>
                <h4 className="font-bold mb-3 text-base md:text-lg" style={{ color: 'var(--text-primary)' }}>Extracted Data Sheets</h4>
                <ul className="space-y-2 text-left text-sm">
                    <li className="feature-item">
                        <CheckCircle size={16} style={{ color: '#22c55e' }} className="flex-shrink-0" />
                        <span style={{ color: 'var(--text-secondary)' }}>Contract Metadata</span>
                    </li>
                    <li className="feature-item">
                        <CheckCircle size={16} style={{ color: '#22c55e' }} className="flex-shrink-0" />
                        <span style={{ color: 'var(--text-secondary)' }}>Buyer & Organisation Details</span>
                    </li>
                    <li className="feature-item">
                        <CheckCircle size={16} style={{ color: '#22c55e' }} className="flex-shrink-0" />
                        <span style={{ color: 'var(--text-secondary)' }}>Service & Financial Details</span>
                    </li>
                    <li className="feature-item">
                        <CheckCircle size={16} style={{ color: '#22c55e' }} className="flex-shrink-0" />
                        <span style={{ color: 'var(--text-secondary)' }}>Seller / Consignee Details</span>
                    </li>
                </ul>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-semibold">Processed:</span> {result.processed_files} of {result.total_files} files
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm md:text-base"
                    style={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    }}
                >
                    <Download size={18} />
                    Download Excel File
                </button>
                <button
                    onClick={onReset}
                    className="px-5 py-2.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 border text-sm md:text-base"
                    style={{
                        background: 'var(--card-bg)',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-color)'
                    }}
                >
                    <Upload size={18} />
                    Process More Files
                </button>
            </div>
        </div>
    );
}
