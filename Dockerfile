FROM node:18-alpine

WORKDIR /app

# 의존성 먼저 복사 및 설치 (캐시 레이어 활용)
COPY package*.json ./
RUN npm ci --omit=dev

# 소스 코드 복사
COPY . .

# 환경 변수 설정
ENV NODE_ENV=production

# 앱 실행
CMD ["npm", "start"] 