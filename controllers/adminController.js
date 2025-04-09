const Admin = require('../models/Admin');
const Pharmacy = require('../models/Pharmacy');
const PickupRequest = require('../models/PickupRequest');
const PrescriptionSearchRequest = require('../models/PrescriptionSearchRequest');
const PrescriptionBox = require('../models/PrescriptionBox');
const bcrypt = require('bcrypt');

// 관리자 로그인
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 사용자명으로 관리자 찾기
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: '사용자명 또는 비밀번호가 일치하지 않습니다' });
    }
    
    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: '사용자명 또는 비밀번호가 일치하지 않습니다' });
    }
    
    // 세션에 관리자 정보 저장
    req.session.admin = {
      id: admin._id,
      username: admin.username,
      name: admin.name,
      role: admin.role
    };
    
    res.status(200).json({ 
      message: '로그인 성공', 
      admin: { id: admin._id, name: admin.name, role: admin.role } 
    });
  } catch (error) {
    console.error('관리자 로그인 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 관리자 로그아웃
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: '로그아웃 되었습니다' });
  });
};

// 수거 요청 목록 조회
exports.getPickupRequests = async (req, res) => {
  try {
    // 관리자 로그인 상태 확인
    if (!req.session.admin) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    const { status } = req.query;
    
    // 상태별 필터링
    let query = {};
    if (status) {
      query.status = status;
    }
    
    // 수거 요청 목록 조회
    const pickupRequests = await PickupRequest.find(query)
      .populate('pharmacy', 'name address contactPerson phoneNumber')
      .sort({ requestDate: -1 });
    
    res.status(200).json({ pickupRequests });
  } catch (error) {
    console.error('수거 요청 목록 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 수거 요청 상태 업데이트 (방문일 설정)
exports.updatePickupRequest = async (req, res) => {
  try {
    // 관리자 로그인 상태 확인
    if (!req.session.admin) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    const { requestId } = req.params;
    const { expectedVisitDate, status, staffAssigned, notes } = req.body;
    
    const pickupRequest = await PickupRequest.findById(requestId);
    if (!pickupRequest) {
      return res.status(404).json({ message: '수거 요청을 찾을 수 없습니다' });
    }
    
    // 수거 요청 업데이트
    if (expectedVisitDate) {
      pickupRequest.expectedVisitDate = new Date(expectedVisitDate);
      pickupRequest.status = 'scheduled';
    }
    
    if (status) {
      pickupRequest.status = status;
      if (status === 'completed') {
        pickupRequest.completedDate = new Date();
      }
    }
    
    if (staffAssigned) {
      pickupRequest.staffAssigned = staffAssigned;
    }
    
    if (notes) {
      pickupRequest.notes = notes;
    }
    
    pickupRequest.updatedAt = new Date();
    await pickupRequest.save();
    
    // 여기에 약국에 알림톡 발송 로직 구현 필요
    // sendAlimTalk(pharmacy.phoneNumber, '처방전 수거 방문일이 확정되었습니다', 방문정보);
    
    res.status(200).json({ 
      message: '수거 요청이 성공적으로 업데이트되었습니다', 
      pickupRequest 
    });
  } catch (error) {
    console.error('수거 요청 업데이트 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 처방전 검색 요청 목록 조회
exports.getPrescriptionSearchRequests = async (req, res) => {
  try {
    // 관리자 로그인 상태 확인
    if (!req.session.admin) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    const { status } = req.query;
    
    // 상태별 필터링
    let query = {};
    if (status) {
      query.status = status;
    }
    
    // 처방전 검색 요청 목록 조회
    const searchRequests = await PrescriptionSearchRequest.find(query)
      .populate('pharmacy', 'name address contactPerson phoneNumber')
      .sort({ requestDate: -1 });
    
    res.status(200).json({ searchRequests });
  } catch (error) {
    console.error('처방전 검색 요청 목록 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 처방전 검색 요청에 응답 (이미지 업로드)
exports.respondToPrescriptionSearch = async (req, res) => {
  try {
    // 관리자 로그인 상태 확인
    if (!req.session.admin) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    const { requestId } = req.params;
    const { status, notes } = req.body;
    
    // 파일 업로드 처리
    let prescriptionImage = null;
    if (req.file) {
      prescriptionImage = `/uploads/${req.file.filename}`;
    }
    
    const searchRequest = await PrescriptionSearchRequest.findById(requestId);
    if (!searchRequest) {
      return res.status(404).json({ message: '검색 요청을 찾을 수 없습니다' });
    }
    
    // 검색 요청 업데이트
    if (prescriptionImage) {
      searchRequest.prescriptionImage = prescriptionImage;
    }
    
    if (status) {
      searchRequest.status = status;
      if (status === 'completed' || status === 'not_found') {
        searchRequest.responseDate = new Date();
      }
    }
    
    if (notes) {
      searchRequest.notes = notes;
    }
    
    searchRequest.staffAssigned = req.session.admin.name;
    searchRequest.updatedAt = new Date();
    await searchRequest.save();
    
    // 여기에 약국에 알림톡 발송 로직 구현 필요
    // sendAlimTalk(pharmacy.phoneNumber, '처방전 검색 결과가 도착했습니다', 처방전정보);
    
    res.status(200).json({ 
      message: '처방전 검색 요청이 성공적으로 처리되었습니다', 
      searchRequest 
    });
  } catch (error) {
    console.error('처방전 검색 응답 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 처방전 박스 생성
exports.createPrescriptionBox = async (req, res) => {
  try {
    // 관리자 로그인 상태 확인
    if (!req.session.admin) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    const { boxId, pharmacyId, startDate, endDate, count, location } = req.body;
    
    // 약국 존재 확인
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: '약국을 찾을 수 없습니다' });
    }
    
    // 박스 ID 중복 확인
    const existingBox = await PrescriptionBox.findOne({ boxId });
    if (existingBox) {
      return res.status(409).json({ message: '이미 존재하는 박스 ID입니다' });
    }
    
    // 새 박스 생성
    const newBox = new PrescriptionBox({
      boxId,
      pharmacy: pharmacyId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      count,
      location,
      status: 'active'
    });
    
    await newBox.save();
    
    res.status(201).json({ 
      message: '처방전 박스가 성공적으로 생성되었습니다', 
      box: newBox 
    });
  } catch (error) {
    console.error('처방전 박스 생성 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 처방전 박스 목록 조회
exports.getPrescriptionBoxes = async (req, res) => {
  try {
    // 관리자 로그인 상태 확인
    if (!req.session.admin) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    const { status, pharmacyId } = req.query;
    
    // 상태 및 약국별 필터링
    let query = {};
    if (status) {
      query.status = status;
    }
    if (pharmacyId) {
      query.pharmacy = pharmacyId;
    }
    
    // 박스 목록 조회
    const boxes = await PrescriptionBox.find(query)
      .populate('pharmacy', 'name address contactPerson phoneNumber')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ boxes });
  } catch (error) {
    console.error('처방전 박스 목록 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 처방전 박스 상태 업데이트
exports.updatePrescriptionBox = async (req, res) => {
  try {
    // 관리자 로그인 상태 확인
    if (!req.session.admin) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    const { boxId } = req.params;
    const { status, location, count } = req.body;
    
    const box = await PrescriptionBox.findById(boxId);
    if (!box) {
      return res.status(404).json({ message: '처방전 박스를 찾을 수 없습니다' });
    }
    
    // 박스 정보 업데이트
    if (status) {
      box.status = status;
    }
    
    if (location) {
      box.location = location;
    }
    
    if (count !== undefined) {
      box.count = count;
    }
    
    box.updatedAt = new Date();
    await box.save();
    
    res.status(200).json({ 
      message: '처방전 박스 정보가 성공적으로 업데이트되었습니다', 
      box 
    });
  } catch (error) {
    console.error('처방전 박스 업데이트 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 약국 목록 조회
exports.getPharmacies = async (req, res) => {
  try {
    // 관리자 로그인 상태 확인
    if (!req.session.admin) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    
    // 약국 목록 조회
    const pharmacies = await Pharmacy.find()
      .select('-password')
      .sort({ name: 1 });
    
    res.status(200).json({ pharmacies });
  } catch (error) {
    console.error('약국 목록 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};
