'use server';

import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: { title: string; content: string; author: string }) {
    try {
        const post = await prisma.post.create({
            data: {
                title: formData.title,
                content: formData.content,
                author: formData.author,
            },
        });
        revalidatePath('/homily');
        return { success: true, post };
    } catch (error) {
        console.error('Failed to create post:', error);
        return { success: false, error: '글 게시 중 요류가 발생했습니다.' };
    }
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return posts;
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return [];
    }
}

export async function getPostById(id: number) {
    try {
        const post = await prisma.post.findUnique({
            where: { id },
        });
        return post;
    } catch (error) {
        console.error('Failed to fetch post:', error);
        return null;
    }
}

export async function incrementViews(id: number) {
    try {
        await prisma.post.update({
            where: { id },
            data: {
                views: {
                    increment: 1,
                },
            },
        });
    } catch (error) {
        console.error('Failed to increment views:', error);
    }
}
