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
RUN printf '#!/bin/sh\necho "Checking environment variables:"\necho "MONGODB_URI: $MONGODB_URI"\necho "Starting application..."\nnpm start\n' > /app/start.sh && \
    chmod +x /app/start.sh

# 앱 실행
CMD ["/app/start.sh"] 