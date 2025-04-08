# 한솔제약 처방전 보관 서비스

한솔제약 처방전 보관 서비스는 약국의 처방전 관리를 효율적으로 도와주는 웹 애플리케이션입니다. 처방전 수거부터 보관, 필요시 검색까지 모든 과정을 체계적으로 관리합니다.

## 주요 기능

- **처방전 수거 요청**: 약국에서 처방전 수거 요청 버튼만 클릭하면 담당자에게 알림톡이 발송됩니다.
- **방문 일정 안내**: 담당자가 알림톡을 통해 방문 예정일을 안내합니다.
- **처방전 박스 관리**: 1박스당 3,000여장의 처방전을 체계적으로 관리합니다.
- **처방전 검색 요청**: 약국에서 환자 정보 입력 후 검색 요청을 하면 담당자가 해당 처방전을 찾아 이미지로 제공합니다.
- **알림톡 시스템**: 모든 과정은 알림톡을 통해 실시간으로 소통합니다.

## 시스템 요구사항

- Node.js v14.0.0 이상
- MongoDB v4.0.0 이상
- 알림톡 서비스 API 키 (실제 운영 시 필요)

## 설치 및 실행 방법

1. 저장소 클론 또는 압축 해제
```bash
git clone https://github.com/hansolpharm/prescription-service.git
cd hansol-pharmacy-service
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
- `.env` 파일을 프로젝트 루트 디렉토리에 생성하고 다음 내용을 입력합니다:
```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/hansol_pharmacy
SESSION_SECRET=hansolpharmsecretkey2025

# 알림톡 서비스 관련 설정 (실제 사용시 적절한 값으로 변경 필요)
ALIMTALK_API_KEY=YOUR_ALIMTALK_API_KEY
ALIMTALK_SENDER_KEY=YOUR_ALIMTALK_SENDER_KEY
ALIMTALK_TEMPLATE_CODE=YOUR_ALIMTALK_TEMPLATE_CODE
```

4. MongoDB 설치 및 실행
- [MongoDB 공식 웹사이트](https://www.mongodb.com/try/download/community)에서 MongoDB 설치
- MongoDB 서비스 시작 (윈도우: 서비스 관리자, 맥/리눅스: mongod 명령어)

5. 초기 데이터 생성
```bash
node setup.js
```

6. 서버 실행
```bash
# 개발 모드로 실행 (nodemon 사용)
npm run dev

# 프로덕션 모드로 실행
npm start
```

7. 웹 브라우저에서 접속
- `http://localhost:3000`으로 접속합니다.

## 로그인 정보

- **약국 로그인**:
  - 이메일: `pharmacy@test.com`
  - 비밀번호: `pharmacy123`

- **관리자 로그인**:
  - 사용자명: `admin`
  - 비밀번호: `admin123`

## 프로젝트 구조

```
hansol-pharmacy-service/
├── config/            # 설정 파일
├── controllers/       # 컨트롤러
├── models/            # 데이터베이스 모델
├── public/            # 정적 파일 (CSS, JS, 이미지 등)
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/       # 처방전 이미지 업로드 폴더
├── routes/            # 라우터
├── views/             # 뷰 템플릿 (EJS)
│   ├── admin/         # 관리자 페이지
│   ├── pharmacy/      # 약국 페이지
│   ├── layouts/       # 레이아웃 템플릿
│   └── partials/      # 부분 템플릿
├── .env               # 환경 변수 (git에 포함하지 않음)
├── app.js             # 애플리케이션 메인 파일
├── setup.js           # 초기 데이터 설정 스크립트
├── package.json       # 프로젝트 정보 및 의존성
└── README.md          # 프로젝트 설명
```

## 사용자 유형 및 접근 방법

1. **약국**
   - 로그인: `/pharmacy-login`
   - 대시보드: `/pharmacy/dashboard`
   - 처방전 수거 요청: `/pharmacy/request-pickup`
   - 처방전 검색 요청: `/pharmacy/search-prescription`
   - 요청 목록: `/pharmacy/requests`

2. **관리자**
   - 로그인: `/admin-login`
   - 대시보드: `/admin/dashboard`
   - 수거 요청 관리: `/admin/pickup-requests`
   - 검색 요청 관리: `/admin/search-requests`
   - 처방전 박스 관리: `/admin/prescription-boxes`
   - 약국 관리: `/admin/pharmacies`

## 기술 스택

- **백엔드**: Node.js, Express.js
- **데이터베이스**: MongoDB, Mongoose
- **프론트엔드**: HTML, CSS, JavaScript, Bootstrap 5
- **템플릿 엔진**: EJS
- **알림 서비스**: 알림톡 API (실제 연동 필요)

## 주의 사항

- 이 애플리케이션은 데모용으로 개발되었으며, 실제 운영 시에는 보안 설정 및 알림톡 API 연동이 필요합니다.
- 현재 구현에서는 실제 DB 연동 없이 임시 데이터를 사용하므로, 실제 운영 시 컨트롤러 코드 수정이 필요합니다.
- 환경 변수와 민감한 정보는 `.env` 파일에 저장하고, 이 파일은 버전 관리에 포함하지 않도록 합니다.
- 처방전 이미지와 관련된 개인정보 처리에 주의하세요. 관련 법규를 준수해야 합니다.

## 추가 개발 및 확장 가능성

1. **실제 DB 연동**: 현재는 임시 데이터를 사용하므로, 실제 MongoDB와 연동하여 CRUD 기능 구현
2. **알림톡 API 연동**: 실제 알림톡 서비스(카카오 비즈메시지 등)와 연동
3. **사용자 인증 강화**: JWT 토큰 기반 인증, OAuth 등 보안 강화
4. **통계 및 리포팅 기능**: 처방전 관리 현황, 박스 보관 통계 등 분석 기능 추가
5. **처방전 OCR 기능**: 이미지 업로드 시 자동 텍스트 인식 기능 추가

## 라이센스

이 프로젝트는 한솔제약헬스케어의 내부 사용을 위한 것으로, 무단 배포 및 사용을 금지합니다.
