import { redirect } from 'next/navigation';

interface PageProps {
    params: { id: string };
}

export default async function HomilyDetailRedirect({ params }: PageProps) {
    const { id } = params;
    redirect(`/board/daily-homily/${id}`);
}
