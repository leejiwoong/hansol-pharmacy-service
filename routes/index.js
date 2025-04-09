const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 메인 페이지
router.get('/', (req, res) => {
  res.render('index', { 
    title: '한솔제약 처방전 보관 서비스'
  });
});

// 약국 로그인 페이지
router.get('/pharmacy-login', (req, res) => {
  // 이미 로그인한 경우 리다이렉트
  if (req.session && req.session.pharmacy) {
    return res.redirect('/pharmacy/dashboard');
  }
  
  res.render('pharmacy/login', { 
    title: '약국 로그인 - 한솔제약 처방전 보관 서비스',
    error: null
  });
});

// 관리자 로그인 페이지
router.get('/admin-login', (req, res) => {
  // 이미 로그인한 경우 리다이렉트
  if (req.session && req.session.admin) {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/login', { 
    title: '관리자 로그인 - 한솔제약 처방전 보관 서비스', 
    error: null
  });
});

// 로그아웃
router.get('/logout', authController.logout);

module.exports = router;
