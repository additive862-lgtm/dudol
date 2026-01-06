import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, author, attachments, category } = body;

        if (!title || !author) {
            return NextResponse.json(
                { error: 'Title and author are required' },
                { status: 400 }
            );
        }

        // Create post with attachments in a single transaction
        const post = await prisma.post.create({
            data: {
                title,
                content,
                author,
                category: category || 'free',
                attachments: {
                    create: attachments?.map((att: any) => ({
                        fileUrl: att.fileUrl,
                        fileName: att.fileName,
                        fileType: att.fileType, // IMAGE, FILE, LINK
                    })) || [],
                },
            },
            include: {
                attachments: true,
            },
        });

        return NextResponse.json({
            message: 'Post created successfully',
            post,
        });

    } catch (error) {
        console.error('Board API error:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
