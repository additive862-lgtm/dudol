"use client";

import { useEffect, useRef } from "react";
import { incrementVisitorLog } from "@/lib/visitor";

export default function VisitorTracker() {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;

            // 오늘 날짜(UTC 기준) 구하기
            const today = new Date().toISOString().split('T')[0];
            const STORAGE_KEY = 'dudol_visitor_date';

            // 로컬 스토리지에서 마지막 방문 날짜 확인
            const lastVisitDate = localStorage.getItem(STORAGE_KEY);

            // 오늘 처음 방문인 경우에만 카운트 증가
            if (lastVisitDate !== today) {
                incrementVisitorLog();
                localStorage.setItem(STORAGE_KEY, today);
            }
        }
    }, []);

    return null; // UI를 렌더링하지 않음
}
