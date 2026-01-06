import { ArrowRight, BookOpen, Heart, Upload } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-black/60 z-10" /> {/* Increased overlay opacity for better contrast */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-50" />

        <div className="relative z-20 text-center max-w-4xl px-4 space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            말씀, <span className="text-white border-b-4 border-white/30 pb-2">삶이 되다</span>
          </h1>
          <p className="text-2xl md:text-3xl text-slate-100 font-light max-w-2xl mx-auto leading-relaxed">
            이석재 토마스 데 아퀴나스 신부와 함께하는<br />
            깊이 있는 성경 묵상과 교회사 여행
          </p>
          <div className="pt-8">
            <Link
              href="/homily"
              className="inline-flex items-center px-10 py-4 text-lg rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-lg"
            >
              두돌 소개 <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        {[
          { icon: <BookOpen className="w-10 h-10 text-slate-700" />, title: '매일의 강론', desc: '오늘을 살아가는 지혜와 영성을 전합니다.' },
          { icon: <Upload className="w-10 h-10 text-slate-700" />, title: '자료실', desc: '용량 제한 없이 모든 파일을 공유하세요.' },
          { icon: <Heart className="w-10 h-10 text-slate-700" />, title: '커뮤니티', desc: '신자들과 함께 나누는 따뜻한 이야기.' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 hover:border-slate-400 transition-colors group">
            <div className="mb-6 p-4 bg-slate-50 rounded-xl inline-block group-hover:bg-slate-100 transition-colors">
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
            <p className="text-lg text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
