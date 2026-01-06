import { getTodayVisitorCount } from "@/lib/visitor";

export default async function VisitorCounterDisplay() {
    const count = await getTodayVisitorCount();

    return (
        <div className="text-xs text-slate-400 mt-2">
            <span className="font-semibold">Today's Visits:</span> {count.toLocaleString()}
        </div>
    );
}
