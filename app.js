const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');

// 환경 변수 로드
dotenv.config();

// 라우터 임포트
const indexRouter = require('./routes/index');
const pharmacyRouter = require('./routes/pharmacy');
const adminRouter = require('./routes/admin');
const prescriptionRouter = require('./routes/prescription');
const apiRouter = require('./routes/api');

// Express 앱 초기화
const app = express();

// 데이터베이스 연결
const connectDB = async () => {
  try {
    console.log('=== MongoDB 연결 시도 ===');
    
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI 환경 변수가 설정되지 않았습니다!');
      console.error('Railway 대시보드에서 환경 변수를 확인해주세요.');
      process.exit(1);
    }

    console.log('MongoDB URI 확인:', process.env.MONGODB_URI.substring(0, 20) + '...');
    console.log('연결 시도 중...');

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10초 타임아웃
      heartbeatFrequencyMS: 2000 // 하트비트 주기
    });

    console.log('MongoDB 연결 성공!');
    
    // 연결 이벤트 리스너 추가
    mongoose.connection.on('error', err => {
      console.error('MongoDB 에러 발생:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB 연결이 끊어졌습니다. 재연결 시도...');
      setTimeout(connectDB, 5000); // 5초 후 재연결 시도
    });

  } catch (err) {
    console.error('MongoDB 연결 실패:', err.message);
    console.error('상세 에러:', err);
    process.exit(1);
  }
};

// 데이터베이스 연결 실행
connectDB();

// 뷰 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// 미들웨어 설정
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'hansolpharmsecretkey2025',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // HTTPS 사용 시 true로 변경
}));

// 라우터 설정
app.use('/', indexRouter);
app.use('/pharmacy', pharmacyRouter);
app.use('/admin', adminRouter);
app.use('/prescription', prescriptionRouter);
app.use('/api', apiRouter);

// 404 에러 핸들러
app.use((req, res, next) => {
  res.status(404).render('error', {
    message: '페이지를 찾을 수 없습니다',
    error: { status: 404 }
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('에러 발생:', err);
  console.error('에러 메시지:', err.message);
  console.error('에러 스택:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : '서버 에러가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
})
.on('error', (err) => {
  console.error('서버 시작 실패:', err);
  process.exit(1);
});

// 프로세스 종료 처리
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호를 받았습니다. 서버를 종료합니다.');
  server.close(() => {
    console.log('서버가 종료되었습니다.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB 연결이 종료되었습니다.');
      process.exit(0);
    });
  });
});

process.on('uncaughtException', (err) => {
  console.error('처리되지 않은 예외 발생:', err);
  server.close(() => {
    console.log('서버를 종료합니다.');
    process.exit(1);
  });
});

module.exports = app;
