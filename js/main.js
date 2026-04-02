document.addEventListener('DOMContentLoaded', () => {
  // GSAP 플러그인 등록
  gsap.registerPlugin(ScrollTrigger);

  /* ============================================================
     1. 메인 비주얼 스크롤 줌 애니메이션 (from common.js)
  ============================================================ */
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.main_v_wrap',
      start: 'top top',
      end: '+=2000',
      pin: true,
      scrub: true,
      pinSpacing: true,
    }
  });

  // Phase 1: 배경색을 검은색→흰색으로
  mainTl.fromTo('.main_visual',
    { backgroundColor: '#000' },
    { backgroundColor: '#fff', duration: 0.2 },
    0);

  mainTl.fromTo('.main_visual .txt h2',
    { color: '#ffffff' },
    { color: '#ffffff', duration: 0.2 },
    0);

  // Phase 2: span(T, 1) 색상을 빨간→검은색으로
  mainTl.fromTo('.main_visual .txt h2 span',
    { color: '#E0012C' },
    { color: '#000000', duration: 0.2 },
    0.05);

  // Phase 3: video01 비디오 서서히 등장
  mainTl.fromTo('.main_v_wrap .video01',
    { opacity: 0 },
    { opacity: 1, duration: 0.3 },
    0.1);

  // Phase 4: span(T, 1) 확대
  mainTl.fromTo('.main_visual .txt h2 span',
    { scale: 1 },
    { scale: 80, duration: 0.6, ease: 'power1.in' },
    0.2);

  // Phase 5: main_visual 페이드아웃 + 오버레이/텍스트 페이드인
  mainTl.fromTo('.main_visual',
    { opacity: 1 },
    { opacity: 0, duration: 0.2 },
    0.8);

  mainTl.fromTo('.video_overlay',
    { opacity: 0 },
    { opacity: 1, duration: 0.2 },
    0.8);

  mainTl.fromTo('.main_v_wrap .video01 .container',
    { opacity: 0 },
    { opacity: 1, duration: 0.2 },
    0.8);



  /* ============================================================
     2. Match Schedule Logic (from match_schedule.js)
  ============================================================ */
  let currentDate = new Date(2026, 2, 1); // March 2026

  const monthYearElement = document.getElementById('monthYear');
  const daysContainer = document.getElementById('days');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  const schedules = {
    '2026-03-01': [
      { team: 'T1 - HLE', tour: '2026 LoL 챔피언스 코리아 컵', time: '05:00 PM (KST)', loc: '치지직 롤파크', type: 'lol' }
    ],
    '2026-03-04': [
      { team: 'T1 - DRX', tour: '2026 LoL 챔피언스 코리아 컵', time: '07:00 PM (KST)', loc: '치지직 롤파크', type: 'lol' }
    ],
    '2026-03-19': [
      { team: 'T1 - KT', tour: '2026 LoL 챔피언스 코리아 컵', time: '05:00 PM (KST)', loc: '치지직 롤파크', type: 'lol' }
    ],
    '2026-03-20': [
      { team: 'T1 - GEN', tour: '2026 LoL 챔피언스 코리아 컵', time: '08:00 PM (KST)', loc: '치지직 롤파크', type: 'lol' }
    ],
    '2026-03-23': [
      { team: 'T1 - DK', tour: '2026 LoL 챔피언스 코리아 컵', time: '05:00 PM (KST)', loc: '치지직 롤파크', type: 'lol' }
    ]
  };

  function renderCalendar() {
    if (!daysContainer) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYearElement.textContent = `${year}.${month + 1}`;
    daysContainer.innerHTML = '';

    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    weekDays.forEach(day => {
      const dayName = document.createElement('div');
      dayName.className = 'day_name';
      dayName.textContent = day;
      daysContainer.appendChild(dayName);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'day_num empty';
      daysContainer.appendChild(emptyDay);
    }

    for (let i = 1; i <= lastDate; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayElement = document.createElement('div');
      dayElement.className = 'day_num';
      dayElement.textContent = i;

      if (schedules[dateStr]) {
        dayElement.classList.add('active');
        dayElement.addEventListener('click', () => updateScheduleList(dateStr));
      }

      const today = new Date();
      if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
        dayElement.classList.add('today');
      }

      daysContainer.appendChild(dayElement);
    }
  }

  const scheduleListElement = document.querySelector('.schedule_list');

  function updateScheduleList(dateStr) {
    if (!scheduleListElement) return;
    const items = schedules[dateStr] || [];
    scheduleListElement.innerHTML = '';

    if (items.length === 0) {
      scheduleListElement.innerHTML = '<li class="schedule_item"><p class="desc">No matches scheduled for this date.</p></li>';
      return;
    }

    items.forEach(item => {
      const dayStr = dateStr.split('-')[2];
      const monthStr = parseInt(dateStr.split('-')[1]);
      const li = document.createElement('li');
      li.className = `schedule_item ${item.type}`;
      li.innerHTML = `
                <div class="date">${monthStr}. ${dayStr}</div>
                <div class="info_box">
                    <h4>${item.team}</h4>
                    <p class="desc">${item.tour}</p>
                    <div class="meta">
                        <span>${item.time}</span>
                        <span>${item.loc}</span>
                    </div>
                </div>
            `;
      scheduleListElement.appendChild(li);
    });
  }

  function showMonthSchedules() {
    if (!scheduleListElement) return;
    scheduleListElement.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    Object.keys(schedules).sort().forEach(dateStr => {
      const d = new Date(dateStr);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const items = schedules[dateStr];
        items.forEach(item => {
          const dayStr = dateStr.split('-')[2];
          const monthStr = parseInt(dateStr.split('-')[1]);
          const li = document.createElement('li');
          li.className = `schedule_item ${item.type}`;
          li.innerHTML = `
                        <div class="date">${monthStr}. ${dayStr}</div>
                        <div class="info_box">
                            <h4>${item.team}</h4>
                            <p class="desc">${item.tour}</p>
                            <div class="meta">
                                <span>${item.time}${item.loc}</span>
                            </div>
                        </div>
                    `;
          scheduleListElement.appendChild(li);
        });
      }
    });
  }

  const filterBtn = document.querySelector('.schedule_filter');
  const filterMenu = document.querySelector('.select_box ul');

  if (filterBtn) {
    filterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      filterBtn.classList.toggle('on');
      filterMenu.classList.toggle('on');
    });
  }

  document.addEventListener('click', () => {
    if (filterBtn) {
      filterBtn.classList.remove('on');
      filterMenu.classList.remove('on');
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
      showMonthSchedules();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
      showMonthSchedules();
    });
  }

  // Initial Load
  if (daysContainer) {
    renderCalendar();
    showMonthSchedules();
  }
});
