import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password, phoneNumber } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "필수 정보(이름, 이메일, 비밀번호)가 누락되었습니다." },
                { status: 400 }
            );
        }

        // 이메일 중복 확인
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "이미 가입된 이메일입니다." },
                { status: 409 }
            );
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 12);

        // 유저 생성
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                // role은 스키마 기본값(USER) 사용
            },
        });

        // 민감한 정보 제외하고 응답
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            { message: "회원가입이 완료되었습니다.", user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "회원가입 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
