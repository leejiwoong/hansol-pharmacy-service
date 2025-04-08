const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 테스트 데이터 가져오기
let testData;
try {
  testData = require('../test-data-generator');
} catch (error) {
  console.error('테스트 데이터 로드 실패:', error);
  testData = {
    pickupRequests: [],
    searchRequests: []
  };
}

// 미들웨어: 약국 로그인 확인
const checkPharmacyAuth = (req, res, next) => {
  if (!req.session.pharmacy) {
    return res.redirect('/pharmacy-login');
  }
  next();
};

// 약국 로그인 처리
router.post('/login', authController.pharmacyLogin);

// 약국 로그아웃
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// 대시보드 페이지 (로그인 필요)
router.get('/dashboard', checkPharmacyAuth, (req, res) => {
  res.render('pharmacy/dashboard', { 
    title: '약국 대시보드 - 한솔제약 처방전 보관 서비스',
    pharmacy: req.session.pharmacy
  });
});

// 처방전 수거 요청 페이지 (로그인 필요)
router.get('/request-pickup', checkPharmacyAuth, (req, res) => {
  res.render('pharmacy/request-pickup', { 
    title: '처방전 수거 요청 - 한솔제약 처방전 보관 서비스',
    pharmacy: req.session.pharmacy
  });
});

// 처방전 수거 요청 처리
router.post('/request-pickup', checkPharmacyAuth, (req, res) => {
  // 임시 요청 처리 (실제로는 DB에 저장 필요)
  const { notes } = req.body;
  
  // 모의 응답
  setTimeout(() => {
    res.status(201).json({ 
      message: '처방전 수거 요청이 성공적으로 접수되었습니다', 
      requestId: Date.now().toString()
    });
  }, 1000);
});

// 처방전 검색 요청 페이지 (로그인 필요)
router.get('/search-prescription', checkPharmacyAuth, (req, res) => {
  res.render('pharmacy/search-prescription', { 
    title: '처방전 검색 요청 - 한솔제약 처방전 보관 서비스',
    pharmacy: req.session.pharmacy
  });
});

// 처방전 검색 요청 처리
router.post('/search-prescription', checkPharmacyAuth, (req, res) => {
  // 임시 요청 처리 (실제로는 DB에 저장 필요)
  const { patientName, patientId, prescriptionDate, notes } = req.body;
  
  // 모의 응답
  setTimeout(() => {
    res.status(201).json({ 
      message: '처방전 검색 요청이 성공적으로 접수되었습니다', 
      requestId: Date.now().toString()
    });
  }, 1000);
});

// 요청 목록 페이지 (로그인 필요)
router.get('/requests', checkPharmacyAuth, (req, res) => {
  res.render('pharmacy/requests', { 
    title: '요청 목록 - 한솔제약 처방전 보관 서비스',
    pharmacy: req.session.pharmacy
  });
});

// 요청 목록 데이터 조회 API
router.get('/api/requests', checkPharmacyAuth, (req, res) => {
  // 테스트 데이터 사용
  const pickupRequests = testData.pickupRequests.filter(req => req.pharmacy === req.session.pharmacy.id);
  const searchRequests = testData.searchRequests.filter(req => req.pharmacy === req.session.pharmacy.id);
  
  // 응답
  res.status(200).json({
    pickupRequests,
    searchRequests
  });
});

// 요청 상세 페이지 (로그인 필요)
router.get('/requests/:requestId', checkPharmacyAuth, (req, res) => {
  const { requestId } = req.params;
  const { type } = req.query; // pickup 또는 search
  
  res.render('pharmacy/request-detail', { 
    title: '요청 상세 정보 - 한솔제약 처방전 보관 서비스',
    pharmacy: req.session.pharmacy,
    requestId,
    requestType: type
  });
});

// 약국 로그인 페이지
router.get('/login', (req, res) => {
  res.render('pharmacy/login', { title: '약국 로그인' });
});

// 약국 회원가입 페이지
router.get('/register', (req, res) => {
  res.render('pharmacy/register', { title: '약국 회원가입' });
});

// 약국 회원가입 처리
router.post('/register', async (req, res) => {
  try {
    // 회원가입 로직 구현
    res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
