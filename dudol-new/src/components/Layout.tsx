import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Upload } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: '두돌소개', path: '/about' },
        { name: '매일의 강론', path: '/homily' },
        { name: '커뮤니티', path: '/community' },
        { name: '자료실', path: '/dataroom' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                                두돌
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={clsx(
                                        "text-sm font-medium transition-colors duration-200 hover:text-sky-600",
                                        location.pathname === item.path ? "text-sky-600" : "text-slate-600"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-100">
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-sky-600 rounded-md"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
                    <p className="text-sm">© 2026 Dudol. All rights reserved.</p>
                    <p className="text-xs mt-2">이석재 신부 (토마스 데 아퀴나스)</p>
                </div>
            </footer>
        </div>
    );
}
