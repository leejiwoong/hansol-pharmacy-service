const express = require('express');
const router = express.Router();

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

module.exports = router;
