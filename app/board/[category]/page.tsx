import { getBoardPosts } from '@/lib/actions/board';
import { BoardTable, Pagination } from '../../components/board/BoardComponents';
import { BoardGallery } from '../../components/board/BoardGallery';
import Link from 'next/link';
import { PenSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: { category: string };
    searchParams: { page?: string };
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

export default async function BoardCategoryPage({ params, searchParams }: PageProps) {
    const { category } = params;
    const { page } = searchParams;

    const currentPage = parseInt(page || '1');
    const pageSize = category === 'gallery' ? 9 : 10;

    const { posts, totalCount } = await getBoardPosts(category, currentPage, pageSize);
    const title = CATEGORY_MAP[category] || '게시판';
    const isGallery = category === 'gallery';

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-slate-50 py-16 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex justify-between items-end">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-extrabold text-[#001f3f] tracking-tight">{title}</h1>
                            <p className="text-lg text-slate-500 font-medium">유익한 정보와 소식을 나누는 공간입니다.</p>
                        </div>
                        <Link
                            href={`/board/${category}/write`}
                            className="flex items-center gap-2 px-6 py-3.5 bg-[#001f3f] text-white rounded-2xl hover:bg-blue-900 transition-all font-bold shadow-xl shadow-slate-200"
                        >
                            <PenSquare size={20} />
                            <span>글쓰기</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {isGallery ? (
                    <BoardGallery posts={posts as any} category={category} />
                ) : (
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                        <BoardTable
                            posts={posts}
                            totalCount={totalCount}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            category={category}
                        />
                    </div>
                )}

                <Pagination
                    totalCount={totalCount}
                    currentPage={currentPage}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
}
