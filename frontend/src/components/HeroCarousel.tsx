'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Slide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
}

const slides: Slide[] = [
    {
        id: 1,
        image: '/carousel-slide-1.webp',
        title: 'LASA CONSULTANTS & ORGANISATION',
        subtitle: 'Integrated Legal, Business, Strategic, Healthcare, Environmental & Skill Development Advisory',
    },
    {
        id: 2,
        image: '/carousel-slide-22.webp',
        title: 'LASA CONSULTANTS & ORGANISATION',
        subtitle: 'Integrated Legal, Business, Strategic, Healthcare, Environmental & Skill Development Advisory',
    },
    {
        id: 3,
        image: '/carousel-slide-3.webp',
        title: 'LASA CONSULTANTS & ORGANISATION',
        subtitle: 'Integrated Legal, Business, Strategic, Healthcare, Environmental & Skill Development Advisory',
    },
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const router = useRouter();

    // Auto-advance slides every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const handleScheduleConsultation = () => {
        router.push('/consultation');
    };

    return (
        <div className="relative w-full h-[600px] overflow-hidden">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center h-full text-center px-4 pb-24 md:pb-32">
                        <div className="flex-grow flex flex-col justify-center items-center w-full pt-10">
                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
                                {slide.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/95 max-w-3xl font-light">
                                {slide.subtitle}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full relative z-30">
                            <button
                                onClick={handleScheduleConsultation}
                                className="bg-gradient-to-r from-orange-600 to-orange-700 border-2 border-orange-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:from-orange-700 hover:to-orange-800 hover:border-orange-700 transition-all duration-300 shadow-lg"
                            >
                                Schedule Consultation
                            </button>
                            <button
                                onClick={() => router.push('/services')}
                                className="bg-gradient-to-r from-orange-600 to-orange-700 border-2 border-orange-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:from-orange-700 hover:to-orange-800 hover:border-orange-700 transition-all duration-300 shadow-lg"
                            >
                                Explore Our Services
                            </button>
                            <button
                                onClick={() => router.push('/trainings')}
                                className="bg-gradient-to-r from-orange-600 to-orange-700 border-2 border-orange-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:from-orange-700 hover:to-orange-800 hover:border-orange-700 transition-all duration-300 shadow-lg"
                            >
                                Training & Career Programs
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'bg-orange-600 w-8'
                            : 'bg-white/60 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
