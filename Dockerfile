FROM node:18-alpine

# 빌드 도구 설치
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 의존성 먼저 복사 및 설치 (캐시 레이어 활용)
COPY package*.json ./

# 모든 의존성 설치 (devDependencies 포함)
RUN npm install

# 소스 코드 복사
COPY . .

# 환경 변수 설정
ENV NODE_ENV=production

# 시작 스크립트 생성
RUN printf '#!/bin/sh\n\
echo "=== 시스템 정보 ==="\n\
echo "Node.js 버전: $(node -v)"\n\
echo "NPM 버전: $(npm -v)"\n\
echo "작업 디렉토리: $(pwd)"\n\
echo "\n=== 환경 변수 확인 ==="\n\
echo "NODE_ENV: $NODE_ENV"\n\
if [ -z "$MONGODB_URI" ]; then\n\
  echo "경고: MONGODB_URI가 설정되지 않았습니다!"\n\
  echo "Railway 대시보드에서 MONGODB_URI 환경 변수를 설정해주세요."\n\
  exit 1\n\
else\n\
  echo "MONGODB_URI: 설정됨 (보안상 전체 URI는 표시하지 않습니다)"\n\
fi\n\
echo "\n=== 파일 확인 ==="\n\
ls -la\n\
echo "\n=== node_modules 확인 ==="\n\
if [ -d "node_modules" ]; then\n\
  echo "node_modules가 존재합니다."\n\
else\n\
  echo "경고: node_modules가 없습니다. npm install을 실행합니다."\n\
  npm install\n\
fi\n\
echo "\n=== 애플리케이션 시작 ==="\n\
node app.js\n' > /app/start.sh && \
    chmod +x /app/start.sh

# 앱 실행
CMD ["/app/start.sh"] 