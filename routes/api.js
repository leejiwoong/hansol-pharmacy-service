const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');
const bcrypt = require('bcryptjs');

// 알림톡 엔드포인트들

// 처방전 수거 요청 알림톡 발송
router.post('/alimtalk/pickup-request/:requestId', (req, res) => {
  const { requestId } = req.params;
  
  // 임시 응답 (실제로는 알림톡 API 연동 필요)
  setTimeout(() => {
    res.status(200).json({
      message: '알림톡이 성공적으로 발송되었습니다',
      result: {
        success: true,
        messageId: `msg_${Date.now()}`,
        status: 'sent'
      }
    });
  }, 1000);
});

// 처방전 수거 방문일 확정 알림톡 발송
router.post('/alimtalk/pickup-schedule/:requestId', (req, res) => {
  const { requestId } = req.params;
  
  // 임시 응답 (실제로는 알림톡 API 연동 필요)
  setTimeout(() => {
    res.status(200).json({
      message: '알림톡이 성공적으로 발송되었습니다',
      result: {
        success: true,
        messageId: `msg_${Date.now()}`,
        status: 'sent'
      }
    });
  }, 1000);
});

// 처방전 검색 요청 알림톡 발송
router.post('/alimtalk/search-request/:requestId', (req, res) => {
  const { requestId } = req.params;
  
  // 임시 응답 (실제로는 알림톡 API 연동 필요)
  setTimeout(() => {
    res.status(200).json({
      message: '알림톡이 성공적으로 발송되었습니다',
      result: {
        success: true,
        messageId: `msg_${Date.now()}`,
        status: 'sent'
      }
    });
  }, 1000);
});

// 처방전 검색 결과 알림톡 발송
router.post('/alimtalk/search-result/:requestId', (req, res) => {
  const { requestId } = req.params;
  
  // 임시 응답 (실제로는 알림톡 API 연동 필요)
  setTimeout(() => {
    res.status(200).json({
      message: '알림톡이 성공적으로 발송되었습니다',
      result: {
        success: true,
        messageId: `msg_${Date.now()}`,
        status: 'sent'
      }
    });
  }, 1000);
});

// 알림톡 응답 처리 웹훅 (예상 방문일 입력, 처방전 이미지 업로드 등)
router.post('/alimtalk/webhook', (req, res) => {
  const { requestId, responseType, responseData } = req.body;
  
  // 임시 응답 (실제로는 DB 업데이트 필요)
  if (responseType === 'pickup_date') {
    setTimeout(() => {
      res.status(200).json({
        message: '방문일 정보가 성공적으로 업데이트되었습니다',
        pickupRequest: {
          requestId,
          expectedVisitDate: responseData.date,
          status: 'scheduled',
          updatedAt: new Date()
        }
      });
    }, 1000);
  } else if (responseType === 'prescription_image') {
    setTimeout(() => {
      res.status(200).json({
        message: '처방전 이미지가 성공적으로 등록되었습니다',
        searchRequest: {
          requestId,
          prescriptionImage: responseData.imageUrl,
          status: 'completed',
          responseDate: new Date(),
          updatedAt: new Date()
        }
      });
    }, 1000);
  } else {
    res.status(400).json({ message: '지원하지 않는 응답 유형입니다' });
  }
});

// 약국 회원가입 API 엔드포인트
router.post('/pharmacy/register', async (req, res) => {
  try {
    const { 
      pharmacyName, 
      licenseNumber, 
      address, 
      addressDetail, 
      phoneNumber, 
      email, 
      username, 
      password 
    } = req.body;

    // 필수 필드 검증
    if (!pharmacyName || !address || !phoneNumber || !username || !password) {
      return res.status(400).json({
        success: false,
        message: '필수 항목을 모두 입력해주세요.'
      });
    }

    // 사용자명 중복 확인
    const existingPharmacy = await Pharmacy.findOne({ 
      $or: [
        { email: email },
        { regNumber: licenseNumber }
      ]
    });

    if (existingPharmacy) {
      return res.status(400).json({
        success: false,
        message: '이미 등록된 약국 정보가 있습니다. 이메일 또는 등록번호를 확인해주세요.'
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 새 약국 정보 생성
    const fullAddress = addressDetail ? `${address} ${addressDetail}` : address;
    
    const newPharmacy = new Pharmacy({
      name: pharmacyName,
      address: fullAddress,
      contactPerson: username,
      phoneNumber: phoneNumber,
      email: email || `${username}@example.com`,
      password: hashedPassword,
      regNumber: licenseNumber || `TEMP-${Date.now()}`
    });

    await newPharmacy.save();

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.'
    });
  } catch (error) {
    console.error('약국 회원가입 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원가입 처리 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
