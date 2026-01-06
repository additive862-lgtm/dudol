/** @type {import('next').NextConfig} */
const nextConfig = {
    // 환경 변수가 없을 때 빌드가 실패하지 않도록 처리
    env: {
        DATABASE_URL: process.env.DATABASE_URL || "",
    },
    // 이미지 호스팅 도메인 등 필요한 설정 추가 가능
};

export default nextConfig;
