import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">시스템 설정</h2>
                <p className="text-muted-foreground">사이트 전반의 설정을 관리합니다.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>공지사항 설정</CardTitle>
                    <CardDescription>메인 페이지 공지사항을 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">준비 중인 기능입니다...</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>보안 설정</CardTitle>
                    <CardDescription>IP 차단 및 스팸 필터링 설정을 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">준비 중인 기능입니다...</p>
                </CardContent>
            </Card>
        </div>
    );
}
