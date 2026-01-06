'use client';

import { use } from 'react';
import dynamic from 'next/dynamic';

const BoardWriteForm = dynamic(
    () => import('../../../components/board/BoardWriteForm').then(mod => mod.BoardWriteForm),
    { ssr: false }
);

interface PageProps {
    params: Promise<{ category: string }>;
}

const CATEGORY_MAP: Record<string, string> = {
    'daily-homily': '오늘의 강론',
    'sunday-homily': '주일/대축일 강론',
    'feast-homily': '축일/기념일 강론',
    'special-homily': '특별강론',
    'church-history': '교회사',
    'bible-50': '두돌성경 50주',
    'free-board': '자유게시판',
    'gallery': '갤러리',
    'qna': '질문과 답변',
};

export default function BoardWritePage({ params }: PageProps) {
    const { category } = use(params);
    const title = CATEGORY_MAP[category] || '게시판';

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-slate-50 py-16 border-b border-slate-100 mb-12">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl font-extrabold text-[#001f3f] tracking-tight">{title} 글쓰기</h1>
                    <p className="text-lg text-slate-500 font-medium mt-2">새로운 소중한 글을 들려주세요.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pb-24 min-h-[600px]">
                <BoardWriteForm category={category} />
            </div>
        </div>
    );
}
