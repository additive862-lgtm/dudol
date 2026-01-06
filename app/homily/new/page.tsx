import { redirect } from 'next/navigation';

export default function HomilyNewRedirect() {
    redirect('/board/daily-homily/write');
}
