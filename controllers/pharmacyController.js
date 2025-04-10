const Pharmacy = require('../models/Pharmacy');
const PickupRequest = require('../models/PickupRequest');
const PrescriptionSearchRequest = require('../models/PrescriptionSearchRequest');
const bcrypt = require('bcryptjs');

// 약국 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 이메일로 약국 찾기
    const pharmacy = await Pharmacy.findOne({ email });
    if (!pharmacy) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다' });
    }
    
    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, pharmacy.password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다' });
    }
    
    // 세션에 약국 정보 저장
    req.session.pharmacy = {
      id: pharmacy._id,
      name: pharmacy.name,
      email: pharmacy.email
    };
    
    res.status(200).json({ message: '로그인 성공', pharmacy: { id: pharmacy._id, name: pharmacy.name } });
  } catch (error) {
    console.error('약국 로그인 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 약국 로그아웃
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: '로그아웃 되었습니다' });
  });
};

// 처방전 수거 요청
exports.requestPickup = async (req, res) => {
  try {
    // 약국 로그인 상태 확인
    if (!req.session.pharmacy) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    const { notes } = req.body;
    
    // 새 수거 요청 생성
    const newPickupRequest = new PickupRequest({
      pharmacy: req.session.pharmacy.id,
      notes,
      status: 'requested'
    });
    
    await newPickupRequest.save();
    
    // 여기에 알림톡 발송 로직 구현 필요
    // sendAlimTalk(관리자번호, '처방전 수거 요청이 접수되었습니다', 수거요청정보);
    
    res.status(201).json({ 
      message: '처방전 수거 요청이 성공적으로 접수되었습니다', 
      requestId: newPickupRequest._id 
    });
  } catch (error) {
    console.error('처방전 수거 요청 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 처방전 검색 요청
exports.requestPrescriptionSearch = async (req, res) => {
  try {
    // 약국 로그인 상태 확인
    if (!req.session.pharmacy) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    const { patientName, patientId, prescriptionDate, notes } = req.body;
    
    // 새 처방전 검색 요청 생성
    const newSearchRequest = new PrescriptionSearchRequest({
      pharmacy: req.session.pharmacy.id,
      patientName,
      patientId,
      prescriptionDate: prescriptionDate ? new Date(prescriptionDate) : null,
      notes,
      status: 'requested'
    });
    
    await newSearchRequest.save();
    
    // 여기에 알림톡 발송 로직 구현 필요
    // sendAlimTalk(관리자번호, '처방전 검색 요청이 접수되었습니다', 검색요청정보);
    
    res.status(201).json({ 
      message: '처방전 검색 요청이 성공적으로 접수되었습니다', 
      requestId: newSearchRequest._id 
    });
  } catch (error) {
    console.error('처방전 검색 요청 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 약국의 요청 목록 조회
exports.getRequests = async (req, res) => {
  try {
    // 약국 로그인 상태 확인
    if (!req.session.pharmacy) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    const pharmacyId = req.session.pharmacy.id;
    
    // 수거 요청 목록 조회
    const pickupRequests = await PickupRequest.find({ pharmacy: pharmacyId })
      .sort({ requestDate: -1 });
    
    // 처방전 검색 요청 목록 조회
    const searchRequests = await PrescriptionSearchRequest.find({ pharmacy: pharmacyId })
      .sort({ requestDate: -1 });
    
    res.status(200).json({
      pickupRequests,
      searchRequests
    });
  } catch (error) {
    console.error('약국 요청 목록 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};
