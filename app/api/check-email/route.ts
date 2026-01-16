import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        return NextResponse.json({ exists: !!user });
    } catch (error) {
        console.error("Check email error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
