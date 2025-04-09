const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// 처방전 이미지 조회 (권한 확인 필요)
router.get('/image/:filename', (req, res) => {
  // 약국 또는 관리자 로그인 확인
  if (!req.session.pharmacy && !req.session.admin) {
    return res.status(401).json({ message: '권한이 없습니다' });
  }
  
  const { filename } = req.params;
  const imagePath = path.join(__dirname, '../public/uploads', filename);
  
  // 파일 존재 확인
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ message: '이미지를 찾을 수 없습니다' });
  }
  
  res.sendFile(imagePath);
});

module.exports = router;
