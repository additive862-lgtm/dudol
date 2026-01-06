import { getBoardPostDetail, getAdjacentPosts } from '@/lib/actions/board';
import { AttachmentList } from '../../../components/board/BoardComponents';
import { CommentSection } from '../../../components/board/CommentSection';
import { SafeHtml } from '../../../components/board/SafeHtml';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { User, Calendar, Eye, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ category: string, id: string }>;
}

export default async function BoardDetailPage({ params }: PageProps) {
    const { category, id: rawId } = await params;
    const id = parseInt(rawId);
    const post = await getBoardPostDetail(id);

    if (!post || post.category !== category) {
        notFound();
    }

    const { prev, next } = await getAdjacentPosts(id, category);

    return (
        <div className="bg-white min-h-screen">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
                    <Link href={`/board/${category}`} className="flex items-center gap-2 text-slate-500 hover:text-[#001f3f] transition-colors font-bold text-sm">
                        <ArrowLeft size={18} />
                        <span>목록으로 돌아가기</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <article className="space-y-8">
                    {/* Post Meta */}
                    <div className="space-y-6">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001f3f] leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-slate-700">
                                <User size={16} />
                                <span>{post.author || '익명'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm', { locale: ko })}</span>
                                </div>
                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                <div className="flex items-center gap-2">
                                    <Eye size={16} />
                                    <span>조회수 {post.views}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Content */}
                    <div className="py-8 min-h-[300px]">
                        <SafeHtml html={post.content || '내용이 없습니다.'} />
                    </div>

                    {/* Attachments */}
                    <AttachmentList attachments={post.attachments} />

                    {/* Prev/Next Navigation */}
                    <div className="mt-12 border-y border-slate-100 divide-y divide-slate-100">
                        {next && (
                            <Link href={`/board/${category}/${next.id}`} className="group flex items-center gap-4 py-5 hover:bg-slate-50 transition-all px-4 -mx-4">
                                <span className="flex items-center gap-2 text-slate-400 font-bold text-sm shrink-0 w-20">
                                    <ChevronUp size={18} />
                                    다음글
                                </span>
                                <span className="text-slate-700 group-hover:text-[#001f3f] font-semibold truncate flex-1">{next.title}</span>
                            </Link>
                        )}
                        {prev && (
                            <Link href={`/board/${category}/${prev.id}`} className="group flex items-center gap-4 py-5 hover:bg-slate-50 transition-all px-4 -mx-4">
                                <span className="flex items-center gap-2 text-slate-400 font-bold text-sm shrink-0 w-20">
                                    <ChevronDown size={18} />
                                    이전글
                                </span>
                                <span className="text-slate-700 group-hover:text-[#001f3f] font-semibold truncate flex-1">{prev.title}</span>
                            </Link>
                        )}
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Comments */}
                    <CommentSection postId={post.id} initialComments={post.comments} />
                </article>
            </div>
        </div>
    );
}
