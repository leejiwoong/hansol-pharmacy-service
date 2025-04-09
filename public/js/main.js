/**
 * 한솔제약 처방전 보관 서비스 JavaScript
 */

// 페이지 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
  // 알림톡 발송 버튼 이벤트 리스너
  const alimtalkButtons = document.querySelectorAll('.send-alimtalk-btn');
  if (alimtalkButtons.length > 0) {
    alimtalkButtons.forEach(button => {
      button.addEventListener('click', function() {
        const requestId = this.dataset.requestId;
        const requestType = this.dataset.requestType;
        
        let endpoint = '';
        if (requestType === 'pickup') {
          endpoint = `/api/alimtalk/pickup-request/${requestId}`;
        } else if (requestType === 'pickup-schedule') {
          endpoint = `/api/alimtalk/pickup-schedule/${requestId}`;
        } else if (requestType === 'search') {
          endpoint = `/api/alimtalk/search-request/${requestId}`;
        } else if (requestType === 'search-result') {
          endpoint = `/api/alimtalk/search-result/${requestId}`;
        }
        
        // 알림톡 발송 API 호출
        if (endpoint) {
          button.disabled = true;
          button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 발송 중...';
          
          fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then(data => {
            button.disabled = false;
            button.innerHTML = '<i class="bi bi-check-lg"></i> 발송 완료';
            button.classList.remove('btn-primary');
            button.classList.add('btn-success');
            
            // 성공 메시지 표시
            const alertHTML = `
              <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                <strong>알림톡 발송 성공!</strong> ${data.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            `;
            
            button.closest('.card-body').insertAdjacentHTML('beforeend', alertHTML);
            
            // 3초 후 버튼 원래대로 복원
            setTimeout(() => {
              button.innerHTML = '<i class="bi bi-chat-dots"></i> 알림톡 발송';
              button.classList.remove('btn-success');
              button.classList.add('btn-primary');
            }, 3000);
          })
          .catch(error => {
            console.error('알림톡 발송 오류:', error);
            button.disabled = false;
            button.innerHTML = '<i class="bi bi-exclamation-triangle"></i> 오류 발생';
            button.classList.remove('btn-primary');
            button.classList.add('btn-danger');
            
            // 오류 메시지 표시
            const alertHTML = `
              <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                <strong>알림톡 발송 실패!</strong> 오류가 발생했습니다. 다시 시도해 주세요.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            `;
            
            button.closest('.card-body').insertAdjacentHTML('beforeend', alertHTML);
            
            // 3초 후 버튼 원래대로 복원
            setTimeout(() => {
              button.innerHTML = '<i class="bi bi-chat-dots"></i> 알림톡 발송';
              button.classList.remove('btn-danger');
              button.classList.add('btn-primary');
            }, 3000);
          });
        }
      });
    });
  }
  
  // 처방전 검색 결과 업로드 폼 미리보기
  const prescriptionImageInput = document.getElementById('prescriptionImage');
  const prescriptionImagePreview = document.getElementById('prescriptionImagePreview');
  
  if (prescriptionImageInput && prescriptionImagePreview) {
    prescriptionImageInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          prescriptionImagePreview.innerHTML = `
            <div class="text-center mt-3">
              <img src="${e.target.result}" class="img-fluid border prescription-image" alt="처방전 미리보기">
              <p class="text-muted mt-2">처방전 이미지 미리보기</p>
            </div>
          `;
        }
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
  
  // 약국 필터링
  const pharmacyFilter = document.getElementById('pharmacyFilter');
  if (pharmacyFilter) {
    pharmacyFilter.addEventListener('input', function() {
      const filterValue = this.value.toLowerCase();
      const pharmacyItems = document.querySelectorAll('.pharmacy-item');
      
      pharmacyItems.forEach(item => {
        const pharmacyName = item.querySelector('.pharmacy-name').textContent.toLowerCase();
        const pharmacyAddress = item.querySelector('.pharmacy-address').textContent.toLowerCase();
        
        if (pharmacyName.includes(filterValue) || pharmacyAddress.includes(filterValue)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
  
  // 박스 ID 자동 생성
  const generateBoxIdButton = document.getElementById('generateBoxId');
  const boxIdInput = document.getElementById('boxId');
  
  if (generateBoxIdButton && boxIdInput) {
    generateBoxIdButton.addEventListener('click', function() {
      const timestamp = new Date().getTime().toString().slice(-6);
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const boxId = `BOX-${timestamp}-${random}`;
      
      boxIdInput.value = boxId;
    });
  }
  
  // 수거 요청 방문일 설정 모달
  const scheduleVisitModal = document.getElementById('scheduleVisitModal');
  if (scheduleVisitModal) {
    scheduleVisitModal.addEventListener('show.bs.modal', function(event) {
      const button = event.relatedTarget;
      const requestId = button.getAttribute('data-request-id');
      const pharmacyName = button.getAttribute('data-pharmacy-name');
      
      const modalTitle = scheduleVisitModal.querySelector('.modal-title');
      const requestIdInput = scheduleVisitModal.querySelector('#requestIdInput');
      
      modalTitle.textContent = `${pharmacyName} 방문 일정 설정`;
      requestIdInput.value = requestId;
    });
  }
  
  // 방문 일정 설정 폼 제출
  const scheduleVisitForm = document.getElementById('scheduleVisitForm');
  if (scheduleVisitForm) {
    scheduleVisitForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const requestId = document.getElementById('requestIdInput').value;
      const expectedVisitDate = document.getElementById('expectedVisitDate').value;
      const staffAssigned = document.getElementById('staffAssigned').value;
      const notes = document.getElementById('scheduleNotes').value;
      
      const formData = {
        expectedVisitDate,
        staffAssigned,
        notes,
        status: 'scheduled'
      };
      
      fetch(`/admin/api/pickup-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        // 모달 닫기
        const modal = bootstrap.Modal.getInstance(scheduleVisitModal);
        modal.hide();
        
        // 성공 알림 표시
        const alertHTML = `
          <div class="alert alert-success alert-dismissible fade show mb-4" role="alert">
            <strong>성공!</strong> 방문 일정이 성공적으로 설정되었습니다.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        
        document.querySelector('.container').insertAdjacentHTML('afterbegin', alertHTML);
        
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch(error => {
        console.error('방문 일정 설정 오류:', error);
        
        // 오류 알림 표시
        const errorHTML = `
          <div class="alert alert-danger mt-3" role="alert">
            <strong>오류 발생!</strong> 방문 일정 설정 중 오류가 발생했습니다. 다시 시도해 주세요.
          </div>
        `;
        
        scheduleVisitForm.insertAdjacentHTML('beforeend', errorHTML);
      });
    });
  }
  
  // 처방전 검색 응답 폼 제출
  const searchResponseForm = document.getElementById('searchResponseForm');
  if (searchResponseForm) {
    searchResponseForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const formData = new FormData(this);
      const requestId = document.getElementById('searchRequestId').value;
      
      fetch(`/admin/api/search-requests/${requestId}`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // 성공 알림 표시
        const alertHTML = `
          <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
            <strong>성공!</strong> 처방전 검색 요청이 성공적으로 처리되었습니다.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        
        searchResponseForm.insertAdjacentHTML('beforeend', alertHTML);
        
        // 폼 초기화
        document.getElementById('prescriptionImagePreview').innerHTML = '';
        document.getElementById('status').value = 'processing';
        document.getElementById('responseNotes').value = '';
        document.getElementById('prescriptionImage').value = '';
        
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch(error => {
        console.error('처방전 검색 응답 오류:', error);
        
        // 오류 알림 표시
        const errorHTML = `
          <div class="alert alert-danger mt-3" role="alert">
            <strong>오류 발생!</strong> 처방전 검색 응답 처리 중 오류가 발생했습니다. 다시 시도해 주세요.
          </div>
        `;
        
        searchResponseForm.insertAdjacentHTML('beforeend', errorHTML);
      });
    });
  }
  
  // 날짜 입력 필드에 현재 날짜 설정
  const dateInputs = document.querySelectorAll('input[type="date"]');
  if (dateInputs.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
      if (!input.value && !input.min) {
        input.value = today;
      }
    });
  }
  
  // 처방전 박스 폼 날짜 범위 검증
  const boxStartDate = document.getElementById('startDate');
  const boxEndDate = document.getElementById('endDate');
  
  if (boxStartDate && boxEndDate) {
    boxStartDate.addEventListener('change', function() {
      boxEndDate.min = this.value;
    });
    
    boxEndDate.addEventListener('change', function() {
      boxStartDate.max = this.value;
    });
  }
});
