"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function getAdminStats() {
    await checkAdmin();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalUsers, todayUsers, totalPosts, todayPosts] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.post.count(),
        prisma.post.count({ where: { createdAt: { gte: startOfToday } } }),
    ]);

    return {
        totalUsers,
        todayUsers,
        totalPosts,
        todayPosts,
    };
}

export async function getRecentUsers() {
    await checkAdmin();

    return await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            email: true,
            name: true,
            nickname: true,
            role: true,
            createdAt: true,
        },
    });
}

export async function getAllUsers() {
    await checkAdmin();

    return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            email: true,
            name: true,
            nickname: true,
            role: true,
            createdAt: true,
        },
    });
}

export async function toggleUserRole(userId: string, currentRole: string) {
    await checkAdmin();

    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole as any },
    });

    revalidatePath("/admin/members");
    return { success: true };
}

export async function deleteUser(userId: string) {
    const session = await checkAdmin();

    if (session.user.id === userId) {
        return { error: "자기 자신을 삭제할 수 없습니다." };
    }

    await prisma.user.delete({
        where: { id: userId },
    });

    revalidatePath("/admin/members");
    return { success: true };
}

export async function getPostsStats() {
    await checkAdmin();

    const posts = await prisma.post.groupBy({
        by: ["category"],
        _count: {
            id: true,
        },
    });

    // Also get all distinct categories from Post table to ensure we have all
    // But categories are strings, so just group is fine.

    return posts.map(p => ({
        category: p.category,
        count: p._count.id,
    }));
}

export async function getPostsWithComments() {
    await checkAdmin();

    return await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { comments: true }
            }
        }
    });
}
