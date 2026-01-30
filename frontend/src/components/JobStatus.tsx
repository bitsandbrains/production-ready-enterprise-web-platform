'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { checkTaskStatus as getTaskStatus, TaskResult as TaskStatusType } from '@/lib/api';

interface JobStatusProps {
    taskId: string;
    onComplete: (result: TaskStatusType['result']) => void;
}

export default function JobStatus({ taskId, onComplete }: JobStatusProps) {
    const [progress, setProgress] = useState(10);
    const [status, setStatus] = useState<TaskStatusType | null>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Simulate progress for better UX
        setProgress(10);
        progressInterval.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
            });
        }, 1000);

        // Start polling task status
        const pollStatus = async () => {
            try {
                const taskStatus = await getTaskStatus(taskId);
                setStatus(taskStatus);

                if (taskStatus.status === 'completed' && taskStatus.result) {
                    // Clear intervals
                    if (progressInterval.current) clearInterval(progressInterval.current);
                    if (pollingInterval.current) clearInterval(pollingInterval.current);

                    setProgress(100);
                    onComplete(taskStatus.result);
                } else if (taskStatus.status === 'failed') {
                    // Clear intervals
                    if (progressInterval.current) clearInterval(progressInterval.current);
                    if (pollingInterval.current) clearInterval(pollingInterval.current);

                    throw new Error('Processing failed');
                }
            } catch (error) {
                console.error('Status polling error:', error);
            }
        };

        // Initial poll
        pollStatus();

        // Set up polling every 2 seconds
        pollingInterval.current = setInterval(pollStatus, 2000);

        // Cleanup on unmount
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, [taskId, onComplete]);

    return (
        <div className="text-center py-8 md:py-12 fade-in">
            <div className="mb-6">
                <Loader2 className="spinner mx-auto" size={56} strokeWidth={2} style={{ color: 'var(--primary-brand)' }} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Processing Your PDFs...
            </h3>
            <p className="mb-6 text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
                Extracting contract data and generating Excel file
            </p>
            <div className="w-full rounded-full h-3 md:h-4 max-w-md mx-auto overflow-hidden shadow-inner" style={{ background: 'var(--background)' }}>
                <div
                    className="progress-bar h-3 md:h-4 rounded-full transition-all duration-500 ease-out"
                    style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, var(--primary-brand), #f59e0b)'
                    }}
                />
            </div>
            <p className="text-sm md:text-base font-semibold mt-3" style={{ color: 'var(--primary-brand)' }}>
                {Math.round(progress)}% complete
            </p>
        </div>
    );
}
