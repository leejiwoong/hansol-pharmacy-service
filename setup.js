const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 데이터베이스 연결
mongoose.connect('mongodb://127.0.0.1:27017/hansol_pharmacy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => console.log('MongoDB에 연결되었습니다.'))
.catch(err => {
  console.error('MongoDB 연결 에러:', err);
  process.exit(1);
});

// 관리자 모델 스키마 정의
const adminSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  role: String,
  phoneNumber: String,
  createdAt: Date,
  updatedAt: Date
});
const Admin = mongoose.model('Admin', adminSchema);

// 약국 모델 스키마 정의
const pharmacySchema = new mongoose.Schema({
  name: String,
  address: String,
  contactPerson: String,
  phoneNumber: String,
  email: String,
  password: String,
  regNumber: String,
  createdAt: Date,
  updatedAt: Date
});
const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

// 초기 데이터 생성 함수
async function createInitialData() {
  try {
    // bcrypt로 비밀번호 해싱
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const pharmacyPasswordHash = await bcrypt.hash('pharmacy123', 10);
    
    // 관리자 계정 생성
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const admin = new Admin({
        username: 'admin',
        name: '관리자',
        email: 'admin@hansolpharm.com',
        password: adminPasswordHash,
        role: 'admin',
        phoneNumber: '010-1234-5678',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await admin.save();
      console.log('관리자 계정이 생성되었습니다.');
    } else {
      console.log('관리자 계정이 이미 존재합니다.');
    }
    
    // 테스트 약국 계정 생성
    const pharmacyExists = await Pharmacy.findOne({ email: 'pharmacy@test.com' });
    if (!pharmacyExists) {
      const pharmacy = new Pharmacy({
        name: '테스트약국',
        address: '서울특별시 강남구 테헤란로 123',
        contactPerson: '김약사',
        phoneNumber: '02-123-4567',
        email: 'pharmacy@test.com',
        password: pharmacyPasswordHash,
        regNumber: '12345678',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await pharmacy.save();
      console.log('테스트 약국 계정이 생성되었습니다.');
    } else {
      console.log('테스트 약국 계정이 이미 존재합니다.');
    }
    
    console.log('초기 데이터 설정이 완료되었습니다.');
    mongoose.connection.close();
  } catch (error) {
    console.error('초기 데이터 생성 중 오류 발생:', error);
    mongoose.connection.close();
  }
}

// 함수 실행
createInitialData();
