const nextConfig = {
    // Docker 빌드를 위한 standalone 모드 설정
    output: "standalone",
    // 환경 변수가 없을 때 빌드가 실패하지 않도록 처리
    env: {
        DATABASE_URL: process.env.DATABASE_URL || "",
    },
    // 이미지 호스팅 도메인 등 필요한 설정 추가 가능
};

export default nextConfig;
