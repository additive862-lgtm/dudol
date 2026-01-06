"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

/**
 * 오늘 날짜의 방문자 수를 1 증가시킵니다.
 * 이 함수는 Client Component에서 useEffect 등을 통해 호출될 수 있습니다.
 */
export async function incrementVisitorLog() {
    const now = new Date();
    // KST (UTC+9) 기준 날짜 계산을 위해 로직 추가 가능하지만, 
    // 간단히 서버 시간 기준으로 처리하거나 toISOString().split('T')[0] 사용 권장.
    // 여기서는 Date 객체의 로컬 시간 처리에 의존 (서버 타임존이 UTC라면 UTC 기준, KST라면 KST 기준)
    // 명확하게 하려면:
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const today = new Date(kstDate.getFullYear(), kstDate.getMonth(), kstDate.getDate());
    // 주의: prisma에 Date 객체 저장 시 UTC로 변환됨. 날짜 경계가 중요하면 string으로 저장하거나 UTC 기준 00:00으로 맞추는 것이 좋음.
    // 기존 로직 유지 (단순화)

    // UTC 기준 00:00:00으로 정규화 (보편적 방법)
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    try {
        await prisma.visitorLog.upsert({
            where: { date: todayUTC },
            update: { count: { increment: 1 } },
            create: { date: todayUTC, count: 1 },
        });
        revalidatePath("/"); // 카운트 갱신 반영을 위해 홈 경로 재검증
    } catch (error) {
        console.error("Failed to increment visitor log:", error);
    }
}

/**
 * 오늘 날짜의 총 방문자 수를 조회합니다.
 */
export async function getTodayVisitorCount() {
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    try {
        const log = await prisma.visitorLog.findUnique({
            where: { date: todayUTC },
        });
        return log?.count || 0;
    } catch (error) {
        console.error("Failed to get visitor count:", error);
        return 0;
    }
}
