'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useCallback, useEffect, useState } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface BoardEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function BoardEditor({ content, onChange }: BoardEditorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto border border-slate-200 shadow-sm',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline decoration-blue-400 underline-offset-4',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none min-h-[400px] p-6 focus:outline-none focus:ring-0',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        event.preventDefault();
                        uploadImage(file);
                        return true;
                    }
                }
                return false;
            },
        },
    });

    const uploadImage = useCallback(async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                editor?.chain().focus().setImage({ src: data.url }).run();
            }
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('이미지 업로드에 실패했습니다.');
        }
    }, [editor]);

    if (!mounted || !editor) return null;

    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition-all">
            {/* Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                >
                    <Bold size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                >
                    <Italic size={18} />
                </MenuButton>
                <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                >
                    <List size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                >
                    <ListOrdered size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                >
                    <Quote size={18} />
                </MenuButton>
                <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
                <button
                    type="button"
                    onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) uploadImage(file);
                        };
                        input.click();
                    }}
                    className="p-2 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all"
                >
                    <ImageIcon size={18} />
                </button>
            </div>

            {/* Editor Area */}
            <EditorContent editor={editor} />
        </div>
    );
}

function MenuButton({ children, onClick, active }: { children: React.ReactNode, onClick: () => void, active?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-2 rounded-lg transition-all ${active ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
        >
            {children}
        </button>
    );
}
