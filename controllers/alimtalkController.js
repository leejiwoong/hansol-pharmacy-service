const axios = require('axios');
const PickupRequest = require('../models/PickupRequest');
const PrescriptionSearchRequest = require('../models/PrescriptionSearchRequest');
const Pharmacy = require('../models/Pharmacy');
const Admin = require('../models/Admin');

// 알림톡 발송 함수
const sendAlimTalk = async (phoneNumber, templateCode, variables) => {
  try {
    // 알림톡 API 설정 (실제 구현 시 외부 API 연동 필요)
    const apiKey = process.env.ALIMTALK_API_KEY;
    const senderKey = process.env.ALIMTALK_SENDER_KEY;
    
    // 메시지 데이터 생성
    const messageData = {
      senderKey,
      templateCode,
      phoneNumber,
      variables
    };
    
    // 알림톡 API 호출 (예시)
    // const response = await axios.post('https://alimtalk-api.example.com/send', messageData, {
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // 테스트용 로그
    console.log('알림톡 발송 요청:', messageData);
    
    // 실제 API 연동 전 성공 응답 반환
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      status: 'sent'
    };
  } catch (error) {
    console.error('알림톡 발송 오류:', error);
    throw error;
  }
};

// 처방전 수거 요청 알림톡 발송
exports.sendPickupRequestAlimTalk = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // 수거 요청 정보 조회
    const pickupRequest = await PickupRequest.findById(requestId)
      .populate('pharmacy', 'name address contactPerson phoneNumber');
      
    if (!pickupRequest) {
      return res.status(404).json({ message: '수거 요청을 찾을 수 없습니다' });
    }
    
    // 관리자 정보 조회 (첫 번째 매니저 권한 이상 계정)
    const admin = await Admin.findOne({ role: { $in: ['admin', 'manager'] } });
    if (!admin) {
      return res.status(404).json({ message: '담당 관리자를 찾을 수 없습니다' });
    }
    
    // 알림톡 변수 설정
    const variables = {
      pharmacyName: pickupRequest.pharmacy.name,
      pharmacyAddress: pickupRequest.pharmacy.address,
      requestDate: new Date(pickupRequest.requestDate).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      notes: pickupRequest.notes || '없음'
    };
    
    // 알림톡 발송
    const result = await sendAlimTalk(
      admin.phoneNumber,
      'PRESCRIPTION_PICKUP_REQUEST',
      variables
    );
    
    res.status(200).json({
      message: '알림톡이 성공적으로 발송되었습니다',
      result
    });
  } catch (error) {
    console.error('알림톡 발송 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 처방전 수거 방문일 확정 알림톡 발송
exports.sendPickupScheduleAlimTalk = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // 수거 요청 정보 조회
    const pickupRequest = await PickupRequest.findById(requestId)
      .populate('pharmacy', 'name address contactPerson phoneNumber');
      
    if (!pickupRequest) {
      return res.status(404).json({ message: '수거 요청을 찾을 수 없습니다' });
    }
    
    if (!pickupRequest.expectedVisitDate) {
      return res.status(400).json({ message: '방문 일정이 설정되지 않았습니다' });
    }
    
    // 알림톡 변수 설정
    const variables = {
      pharmacyName: pickupRequest.pharmacy.name,
      visitDate: new Date(pickupRequest.expectedVisitDate).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      staffName: pickupRequest.staffAssigned || '담당자',
      notes: pickupRequest.notes || '없음'
    };
    
    // 알림톡 발송
    const result = await sendAlimTalk(
      pickupRequest.pharmacy.phoneNumber,
      'PRESCRIPTION_PICKUP_SCHEDULE',
      variables
    );
    
    res.status(200).json({
      message: '알림톡이 성공적으로 발송되었습니다',
      result
    });
  } catch (error) {
    console.error('알림톡 발송 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 처방전 검색 요청 알림톡 발송
exports.sendPrescriptionSearchRequestAlimTalk = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // 검색 요청 정보 조회
    const searchRequest = await PrescriptionSearchRequest.findById(requestId)
      .populate('pharmacy', 'name address contactPerson phoneNumber');
      
    if (!searchRequest) {
      return res.status(404).json({ message: '검색 요청을 찾을 수 없습니다' });
    }
    
    // 관리자 정보 조회 (첫 번째 매니저 권한 이상 계정)
    const admin = await Admin.findOne({ role: { $in: ['admin', 'manager'] } });
    if (!admin) {
      return res.status(404).json({ message: '담당 관리자를 찾을 수 없습니다' });
    }
    
    // 알림톡 변수 설정
    const variables = {
      pharmacyName: searchRequest.pharmacy.name,
      patientName: searchRequest.patientName,
      patientId: searchRequest.patientId,
      prescriptionDate: searchRequest.prescriptionDate ? 
        new Date(searchRequest.prescriptionDate).toLocaleDateString('ko-KR') : '정보 없음',
      requestDate: new Date(searchRequest.requestDate).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      notes: searchRequest.notes || '없음'
    };
    
    // 알림톡 발송
    const result = await sendAlimTalk(
      admin.phoneNumber,
      'PRESCRIPTION_SEARCH_REQUEST',
      variables
    );
    
    res.status(200).json({
      message: '알림톡이 성공적으로 발송되었습니다',
      result
    });
  } catch (error) {
    console.error('알림톡 발송 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 처방전 검색 결과 알림톡 발송
exports.sendPrescriptionSearchResultAlimTalk = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // 검색 요청 정보 조회
    const searchRequest = await PrescriptionSearchRequest.findById(requestId)
      .populate('pharmacy', 'name address contactPerson phoneNumber');
      
    if (!searchRequest) {
      return res.status(404).json({ message: '검색 요청을 찾을 수 없습니다' });
    }
    
    // 상태 확인
    if (searchRequest.status !== 'completed' && searchRequest.status !== 'not_found') {
      return res.status(400).json({ message: '아직 처리 완료되지 않은 요청입니다' });
    }
    
    // 알림톡 변수 설정
    const variables = {
      pharmacyName: searchRequest.pharmacy.name,
      patientName: searchRequest.patientName,
      status: searchRequest.status === 'completed' ? '처방전 발견' : '처방전을 찾을 수 없음',
      responseDate: new Date(searchRequest.responseDate || Date.now()).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      hasImage: searchRequest.prescriptionImage ? 'Y' : 'N',
      notes: searchRequest.notes || '없음'
    };
    
    // 알림톡 발송
    const result = await sendAlimTalk(
      searchRequest.pharmacy.phoneNumber,
      'PRESCRIPTION_SEARCH_RESULT',
      variables
    );
    
    res.status(200).json({
      message: '알림톡이 성공적으로 발송되었습니다',
      result
    });
  } catch (error) {
    console.error('알림톡 발송 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 알림톡 응답 처리 (예상 방문일 입력)
exports.handleAlimTalkResponse = async (req, res) => {
  try {
    const { requestId, responseType, responseData } = req.body;
    
    if (responseType === 'pickup_date') {
      // 수거 요청 조회
      const pickupRequest = await PickupRequest.findById(requestId);
      if (!pickupRequest) {
        return res.status(404).json({ message: '수거 요청을 찾을 수 없습니다' });
      }
      
      // 예상 방문일 업데이트
      pickupRequest.expectedVisitDate = new Date(responseData.date);
      pickupRequest.status = 'scheduled';
      pickupRequest.updatedAt = new Date();
      await pickupRequest.save();
      
      // 약국에 방문일 확정 알림톡 발송 가능
      
      res.status(200).json({
        message: '방문일 정보가 성공적으로 업데이트되었습니다',
        pickupRequest
      });
    } else if (responseType === 'prescription_image') {
      // 처방전 검색 요청 조회
      const searchRequest = await PrescriptionSearchRequest.findById(requestId);
      if (!searchRequest) {
        return res.status(404).json({ message: '검색 요청을 찾을 수 없습니다' });
      }
      
      // 이미지 정보 저장 (실제 구현 시 이미지 업로드 처리 필요)
      searchRequest.prescriptionImage = responseData.imageUrl;
      searchRequest.status = 'completed';
      searchRequest.responseDate = new Date();
      searchRequest.updatedAt = new Date();
      await searchRequest.save();
      
      // 약국에 처방전 검색 결과 알림톡 발송 가능
      
      res.status(200).json({
        message: '처방전 이미지가 성공적으로 등록되었습니다',
        searchRequest
      });
    } else {
      res.status(400).json({ message: '지원하지 않는 응답 유형입니다' });
    }
  } catch (error) {
    console.error('알림톡 응답 처리 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};
