'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface NavItem {
    name: string;
    path?: string;
    dropdown?: { name: string; path: string }[];
}

export default function NavWrapper() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const pathname = usePathname();

    const navItems: NavItem[] = [
        { name: '두돌소개', path: '/about' },
        { name: '교회사', path: '/church-history' },
        {
            name: '매일의 강론',
            dropdown: [
                { name: '오늘의 강론', path: '/board/daily-homily' },
                { name: '주일/대축일 강론', path: '/board/sunday-homily' },
                { name: '축일/기념일 강론', path: '/homily/feast' },
                { name: '특별강론', path: '/homily/special' },
            ],
        },
        { name: '두돌성경 50주', path: '/bible-50' },
        {
            name: '커뮤니티',
            dropdown: [
                { name: '자유게시판', path: '/board/free-board' },
                { name: '갤러리', path: '/board/gallery' },
                { name: '질문과 답변', path: '/board/qna' },
            ],
        },
    ];

    const dropdownVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: 10, transition: { duration: 0.15 } }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center group">
                        <span className="text-3xl font-extrabold tracking-tight text-[#001f3f] group-hover:text-blue-900 transition-colors">
                            두돌
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative group/item"
                                onMouseEnter={() => setOpenDropdown(item.name)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                {item.path ? (
                                    <Link
                                        href={item.path}
                                        className={cn(
                                            "flex items-center px-5 py-2.5 rounded-full text-[17px] font-semibold transition-all duration-200",
                                            pathname === item.path
                                                ? "text-[#001f3f] bg-slate-50"
                                                : "text-slate-600 hover:text-[#001f3f] hover:bg-slate-50/80"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ) : (
                                    <button
                                        className={cn(
                                            "flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[17px] font-semibold transition-all duration-200 text-slate-600 hover:text-[#001f3f] hover:bg-slate-50/80",
                                            openDropdown === item.name && "text-[#001f3f] bg-slate-50"
                                        )}
                                    >
                                        {item.name}
                                        <ChevronDown size={18} className={cn("transition-transform duration-200", openDropdown === item.name && "rotate-180")} />
                                    </button>
                                )}

                                <AnimatePresence>
                                    {item.dropdown && openDropdown === item.name && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={dropdownVariants}
                                            className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2"
                                        >
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.path}
                                                    href={subItem.path}
                                                    className="block px-6 py-3 text-[16px] font-medium text-slate-600 hover:text-[#001f3f] hover:bg-slate-50 transition-colors"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-50 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-2">
                            {navItems.map((item) => (
                                <div key={item.name} className="space-y-1">
                                    {item.path ? (
                                        <Link
                                            href={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block px-4 py-3 text-lg font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
                                        >
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="px-4 py-3 text-lg font-bold text-slate-400 uppercase tracking-wider text-xs">
                                                {item.name}
                                            </div>
                                            <div className="grid grid-cols-1 gap-1 pl-4">
                                                {item.dropdown?.map((subItem) => (
                                                    <Link
                                                        key={subItem.path}
                                                        href={subItem.path}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
