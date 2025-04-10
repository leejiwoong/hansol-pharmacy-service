// 로그인 및 인증 컨트롤러
<<<<<<< HEAD
const Pharmacy = require('../models/Pharmacy');
const bcrypt = require('bcrypt');

// 약국 로그인 처리
exports.pharmacyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // DB에서 약국 정보 조회
    const pharmacy = await Pharmacy.findOne({ email });
    
    if (!pharmacy) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다' });
    }
    
    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, pharmacy.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다' });
    }
    
    // 세션에 약국 정보 저장
    req.session.pharmacy = {
      id: pharmacy._id,
      name: pharmacy.name,
      email: pharmacy.email
    };
    
    return res.json({ 
      message: '로그인 성공', 
      pharmacy: { 
        id: pharmacy._id, 
        name: pharmacy.name 
      } 
    });
=======

// 약국 로그인 처리
exports.pharmacyLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 임시 테스트 계정 - 실제로는 DB 조회 필요
    if (email === 'pharmacy@test.com' && password === 'pharmacy123') {
      req.session.pharmacy = {
        id: '1',
        name: '테스트약국',
        email: email
      };
      return res.json({ message: '로그인 성공', pharmacy: { id: '1', name: '테스트약국' } });
    }
    
    res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다' });
>>>>>>> b9f0456ea9b916259dea87bf012ef00d8822bc40
  } catch (error) {
    console.error('약국 로그인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 관리자 로그인 처리
exports.adminLogin = (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 임시 테스트 계정 - 실제로는 DB 조회 필요
    if (username === 'admin' && password === 'admin123') {
      req.session.admin = {
        id: '1',
        username: username,
        name: '관리자',
        role: 'admin'
      };
      return res.json({ message: '로그인 성공', admin: { id: '1', name: '관리자', role: 'admin' } });
    }
    
    res.status(401).json({ message: '사용자명 또는 비밀번호가 일치하지 않습니다' });
  } catch (error) {
    console.error('관리자 로그인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 로그아웃 처리
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('로그아웃 오류:', err);
    }
    res.redirect('/');
  });
};
