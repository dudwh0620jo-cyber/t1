document.addEventListener('DOMContentLoaded', () => {
  /* ============================================================
     1. Match Schedule & Results Logic (Core Functionality)
  ============================================================ */
  let currentDate = new Date(2026, 2, 1); // March 2026

  const monthYearElement = document.getElementById('monthYear');
  const daysContainer = document.getElementById('days');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const scheduleListElement = document.querySelector('.schedule_list');
  const matchList = document.querySelector('.match_list');

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
    if (!daysContainer || !monthYearElement) return;
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

  // 경기 결과 가시성 제어 (2026.3월 & LOL/ALL 필터인 경우)
  function updateMatchListByMonth() {
    const list = document.querySelector('.match_list');
    if (!list) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const isTargetMonth = (year === 2026 && month === 3);

    const activeBtn = document.querySelector('.result_game button.active');
    const isShowable = activeBtn && (activeBtn.id === 'r_lol' || activeBtn.id === 'r_all');

    if (isTargetMonth && isShowable) {
      list.style.setProperty('display', 'flex', 'important');
    } else {
      list.style.setProperty('display', 'none', 'important');
    }
  }

  // 상단 필터 (select_box)
  const filterBtn = document.querySelector('.schedule_filter');
  const filterMenu = document.querySelector('.select_box ul');
  const gameMap = {
    s_lol: 'lol', s_val: 'val', s_ove: 'ove',
    s_pub: 'pub', s_fc: 'fc', s_tea: 'tea', s_fig: 'fig'
  };

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

  document.querySelectorAll('.select_box ul li button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (filterBtn) {
        const icon = filterBtn.querySelector('i');
        filterBtn.textContent = btn.textContent.trim();
        if (icon) filterBtn.appendChild(icon);
        filterBtn.classList.remove('on');
      }
      if (filterMenu) filterMenu.classList.remove('on');

      if (scheduleListElement) scheduleListElement.innerHTML = '';
      if (daysContainer) {
        daysContainer.querySelectorAll('.day_num.active').forEach(el => el.classList.remove('active'));
      }

      const game = gameMap[btn.id];
      if (game && matchList) {
        matchList.querySelectorAll('.match_item').forEach(item => {
          item.style.display = item.classList.contains(game) ? '' : 'none';
        });
      }
      updateMatchListByMonth();
    });
  });

  // 하단 필터 (result_game)
  const resultBtns = document.querySelectorAll('.result_game button');
  const resultGameMap = {
    r_all: null, r_lol: 'lol', r_val: 'val', r_ove: 'ove',
    r_pub: 'pub', r_fc: 'fc', r_tea: 'tea', r_fig: 'fig'
  };

  resultBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      resultBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (matchList) {
        const game = resultGameMap[btn.id];
        matchList.querySelectorAll('.match_item').forEach(item => {
          item.style.display = (game === null || item.classList.contains(game)) ? '' : 'none';
        });
      }
      updateMatchListByMonth();
    });
  });

  // 달력 조작
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
      if (scheduleListElement) scheduleListElement.innerHTML = '';
      updateMatchListByMonth();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
      if (scheduleListElement) scheduleListElement.innerHTML = '';
      updateMatchListByMonth();
    });
  }

  // 초기 실행
  renderCalendar();
  showMonthSchedules();
  updateMatchListByMonth();

  /* ============================================================
     2. Animations (GSAP)
  ============================================================ */
  try {
    gsap.registerPlugin(ScrollTrigger);

    // 메인 비주얼
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

    mainTl.fromTo('.main_visual', { backgroundColor: '#000' }, { backgroundColor: '#fff', duration: 0.2 }, 0);
    mainTl.fromTo('.main_visual .txt h2', { color: '#ffffff' }, { color: '#ffffff', duration: 0.2 }, 0);
    mainTl.fromTo('.main_visual .txt h2 span', { color: '#E0012C' }, { color: '#000000', duration: 0.2 }, 0.05);
    mainTl.fromTo('.main_v_wrap .video01', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.1);
    mainTl.fromTo('.main_visual .txt h2 span', { scale: 1 }, { scale: 80, duration: 0.6, ease: 'power1.inOut' }, 0.2);
    mainTl.fromTo('.main_visual', { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0.8);
    mainTl.fromTo('.video_overlay', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.8);
    mainTl.fromTo('.main_v_wrap .video01 .container', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.8);

    // 시즌 팀 슬라이드
    const swiperWrapper = document.querySelector('.season_team .swiper-wrapper');
    if (swiperWrapper) {
      const getScrollAmount = () => -(swiperWrapper.scrollWidth - window.innerWidth);
      gsap.to(swiperWrapper, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: '.season_team',
          start: 'top top',
          end: () => '+=' + Math.abs(getScrollAmount()),
          pin: true,
          scrub: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
        }
      });
    }
  } catch (e) {
    console.warn("GSAP error:", e);
  }

  /* ============================================================
     3. Marquee
  ============================================================ */
  document.querySelectorAll('.partner_line .line').forEach(line => {
    const items = Array.from(line.children);
    items.forEach(item => line.appendChild(item.cloneNode(true)));
  });
});
