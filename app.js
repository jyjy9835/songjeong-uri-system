(() => {
  const STORAGE_KEY = "songjeong-uri-system-data-v2";
  const ACTIVE_VIEW_KEY = "songjeong-active-view";
  const ADMIN_SESSION_KEY = "songjeong-admin-unlocked";
  const CLIENT_ID_KEY = "songjeong-client-id";
  const SHARED_DATA_URL = "/.netlify/functions/shared-data";
  const SYNC_INTERVAL_MS = 10000;
  const REPORT_HIDDEN_KEY = "__hiddenTeachers";
  const KOREAN_DAYS = ["일", "월", "화", "수", "목", "금", "토"];
  const SUPPORT_FIELDS = ["rest", "docs", "desk"];
  const SUPPORT_LABELS = {
    rest: "휴게",
    docs: "서류",
    desk: "데스크"
  };
  const CORE_PROGRAM_OPTIONS = ["등원 / 출석 확인", "등원 및 개별학습", "점심식사 및 양치질 지도", "돌봄 / 서류 업무", "하원 준비", "개별지원"];
  const USER_GROUPS = [
    { key: "day", label: "주간" },
    { key: "afterMonTueThuSat", label: "방과후(월화목토)" },
    { key: "afterWedFriSat", label: "방과후(수금토)" }
  ];
  const SERVICE_CALENDARS = [
    { key: "day", title: "주간 프로그램 (월~금)", service: "주간", allowedDays: [1, 2, 3, 4, 5] },
    { key: "afterMonTueThuSat", title: "방과후(월화목토) 프로그램", service: "방과후(월화목토)", allowedDays: [1, 2, 4, 6] },
    { key: "afterWedFriSat", title: "방과후(수금토) 프로그램", service: "방과후(수금토)", allowedDays: [3, 5, 6] }
  ];
  const MOVE_TYPES = [
    { key: "vacation", label: "휴가", className: "note-row" },
    { key: "morningHalf", label: "오전 반차", className: "half-row" },
    { key: "afternoonHalf", label: "오후 반차", className: "half-row" },
    { key: "dayCarnivalIn", label: "주간 카니발 등원", className: "day-route" },
    { key: "dayCarnivalOut", label: "주간 카니발 하원", className: "day-route" },
    { key: "dayMorningIn", label: "주간 모닝 등원", className: "day-route" },
    { key: "dayMorningOut", label: "주간 모닝 하원", className: "day-route" },
    { key: "afterOut", label: "방과후 하원", className: "after-route" }
  ];
  const MOVE_TYPE_LABELS = MOVE_TYPES.map((item) => item.label);
  const AFTERCARE_INFO_TYPES = ["결석", "등원", "하원"];
  const TEACHER_COLOR_PALETTE = ["#1f78ff", "#ef3b2d", "#2f9e44", "#ae3ec9", "#f08c00", "#0ca678", "#15aabf", "#e64980"];
  const KOREA_HOLIDAYS_2026 = {
    "2026-01-01": "신정",
    "2026-02-16": "설날 연휴",
    "2026-02-17": "설날",
    "2026-02-18": "설날 연휴",
    "2026-03-01": "삼일절",
    "2026-03-02": "대체공휴일",
    "2026-05-05": "어린이날",
    "2026-05-01": "노동절",
    "2026-05-24": "부처님오신날",
    "2026-05-25": "대체공휴일",
    "2026-06-03": "전국동시지방선거",
    "2026-06-06": "현충일",
    "2026-07-17": "제헌절",
    "2026-08-15": "광복절",
    "2026-08-17": "대체공휴일",
    "2026-09-24": "추석 연휴",
    "2026-09-25": "추석",
    "2026-09-26": "추석 연휴",
    "2026-10-03": "개천절",
    "2026-10-05": "대체공휴일",
    "2026-10-09": "한글날",
    "2026-12-25": "성탄절"
  };

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
  let selectedTodayTeacher = "";
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
    people: "이용인·교사 관리",
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
      schemaVersion: 4,
      serviceLabels: SERVICE_CALENDARS.map((item) => item.service),
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
          service: "방과후(월화목토)",
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
      dailyReports: {
        [d0]: {}
      },
      vacationTransport: [
        {
          id: uid("move"),
          date: d0,
          type: "주간 카니발 하원",
          person: "담당자1",
          time: "",
          route: "",
          memo: "하원 전 인원 확인"
        },
        {
          id: uid("move"),
          date: d1,
          type: "오후 반차",
          person: "담당자2",
          time: "",
          route: "",
          memo: ""
        }
      ],
      observations: [],
      settings: {
        teachers: ["담당자1", "담당자2", "담당자3", "협력기관"],
        teacherColors: {
          담당자1: "#1f78ff",
          담당자2: "#ef3b2d",
          담당자3: "#2f9e44",
          협력기관: "#ae3ec9"
        },
        users: ["이용인1", "이용인2", "이용인3", "이용인4"],
        userGroups: {
          day: ["이용인1", "이용인2"],
          afterMonTueThuSat: ["이용인3"],
          afterWedFriSat: ["이용인4"]
        },
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
      },
      closedDates: []
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
    next.serviceLabels = SERVICE_CALENDARS.map((item) => item.service);

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

    if (!next.dailyReports || typeof next.dailyReports !== "object") {
      next.dailyReports = {};
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

    const hasStoredUserGroups = Boolean(input.settings?.userGroups);

    if (input.settings && input.settings.users && !Array.isArray(input.settings.users)) {
      next.settings.userGroups = input.settings.users;
      next.settings.users = Object.values(input.settings.users).flat();
    } else if (!hasStoredUserGroups) {
      next.settings.userGroups = null;
    }

    ["teachers", "users", "rooms", "timeSlots"].forEach((key) => {
      if (!Array.isArray(next.settings[key]) || !next.settings[key].length) {
        next.settings[key] = base.settings[key];
      }
    });

    next.settings.userGroups = normalizeUserGroups(next.settings.userGroups, next.settings.users);
    next.settings.users = flattenUserGroups(next.settings.userGroups);
    next.settings.teacherColors = normalizeTeacherColors(next.settings.teacherColors, next.settings.teachers);
    next.closedDates = Array.isArray(input.closedDates) ? input.closedDates.map(cleanSelectValue).filter(Boolean).filter(unique) : [];

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
      service: normalizeServiceName(program.service || "주간"),
      time: program.time || "",
      teacher: program.teacher || "",
      room: program.room || ""
    };
  }

  function normalizeMove(entry) {
    return {
      id: entry.id || uid("move"),
      date: entry.date || todayIso,
      type: normalizeMoveType(entry),
      person: entry.person || "",
      time: entry.time || "",
      route: entry.route || "",
      memo: entry.memo || entry.note || ""
    };
  }

  function normalizeMoveType(entry = {}) {
    const type = cleanSelectValue(entry.type);
    const text = `${type} ${entry.time || ""} ${entry.route || ""} ${entry.memo || ""} ${entry.note || ""}`;

    if (MOVE_TYPE_LABELS.includes(type)) return type;
    if (text.includes("방과후")) return "방과후 하원";
    if (text.includes("모닝") && text.includes("등원")) return "주간 모닝 등원";
    if (text.includes("모닝") && text.includes("하원")) return "주간 모닝 하원";
    if (text.includes("카니발") && text.includes("등원")) return "주간 카니발 등원";
    if (text.includes("카니발") && text.includes("하원")) return "주간 카니발 하원";
    if (text.includes("오전") && (text.includes("반차") || text.includes("휴가"))) return "오전 반차";
    if (text.includes("오후") && (text.includes("반차") || text.includes("휴가"))) return "오후 반차";
    if (text.includes("등원")) return "주간 카니발 등원";
    if (text.includes("하원") || type === "송영") return "주간 카니발 하원";
    return "휴가";
  }

  function normalizeUserGroups(input, fallbackUsers = []) {
    const groups = {};
    USER_GROUPS.forEach((group) => {
      groups[group.key] = [];
    });

    if (input && typeof input === "object") {
      USER_GROUPS.forEach((group) => {
        if (Array.isArray(input[group.key])) {
          groups[group.key] = input[group.key].map(cleanSelectValue).filter(Boolean).filter(unique);
        }
      });
    }

    if (!flattenUserGroups(groups).length) {
      groups.day = fallbackUsers.map(cleanSelectValue).filter(Boolean).filter(unique);
    }

    return groups;
  }

  function flattenUserGroups(groups = state.settings.userGroups) {
    return USER_GROUPS.flatMap((group) => groups?.[group.key] || [])
      .map(cleanSelectValue)
      .filter(Boolean)
      .filter(unique);
  }

  function syncUsersFromGroups() {
    state.settings.userGroups = normalizeUserGroups(state.settings.userGroups, state.settings.users);
    state.settings.users = flattenUserGroups(state.settings.userGroups);
  }

  function normalizeTeacherColors(input, teachers) {
    const colors = {};
    teachers.forEach((teacher, index) => {
      colors[teacher] = normalizeColor(input?.[teacher]) || TEACHER_COLOR_PALETTE[index % TEACHER_COLOR_PALETTE.length];
    });
    return colors;
  }

  function normalizeColor(value) {
    const color = cleanSelectValue(value);
    return /^#[0-9a-f]{6}$/i.test(color) ? color : "";
  }

  function normalizeServiceName(service) {
    const value = cleanSelectValue(service);
    if (value === "after1" || value === "방과후1" || value.includes("월화목토")) return "방과후(월화목토)";
    if (value === "after2" || value === "방과후2" || value.includes("수금토")) return "방과후(수금토)";
    return "주간";
  }

  function inferCategory(text = "") {
    if (text.includes("체육") || text.includes("운동")) return "physical";
    if (text.includes("미술") || text.includes("음악") || text.includes("공예")) return "creative";
    if (text.includes("기관") || text.includes("지역")) return "partner";
    if (text.includes("참여") || text.includes("자조")) return "participation";
    return "learning";
  }

  function serviceNameFromLegacy(type) {
    if (type === "after1") return "방과후(월화목토)";
    if (type === "after2") return "방과후(수금토)";
    return "주간";
  }

  function saveState(message = "저장되었습니다.", options = {}) {
    state.schemaVersion = 4;
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
    if (currentView === "people") renderPeople();
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
        <article class="panel metric learning span-4">
          <span>오늘 프로그램</span>
          <strong>${programs.length}</strong>
          <span>${programs.length ? "월간 프로그램에 등록됨" : "등록된 프로그램 없음"}</span>
        </article>
        <article class="panel metric vacation span-4">
          <span>휴가·송영</span>
          <strong>${moves.length}</strong>
          <span>${moves.length ? "오늘 확인할 항목" : "오늘 항목 없음"}</span>
        </article>
        <article class="panel metric records span-4">
          <span>시간표 입력</span>
          <strong>${openSchedules}</strong>
          <span>선택 완료된 항목</span>
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

        <section class="panel span-12 schedule-print-panel">
          <div class="panel-head">
            <h3>오늘 시간표</h3>
            <div class="panel-actions">
              <button class="ghost-button" data-print-schedule type="button">인쇄</button>
              <button class="ghost-button" data-view-jump="daily" type="button">시간표 편집</button>
            </div>
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
          <button class="primary-button" data-print-monthly type="button">월간 인쇄</button>
          <span class="muted">공휴일과 휴무일에는 프로그램을 등록하지 않습니다.</span>
        </div>
      </div>
      <div class="service-calendar-stack">
        ${SERVICE_CALENDARS.map((calendar) => renderProgramCalendar(monthlyCursor, calendar)).join("")}
      </div>
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
          <button class="primary-button" data-print-transport type="button">A4 인쇄</button>
          <span class="muted">휴무와 공휴일은 월간 프로그램 달력과 동일하게 표시됩니다.</span>
        </div>
      </div>
      ${renderTransportCalendar(vacationCursor)}
    `;
  }

  function renderProgramCalendar(cursor, calendar) {
    const days = monthGridDays(cursor, 0);
    const cells = days
      .map((date) => {
        const iso = toIsoDate(date);
        const outside = date.getMonth() !== cursor.getMonth();
        const day = date.getDay();
        const isToday = iso === todayIso;
        const holiday = holidayName(iso);
        const customClosed = isCustomClosed(iso);
        const closed = isClosedDate(iso);
        const allowed = calendar.allowedDays.includes(day) && !closed && !outside;
        const canOpen = calendar.allowedDays.includes(day) && !outside && !isSundayDate(iso) && !holiday;
        const items = programsForDate(iso).filter((program) => normalizeServiceName(program.service) === calendar.service);

        return `
          <div class="day-cell program-day ${outside ? "outside" : ""} ${isToday ? "today" : ""} ${closed ? "closed" : ""} ${!allowed ? "disabled" : ""}">
            <div class="day-top">
              <span class="day-number">${date.getDate()}</span>
              ${canOpen ? `<button class="add-dot" data-open-program-date="${h(iso)}" data-program-service="${h(calendar.service)}" type="button">+</button>` : ""}
            </div>
            ${holiday ? `<div class="holiday-label">${h(holiday)}</div>` : ""}
            ${customClosed ? `<button class="holiday-label closed-cancel" data-toggle-closed-date="${h(iso)}" type="button">휴무 취소</button>` : ""}
            <div class="chip-list">
              ${items
                .slice(0, 4)
                .map((item) => `<span class="chip category-${h(item.category)}">${h(shortProgramLabel(item))}</span>`)
                .join("")}
              ${items.length > 4 ? `<span class="chip">외 ${items.length - 4}건</span>` : ""}
            </div>
          </div>
        `;
      })
      .join("");

    return `
      <section class="service-calendar">
        <div class="service-calendar-head">
          <h3>${h(calendar.title)}</h3>
          <span>${h(formatMonth(cursor))}</span>
        </div>
        <div class="calendar program-calendar">
          <div class="calendar-weekdays">
            ${KOREAN_DAYS.map((day, index) => `<div class="${index === 0 ? "sunday" : ""}">${day}</div>`).join("")}
          </div>
          <div class="calendar-grid">
            ${cells}
          </div>
        </div>
      </section>
    `;
  }

  function renderTransportCalendar(cursor) {
    const weeks = transportCalendarWeeks(cursor);
    const rowTypes = MOVE_TYPES;

    return `
      <section class="transport-calendar transport-print-panel">
        <h3>${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월 <span class="green-text">주간</span> <span class="violet-text">방과후</span> 등하원 송영 / <span class="orange-text">휴가</span> / <span class="blue-text">반차</span></h3>
        <div class="transport-table-wrap">
          <table class="transport-table">
            <thead>
              <tr>
                <th>비고</th>
                ${["월", "화", "수", "목", "금", "토"].map((day) => `<th>${day}</th>`).join("")}
              </tr>
              <tr>
                <th>날짜</th>
                ${["", "", "", "", "", ""].map(() => `<th></th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${weeks
                .map((week) => {
                  const sunday = new Date(week[0]);
                  sunday.setDate(sunday.getDate() - 1);
                  return `
                    <tr class="date-row">
                      <th class="${transportDayClasses(sunday, cursor)}"><span>${sunday.getDate()}</span></th>
                      ${week
                        .map((date) => {
                          const iso = toIsoDate(date);
                          return `<td class="${transportDayClasses(date, cursor)}">
                            <span>${date.getDate()}</span>
                            ${!isClosedDate(iso) && date.getMonth() === cursor.getMonth() ? `<button class="add-dot small" data-open-move-date="${h(iso)}" type="button">+</button>` : ""}
                          </td>`;
                        })
                        .join("")}
                    </tr>
                    ${rowTypes
                      .map(
                        (row) => `
                          <tr class="${h(row.className)}">
                            <th>${h(row.label)}</th>
                            ${week
                              .map((date) => renderTransportCell(date, cursor, row.label))
                              .join("")}
                          </tr>
                        `
                      )
                      .join("")}
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
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

  function monthGridDays(cursor, weekStart = 0) {
    const first = startOfMonth(cursor);
    const start = new Date(first);
    const offset = (first.getDay() - weekStart + 7) % 7;
    start.setDate(first.getDate() - offset);
    const days = [];

    for (let i = 0; i < 42; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }

    return days;
  }

  function transportCalendarWeeks(cursor) {
    const first = startOfMonth(cursor);
    const start = new Date(first);
    const mondayOffset = (first.getDay() + 6) % 7;
    start.setDate(first.getDate() - mondayOffset);
    const weeks = [];

    for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
      const week = [];
      for (let dayIndex = 0; dayIndex < 6; dayIndex += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + weekIndex * 7 + dayIndex);
        week.push(date);
      }

      if (week.some((date) => date.getMonth() === cursor.getMonth())) weeks.push(week);
    }

    return weeks;
  }

  function transportDayClasses(date, cursor) {
    const iso = toIsoDate(date);
    return [
      date.getMonth() !== cursor.getMonth() ? "outside" : "",
      isClosedDate(iso) ? "closed" : "",
      KOREA_HOLIDAYS_2026[iso] ? "holiday" : ""
    ]
      .filter(Boolean)
      .join(" ");
  }

  function renderTransportCell(date, cursor, key) {
    const iso = toIsoDate(date);
    const outside = date.getMonth() !== cursor.getMonth();
    const closed = isClosedDate(iso);
    const label = closed ? closedDateLabel(iso) : "";
    const items = outside ? [] : movesForDate(iso).filter((item) => transportRowKey(item) === key);

    return `
      <td class="${outside ? "outside" : ""} ${closed ? "closed" : ""}">
        ${label && key === "휴가" ? `<div class="closed-text">${h(label)}</div>` : ""}
        ${items.map(renderTransportItem).join("")}
      </td>
    `;
  }

  function renderTransportItem(item) {
    const typeMeta = MOVE_TYPES.find((type) => type.label === item.type);
    const itemClass = typeMeta?.className === "note-row" ? "vacation" : typeMeta?.className === "half-row" ? "half" : "transport";
    return `<div class="transport-item ${itemClass}">${teacherBadge(item.person, item.person || "담당자 미정")}${item.memo ? ` <span>${h(item.memo)}</span>` : ""}</div>`;
  }

  function transportRowKey(item) {
    return normalizeMoveType(item);
  }

  function renderDaily() {
    ensureDailySchedule(dailyDate);
    removeAftercareAbsentUsers(dailyDate);
    const programOptions = programOptionsForDate(dailyDate);

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
          <button class="primary-button" data-print-schedule type="button">A4 인쇄</button>
          <span class="muted">같은 시간대의 교사와 이용인은 중복되지 않게 자동 정리됩니다.</span>
        </div>
      </div>
      <section class="daily-editor-section">
        <div class="timetable-shell">
          ${renderScheduleEditorTable(dailyDate, programOptions)}
          ${renderTeacherReportEditor(dailyDate)}
        </div>
      </section>
      <section class="panel schedule-print-panel">
        <div class="panel-head">
          <h3>인쇄 미리보기</h3>
          <button class="ghost-button" data-print-schedule type="button">인쇄</button>
        </div>
        <div class="panel-body print-preview-wrap">
          ${renderSchedulePrintSheet(dailyDate)}
        </div>
      </section>
    `;
  }

  function renderScheduleEditorTable(date, programOptions) {
    const rows = [];
    let aftercareBandAdded = false;

    state.settings.timeSlots.forEach((slot, index) => {
      if (index === 0) {
        rows.push(renderScheduleServiceBand("주간 활동 서비스", dayScheduleRangeLabel()));
      }

      if (isAftercareSlot(slot) && !aftercareBandAdded) {
        rows.push(renderScheduleServiceBand("방과후 활동 서비스", aftercareScheduleRangeLabel(), "aftercare-band"));
        aftercareBandAdded = true;
      }

      rows.push(
        renderScheduleSlotRows(date, slot, programOptions, {
          showAftercareInfo: isAftercareSlot(slot) && slot === firstAftercareSlot(),
          aftercareRowSpan: aftercareEditorRowSpan(date)
        })
      );
    });

    return `
      <datalist id="schedule-program-options">
        ${programOptions
          .filter(Boolean)
          .map((option) => `<option value="${h(option)}"></option>`)
          .join("")}
      </datalist>
      <table class="schedule-editor-table">
        <thead>
          <tr>
            <th>시간</th>
            <th>프로그램</th>
            <th>교실</th>
            <th>담당 교사</th>
            <th>이용인</th>
            <th>휴게</th>
            <th>서류</th>
            <th>데스크</th>
          </tr>
        </thead>
        <tbody>
          ${rows.join("")}
        </tbody>
      </table>
    `;
  }

  function renderScheduleServiceBand(label, range, className = "") {
    return `
      <tr class="service-band ${h(className)}">
        <th colspan="8">${h(label)} (${h(range)})</th>
      </tr>
    `;
  }

  function renderScheduleSlotRows(date, slot, programOptions, options = {}) {
    const slotRecord = getScheduleSlot(date, slot);
    const groups = slotRecord.groups.length ? slotRecord.groups : [blankScheduleGroup()];
    const rowSpan = groups.length;
    const aftercare = isAftercareSlot(slot);
    const programSpans = programMergeSpans(groups);

    return groups
      .map((group, index) => {
        const groupTeachers = new Set(groups.filter((item) => item.id !== group.id).map((item) => item.teacher).filter(Boolean));
        const blockedTeachers = aftercare ? groupTeachers : new Set([...groupTeachers, ...supportValues(slotRecord)]);
        const mergedProgramIds = programSpans[index] > 0 ? groups.slice(index, index + programSpans[index]).map((item) => item.id).join(",") : "";

        return `
          <tr class="schedule-group-row">
            ${index === 0 ? `<th class="time-label" rowspan="${rowSpan}">${formatSlotLabel(slot)}</th>` : ""}
            ${
              programSpans[index] > 0
                ? `<td rowspan="${programSpans[index]}">
                    <input class="schedule-program-input" list="schedule-program-options" data-schedule-group-field="program" data-slot="${h(slot)}" data-group-id="${h(group.id)}" data-merged-group-ids="${h(mergedProgramIds)}" value="${h(group.program)}" placeholder="프로그램 선택 또는 직접 입력" aria-label="${h(slot)} 프로그램" />
                  </td>`
                : ""
            }
            <td>
              <select data-schedule-group-field="room" data-slot="${h(slot)}" data-group-id="${h(group.id)}" aria-label="${h(slot)} 교실">
                ${["", ...state.settings.rooms].filter(unique).map((room) => renderOption(room, group.room, "교실 선택")).join("")}
              </select>
            </td>
            <td>
              <select data-schedule-group-field="teacher" data-slot="${h(slot)}" data-group-id="${h(group.id)}" aria-label="${h(slot)} 담당 교사">
                ${renderTeacherOptions(group.teacher, blockedTeachers, "교사 선택")}
              </select>
              <div class="group-actions">
                <button class="mini-button" data-add-schedule-group="${h(slot)}" type="button">+ 그룹 추가</button>
                ${groups.length > 1 ? `<button class="mini-button danger-mini" data-remove-schedule-group="${h(group.id)}" data-slot="${h(slot)}" type="button">삭제</button>` : ""}
              </div>
            </td>
            <td>
              ${renderUserPicker(date, slot, groups, group)}
            </td>
            ${
              index === 0
                ? aftercare
                  ? options.showAftercareInfo
                    ? `<td class="aftercare-info-cell" rowspan="${options.aftercareRowSpan || rowSpan}" colspan="3">${renderAftercareInfo(date)}</td>`
                    : ""
                  : SUPPORT_FIELDS.map(
                      (field) => `
                        <td rowspan="${rowSpan}">
                          ${renderSupportSelect(slot, slotRecord, field)}
                        </td>
                      `
                    ).join("")
                : ""
            }
          </tr>
        `;
      })
      .join("");
  }

  function programMergeSpans(groups) {
    const spans = Array(groups.length).fill(1);
    let index = 0;

    while (index < groups.length) {
      const program = cleanSelectValue(groups[index]?.program);
      let span = 1;

      while (program && index + span < groups.length && cleanSelectValue(groups[index + span]?.program) === program) {
        span += 1;
      }

      spans[index] = span;
      for (let offset = 1; offset < span; offset += 1) {
        spans[index + offset] = 0;
      }

      index += span;
    }

    return spans;
  }

  function renderAftercareInfo(date) {
    const value = getAftercareInfo(date);
    const timeOptions = aftercareTimeOptions();
    const users = allowedUsersForSlot(firstAftercareSlot() || "");
    return `
      <div class="aftercare-info" data-aftercare-info>
        <strong>등하원 정보 및 전달 사항</strong>
        <div class="aftercare-add-row">
          <select data-aftercare-draft="type" aria-label="등하원 구분">
            ${AFTERCARE_INFO_TYPES.map((type) => `<option value="${h(type)}">${h(type)}</option>`).join("")}
          </select>
          <select data-aftercare-draft="user" aria-label="이용인 선택" multiple size="${Math.min(5, Math.max(3, users.length))}">
            ${users.map((user) => `<option value="${h(user)}">${h(user)}</option>`).join("")}
          </select>
          <select data-aftercare-draft="time" aria-label="시간 선택" disabled>
            <option value="">시간 선택</option>
            ${timeOptions.map((time) => `<option value="${h(time)}">${h(time)}</option>`).join("")}
          </select>
          <button class="mini-button" data-add-aftercare-item type="button">추가</button>
        </div>
        <div class="aftercare-entry-list">
          ${
            value.items.length
              ? value.items
                  .map(
                    (item) => `
                      <div class="aftercare-entry">
                        <span>${h(item.type)} · ${h(item.user)}${item.time ? ` · ${h(item.time)}` : ""}</span>
                        <button class="mini-button danger-mini" data-remove-aftercare-item="${h(item.id)}" type="button">삭제</button>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty compact">등록된 등하원 정보가 없습니다.</div>`
          }
        </div>
        <label class="full">
          <span>전달사항</span>
          <textarea data-aftercare-field="memo" rows="2" placeholder="전달사항">${h(value.memo)}</textarea>
        </label>
      </div>
    `;
  }

  function renderTeacherReportEditor(date) {
    const reports = getTeacherReports(date);
    const teachers = reportTeachersForDate(date);
    const hiddenTeachers = reportHiddenTeachers(date);
    const vacationTeachers = vacationTeachersForDate(date);
    const restorableTeachers = (state.settings.teachers || []).filter((teacher) => hiddenTeachers.has(teacher) && !vacationTeachers.has(teacher));

    return `
      <section class="teacher-report-editor">
        <h3>교사별 주요 보고 업무</h3>
        <div class="teacher-report-grid">
          ${
            teachers.length
              ? teachers
                  .map(
                    (teacher) => `
                      <div class="teacher-report-field">
                        <div class="teacher-report-name">
                          ${teacherBadge(teacher, teacher)}
                          <button class="teacher-report-remove" data-hide-report-teacher="${h(teacher)}" type="button" aria-label="${h(teacher)} 보고 업무에서 제외">×</button>
                        </div>
                        <textarea data-report-field="${h(teacher)}" rows="2" placeholder="보고 업무">${h(reports[teacher] || "")}</textarea>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty compact">등록된 교사가 없습니다.</div>`
          }
        </div>
        ${
          restorableTeachers.length
            ? `<div class="teacher-report-hidden">
                ${restorableTeachers
                  .map(
                    (teacher) => `
                      <button class="mini-button" data-show-report-teacher="${h(teacher)}" type="button">+ ${teacherBadge(teacher, teacher)}</button>
                    `
                  )
                  .join("")}
              </div>`
            : ""
        }
      </section>
    `;
  }

  function renderUserPicker(date, slot, groups, group) {
    const selected = new Set(normalizeUserList(group.users));
    const usedByOtherGroups = new Set(groups.filter((item) => item.id !== group.id).flatMap((item) => normalizeUserList(item.users)));
    const allowedGroups = allowedUserGroupsForSlot(slot);
    const absentUsers = isAftercareSlot(slot) ? absentAftercareUsers(date) : new Set();

    return `
      <div class="people-picker" data-schedule-group data-slot="${h(slot)}" data-group-id="${h(group.id)}">
        ${USER_GROUPS.filter((userGroup) => allowedGroups.includes(userGroup.key)).map((userGroup) => {
            const users = state.settings.userGroups?.[userGroup.key] || [];
            if (!users.length) return "";
            return `
              <div class="picker-group-label">${h(userGroup.label)}</div>
              ${users
                .map((user) => {
                  const isChecked = selected.has(user);
                  const isAbsent = absentUsers.has(user);
                  const isDisabled = isAbsent || (!isChecked && usedByOtherGroups.has(user));
                  return `
                    <label class="check-row ${isDisabled ? "disabled" : ""}">
                      <input data-schedule-user type="checkbox" value="${h(user)}" ${isChecked ? "checked" : ""} ${isDisabled ? "disabled" : ""} />
                      <span>${h(user)}${isAbsent ? " (결석)" : ""}</span>
                    </label>
                  `;
                })
                .join("")}
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderSupportSelect(slot, slotRecord, field) {
    const groupTeachers = new Set(slotRecord.groups.map((group) => group.teacher).filter(Boolean));
    const otherSupport = new Set(SUPPORT_FIELDS.filter((item) => item !== field).map((item) => slotRecord[item]).filter(Boolean));
    const blocked = new Set([...groupTeachers, ...otherSupport]);

    return `
      <select data-schedule-support-field="${h(field)}" data-slot="${h(slot)}" aria-label="${h(slot)} ${h(SUPPORT_LABELS[field])}">
        ${renderTeacherOptions(slotRecord[field], blocked, `${SUPPORT_LABELS[field]} 선택`)}
      </select>
    `;
  }

  function renderTeacherOptions(selected, blocked, emptyLabel) {
    return ["", ...state.settings.teachers]
      .filter(unique)
      .map((teacher) => {
        const disabled = teacher && teacher !== selected && blocked.has(teacher);
        return renderOption(teacher, selected, emptyLabel, disabled);
      })
      .join("");
  }

  function renderOption(value, selected, emptyLabel, disabled = false) {
    return `<option value="${h(value)}" ${selected === value ? "selected" : ""} ${disabled ? "disabled" : ""}>${h(value || emptyLabel)}</option>`;
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
                  ${flattenUserGroups().map((user) => `<option value="${h(user)}">${h(user)}</option>`).join("")}
                </select>
              </label>
              <label class="field">
                <span>관찰자</span>
                <select name="teacher">
                  ${state.settings.teachers.map((teacher) => `<option value="${h(teacher)}">${h(teacher)}</option>`).join("")}
                </select>
              </label>
              <label class="field">
                <span>관찰 시간</span>
                <input name="activity" placeholder="예: 10:00~10:30" />
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
            <button class="ghost-button" data-print-observations type="button">선택 인쇄</button>
          </div>
          <div class="panel-body">
            ${
              observations.length
                ? `<div class="list">${observations
                    .map(
                      (item) => `
                        <article class="list-item">
                          <label class="select-line">
                            <input data-observation-print-select type="checkbox" value="${h(item.id)}" />
                            <strong>${h(item.user || "이용인 미지정")} · ${h(item.activity || "관찰 시간 미입력")}</strong>
                          </label>
                          <small>${h(formatShortDate(item.date))} / ${teacherBadge(item.teacher, "관찰자 미지정")}</small>
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
            ${observations.length ? `<div class="observation-print-area">${renderObservationPrintSheet(observations)}</div>` : ""}
          </div>
        </section>
      </div>
    `;
  }

  function renderObservationPrintSheet(observations) {
    return `
      <section class="observation-print-sheet">
        <h3>송정우리 관찰일지</h3>
        ${observations
          .map(
            (item) => `
              <article class="observation-print-item" data-observation-print-item="${h(item.id)}">
                <header>
                  <strong>${h(item.user || "이용인 미지정")}</strong>
                  <span>${h(formatShortDate(item.date))} / ${teacherBadge(item.teacher, "관찰자 미지정")} / ${h(item.activity || "관찰 시간 미입력")}</span>
                </header>
                <p>${h(item.summary)}</p>
              </article>
            `
          )
          .join("")}
      </section>
    `;
  }

  function renderStats() {
    const periods = workStatPeriods();

    app.innerHTML = `
      <div class="work-stats-stack">
        ${periods.map(renderWorkStatsPanel).join("")}
      </div>
    `;
  }

  function renderWorkStatsPanel(period) {
    const stats = computeWorkStats(period.dates);
    const rows = stats.rows
      .map(
        (row) => `
          <tr>
            <th>${teacherBadge(row.teacher, row.teacher)}</th>
            <td>${formatMinutes(row.lesson)}</td>
            <td>${formatMinutes(row.rest)}</td>
            <td>${formatMinutes(row.docs)}</td>
            <td>${formatMinutes(row.desk)}</td>
            <td>${formatMinutes(row.total)}</td>
          </tr>
        `
      )
      .join("");

    return `
      <section class="panel work-stats-panel">
        <div class="panel-head">
          <div>
            <h3>${h(period.label)}</h3>
            <span class="muted">${h(period.caption)}</span>
          </div>
        </div>
        <div class="panel-body">
          <div class="stats-summary-grid">
            <article><strong>${formatMinutes(stats.totals.lesson)}</strong><span>총 담당 수업</span></article>
            <article><strong>${formatMinutes(stats.totals.rest)}</strong><span>총 휴게</span></article>
            <article><strong>${formatMinutes(stats.totals.docs)}</strong><span>총 서류</span></article>
            <article><strong>${formatMinutes(stats.totals.desk)}</strong><span>총 데스크</span></article>
          </div>
          ${
            rows
              ? `<table class="work-stats-table">
                  <thead>
                    <tr>
                      <th>교사</th>
                      <th>담당 수업</th>
                      <th>휴게</th>
                      <th>서류</th>
                      <th>데스크</th>
                      <th>합계</th>
                    </tr>
                  </thead>
                  <tbody>${rows}</tbody>
                </table>`
              : `<div class="empty">해당 기간에 입력된 시간표가 없습니다.</div>`
          }
        </div>
      </section>
    `;
  }

  function workStatPeriods() {
    const today = parseIsoDate(todayIso);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const monthStart = startOfMonth(today);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return [
      { label: "오늘", caption: formatLongDate(todayIso), dates: [todayIso] },
      { label: "이번 주", caption: `${formatShortDate(toIsoDate(weekStart))} ~ ${formatShortDate(toIsoDate(weekEnd))}`, dates: datesBetween(weekStart, weekEnd) },
      { label: "이번 달", caption: formatMonth(today), dates: datesBetween(monthStart, monthEnd) }
    ];
  }

  function computeWorkStats(dates) {
    const byTeacher = {};
    const totals = { lesson: 0, rest: 0, docs: 0, desk: 0 };

    (state.settings.teachers || []).forEach((teacher) => {
      byTeacher[teacher] = { teacher, lesson: 0, rest: 0, docs: 0, desk: 0, total: 0 };
    });

    dates.forEach((date) => {
      const daySchedule = state.dailySchedules?.[date];
      if (!daySchedule) return;

      (state.settings.timeSlots || []).forEach((slot) => {
        const duration = slotDurationMinutes(slot);
        if (!duration) return;

        const slotRecord = normalizeScheduleSlot(daySchedule[slot]);
        slotRecord.groups.forEach((group) => {
          if (group.teacher) addWorkMinutes(byTeacher, totals, group.teacher, "lesson", duration);
        });

        if (!isAftercareSlot(slot)) {
          SUPPORT_FIELDS.forEach((field) => {
            if (slotRecord[field]) addWorkMinutes(byTeacher, totals, slotRecord[field], field, duration);
          });
        }
      });
    });

    const rows = Object.values(byTeacher)
      .map((row) => ({ ...row, total: row.lesson + row.rest + row.docs + row.desk }))
      .filter((row) => row.total > 0)
      .sort((a, b) => b.total - a.total || a.teacher.localeCompare(b.teacher));

    return { rows, totals };
  }

  function addWorkMinutes(byTeacher, totals, teacher, field, minutes) {
    const name = cleanSelectValue(teacher);
    if (!name) return;
    if (!byTeacher[name]) byTeacher[name] = { teacher: name, lesson: 0, rest: 0, docs: 0, desk: 0, total: 0 };
    byTeacher[name][field] += minutes;
    totals[field] += minutes;
  }

  function slotDurationMinutes(slot) {
    const [start, end] = String(slot || "").split("~");
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    return endMinutes > startMinutes ? endMinutes - startMinutes : 0;
  }

  function timeToMinutes(value) {
    const [hour, minute] = String(value || "").split(":").map(Number);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
    return hour * 60 + minute;
  }

  function datesBetween(startDate, endDate) {
    const dates = [];
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      dates.push(toIsoDate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }

  function formatMinutes(minutes) {
    const total = Math.max(0, Number(minutes) || 0);
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    if (!hours) return `${mins}분`;
    if (!mins) return `${hours}시간`;
    return `${hours}시간 ${mins}분`;
  }

  function renderPeople() {
    syncUsersFromGroups();

    app.innerHTML = `
      <div class="dashboard-grid">
        <section class="panel span-8">
          <div class="panel-head">
            <h3>이용인 관리</h3>
          </div>
          <div class="panel-body">
            <div class="people-management-grid">
              ${USER_GROUPS.map(renderUserGroupCard).join("")}
            </div>
          </div>
        </section>
        <section class="panel span-4">
          <div class="panel-head">
            <h3>교사 관리</h3>
          </div>
          <div class="panel-body">
            <form class="inline-add-form" data-add-teacher-form>
              <input name="name" placeholder="교사 이름" autocomplete="off" />
              <button class="primary-button" type="submit">추가</button>
            </form>
            <div class="people-list teacher-list">
              ${state.settings.teachers.map(renderTeacherRow).join("") || `<div class="empty">등록된 교사가 없습니다.</div>`}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderUserGroupCard(group) {
    const users = state.settings.userGroups?.[group.key] || [];

    return `
      <article class="people-card">
        <header>
          <div>
            <h4>${h(group.label)}</h4>
            <span>${users.length}명</span>
          </div>
        </header>
        <form class="inline-add-form" data-add-user-form data-user-group="${h(group.key)}">
          <input name="name" placeholder="이용인 이름" autocomplete="off" />
          <button class="primary-button" type="submit">추가</button>
        </form>
        <div class="people-list">
          ${users.map((user) => renderUserRow(group.key, user)).join("") || `<div class="empty">등록된 이용인이 없습니다.</div>`}
        </div>
      </article>
    `;
  }

  function renderUserRow(groupKey, user) {
    return `
      <div class="person-row">
        <input data-user-edit value="${h(user)}" aria-label="${h(user)} 이름 수정" />
        <button class="ghost-button" data-update-user="${h(user)}" data-user-group="${h(groupKey)}" type="button">수정</button>
        <button class="danger-button" data-delete-user="${h(user)}" data-user-group="${h(groupKey)}" type="button">삭제</button>
      </div>
    `;
  }

  function renderTeacherRow(teacher) {
    const color = teacherColor(teacher);
    return `
      <div class="person-row teacher-row">
        <input data-teacher-edit value="${h(teacher)}" aria-label="${h(teacher)} 이름 수정" />
        <input class="teacher-color-input" data-teacher-color type="color" value="${h(color)}" aria-label="${h(teacher)} 색상" />
        <button class="ghost-button" data-update-teacher="${h(teacher)}" type="button">수정</button>
        <button class="danger-button" data-delete-teacher="${h(teacher)}" type="button">삭제</button>
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
            ${renderTextareaSetting("rooms", "장소", state.settings.rooms)}
            ${renderTextareaSetting("timeSlots", "시간표 시간", state.settings.timeSlots)}
            ${renderTextareaSetting("majorThemes", "대주제 후보", state.majorThemes)}
            <div class="setting-card">
              <h4>이용인·교사 명단</h4>
              <span class="muted">명단 추가, 수정, 삭제는 왼쪽 메뉴의 이용인·교사 탭에서 관리합니다.</span>
              <button class="ghost-button" data-view-jump="people" type="button">명단 관리 열기</button>
            </div>
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
                <strong>${h(item.type)} · ${teacherBadge(item.person, item.person || "대상 미정")}</strong>
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

    return `
      ${renderTodayTeacherSummary(todayIso)}
      <div class="print-preview-wrap today-schedule-preview">${renderSchedulePrintSheet(todayIso)}</div>
    `;
  }

  function renderTodayTeacherSummary(date) {
    const teachers = workingTeachersForDate(date);
    if (!teachers.length) return `<div class="empty compact">출근한 교사가 없습니다.</div>`;

    if (!selectedTodayTeacher || !teachers.includes(selectedTodayTeacher)) {
      selectedTodayTeacher = teachers[0];
    }

    const assignments = teacherAssignmentsForDate(date, selectedTodayTeacher);

    return `
      <section class="today-teacher-summary">
        <div class="teacher-work-buttons" aria-label="출근 교사">
          ${teachers
            .map(
              (teacher) => `
                <button class="teacher-work-button ${teacher === selectedTodayTeacher ? "active" : ""}" data-select-today-teacher="${h(teacher)}" type="button">
                  ${teacherBadge(teacher, teacher)}
                </button>
              `
            )
            .join("")}
        </div>
        <div class="teacher-work-detail">
          <strong>${teacherBadge(selectedTodayTeacher, selectedTodayTeacher)} 배치 확인</strong>
          ${
            assignments.length
              ? `<div class="teacher-work-list">
                  ${assignments
                    .map(
                      (item) => `
                        <div class="teacher-work-item">
                          <span class="work-time">${h(formatSlotText(item.slot))}</span>
                          <span class="work-kind">${h(item.kind)}</span>
                          <span class="work-detail">${h(item.detail)}</span>
                        </div>
                      `
                    )
                    .join("")}
                </div>`
              : `<div class="empty compact">오늘 배정된 수업, 휴게, 서류, 데스크가 없습니다.</div>`
          }
        </div>
      </section>
    `;
  }

  function teacherAssignmentsForDate(date, teacher) {
    ensureDailySchedule(date);
    const rows = [];

    state.settings.timeSlots.forEach((slot) => {
      const slotRecord = getScheduleSlot(date, slot);

      slotRecord.groups.forEach((group) => {
        if (group.teacher !== teacher) return;
        rows.push({
          slot,
          kind: "수업",
          detail: [group.program || "프로그램 미입력", group.room, normalizeUserList(group.users).join(", ")]
            .filter(Boolean)
            .join(" / ")
        });
      });

      if (!isAftercareSlot(slot)) {
        SUPPORT_FIELDS.forEach((field) => {
          if (slotRecord[field] !== teacher) return;
          rows.push({
            slot,
            kind: SUPPORT_LABELS[field] || field,
            detail: `${SUPPORT_LABELS[field] || field} 배정`
          });
        });
      }
    });

    return rows;
  }

  function workingTeachersForDate(date) {
    const vacationTeachers = vacationTeachersForDate(date);
    return (state.settings.teachers || []).filter((teacher) => !vacationTeachers.has(teacher));
  }

  function renderSchedulePrintSheet(date) {
    ensureDailySchedule(date);
    const rows = [];
    let aftercareBandAdded = false;

    state.settings.timeSlots.forEach((slot, index) => {
      if (index === 0) {
        rows.push(renderScheduleServiceBand("주간 활동 서비스", dayScheduleRangeLabel()));
      }

      if (isAftercareSlot(slot) && !aftercareBandAdded) {
        rows.push(renderScheduleServiceBand("방과후 활동 서비스", aftercareScheduleRangeLabel(), "aftercare-band"));
        aftercareBandAdded = true;
      }

      rows.push(
        renderSchedulePrintRows(date, slot, {
          showAftercareInfo: isAftercareSlot(slot) && slot === firstAftercareSlot(),
          aftercareRowSpan: aftercareEditorRowSpan(date)
        })
      );
    });

    return `
      <article class="print-sheet">
        <header class="print-sheet-head">
          <div>
            <strong>송정우리 일별 시간표</strong>
            <span>${h(formatLongDate(date))}</span>
          </div>
        </header>
        <table class="print-timetable">
          <thead>
            <tr>
              <th>시간</th>
              <th>프로그램</th>
              <th>교실</th>
              <th>담당 교사</th>
              <th>이용인</th>
              <th>휴게</th>
              <th>서류</th>
              <th>데스크</th>
            </tr>
          </thead>
          <tbody>
            ${rows.join("")}
          </tbody>
        </table>
        ${renderTeacherReportPrint(date)}
      </article>
    `;
  }

  function renderSchedulePrintRows(date, slot, options = {}) {
    const slotRecord = getScheduleSlot(date, slot);
    const groups = (slotRecord.groups || []).filter(scheduleGroupHasContent);
    if (!groups.length) groups.push(blankScheduleGroup());
    const rowSpan = groups.length;
    const aftercare = isAftercareSlot(slot);
    const programSpans = programMergeSpans(groups);

    return groups
      .map(
        (group, index) => `
          <tr>
            ${index === 0 ? `<th class="time-label" rowspan="${rowSpan}">${formatSlotLabel(slot)}</th>` : ""}
            ${programSpans[index] > 0 ? `<td rowspan="${programSpans[index]}">${h(group.program || "")}</td>` : ""}
            <td>${h(group.room || "")}</td>
            <td>${teacherBadge(group.teacher, "")}</td>
            <td>${h(normalizeUserList(group.users).join(", "))}</td>
            ${
              index === 0
                ? aftercare
                  ? options.showAftercareInfo
                    ? `<td class="aftercare-print-cell" colspan="3" rowspan="${options.aftercareRowSpan || rowSpan}">${renderAftercarePrint(getAftercareInfo(date))}</td>`
                    : ""
                  : `<td rowspan="${rowSpan}">${teacherBadge(slotRecord.rest, "")}</td>
                     <td rowspan="${rowSpan}">${teacherBadge(slotRecord.docs, "")}</td>
                     <td rowspan="${rowSpan}">${teacherBadge(slotRecord.desk, "")}</td>`
                : ""
            }
          </tr>
        `
      )
      .join("");
  }

  function renderAftercarePrint(info) {
    const value = normalizeAfterInfo(info);
    const rows = value.items.map((item) => [item.type, `${item.user}${item.time ? ` ${item.time}` : ""}`]);
    if (value.memo) rows.push(["전달", value.memo]);

    if (!rows.length) return "";

    return `
      <div class="aftercare-print">
        <strong>등하원 정보 및 전달 사항</strong>
        ${rows.map(([label, text]) => `<span><b>${h(label)}</b> ${h(text)}</span>`).join("")}
      </div>
    `;
  }

  function renderTeacherReportPrint(date) {
    const reports = getTeacherReports(date);
    const teachers = reportTeachersForDate(date);
    if (!teachers.length) return "";
    const pairs = [];
    for (let index = 0; index < teachers.length; index += 2) {
      pairs.push([teachers[index], teachers[index + 1] || ""]);
    }

    return `
      <table class="teacher-report-print">
        <tbody>
          <tr>
            <th colspan="4">■ 교사별 업무 보고</th>
          </tr>
          ${pairs
            .map(
              ([left, right]) => `
                <tr>
                  <td class="report-teacher-name">${teacherBadge(left, left)}</td>
                  <td>${h(reports[left] || "-")}</td>
                  ${right ? `<td class="report-teacher-name">${teacherBadge(right, right)}</td><td>${h(reports[right] || "-")}</td>` : `<td class="report-teacher-name"></td><td></td>`}
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  function openProgramModal(date, servicePreset = "") {
    const programs = programsForDate(date);
    const selectedService = normalizeServiceName(servicePreset || SERVICE_CALENDARS[0].service);
    const closed = isClosedDate(date);
    const customClosed = isCustomClosed(date);
    const canToggleClosed = !isSundayDate(date) && !holidayName(date);

    modalRoot.innerHTML = `
      <div class="modal-backdrop" role="presentation">
        <section class="modal wide" role="dialog" aria-modal="true" aria-labelledby="program-modal-title">
          <div class="modal-head">
            <h3 id="program-modal-title">${h(formatLongDate(date))} 프로그램 편집</h3>
            <button class="icon-button" data-close-modal type="button" aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            ${
              canToggleClosed
                ? `<div class="notice modal-notice">
                    <span>${customClosed ? "이 날짜는 휴무로 지정되어 있습니다." : "필요하면 이 날짜를 휴무로 지정할 수 있습니다."}</span>
                    <button class="ghost-button" data-toggle-closed-date="${h(date)}" type="button">${customClosed ? "휴무 취소" : "휴무 지정"}</button>
                  </div>`
                : ""
            }
            ${closed ? `<p class="notice">휴무일에는 프로그램을 추가하지 않습니다. 휴무를 취소하면 다시 추가할 수 있습니다.</p>` : ""}
            <form id="program-form" class="field-grid three" ${closed ? "hidden" : ""}>
              <input name="date" type="hidden" value="${h(date)}" />
              <input name="service" type="hidden" value="${h(selectedService)}" />
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
                              <small>${h(categoryName(program.category))} / ${h(program.session)}차시</small>
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
            <form id="move-form" class="field-grid">
              <input name="date" type="hidden" value="${h(date)}" />
              <label class="field">
                <span>구분</span>
                <select name="type" required>
                  ${MOVE_TYPES.map((type) => `<option value="${h(type.label)}">${h(type.label)}</option>`).join("")}
                </select>
              </label>
              <div class="field teacher-picker-field">
                <span>담당교사</span>
                <div class="teacher-picker">
                  ${state.settings.teachers
                    .map(
                      (teacher) => `
                        <label class="check-row">
                          <input name="persons" type="checkbox" value="${h(teacher)}" />
                          <span>${teacherBadge(teacher)}</span>
                        </label>
                      `
                    )
                    .join("")}
                </div>
              </div>
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
                              <strong>${h(item.type)} · ${teacherBadge(item.person, item.person)}</strong>
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
            <p class="notice">현재 저장 방식: ${shared.available ? "공동저장" : "로컬 저장"}${shared.available ? " · 다른 기기와 함께 봅니다." : " · 이 기기 안에 저장됩니다."}</p>
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
      time: "",
      teacher: "",
      room: ""
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
    const date = String(data.get("date") || todayIso);
    const people = data
      .getAll("persons")
      .map(cleanSelectValue)
      .filter(Boolean)
      .filter(unique);

    if (!people.length) {
      setSyncStatus("담당교사를 선택해주세요.");
      return;
    }

    const entries = people.map((person) =>
      normalizeMove({
        date,
        type: data.get("type"),
        person,
        time: "",
        route: "",
        memo: String(data.get("memo") || "").trim()
      })
    );

    state.vacationTransport.push(...entries);
    saveState("휴가·송영 항목이 추가되었습니다.");
    render();
    openMoveModal(date);
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
    state.settings.rooms = splitLines(data.get("rooms"));
    state.settings.timeSlots = splitLines(data.get("timeSlots"));
    state.majorThemes = splitLines(data.get("majorThemes"));
    state.settings.adminPin = String(data.get("adminPin") || "0000");
    saveState("기본 설정이 저장되었습니다.");
    render();
  }

  function addUser(form) {
    const groupKey = form.dataset.userGroup;
    const name = cleanSelectValue(new FormData(form).get("name"));
    if (!name) return;

    syncUsersFromGroups();
    if (!state.settings.userGroups[groupKey]) return;

    if (flattenUserGroups().includes(name)) {
      setSyncStatus("이미 등록된 이용인입니다.");
      return;
    }

    state.settings.userGroups[groupKey].push(name);
    syncUsersFromGroups();
    saveState("이용인이 추가되었습니다.");
    renderPeople();
  }

  function updateUser(button) {
    const groupKey = button.dataset.userGroup;
    const oldName = button.dataset.updateUser;
    const input = button.closest(".person-row")?.querySelector("[data-user-edit]");
    const newName = cleanSelectValue(input?.value);
    if (!newName || !state.settings.userGroups[groupKey]) return;
    if (newName === oldName) return;

    const otherUsers = flattenUserGroups().filter((user) => user !== oldName);
    if (otherUsers.includes(newName)) {
      setSyncStatus("이미 등록된 이용인 이름입니다.");
      input.value = oldName;
      return;
    }

    state.settings.userGroups[groupKey] = state.settings.userGroups[groupKey].map((user) => (user === oldName ? newName : user));
    replaceUserInRecords(oldName, newName);
    syncUsersFromGroups();
    saveState("이용인 이름이 수정되었습니다.");
    renderPeople();
  }

  function deleteUser(button) {
    const groupKey = button.dataset.userGroup;
    const name = button.dataset.deleteUser;
    if (!state.settings.userGroups[groupKey]) return;

    state.settings.userGroups[groupKey] = state.settings.userGroups[groupKey].filter((user) => user !== name);
    removeUserFromRecords(name);
    syncUsersFromGroups();
    saveState("이용인이 삭제되었습니다.");
    renderPeople();
  }

  function addTeacher(form) {
    const name = cleanSelectValue(new FormData(form).get("name"));
    if (!name) return;

    if (state.settings.teachers.includes(name)) {
      setSyncStatus("이미 등록된 교사입니다.");
      return;
    }

    state.settings.teachers.push(name);
    state.settings.teacherColors[name] = TEACHER_COLOR_PALETTE[state.settings.teachers.length % TEACHER_COLOR_PALETTE.length];
    saveState("교사가 추가되었습니다.");
    renderPeople();
  }

  function updateTeacher(button) {
    const oldName = button.dataset.updateTeacher;
    const row = button.closest(".person-row");
    const input = row?.querySelector("[data-teacher-edit]");
    const colorInput = row?.querySelector("[data-teacher-color]");
    const newName = cleanSelectValue(input?.value);
    const nextColor = normalizeColor(colorInput?.value) || teacherColor(oldName);
    if (!newName) return;

    if (newName !== oldName && state.settings.teachers.includes(newName)) {
      setSyncStatus("이미 등록된 교사 이름입니다.");
      input.value = oldName;
      return;
    }

    state.settings.teachers = state.settings.teachers.map((teacher) => (teacher === oldName ? newName : teacher));
    delete state.settings.teacherColors[oldName];
    state.settings.teacherColors[newName] = nextColor;
    if (oldName !== newName) replaceTeacherInRecords(oldName, newName);
    saveState("교사 이름이 수정되었습니다.");
    renderPeople();
  }

  function deleteTeacher(name) {
    state.settings.teachers = state.settings.teachers.filter((teacher) => teacher !== name);
    delete state.settings.teacherColors[name];
    removeTeacherFromRecords(name);
    saveState("교사가 삭제되었습니다.");
    renderPeople();
  }

  function toggleClosedDate(date) {
    if (isSundayDate(date) || holidayName(date)) return;
    const reopenModal = Boolean(modalRoot.innerHTML);
    const servicePreset = modalRoot.querySelector('input[name="service"]')?.value || "";
    state.closedDates = state.closedDates || [];

    if (state.closedDates.includes(date)) {
      state.closedDates = state.closedDates.filter((item) => item !== date);
      saveState("휴무가 취소되었습니다.");
    } else {
      state.closedDates.push(date);
      saveState("휴무가 지정되었습니다.");
    }

    render();
    if (reopenModal) openProgramModal(date, servicePreset);
  }

  function replaceUserInRecords(oldName, newName) {
    Object.values(state.dailySchedules || {}).forEach((daySchedule) => {
      Object.values(daySchedule || {}).forEach((slotRecord) => {
        if (!Array.isArray(slotRecord?.groups)) return;
        slotRecord.groups.forEach((group) => {
          group.users = normalizeUserList(group.users).map((user) => (user === oldName ? newName : user));
        });
      });
    });

    state.observations = state.observations.map((entry) => ({
      ...entry,
      user: entry.user === oldName ? newName : entry.user
    }));
  }

  function removeUserFromRecords(name) {
    Object.values(state.dailySchedules || {}).forEach((daySchedule) => {
      Object.values(daySchedule || {}).forEach((slotRecord) => {
        if (!Array.isArray(slotRecord?.groups)) return;
        slotRecord.groups.forEach((group) => {
          group.users = normalizeUserList(group.users).filter((user) => user !== name);
        });
      });
    });

    state.observations = state.observations.map((entry) => ({
      ...entry,
      user: entry.user === name ? "" : entry.user
    }));
  }

  function replaceTeacherInRecords(oldName, newName) {
    state.monthlyPrograms = state.monthlyPrograms.map((program) => ({
      ...program,
      teacher: program.teacher === oldName ? newName : program.teacher
    }));

    state.vacationTransport = state.vacationTransport.map((entry) => ({
      ...entry,
      person: entry.person === oldName ? newName : entry.person
    }));

    state.observations = state.observations.map((entry) => ({
      ...entry,
      teacher: entry.teacher === oldName ? newName : entry.teacher
    }));

    Object.values(state.dailySchedules || {}).forEach((daySchedule) => {
      Object.values(daySchedule || {}).forEach((slotRecord) => {
        if (!slotRecord || typeof slotRecord !== "object") return;
        SUPPORT_FIELDS.forEach((field) => {
          if (slotRecord[field] === oldName) slotRecord[field] = newName;
        });
        if (!Array.isArray(slotRecord.groups)) return;
        slotRecord.groups.forEach((group) => {
          if (group.teacher === oldName) group.teacher = newName;
        });
      });
    });

    Object.values(state.dailyReports || {}).forEach((reports) => {
      if (!reports || typeof reports !== "object") return;
      if (oldName in reports) {
        reports[newName] = reports[oldName];
        delete reports[oldName];
      }
      if (Array.isArray(reports[REPORT_HIDDEN_KEY])) {
        reports[REPORT_HIDDEN_KEY] = reports[REPORT_HIDDEN_KEY].map((teacher) => (teacher === oldName ? newName : teacher)).filter(unique);
      }
    });
  }

  function removeTeacherFromRecords(name) {
    state.monthlyPrograms = state.monthlyPrograms.map((program) => ({
      ...program,
      teacher: program.teacher === name ? "" : program.teacher
    }));

    state.vacationTransport = state.vacationTransport.map((entry) => ({
      ...entry,
      person: entry.person === name ? "" : entry.person
    }));

    state.observations = state.observations.map((entry) => ({
      ...entry,
      teacher: entry.teacher === name ? "" : entry.teacher
    }));

    Object.values(state.dailySchedules || {}).forEach((daySchedule) => {
      Object.values(daySchedule || {}).forEach((slotRecord) => {
        if (!slotRecord || typeof slotRecord !== "object") return;
        SUPPORT_FIELDS.forEach((field) => {
          if (slotRecord[field] === name) slotRecord[field] = "";
        });
        if (!Array.isArray(slotRecord.groups)) return;
        slotRecord.groups.forEach((group) => {
          if (group.teacher === name) group.teacher = "";
        });
      });
    });

    Object.values(state.dailyReports || {}).forEach((reports) => {
      if (!reports || typeof reports !== "object") return;
      delete reports[name];
      if (Array.isArray(reports[REPORT_HIDDEN_KEY])) {
        reports[REPORT_HIDDEN_KEY] = reports[REPORT_HIDDEN_KEY].filter((teacher) => teacher !== name);
      }
    });
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
      const slotRecord = getScheduleSlot(dailyDate, slot);
      const targetGroup = slotRecord.groups.find((group) => !scheduleGroupHasContent(group)) || blankScheduleGroup();

      if (!slotRecord.groups.includes(targetGroup)) {
        slotRecord.groups.push(targetGroup);
      }

      Object.assign(targetGroup, {
        program: programOptionLabel(program),
        teacher: program.teacher,
        room: program.room
      });

      state.dailySchedules[dailyDate][slot] = sanitizeScheduleSlot(slotRecord, slot);
    });

    saveState("월간 프로그램을 시간표에 반영했습니다.");
    renderDaily();
  }

  function addScheduleGroup(slot) {
    const slotRecord = getScheduleSlot(dailyDate, slot);
    slotRecord.groups.push(blankScheduleGroup());
    state.dailySchedules[dailyDate][slot] = sanitizeScheduleSlot(slotRecord, slot);
    saveState("시간표 그룹이 추가되었습니다.");
    renderDaily();
  }

  function removeScheduleGroup(slot, groupId) {
    const slotRecord = getScheduleSlot(dailyDate, slot);
    slotRecord.groups = slotRecord.groups.filter((group) => group.id !== groupId);
    if (!slotRecord.groups.length) slotRecord.groups = [blankScheduleGroup()];
    state.dailySchedules[dailyDate][slot] = sanitizeScheduleSlot(slotRecord, slot);
    saveState("시간표 그룹이 삭제되었습니다.");
    renderDaily();
  }

  function updateScheduleGroupField(target) {
    const slot = target.dataset.slot;
    const groupId = target.dataset.groupId;
    const field = target.dataset.scheduleGroupField;
    const group = findScheduleGroup(dailyDate, slot, groupId);

    if (!group) return;
    if (field === "program" && target.dataset.mergedGroupIds) {
      const mergedIds = target.dataset.mergedGroupIds.split(",").filter(Boolean);
      mergedIds.forEach((id) => {
        const mergedGroup = findScheduleGroup(dailyDate, slot, id);
        if (mergedGroup) mergedGroup.program = target.value;
      });
    } else {
      group[field] = target.value;
    }
    state.dailySchedules[dailyDate][slot] = sanitizeScheduleSlot(getScheduleSlot(dailyDate, slot), slot);
    saveState("시간표가 저장되었습니다.");
    renderDaily();
  }

  function updateScheduleUsers(target) {
    const wrapper = target.closest("[data-schedule-group]");
    if (!wrapper) return;

    const group = findScheduleGroup(dailyDate, wrapper.dataset.slot, wrapper.dataset.groupId);
    if (!group) return;

    group.users = Array.from(wrapper.querySelectorAll("[data-schedule-user]:checked")).map((input) => input.value);
    state.dailySchedules[dailyDate][wrapper.dataset.slot] = sanitizeScheduleSlot(getScheduleSlot(dailyDate, wrapper.dataset.slot), wrapper.dataset.slot);
    saveState("시간표가 저장되었습니다.");
    renderDaily();
  }

  function updateScheduleSupport(target) {
    const slot = target.dataset.slot;
    const field = target.dataset.scheduleSupportField;
    const slotRecord = getScheduleSlot(dailyDate, slot);

    slotRecord[field] = target.value;
    state.dailySchedules[dailyDate][slot] = sanitizeScheduleSlot(slotRecord, slot);
    saveState("시간표가 저장되었습니다.");
    renderDaily();
  }

  function updateScheduleAftercare(target) {
    const wrapper = target.closest("[data-aftercare-info]");
    const field = target.dataset.aftercareField;
    if (!wrapper || !field) return;

    setAftercareInfo(dailyDate, {
      ...getAftercareInfo(dailyDate),
      [field]: target.value
    });
    saveState("방과후 전달사항이 저장되었습니다.");
  }

  function addAftercareItem(button) {
    const wrapper = button.closest("[data-aftercare-info]");
    if (!wrapper) return;

    const type = cleanSelectValue(wrapper.querySelector('[data-aftercare-draft="type"]')?.value) || "결석";
    const userSelect = wrapper.querySelector('[data-aftercare-draft="user"]');
    const users = Array.from(userSelect?.selectedOptions || []).map((option) => cleanSelectValue(option.value)).filter(Boolean).filter(unique);
    const time = type === "결석" ? "" : cleanSelectValue(wrapper.querySelector('[data-aftercare-draft="time"]')?.value);

    if (!users.length) {
      setSyncStatus("이용인을 선택해주세요.");
      return;
    }

    if (type !== "결석" && !time) {
      setSyncStatus("시간을 선택해주세요.");
      return;
    }

    const info = getAftercareInfo(dailyDate);
    users.forEach((user) => {
      info.items.push({
        id: uid("aftercare"),
        type,
        user,
        time
      });
    });
    setAftercareInfo(dailyDate, info);
    saveState("등하원 정보가 추가되었습니다.");
    renderDaily();
  }

  function updateAftercareDraftType(target) {
    const wrapper = target.closest("[data-aftercare-info]");
    const timeSelect = wrapper?.querySelector('[data-aftercare-draft="time"]');
    if (!timeSelect) return;

    const needsTime = target.value !== "결석";
    timeSelect.disabled = !needsTime;
    if (!needsTime) timeSelect.value = "";
  }

  function removeAftercareItem(itemId) {
    const info = getAftercareInfo(dailyDate);
    info.items = info.items.filter((item) => item.id !== itemId);
    setAftercareInfo(dailyDate, info);
    saveState("등하원 정보가 삭제되었습니다.");
    renderDaily();
  }

  function findScheduleGroup(date, slot, groupId) {
    const slotRecord = getScheduleSlot(date, slot);
    return slotRecord.groups.find((group) => group.id === groupId);
  }

  function printSchedule() {
    document.body.classList.add("printing-schedule");
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => document.body.classList.remove("printing-schedule"), 300);
    }, 0);
  }

  function printMonthly() {
    document.body.classList.add("printing-monthly");
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => document.body.classList.remove("printing-monthly"), 300);
    }, 0);
  }

  function printTransport() {
    document.body.classList.add("printing-transport");
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => document.body.classList.remove("printing-transport"), 300);
    }, 0);
  }

  function printObservations() {
    const checkedIds = Array.from(document.querySelectorAll("[data-observation-print-select]:checked")).map((input) => input.value);
    const printItems = Array.from(document.querySelectorAll("[data-observation-print-item]"));

    printItems.forEach((item) => {
      item.classList.toggle("print-selected", !checkedIds.length || checkedIds.includes(item.dataset.observationPrintItem));
    });

    document.body.classList.add("printing-observations");
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => document.body.classList.remove("printing-observations"), 300);
    }, 0);
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
      .sort((a, b) => {
        const orderA = MOVE_TYPE_LABELS.indexOf(normalizeMoveType(a));
        const orderB = MOVE_TYPE_LABELS.indexOf(normalizeMoveType(b));
        return `${orderA < 0 ? 99 : orderA}${a.person}`.localeCompare(`${orderB < 0 ? 99 : orderB}${b.person}`);
      });
  }

  function vacationTeachersForDate(date) {
    const vacationLabel = MOVE_TYPES.find((type) => type.key === "vacation")?.label || "휴가";
    return new Set(
      movesForDate(date)
        .filter((entry) => normalizeMoveType(entry) === vacationLabel)
        .map((entry) => cleanSelectValue(entry.person))
        .filter(Boolean)
    );
  }

  function countFilledScheduleCells(date) {
    ensureDailySchedule(date);
    let aftercareCounted = false;
    return state.settings.timeSlots.reduce((total, slot) => {
      const slotRecord = getScheduleSlot(date, slot);
      const filledGroups = slotRecord.groups.filter(scheduleGroupHasContent).length;
      let filledExtra = SUPPORT_FIELDS.filter((field) => slotRecord[field]).length;
      if (isAftercareSlot(slot)) {
        const afterInfo = getAftercareInfo(date);
        filledExtra = aftercareCounted ? 0 : afterInfo.items.length + (afterInfo.memo ? 1 : 0);
        aftercareCounted = true;
      }
      return total + filledGroups + filledExtra;
    }, 0);
  }

  function ensureDailySchedule(date) {
    if (!state.dailySchedules) state.dailySchedules = {};
    if (!state.dailySchedules[date]) state.dailySchedules[date] = {};

    state.settings.timeSlots.forEach((slot) => {
      const slotRecord = normalizeScheduleSlot(state.dailySchedules[date][slot]);
      const legacyGroups = legacyScheduleGroups(date, slot);

      if (legacyGroups.length && !slotRecord.groups.some(scheduleGroupHasContent)) {
        slotRecord.groups = legacyGroups;
      }

      if (!slotRecord.groups.length) slotRecord.groups = [blankScheduleGroup()];
      state.dailySchedules[date][slot] = sanitizeScheduleSlot(slotRecord, slot);
    });
  }

  function getScheduleSlot(date, slot) {
    ensureDailySchedule(date);
    return state.dailySchedules[date][slot];
  }

  function normalizeScheduleSlot(input) {
    const slotRecord = {
      groups: [],
      rest: "",
      docs: "",
      desk: "",
      afterInfo: normalizeAfterInfo()
    };

    if (!input || typeof input !== "object") return slotRecord;

    slotRecord.rest = cleanSelectValue(input.rest);
    slotRecord.docs = cleanSelectValue(input.docs);
    slotRecord.desk = cleanSelectValue(input.desk);
    slotRecord.afterInfo = normalizeAfterInfo(input.afterInfo);

    if (Array.isArray(input.groups)) {
      slotRecord.groups = input.groups.map(normalizeScheduleGroup);
    } else if (scheduleGroupHasContent(input)) {
      slotRecord.groups = [normalizeScheduleGroup(input)];
    }

    return slotRecord;
  }

  function normalizeScheduleGroup(input = {}) {
    return {
      id: input.id || uid("group"),
      program: cleanSelectValue(input.program),
      room: cleanSelectValue(input.room),
      teacher: cleanSelectValue(input.teacher),
      users: normalizeUserList(input.users)
    };
  }

  function normalizeAfterInfo(input = {}) {
    input = input && typeof input === "object" ? input : {};
    const items = Array.isArray(input.items) ? input.items.map(normalizeAftercareItem).filter((item) => item.user) : [];

    if (!items.length) {
      cleanSelectValue(input.absent)
        .split(/[,/|\n]+/)
        .map(cleanSelectValue)
        .filter(Boolean)
        .forEach((user) => {
          items.push(normalizeAftercareItem({ type: "결석", user }));
        });

      const arrival = cleanSelectValue(input.arrival);
      if (arrival) items.push(normalizeAftercareItem({ type: "등원", user: arrival.replace(/\d{1,2}:\d{2}/, "").trim() || arrival, time: extractTimeValue(arrival) }));

      const departure = cleanSelectValue(input.departure);
      if (departure) items.push(normalizeAftercareItem({ type: "하원", user: departure.replace(/\d{1,2}:\d{2}/, "").trim() || departure, time: extractTimeValue(departure) }));
    }

    return {
      items: items.filter((item, index, array) => array.findIndex((target) => target.type === item.type && target.user === item.user && target.time === item.time) === index),
      memo: cleanSelectValue(input.memo)
    };
  }

  function normalizeAftercareItem(input = {}) {
    const type = AFTERCARE_INFO_TYPES.includes(cleanSelectValue(input.type)) ? cleanSelectValue(input.type) : "결석";
    return {
      id: input.id || uid("aftercare"),
      type,
      user: cleanSelectValue(input.user || input.person),
      time: type === "결석" ? "" : cleanSelectValue(input.time)
    };
  }

  function legacyScheduleGroups(date, slot) {
    return state.serviceLabels
      .map((service) => state.dailySchedules[date][scheduleKey(slot, service)])
      .filter(scheduleGroupHasContent)
      .map(normalizeScheduleGroup);
  }

  function blankScheduleGroup() {
    return {
      id: uid("group"),
      program: "",
      room: "",
      teacher: "",
      users: []
    };
  }

  function sanitizeScheduleSlot(slotRecord, slot = "") {
    const usedUsers = new Set();
    const usedTeachers = new Set();
    const allowedUsers = new Set(slot ? allowedUsersForSlot(slot) : flattenUserGroups());
    const aftercare = isAftercareSlot(slot);

    slotRecord.groups = slotRecord.groups.map((group) => {
      const normalized = normalizeScheduleGroup(group);

      normalized.users = normalized.users.filter((user) => {
        if (allowedUsers.size && !allowedUsers.has(user)) return false;
        if (usedUsers.has(user)) return false;
        usedUsers.add(user);
        return true;
      });

      if (normalized.teacher && usedTeachers.has(normalized.teacher)) {
        normalized.teacher = "";
      }

      if (normalized.teacher) usedTeachers.add(normalized.teacher);
      return normalized;
    });

    slotRecord.afterInfo = normalizeAfterInfo(slotRecord.afterInfo);

    if (aftercare) {
      SUPPORT_FIELDS.forEach((field) => {
        slotRecord[field] = "";
      });
      if (!slotRecord.groups.length) slotRecord.groups = [blankScheduleGroup()];
      return slotRecord;
    }

    const supportUsed = new Set();
    SUPPORT_FIELDS.forEach((field) => {
      const value = cleanSelectValue(slotRecord[field]);
      if (!value || usedTeachers.has(value) || supportUsed.has(value)) {
        slotRecord[field] = "";
        return;
      }

      slotRecord[field] = value;
      supportUsed.add(value);
    });

    if (!slotRecord.groups.length) slotRecord.groups = [blankScheduleGroup()];
    return slotRecord;
  }

  function scheduleGroupHasContent(group = {}) {
    return Boolean(
      group.program ||
        group.teacher ||
        group.room ||
        group.rest ||
        group.docs ||
        group.desk ||
        (Array.isArray(group.users) ? group.users.length : String(group.users || "").trim()) ||
        group.memo
    );
  }

  function supportValues(slotRecord) {
    return SUPPORT_FIELDS.map((field) => slotRecord[field]).filter(Boolean);
  }

  function normalizeUserList(value) {
    if (Array.isArray(value)) {
      return value.map(cleanSelectValue).filter(Boolean).filter(unique);
    }

    return String(value || "")
      .split(/[,/|\n]+/)
      .map(cleanSelectValue)
      .filter(Boolean)
      .filter(unique);
  }

  function cleanSelectValue(value) {
    return String(value || "").trim();
  }

  function holidayName(date) {
    return KOREA_HOLIDAYS_2026[date] || "";
  }

  function isSundayDate(date) {
    return parseIsoDate(date).getDay() === 0;
  }

  function isCustomClosed(date) {
    return (state.closedDates || []).includes(date);
  }

  function isClosedDate(date) {
    return isSundayDate(date) || Boolean(holidayName(date)) || isCustomClosed(date);
  }

  function closedDateLabel(date) {
    if (holidayName(date)) return holidayName(date);
    if (isSundayDate(date)) return "휴무";
    if (isCustomClosed(date)) return "휴무";
    return "";
  }

  function allowedUserGroupsForSlot(slot) {
    const start = slotStartMinutes(slot);
    if (start >= 16 * 60) return ["afterMonTueThuSat", "afterWedFriSat"];
    return ["day"];
  }

  function isAftercareSlot(slot) {
    return slotStartMinutes(slot) >= 16 * 60;
  }

  function firstAftercareSlot() {
    return (state.settings.timeSlots || []).find(isAftercareSlot) || "";
  }

  function aftercareEditorRowSpan(date) {
    ensureDailySchedule(date);
    return (state.settings.timeSlots || [])
      .filter(isAftercareSlot)
      .reduce((total, slot) => total + Math.max(1, getScheduleSlot(date, slot).groups.length), 0);
  }

  function getAftercareInfo(date) {
    const slot = firstAftercareSlot();
    if (!slot) return normalizeAfterInfo();
    return normalizeAfterInfo(getScheduleSlot(date, slot).afterInfo);
  }

  function getTeacherReports(date) {
    if (!state.dailyReports || typeof state.dailyReports !== "object") state.dailyReports = {};
    if (!state.dailyReports[date] || typeof state.dailyReports[date] !== "object") state.dailyReports[date] = {};
    return state.dailyReports[date];
  }

  function reportHiddenTeachers(date) {
    const reports = getTeacherReports(date);
    return new Set(Array.isArray(reports[REPORT_HIDDEN_KEY]) ? reports[REPORT_HIDDEN_KEY].map(cleanSelectValue).filter(Boolean) : []);
  }

  function reportTeachersForDate(date) {
    const hidden = reportHiddenTeachers(date);
    const vacation = vacationTeachersForDate(date);
    return (state.settings.teachers || []).filter((teacher) => !vacation.has(teacher) && !hidden.has(teacher));
  }

  function hideTeacherReport(teacher) {
    const name = cleanSelectValue(teacher);
    if (!name) return;
    const reports = getTeacherReports(dailyDate);
    const hidden = new Set(Array.isArray(reports[REPORT_HIDDEN_KEY]) ? reports[REPORT_HIDDEN_KEY] : []);
    hidden.add(name);
    reports[REPORT_HIDDEN_KEY] = Array.from(hidden).filter(Boolean);
    saveState("교사별 보고 업무에서 제외했습니다.");
    renderDaily();
  }

  function showTeacherReport(teacher) {
    const name = cleanSelectValue(teacher);
    if (!name) return;
    const reports = getTeacherReports(dailyDate);
    reports[REPORT_HIDDEN_KEY] = (Array.isArray(reports[REPORT_HIDDEN_KEY]) ? reports[REPORT_HIDDEN_KEY] : []).filter((item) => item !== name);
    saveState("교사별 보고 업무에 다시 표시했습니다.");
    renderDaily();
  }

  function updateTeacherReport(target) {
    const teacher = target.dataset.reportField;
    if (!teacher) return;
    const reports = getTeacherReports(dailyDate);
    reports[teacher] = target.value;
    saveState("교사별 보고 업무가 저장되었습니다.");
  }

  function setAftercareInfo(date, info) {
    const normalized = normalizeAfterInfo(info);
    (state.settings.timeSlots || []).filter(isAftercareSlot).forEach((slot) => {
      const slotRecord = getScheduleSlot(date, slot);
      slotRecord.afterInfo = normalized;
      state.dailySchedules[date][slot] = sanitizeScheduleSlot(slotRecord, slot);
    });
    removeAftercareAbsentUsers(date);
  }

  function allowedUsersForSlot(slot) {
    return allowedUserGroupsForSlot(slot).flatMap((key) => state.settings.userGroups?.[key] || []).filter(unique);
  }

  function absentAftercareUsers(date) {
    return new Set(getAftercareInfo(date).items.filter((item) => item.type === "결석").map((item) => item.user).filter(Boolean));
  }

  function removeAftercareAbsentUsers(date) {
    const absentUsers = absentAftercareUsers(date);
    if (!absentUsers.size) return false;

    let changed = false;
    (state.settings.timeSlots || []).filter(isAftercareSlot).forEach((slot) => {
      const slotRecord = getScheduleSlot(date, slot);
      slotRecord.groups.forEach((group) => {
        const before = normalizeUserList(group.users);
        const next = before.filter((user) => !absentUsers.has(user));
        if (next.length !== before.length) {
          group.users = next;
          changed = true;
        }
      });
      state.dailySchedules[date][slot] = sanitizeScheduleSlot(slotRecord, slot);
    });

    return changed;
  }

  function slotStartMinutes(slot) {
    const [hour, minute] = String(slot || "00:00").split("~")[0].split(":").map(Number);
    return (Number.isFinite(hour) ? hour : 0) * 60 + (Number.isFinite(minute) ? minute : 0);
  }

  function aftercareTimeOptions() {
    const options = [];
    const start = 16 * 60;
    const end = 18 * 60 + 40;
    for (let minutes = start; minutes <= end; minutes += 10) {
      options.push(formatMinutesAsTime(minutes));
    }
    return options;
  }

  function formatMinutesAsTime(minutes) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  function extractTimeValue(value) {
    return String(value || "").match(/\d{1,2}:\d{2}/)?.[0] || "";
  }

  function teacherColor(name) {
    const teacher = cleanSelectValue(name);
    return state.settings.teacherColors?.[teacher] || "#4b5563";
  }

  function teacherBadge(name, fallback = "담당자 미정") {
    const teacher = cleanSelectValue(name);
    if (!teacher) return h(fallback);
    if (!state.settings.teachers.includes(teacher)) return h(teacher);
    return `<span class="teacher-name" style="--teacher-color: ${h(teacherColor(teacher))}">${h(teacher)}</span>`;
  }

  function programOptionsForDate(date) {
    return ["", ...programsForDate(date).map(programOptionLabel), ...CORE_PROGRAM_OPTIONS].filter(unique);
  }

  function scheduleRangeLabel() {
    const slots = state.settings.timeSlots || [];
    if (!slots.length) return "시간 미정";
    const first = slots[0].split("~")[0] || slots[0];
    const lastSlot = slots[slots.length - 1];
    const last = lastSlot.split("~")[1] || lastSlot;
    return `${first} ~ ${last}`;
  }

  function dayScheduleRangeLabel() {
    const slots = state.settings.timeSlots || [];
    const first = slots[0]?.split("~")[0] || "09:00";
    return `${first} ~ 16:00`;
  }

  function aftercareScheduleRangeLabel() {
    const slots = state.settings.timeSlots || [];
    const afterSlots = slots.filter(isAftercareSlot);
    const first = afterSlots[0]?.split("~")[0] || "16:00";
    const lastSlot = afterSlots[afterSlots.length - 1] || "18:40";
    const last = lastSlot.split("~")[1] || lastSlot;
    return `${first} ~ ${last}`;
  }

  function formatSlotLabel(slot) {
    return h(slot).replace("~", "<br />~<br />");
  }

  function formatSlotText(slot) {
    const [start, end] = String(slot || "")
      .split("~")
      .map((part) => part.trim());
    return end ? `${start} ~ ${end}` : start || "";
  }

  function scheduleKey(slot, service) {
    return `${slot}||${service}`;
  }

  function categoryName(id) {
    return categorySeed.find((category) => category.id === id)?.name || "학습형";
  }

  function shortProgramLabel(program) {
    return `${program.major}${program.topic ? ` · ${program.topic}` : ""}${program.session ? ` ${program.session}차` : ""}`;
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

    const closedToggle = event.target.closest("[data-toggle-closed-date]");
    if (closedToggle) {
      toggleClosedDate(closedToggle.dataset.toggleClosedDate);
      return;
    }

    const programDay = event.target.closest("[data-open-program-date]");
    if (programDay) {
      openProgramModal(programDay.dataset.openProgramDate, programDay.dataset.programService);
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

    const todayTeacherButton = event.target.closest("[data-select-today-teacher]");
    if (todayTeacherButton) {
      selectedTodayTeacher = todayTeacherButton.dataset.selectTodayTeacher || "";
      renderHome();
      return;
    }

    const addGroupButton = event.target.closest("[data-add-schedule-group]");
    if (addGroupButton) {
      addScheduleGroup(addGroupButton.dataset.addScheduleGroup);
      return;
    }

    const removeGroupButton = event.target.closest("[data-remove-schedule-group]");
    if (removeGroupButton) {
      const ok = window.confirm("이 시간표 그룹을 삭제할까요?");
      if (!ok) return;
      removeScheduleGroup(removeGroupButton.dataset.slot, removeGroupButton.dataset.removeScheduleGroup);
      return;
    }

    if (event.target.closest("[data-print-schedule]")) {
      printSchedule();
      return;
    }

    if (event.target.closest("[data-print-monthly]")) {
      printMonthly();
      return;
    }

    if (event.target.closest("[data-print-transport]")) {
      printTransport();
      return;
    }

    if (event.target.closest("[data-print-observations]")) {
      printObservations();
      return;
    }

    const addAftercareButton = event.target.closest("[data-add-aftercare-item]");
    if (addAftercareButton) {
      addAftercareItem(addAftercareButton);
      return;
    }

    const removeAftercareButton = event.target.closest("[data-remove-aftercare-item]");
    if (removeAftercareButton) {
      removeAftercareItem(removeAftercareButton.dataset.removeAftercareItem);
      return;
    }

    const hideReportButton = event.target.closest("[data-hide-report-teacher]");
    if (hideReportButton) {
      hideTeacherReport(hideReportButton.dataset.hideReportTeacher);
      return;
    }

    const showReportButton = event.target.closest("[data-show-report-teacher]");
    if (showReportButton) {
      showTeacherReport(showReportButton.dataset.showReportTeacher);
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

    const updateUserButton = event.target.closest("[data-update-user]");
    if (updateUserButton) {
      updateUser(updateUserButton);
      return;
    }

    const deleteUserButton = event.target.closest("[data-delete-user]");
    if (deleteUserButton) {
      const ok = window.confirm("이 이용인을 삭제할까요? 시간표와 기록의 해당 이름도 함께 정리됩니다.");
      if (!ok) return;
      deleteUser(deleteUserButton);
      return;
    }

    const updateTeacherButton = event.target.closest("[data-update-teacher]");
    if (updateTeacherButton) {
      updateTeacher(updateTeacherButton);
      return;
    }

    const deleteTeacherButton = event.target.closest("[data-delete-teacher]");
    if (deleteTeacherButton) {
      const ok = window.confirm("이 교사를 삭제할까요? 시간표와 기록의 해당 이름도 함께 정리됩니다.");
      if (!ok) return;
      deleteTeacher(deleteTeacherButton.dataset.deleteTeacher);
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
    if (form.matches("[data-add-user-form]")) addUser(form);
    if (form.matches("[data-add-teacher-form]")) addTeacher(form);
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

    if (target.matches("[data-schedule-group-field]")) {
      updateScheduleGroupField(target);
      return;
    }

    if (target.matches("[data-schedule-user]")) {
      updateScheduleUsers(target);
      return;
    }

    if (target.matches("[data-schedule-support-field]")) {
      updateScheduleSupport(target);
      return;
    }

    if (target.matches('[data-aftercare-draft="type"]')) {
      updateAftercareDraftType(target);
      return;
    }

    if (target.matches("[data-aftercare-field]")) {
      updateScheduleAftercare(target);
      return;
    }
  });

  document.addEventListener("input", (event) => {
    const target = event.target;

    if (target.matches("[data-report-field]")) {
      updateTeacherReport(target);
      return;
    }

    if (target.matches("[data-aftercare-field]")) {
      updateScheduleAftercare(target);
      return;
    }

    if (!target.matches("[data-schedule-field]")) return;
    ensureDailySchedule(dailyDate);
    const cell = target.closest(".schedule-cell");
    if (!cell) return;
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
