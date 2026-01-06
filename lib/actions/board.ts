'use server';

import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';

export async function getBoardPosts(category: string, page: number = 1, pageSize: number = 10) {
    try {
        const skip = (page - 1) * pageSize;
        const [posts, totalCount] = await Promise.all([
            prisma.post.findMany({
                where: { category },
                skip,
                take: pageSize,
                include: {
                    attachments: true,
                    _count: {
                        select: { comments: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.post.count({ where: { category } }),
        ]);

        return { posts, totalCount };
    } catch (error) {
        console.error('Failed to fetch board posts:', error);
        return { posts: [], totalCount: 0 };
    }
}

export async function getBoardPostDetail(id: number) {
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                comments: {
                    orderBy: { createdAt: 'asc' }
                },
                attachments: true,
                _count: {
                    select: { comments: true }
                }
            },
        });
        return post;
    } catch (error) {
        console.error('Failed to fetch post detail:', error);
        return null;
    }
}

export async function getAdjacentPosts(currentId: number, category: string) {
    try {
        const currentPost = await prisma.post.findUnique({
            where: { id: currentId },
            select: { createdAt: true }
        });

        if (!currentPost) return { prev: null, next: null };

        const [prev, next] = await Promise.all([
            prisma.post.findFirst({
                where: {
                    category,
                    createdAt: { lt: currentPost.createdAt }
                },
                orderBy: { createdAt: 'desc' },
                select: { id: true, title: true }
            }),
            prisma.post.findFirst({
                where: {
                    category,
                    createdAt: { gt: currentPost.createdAt }
                },
                orderBy: { createdAt: 'asc' },
                select: { id: true, title: true }
            })
        ]);

        return { prev, next };
    } catch (error) {
        console.error('Failed to fetch adjacent posts:', error);
        return { prev: null, next: null };
    }
}

export async function createComment(postId: number, author: string, content: string) {
    try {
        const comment = await prisma.comment.create({
            data: {
                postId,
                author,
                content,
            },
            include: {
                post: {
                    select: { category: true }
                }
            }
        });
        revalidatePath(`/board/${comment.post.category}/${postId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to create comment:', error);
        return { success: false, error: '댓글 등록 중 오류가 발생했습니다.' };
    }
}
