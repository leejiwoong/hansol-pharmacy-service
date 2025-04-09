/**
 * 처방전 관련 테스트 데이터 생성 스크립트
 */

// 샘플 환자 정보
const patientNames = [
  '김민수', '이영희', '박준영', '최지원', '정현우', '강서연', '윤동현', '서민지',
  '한지훈', '조수민', '장준호', '백승민', '유지현', '신동욱', '임수진', '황민준',
  '노예진', '권영철', '안수현', '송지훈', '고은지', '남윤서', '홍길동', '이태준',
  '오은영', '양지민', '배성훈', '구자영', '민경수', '진세희', '석준영', '성미영',
  '허지원', '전민수', '라윤서', '손영진', '견은지', '하선영', '문지훈', '류하늘',
  '김재원', '이민영', '박서연', '최현준', '정미경', '강동훈', '윤서영', '서진호',
  '한수민', '조민지'
];

// 주민등록번호 앞자리 생성
function generateSsn() {
  // 연도(80년~09년생)
  const year = Math.floor(Math.random() * 30) + 80;
  // 월(01~12)
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  // 일(01~28)
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  
  // 성별(1: 남자, 2: 여자)
  const gender = Math.random() > 0.5 ? '1' : '2';
  
  // 뒷자리는 * 처리
  return `${year}${month}${day}-${gender}******`;
}

// 약국 정보
const pharmacies = [
  {
    id: '1',
    name: '테스트약국',
    email: 'pharmacy@test.com',
    address: '서울특별시 강남구 테헤란로 123',
    contactPerson: '김약사',
    phoneNumber: '02-123-4567',
  },
  {
    id: '2',
    name: '건강약국',
    email: 'health@pharmacy.com',
    address: '서울특별시 강남구 역삼로 45',
    contactPerson: '이약사',
    phoneNumber: '02-345-6789',
  },
  {
    id: '3',
    name: '미래약국',
    email: 'future@pharmacy.com',
    address: '서울특별시 강남구 선릉로 67',
    contactPerson: '최약사',
    phoneNumber: '02-567-8901',
  }
];

// 담당자 정보
const staffMembers = [
  '김담당', '박직원', '이매니저', '정담당자', '최직원'
];

// 요청 메모
const requestNotes = [
  '처방전이 많아서 빠른 수거 부탁드립니다.',
  '오전에 방문 부탁드립니다.',
  '담당 약사가 직접 전달할 예정입니다.',
  '약국 내부 리모델링 중이라 주의해주세요.',
  '처방전 보관함에 정리해두었습니다.',
  '주차공간이 협소하니 참고바랍니다.',
  '비가 올 예정이라 비닐 포장 부탁드려요.',
  '박스 3개 분량입니다.',
  '',
  '오후 3시 이후 방문 부탁드립니다.'
];

// 검색 요청 메모
const searchNotes = [
  '환자가 처방전 사본을 요청했습니다.',
  '보험 청구용으로 필요합니다.',
  '급하게 필요합니다.',
  '처방 내역 확인이 필요합니다.',
  '약품명도 함께 확인 부탁드립니다.',
  '진료확인서와 함께 필요합니다.',
  '',
  '재발급 처리 필요합니다.',
  '원본 분실로 인한 재발급 요청입니다.',
  '특정 약품 용량 확인이 필요합니다.'
];

// 날짜 생성 함수
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// 처방전 수거 요청 데이터 생성
function generatePickupRequests(count) {
  const now = new Date();
  const pickupRequests = [];
  
  const statuses = ['requested', 'scheduled', 'completed', 'cancelled'];
  const statusWeights = [0.2, 0.3, 0.4, 0.1]; // 가중치 (요청됨 20%, 방문예정 30%, 완료 40%, 취소 10%)
  
  for (let i = 0; i < count; i++) {
    // 요청일은 현재 기준 최대 60일 전까지
    const requestDate = randomDate(new Date(now - 1000 * 60 * 60 * 24 * 60), now);
    
    // 무작위 상태 선택 (가중치 적용)
    let status;
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let j = 0; j < statuses.length; j++) {
      cumulativeWeight += statusWeights[j];
      if (random <= cumulativeWeight) {
        status = statuses[j];
        break;
      }
    }
    
    // 기본 요청 객체
    const request = {
      _id: (i + 1).toString(),
      pharmacy: '1', // 테스트약국
      requestDate: requestDate,
      status: status,
      notes: requestNotes[Math.floor(Math.random() * requestNotes.length)],
      updatedAt: new Date(requestDate.getTime() + 1000 * 60 * 15) // 15분 후 업데이트
    };
    
    // 상태별 추가 정보
    if (status === 'scheduled' || status === 'completed') {
      // 방문 예정일은 요청일 기준 1~5일 후
      request.expectedVisitDate = new Date(requestDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000);
      request.staffAssigned = staffMembers[Math.floor(Math.random() * staffMembers.length)];
    }
    
    if (status === 'completed') {
      // 완료일은 예정일 기준 0~1일 후
      request.completedDate = new Date(request.expectedVisitDate.getTime() + Math.random() * 24 * 60 * 60 * 1000);
      request.updatedAt = request.completedDate;
    }
    
    pickupRequests.push(request);
  }
  
  return pickupRequests;
}

// 처방전 검색 요청 데이터 생성
function generateSearchRequests(count) {
  const now = new Date();
  const searchRequests = [];
  
  const statuses = ['requested', 'processing', 'completed', 'not_found'];
  const statusWeights = [0.2, 0.1, 0.6, 0.1]; // 가중치 (요청됨 20%, 처리중 10%, 완료 60%, 미발견 10%)
  
  for (let i = 0; i < count; i++) {
    // 환자 정보
    const patientIndex = Math.floor(Math.random() * patientNames.length);
    const patientName = patientNames[patientIndex];
    const patientId = generateSsn();
    
    // 요청일은 현재 기준 최대 30일 전까지
    const requestDate = randomDate(new Date(now - 1000 * 60 * 60 * 24 * 30), now);
    
    // 처방일은 요청일 기준 최대 1년 전까지
    const prescriptionDate = randomDate(new Date(requestDate.getTime() - 365 * 24 * 60 * 60 * 1000), requestDate);
    
    // 무작위 상태 선택 (가중치 적용)
    let status;
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let j = 0; j < statuses.length; j++) {
      cumulativeWeight += statusWeights[j];
      if (random <= cumulativeWeight) {
        status = statuses[j];
        break;
      }
    }
    
    // 기본 요청 객체
    const request = {
      _id: (i + 101).toString(), // 검색 요청은 101부터 시작
      pharmacy: '1', // 테스트약국
      patientName: patientName,
      patientId: patientId,
      prescriptionDate: prescriptionDate,
      requestDate: requestDate,
      status: status,
      notes: searchNotes[Math.floor(Math.random() * searchNotes.length)],
      updatedAt: new Date(requestDate.getTime() + 1000 * 60 * 15) // 15분 후 업데이트
    };
    
    // 상태별 추가 정보
    if (status === 'processing' || status === 'completed' || status === 'not_found') {
      request.staffAssigned = staffMembers[Math.floor(Math.random() * staffMembers.length)];
    }
    
    if (status === 'completed' || status === 'not_found') {
      // 응답일은 요청일 기준 0~2일 후
      request.responseDate = new Date(requestDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
      request.updatedAt = request.responseDate;
    }
    
    if (status === 'completed') {
      // 처방전 이미지 샘플
      request.prescriptionImage = '/uploads/prescription_sample.jpg';
    }
    
    searchRequests.push(request);
  }
  
  return searchRequests;
}

// 처방전 박스 데이터 생성
function generatePrescriptionBoxes(count) {
  const now = new Date();
  const boxes = [];
  
  const statuses = ['active', 'archived', 'destroyed'];
  const statusWeights = [0.7, 0.2, 0.1]; // 가중치 (활성 70%, 보관 20%, 폐기 10%)
  
  for (let i = 0; i < count; i++) {
    // 시작일은 현재 기준 최대 3년 전까지
    const startDate = randomDate(new Date(now - 1000 * 60 * 60 * 24 * 365 * 3), new Date(now - 1000 * 60 * 60 * 24 * 30));
    
    // 종료일은 시작일 기준 1~30일 후
    const endDate = new Date(startDate.getTime() + (1 + Math.random() * 29) * 24 * 60 * 60 * 1000);
    
    // 무작위 상태 선택 (가중치 적용)
    let status;
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let j = 0; j < statuses.length; j++) {
      cumulativeWeight += statusWeights[j];
      if (random <= cumulativeWeight) {
        status = statuses[j];
        break;
      }
    }
    
    // 약국 선택
    const pharmacyId = Math.floor(Math.random() * 3) + 1;
    
    // 박스 ID 생성
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const boxId = `BOX-${year}${month}-${String(i + 1).padStart(3, '0')}`;
    
    // 처방전 수 (2,500~3,500장)
    const count = Math.floor(2500 + Math.random() * 1000);
    
    // 위치 코드
    const section = String.fromCharCode(65 + Math.floor(Math.random() * 5)); // A~E
    const row = Math.floor(Math.random() * 10) + 1; // 1~10
    const column = Math.floor(Math.random() * 10) + 1; // 1~10
    const location = `${section}-${row}${column.toString().padStart(2, '0')}`;
    
    boxes.push({
      _id: (i + 201).toString(), // 박스는 201부터 시작
      boxId: boxId,
      pharmacy: pharmacyId.toString(),
      startDate: startDate,
      endDate: endDate,
      count: count,
      status: status,
      location: location,
      createdAt: endDate,
      updatedAt: new Date(endDate.getTime() + 1000 * 60 * 60 * 24) // 하루 후 업데이트
    });
  }
  
  return boxes;
}

// 테스트 데이터 생성
const testData = {
  pickupRequests: generatePickupRequests(30), // 수거 요청 30개 생성
  searchRequests: generateSearchRequests(20), // 검색 요청 20개 생성
  prescriptionBoxes: generatePrescriptionBoxes(15) // 처방전 박스 15개 생성
};

// 데이터 출력
console.log('====== 테스트 데이터 생성 완료 ======');
console.log(`수거 요청 데이터: ${testData.pickupRequests.length}개`);
console.log(`검색 요청 데이터: ${testData.searchRequests.length}개`);
console.log(`처방전 박스 데이터: ${testData.prescriptionBoxes.length}개`);

// 데이터 파일에 저장 (Node.js 환경에서만 작동)
if (typeof require !== 'undefined') {
  const fs = require('fs');
  
  // 데이터 디렉토리 생성
  const dataDir = './data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // JSON 파일로 저장
  fs.writeFileSync(`${dataDir}/pickup-requests.json`, JSON.stringify(testData.pickupRequests, null, 2));
  fs.writeFileSync(`${dataDir}/search-requests.json`, JSON.stringify(testData.searchRequests, null, 2));
  fs.writeFileSync(`${dataDir}/prescription-boxes.json`, JSON.stringify(testData.prescriptionBoxes, null, 2));
  
  console.log('데이터 파일이 성공적으로 저장되었습니다.');
}

// 테스트 데이터 객체 내보내기
if (typeof module !== 'undefined') {
  module.exports = testData;
}
