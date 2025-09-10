import React, { useState } from 'react';
import logo from "../Assets/logo.jpg";

const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-orange-500">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
);

const ShieldAlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-orange-500">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const BellRingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-orange-500">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        <path d="M2 8c0-2.2.7-4.3 2-6" />
        <path d="M22 8a10 10 0 0 0-2-6" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const features = [
        {
            title: "Automated Data Ingestion",
            desc: "Consolidates various data sources like spreadsheets and databases into one unified dashboard.",
            icon: <BarChartIcon />
        },
        {
            title: "Early Risk Detection",
            desc: "Our predictive models flag students at risk of dropping out before it’s too late to make a difference.",
            icon: <ShieldAlertIcon />
        },
        {
            title: "Smart Notifications",
            desc: "Mentors, teachers, and guardians receive timely, actionable alerts to intervene at the most crucial moments.",
            icon: <BellRingIcon />
        },
    ];

    const navLinks = [
        { title: 'Home', href: '#hero' },
        { title: 'Features', href: '#features' },
        { title: 'About', href: '#about' },
        { title: 'Contact', href: '#contact' },
    ];

    return (
        <div className="font-sans bg-amber-50 text-gray-800 min-h-screen antialiased">
            {/* Navbar */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <nav className="container mx-auto px-6 py-5 flex items-center justify-between">
                    {/* Logo */}
                    <div className='cursor-pointer flex items-center'>
                        <img src={logo} alt="EduTrack Logo" className="h-12 w-12 rounded-full object-cover mr-3" />
                        <span className="text-3xl font-bold text-orange-600">EduTrack</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <a key={link.title} href={link.href} className="text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium text-lg">
                                {link.title}
                            </a>
                        ))}
                    </div>

                    {/* Login Button */}
                    <a href="/login" className="hidden md:inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-semibold text-lg hover:bg-orange-600 transition-transform duration-300 hover:scale-105 shadow-md">
                        Login
                    </a>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
                        {isMenuOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white py-4 px-6">
                        {navLinks.map(link => (
                            <a key={link.title} href={link.href} className="block py-2 text-gray-600 hover:text-orange-500" onClick={() => setIsMenuOpen(false)}>
                                {link.title}
                            </a>
                        ))}
                        <a href="/login" className="block w-full text-center mt-4 bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600">
                            Login
                        </a>
                    </div>
                )}
            </header>

            <main>
                {/* Hero Section */}
                <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-orange-100 via-amber-50 to-amber-50 pt-20 pb-24 md:pt-28 md:pb-32">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-amber-900 mb-4 leading-tight">
                                Illuminate the Path to Student Success
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
                                Our predictive analytics platform identifies at-risk students, empowering you to intervene early and effectively. Turn data into decisive action.
                            </p>
                            <div className="flex justify-center md:justify-start gap-4">
                                <a href="#contact" className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg">
                                    Request a Demo
                                </a>
                                <a href="#features" className="bg-white text-orange-500 px-8 py-3 rounded-full font-bold text-lg hover:bg-orange-50 transition-all duration-300 hover:scale-105 shadow-lg border border-orange-200">
                                    Learn More
                                </a>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur-2xl opacity-50"></div>
                            <img
                                src={logo}
                                alt="Dashboard preview showing student analytics"
                                className="relative rounded-2xl shadow-2xl mx-auto transform transition-transform duration-500 hover:scale-105 w-400"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x450/FFEEE0/4B2C1A?text=EduTrack+Dashboard'; }}
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 md:py-28 bg-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Why EduTrack?</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
                            We provide the tools you need to foster a proactive and supportive educational environment.
                        </p>
                        <div className="grid md:grid-cols-3 gap-10">
                            {features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="p-8 rounded-xl bg-amber-50/50 border border-orange-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-md">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold text-amber-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20 md:py-28 bg-amber-50">
                    <div className="container mx-auto px-6 grid md:grid-cols-5 gap-12 items-center">
                        <div className="md:col-span-2">
                            <img src="https://placehold.co/500x500/FFD6A5/4B2C1A?text=Our+Mission" alt="Team working collaboratively" className="rounded-2xl shadow-xl" />
                        </div>
                        <div className="md:col-span-3">
                            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6">Built for Educators, by Innovators</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                EduTrack is a lightweight, transparent, and impactful student
                                monitoring system built for public and private institutes. By merging existing
                                data sources and applying clear, predictive logic, we empower educators with
                                actionable insights to prevent student dropouts.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Our mission is to democratize data analytics in education, making powerful tools accessible and affordable for every institution committed to student success.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact/CTA Section */}
                <section id="contact" className="py-20 md:py-28 bg-white">
                    <div className="container mx-auto px-6 text-center bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl py-16 shadow-lg">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Make a Difference?</h2>
                        <p className="text-lg text-orange-100 max-w-2xl mx-auto mb-8">
                            Join the growing number of institutions transforming their student support systems. Get in touch for a personalized demo today.
                        </p>
                        <a href="#" className="bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all duration-300 hover:scale-105 shadow-md">
                            Schedule Your Free Demo
                        </a>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-amber-100/70 border-t border-orange-200">
                <div className="container mx-auto px-6 py-10 text-center">
                    <p className="text-xl font-bold text-orange-600 mb-4">EduTrack</p>
                    <div className="flex justify-center gap-6 mb-6">
                        {navLinks.map(link => (
                            <a key={link.title} href={link.href} className="text-gray-600 hover:text-orange-500 transition-colors duration-300">
                                {link.title}
                            </a>
                        ))}
                    </div>
                    <p className="text-gray-500">&copy; {new Date().getFullYear()} EduTrack. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;