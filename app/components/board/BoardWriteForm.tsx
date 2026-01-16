'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Paperclip, Plus, X, Globe, Save, RotateCcw } from 'lucide-react';

const BoardEditor = dynamic(() => import('./BoardEditor').then(mod => mod.BoardEditor), {
    ssr: false,
    loading: () => <div className="min-h-[500px] bg-slate-50 animate-pulse rounded-[2rem]" />
});

interface FileAttachment {
    fileUrl: string;
    fileName: string;
    fileType: 'IMAGE' | 'FILE';
}

interface ExternalLink {
    fileUrl: string;
    fileName: string;
    fileType: 'LINK';
}

export function BoardWriteForm({ category }: { category: string }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<FileAttachment[]>([]);
    const [links, setLinks] = useState<ExternalLink[]>([]);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkName, setLinkName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (session?.user?.name) {
            setAuthor(session.user.name);
        } else if (status === 'unauthenticated') {
            setAuthor('');
        }
    }, [session, status]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (data.url) {
                    setAttachments(prev => [...prev, {
                        fileUrl: data.url,
                        fileName: data.originalName,
                        fileType: data.type as 'IMAGE' | 'FILE',
                    }]);
                }
            } catch (error) {
                console.error('File upload failed:', error);
            }
        }
    };

    const addLink = () => {
        if (!linkUrl || !linkName) return;
        setLinks(prev => [...prev, {
            fileUrl: linkUrl,
            fileName: linkName,
            fileType: 'LINK'
        }]);
        setLinkUrl('');
        setLinkName('');
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const removeLink = (index: number) => {
        setLinks(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !author) {
            alert('제목과 작성자를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/board', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    author,
                    content,
                    category,
                    attachments: [...attachments, ...links],
                }),
            });

            if (res.ok) {
                router.push(`/board/${category}`);
                router.refresh();
            } else {
                throw new Error('Failed to save post');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('글 저장에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Title & Author */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="글 제목을 입력하세요"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">작성자</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder={status === 'unauthenticated' ? '로그인이 필요합니다' : '작성자 명'}
                        className={`w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${status === 'authenticated' ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                        required
                        readOnly={status === 'authenticated'}
                    />
                </div>
            </div>

            {/* Editor */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">본문</label>
                <BoardEditor content={content} onChange={setContent} />
            </div>

            {/* Files & Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                {/* File Upload */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Paperclip size={18} />
                            파일 첨부
                        </label>
                        <button
                            type="button"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <Plus size={14} />
                            파일 추가
                        </button>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    <div className="min-h-[100px] border-2 border-dashed border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                        {attachments.length === 0 ? (
                            <p className="text-slate-400 text-xs text-center py-8">첨부된 파일이 없습니다.</p>
                        ) : (
                            <div className="space-y-2">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                        <span className="truncate max-w-[200px] text-slate-700 font-medium">{file.fileName}</span>
                                        <button type="button" onClick={() => removeAttachment(idx)} className="text-slate-400 hover:text-rose-500">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* External Links */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Globe size={18} />
                        외부 링크
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="링크 제목"
                            value={linkName}
                            onChange={(e) => setLinkName(e.target.value)}
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <input
                            type="url"
                            placeholder="https://..."
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <button
                            type="button"
                            onClick={addLink}
                            className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="min-h-[100px] border-2 border-dashed border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                        {links.length === 0 ? (
                            <p className="text-slate-400 text-xs text-center py-8">등록된 링크가 없습니다.</p>
                        ) : (
                            <div className="space-y-2">
                                {links.map((link, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{link.fileName}</span>
                                            <span className="text-xs text-slate-500 truncate max-w-[150px]">{link.fileUrl}</span>
                                        </div>
                                        <button type="button" onClick={() => removeLink(idx)} className="text-slate-400 hover:text-rose-500">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-10">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-8 py-4 border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-bold"
                >
                    <RotateCcw size={20} />
                    취소
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 disabled:bg-slate-300 transition-all font-bold shadow-xl shadow-slate-200"
                >
                    <Save size={20} />
                    {isSubmitting ? '저장 중...' : '게시글 등록'}
                </button>
            </div>
        </form>
    );
}
