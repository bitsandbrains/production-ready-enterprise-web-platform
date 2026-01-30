'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
    onUploadComplete: (taskId: string) => void;
}

export default function FileUploader({ onUploadComplete }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const validateAndAddFiles = (newFiles: File[]) => {
        const validPdfFiles: File[] = [];
        let errorMsg = null;

        for (const file of newFiles) {
            if (file.type !== 'application/pdf') {
                errorMsg = 'Only PDF files are allowed';
                continue;
            }
            if (file.size > 50 * 1024 * 1024) {
                errorMsg = `File ${file.name} exceeds 50MB limit`;
                continue;
            }
            // Check for duplicates
            if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                continue;
            }
            validPdfFiles.push(file);
        }

        if (selectedFiles.length + validPdfFiles.length > 5) {
            errorMsg = 'You can upload a maximum of 5 files';
            // Add only as many as allowed
            const remainingSlots = 5 - selectedFiles.length;
            if (remainingSlots > 0) {
                setSelectedFiles(prev => [...prev, ...validPdfFiles.slice(0, remainingSlots)]);
            }
            setError(errorMsg);
        } else {
            if (validPdfFiles.length > 0) {
                setSelectedFiles(prev => [...prev, ...validPdfFiles]);
                setError(null);
            } else if (errorMsg) {
                setError(errorMsg);
            }
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        validateAndAddFiles(files);
    }, [selectedFiles]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            validateAndAddFiles(Array.from(files));
        }
    }, [selectedFiles]);

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setError(null);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            onUploadComplete(data.task_id);
        } catch (err) {
            setError('Failed to upload files. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Drop Zone */}
            {selectedFiles.length < 5 && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-2xl p-4 md:p-6 text-center transition-all duration-300 group
                        ${isDragging
                            ? 'border-yellow-600 bg-yellow-50/10'
                            : 'border-slate-300 dark:border-slate-700 hover:border-yellow-600/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                        }
                    `}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    <div className={`
                        mx-auto mb-2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
                        ${isDragging ? 'bg-yellow-600 text-white scale-110 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-yellow-600 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/20'}
                    `}>
                        <Upload size={28} className={isDragging ? 'animate-bounce' : ''} />
                    </div>

                    <h3 className="text-2xl font-bold mb-1 transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>
                        {isDragging ? 'Drop your PDF here' : 'Select PDF Contracts'}
                    </h3>

                    <p className="text-lg max-w-sm mx-auto mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                        Drag and drop your files here, or <span className="text-primary-600 dark:text-primary-400 font-bold underline decoration-2 underline-offset-4">click to browse</span>
                    </p>

                    <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-secondary)' }}>
                        <span>PDF</span>
                        <span className="w-1 h-1 bg-current rounded-full"></span>
                        <span>MAX 50MB</span>
                        <span className="w-1 h-1 bg-current rounded-full"></span>
                        <span>UP TO 5 FILES</span>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-shake">
                    <div className="bg-red-100 dark:bg-red-800 p-1.5 rounded-full">
                        <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                    </div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-2">
                        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                            Selected Files ({selectedFiles.length}/5)
                        </span>
                    </div>

                    {selectedFiles.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between p-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 rounded-xl slide-up relative group">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="bg-primary-100 dark:bg-primary-800 p-2 rounded-lg flex-shrink-0">
                                    <FileCheck className="text-primary-600 dark:text-primary-400" size={24} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-base truncate" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                                    <p className="text-xs font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            {!isUploading && (
                                <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="text-sm bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-slate-200 dark:border-slate-700 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {selectedFiles.length > 0 && (
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`
                        w-full py-4 rounded-xl font-black text-lg tracking-widest uppercase transition-all duration-500 relative overflow-hidden group
                        ${isUploading
                            ? 'bg-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 hover:shadow-[0_0_30px_rgba(128,0,32,0.4)] active:scale-[0.98]'
                        }
                        text-white shadow-xl
                    `}
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Processing {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}...
                            </>
                        ) : (
                            <>
                                Begin Analysis
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </>
                        )}
                    </span>
                    {!isUploading && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/0 via-yellow-600/20 to-yellow-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    )}
                </button>
            )}
        </div>
    );
}
