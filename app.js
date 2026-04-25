(() => {
  const STORAGE_KEY = "songjeong-uri-system-data-v2";
  const ACTIVE_VIEW_KEY = "songjeong-active-view";
  const ADMIN_SESSION_KEY = "songjeong-admin-unlocked";
  const CLIENT_ID_KEY = "songjeong-client-id";
  const SHARED_DATA_URL = "/.netlify/functions/shared-data";
  const SYNC_INTERVAL_MS = 10000;
  const KOREAN_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

  const categorySeed = [
    { id: "learning", name: "학습형" },
    { id: "physical", name: "체육형" },
    { id: "participation", name: "참여형" },
    { id: "creative", name: "창의취미형" },
    { id: "partner", name: "협력기관형" }
  ];

  const app = document.getElementById("app");
  const title = document.getElementById("page-title");
  const eyebrow = document.getElementById("eyebrow");
  const todayLabel = document.getElementById("today-label");
  const syncStatus = document.getElementById("sync-status");
  const modalRoot = document.getElementById("modal-root");
  const backupInput = document.getElementById("backup-input");
  const adminOpenButton = document.getElementById("admin-open-button");

  const todayIso = toIsoDate(new Date());
  let currentView = localStorage.getItem(ACTIVE_VIEW_KEY) || "home";
  let state = normalizeState(loadLocalState());
  let monthlyCursor = startOfMonth(parseIsoDate(todayIso));
  let vacationCursor = startOfMonth(parseIsoDate(todayIso));
  let dailyDate = todayIso;
  let adminUnlocked = sessionStorage.getItem(ADMIN_SESSION_KEY) === "yes";
  let shared = {
    initialized: false,
    available: false,
    applying: false,
    pendingTimer: null,
    lastUpdatedAt: "",
    clientId: getClientId()
  };

  ensureDailySchedule(todayIso);

  const titles = {
    home: "오늘 현황",
    monthly: "월간 프로그램",
    daily: "일별 시간표",
    vacation: "휴가·송영 관리",
    observations: "관찰일지",
    stats: "근무 통계",
    settings: "기본 설정"
  };

  function defaultState() {
    const d0 = todayIso;
    const d1 = offsetDate(1);
    const d2 = offsetDate(2);

    return {
      schemaVersion: 3,
      serviceLabels: ["주간", "방과후1", "방과후2"],
      categories: categorySeed,
      majorThemes: [
        "특수체육",
        "인지학습치료",
        "의사소통 기술 향상 프로그램",
        "사회적응훈련",
        "일상생활훈련",
        "미술활동",
        "음악활동",
        "요리활동",
        "디지털 활용",
        "지역사회연계"
      ],
      monthlyPrograms: [
        {
          id: uid("program"),
          date: d0,
          category: "physical",
          major: "특수체육",
          topic: "컬러볼 협응 활동",
          session: 1,
          service: "주간",
          time: "10:00",
          teacher: "담당자1",
          room: "활동실"
        },
        {
          id: uid("program"),
          date: d0,
          category: "learning",
          major: "인지학습치료",
          topic: "순서 기억하기",
          session: 2,
          service: "방과후1",
          time: "16:00",
          teacher: "담당자2",
          room: "교실1"
        },
        {
          id: uid("program"),
          date: d1,
          category: "creative",
          major: "미술활동",
          topic: "계절 꾸미기",
          session: 1,
          service: "주간",
          time: "11:00",
          teacher: "담당자3",
          room: "우리실"
        },
        {
          id: uid("program"),
          date: d2,
          category: "partner",
          major: "지역사회연계",
          topic: "기관 방문 프로그램",
          session: 1,
          service: "주간",
          time: "14:00",
          teacher: "협력기관",
          room: "외부"
        }
      ],
      dailySchedules: {
        [d0]: {}
      },
      vacationTransport: [
        {
          id: uid("move"),
          date: d0,
          type: "송영",
          person: "담당자1",
          time: "하원",
          route: "차량1",
          memo: "하원 전 인원 확인"
        },
        {
          id: uid("move"),
          date: d1,
          type: "휴가",
          person: "담당자2",
          time: "오후",
          route: "",
          memo: "오후 반차"
        }
      ],
      observations: [],
      settings: {
        teachers: ["담당자1", "담당자2", "담당자3", "협력기관"],
        users: ["이용인1", "이용인2", "이용인3", "이용인4"],
        rooms: ["우리실", "활동실", "교실1", "교실2", "생활실", "외부"],
        timeSlots: [
          "09:00~09:30",
          "09:30~10:00",
          "10:00~11:00",
          "11:00~12:00",
          "12:00~13:00",
          "13:00~14:00",
          "14:00~15:00",
          "15:00~16:00",
          "16:00~16:40",
          "16:40~17:30",
          "17:30~18:40"
        ],
        adminPin: "0000"
      }
    };
  }

  function loadLocalState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  function normalizeState(input) {
    const base = defaultState();
    if (!input || typeof input !== "object") return base;

    const next = {
      ...base,
      ...input,
      categories: categorySeed,
      settings: {
        ...base.settings,
        ...(input.settings || {})
      }
    };

    if (!Array.isArray(next.serviceLabels) || !next.serviceLabels.length) {
      next.serviceLabels = base.serviceLabels;
    }

    if (Array.isArray(input.monthlyPrograms)) {
      next.monthlyPrograms = input.monthlyPrograms.map(normalizeProgram);
    } else if (Array.isArray(input.monthly)) {
      next.monthlyPrograms = input.monthly.flatMap((day) =>
        (day.items || []).map((item) =>
          normalizeProgram({
            id: item.id,
            date: day.date,
            category: inferCategory(item.text),
            major: item.text || "프로그램",
            topic: "",
            session: 1,
            service: serviceNameFromLegacy(item.type),
            time: "",
            teacher: "",
            room: ""
          })
        )
      );
    } else {
      next.monthlyPrograms = base.monthlyPrograms;
    }

    if (!next.dailySchedules || typeof next.dailySchedules !== "object") {
      next.dailySchedules = {};
    }

    if (Array.isArray(input.scheduleRows) && !Object.keys(next.dailySchedules).length) {
      next.dailySchedules[todayIso] = {};
      input.scheduleRows.forEach((row) => {
        next.serviceLabels.forEach((service) => {
          const key = scheduleKey(row.time, service);
          next.dailySchedules[todayIso][key] = {
            program: row.program || "",
            teacher: row.teacher || "",
            room: row.room || "",
            users: row.users || "",
            memo: row.handoff || row.docs || row.rest || ""
          };
        });
      });
    }

    if (Array.isArray(input.vacationTransport)) {
      next.vacationTransport = input.vacationTransport.map(normalizeMove);
    } else if (Array.isArray(input.vacationEntries)) {
      next.vacationTransport = input.vacationEntries.map((entry) =>
        normalizeMove({
          id: entry.id,
          date: entry.date,
          type: (entry.type || "").includes("송영") ? "송영" : "휴가",
          person: entry.teacher || "",
          time: entry.type || "",
          route: "",
          memo: entry.note || ""
        })
      );
    } else {
      next.vacationTransport = base.vacationTransport;
    }

    if (!Array.isArray(next.observations)) next.observations = [];
    if (!Array.isArray(next.majorThemes) || !next.majorThemes.length) {
      next.majorThemes = base.majorThemes;
    }

    if (input.settings && input.settings.users && !Array.isArray(input.settings.users)) {
      next.settings.users = Object.values(input.settings.users).flat();
    }

    ["teachers", "users", "rooms", "timeSlots"].forEach((key) => {
      if (!Array.isArray(next.settings[key]) || !next.settings[key].length) {
        next.settings[key] = base.settings[key];
      }
    });

    return next;
  }

  function normalizeProgram(program) {
    return {
      id: program.id || uid("program"),
      date: program.date || todayIso,
      category: program.category || inferCategory(`${program.major || ""} ${program.topic || ""}`),
      major: program.major || "프로그램",
      topic: program.topic || "",
      session: Number(program.session || 1),
      service: program.service || "주간",
      time: program.time || "",
      teacher: program.teacher || "",
      room: program.room || ""
    };
  }

  function normalizeMove(entry) {
    return {
      id: entry.id || uid("move"),
      date: entry.date || todayIso,
      type: entry.type || "송영",
      person: entry.person || "",
      time: entry.time || "",
      route: entry.route || "",
      memo: entry.memo || entry.note || ""
    };
  }

  function inferCategory(text = "") {
    if (text.includes("체육") || text.includes("운동")) return "physical";
    if (text.includes("미술") || text.includes("음악") || text.includes("공예")) return "creative";
    if (text.includes("기관") || text.includes("지역")) return "partner";
    if (text.includes("참여") || text.includes("자조")) return "participation";
    return "learning";
  }

  function serviceNameFromLegacy(type) {
    if (type === "after1") return "방과후1";
    if (type === "after2") return "방과후2";
    return "주간";
  }

  function saveState(message = "저장되었습니다.", options = {}) {
    state.schemaVersion = 3;
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSyncStatus(message);

    if (options.sync !== false && !shared.applying) {
      queueSharedSave();
    }
  }

  function queueSharedSave() {
    clearTimeout(shared.pendingTimer);
    shared.pendingTimer = setTimeout(() => {
      saveSharedState();
    }, 700);
  }

  async function initSharedStore() {
    if (location.protocol === "file:") {
      shared.initialized = true;
      setSyncStatus("로컬 미리보기입니다. 배포 후 공동저장이 연결됩니다.");
      return;
    }

    try {
      const payload = await fetchSharedState();
      shared.initialized = true;
      shared.available = true;

      if (payload && payload.data) {
        shared.applying = true;
        state = normalizeState(payload.data);
        shared.lastUpdatedAt = payload.updatedAt || "";
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        shared.applying = false;
        setSyncStatus("공동저장 연결됨");
        render();
      } else {
        setSyncStatus("공동저장 준비 완료");
        queueSharedSave();
      }
    } catch {
      shared.initialized = true;
      shared.available = false;
      setSyncStatus("공동저장 서버가 연결되지 않아 이 기기에만 저장됩니다.");
    }
  }

  async function fetchSharedState() {
    const response = await fetch(SHARED_DATA_URL, {
      headers: { accept: "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`shared store ${response.status}`);
    }

    return response.json();
  }

  async function pullSharedState(options = {}) {
    if (!shared.available && shared.initialized) return;
    if (!options.manual && modalRoot.children.length) return;

    try {
      const payload = await fetchSharedState();
      shared.available = true;

      if (!payload || !payload.data) {
        if (options.manual) setSyncStatus("공동저장에 아직 저장된 내용이 없습니다.");
        return;
      }

      if (payload.updatedAt && payload.updatedAt === shared.lastUpdatedAt) {
        if (options.manual) setSyncStatus("최신 공동저장 상태입니다.");
        return;
      }

      shared.applying = true;
      state = normalizeState(payload.data);
      shared.lastUpdatedAt = payload.updatedAt || "";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      shared.applying = false;
      setSyncStatus("공동저장 내용을 반영했습니다.");
      render();
    } catch {
      shared.available = false;
      setSyncStatus("공동저장 새로고침에 실패했습니다.");
    }
  }

  async function saveSharedState() {
    if (!shared.available) return;

    try {
      const response = await fetch(SHARED_DATA_URL, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          accept: "application/json"
        },
        body: JSON.stringify({
          data: state,
          clientId: shared.clientId
        })
      });

      if (!response.ok) throw new Error(`save ${response.status}`);
      const payload = await response.json();
      shared.lastUpdatedAt = payload.updatedAt || shared.lastUpdatedAt;
      setSyncStatus("공동저장 완료");
    } catch {
      setSyncStatus("공동저장 실패. 이 기기에는 저장되었습니다.");
    }
  }

  function setSyncStatus(message) {
    syncStatus.textContent = message;
  }

  function render() {
    title.textContent = titles[currentView] || titles.home;
    eyebrow.textContent = currentView === "home" ? "업무 대시보드" : "업무 관리";
    todayLabel.textContent = formatLongDate(todayIso);
    updateNavigation();

    if (currentView === "home") renderHome();
    if (currentView === "monthly") renderMonthly();
    if (currentView === "daily") renderDaily();
    if (currentView === "vacation") renderVacation();
    if (currentView === "observations") renderObservations();
    if (currentView === "stats") renderStats();
    if (currentView === "settings") renderSettings();
  }

  function updateNavigation() {
    document.querySelectorAll(".nav-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === currentView);
    });
  }

  function renderHome() {
    const programs = programsForDate(todayIso);
    const moves = movesForDate(todayIso);
    const openSchedules = countFilledScheduleCells(todayIso);

    app.innerHTML = `
      <div class="dashboard-grid">
        <article class="panel metric learning span-3">
          <span>오늘 프로그램</span>
          <strong>${programs.length}</strong>
          <span>${programs.length ? "월간 프로그램에 등록됨" : "등록된 프로그램 없음"}</span>
        </article>
        <article class="panel metric vacation span-3">
          <span>휴가·송영</span>
          <strong>${moves.length}</strong>
          <span>${moves.length ? "오늘 확인할 항목" : "오늘 항목 없음"}</span>
        </article>
        <article class="panel metric records span-3">
          <span>시간표 입력</span>
          <strong>${openSchedules}</strong>
          <span>선택 완료된 칸</span>
        </article>
        <article class="panel metric span-3">
          <span>저장 방식</span>
          <strong>${shared.available ? "공동" : "로컬"}</strong>
          <span>${shared.available ? "여러 기기 자동 반영" : "이 기기 안에 저장"}</span>
        </article>

        <section class="panel span-7">
          <div class="panel-head">
            <h3>오늘 프로그램</h3>
            <button class="ghost-button" data-view-jump="monthly" type="button">월간 프로그램 열기</button>
          </div>
          <div class="panel-body">
            ${renderProgramList(programs, true)}
          </div>
        </section>

        <section class="panel span-5">
          <div class="panel-head">
            <h3>휴가·송영 확인</h3>
            <button class="ghost-button" data-view-jump="vacation" type="button">캘린더 열기</button>
          </div>
          <div class="panel-body">
            ${renderMoveList(moves)}
          </div>
        </section>

        <section class="panel span-12">
          <div class="panel-head">
            <h3>오늘 시간표</h3>
            <button class="ghost-button" data-view-jump="daily" type="button">시간표 편집</button>
          </div>
          <div class="panel-body">
            ${renderTodayScheduleSummary()}
          </div>
        </section>
      </div>
    `;
  }

  function renderMonthly() {
    app.innerHTML = `
      <div class="toolbar-row">
        <div class="toolbar-left">
          <button class="icon-button" data-month-action="prev" type="button" aria-label="이전 달">‹</button>
          <h3 class="month-title">${formatMonth(monthlyCursor)}</h3>
          <button class="icon-button" data-month-action="next" type="button" aria-label="다음 달">›</button>
          <button class="ghost-button" data-month-action="today" type="button">이번 달</button>
        </div>
        <div class="toolbar-right">
          <span class="muted">날짜를 선택해서 프로그램을 추가하거나 수정합니다.</span>
        </div>
      </div>
      ${renderCalendar(monthlyCursor, "program")}
    `;
  }

  function renderVacation() {
    app.innerHTML = `
      <div class="toolbar-row">
        <div class="toolbar-left">
          <button class="icon-button" data-vacation-month-action="prev" type="button" aria-label="이전 달">‹</button>
          <h3 class="month-title">${formatMonth(vacationCursor)}</h3>
          <button class="icon-button" data-vacation-month-action="next" type="button" aria-label="다음 달">›</button>
          <button class="ghost-button" data-vacation-month-action="today" type="button">이번 달</button>
        </div>
        <div class="toolbar-right">
          <span class="muted">휴가, 외출, 등원·하원 송영을 한 달 단위로 확인합니다.</span>
        </div>
      </div>
      ${renderCalendar(vacationCursor, "move")}
    `;
  }

  function renderCalendar(cursor, mode) {
    const first = startOfMonth(cursor);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    const days = [];

    for (let i = 0; i < 42; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }

    const cells = days
      .map((date) => {
        const iso = toIsoDate(date);
        const outside = date.getMonth() !== cursor.getMonth();
        const isToday = iso === todayIso;
        const items = mode === "program" ? programsForDate(iso) : movesForDate(iso);
        const dataAttr = mode === "program" ? "data-open-program-date" : "data-open-move-date";
        return `
          <button class="day-cell ${outside ? "outside" : ""} ${isToday ? "today" : ""}" ${dataAttr}="${iso}" type="button">
            <span class="day-top">
              <span class="day-number">${date.getDate()}</span>
              <span class="add-dot">+</span>
            </span>
            <span class="chip-list">
              ${items
                .slice(0, 4)
                .map((item) =>
                  mode === "program"
                    ? `<span class="chip category-${h(item.category)}">${h(shortProgramLabel(item))}</span>`
                    : `<span class="chip ${item.type === "송영" ? "transport" : "vacation"}">${h(shortMoveLabel(item))}</span>`
                )
                .join("")}
              ${items.length > 4 ? `<span class="chip">외 ${items.length - 4}건</span>` : ""}
            </span>
          </button>
        `;
      })
      .join("");

    return `
      <div class="calendar">
        <div class="calendar-weekdays">
          ${KOREAN_DAYS.map((day) => `<div>${day}</div>`).join("")}
        </div>
        <div class="calendar-grid">
          ${cells}
        </div>
      </div>
    `;
  }

  function renderDaily() {
    ensureDailySchedule(dailyDate);
    const programs = programsForDate(dailyDate);
    const options = ["", ...programs.map(programOptionLabel), "등원 / 출석 확인", "점심시간 및 양치 지도", "하원 준비", "개별지원"].filter(
      unique
    );
    const gridColumns = `112px repeat(${state.serviceLabels.length}, minmax(230px, 1fr))`;

    app.innerHTML = `
      <div class="toolbar-row">
        <div class="toolbar-left">
          <label class="field">
            <span class="visually-hidden">날짜</span>
            <input id="daily-date" type="date" value="${h(dailyDate)}" />
          </label>
          <button class="ghost-button" data-copy-programs-to-schedule type="button">월간 프로그램 불러오기</button>
        </div>
        <div class="toolbar-right">
          <span class="muted">각 칸의 프로그램, 담당자, 장소, 이용인, 메모를 바로 선택할 수 있습니다.</span>
        </div>
      </div>
      <div class="timetable-shell">
        <div class="timetable" style="grid-template-columns: ${gridColumns}">
          <div class="time-head">시간</div>
          ${state.serviceLabels.map((label) => `<div class="service-head">${h(label)}</div>`).join("")}
          ${state.settings.timeSlots
            .map((slot) => {
              return `
                <div class="time-label">${h(slot)}</div>
                ${state.serviceLabels
                  .map((service) => renderScheduleCell(dailyDate, slot, service, options))
                  .join("")}
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderScheduleCell(date, slot, service, programOptions) {
    const key = scheduleKey(slot, service);
    const cell = state.dailySchedules[date][key] || {};

    return `
      <div class="schedule-cell" data-slot="${h(slot)}" data-service="${h(service)}">
        <select data-schedule-field="program" aria-label="${h(slot)} ${h(service)} 프로그램">
          ${programOptions
            .map((option) => `<option value="${h(option)}" ${cell.program === option ? "selected" : ""}>${h(option || "프로그램 선택")}</option>`)
            .join("")}
        </select>
        <select data-schedule-field="teacher" aria-label="${h(slot)} ${h(service)} 담당자">
          ${["", ...state.settings.teachers]
            .filter(unique)
            .map((teacher) => `<option value="${h(teacher)}" ${cell.teacher === teacher ? "selected" : ""}>${h(teacher || "담당자 선택")}</option>`)
            .join("")}
        </select>
        <select data-schedule-field="room" aria-label="${h(slot)} ${h(service)} 장소">
          ${["", ...state.settings.rooms]
            .filter(unique)
            .map((room) => `<option value="${h(room)}" ${cell.room === room ? "selected" : ""}>${h(room || "장소 선택")}</option>`)
            .join("")}
        </select>
        <input data-schedule-field="users" value="${h(cell.users || "")}" placeholder="이용인" />
        <input class="memo-input" data-schedule-field="memo" value="${h(cell.memo || "")}" placeholder="메모" />
      </div>
    `;
  }

  function renderObservations() {
    const observations = [...state.observations].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    app.innerHTML = `
      <div class="dashboard-grid">
        <section class="panel span-5">
          <div class="panel-head">
            <h3>관찰일지 작성</h3>
          </div>
          <div class="panel-body">
            <form id="observation-form" class="field-grid">
              <label class="field">
                <span>날짜</span>
                <input name="date" type="date" value="${h(todayIso)}" required />
              </label>
              <label class="field">
                <span>이용인</span>
                <select name="user" required>
                  ${state.settings.users.map((user) => `<option value="${h(user)}">${h(user)}</option>`).join("")}
                </select>
              </label>
              <label class="field">
                <span>담당자</span>
                <select name="teacher">
                  ${state.settings.teachers.map((teacher) => `<option value="${h(teacher)}">${h(teacher)}</option>`).join("")}
                </select>
              </label>
              <label class="field">
                <span>활동</span>
                <input name="activity" placeholder="활동명" />
              </label>
              <label class="field full">
                <span>내용</span>
                <textarea name="summary" placeholder="관찰 내용을 입력하세요." required></textarea>
              </label>
              <div class="modal-actions field full">
                <button class="primary-button" type="submit">저장</button>
              </div>
            </form>
          </div>
        </section>
        <section class="panel span-7">
          <div class="panel-head">
            <h3>최근 기록</h3>
          </div>
          <div class="panel-body">
            ${
              observations.length
                ? `<div class="list">${observations
                    .map(
                      (item) => `
                        <article class="list-item">
                          <strong>${h(item.user)} · ${h(item.activity || "활동")}</strong>
                          <small>${h(formatShortDate(item.date))} / ${h(item.teacher || "담당자 미지정")}</small>
                          <span>${h(item.summary)}</span>
                          <div>
                            <button class="danger-button" data-delete-observation="${h(item.id)}" type="button">삭제</button>
                          </div>
                        </article>
                      `
                    )
                    .join("")}</div>`
                : `<div class="empty">아직 작성된 관찰일지가 없습니다.</div>`
            }
          </div>
        </section>
      </div>
    `;
  }

  function renderStats() {
    const teacherCounts = {};
    state.monthlyPrograms.forEach((program) => {
      if (!program.teacher) return;
      teacherCounts[program.teacher] = (teacherCounts[program.teacher] || 0) + 1;
    });

    const rows = Object.entries(teacherCounts)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([teacher, count]) => `
          <article class="list-item">
            <strong>${h(teacher)}</strong>
            <span>월간 프로그램 ${count}건 배정</span>
          </article>
        `
      )
      .join("");

    app.innerHTML = `
      <div class="dashboard-grid">
        <section class="panel span-4">
          <div class="panel-head">
            <h3>프로그램 분류</h3>
          </div>
          <div class="panel-body list">
            ${categorySeed
              .map((category) => {
                const count = state.monthlyPrograms.filter((program) => program.category === category.id).length;
                return `<article class="list-item"><strong>${h(category.name)}</strong><span>${count}건</span></article>`;
              })
              .join("")}
          </div>
        </section>
        <section class="panel span-8">
          <div class="panel-head">
            <h3>담당자 배정</h3>
          </div>
          <div class="panel-body">
            ${rows ? `<div class="list">${rows}</div>` : `<div class="empty">배정된 프로그램이 없습니다.</div>`}
          </div>
        </section>
      </div>
    `;
  }

  function renderSettings() {
    if (!adminUnlocked) {
      app.innerHTML = `
        <section class="panel">
          <div class="panel-head">
            <h3>관리자 권한 필요</h3>
          </div>
          <div class="panel-body">
            <p class="notice">기본 설정은 관리자 패널에서 입장한 뒤 수정할 수 있습니다.</p>
            <button class="primary-button" data-open-admin-from-settings type="button">관리자 입장</button>
          </div>
        </section>
      `;
      return;
    }

    app.innerHTML = `
      <section class="panel">
        <div class="panel-head">
          <h3>기본 설정</h3>
        </div>
        <div class="panel-body">
          <form id="settings-form" class="settings-grid">
            ${renderTextareaSetting("serviceLabels", "서비스 구분", state.serviceLabels)}
            ${renderTextareaSetting("teachers", "담당자", state.settings.teachers)}
            ${renderTextareaSetting("users", "이용인", state.settings.users)}
            ${renderTextareaSetting("rooms", "장소", state.settings.rooms)}
            ${renderTextareaSetting("timeSlots", "시간표 시간", state.settings.timeSlots)}
            ${renderTextareaSetting("majorThemes", "대주제 후보", state.majorThemes)}
            <label class="setting-card">
              <h4>관리자 비밀번호</h4>
              <input name="adminPin" type="password" value="${h(state.settings.adminPin || "0000")}" />
              <span class="muted">화면 정리용 잠금입니다. 실제 보안이 필요하면 별도 로그인 연결이 필요합니다.</span>
            </label>
            <div class="setting-card">
              <h4>저장</h4>
              <span class="muted">줄마다 하나씩 입력하면 선택 항목에 반영됩니다.</span>
              <button class="primary-button" type="submit">설정 저장</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  function renderTextareaSetting(name, label, values) {
    return `
      <label class="setting-card">
        <h4>${h(label)}</h4>
        <textarea name="${h(name)}">${h(values.join("\n"))}</textarea>
      </label>
    `;
  }

  function renderProgramList(programs, compact = false) {
    if (!programs.length) return `<div class="empty">등록된 프로그램이 없습니다.</div>`;

    return `
      <div class="list">
        ${programs
          .map(
            (program) => `
              <article class="list-item">
                <strong>${h(program.major)}${program.topic ? ` · ${h(program.topic)}` : ""}</strong>
                <small>${h(categoryName(program.category))} / ${h(program.session)}차시 / ${h(program.service || "구분 없음")}</small>
                ${compact ? "" : `<span>${h(program.time || "시간 미정")} · ${h(program.teacher || "담당자 미정")} · ${h(program.room || "장소 미정")}</span>`}
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderMoveList(items) {
    if (!items.length) return `<div class="empty">등록된 휴가·송영 항목이 없습니다.</div>`;

    return `
      <div class="list">
        ${items
          .map(
            (item) => `
              <article class="list-item">
                <strong>${h(item.type)} · ${h(item.person || "대상 미정")}</strong>
                <small>${h(item.time || "시간 미정")} ${item.route ? `/ ${h(item.route)}` : ""}</small>
                ${item.memo ? `<span>${h(item.memo)}</span>` : ""}
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderTodayScheduleSummary() {
    ensureDailySchedule(todayIso);
    const entries = Object.entries(state.dailySchedules[todayIso])
      .filter(([, cell]) => cell.program || cell.teacher || cell.room || cell.users || cell.memo)
      .slice(0, 8);

    if (!entries.length) return `<div class="empty">아직 선택된 시간표가 없습니다.</div>`;

    return `
      <div class="list">
        ${entries
          .map(([key, cell]) => {
            const [slot, service] = key.split("||");
            return `
              <article class="list-item">
                <strong>${h(slot)} · ${h(service)}</strong>
                <span>${h(cell.program || "프로그램 미지정")}</span>
                <small>${h(cell.teacher || "담당자 미지정")} / ${h(cell.room || "장소 미지정")}</small>
              </article>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function openProgramModal(date) {
    const programs = programsForDate(date);

    modalRoot.innerHTML = `
      <div class="modal-backdrop" role="presentation">
        <section class="modal wide" role="dialog" aria-modal="true" aria-labelledby="program-modal-title">
          <div class="modal-head">
            <h3 id="program-modal-title">${h(formatLongDate(date))} 프로그램 편집</h3>
            <button class="icon-button" data-close-modal type="button" aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            <form id="program-form" class="field-grid three">
              <input name="date" type="hidden" value="${h(date)}" />
              <label class="field">
                <span>카테고리</span>
                <select name="category" required>
                  ${categorySeed.map((category) => `<option value="${h(category.id)}">${h(category.name)}</option>`).join("")}
                </select>
              </label>
              <label class="field">
                <span>대주제</span>
                <input name="major" list="major-theme-options" placeholder="직접 입력 가능" required />
                <datalist id="major-theme-options">
                  ${state.majorThemes.map((theme) => `<option value="${h(theme)}"></option>`).join("")}
                </datalist>
              </label>
              <label class="field">
                <span>소주제</span>
                <input name="topic" placeholder="오늘 수업 주제" />
              </label>
              <label class="field">
                <span>차시</span>
                <input name="session" type="number" min="1" max="99" value="1" required />
              </label>
              <label class="field">
                <span>서비스</span>
                <select name="service">
                  ${state.serviceLabels.map((label) => `<option value="${h(label)}">${h(label)}</option>`).join("")}
                </select>
              </label>
              <label class="field">
                <span>시간</span>
                <input name="time" type="time" />
              </label>
              <label class="field">
                <span>담당자</span>
                <select name="teacher">
                  ${["", ...state.settings.teachers]
                    .map((teacher) => `<option value="${h(teacher)}">${h(teacher || "선택 안 함")}</option>`)
                    .join("")}
                </select>
              </label>
              <label class="field">
                <span>장소</span>
                <select name="room">
                  ${["", ...state.settings.rooms]
                    .map((room) => `<option value="${h(room)}">${h(room || "선택 안 함")}</option>`)
                    .join("")}
                </select>
              </label>
              <div class="field">
                <span>&nbsp;</span>
                <button class="primary-button" type="submit">프로그램 추가</button>
              </div>
            </form>

            <div class="panel" style="margin-top: 16px;">
              <div class="panel-head">
                <h3>등록된 프로그램</h3>
              </div>
              <div class="panel-body">
                ${
                  programs.length
                    ? `<div class="list">${programs
                        .map(
                          (program) => `
                            <article class="list-item">
                              <strong>${h(program.major)}${program.topic ? ` · ${h(program.topic)}` : ""}</strong>
                              <small>${h(categoryName(program.category))} / ${h(program.session)}차시 / ${h(program.service)} / ${h(program.time || "시간 미정")}</small>
                              <span>${h(program.teacher || "담당자 미정")} · ${h(program.room || "장소 미정")}</span>
                              <div>
                                <button class="danger-button" data-delete-program="${h(program.id)}" data-program-date="${h(date)}" type="button">삭제</button>
                              </div>
                            </article>
                          `
                        )
                        .join("")}</div>`
                    : `<div class="empty">이 날짜에는 등록된 프로그램이 없습니다.</div>`
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function openMoveModal(date) {
    const items = movesForDate(date);

    modalRoot.innerHTML = `
      <div class="modal-backdrop" role="presentation">
        <section class="modal wide" role="dialog" aria-modal="true" aria-labelledby="move-modal-title">
          <div class="modal-head">
            <h3 id="move-modal-title">${h(formatLongDate(date))} 휴가·송영 편집</h3>
            <button class="icon-button" data-close-modal type="button" aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            <form id="move-form" class="field-grid three">
              <input name="date" type="hidden" value="${h(date)}" />
              <label class="field">
                <span>구분</span>
                <select name="type" required>
                  <option>송영</option>
                  <option>휴가</option>
                  <option>외출</option>
                  <option>결석</option>
                  <option>보호자 동행</option>
                </select>
              </label>
              <label class="field">
                <span>대상</span>
                <input name="person" list="people-options" placeholder="담당자 또는 이용인" required />
                <datalist id="people-options">
                  ${[...state.settings.teachers, ...state.settings.users].filter(unique).map((person) => `<option value="${h(person)}"></option>`).join("")}
                </datalist>
              </label>
              <label class="field">
                <span>시간</span>
                <input name="time" placeholder="등원, 하원, 오전, 종일 등" />
              </label>
              <label class="field">
                <span>차량·노선</span>
                <input name="route" placeholder="차량명 또는 노선" />
              </label>
              <label class="field full">
                <span>메모</span>
                <input name="memo" placeholder="전달사항" />
              </label>
              <div class="modal-actions field full">
                <button class="primary-button" type="submit">항목 추가</button>
              </div>
            </form>

            <div class="panel" style="margin-top: 16px;">
              <div class="panel-head">
                <h3>등록된 항목</h3>
              </div>
              <div class="panel-body">
                ${
                  items.length
                    ? `<div class="list">${items
                        .map(
                          (item) => `
                            <article class="list-item">
                              <strong>${h(item.type)} · ${h(item.person)}</strong>
                              <small>${h(item.time || "시간 미정")} ${item.route ? `/ ${h(item.route)}` : ""}</small>
                              ${item.memo ? `<span>${h(item.memo)}</span>` : ""}
                              <div>
                                <button class="danger-button" data-delete-move="${h(item.id)}" data-move-date="${h(date)}" type="button">삭제</button>
                              </div>
                            </article>
                          `
                        )
                        .join("")}</div>`
                    : `<div class="empty">이 날짜에는 등록된 항목이 없습니다.</div>`
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function openAdminModal() {
    if (!adminUnlocked) {
      modalRoot.innerHTML = `
        <div class="modal-backdrop" role="presentation">
          <section class="modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
            <div class="modal-head">
              <h3 id="admin-modal-title">관리자 입장</h3>
              <button class="icon-button" data-close-modal type="button" aria-label="닫기">×</button>
            </div>
            <div class="modal-body">
              <form id="admin-login-form" class="field-grid">
                <label class="field full">
                  <span>관리자 비밀번호</span>
                  <input name="pin" type="password" autocomplete="current-password" required />
                </label>
                <p class="notice field full">초기 비밀번호는 0000입니다. 입장 후 기본 설정에서 바꿀 수 있습니다.</p>
                <div class="modal-actions field full">
                  <button class="primary-button" type="submit">입장</button>
                </div>
              </form>
            </div>
          </section>
        </div>
      `;
      return;
    }

    modalRoot.innerHTML = `
      <div class="modal-backdrop" role="presentation">
        <section class="modal wide" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
          <div class="modal-head">
            <h3 id="admin-modal-title">관리자 기능</h3>
            <button class="icon-button" data-close-modal type="button" aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            <div class="admin-grid">
              ${adminAction("refresh", "공동저장 새로고침", "다른 기기에서 저장한 내용을 즉시 불러옵니다.")}
              ${adminAction("download", "백업 저장", "현재 데이터를 JSON 파일로 내려받습니다.")}
              ${adminAction("upload", "백업 불러오기", "백업 파일을 선택해서 현재 데이터로 반영합니다.")}
              ${adminAction("print", "인쇄", "현재 화면을 인쇄합니다.")}
              ${adminAction("settings", "기본 설정", "담당자, 이용인, 시간표, 대주제를 수정합니다.")}
              ${adminAction("reset", "처음 상태", "모든 입력 내용을 예시 상태로 되돌립니다.")}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function adminAction(action, label, description) {
    return `
      <button class="admin-action" data-admin-action="${h(action)}" type="button">
        <strong>${h(label)}</strong>
        <span>${h(description)}</span>
      </button>
    `;
  }

  function handleProgramSubmit(form) {
    const data = new FormData(form);
    const program = normalizeProgram({
      date: data.get("date"),
      category: data.get("category"),
      major: String(data.get("major") || "").trim(),
      topic: String(data.get("topic") || "").trim(),
      session: Number(data.get("session") || 1),
      service: data.get("service"),
      time: data.get("time"),
      teacher: data.get("teacher"),
      room: data.get("room")
    });

    if (program.major && !state.majorThemes.includes(program.major)) {
      state.majorThemes.push(program.major);
    }

    state.monthlyPrograms.push(program);
    saveState("프로그램이 추가되었습니다.");
    render();
    openProgramModal(program.date);
  }

  function handleMoveSubmit(form) {
    const data = new FormData(form);
    const entry = normalizeMove({
      date: data.get("date"),
      type: data.get("type"),
      person: String(data.get("person") || "").trim(),
      time: String(data.get("time") || "").trim(),
      route: String(data.get("route") || "").trim(),
      memo: String(data.get("memo") || "").trim()
    });

    state.vacationTransport.push(entry);
    saveState("휴가·송영 항목이 추가되었습니다.");
    render();
    openMoveModal(entry.date);
  }

  function handleObservationSubmit(form) {
    const data = new FormData(form);
    state.observations.push({
      id: uid("obs"),
      date: data.get("date"),
      user: data.get("user"),
      teacher: data.get("teacher"),
      activity: String(data.get("activity") || "").trim(),
      summary: String(data.get("summary") || "").trim()
    });

    saveState("관찰일지가 저장되었습니다.");
    render();
  }

  function handleSettingsSubmit(form) {
    const data = new FormData(form);
    state.serviceLabels = splitLines(data.get("serviceLabels"));
    state.settings.teachers = splitLines(data.get("teachers"));
    state.settings.users = splitLines(data.get("users"));
    state.settings.rooms = splitLines(data.get("rooms"));
    state.settings.timeSlots = splitLines(data.get("timeSlots"));
    state.majorThemes = splitLines(data.get("majorThemes"));
    state.settings.adminPin = String(data.get("adminPin") || "0000");
    saveState("기본 설정이 저장되었습니다.");
    render();
  }

  function copyProgramsToSchedule() {
    ensureDailySchedule(dailyDate);
    const programs = programsForDate(dailyDate);
    if (!programs.length) {
      setSyncStatus("해당 날짜의 월간 프로그램이 없습니다.");
      return;
    }

    programs.forEach((program, index) => {
      const slot = state.settings.timeSlots[index % state.settings.timeSlots.length];
      const service = state.serviceLabels.includes(program.service) ? program.service : state.serviceLabels[0];
      const key = scheduleKey(slot, service);
      state.dailySchedules[dailyDate][key] = {
        ...state.dailySchedules[dailyDate][key],
        program: programOptionLabel(program),
        teacher: program.teacher,
        room: program.room
      };
    });

    saveState("월간 프로그램을 시간표에 반영했습니다.");
    renderDaily();
  }

  function downloadBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `songjeong-backup-${todayIso}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function importBackup(file) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        state = normalizeState(parsed);
        saveState("백업을 불러왔습니다.");
        closeModal();
        render();
      } catch {
        setSyncStatus("백업 파일을 읽지 못했습니다.");
      }
    });
    reader.readAsText(file);
  }

  function resetState() {
    const ok = window.confirm("현재 입력된 내용을 처음 예시 상태로 되돌릴까요?");
    if (!ok) return;
    state = defaultState();
    saveState("처음 상태로 되돌렸습니다.");
    closeModal();
    render();
  }

  function programsForDate(date) {
    return state.monthlyPrograms
      .filter((program) => program.date === date)
      .sort((a, b) => `${a.time || "99:99"}${a.service}`.localeCompare(`${b.time || "99:99"}${b.service}`));
  }

  function movesForDate(date) {
    return state.vacationTransport
      .filter((entry) => entry.date === date)
      .sort((a, b) => `${a.time || ""}${a.person}`.localeCompare(`${b.time || ""}${b.person}`));
  }

  function countFilledScheduleCells(date) {
    ensureDailySchedule(date);
    return Object.values(state.dailySchedules[date]).filter((cell) => cell.program || cell.teacher || cell.room || cell.users || cell.memo).length;
  }

  function ensureDailySchedule(date) {
    if (!state.dailySchedules) state.dailySchedules = {};
    if (!state.dailySchedules[date]) state.dailySchedules[date] = {};

    state.settings.timeSlots.forEach((slot) => {
      state.serviceLabels.forEach((service) => {
        const key = scheduleKey(slot, service);
        if (!state.dailySchedules[date][key]) {
          state.dailySchedules[date][key] = {
            program: "",
            teacher: "",
            room: "",
            users: "",
            memo: ""
          };
        }
      });
    });
  }

  function scheduleKey(slot, service) {
    return `${slot}||${service}`;
  }

  function categoryName(id) {
    return categorySeed.find((category) => category.id === id)?.name || "학습형";
  }

  function shortProgramLabel(program) {
    return `${program.time ? `${program.time} ` : ""}${program.major}${program.session ? ` ${program.session}차` : ""}`;
  }

  function shortMoveLabel(item) {
    return `${item.type} ${item.person || ""}`.trim();
  }

  function programOptionLabel(program) {
    return `${program.major}${program.topic ? ` - ${program.topic}` : ""} (${program.session}차시)`;
  }

  function addMonths(date, amount) {
    const next = new Date(date);
    next.setMonth(next.getMonth() + amount);
    return startOfMonth(next);
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function parseIsoDate(value) {
    return new Date(`${value}T00:00:00`);
  }

  function toIsoDate(date) {
    const copy = new Date(date);
    copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
    return copy.toISOString().slice(0, 10);
  }

  function offsetDate(days) {
    const date = parseIsoDate(todayIso);
    date.setDate(date.getDate() + days);
    return toIsoDate(date);
  }

  function formatLongDate(date) {
    const parsed = parseIsoDate(date);
    return `${parsed.getFullYear()}년 ${parsed.getMonth() + 1}월 ${parsed.getDate()}일 ${KOREAN_DAYS[parsed.getDay()]}요일`;
  }

  function formatShortDate(date) {
    const parsed = parseIsoDate(date);
    return `${parsed.getMonth() + 1}/${parsed.getDate()}(${KOREAN_DAYS[parsed.getDay()]})`;
  }

  function formatMonth(date) {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  }

  function splitLines(value) {
    return String(value || "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
      .filter(unique);
  }

  function unique(value, index, array) {
    return value !== undefined && value !== null && array.indexOf(value) === index;
  }

  function uid(prefix) {
    if (window.crypto?.randomUUID) {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function getClientId() {
    let clientId = localStorage.getItem(CLIENT_ID_KEY);
    if (!clientId) {
      clientId = uid("client");
      localStorage.setItem(CLIENT_ID_KEY, clientId);
    }
    return clientId;
  }

  function h(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function closeModal() {
    modalRoot.innerHTML = "";
  }

  document.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-view]");
    if (navButton) {
      currentView = navButton.dataset.view;
      localStorage.setItem(ACTIVE_VIEW_KEY, currentView);
      render();
      return;
    }

    const jumpButton = event.target.closest("[data-view-jump]");
    if (jumpButton) {
      currentView = jumpButton.dataset.viewJump;
      localStorage.setItem(ACTIVE_VIEW_KEY, currentView);
      render();
      return;
    }

    const monthButton = event.target.closest("[data-month-action]");
    if (monthButton) {
      const action = monthButton.dataset.monthAction;
      if (action === "prev") monthlyCursor = addMonths(monthlyCursor, -1);
      if (action === "next") monthlyCursor = addMonths(monthlyCursor, 1);
      if (action === "today") monthlyCursor = startOfMonth(parseIsoDate(todayIso));
      renderMonthly();
      return;
    }

    const vacationMonthButton = event.target.closest("[data-vacation-month-action]");
    if (vacationMonthButton) {
      const action = vacationMonthButton.dataset.vacationMonthAction;
      if (action === "prev") vacationCursor = addMonths(vacationCursor, -1);
      if (action === "next") vacationCursor = addMonths(vacationCursor, 1);
      if (action === "today") vacationCursor = startOfMonth(parseIsoDate(todayIso));
      renderVacation();
      return;
    }

    const programDay = event.target.closest("[data-open-program-date]");
    if (programDay) {
      openProgramModal(programDay.dataset.openProgramDate);
      return;
    }

    const moveDay = event.target.closest("[data-open-move-date]");
    if (moveDay) {
      openMoveModal(moveDay.dataset.openMoveDate);
      return;
    }

    if (event.target.closest("[data-copy-programs-to-schedule]")) {
      copyProgramsToSchedule();
      return;
    }

    if (event.target.closest("[data-close-modal]")) {
      closeModal();
      return;
    }

    if (event.target.closest("[data-open-admin-from-settings]")) {
      openAdminModal();
      return;
    }

    const deleteProgram = event.target.closest("[data-delete-program]");
    if (deleteProgram) {
      const ok = window.confirm("이 프로그램을 삭제할까요?");
      if (!ok) return;
      state.monthlyPrograms = state.monthlyPrograms.filter((program) => program.id !== deleteProgram.dataset.deleteProgram);
      saveState("프로그램이 삭제되었습니다.");
      render();
      openProgramModal(deleteProgram.dataset.programDate);
      return;
    }

    const deleteMove = event.target.closest("[data-delete-move]");
    if (deleteMove) {
      const ok = window.confirm("이 항목을 삭제할까요?");
      if (!ok) return;
      state.vacationTransport = state.vacationTransport.filter((entry) => entry.id !== deleteMove.dataset.deleteMove);
      saveState("휴가·송영 항목이 삭제되었습니다.");
      render();
      openMoveModal(deleteMove.dataset.moveDate);
      return;
    }

    const deleteObservation = event.target.closest("[data-delete-observation]");
    if (deleteObservation) {
      const ok = window.confirm("이 관찰일지를 삭제할까요?");
      if (!ok) return;
      state.observations = state.observations.filter((entry) => entry.id !== deleteObservation.dataset.deleteObservation);
      saveState("관찰일지가 삭제되었습니다.");
      render();
      return;
    }

    const adminActionButton = event.target.closest("[data-admin-action]");
    if (adminActionButton) {
      const action = adminActionButton.dataset.adminAction;
      if (action === "refresh") pullSharedState({ manual: true });
      if (action === "download") downloadBackup();
      if (action === "upload") backupInput.click();
      if (action === "print") window.print();
      if (action === "settings") {
        closeModal();
        currentView = "settings";
        localStorage.setItem(ACTIVE_VIEW_KEY, currentView);
        render();
      }
      if (action === "reset") resetState();
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();

    if (form.id === "program-form") handleProgramSubmit(form);
    if (form.id === "move-form") handleMoveSubmit(form);
    if (form.id === "observation-form") handleObservationSubmit(form);
    if (form.id === "settings-form") handleSettingsSubmit(form);
    if (form.id === "admin-login-form") {
      const pin = new FormData(form).get("pin");
      if (String(pin) === String(state.settings.adminPin || "0000")) {
        adminUnlocked = true;
        sessionStorage.setItem(ADMIN_SESSION_KEY, "yes");
        openAdminModal();
        render();
      } else {
        setSyncStatus("관리자 비밀번호가 맞지 않습니다.");
      }
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;

    if (target.id === "daily-date") {
      dailyDate = target.value || todayIso;
      renderDaily();
      return;
    }

    if (target.matches("[data-schedule-field]")) {
      ensureDailySchedule(dailyDate);
      const cell = target.closest(".schedule-cell");
      const key = scheduleKey(cell.dataset.slot, cell.dataset.service);
      state.dailySchedules[dailyDate][key][target.dataset.scheduleField] = target.value;
      saveState("시간표가 저장되었습니다.");
      return;
    }
  });

  document.addEventListener("input", (event) => {
    const target = event.target;

    if (!target.matches("[data-schedule-field]")) return;
    ensureDailySchedule(dailyDate);
    const cell = target.closest(".schedule-cell");
    const key = scheduleKey(cell.dataset.slot, cell.dataset.service);
    state.dailySchedules[dailyDate][key][target.dataset.scheduleField] = target.value;
    saveState("시간표가 저장되었습니다.");
  });

  backupInput.addEventListener("change", () => {
    const [file] = backupInput.files || [];
    if (file) importBackup(file);
    backupInput.value = "";
  });

  adminOpenButton.addEventListener("click", openAdminModal);

  render();
  setSyncStatus("저장 상태 확인 중");
  initSharedStore();
  setInterval(() => pullSharedState(), SYNC_INTERVAL_MS);
})();
