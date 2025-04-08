const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 미들웨어: 관리자 로그인 확인
const checkAdminAuth = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect('/admin-login');
  }
  next();
};

// 관리자 로그인 처리
router.post('/login', authController.adminLogin);

// 관리자 로그아웃
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// 관리자 대시보드 페이지 (로그인 필요)
router.get('/dashboard', checkAdminAuth, (req, res) => {
  res.render('admin/dashboard', { 
    title: '관리자 대시보드 - 한솔제약 처방전 보관 서비스',
    admin: req.session.admin
  });
});

module.exports = router;
