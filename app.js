(() => {
  const STORAGE_KEY = "songjeong-uri-system-data-v2";
  const ACTIVE_VIEW_KEY = "songjeong-active-view";
  const VACATION_PANEL_KEY = "songjeong-vacation-panel";
  const ADMIN_SESSION_KEY = "songjeong-admin-unlocked";
  const CLIENT_ID_KEY = "songjeong-client-id";
  const SHARED_DATA_URL = "/.netlify/functions/shared-data";
  const SYNC_INTERVAL_MS = 10000;
  const CENTER_LOGO_SRC = "./assets/songjeong-uri-logo.jpg";
  const REPORT_HIDDEN_KEY = "__hiddenTeachers";
  const CLUB_MAJOR_THEME = "그룹별 스포츠 동아리";
  const CLUB_TOPIC_COUNT = 3;
  const SPECIAL_EVENT_LEAVE_DAYS = 5;
  const KOREAN_DAYS = ["일", "월", "화", "수", "목", "금", "토"];
  const SUPPORT_FIELDS = ["rest"];
  const SUPPORT_LABELS = {
    rest: "휴게"
  };
  const ROOM_OPTIONS = ["우리실", "송정실", "사무실", "301호 체육실", "302호 체육실", "요리실"];
  const CANONICAL_TIME_SLOTS = [
    "09:00~09:30",
    "09:30~10:00",
    "10:00~11:00",
    "11:00~12:00",
    "12:00~13:00",
    "13:00~14:00",
    "14:00~14:50",
    "14:50~15:30",
    "15:30~16:00",
    "16:00~16:40",
    "16:40~18:00",
    "18:00~18:40",
    "18:40~"
  ];
  const TIME_SLOT_RENAMES = {
    "14:00~15:00": "14:00~14:50",
    "15:00~16:00": "14:50~15:30",
    "16:40~17:30": "16:40~18:00",
    "17:30~18:40": "18:00~18:40"
  };
  const DAY_DISMISSAL_SLOT = "15:30~16:00";
  const DEFAULT_DAY_DISMISSAL_PROGRAM = "하원 지도";
  const DAY_DISMISSAL_ROOM = "차량";
  const CORE_PROGRAM_OPTIONS = ["등원 / 출석 확인", "등원 및 개별학습", "점심식사 및 양치질 지도", "돌봄 / 서류 업무", "하원 준비", DEFAULT_DAY_DISMISSAL_PROGRAM, "개별지원"];
  const DAY_USER_GROUP_KEYS = ["dayA", "dayB"];
  const AFTERCARE_USER_GROUP_KEYS = ["afterMonTueThuSat", "afterWedFriSat"];
  const USER_GROUPS = [
    { key: "dayA", label: "주간 A그룹" },
    { key: "dayB", label: "주간 B그룹" },
    { key: "afterMonTueThuSat", label: "방과후(월화목토)" },
    { key: "afterWedFriSat", label: "방과후(수금토)" }
  ];
  const ASSIGNMENT_GROUPS = [
    { label: "주간 이용인", keys: DAY_USER_GROUP_KEYS },
    { label: "방과후 이용인 (월화목토)", keys: ["afterMonTueThuSat"] },
    { label: "방과후 이용인 (수금)", keys: ["afterWedFriSat"] }
  ];
  const SERVICE_CALENDARS = [
    { key: "day", title: "주간 프로그램 (월~금)", service: "주간", allowedDays: [1, 2, 3, 4, 5], periodCount: 4 },
    { key: "afterMonTueThuSat", title: "방과후(월화목토) 프로그램", service: "방과후(월화목토)", allowedDays: [1, 2, 4, 6], periodCount: 3 },
    { key: "afterWedFriSat", title: "방과후(수금토) 프로그램", service: "방과후(수금토)", allowedDays: [3, 5, 6], periodCount: 3 }
  ];
  const PROGRAM_GROUPS = [
    { key: "all", label: "전체 대상" },
    { key: "A", label: "A그룹" },
    { key: "B", label: "B그룹" }
  ];
  const PROGRAM_GROUP_SELECT_LABELS = {
    all: "전체 대상",
    A: "A",
    B: "B"
  };
  const DEFAULT_PROGRAM_PERIOD_COUNT = 4;
  const MOVE_TYPES = [
    { key: "vacation", label: "휴가", className: "note-row" },
    { key: "birthdayLeave", label: "생일 휴가", className: "note-row" },
    { key: "familyEventLeave", label: "경조사 휴가", className: "note-row" },
    { key: "morningHalf", label: "오전 반차", className: "half-row" },
    { key: "afternoonHalf", label: "오후 반차", className: "half-row" },
    { key: "compMorningHalf", label: "보상휴가", className: "half-row" },
    { key: "dayCarnivalIn", label: "주간 카니발 등원", className: "day-route" },
    { key: "dayCarnivalOut", label: "주간 카니발 하원", className: "day-route" },
    { key: "dayMorningIn", label: "주간 모닝 등원", className: "day-route" },
    { key: "dayMorningOut", label: "주간 모닝 하원", className: "day-route" },
    { key: "afterOut", label: "방과후 하원", className: "after-route" }
  ];
  const MOVE_TYPE_LABELS = MOVE_TYPES.map((item) => item.label);
  const INFO_ABSENT = "결석";
  const INFO_ARRIVAL = "등원";
  const INFO_DEPARTURE = "하원";
  const COMMUTE_INFO_TYPES = [INFO_ARRIVAL, INFO_DEPARTURE];
  const AFTERCARE_INFO_TYPES = [INFO_ABSENT, INFO_ARRIVAL, INFO_DEPARTURE];
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
  const DEFAULT_MAJOR_THEMES = [
    "특수체육",
    "인지학습치료",
    "의사소통 기술 향상 프로그램",
    "사회적응훈련",
    "일상생활훈련",
    "미술활동",
    "음악활동",
    "요리활동",
    "디지털 활용",
    "지역사회연계",
    CLUB_MAJOR_THEME
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
  let vacationPanel = localStorage.getItem(VACATION_PANEL_KEY) || "schedule";
  if (currentView === "stats") {
    currentView = "vacation";
    vacationPanel = "leave";
  }
  let state = normalizeState(loadLocalState());
  let monthlyCursor = startOfMonth(parseIsoDate(todayIso));
  let vacationCursor = startOfMonth(parseIsoDate(todayIso));
  let dailyDate = todayIso;
  let homeScheduleDate = todayIso;
  let selectedTodayTeacher = "";
  let userEditMode = false;
  let teacherEditMode = false;
  let selectedAssignmentTeacher = "";
  let assignmentEditMode = false;
  let assignmentDraft = null;
  let observationUserFilter = "";
  let observationEditingId = "";
  let observationHighlightTerms = [];
  let observationHighlightSelection = null;
  let observationFormDate = todayIso;
  let supportNoteEditor = null;
  let dayAbsentPickerOpen = false;
  let aftercareAbsentPickerOpen = false;
  let commutePickerOpen = "";
  let programDragId = "";
  let transportDragDate = "";
  let transportCopyFilter = "all";
  let transportClipboard = null;
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
    daily: "일일 시간표 제작",
    people: "이용인·교사 관리",
    vacation: "휴가 일정 및 송영 담당",
    observations: "관찰일지",
    settings: "기본 설정"
  };

  function defaultState() {
    const d0 = todayIso;
    const d1 = offsetDate(1);
    const d2 = offsetDate(2);
    const majorThemes = [...DEFAULT_MAJOR_THEMES];

    return {
      schemaVersion: 4,
      serviceLabels: SERVICE_CALENDARS.map((item) => item.service),
      categories: categorySeed,
      majorThemes,
      majorThemeCategories: normalizeMajorThemeCategories(null, majorThemes),
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
      userSubstitutes: {},
      settings: {
        teachers: ["담당자1", "담당자2", "담당자3", "협력기관"],
        teacherColors: {
          담당자1: "#1f78ff",
          담당자2: "#ef3b2d",
          담당자3: "#2f9e44",
          협력기관: "#ae3ec9"
        },
        teacherProfiles: {
          담당자1: { hireDate: "", birthday: "" },
          담당자2: { hireDate: "", birthday: "" },
          담당자3: { hireDate: "", birthday: "" },
          협력기관: { hireDate: "", birthday: "" }
        },
        users: ["이용인1", "이용인2", "이용인3", "이용인4"],
        userGroups: {
          dayA: ["이용인1"],
          dayB: ["이용인2"],
          afterMonTueThuSat: ["이용인3"],
          afterWedFriSat: ["이용인4"]
        },
        userAssignments: {},
        rooms: ROOM_OPTIONS,
        timeSlots: CANONICAL_TIME_SLOTS,
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

  function normalizeTimeSlots(input) {
    const raw = Array.isArray(input) && input.length ? input : CANONICAL_TIME_SLOTS;
    const hadLegacyDayEnd = raw.includes("15:00~16:00");
    const slots = raw
      .map((slot) => TIME_SLOT_RENAMES[cleanSelectValue(slot)] || cleanSelectValue(slot))
      .filter(Boolean)
      .filter(unique);

    if (hadLegacyDayEnd && !slots.includes(DAY_DISMISSAL_SLOT)) {
      const aftercareIndex = slots.findIndex((slot) => slotStartMinutes(slot) >= 16 * 60);
      const insertIndex = aftercareIndex < 0 ? slots.length : aftercareIndex;
      slots.splice(insertIndex, 0, DAY_DISMISSAL_SLOT);
    }

    return slots.length ? slots : CANONICAL_TIME_SLOTS;
  }

  function migrateScheduleTimeSlots(dailySchedules) {
    if (!dailySchedules || typeof dailySchedules !== "object") return;

    Object.values(dailySchedules).forEach((daySchedule) => {
      if (!daySchedule || typeof daySchedule !== "object") return;

      Object.entries(TIME_SLOT_RENAMES).forEach(([oldSlot, nextSlot]) => {
        Object.keys(daySchedule)
          .filter((key) => key === oldSlot || key.startsWith(`${oldSlot}||`))
          .forEach((key) => {
            const nextKey = key === oldSlot ? nextSlot : key.replace(oldSlot, nextSlot);
            daySchedule[nextKey] = daySchedule[nextKey] ? mergeScheduleSlotRecords(daySchedule[nextKey], daySchedule[key]) : daySchedule[key];
            delete daySchedule[key];
          });
      });
    });
  }

  function mergeScheduleSlotRecords(target, source) {
    const first = normalizeScheduleSlot(target);
    const second = normalizeScheduleSlot(source);

    return {
      groups: [...first.groups, ...second.groups].filter(scheduleGroupHasContent),
      rest: [...supportTeacherList(first, "rest"), ...supportTeacherList(second, "rest")].filter(unique),
      memo: first.memo || second.memo,
      teacherNotes: [...first.teacherNotes, ...second.teacherNotes],
      supportNotes: {
        ...second.supportNotes,
        ...first.supportNotes
      },
      dayInfo: mergeAfterInfo(first.dayInfo, second.dayInfo),
      afterInfo: mergeAfterInfo(first.afterInfo, second.afterInfo)
    };
  }

  function mergeAfterInfo(target, source) {
    const first = normalizeAfterInfo(target);
    const second = normalizeAfterInfo(source);

    return normalizeAfterInfo({
      items: [...first.items, ...second.items],
      memo: first.memo || second.memo
    });
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

    migrateScheduleTimeSlots(next.dailySchedules);

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
    next.observations = next.observations.map(normalizeObservation);
    next.majorThemes = normalizeMajorThemeList(next.majorThemes);
    if (!next.majorThemes.length) {
      next.majorThemes = base.majorThemes;
    }
    if (!next.majorThemes.includes(CLUB_MAJOR_THEME)) {
      next.majorThemes.push(CLUB_MAJOR_THEME);
    }
    next.majorThemeCategories = normalizeMajorThemeCategories(next.majorThemeCategories, next.majorThemes);

    const hasStoredUserGroups = Boolean(input.settings?.userGroups);

    if (input.settings && input.settings.users && !Array.isArray(input.settings.users)) {
      next.settings.userGroups = input.settings.users;
      next.settings.users = Object.values(input.settings.users).flat();
    } else if (!hasStoredUserGroups) {
      next.settings.userGroups = null;
    }

    ["teachers", "users"].forEach((key) => {
      if (!Array.isArray(next.settings[key]) || !next.settings[key].length) {
        next.settings[key] = base.settings[key];
      }
    });
    next.settings.rooms = ROOM_OPTIONS;
    next.settings.timeSlots = normalizeTimeSlots(next.settings.timeSlots);

    next.settings.userGroups = normalizeUserGroups(next.settings.userGroups, next.settings.users);
    next.settings.users = flattenUserGroups(next.settings.userGroups);
    next.settings.teacherColors = normalizeTeacherColors(next.settings.teacherColors, next.settings.teachers);
    next.settings.teacherProfiles = normalizeTeacherProfiles(next.settings.teacherProfiles, next.settings.teachers);
    next.settings.userAssignments = normalizeUserAssignments(next.settings.userAssignments, next.settings.users, next.settings.teachers);
    next.userSubstitutes = normalizeUserSubstitutes(next.userSubstitutes, next.settings.users, next.settings.teachers);
    next.closedDates = Array.isArray(input.closedDates) ? input.closedDates.map(cleanSelectValue).filter(Boolean).filter(unique) : [];

    return next;
  }

  function normalizeProgram(program) {
    const service = normalizeServiceName(program.service || "주간");
    const major = cleanSelectValue(program.major) || "프로그램";
    const topicList = normalizeClubTopicList(program.topicList);
    const isClub = isClubProgramMajor(major);
    return {
      id: program.id || uid("program"),
      date: program.date || todayIso,
      category: program.category || inferCategory(`${major} ${program.topic || ""} ${topicList.join(" ")}`),
      major,
      topic: program.topic || topicList[0] || "",
      topicList: isClub ? topicList : [],
      session: isClub ? 2 : normalizeProgramDuration(program.session),
      period: normalizeProgramPeriod(program.period),
      majorLetterSpacing: normalizeProgramLetterSpacing(program.majorLetterSpacing),
      topicLetterSpacing: normalizeProgramLetterSpacing(program.topicLetterSpacing),
      service,
      group: service === "주간" ? normalizeProgramGroup(program.group) : "all",
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

  function normalizeObservation(entry = {}) {
    return {
      id: entry.id || uid("obs"),
      date: entry.date || todayIso,
      user: cleanSelectValue(entry.user),
      teacher: cleanSelectValue(entry.teacher),
      activity: cleanSelectValue(entry.activity),
      summary: cleanSelectValue(entry.summary),
      highlights: normalizeHighlightTerms(entry.highlights || entry.highlightTerms || entry.highlight)
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

      if (Array.isArray(input.day) && !groups.dayA.length && !groups.dayB.length) {
        groups.dayA = input.day.map(cleanSelectValue).filter(Boolean).filter(unique);
      }
    }

    if (!flattenUserGroups(groups).length) {
      groups.dayA = fallbackUsers.map(cleanSelectValue).filter(Boolean).filter(unique);
    }

    return groups;
  }

  function normalizeUserAssignments(input, users = [], teachers = []) {
    const userSet = new Set(users.map(cleanSelectValue).filter(Boolean));
    const teacherSet = new Set(teachers.map(cleanSelectValue).filter(Boolean));
    const assignments = {};
    if (!input || typeof input !== "object") return assignments;

    Object.entries(input).forEach(([user, teacher]) => {
      const userName = cleanSelectValue(user);
      const teacherName = cleanSelectValue(teacher);
      if (userSet.has(userName) && teacherSet.has(teacherName)) {
        assignments[userName] = teacherName;
      }
    });
    return assignments;
  }

  function normalizeUserSubstitutes(input, users = [], teachers = []) {
    const userSet = new Set(users.map(cleanSelectValue).filter(Boolean));
    const teacherSet = new Set(teachers.map(cleanSelectValue).filter(Boolean));
    const substitutes = {};
    if (!input || typeof input !== "object") return substitutes;

    Object.entries(input).forEach(([date, entries]) => {
      const iso = normalizeDateInput(date);
      if (!iso || !entries || typeof entries !== "object") return;
      Object.entries(entries).forEach(([user, teacher]) => {
        const userName = cleanSelectValue(user);
        const teacherName = cleanSelectValue(teacher);
        if (!userSet.has(userName) || !teacherSet.has(teacherName)) return;
        if (!substitutes[iso]) substitutes[iso] = {};
        substitutes[iso][userName] = teacherName;
      });
    });
    return substitutes;
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
    state.settings.userAssignments = normalizeUserAssignments(state.settings.userAssignments, state.settings.users, state.settings.teachers);
    state.userSubstitutes = normalizeUserSubstitutes(state.userSubstitutes, state.settings.users, state.settings.teachers);
  }

  function normalizeTeacherColors(input, teachers) {
    const colors = {};
    teachers.forEach((teacher, index) => {
      colors[teacher] = normalizeColor(input?.[teacher]) || TEACHER_COLOR_PALETTE[index % TEACHER_COLOR_PALETTE.length];
    });
    return colors;
  }

  function normalizeTeacherProfiles(input, teachers) {
    const profiles = {};
    teachers.forEach((teacher) => {
      const profile = input?.[teacher] || {};
      profiles[teacher] = {
        hireDate: normalizeDateInput(profile.hireDate),
        birthday: normalizeDateInput(profile.birthday)
      };
    });
    return profiles;
  }

  function normalizeColor(value) {
    const color = cleanSelectValue(value);
    return /^#[0-9a-f]{6}$/i.test(color) ? color : "";
  }

  function normalizeDateInput(value) {
    const text = cleanSelectValue(value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return "";
    const date = parseIsoDate(text);
    return toIsoDate(date) === text ? text : "";
  }

  function normalizeCategoryId(value) {
    const category = cleanSelectValue(value);
    return categorySeed.some((item) => item.id === category) ? category : "";
  }

  function normalizeMajorThemeList(input) {
    if (!Array.isArray(input)) return [];
    return input
      .map((theme) => (typeof theme === "object" ? theme.name || theme.major || theme.title : theme))
      .map(cleanSelectValue)
      .filter(Boolean)
      .filter(unique);
  }

  function normalizeMajorThemeCategories(input, themes = []) {
    const categories = {};
    const source = input && typeof input === "object" ? input : {};

    normalizeMajorThemeList(themes).forEach((theme) => {
      categories[theme] = normalizeCategoryId(source[theme]) || defaultMajorThemeCategory(theme);
    });

    return categories;
  }

  function defaultMajorThemeCategory(theme) {
    const value = cleanSelectValue(theme);
    if (value === CLUB_MAJOR_THEME || value.includes("체육") || value.includes("운동") || value.includes("스포츠")) return "physical";
    if (value.includes("미술") || value.includes("음악") || value.includes("요리") || value.includes("공예") || value.includes("디지털")) return "creative";
    if (value.includes("지역") || value.includes("기관") || value.includes("협력")) return "partner";
    if (value.includes("사회") || value.includes("일상") || value.includes("의사소통") || value.includes("참여") || value.includes("자조")) return "participation";
    return "learning";
  }

  function categoryForMajorTheme(major, fallbackText = "") {
    const theme = cleanSelectValue(major);
    if (!theme) return inferCategory(fallbackText);
    return normalizeCategoryId(state.majorThemeCategories?.[theme]) || defaultMajorThemeCategory(`${theme} ${fallbackText}`);
  }

  function normalizeServiceName(service) {
    const value = cleanSelectValue(service);
    if (value === "after1" || value === "방과후1" || value.includes("월화목토")) return "방과후(월화목토)";
    if (value === "after2" || value === "방과후2" || value.includes("수금토")) return "방과후(수금토)";
    return "주간";
  }

  function normalizeProgramGroup(value) {
    const group = cleanSelectValue(value).toUpperCase();
    if (group === "A" || group === "A그룹") return "A";
    if (group === "B" || group === "B그룹") return "B";
    return "all";
  }

  function normalizeProgramDuration(value) {
    const duration = Math.floor(Number(value));
    return Number.isFinite(duration) && duration > 0 ? duration : 1;
  }

  function normalizeProgramPeriod(value) {
    const period = Math.floor(Number(value));
    return Number.isFinite(period) && period > 0 ? period : 0;
  }

  function normalizeProgramLetterSpacing(value) {
    const spacing = Number(value);
    if (!Number.isFinite(spacing)) return 0;
    return Math.max(-0.18, Math.min(0.12, Math.round(spacing * 100) / 100));
  }

  function isClubProgramMajor(value) {
    return cleanSelectValue(value) === CLUB_MAJOR_THEME;
  }

  function normalizeClubTopicList(value) {
    const source = Array.isArray(value) ? value : splitLines(value);
    return source.map(cleanSelectValue).filter(Boolean).slice(0, CLUB_TOPIC_COUNT);
  }

  function programGroupLabel(value) {
    const group = normalizeProgramGroup(value);
    return PROGRAM_GROUPS.find((item) => item.key === group)?.label || "전체 대상";
  }

  function programGroupSelectLabel(value) {
    const group = normalizeProgramGroup(value);
    return PROGRAM_GROUP_SELECT_LABELS[group] || programGroupLabel(group);
  }

  function inferCategory(text = "") {
    if (text.includes("체육") || text.includes("운동") || text.includes("스포츠")) return "physical";
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
    if (currentView === "stats") {
      currentView = "vacation";
      vacationPanel = "leave";
      localStorage.setItem(ACTIVE_VIEW_KEY, currentView);
      localStorage.setItem(VACATION_PANEL_KEY, vacationPanel);
    }
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
    ensureDailySchedule(homeScheduleDate);

    app.innerHTML = `
      <div class="dashboard-grid">
        <section class="home-logo-card span-12">
          <img src="${CENTER_LOGO_SRC}" alt="송정우리 주간·방과후 활동서비스센터 로고" />
          <div>
            <strong>송정우리 통합업무시스템</strong>
            <span>오늘 일정과 기록을 한 화면에서 확인합니다.</span>
          </div>
        </section>

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
            <h3>시간표</h3>
            <div class="panel-actions">
              <label class="home-schedule-date-field">
                <span class="visually-hidden">시간표 날짜</span>
                <input data-home-schedule-date type="date" value="${h(homeScheduleDate)}" />
              </label>
              <button class="ghost-button" data-print-schedule type="button">인쇄</button>
              <button class="ghost-button" data-open-daily-date="${h(homeScheduleDate)}" type="button">시간표 편집</button>
            </div>
          </div>
          <div class="panel-body">
            ${renderTodayScheduleSummary(homeScheduleDate)}
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
          <label class="monthly-print-control">
            <span>인쇄 범위</span>
            <select id="monthly-print-target">
              ${SERVICE_CALENDARS.map((calendar) => `<option value="${h(calendar.key)}">${h(calendar.title)}</option>`).join("")}
            </select>
          </label>
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
    const panelTabs = `
      <div class="vacation-panel-tabs" role="tablist" aria-label="휴가 관리 화면">
        <button class="ghost-button ${vacationPanel === "schedule" ? "active" : ""}" data-vacation-panel="schedule" type="button">휴가 일정 및 송영 담당</button>
        <button class="ghost-button ${vacationPanel === "leave" ? "active" : ""}" data-vacation-panel="leave" type="button">휴가 관리</button>
      </div>
    `;

    if (vacationPanel === "leave") {
      app.innerHTML = `
        <div class="toolbar-row">
          <div class="toolbar-left"></div>
          <div class="toolbar-right">
            ${panelTabs}
          </div>
        </div>
        ${renderTeacherLeaveStatsPanel()}
      `;
      return;
    }

    app.innerHTML = `
      <div class="toolbar-row">
        <div class="toolbar-left">
          <button class="icon-button" data-vacation-month-action="prev" type="button" aria-label="이전 달">‹</button>
          <h3 class="month-title">${formatMonth(vacationCursor)}</h3>
          <button class="icon-button" data-vacation-month-action="next" type="button" aria-label="다음 달">›</button>
          <button class="ghost-button" data-vacation-month-action="today" type="button">이번 달</button>
        </div>
        <div class="toolbar-right">
          <label class="transport-copy-control">
            <span>복사 범위</span>
            <select data-transport-copy-filter>
              <option value="all" ${transportCopyFilter === "all" ? "selected" : ""}>전체 정보</option>
              ${MOVE_TYPES.map((type) => `<option value="${h(type.label)}" ${transportCopyFilter === type.label ? "selected" : ""}>${h(type.label)}</option>`).join("")}
            </select>
          </label>
          <button class="primary-button" data-print-transport type="button">A4 인쇄</button>
          ${panelTabs}
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
        const holiday = outside ? "" : holidayName(iso);
        const customClosed = !outside && isCustomClosed(iso);
        const closed = !outside && isClosedDate(iso);
        const allowed = calendar.allowedDays.includes(day) && !closed && !outside;
        const canOpen = allowed;
        const items = outside
          ? []
          : programsForDate(iso).filter((program) => programMatchesCalendar(program, calendar, iso));
        const splitGroups = calendar.service === "주간";
        const periodCount = calendar.periodCount || DEFAULT_PROGRAM_PERIOD_COUNT;
        const groupSaturdayTopics = calendar.key !== "day" && day === 6;
        const dayTopNotes = [
          holiday ? `<span class="holiday-label day-top-holiday">${h(holiday)}</span>` : "",
          customClosed
            ? `<button class="holiday-label closed-cancel day-top-holiday" data-toggle-closed-date="${h(iso)}" type="button"><span class="screen-only">휴무 취소</span><span class="print-only">휴무</span></button>`
            : ""
        ]
          .filter(Boolean)
          .join("");

        return `
          <div class="day-cell program-day ${outside ? "outside" : ""} ${isToday ? "today" : ""} ${closed ? "closed" : ""} ${!allowed ? "disabled" : ""}" ${canOpen ? `data-program-drop-date="${h(iso)}" data-program-drop-service="${h(calendar.service)}"` : ""}>
            <div class="day-top">
              <span class="day-number">${outside ? "" : date.getDate()}</span>
              <span class="day-top-meta">
                ${dayTopNotes}
                ${canOpen ? `<button class="add-dot" data-open-program-date="${h(iso)}" data-program-service="${h(calendar.service)}" type="button">+</button>` : ""}
              </span>
            </div>
            ${renderProgramPeriodGrid(items, splitGroups, { periodCount, groupSaturdayTopics })}
          </div>
        `;
      })
      .join("");

    return `
      <section class="service-calendar" data-service-calendar="${h(calendar.key)}">
        <div class="monthly-print-logo-wrap">
          <img src="${h(CENTER_LOGO_SRC)}" alt="송정우리 로고" />
          <strong>송정우리 ${h(calendar.title)}</strong>
          <span>${h(formatMonth(cursor))}</span>
        </div>
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

  function serviceCalendarForService(service) {
    const normalized = normalizeServiceName(service);
    return SERVICE_CALENDARS.find((calendar) => calendar.service === normalized) || SERVICE_CALENDARS[0];
  }

  function programMatchesCalendar(program, calendar, date = program.date) {
    const normalizedService = normalizeServiceName(program.service);
    const targetDate = date || program.date;
    if (normalizedService !== calendar.service) return false;
    return calendar.allowedDays.includes(parseIsoDate(targetDate).getDay());
  }

  function programAllowedForDate(program, date = program.date) {
    return programMatchesCalendar(program, serviceCalendarForService(program.service), date);
  }

  function renderProgramPeriodGrid(items, splitGroups = false, options = {}) {
    const periodCount = options.periodCount || DEFAULT_PROGRAM_PERIOD_COUNT;
    const gridItems = options.groupSaturdayTopics ? groupSaturdayTopicPrograms(items) : items;
    const layout = programPeriodLayout(gridItems, splitGroups, periodCount);
    const periodRows = Array.from({ length: layout.periodCount }, (_, index) => index + 1);
    const classes = [
      "program-period-grid",
      splitGroups ? "split-program-period-grid" : "",
      options.groupSaturdayTopics ? "topic-group-period-grid" : ""
    ]
      .filter(Boolean)
      .join(" ");

    return `
      <div class="${classes}" style="--period-count: ${layout.periodCount}; grid-template-rows: repeat(${layout.periodCount}, minmax(44px, 1fr));">
        ${periodRows.map((period) => `<span class="program-period-row" style="grid-row: ${period};"></span>`).join("")}
        ${layout.entries
          .map((entry) => {
            const dragAttributes = entry.program.isGroupedTopicChip
              ? ""
              : `draggable="true" data-program-drag-id="${h(entry.program.id)}"`;
            return renderProgramChip(entry.program, dragAttributes, {
              period: entry.period,
              duration: entry.duration,
              splitGroups
            });
          })
          .join("")}
      </div>
    `;
  }

  function groupSaturdayTopicPrograms(items) {
    const buckets = new Map();
    const ordered = [];

    items.forEach((program, index) => {
      const major = cleanSelectValue(program.major);
      const topic = cleanSelectValue(program.topic);
      if (normalizeClubTopicList(program.topicList).length || program.isGroupedTopicChip) {
        ordered.push({ program, index });
        return;
      }
      if (!major || !topic) {
        ordered.push({ program, index });
        return;
      }

      const key = [
        normalizeServiceName(program.service),
        program.category || "",
        major,
        normalizeProgramGroup(program.group),
        normalizeProgramPeriod(program.period) || "",
        normalizeProgramLetterSpacing(program.majorLetterSpacing),
        normalizeProgramLetterSpacing(program.topicLetterSpacing)
      ].join("||");

      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push({ program, index });
    });

    buckets.forEach((entries) => {
      if (entries.length < 2) {
        ordered.push(entries[0]);
        return;
      }

      const first = entries[0].program;
      const topics = Array.from(new Set(entries.map(({ program }) => cleanSelectValue(program.topic)).filter(Boolean)));
      const maxSession = Math.max(...entries.map(({ program }) => normalizeProgramDuration(program.session)));
      const groupedSession = Math.max(maxSession, 2);

      ordered.push({
        index: entries[0].index,
        program: {
          ...first,
          id: entries.map(({ program }) => program.id).join("|"),
          isGroupedTopicChip: true,
          topic: "",
          topicList: topics,
          session: groupedSession,
          period: normalizeProgramPeriod(first.period) || first.period
        }
      });
    });

    return ordered.sort((a, b) => a.index - b.index).map(({ program }) => program);
  }

  function programPeriodLayout(items, splitGroups = false, minPeriodCount = DEFAULT_PROGRAM_PERIOD_COUNT) {
    const occupied = { left: new Set(), right: new Set() };
    const sorted = items
      .map((program, index) => ({ program, index, explicitPeriod: normalizeProgramPeriod(program.period) }))
      .sort((a, b) => {
        const periodA = a.explicitPeriod || Number.MAX_SAFE_INTEGER;
        const periodB = b.explicitPeriod || Number.MAX_SAFE_INTEGER;
        if (periodA !== periodB) return periodA - periodB;
        return a.index - b.index;
      });
    let nextPeriod = 1;
    let periodCount = Math.max(1, minPeriodCount || DEFAULT_PROGRAM_PERIOD_COUNT);

    const entries = sorted.map(({ program, explicitPeriod }) => {
      const duration = normalizeProgramDuration(program.session);
      const lanes = programPeriodLanes(program, splitGroups);
      let period = explicitPeriod || nextPeriod;

      while (periodsOverlap(period, duration, lanes, occupied)) {
        period += 1;
      }

      markProgramPeriods(period, duration, lanes, occupied);
      nextPeriod = Math.max(nextPeriod, period + duration);
      periodCount = Math.max(periodCount, period + duration - 1);
      return { program, period, duration, lanes };
    });

    entries.sort((a, b) => a.period - b.period || programGroupOrder(a.program) - programGroupOrder(b.program));
    return { entries, periodCount };
  }

  function programPeriodLanes(program, splitGroups = false) {
    if (!splitGroups) return ["left", "right"];
    const group = normalizeProgramGroup(program.group);
    if (group === "A") return ["left"];
    if (group === "B") return ["right"];
    return ["left", "right"];
  }

  function periodsOverlap(period, duration, lanes, occupied) {
    for (let offset = 0; offset < duration; offset += 1) {
      const targetPeriod = period + offset;
      if (lanes.some((lane) => occupied[lane]?.has(targetPeriod))) return true;
    }
    return false;
  }

  function markProgramPeriods(period, duration, lanes, occupied) {
    for (let offset = 0; offset < duration; offset += 1) {
      const targetPeriod = period + offset;
      lanes.forEach((lane) => occupied[lane]?.add(targetPeriod));
    }
  }

  function programGroupOrder(program) {
    const group = normalizeProgramGroup(program.group);
    if (group === "A") return 0;
    if (group === "B") return 1;
    return 2;
  }

  function nextProgramPeriod(items, splitGroups = false) {
    const layout = programPeriodLayout(items, splitGroups);
    if (!layout.entries.length) return 1;
    return Math.max(...layout.entries.map((entry) => entry.period + entry.duration));
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
                          const canEdit = !isClosedDate(iso) && date.getMonth() === cursor.getMonth();
                          const hasTransportItems = movesForDate(iso).length > 0;
                          return `<td class="${transportDayClasses(date, cursor)}" ${canEdit ? `data-transport-drop-date="${h(iso)}"` : ""}>
                            <span>${date.getDate()}</span>
                            ${
                              canEdit
                                ? `<div class="transport-day-actions">
                                    <button class="add-dot small" data-open-move-date="${h(iso)}" type="button" aria-label="${h(formatShortDate(iso))} 추가">+</button>
                                    ${hasTransportItems ? `<button class="transport-clear-button" data-clear-transport-date="${h(iso)}" type="button" aria-label="${h(formatShortDate(iso))} 휴가·송영 정보 삭제">×</button>` : ""}
                                  </div>`
                                : ""
                            }
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
                    ? renderProgramChip(item)
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
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
    const cellCount = Math.ceil((offset + last.getDate()) / 7) * 7;
    const days = [];

    for (let i = 0; i < cellCount; i += 1) {
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
    const canDrop = !outside && !closed;

    return `
      <td class="${outside ? "outside" : ""} ${closed ? "closed" : ""}" ${canDrop ? `data-transport-drop-date="${h(iso)}"` : ""}>
        ${label && key === "휴가" ? `<div class="closed-text">${h(label)}</div>` : ""}
        ${renderTransportItems(items)}
      </td>
    `;
  }

  function renderTransportItems(items) {
    if (!items.length) return "";
    return `
      <div class="transport-chip-list">
        ${items
          .map((entry) => {
            const typeMeta = MOVE_TYPES.find((type) => type.label === entry.type);
            const itemClass = typeMeta?.className || "day-route";
            const teacher = cleanSelectValue(entry.person);
            const memo = cleanSelectValue(entry.memo);
            return `
              <span class="chip transport-entry-chip ${h(itemClass)}" draggable="true" data-transport-drag-date="${h(entry.date)}" title="${h(shortMoveLabel(entry))}">
                ${teacherBadge(teacher, "담당자 미정")}
                ${memo ? `<small>${h(memo)}</small>` : ""}
              </span>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function transportRowKey(item) {
    return normalizeMoveType(item);
  }

  function renderDaily() {
    ensureDailySchedule(dailyDate);
    const seeded = seedDailyScheduleFromMonthlyPrograms(dailyDate, { onlyIfEmpty: true });
    if (seeded) saveState("월간 프로그램이 일일 시간표에 반영되었습니다.");
    removeDayAbsentUsers(dailyDate);
    removeAftercareAbsentUsers(dailyDate);
    const programOptions = programOptionsForDate(dailyDate);

    app.innerHTML = `
      <div class="toolbar-row">
        <div class="toolbar-left">
          <label class="field">
            <span class="visually-hidden">날짜</span>
            <input id="daily-date" type="date" value="${h(dailyDate)}" />
          </label>
        </div>
        <div class="toolbar-center">
          <button class="danger-button" data-reset-daily-schedule type="button">시간표 초기화</button>
        </div>
        <div class="toolbar-right">
          <button class="primary-button" data-save-daily-schedule type="button">저장</button>
          <button class="primary-button" data-print-schedule type="button">A4 인쇄</button>
          <span class="muted">같은 시간대의 교사와 이용인은 중복되지 않게 자동 정리됩니다.</span>
        </div>
      </div>
      <section class="daily-editor-section">
        <div class="timetable-shell">
          ${renderScheduleColorStrip()}
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

  function renderScheduleColorStrip() {
    return `
      <div class="schedule-color-strip" aria-hidden="true">
        <span class="strip-red"></span>
        <span class="strip-sky"></span>
        <span class="strip-purple"></span>
      </div>
    `;
  }

  function renderScheduleEditorTable(date, programOptions) {
    const rows = [];
    let aftercareBandAdded = false;

    state.settings.timeSlots.forEach((slot, index) => {
      if (index === 0) {
        rows.push(renderScheduleServiceBand("주간 활동 서비스", dayScheduleRangeLabel(), "", renderDayServiceBandSummary(date, { interactive: true, showEmpty: true })));
      }

      if (isAftercareSlot(slot) && !aftercareBandAdded) {
        rows.push(renderScheduleServiceBand("방과후 활동 서비스", aftercareScheduleRangeLabel(), "aftercare-band", renderAftercareServiceBandSummary(date, { interactive: true, showEmpty: true })));
        aftercareBandAdded = true;
      }

      rows.push(
        renderScheduleSlotRows(date, slot, programOptions)
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
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          ${rows.join("")}
        </tbody>
      </table>
    `;
  }

  function renderScheduleServiceBand(label, range, className = "", summary = "") {
    const title = `<span class="service-band-title">${h(label)} (${h(range)})</span>`;
    const content = summary ? `<div class="service-band-content">${title}${summary}</div>` : title;
    return `
      <tr class="service-band ${h(className)}">
        <th colspan="7">${content}</th>
      </tr>
    `;
  }

  function renderDayServiceBandSummary(date, options = {}) {
    const interactive = Boolean(options.interactive);
    const showEmpty = options.showEmpty !== false;
    return renderServiceBandInfoControls("day", date, "주간", DAY_USER_GROUP_KEYS, getDayInfo(date), {
      interactive,
      showEmpty,
      absenceLabel: "주간 결석 이용인",
      commuteLabel: "주간 이용인 개별 등하원 시간"
    });
  }

  function renderAftercareServiceBandSummary(date, options = {}) {
    const interactive = Boolean(options.interactive);
    const showEmpty = options.showEmpty !== false;
    return renderServiceBandInfoControls("aftercare", date, "방과후", AFTERCARE_USER_GROUP_KEYS, getAftercareInfo(date), {
      interactive,
      showEmpty,
      absenceLabel: "방과후 결석 이용인",
      commuteLabel: "방과후 이용인 개별 등하원 시간"
    });
  }

  function renderServiceBandInfoControls(scope, date, label, userGroupKeys, info, options = {}) {
    const value = normalizeAfterInfo(info);
    const absentUsers = value.items.filter((item) => item.type === INFO_ABSENT).map((item) => item.user).filter(Boolean).filter(unique);
    const commuteItems = value.items.filter((item) => item.type !== INFO_ABSENT);
    const showEmpty = options.showEmpty !== false;
    const rightSummary = renderServiceBandRightSummary(scope, date, commuteItems, showEmpty);
    if (!options.interactive && !showEmpty && !absentUsers.length && !commuteItems.length && !rightSummary) return "";

    return `
      <div class="service-band-summary service-band-left" aria-label="${h(label)} 활동 요약">
        <span class="service-band-summary-item has-picker">
          <b>${h(options.absenceLabel || `${label} 결석 이용인`)}</b>
          <span class="service-band-summary-value">${options.interactive ? renderAbsentUserPicker(scope, absentUsers, userGroupKeys) : absentUsers.map(h).join(", ") || "없음"}</span>
        </span>
        ${
          options.interactive
            ? renderCommuteInfoPicker(scope, date, options.commuteLabel || `${label} 이용인 개별 등하원 시간`, userGroupKeys, value)
            : commuteItems.length
              ? `<span class="service-band-summary-item">${commuteSummaryText(commuteItems)}</span>`
              : ""
        }
      </div>
      ${rightSummary}
    `;
  }

  function renderServiceBandRightSummary(scope, date, commuteItems = [], showEmpty = true) {
    const items = serviceBandRightItems(scope, date, commuteItems, showEmpty);
    if (!items.length) return "";

    return `
      <div class="service-band-summary service-band-right" aria-label="휴가 및 등하원 정보">
        ${items
          .map(
            (item) => `
              <span class="service-band-summary-item">
                <b>${h(item.label)}</b>
                <span class="service-band-summary-value">${h(item.value)}</span>
              </span>
            `
          )
          .join("")}
      </div>
    `;
  }

  function serviceBandRightItems(scope, date, commuteItems = [], showEmpty = true) {
    const vacation = vacationSummaryText(date);
    const commute = bandCommuteSummaryText(scope, date, commuteItems);
    return [
      showEmpty || vacation ? { label: "휴가", value: vacation || "없음" } : null,
      showEmpty || commute ? { label: "등하원 정보", value: commute || "없음" } : null
    ].filter(Boolean);
  }

  function vacationSummaryText(date) {
    return movesForDate(date)
      .filter((entry) => {
        const type = MOVE_TYPES.find((item) => item.label === normalizeMoveType(entry));
        return type && !type.className.includes("route");
      })
      .map(shortMoveLabel)
      .filter(Boolean)
      .join(", ");
  }

  function bandCommuteSummaryText(scope, date, commuteItems = []) {
    const routePrefix = scope === "aftercare" ? "방과후" : "주간";
    const transport = movesForDate(date)
      .filter((entry) => normalizeMoveType(entry).startsWith(routePrefix))
      .map(shortMoveLabel)
      .filter(Boolean);
    const commute = commuteSummaryText(commuteItems);
    return [commute, transport.join(", ")].filter(Boolean).join(" / ");
  }

  function renderAbsentUserPicker(scope, absentUsers = [], userGroupKeys = DAY_USER_GROUP_KEYS) {
    const selected = new Set(absentUsers);
    const users = userGroupKeys.flatMap((key) => state.settings.userGroups?.[key] || []).filter(unique);
    const open = scope === "aftercare" ? aftercareAbsentPickerOpen : dayAbsentPickerOpen;

    if (!users.length) return `<span class="muted">등록된 이용인 없음</span>`;

    const selectedLabel = absentUsers.length ? `${absentUsers.length}명 선택` : "선택";

    return `
      <span class="service-band-user-select ${open ? "open" : ""}" data-absent-picker="${h(scope)}" aria-label="결석 이용인 선택">
        <button class="service-band-picker-button" data-toggle-absent-picker="${h(scope)}" type="button" aria-expanded="${open ? "true" : "false"}">
          <span>${h(selectedLabel)}</span>
          <span aria-hidden="true">▾</span>
        </button>
        ${
          open
            ? `
              <span class="service-band-user-picker" role="group" aria-label="주간 결석 이용인 목록">
                ${users
                  .map(
                    (user) => `
                      <label class="check-row">
                        <input data-absent-user="${h(scope)}" type="checkbox" value="${h(user)}" ${selected.has(user) ? "checked" : ""} />
                        ${renderUserNameBadge(user, dailyDate)}
                      </label>
                    `
                  )
                  .join("")}
              </span>
            `
            : ""
        }
      </span>
    `;
  }

  function renderScheduleSlotRows(date, slot, programOptions, options = {}) {
    const slotRecord = getScheduleSlot(date, slot);
    const groups = slotRecord.groups.length ? slotRecord.groups : [blankScheduleGroup()];

    if (isDayDismissalSlot(slot)) {
      return renderDayDismissalEditorRows(date, slot, groups);
    }

    if (isDismissalSlot(slot)) {
      return renderDismissalEditorRow(date, slot, groups[0], {
        hasAftercareInfoSpan: isAftercareSlot(slot) && slot !== firstAftercareSlot()
      });
    }

    const rowSpan = groups.length;
    const aftercare = isAftercareSlot(slot);
    const programSpans = programMergeSpans(groups);

    return groups
      .map((group, index) => {
        const groupTeachers = new Set(groups.filter((item) => item.id !== group.id).flatMap(groupTeacherList));
        const blockedTeachers = aftercare ? groupTeachers : new Set([...groupTeachers, ...supportValues(slotRecord)]);
        const mergedProgramIds = programSpans[index] > 0 ? groups.slice(index, index + programSpans[index]).map((item) => item.id).join(",") : "";

        return `
          <tr class="schedule-group-row ${aftercare ? "aftercare-row" : "day-row"}">
            ${index === 0 ? renderEditableTimeLabel(slot, rowSpan) : ""}
            ${
              programSpans[index] > 0
                ? `<td rowspan="${programSpans[index]}">
                    <input class="schedule-program-input" list="schedule-program-options" data-schedule-group-field="program" data-slot="${h(slot)}" data-group-id="${h(group.id)}" data-merged-group-ids="${h(mergedProgramIds)}" value="${h(group.program)}" placeholder="프로그램 선택 또는 직접 입력" aria-label="${h(slot)} 프로그램" />
                  </td>`
                : ""
            }
            ${
              programSpans[index] > 0
                ? `<td rowspan="${programSpans[index]}">
                    <select data-schedule-group-field="room" data-slot="${h(slot)}" data-group-id="${h(group.id)}" data-merged-group-ids="${h(mergedProgramIds)}" aria-label="${h(slot)} 교실">
                      ${["", ...state.settings.rooms].filter(unique).map((room) => renderOption(room, group.room, "교실 선택")).join("")}
                    </select>
                  </td>`
                : ""
            }
            <td>
              ${renderTeacherMultiSelect(slot, group, blockedTeachers)}
              <div class="group-actions">
                <button class="mini-button" data-add-schedule-group="${h(slot)}" type="button">+ 그룹 추가</button>
                <button class="mini-button" data-copy-group-next="${h(group.id)}" data-slot="${h(slot)}" type="button">다음 시간 복사</button>
                ${groups.length > 1 ? `<button class="mini-button danger-mini" data-remove-schedule-group="${h(group.id)}" data-slot="${h(slot)}" type="button">삭제</button>` : ""}
              </div>
            </td>
            <td>
              ${renderUserPicker(date, slot, groups, group)}
            </td>
            ${
              index === 0
                ? `${SUPPORT_FIELDS.map(
                    (field) => `
                  <td rowspan="${rowSpan}">
                        ${aftercare ? "" : renderSupportSelect(slot, slotRecord, field)}
                      </td>
                    `
                  ).join("")}
                  <td rowspan="${rowSpan}">
                    ${renderRemarkEditor(date, slot, slotRecord)}
                  </td>`
                : ""
            }
          </tr>
        `;
      })
      .join("");
  }

  function renderDayDismissalEditorRows(date, slot, groups) {
    const slotRecord = getScheduleSlot(date, slot);
    const rowSpan = groups.length;

    return groups
      .map((group, index) => {
        const groupTeachers = new Set(groups.filter((item) => item.id !== group.id).flatMap(groupTeacherList));

        return `
          <tr class="schedule-group-row day-row dismissal-row">
            ${index === 0 ? renderEditableTimeLabel(slot, rowSpan) : ""}
            <td>
              <input class="schedule-program-input" list="schedule-program-options" data-schedule-group-field="program" data-slot="${h(slot)}" data-group-id="${h(group.id)}" value="${h(dayDismissalProgram(group))}" placeholder="프로그램 선택 또는 직접 입력" aria-label="${h(slot)} 프로그램" />
            </td>
            <td>
              ${dayDismissalProgram(group) === DEFAULT_DAY_DISMISSAL_PROGRAM
                ? `<div class="fixed-room-cell">${h(DAY_DISMISSAL_ROOM)}</div>`
                : `<select data-schedule-group-field="room" data-slot="${h(slot)}" data-group-id="${h(group.id)}" aria-label="${h(slot)} 교실">
                    ${["", ...state.settings.rooms].filter(unique).map((room) => renderOption(room, group.room, "교실 선택")).join("")}
                  </select>`}
            </td>
            <td>
              ${renderTeacherMultiSelect(slot, group, groupTeachers)}
              <div class="group-actions">
                <button class="mini-button" data-add-schedule-group="${h(slot)}" type="button">+ 그룹 추가</button>
                ${groups.length > 1 ? `<button class="mini-button danger-mini" data-remove-schedule-group="${h(group.id)}" data-slot="${h(slot)}" type="button">삭제</button>` : ""}
              </div>
            </td>
            <td>${renderUserPicker(date, slot, groups, group)}</td>
            ${
              index === 0
                ? `${SUPPORT_FIELDS.map(
                    (field) => `
                      <td rowspan="${rowSpan}">
                        ${renderSupportSelect(slot, slotRecord, field)}
                      </td>
                    `
                  ).join("")}
                  <td rowspan="${rowSpan}">
                    ${renderRemarkEditor(date, slot, slotRecord)}
                  </td>`
                : ""
            }
          </tr>
        `;
      })
      .join("");
  }

  function renderDismissalEditorRow(date, slot, group, options = {}) {
    const targetGroup = group || blankScheduleGroup();
    const userColspan = 3;

    return `
      <tr class="schedule-group-row aftercare-row dismissal-row">
        ${renderEditableTimeLabel(slot)}
        <td class="dismissal-label" colspan="2">하원 송영</td>
        <td>${renderTeacherMultiSelect(slot, targetGroup, new Set())}</td>
        <td colspan="${userColspan}">${renderUserPicker(date, slot, [targetGroup], targetGroup)}</td>
      </tr>
    `;
  }

  function renderEditableTimeLabel(slot, rowSpan = 1) {
    const [start, end] = splitSlotTime(slot);
    return `
      <th class="time-label" ${rowSpan > 1 ? `rowspan="${rowSpan}"` : ""}>
        <div class="slot-time-editor" data-slot="${h(slot)}">
          <input data-slot-time-field="start" type="text" inputmode="numeric" maxlength="5" value="${h(start)}" aria-label="시작 시간" />
          <span>~</span>
          <input data-slot-time-field="end" type="text" inputmode="numeric" maxlength="5" value="${h(end)}" aria-label="종료 시간" />
          <div class="slot-time-actions">
            <button class="mini-icon-button" data-add-time-slot-after="${h(slot)}" type="button" aria-label="${h(formatSlotText(slot))} 뒤에 시간대 추가">+</button>
            <button class="mini-icon-button danger" data-remove-time-slot="${h(slot)}" type="button" aria-label="${h(formatSlotText(slot))} 시간대 삭제">×</button>
          </div>
        </div>
      </th>
    `;
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

  function renderRemarkEditor(date, slot, slotRecord) {
    const autoRemarks = commuteRemarksForSlot(date, slot);
    const teacherNotes = normalizeScheduleTeacherNotes(slotRecord.teacherNotes);
    const teachers = (state.settings.teachers || []).filter(unique);
    return `
      <div class="remark-editor">
        ${autoRemarks.length ? `<div class="remark-auto-list">${autoRemarks.map((remark) => `<span>${remark}</span>`).join("")}</div>` : ""}
        <textarea class="memo-input" data-schedule-slot-memo data-slot="${h(slot)}" rows="3" placeholder="비고">${h(slotRecord.memo || "")}</textarea>
        <div class="remark-teacher-note-editor" data-remark-note-editor data-slot="${h(slot)}">
          ${
            teachers.length
              ? `
                <div class="remark-note-add-row">
                  <select data-remark-note-teacher aria-label="교사 선택">
                    <option value="">교사 선택</option>
                    ${teachers.map((teacher) => `<option value="${h(teacher)}">${h(teacher)}</option>`).join("")}
                  </select>
                  <input data-remark-note-text type="text" placeholder="업무 / 전달사항" aria-label="업무 또는 전달사항" />
                  <button class="mini-button" data-add-remark-note type="button">추가</button>
                </div>
              `
              : `<div class="empty compact">등록된 교사가 없습니다.</div>`
          }
          ${
            teacherNotes.length
              ? `<div class="remark-note-list">
                  ${teacherNotes
                    .map(
                      (note) => `
                        <span class="remark-note-entry">
                          <span>${teacherBadge(note.teacher, note.teacher)} ${h(note.text)}</span>
                          <button class="mini-button danger-mini" data-remove-remark-note="${h(note.id)}" data-slot="${h(slot)}" type="button">삭제</button>
                        </span>
                      `
                    )
                    .join("")}
                </div>`
              : ""
          }
        </div>
      </div>
    `;
  }

  function commuteRemarksForSlot(date, slot) {
    const source = isAftercareSlot(slot) ? getAftercareInfo(date) : getDayInfo(date);
    return groupAftercareItems(
      source.items.filter((item) => item.type !== INFO_ABSENT && commuteItemBelongsToSlot(item, slot))
    ).map((group) => `<b>${h(group.label.replace(/:$/, ""))}</b> ${renderUserNameList(group.users, date)}`);
  }

  function commuteItemBelongsToSlot(item, slot) {
    if (!/\d{1,2}:\d{2}/.test(item.time || "")) return false;
    const time = timeToMinutes(item.time);
    if (!Number.isFinite(time)) return false;
    const [startText, endText] = splitSlotTime(slot);
    const start = timeToMinutes(startText);
    const end = endText ? timeToMinutes(endText) : start + 60;
    return time >= start && time < end;
  }

  function renderAftercareInfo(date) {
    const value = getAftercareInfo(date);
    const timeOptions = aftercareTimeOptions();
    const users = allowedUsersForSlot(firstAftercareSlot() || "");
    const groupedItems = groupAftercareItems(value.items);
    return `
      <div class="aftercare-info" data-aftercare-info>
        <strong>등하원 정보 및 전달 사항</strong>
        <div class="aftercare-add-row">
          <select data-aftercare-draft="type" aria-label="등하원 구분">
            ${AFTERCARE_INFO_TYPES.map((type) => `<option value="${h(type)}">${h(type)}</option>`).join("")}
          </select>
          <div class="aftercare-user-picker" data-aftercare-user-picker aria-label="이용인 선택">
            ${users
              .map(
                (user) => `
                  <label class="check-row">
                    <input data-aftercare-draft-user type="checkbox" value="${h(user)}" />
                    ${renderUserNameBadge(user, date)}
                  </label>
                `
              )
              .join("")}
          </div>
          <select data-aftercare-draft="time" aria-label="시간 선택" disabled>
            <option value="">시간 선택</option>
            ${timeOptions.map((time) => `<option value="${h(time)}">${h(time)}</option>`).join("")}
          </select>
          <button class="mini-button" data-add-aftercare-item type="button">추가</button>
        </div>
        <div class="aftercare-entry-list">
          ${
            groupedItems.length
              ? groupedItems
                  .map(
                    (group) => `
                      <div class="aftercare-entry">
                        <span><b>${h(group.label)}</b> ${renderUserNameList(group.users, date)}</span>
                        <button class="mini-button danger-mini" data-remove-aftercare-item="${h(group.ids.join(","))}" type="button">삭제</button>
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

  function groupAftercareItems(items = []) {
    const groups = new Map();
    normalizeAfterInfo({ items }).items.forEach((item) => {
      const key = item.type === INFO_ABSENT ? item.type : `${item.type}||${item.time}`;
      const label = item.type === INFO_ABSENT ? "결석:" : `${item.type}${item.time ? ` ${item.time}` : ""}:`;
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          label,
          users: [],
          ids: []
        });
      }

      const group = groups.get(key);
      group.users.push(item.user);
      group.ids.push(item.id);
    });

    return Array.from(groups.values()).map((group) => ({
      ...group,
      users: group.users.filter(unique)
    }));
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
    const absentUsers = isAftercareSlot(slot) ? absentAftercareUsers(date) : absentDayUsers(date);
    const vacationTeachers = vacationTeachersForDate(date);

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
                    <div class="user-check-item ${isDisabled ? "disabled" : ""}">
                      <label class="check-row ${isDisabled ? "disabled" : ""}">
                        <input data-schedule-user type="checkbox" value="${h(user)}" ${isChecked ? "checked" : ""} ${isDisabled ? "disabled" : ""} />
                        ${renderUserNameBadge(user, date, isAbsent ? " (결석)" : "")}
                      </label>
                      ${renderUserSubstituteSelect(date, user, vacationTeachers)}
                    </div>
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
    const groupTeachers = new Set(slotRecord.groups.flatMap(groupTeacherList));
    const otherSupport = new Set(SUPPORT_FIELDS.filter((item) => item !== field).flatMap((item) => supportTeacherList(slotRecord, item)));
    const blocked = new Set([...groupTeachers, ...otherSupport]);
    const selectedTeachers = supportTeacherList(slotRecord, field);
    const selectedSet = new Set(selectedTeachers);
    const canMemo = ["docs", "desk"].includes(field);

    return `
      <div class="support-editor">
        <div class="support-checkbox-picker" data-schedule-support-picker data-slot="${h(slot)}" data-support-field="${h(field)}" aria-label="${h(slot)} ${h(SUPPORT_LABELS[field])}">
          ${(state.settings.teachers || [])
            .filter(unique)
            .map((teacher) => {
              const disabled = teacher && !selectedSet.has(teacher) && blocked.has(teacher);
              const selected = selectedSet.has(teacher);
              const note = supportNoteValue(slotRecord, field, teacher);
              const noteOpen = supportNoteEditor?.slot === slot && supportNoteEditor?.field === field && supportNoteEditor?.teacher === teacher;
              return `
                <div class="support-check-item ${disabled ? "disabled" : ""}">
                  <label class="check-row ${disabled ? "disabled" : ""}">
                    <input data-schedule-support-field="${h(field)}" type="checkbox" value="${h(teacher)}" ${selected ? "checked" : ""} ${disabled ? "disabled" : ""} />
                    <span>${h(teacher)}</span>
                  </label>
                  ${
                    selected && canMemo
                      ? `<button class="support-note-button ${note ? "has-note" : ""}" data-open-support-note data-slot="${h(slot)}" data-support-field="${h(field)}" data-support-note-teacher="${h(teacher)}" type="button" aria-label="${h(teacher)} 메모">✏</button>`
                      : ""
                  }
                  ${
                    selected && canMemo && noteOpen
                      ? `<input class="support-note-input" data-schedule-support-note-field="${h(field)}" data-support-note-teacher="${h(teacher)}" data-slot="${h(slot)}" value="${h(note)}" placeholder="${h(teacher)} 메모" style="--teacher-color: ${h(teacherColor(teacher))}" />`
                      : ""
                  }
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderTeacherMultiSelect(slot, group, blocked) {
    const selectedSet = new Set(groupTeacherList(group));
    const paperSet = new Set(normalizeTeacherList(group.paperTeachers).filter((teacher) => selectedSet.has(teacher)));

    return `
      <div class="teacher-checkbox-picker" data-schedule-teachers data-slot="${h(slot)}" data-group-id="${h(group.id)}" aria-label="${h(slot)} 담당 교사">
        ${(state.settings.teachers || [])
          .filter(unique)
          .map((teacher) => {
            const disabled = teacher && !selectedSet.has(teacher) && blocked.has(teacher);
            return `
              <div class="teacher-check-item ${disabled ? "disabled" : ""}">
                <label class="check-row ${disabled ? "disabled" : ""}">
                  <input data-schedule-teacher type="checkbox" value="${h(teacher)}" ${selectedSet.has(teacher) ? "checked" : ""} ${disabled ? "disabled" : ""} />
                  <span>${paperSet.has(teacher) ? "*" : ""}${h(teacher)}</span>
                </label>
                <label class="paper-check-row ${!selectedSet.has(teacher) ? "disabled" : ""}" title="서류 업무 가능">
                  <input data-schedule-paper-teacher type="checkbox" value="${h(teacher)}" ${paperSet.has(teacher) ? "checked" : ""} ${!selectedSet.has(teacher) ? "disabled" : ""} />
                  <span>*</span>
                </label>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderTeacherMultiOptions(selected, blocked) {
    const selectedSet = new Set(normalizeTeacherList(selected));

    return (state.settings.teachers || [])
      .filter(unique)
      .map((teacher) => {
        const disabled = teacher && !selectedSet.has(teacher) && blocked.has(teacher);
        return `<option value="${h(teacher)}" ${selectedSet.has(teacher) ? "selected" : ""} ${disabled ? "disabled" : ""}>${h(teacher)}</option>`;
      })
      .join("");
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

  function renderObservationForm(editingObservation = null) {
    const isEditing = Boolean(editingObservation);
    const formDate = editingObservation?.date || observationFormDate || todayIso;
    const highlights = isEditing ? observationHighlightTerms : observationHighlightTerms;
    const summary = editingObservation?.summary || "";
    return `
      <form id="observation-form" class="field-grid">
        <label class="field">
          <span>날짜</span>
          <input data-observation-date name="date" type="date" value="${h(formDate)}" required />
        </label>
        <label class="field">
          <span>이용인</span>
          <select name="user" required>
            ${flattenUserGroups().map((user) => `<option value="${h(user)}" ${user === editingObservation?.user ? "selected" : ""}>${h(user)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>관찰자</span>
          <select name="teacher">
            ${state.settings.teachers.map((teacher) => `<option value="${h(teacher)}" ${teacher === editingObservation?.teacher ? "selected" : ""}>${h(teacher)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>관찰 시간</span>
          <input name="activity" list="observation-time-options" value="${h(editingObservation?.activity || "")}" placeholder="시간 선택 또는 직접 입력" />
          ${renderObservationTimeDatalist(formDate)}
        </label>
        <div class="field full observation-summary-field">
          <span>내용</span>
          <div class="observation-editor-wrap">
            <div class="observation-highlight-editor" data-observation-summary contenteditable="true" tabindex="0" role="textbox" aria-multiline="true" data-placeholder="관찰 내용을 입력하세요.">${renderHighlightedText(summary, highlights)}</div>
            <textarea class="visually-hidden" data-observation-summary-value name="summary">${h(summary)}</textarea>
          </div>
          <div class="observation-highlight-menu" data-observation-highlight-menu hidden>
            <button data-apply-observation-highlight type="button">하이라이트 표시</button>
          </div>
        </div>
        <div class="modal-actions field full">
          ${isEditing ? `<button class="ghost-button" data-cancel-observation-edit type="button">취소</button>` : ""}
          <button class="primary-button" type="submit">${isEditing ? "수정 저장" : "저장"}</button>
        </div>
      </form>
    `;
  }

  function renderObservationTimeDatalist(date) {
    return `
      <datalist id="observation-time-options">
        ${observationTimeOptionsForDate(date).map((slot) => `<option value="${h(slot)}"></option>`).join("")}
      </datalist>
    `;
  }

  function observationTimeOptionsForDate(date) {
    const iso = normalizeDateInput(date) || todayIso;
    ensureDailySchedule(iso);
    return (state.settings.timeSlots || []).map((slot) => {
      const slotRecord = getScheduleSlot(iso, slot);
      const programs = (slotRecord.groups || [])
        .map((group) => (isDayDismissalSlot(slot) ? dayDismissalProgram(group) : cleanSelectValue(group.program)))
        .filter(Boolean)
        .filter(unique);
      return `${slot} · ${programs.join(", ") || "프로그램 미입력"}`;
    }).filter(Boolean).filter(unique);
  }

  function renderObservations() {
    const observations = [...state.observations].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const observationUsers = observations.map((item) => cleanSelectValue(item.user)).filter(Boolean).filter(unique);
    if (observationUserFilter && !observationUsers.includes(observationUserFilter)) {
      observationUserFilter = "";
    }
    const filteredObservations = observationUserFilter ? observations.filter((item) => cleanSelectValue(item.user) === observationUserFilter) : observations;
    const editingObservation = state.observations.find((item) => item.id === observationEditingId) || null;

    app.innerHTML = `
      <div class="dashboard-grid">
        <section class="panel span-5">
          <div class="panel-head">
            <h3>${editingObservation ? "관찰일지 수정" : "관찰일지 작성"}</h3>
          </div>
          <div class="panel-body">
            ${renderObservationForm(editingObservation)}
          </div>
        </section>
        <section class="panel span-7">
          <div class="panel-head">
            <h3>최근 기록</h3>
            <div class="panel-actions observation-actions">
              <select class="observation-user-filter" data-observation-user-filter aria-label="관찰 이용인 선택">
                <option value="">전체 이용인</option>
                ${observationUsers.map((user) => `<option value="${h(user)}" ${user === observationUserFilter ? "selected" : ""}>${h(user)}</option>`).join("")}
              </select>
              <button class="ghost-button" data-print-observations type="button">선택 인쇄</button>
            </div>
          </div>
          <div class="panel-body">
            ${
              observations.length
                ? filteredObservations.length
                  ? `<div class="list">${filteredObservations
                    .map(
                      (item) => `
                        <article class="list-item">
                          <label class="select-line">
                            <input data-observation-print-select type="checkbox" value="${h(item.id)}" />
                            <strong>${h(item.user || "이용인 미지정")} · ${h(item.activity || "관찰 시간 미입력")}</strong>
                          </label>
                          <small>${h(formatShortDate(item.date))} / ${teacherBadge(item.teacher, "관찰자 미지정")}</small>
                          <span class="observation-summary">${renderHighlightedText(item.summary, item.highlights)}</span>
                          <div>
                            <button class="ghost-button" data-edit-observation="${h(item.id)}" type="button">수정</button>
                            <button class="danger-button" data-delete-observation="${h(item.id)}" type="button">삭제</button>
                          </div>
                        </article>
                      `
                    )
                    .join("")}</div>`
                  : `<div class="empty">선택한 이용인의 관찰일지가 없습니다.</div>`
                : `<div class="empty">아직 작성된 관찰일지가 없습니다.</div>`
            }
            ${filteredObservations.length ? `<div class="observation-print-area">${renderObservationPrintSheet(filteredObservations)}</div>` : ""}
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
                <p>${renderHighlightedText(item.summary, item.highlights)}</p>
              </article>
            `
          )
          .join("")}
        <footer class="observation-print-logo">
          <img src="${CENTER_LOGO_SRC}" alt="송정우리 주간·방과후 활동서비스센터 로고" />
        </footer>
      </section>
    `;
  }

  function renderHighlightedText(text, terms = []) {
    const source = String(text || "");
    const highlights = normalizeHighlightTerms(terms).sort((a, b) => b.length - a.length);
    if (!source || !highlights.length) return h(source);

    const pattern = highlights.map(escapeRegExp).join("|");
    const regex = new RegExp(`(${pattern})`, "gi");
    return source
      .split(regex)
      .map((part) => {
        if (!part) return "";
        const isHighlight = highlights.some((term) => term.toLowerCase() === part.toLowerCase());
        return isHighlight ? `<mark class="red-highlight">${h(part)}</mark>` : h(part);
      })
      .join("");
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function renderStats() {
    const periods = workStatPeriods();

    app.innerHTML = `
      <div class="work-stats-stack">
        ${renderTeacherLeaveStatsPanel()}
        ${periods.map(renderWorkStatsPanel).join("")}
      </div>
    `;
  }

  function renderUserSubstituteSelect(date, user, vacationTeachers = vacationTeachersForDate(date)) {
    const assignedTeacher = assignedTeacherForUser(user);
    if (!assignedTeacher || !vacationTeachers.has(assignedTeacher)) return "";

    const selected = substituteTeacherForUser(date, user);
    const teachers = (state.settings.teachers || []).filter((teacher) => teacher !== assignedTeacher && !vacationTeachers.has(teacher));
    return `
      <select class="user-substitute-select" data-user-substitute-teacher="${h(user)}" aria-label="${h(user)} 대체 교사">
        <option value="">대체 교사</option>
        ${teachers.map((teacher) => `<option value="${h(teacher)}" ${teacher === selected ? "selected" : ""}>${h(teacher)}</option>`).join("")}
      </select>
    `;
  }

  function renderTeacherLeaveStatsPanel() {
    const rows = computeTeacherLeaveStats()
      .map(
        (row) => `
          <tr>
            <th>${teacherBadge(row.teacher, row.teacher)}</th>
            <td>${row.hireDate ? `<strong>${h(row.hireDate)}</strong>` : ""}</td>
            <td>${row.baseLeaveLabel ? `<strong>${h(row.baseLeaveLabel)}</strong>` : ""}</td>
            <td>${row.specialLeaveLabel ? `<strong>${h(row.specialLeaveLabel)}</strong>` : ""}</td>
            <td>
              <strong>${h(row.compLabel)}</strong>
            </td>
          </tr>
        `
      )
      .join("");

    return `
      <section class="panel leave-stats-panel">
        <div class="panel-head">
          <div>
            <h3>연월차 현황</h3>
          </div>
        </div>
        <div class="panel-body">
          <table class="work-stats-table leave-stats-table">
            <thead>
              <tr>
                <th>교사</th>
                <th>입사일</th>
                <th>연월차</th>
                <th>생일 및 경조사 휴가</th>
                <th>토요일 만근 보상 휴가</th>
              </tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="5">등록된 교사가 없습니다.</td></tr>`}</tbody>
          </table>
        </div>
      </section>
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
          groupTeacherList(group).forEach((teacher) => addWorkMinutes(byTeacher, totals, teacher, "lesson", duration));
        });

        if (!isAftercareSlot(slot)) {
        SUPPORT_FIELDS.forEach((field) => {
          supportTeacherList(slotRecord, field).forEach((teacher) => addWorkMinutes(byTeacher, totals, teacher, field, duration));
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

  function computeTeacherLeaveStats() {
    const today = parseIsoDate(todayIso);
    const currentYear = today.getFullYear();

    return (state.settings.teachers || []).map((teacher) => {
      const profile = state.settings.teacherProfiles?.[teacher] || {};
      const hireDate = normalizeDateInput(profile.hireDate);
      const birthday = normalizeDateInput(profile.birthday);
      const hire = hireDate ? parseIsoDate(hireDate) : null;
      const anniversary = hire ? addYears(hire, 1) : null;
      const anniversaryIso = anniversary ? toIsoDate(anniversary) : "";
      const underOneYear = Boolean(hire && today < anniversary);
      const annualEligible = Boolean(hire && today >= anniversary);
      const leaveUses = teacherLeaveUses(teacher);
      const monthlyUsed = hire ? leaveUses.annualLike.filter((item) => item.date < anniversaryIso).reduce((sum, item) => sum + item.units, 0) : 0;
      const annualUsed = hire ? leaveUses.annualLike.filter((item) => item.date >= anniversaryIso).reduce((sum, item) => sum + item.units, 0) : leaveUses.annualLike.reduce((sum, item) => sum + item.units, 0);
      const monthlyAccrued = underOneYear ? accruedMonthlyLeaves(hire, today) : 0;
      const annualGranted = annualEligible ? 15 : 0;
      const birthdayUsed = leaveUses.birthday.filter((item) => parseIsoDate(item.date).getFullYear() === currentYear).length;
      const birthdayWeek = birthday ? birthdayWeekRange(birthday, currentYear) : null;
      const birthdayInWeek = Boolean(birthdayWeek && today >= birthdayWeek.start && today <= birthdayWeek.end);
      const birthdayGranted = annualEligible ? 1 : 0;
      const birthdayRemaining = birthdayGranted && birthdayInWeek && !birthdayUsed ? 1 : 0;
      const currentMonthIso = toIsoDate(startOfMonth(today));
      const compEarned = hire ? earnedPreviousMonthCompLeaveUnits(teacher, hire, today) : 0;
      const compUsed = leaveUses.comp.filter((item) => item.date >= currentMonthIso && item.date <= todayIso).reduce((sum, item) => sum + item.units, 0);
      const familyEventUsed = leaveUses.familyEvent.reduce((sum, item) => sum + item.units, 0);
      const familyEventRemaining = familyEventUsed ? Math.max(0, SPECIAL_EVENT_LEAVE_DAYS - familyEventUsed) : 0;
      const monthlyLabel = hire
        ? underOneYear
          ? `${formatLeaveUnits(monthlyAccrued)} 발생 / ${formatLeaveUnits(monthlyUsed)} 사용 / ${formatLeaveUnits(Math.max(0, monthlyAccrued - monthlyUsed))} 남음`
          : "근속 1년 경과"
        : "입사일 필요";
      const annualLabel = hire
        ? annualEligible
          ? `${formatLeaveUnits(annualGranted)} 지급 / ${formatLeaveUnits(annualUsed)} 사용 / ${formatLeaveUnits(Math.max(0, annualGranted - annualUsed))} 남음`
          : `${anniversaryIso} 지급 예정`
        : "입사일 필요";
      const birthdayLabel = birthday
        ? annualEligible
          ? `${formatLeaveUnits(birthdayRemaining)} 남음`
          : "근속 1년 후"
        : "생일 필요";
      const birthdayStatus = birthday
        ? annualEligible
          ? birthdayUsed
            ? "올해 사용 완료"
            : birthdayInWeek
              ? "이번 생일 주간 사용 가능"
              : "생일 주간에 사용 가능"
          : "근속 1년 이상부터"
        : "교사 관리에서 생일 입력";
      const familyEventLabel = familyEventUsed
        ? `${formatLeaveUnits(familyEventUsed)} 사용 / ${formatLeaveUnits(familyEventRemaining)} 남음`
        : "사용 기록 없음";
      const specialLeaveParts = [];
      if (birthday && annualEligible) specialLeaveParts.push(`생일 ${birthdayLabel}`);
      if (familyEventUsed) specialLeaveParts.push(`경조사 ${familyEventLabel}`);

      return {
        teacher,
        hireDate,
        tenureLabel: hire ? tenureLabel(hire, today) : "",
        baseLeaveLabel: hire ? (annualEligible ? annualLabel : monthlyLabel) : "",
        baseLeaveStatus: "",
        specialLeaveLabel: specialLeaveParts.join(" / "),
        specialLeaveStatus: "",
        compLabel: hire ? formatLeaveCount(Math.max(0, compEarned - compUsed)) : formatLeaveCount(0),
      };
    });
  }

  function teacherLeaveUses(teacher) {
    const result = { annualLike: [], birthday: [], comp: [], familyEvent: [] };
    (state.vacationTransport || []).forEach((entry) => {
      if (cleanSelectValue(entry.person) !== teacher) return;
      const type = normalizeMoveType(entry);
      const date = normalizeDateInput(entry.date);
      if (!date) return;

      if (type === "휴가") result.annualLike.push({ date, units: 1 });
      if (type === "오전 반차" || type === "오후 반차") result.annualLike.push({ date, units: 0.5 });
      if (type === "생일 휴가") result.birthday.push({ date, units: 1 });
      if (type === "보상휴가") result.comp.push({ date, units: 0.5 });
      if (type === "경조사 휴가") result.familyEvent.push({ date, units: 1 });
    });
    return result;
  }

  function accruedMonthlyLeaves(hire, today) {
    let count = 0;
    const anniversary = addYears(hire, 1);
    const cursor = startOfMonth(hire);
    const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    while (cursor <= previousMonthEnd && cursor < anniversary) {
      const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
      if (monthEnd >= hire) count += 1;
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return Math.min(11, count);
  }

  function earnedPreviousMonthCompLeaveUnits(teacher, hire, today) {
    const targetMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const saturdays = eligibleCompLeaveSaturdays(targetMonth).filter((date) => date >= hire);
    if (!saturdays.length) return 0;
    return saturdays.every((date) => teacherWorkedOnDate(teacher, toIsoDate(date))) ? 0.5 : 0;
  }

  function eligibleCompLeaveSaturdays(monthDate) {
    return saturdaysInMonth(monthDate).filter((date) => {
      const iso = toIsoDate(date);
      return !isClosedDate(iso) && centerClassHeldOnDate(iso);
    });
  }

  function centerClassHeldOnDate(date) {
    const daySchedule = state.dailySchedules?.[date];
    if (!daySchedule) return false;

    return Object.entries(daySchedule).some(([slot, slotRecord]) => {
      const rawSlot = String(slot || "").split("||")[0];
      if (isDismissalSlot(rawSlot)) return false;
      return normalizeScheduleSlot(slotRecord).groups.some(centerClassGroupHasContent);
    });
  }

  function centerClassGroupHasContent(group = {}) {
    return Boolean(cleanSelectValue(group.program) || cleanSelectValue(group.room) || groupTeacherList(group).length || normalizeUserList(group.users).length);
  }

  function teacherWorkedOnDate(teacher, date) {
    const daySchedule = state.dailySchedules?.[date];
    if (!daySchedule) return false;

    return Object.values(daySchedule).some((slotRecord) => {
      const normalized = normalizeScheduleSlot(slotRecord);
      const groupMatch = normalized.groups.some((group) => groupTeacherList(group).includes(teacher));
      const supportMatch = SUPPORT_FIELDS.some((field) => supportTeacherList(normalized, field).includes(teacher));
      return groupMatch || supportMatch;
    });
  }

  function saturdaysInMonth(monthDate) {
    const dates = [];
    const cursor = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    while (cursor.getMonth() === monthDate.getMonth()) {
      if (cursor.getDay() === 6) dates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }

  function birthdayWeekRange(birthday, year) {
    const source = parseIsoDate(birthday);
    const date = new Date(year, source.getMonth(), source.getDate());
    const start = new Date(date);
    start.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  }

  function tenureLabel(hire, today) {
    if (today < hire) return "입사 예정";
    let years = today.getFullYear() - hire.getFullYear();
    let months = today.getMonth() - hire.getMonth();
    if (today.getDate() < hire.getDate()) months -= 1;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return `근속기간 : ${Math.max(0, years)}년 ${Math.max(0, months)}월`;
  }

  function formatLeaveUnits(value) {
    const units = Math.max(0, Number(value) || 0);
    return `${Number.isInteger(units) ? units : units.toFixed(1)}일`;
  }

  function formatLeaveCount(value) {
    const units = Math.max(0, Number(value) || 0);
    return `${Number.isInteger(units) ? units : units.toFixed(1)}개`;
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

  function normalizeTimeInput(value) {
    const text = cleanSelectValue(value);
    const colonMatch = text.match(/^(\d{1,2}):(\d{2})$/);
    const compactMatch = text.match(/^(\d{1,2})(\d{2})$/);
    const match = colonMatch || compactMatch;
    if (!match) return "";

    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return "";
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
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
    const teachers = state.settings.teachers || [];
    if ((!selectedAssignmentTeacher || !teachers.includes(selectedAssignmentTeacher)) && teachers.length) {
      selectedAssignmentTeacher = teachers[0];
    }
    if (assignmentEditMode) {
      assignmentDraft = normalizeUserAssignments(assignmentDraft || state.settings.userAssignments, state.settings.users, teachers);
    }

    app.innerHTML = `
      <div class="dashboard-grid">
        <section class="panel span-8">
          <div class="panel-head">
            <h3>이용인 관리</h3>
            ${renderPeopleEditActions("users", userEditMode)}
          </div>
          <div class="panel-body">
            ${renderPeopleGroupLayout()}
          </div>
        </section>
        <section class="panel span-4 teacher-management-panel">
          <div class="panel-head">
            <h3>교사 관리</h3>
            ${renderPeopleEditActions("teachers", teacherEditMode)}
          </div>
          <div class="panel-body">
            ${
              teacherEditMode
                ? `<form class="inline-add-form" data-add-teacher-form>
                    <input name="name" placeholder="교사 이름" autocomplete="off" />
                    <button class="primary-button" type="submit">추가</button>
                  </form>`
                : ""
            }
            <div class="people-list teacher-list">
              ${state.settings.teachers.map(renderTeacherRow).join("") || `<div class="empty">등록된 교사가 없습니다.</div>`}
            </div>
          </div>
        </section>
        ${renderTeacherUserAssignmentPanel()}
      </div>
    `;
  }

  function renderPeopleEditActions(section, active) {
    return `
      <div class="panel-actions people-edit-actions">
        <button class="ghost-button" data-edit-people="${h(section)}" type="button" ${active ? "disabled" : ""}>수정</button>
        <button class="primary-button" data-save-people="${h(section)}" type="button" ${active ? "" : "disabled"}>저장</button>
      </div>
    `;
  }

  function renderPeopleGroupLayout() {
    return `
      <div class="people-management-grid grouped-people-management-grid">
        <div class="day-group-stack">
          ${renderUserGroupCard(USER_GROUPS.find((group) => group.key === "dayA"))}
          ${renderUserGroupCard(USER_GROUPS.find((group) => group.key === "dayB"))}
        </div>
        ${renderUserGroupCard(USER_GROUPS.find((group) => group.key === "afterMonTueThuSat"))}
        ${renderUserGroupCard(USER_GROUPS.find((group) => group.key === "afterWedFriSat"))}
      </div>
    `;
  }

  function renderUserGroupCard(group) {
    if (!group) return "";
    const users = state.settings.userGroups?.[group.key] || [];

    return `
      <article class="people-card ${group.key === "dayA" || group.key === "dayB" ? "day-people-card" : ""}">
        <header>
          <div>
            <h4>${h(group.label)}</h4>
            <span>${users.length}명</span>
          </div>
        </header>
        ${
          userEditMode
            ? `<form class="inline-add-form" data-add-user-form data-user-group="${h(group.key)}">
                <input name="name" placeholder="이용인 이름" autocomplete="off" />
                <button class="primary-button" type="submit">추가</button>
              </form>`
            : ""
        }
        <div class="people-list">
          ${users.map((user) => renderUserRow(group.key, user)).join("") || `<div class="empty">등록된 이용인이 없습니다.</div>`}
        </div>
      </article>
    `;
  }

  function renderUserRow(groupKey, user) {
    if (!userEditMode) {
      return `<div class="person-row person-summary-row"><span>${h(user)}</span></div>`;
    }

    return `
      <div class="person-row">
        <input data-user-edit value="${h(user)}" aria-label="${h(user)} 이름 수정" />
        <button class="ghost-button" data-update-user="${h(user)}" data-user-group="${h(groupKey)}" type="button">수정</button>
        <button class="danger-button" data-delete-user="${h(user)}" data-user-group="${h(groupKey)}" type="button">삭제</button>
      </div>
    `;
  }

  function renderTeacherUserAssignmentPanel() {
    const teachers = state.settings.teachers || [];
    const selectedTeacher = teachers.includes(selectedAssignmentTeacher) ? selectedAssignmentTeacher : teachers[0] || "";

    return `
      <section class="panel span-12 teacher-assignment-panel">
        <div class="panel-head">
          <h3>담당 이용인 관리</h3>
          <div class="panel-actions assignment-actions">
            <button class="ghost-button" data-edit-assignments type="button" ${assignmentEditMode || !selectedTeacher ? "disabled" : ""}>수정</button>
            <button class="primary-button" data-save-assignments type="button" ${assignmentEditMode && selectedTeacher ? "" : "disabled"}>저장</button>
          </div>
        </div>
        <div class="panel-body">
          ${
            selectedTeacher
              ? `<div class="teacher-assignment-grid ${assignmentEditMode ? "is-editing" : "is-viewing"}">
                  <label class="assignment-teacher-field">
                    <span>교사</span>
                    <select data-assignment-teacher-select>
                      ${teachers.map((teacher) => `<option value="${h(teacher)}" ${teacher === selectedTeacher ? "selected" : ""}>${h(teacher)}</option>`).join("")}
                    </select>
                  </label>
                  ${ASSIGNMENT_GROUPS.map((group) =>
                    assignmentEditMode ? renderAssignmentUserColumn(group, selectedTeacher) : renderAssignmentSummaryColumn(group, selectedTeacher)
                  ).join("")}
                </div>`
              : `<div class="empty">등록된 교사가 없습니다.</div>`
          }
        </div>
      </section>
    `;
  }

  function renderAssignmentUserColumn(group, selectedTeacher) {
    const users = group.keys.flatMap((key) => state.settings.userGroups?.[key] || []).filter(unique);
    const assignments = assignmentEditMode ? assignmentDraft || state.settings.userAssignments : state.settings.userAssignments;
    return `
      <section class="assignment-user-column">
        <h4>${h(group.label)}</h4>
        <div class="assignment-user-list">
          ${
            users.length
              ? users
                  .map((user) => {
                    const assignedTeacher = assignedTeacherForUser(user, assignments);
                    const checked = assignedTeacher === selectedTeacher;
                    return `
                      <label class="check-row assignment-check-row ${assignedTeacher && !checked ? "assigned-other" : ""}">
                        <input data-user-assignment type="checkbox" value="${h(user)}" ${checked ? "checked" : ""} />
                        ${renderUserNameBadge(user)}
                        ${assignedTeacher && !checked ? `<small>${h(assignedTeacher)}</small>` : ""}
                      </label>
                    `;
                  })
                  .join("")
              : `<div class="empty compact">등록된 이용인이 없습니다.</div>`
          }
        </div>
      </section>
    `;
  }

  function renderAssignmentSummaryColumn(group, selectedTeacher) {
    const users = group.keys
      .flatMap((key) => state.settings.userGroups?.[key] || [])
      .filter(unique)
      .filter((user) => assignedTeacherForUser(user) === selectedTeacher);

    return `
      <section class="assignment-user-column assignment-summary-column">
        <h4>${h(group.label)}</h4>
        <div class="assignment-user-list">
          ${
            users.length
              ? users.map((user) => `<div class="assignment-summary-row">${renderUserNameBadge(user)}</div>`).join("")
              : `<div class="empty compact">담당 이용인이 없습니다.</div>`
          }
        </div>
      </section>
    `;
  }

  function renderTeacherRow(teacher) {
    const color = teacherColor(teacher);
    const profile = state.settings.teacherProfiles?.[teacher] || {};
    if (!teacherEditMode) {
      return `
        <div class="person-row teacher-summary-row">
          <span class="teacher-summary-name">${teacherBadge(teacher, teacher)}</span>
          ${profile.hireDate ? `<span class="teacher-summary-date">입사일 ${h(profile.hireDate)}</span>` : ""}
          ${profile.birthday ? `<span class="teacher-summary-date">생일 ${h(profile.birthday)}</span>` : ""}
        </div>
      `;
    }

    return `
      <div class="person-row teacher-row">
        <input data-teacher-edit value="${h(teacher)}" aria-label="${h(teacher)} 이름 수정" />
        <input class="teacher-color-input" data-teacher-color type="color" value="${h(color)}" aria-label="${h(teacher)} 색상" />
        <label class="teacher-profile-field">
          <span>입사일</span>
          <input data-teacher-hire-date type="date" value="${h(profile.hireDate || "")}" />
        </label>
        <label class="teacher-profile-field">
          <span>생일</span>
          <input data-teacher-birthday type="date" value="${h(profile.birthday || "")}" />
        </label>
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
                <small>${h(programMetaLabel(program, { service: true }))}</small>
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

  function renderTodayScheduleSummary(date = todayIso) {
    ensureDailySchedule(date);

    return `
      ${renderTodayTeacherSummary(date)}
      <div class="print-preview-wrap today-schedule-preview">${renderSchedulePrintSheet(date)}</div>
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
        if (!groupTeacherList(group).includes(teacher)) return;
        if (isDayDismissalSlot(slot)) {
          rows.push({
            slot,
            kind: dayDismissalProgram(group),
            detail: [group.room || "교실 미선택", normalizeUserList(group.users).join(", ")]
              .filter(Boolean)
              .join(" / ")
          });
          return;
        }

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
          if (!supportTeacherList(slotRecord, field).includes(teacher)) return;
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
        rows.push(renderScheduleServiceBand("주간 활동 서비스", dayScheduleRangeLabel(), "", renderDayServiceBandSummary(date, { showEmpty: false })));
      }

      if (isAftercareSlot(slot) && !aftercareBandAdded) {
        rows.push(renderScheduleServiceBand("방과후 활동 서비스", aftercareScheduleRangeLabel(), "aftercare-band", renderAftercareServiceBandSummary(date, { showEmpty: false })));
        aftercareBandAdded = true;
      }

      rows.push(renderSchedulePrintRows(date, slot));
    });

    return `
      <article class="print-sheet">
        <header class="print-sheet-head">
          <img class="print-sheet-logo" src="${CENTER_LOGO_SRC}" alt="송정우리 로고" />
          <div>
            <strong>송정우리 일일 시간표</strong>
            <span>${h(formatLongDate(date))}</span>
          </div>
        </header>
        ${renderScheduleColorStrip()}
        <table class="print-timetable">
          <thead>
            <tr>
              <th>시간</th>
              <th>프로그램</th>
              <th>교실</th>
              <th>담당 교사</th>
              <th>이용인</th>
              <th>휴게</th>
              <th>비고</th>
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
    if (isDayDismissalSlot(slot)) {
      return renderDayDismissalPrintRows(date, slot, groups);
    }

    if (isDismissalSlot(slot)) {
      return renderDismissalPrintRow(date, slot, groups[0], {
        hasAftercareInfoSpan: aftercare && slot !== firstAftercareSlot()
      });
    }

    return groups
      .map(
        (group, index) => `
          <tr class="${aftercare ? "aftercare-row" : "day-row"}">
            ${index === 0 ? `<th class="time-label" rowspan="${rowSpan}">${formatSlotLabel(slot)}</th>` : ""}
            ${programSpans[index] > 0 ? `<td rowspan="${programSpans[index]}">${h(group.program || "")}</td>` : ""}
            ${programSpans[index] > 0 ? `<td rowspan="${programSpans[index]}">${h(group.room || "")}</td>` : ""}
            <td>${teacherBadgeListForGroup(group, "")}</td>
            <td>${renderUserNameList(normalizeUserList(group.users), date)}</td>
            ${
              index === 0
                ? `${SUPPORT_FIELDS.map((field) => `<td rowspan="${rowSpan}">${renderSupportPrintCell(slotRecord, field)}</td>`).join("")}
                  <td rowspan="${rowSpan}">${renderRemarkPrintCell(date, slot, slotRecord)}</td>`
                : ""
            }
          </tr>
        `
      )
      .join("");
  }

  function renderDayDismissalPrintRows(date, slot, groups) {
    const slotRecord = state.dailySchedules?.[date]?.[slot] || normalizeScheduleSlot();
    const rowSpan = groups.length;

    return groups
      .map(
        (group, index) => `
          <tr class="day-row dismissal-row">
            ${index === 0 ? `<th class="time-label" rowspan="${rowSpan}">${formatSlotLabel(slot)}</th>` : ""}
            <td>${h(dayDismissalProgram(group))}</td>
            <td>${h(group.room || "")}</td>
            <td>${teacherBadgeListForGroup(group, "")}</td>
            <td>${renderUserNameList(normalizeUserList(group.users), date)}</td>
            ${
              index === 0
                ? `${SUPPORT_FIELDS.map((field) => `<td rowspan="${rowSpan}">${renderSupportPrintCell(slotRecord, field)}</td>`).join("")}
                  <td rowspan="${rowSpan}">${renderRemarkPrintCell(date, slot, slotRecord)}</td>`
                : ""
            }
          </tr>
        `
      )
      .join("");
  }

  function renderSupportPrintCell(slotRecord, field) {
    const teachers = supportTeacherList(slotRecord, field);
    if (!teachers.length) return "";

    return `
      <div class="support-print-cell">
        ${teachers
          .map((teacher) => {
            const note = supportNoteValue(slotRecord, field, teacher);
            return `
              <div>
                ${teacherBadge(teacher, "")}
                ${note ? `<span style="--teacher-color: ${h(teacherColor(teacher))}">${h(note)}</span>` : ""}
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderRemarkPrintCell(date, slot, slotRecord) {
    const remarks = commuteRemarksForSlot(date, slot);
    if (slotRecord.memo) remarks.push(h(slotRecord.memo));
    normalizeScheduleTeacherNotes(slotRecord.teacherNotes).forEach((note) => {
      remarks.push(`${teacherBadge(note.teacher, note.teacher)} ${h(note.text)}`);
    });
    if (!remarks.length) return "";
    return `<div class="remark-print-cell">${remarks.map((remark) => `<span>${remark}</span>`).join("")}</div>`;
  }

  function renderDismissalPrintRow(date, slot, group, options = {}) {
    const targetGroup = group || blankScheduleGroup();
    const userColspan = 3;

    return `
      <tr class="aftercare-row dismissal-row">
        <th class="time-label">${formatSlotLabel(slot)}</th>
        <td class="dismissal-label" colspan="2">하원 송영</td>
        <td>${teacherBadgeListForGroup(targetGroup, "")}</td>
        <td colspan="${userColspan}">${renderUserNameList(normalizeUserList(targetGroup.users), date)}</td>
      </tr>
    `;
  }

  function renderAftercarePrint(info, date = "") {
    const value = normalizeAfterInfo(info);
    const rows = groupAftercareItems(value.items).map((group) => ({
      label: group.label,
      value: renderUserNameList(group.users, date)
    }));
    if (value.memo) rows.push({ label: "전달", value: h(value.memo) });

    if (!rows.length) return "";

    return `
      <div class="aftercare-print">
        <strong>등하원 정보 및 전달 사항</strong>
        ${rows.map((row) => `<span><b>${h(row.label)}</b> ${row.value}</span>`).join("")}
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
    const selectedService = normalizeServiceName(servicePreset || SERVICE_CALENDARS[0].service);
    const selectedCalendar = serviceCalendarForService(selectedService);
    const programs = programsForDate(date).filter((program) => programMatchesCalendar(program, selectedCalendar, date));
    const closed = isClosedDate(date);
    const customClosed = isCustomClosed(date);
    const canToggleClosed = !isSundayDate(date) && !holidayName(date);
    const isDayService = selectedService === "주간";
    const defaultPeriod = nextProgramPeriod(programs, isDayService);

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
            <form id="program-form" class="field-grid three program-form-grid" ${closed ? "hidden" : ""}>
              <input name="date" type="hidden" value="${h(date)}" />
              <input name="service" type="hidden" value="${h(selectedService)}" />
              <label class="field">
                <span>대주제</span>
                <input name="major" list="major-theme-options" placeholder="직접 입력 가능" required />
                <datalist id="major-theme-options">
                  ${state.majorThemes.map((theme) => `<option value="${h(theme)}"></option>`).join("")}
                </datalist>
              </label>
              <label class="field" data-standard-topic-field>
                <span>소주제</span>
                <input name="topic" placeholder="오늘 수업 주제" />
              </label>
              ${renderClubTopicFields()}
              <label class="field">
                <span>교시</span>
                <input name="period" type="number" min="1" max="99" value="${h(defaultPeriod)}" required />
              </label>
              <label class="field">
                <span>차시</span>
                <input name="session" data-program-session-input type="number" min="1" max="99" value="1" required />
              </label>
              <label class="field">
                <span>대주제 자간</span>
                <input name="majorLetterSpacing" type="number" min="-0.18" max="0.12" step="0.01" value="0" />
              </label>
              <label class="field">
                <span>소주제 자간</span>
                <input name="topicLetterSpacing" type="number" min="-0.18" max="0.12" step="0.01" value="0" />
              </label>
              ${
                isDayService
                  ? `<label class="field">
                      <span>대상</span>
                      <select name="group">
                        ${PROGRAM_GROUPS.map((group) => `<option value="${h(group.key)}">${h(programGroupSelectLabel(group.key))}</option>`).join("")}
                      </select>
                    </label>`
                  : `<input name="group" type="hidden" value="all" />`
              }
              <div class="field program-spacing-preview-field">
                <span>인쇄 미리보기</span>
                <div class="program-spacing-preview" data-program-spacing-preview aria-live="polite"></div>
              </div>
              <div class="field">
                <span>&nbsp;</span>
                <button class="primary-button" type="submit">프로그램 추가</button>
              </div>
            </form>
            ${renderMajorThemeManager(date, selectedService)}

            <div class="panel" style="margin-top: 16px;">
              <div class="panel-head">
                <h3>등록된 프로그램</h3>
                ${
                  programs.length
                    ? `<button class="ghost-button" data-save-program-updates type="button">수정 저장</button>`
                    : ""
                }
              </div>
              <div class="panel-body">
                ${
                  programs.length
                    ? `<div class="list">${programs
                        .map((program) => renderRegisteredProgramEditor(program, date, selectedService))
                        .join("")}</div>`
                    : `<div class="empty">이 날짜에는 등록된 프로그램이 없습니다.</div>`
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
    updateProgramSpacingPreviews(modalRoot);
  }

  function renderClubTopicFields(topicList = []) {
    const topics = normalizeClubTopicList(topicList);
    return Array.from({ length: CLUB_TOPIC_COUNT }, (_, index) => {
      const number = index + 1;
      return `
        <label class="field club-topic-field" data-club-topic-field>
          <span>동아리 소주제 ${number}</span>
          <input name="clubTopic${number}" value="${h(topics[index] || "")}" placeholder="소주제 ${number}" />
        </label>
      `;
    }).join("");
  }

  function renderRegisteredProgramEditor(program, date, selectedService) {
    const group = normalizeProgramGroup(program.group);
    const service = normalizeServiceName(program.service || selectedService);

    return `
      <article class="list-item registered-program-item">
        <form class="registered-program-form" data-program-update-form>
          <input name="programId" type="hidden" value="${h(program.id)}" />
          <input name="date" type="hidden" value="${h(date)}" />
          <div class="registered-program-summary">
            <strong>${h(shortProgramLabel(program))}</strong>
            <small>${h(programMetaLabel(program, { service: true }))}</small>
          </div>
          <div class="registered-program-grid">
            <label class="field">
              <span>구분</span>
              <select name="service">
                ${SERVICE_CALENDARS.map((calendar) => `<option value="${h(calendar.service)}" ${calendar.service === service ? "selected" : ""}>${h(calendar.title)}</option>`).join("")}
              </select>
            </label>
            <label class="field">
              <span>대주제</span>
              <input name="major" list="major-theme-options" value="${h(program.major || "")}" required />
            </label>
            <label class="field" data-standard-topic-field>
              <span>소주제</span>
              <input name="topic" value="${h(program.topic || "")}" placeholder="소주제 입력" />
            </label>
            ${renderClubTopicFields(program.topicList)}
            <label class="field">
              <span>교시</span>
              <input name="period" type="number" min="1" max="99" value="${h(normalizeProgramPeriod(program.period) || 1)}" required />
            </label>
            <label class="field">
              <span>차시</span>
              <input name="session" data-program-session-input type="number" min="1" max="99" value="${h(normalizeProgramDuration(program.session))}" required />
            </label>
            <label class="field">
              <span>대주제 자간</span>
              <input name="majorLetterSpacing" type="number" min="-0.18" max="0.12" step="0.01" value="${h(normalizeProgramLetterSpacing(program.majorLetterSpacing))}" />
            </label>
            <label class="field">
              <span>소주제 자간</span>
              <input name="topicLetterSpacing" type="number" min="-0.18" max="0.12" step="0.01" value="${h(normalizeProgramLetterSpacing(program.topicLetterSpacing))}" />
            </label>
            <label class="field">
              <span>그룹</span>
              <select name="group">
                ${PROGRAM_GROUPS.map((item) => `<option value="${h(item.key)}" ${item.key === group ? "selected" : ""}>${h(programGroupSelectLabel(item.key))}</option>`).join("")}
              </select>
            </label>
            <div class="field program-spacing-preview-field">
              <span>인쇄 미리보기</span>
              <div class="program-spacing-preview" data-program-spacing-preview aria-live="polite"></div>
            </div>
          </div>
          <div class="list-item-actions registered-program-actions">
            <button class="danger-button" data-delete-program="${h(program.id)}" data-program-date="${h(date)}" data-program-service="${h(selectedService)}" type="button">삭제</button>
          </div>
        </form>
      </article>
    `;
  }

  function renderMajorThemeManager(date, servicePreset) {
    if (!state.majorThemes.length) return "";
    const groupedThemes = categorySeed.map((category) => ({
      category,
      themes: state.majorThemes.filter((theme) => categoryForMajorTheme(theme) === category.id)
    }));

    return `
      <div class="major-theme-manager">
        <strong>대주제 관리</strong>
        <div class="major-theme-category-grid">
          ${groupedThemes
            .map(
              ({ category, themes }) => `
                <section class="major-theme-category">
                  <h4>${h(category.name)}</h4>
                  <div class="major-theme-chip-list">
                    ${
                      themes.length
                        ? themes
                            .map(
                              (theme) => `
                                <span class="major-theme-chip">
                                  <span>${h(theme)}</span>
                                  <select data-major-theme-category="${h(theme)}" data-program-date="${h(date)}" data-program-service="${h(servicePreset)}" aria-label="${h(theme)} 카테고리">
                                    ${categorySeed.map((item) => `<option value="${h(item.id)}" ${item.id === category.id ? "selected" : ""}>${h(item.name)}</option>`).join("")}
                                  </select>
                                  <button data-delete-major-theme="${h(theme)}" data-program-date="${h(date)}" data-program-service="${h(servicePreset)}" type="button" aria-label="${h(theme)} 삭제">×</button>
                                </span>
                              `
                            )
                            .join("")
                        : `<span class="empty compact">등록된 대주제가 없습니다.</span>`
                    }
                  </div>
                </section>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderProgramTopicEditor(program, date, servicePreset) {
    return `
      <form class="program-topic-edit" data-program-topic-form>
        <input name="programId" type="hidden" value="${h(program.id)}" />
        <input name="date" type="hidden" value="${h(date)}" />
        <input name="service" type="hidden" value="${h(servicePreset)}" />
        <input name="topic" placeholder="소주제 입력" aria-label="${h(program.major)} 소주제 입력" />
        <button class="ghost-button" type="submit">소주제 저장</button>
      </form>
    `;
  }

  function openMoveModal(date, activeType = "") {
    const selectedType = MOVE_TYPE_LABELS.includes(activeType) ? activeType : MOVE_TYPES[0].label;

    modalRoot.innerHTML = `
      <div class="modal-backdrop" role="presentation">
        <section class="modal wide" role="dialog" aria-modal="true" aria-labelledby="move-modal-title">
          <div class="modal-head">
            <h3 id="move-modal-title">${h(formatLongDate(date))} 휴가·송영 편집</h3>
            <button class="icon-button" data-close-modal type="button" aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            <div class="move-bulk-editor">
              <div class="move-type-list" aria-label="휴가·송영 구분">
                ${MOVE_TYPES.map((type) => renderMoveTypeCard(date, type, selectedType)).join("")}
              </div>

              <form id="move-form" class="move-teacher-panel">
                <input name="date" type="hidden" value="${h(date)}" />
                <div class="move-panel-head">
                  <strong>전체 구분 한 번에 저장</strong>
                  <span>필요한 구분마다 담당교사를 체크하고 마지막에 선택 저장을 누릅니다.</span>
                </div>
                <div class="move-save-grid">
                  ${MOVE_TYPES.map((type) => renderMoveSaveSection(date, type, selectedType)).join("")}
                </div>
                <div class="modal-actions">
                  <button class="primary-button" type="submit">선택 저장</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderMoveTypeCard(date, type, selectedType) {
    const entries = moveEntriesForType(date, type.label);
    const teachers = entries.map((entry) => cleanSelectValue(entry.person)).filter(Boolean);
    return `
      <article class="move-type-card ${type.label === selectedType ? "active" : ""} ${h(type.className)}">
        <span>${h(type.label)}</span>
        <strong>${teachers.length ? `${teachers.length}명` : "미지정"}</strong>
        <small>${teacherBadgeList(teachers, "담당교사를 선택하세요")}</small>
      </article>
    `;
  }

  function renderMoveSaveSection(date, type, selectedType) {
    const selectedEntries = moveEntriesForType(date, type.label);
    const selectedTeachers = new Set(selectedEntries.map((entry) => cleanSelectValue(entry.person)).filter(Boolean));
    const selectedMemo = selectedEntries.find((entry) => entry.memo)?.memo || "";

    return `
      <section class="move-save-section ${type.label === selectedType ? "active" : ""}">
        <header>
          <strong>${h(type.label)}</strong>
          <span>${selectedTeachers.size ? `${selectedTeachers.size}명 선택됨` : "미지정"}</span>
        </header>
        <div class="teacher-picker move-teacher-grid">
          ${state.settings.teachers
            .map(
              (teacher) => `
                <label class="check-row">
                  <input name="persons-${h(type.key)}" type="checkbox" value="${h(teacher)}" ${selectedTeachers.has(teacher) ? "checked" : ""} />
                  <span>${teacherBadge(teacher)}</span>
                </label>
              `
            )
            .join("")}
        </div>
        <label class="field move-memo-field">
          <span>메모</span>
          <input name="memo-${h(type.key)}" value="${h(selectedMemo)}" placeholder="필요한 전달사항" />
        </label>
      </section>
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
    const major = String(data.get("major") || "").trim();
    const topicList = programTopicListFromForm(data, major);
    const topic = isClubProgramMajor(major) ? topicList[0] || "" : String(data.get("topic") || "").trim();
    const program = normalizeProgram({
      date: data.get("date"),
      category: categoryForMajorTheme(major, topicList.join(" ") || topic),
      major,
      topic,
      topicList,
      period: Number(data.get("period") || 1),
      session: isClubProgramMajor(major) ? 2 : Number(data.get("session") || 1),
      majorLetterSpacing: data.get("majorLetterSpacing"),
      topicLetterSpacing: data.get("topicLetterSpacing"),
      service: data.get("service"),
      group: data.get("group"),
      time: "",
      teacher: "",
      room: ""
    });

    ensureProgramMajorTheme(program.major, program.category);

    state.monthlyPrograms.push(program);
    saveState("프로그램이 추가되었습니다.");
    render();
    openProgramModal(program.date, program.service);
  }

  function ensureProgramMajorTheme(major, category) {
    const theme = cleanSelectValue(major);
    if (!theme) return;
    if (!state.majorThemes.includes(theme)) state.majorThemes.push(theme);
    state.majorThemeCategories = normalizeMajorThemeCategories(
      {
        ...state.majorThemeCategories,
        [theme]: category
      },
      state.majorThemes
    );
  }

  function programUpdateFromForm(form) {
    const data = new FormData(form);
    const programId = String(data.get("programId") || "");
    const index = state.monthlyPrograms.findIndex((item) => item.id === programId);
    if (index < 0) return null;

    const current = state.monthlyPrograms[index];
    const major = String(data.get("major") || "").trim();
    const topicList = programTopicListFromForm(data, major);
    const topic = isClubProgramMajor(major) ? topicList[0] || "" : String(data.get("topic") || "").trim();
    const service = normalizeServiceName(data.get("service") || current.service);
    const category = categoryForMajorTheme(major, topicList.join(" ") || topic);
    const updated = normalizeProgram({
      ...current,
      category,
      major,
      topic,
      topicList,
      period: Number(data.get("period") || current.period || 1),
      session: isClubProgramMajor(major) ? 2 : Number(data.get("session") || current.session || 1),
      majorLetterSpacing: data.get("majorLetterSpacing"),
      topicLetterSpacing: data.get("topicLetterSpacing"),
      service,
      group: service === "주간" ? data.get("group") : "all"
    });

    ensureProgramMajorTheme(updated.major, updated.category);
    return { index, updated };
  }

  function applyProgramUpdateForm(form) {
    const result = programUpdateFromForm(form);
    if (!result) return null;
    state.monthlyPrograms[result.index] = result.updated;
    return result.updated;
  }

  function handleProgramUpdate(form) {
    const updated = applyProgramUpdateForm(form);
    if (!updated) return;
    saveState("프로그램 정보가 수정되었습니다.");
    render();
    openProgramModal(updated.date, updated.service);
  }

  function handleProgramUpdateBatch() {
    const forms = Array.from(modalRoot.querySelectorAll("[data-program-update-form]"));
    const invalid = forms.find((form) => !form.reportValidity());
    if (invalid) return;
    const updatedPrograms = forms.map((form) => applyProgramUpdateForm(form)).filter(Boolean);
    if (!updatedPrograms.length) return;
    const lastUpdated = updatedPrograms[updatedPrograms.length - 1];
    saveState("프로그램 정보가 수정되었습니다.");
    render();
    openProgramModal(lastUpdated.date, lastUpdated.service);
  }

  function updateProgramTopic(form) {
    const data = new FormData(form);
    const programId = String(data.get("programId") || "");
    const topic = String(data.get("topic") || "").trim();
    const date = String(data.get("date") || "");
    const service = String(data.get("service") || "");
    const program = state.monthlyPrograms.find((item) => item.id === programId);

    if (!program || !topic) return;

    program.topic = topic;
    program.category = categoryForMajorTheme(program.major, topic);
    saveState("소주제가 저장되었습니다.");
    render();
    if (date) openProgramModal(date, service);
  }

  function handleMoveSubmit(form) {
    const data = new FormData(form);
    const date = String(data.get("date") || todayIso);
    const entries = [];

    MOVE_TYPES.forEach((typeMeta) => {
      const type = typeMeta.label;
      const memo = String(data.get(`memo-${typeMeta.key}`) || "").trim();
      const people = data
        .getAll(`persons-${typeMeta.key}`)
        .map(cleanSelectValue)
        .filter(Boolean)
        .filter(unique);

      people.forEach((person) => {
        entries.push(
          normalizeMove({
            date,
            type,
            person,
            time: "",
            route: "",
            memo
          })
        );
      });
    });

    state.vacationTransport = state.vacationTransport.filter((entry) => entry.date !== date);
    state.vacationTransport.push(...entries);
    saveState(entries.length ? "휴가·송영 담당자가 저장되었습니다." : "이 날짜의 휴가·송영 담당자가 비워졌습니다.");
    render();
    openMoveModal(date);
  }

  function observationEditorElement() {
    return document.querySelector("[data-observation-summary]");
  }

  function observationEditorText(editor = observationEditorElement()) {
    if (!editor) return "";
    return String(editor.innerText || editor.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/\n$/, "");
  }

  function syncObservationEditorValue(editor = observationEditorElement()) {
    const valueField = document.querySelector("[data-observation-summary-value]");
    if (valueField) valueField.value = observationEditorText(editor);
  }

  function placeCaretAtEditorEnd(editor) {
    if (!editor || !window.getSelection || !document.createRange) return;
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function refreshObservationEditorHighlights() {
    const editor = observationEditorElement();
    if (!editor) return;
    const text = observationEditorText(editor);
    editor.innerHTML = renderHighlightedText(text, observationHighlightTerms);
    syncObservationEditorValue(editor);
    placeCaretAtEditorEnd(editor);
  }

  function selectionBelongsToObservationEditor(selection, editor) {
    if (!selection || !editor || !selection.rangeCount) return false;
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    return container === editor || editor.contains(container.nodeType === Node.ELEMENT_NODE ? container : container.parentNode);
  }

  function selectedObservationEditorText(editor) {
    const selection = window.getSelection?.();
    if (!selection || !selectionBelongsToObservationEditor(selection, editor) || selection.isCollapsed) return "";
    return cleanSelectValue(selection.toString());
  }

  function handleObservationSubmit(form) {
    syncObservationEditorValue();
    const data = new FormData(form);
    const wasEditing = Boolean(observationEditingId);
    const summary = String(data.get("summary") || "").trim();
    if (!summary) {
      setSyncStatus("관찰 내용을 입력해주세요.");
      observationEditorElement()?.focus();
      return;
    }
    const nextObservation = normalizeObservation({
      id: observationEditingId || uid("obs"),
      date: data.get("date"),
      user: data.get("user"),
      teacher: data.get("teacher"),
      activity: String(data.get("activity") || "").trim(),
      summary,
      highlights: observationHighlightTerms
    });

    if (wasEditing) {
      state.observations = state.observations.map((item) => (item.id === observationEditingId ? nextObservation : item));
    } else {
      state.observations.push(nextObservation);
    }

    observationEditingId = "";
    observationHighlightTerms = [];
    observationFormDate = todayIso;
    saveState(wasEditing ? "관찰일지가 수정되었습니다." : "관찰일지가 저장되었습니다.");
    render();
  }

  function handleSettingsSubmit(form) {
    const data = new FormData(form);
    state.serviceLabels = splitLines(data.get("serviceLabels"));
    state.settings.rooms = splitLines(data.get("rooms"));
    state.settings.timeSlots = normalizeTimeSlots(splitLines(data.get("timeSlots")));
    state.majorThemes = normalizeMajorThemeList(splitLines(data.get("majorThemes")));
    if (!state.majorThemes.includes(CLUB_MAJOR_THEME)) state.majorThemes.push(CLUB_MAJOR_THEME);
    state.majorThemeCategories = normalizeMajorThemeCategories(state.majorThemeCategories, state.majorThemes);
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

  function editPeople(section = "users") {
    if (section === "teachers") {
      teacherEditMode = true;
    } else {
      userEditMode = true;
    }
    renderPeople();
  }

  function savePeople(section = "users") {
    if (section === "teachers") {
      teacherEditMode = false;
    } else {
      userEditMode = false;
    }
    syncUsersFromGroups();
    saveState(section === "teachers" ? "교사 정보가 저장되었습니다." : "이용인 정보가 저장되었습니다.");
    renderPeople();
  }

  function updateUser(button) {
    const groupKey = button.dataset.userGroup;
    const oldName = button.dataset.updateUser;
    const row = button.closest(".person-row");
    const input = row?.querySelector("[data-user-edit]");
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

  function updateAssignmentTeacher(target) {
    selectedAssignmentTeacher = target.value || "";
    renderPeople();
  }

  function editAssignments() {
    assignmentEditMode = true;
    assignmentDraft = normalizeUserAssignments({ ...state.settings.userAssignments }, state.settings.users, state.settings.teachers);
    renderPeople();
  }

  function saveAssignments() {
    if (!assignmentEditMode) return;
    state.settings.userAssignments = normalizeUserAssignments(assignmentDraft, state.settings.users, state.settings.teachers);
    assignmentEditMode = false;
    assignmentDraft = null;
    saveState("담당 이용인이 저장되었습니다.");
    renderPeople();
  }

  function addSelectedObservationHighlight() {
    const editor = observationEditorElement();
    if (!editor) return;
    const selected = cleanSelectValue(observationHighlightSelection?.text || selectedObservationEditorText(editor));
    if (!selected) {
      setSyncStatus("하이라이트할 내용을 먼저 드래그해주세요.");
      editor.focus();
      return;
    }

    if (observationHighlightSelection?.action === "remove") {
      observationHighlightTerms = normalizeHighlightTerms(observationHighlightTerms.filter((item) => item.toLowerCase() !== selected.toLowerCase()));
    } else {
      observationHighlightTerms = normalizeHighlightTerms([...observationHighlightTerms, selected]);
    }
    refreshObservationEditorHighlights();
    hideObservationHighlightMenu();
    editor.focus();
  }

  function showObservationHighlightMenu(event) {
    const editor = event.target?.closest?.("[data-observation-summary]");
    if (!editor) return;
    syncObservationEditorValue(editor);
    const selection = window.getSelection?.();
    const selected = selectedObservationEditorText(editor);
    if (!selection || !selected) {
      hideObservationHighlightMenu();
      return;
    }

    const alreadyHighlighted = normalizeHighlightTerms(observationHighlightTerms).some((item) => item.toLowerCase() === selected.toLowerCase());
    observationHighlightSelection = { text: selected, action: alreadyHighlighted ? "remove" : "add" };
    const menu = document.querySelector("[data-observation-highlight-menu]");
    const field = editor.closest(".observation-summary-field");
    if (!menu || !field) return;
    const button = menu.querySelector("[data-apply-observation-highlight]");
    if (button) {
      button.textContent = alreadyHighlighted ? "하이라이트 삭제" : "하이라이트 표시";
      button.classList.toggle("danger-highlight-action", alreadyHighlighted);
    }

    const range = selection.rangeCount ? selection.getRangeAt(0) : null;
    const selectionRect = range?.getBoundingClientRect?.();
    const fieldRect = field.getBoundingClientRect();
    const sourceLeft = selectionRect && selectionRect.width ? selectionRect.left + selectionRect.width / 2 : event.clientX || fieldRect.left + 80;
    const sourceTop = selectionRect && selectionRect.height ? selectionRect.bottom : event.clientY || fieldRect.top + 80;
    const left = Math.min(Math.max(sourceLeft - fieldRect.left - 66, 8), Math.max(8, fieldRect.width - 148));
    const top = Math.min(Math.max(sourceTop - fieldRect.top + 8, 42), Math.max(42, fieldRect.height - 40));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.hidden = false;
  }

  function hideObservationHighlightMenu() {
    observationHighlightSelection = null;
    const menu = document.querySelector("[data-observation-highlight-menu]");
    if (menu) menu.hidden = true;
  }

  function removeObservationHighlight(term) {
    const target = cleanSelectValue(term);
    observationHighlightTerms = normalizeHighlightTerms(observationHighlightTerms.filter((item) => item !== target));
    refreshObservationEditorHighlights();
  }

  function editObservation(id) {
    const observation = state.observations.find((item) => item.id === id);
    if (!observation) return;
    observationEditingId = id;
    observationHighlightTerms = normalizeHighlightTerms(observation.highlights);
    observationFormDate = observation.date || todayIso;
    renderObservations();
  }

  function cancelObservationEdit() {
    observationEditingId = "";
    observationHighlightTerms = [];
    observationFormDate = todayIso;
    renderObservations();
  }

  function updateUserAssignment(target) {
    const user = cleanSelectValue(target.value);
    const teacher = cleanSelectValue(selectedAssignmentTeacher);
    if (!assignmentEditMode || !user || !teacher) return;

    assignmentDraft = normalizeUserAssignments(assignmentDraft || state.settings.userAssignments, state.settings.users, state.settings.teachers);
    if (target.checked) {
      assignmentDraft[user] = teacher;
    } else if (assignmentDraft[user] === teacher) {
      delete assignmentDraft[user];
    }
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
    state.settings.teacherProfiles[name] = { hireDate: "", birthday: "" };
    saveState("교사가 추가되었습니다.");
    renderPeople();
  }

  function updateTeacher(button) {
    const oldName = button.dataset.updateTeacher;
    const row = button.closest(".person-row");
    const input = row?.querySelector("[data-teacher-edit]");
    const colorInput = row?.querySelector("[data-teacher-color]");
    const hireDateInput = row?.querySelector("[data-teacher-hire-date]");
    const birthdayInput = row?.querySelector("[data-teacher-birthday]");
    const newName = cleanSelectValue(input?.value);
    const nextColor = normalizeColor(colorInput?.value) || teacherColor(oldName);
    const nextProfile = {
      hireDate: normalizeDateInput(hireDateInput?.value),
      birthday: normalizeDateInput(birthdayInput?.value)
    };
    if (!newName) return;

    if (newName !== oldName && state.settings.teachers.includes(newName)) {
      setSyncStatus("이미 등록된 교사 이름입니다.");
      input.value = oldName;
      return;
    }

    state.settings.teachers = state.settings.teachers.map((teacher) => (teacher === oldName ? newName : teacher));
    delete state.settings.teacherColors[oldName];
    state.settings.teacherColors[newName] = nextColor;
    delete state.settings.teacherProfiles[oldName];
    state.settings.teacherProfiles[newName] = nextProfile;
    if (oldName !== newName) replaceTeacherInRecords(oldName, newName);
    saveState("교사 정보가 수정되었습니다.");
    renderPeople();
  }

  function deleteTeacher(name) {
    state.settings.teachers = state.settings.teachers.filter((teacher) => teacher !== name);
    delete state.settings.teacherColors[name];
    delete state.settings.teacherProfiles[name];
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

  function deleteMajorTheme(theme, date, servicePreset = "") {
    const target = cleanSelectValue(theme);
    if (!target) return;

    state.majorThemes = state.majorThemes.filter((item) => item !== target);
    delete state.majorThemeCategories[target];
    saveState("대주제가 삭제되었습니다.");
    render();
    if (date) openProgramModal(date, servicePreset);
  }

  function updateMajorThemeCategory(target) {
    const theme = cleanSelectValue(target.dataset.majorThemeCategory);
    const category = normalizeCategoryId(target.value);
    if (!theme || !category) return;

    state.majorThemeCategories = normalizeMajorThemeCategories(
      {
        ...state.majorThemeCategories,
        [theme]: category
      },
      state.majorThemes
    );
    state.monthlyPrograms = state.monthlyPrograms.map((program) => (program.major === theme ? { ...program, category } : program));
    saveState("대주제 카테고리가 저장되었습니다.");
    render();
    openProgramModal(target.dataset.programDate, target.dataset.programService);
  }

  function replaceUserInRecords(oldName, newName) {
    Object.values(state.dailySchedules || {}).forEach((daySchedule) => {
      Object.values(daySchedule || {}).forEach((slotRecord) => {
        if (!Array.isArray(slotRecord?.groups)) return;
        slotRecord.groups.forEach((group) => {
          group.users = normalizeUserList(group.users).map((user) => (user === oldName ? newName : user));
        });
        ["dayInfo", "afterInfo"].forEach((field) => {
          if (!slotRecord[field]) return;
          slotRecord[field] = normalizeAfterInfo(slotRecord[field]);
          slotRecord[field].items = slotRecord[field].items.map((item) => ({
            ...item,
            user: item.user === oldName ? newName : item.user
          }));
        });
      });
    });

    state.observations = state.observations.map((entry) => ({
      ...entry,
      user: entry.user === oldName ? newName : entry.user
    }));

    if (state.settings.userAssignments?.[oldName]) {
      state.settings.userAssignments[newName] = state.settings.userAssignments[oldName];
      delete state.settings.userAssignments[oldName];
    }

    Object.values(state.userSubstitutes || {}).forEach((entries) => {
      if (!entries || typeof entries !== "object" || !(oldName in entries)) return;
      entries[newName] = entries[oldName];
      delete entries[oldName];
    });
  }

  function removeUserFromRecords(name) {
    Object.values(state.dailySchedules || {}).forEach((daySchedule) => {
      Object.values(daySchedule || {}).forEach((slotRecord) => {
        if (!Array.isArray(slotRecord?.groups)) return;
        slotRecord.groups.forEach((group) => {
          group.users = normalizeUserList(group.users).filter((user) => user !== name);
        });
        ["dayInfo", "afterInfo"].forEach((field) => {
          if (!slotRecord[field]) return;
          slotRecord[field] = normalizeAfterInfo(slotRecord[field]);
          slotRecord[field].items = slotRecord[field].items.filter((item) => item.user !== name);
        });
      });
    });

    state.observations = state.observations.map((entry) => ({
      ...entry,
      user: entry.user === name ? "" : entry.user
    }));

    delete state.settings.userAssignments?.[name];
    Object.values(state.userSubstitutes || {}).forEach((entries) => {
      if (entries && typeof entries === "object") delete entries[name];
    });
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

    Object.entries(state.settings.userAssignments || {}).forEach(([user, teacher]) => {
      if (teacher === oldName) state.settings.userAssignments[user] = newName;
    });

    Object.values(state.userSubstitutes || {}).forEach((entries) => {
      if (!entries || typeof entries !== "object") return;
      Object.entries(entries).forEach(([user, teacher]) => {
        if (teacher === oldName) entries[user] = newName;
      });
    });

    Object.values(state.dailySchedules || {}).forEach((daySchedule) => {
      Object.values(daySchedule || {}).forEach((slotRecord) => {
        if (!slotRecord || typeof slotRecord !== "object") return;
        SUPPORT_FIELDS.forEach((field) => {
          slotRecord[field] = supportTeacherList(slotRecord, field).map((teacher) => (teacher === oldName ? newName : teacher));
          const notes = normalizeSupportNotes(slotRecord.supportNotes);
          const fieldNotes = notes[field] || {};
          if (fieldNotes[oldName]) {
            fieldNotes[newName] = fieldNotes[oldName];
            delete fieldNotes[oldName];
            slotRecord.supportNotes = { ...notes, [field]: fieldNotes };
          }
        });
        if (!Array.isArray(slotRecord.groups)) return;
        slotRecord.groups.forEach((group) => {
          const paperTeachers = normalizeTeacherList(group.paperTeachers).map((teacher) => (teacher === oldName ? newName : teacher));
          setGroupTeachers(
            group,
            groupTeacherList(group).map((teacher) => (teacher === oldName ? newName : teacher))
          );
          group.paperTeachers = paperTeachers.filter((teacher) => groupTeacherList(group).includes(teacher));
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
          slotRecord[field] = supportTeacherList(slotRecord, field).filter((teacher) => teacher !== name);
          const notes = normalizeSupportNotes(slotRecord.supportNotes);
          if (notes[field]) {
            delete notes[field][name];
            slotRecord.supportNotes = notes;
          }
        });
        if (!Array.isArray(slotRecord.groups)) return;
        slotRecord.groups.forEach((group) => {
          setGroupTeachers(
            group,
            groupTeacherList(group).filter((teacher) => teacher !== name)
          );
          group.paperTeachers = normalizeTeacherList(group.paperTeachers).filter((teacher) => teacher !== name);
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

    Object.entries(state.settings.userAssignments || {}).forEach(([user, teacher]) => {
      if (teacher === name) delete state.settings.userAssignments[user];
    });

    Object.values(state.userSubstitutes || {}).forEach((entries) => {
      if (!entries || typeof entries !== "object") return;
      Object.entries(entries).forEach(([user, teacher]) => {
        if (teacher === name) delete entries[user];
      });
    });
  }

  function copyProgramsToSchedule() {
    if (!programsForDate(dailyDate).filter((program) => programAllowedForDate(program, dailyDate)).length) {
      setSyncStatus("해당 날짜의 월간 프로그램이 없습니다.");
      return;
    }

    state.dailySchedules[dailyDate] = {};
    ensureDailySchedule(dailyDate);
    seedDailyScheduleFromMonthlyPrograms(dailyDate);
    saveState("월간 프로그램을 시간표에 반영했습니다.");
    renderDaily();
  }

  function seedDailyScheduleFromMonthlyPrograms(date, options = {}) {
    ensureDailySchedule(date);
    const programs = programsForDate(date).filter((program) => programAllowedForDate(program, date));
    if (!programs.length) return false;
    if (options.onlyIfEmpty && dailyScheduleHasContent(date)) return false;

    const serviceIndexes = {};
    let changed = false;

    programs.forEach((program) => {
      const service = normalizeServiceName(program.service);
      const slots = scheduleSlotsForProgramService(service);
      if (!slots.length) return;

      const duration = normalizeProgramDuration(program.session);
      const explicitPeriod = normalizeProgramPeriod(program.period);
      const startIndex = explicitPeriod ? explicitPeriod - 1 : serviceIndexes[service] || 0;
      serviceIndexes[service] = Math.max(serviceIndexes[service] || 0, startIndex + duration);

      for (let offset = 0; offset < duration; offset += 1) {
        const slot = slots[startIndex + offset];
        if (!slot) continue;

        const slotRecord = getScheduleSlot(date, slot);
        const targetGroup = slotRecord.groups.find((group) => !scheduleGroupHasContentForSeed(group, slot)) || blankScheduleGroup();

        if (!slotRecord.groups.includes(targetGroup)) {
          slotRecord.groups.push(targetGroup);
        }

        targetGroup.program = programOptionLabel(program);
        targetGroup.room = cleanSelectValue(program.room);
        setGroupTeachers(targetGroup, program.teacher ? [program.teacher] : []);

        state.dailySchedules[date][slot] = sanitizeScheduleSlot(slotRecord, slot);
        changed = true;
      }
    });

    return changed;
  }

  function scheduleSlotsForProgramService(service) {
    const slots = state.settings.timeSlots || [];
    if (normalizeServiceName(service).includes("방과후")) {
      return slots.filter(isAftercareInfoSlot);
    }

    return slots.filter((slot) => !isAftercareSlot(slot) && !isDayDismissalSlot(slot));
  }

  function dailyScheduleHasContent(date) {
    const daySchedule = state.dailySchedules?.[date];
    if (!daySchedule) return false;

    return (state.settings.timeSlots || []).some((slot) => {
      const slotRecord = normalizeScheduleSlot(daySchedule[slot]);
      if (slotRecord.groups.some((group) => scheduleGroupHasContentForSeed(group, slot))) return true;
      if (SUPPORT_FIELDS.some((field) => supportTeacherList(slotRecord, field).length)) return true;
      if (slotRecord.memo) return true;
      if (normalizeScheduleTeacherNotes(slotRecord.teacherNotes).length) return true;

      const afterInfo = normalizeAfterInfo(slotRecord.afterInfo);
      const dayInfo = normalizeAfterInfo(slotRecord.dayInfo);
      return Boolean(afterInfo.items.length || afterInfo.memo || dayInfo.items.length || dayInfo.memo);
    });
  }

  function scheduleGroupHasContentForSeed(group = {}, slot = "") {
    if (!scheduleGroupHasContent(group)) return false;

    if (isDayDismissalSlot(slot)) {
      const teachers = groupTeacherList(group);
      const users = normalizeUserList(group.users);
      const program = cleanSelectValue(group.program);
      const room = cleanSelectValue(group.room);
      if (program === DEFAULT_DAY_DISMISSAL_PROGRAM && room === DAY_DISMISSAL_ROOM && !teachers.length && !users.length) {
        return false;
      }
    }

    return true;
  }

  function resetDailySchedule(date) {
    state.settings.timeSlots = normalizeTimeSlots(CANONICAL_TIME_SLOTS);
    state.dailySchedules[date] = {};
    ensureDailySchedule(date);
    seedDailyScheduleFromMonthlyPrograms(date);
    supportNoteEditor = null;
    saveState("해당 날짜의 일일 시간표가 초기화되었습니다.");
    renderDaily();
  }

  function copyScheduleGroupToNextSlot(slot, groupId) {
    const slots = state.settings.timeSlots || [];
    const sourceIndex = slots.indexOf(slot);
    const sourceGroup = findScheduleGroup(dailyDate, slot, groupId);
    if (sourceIndex < 0 || !sourceGroup) return;

    const nextSlot = slots.slice(sourceIndex + 1).find((candidate) => {
      if (isAftercareSlot(slot)) return isAftercareInfoSlot(candidate);
      return !isAftercareSlot(candidate) && !isDayDismissalSlot(candidate);
    });

    if (!nextSlot) {
      setSyncStatus("복사할 다음 시간대가 없습니다.");
      return;
    }

    const slotRecord = getScheduleSlot(dailyDate, nextSlot);
    const targetGroup = slotRecord.groups.find((group) => !scheduleGroupHasContent(group)) || blankScheduleGroup();
    if (!slotRecord.groups.includes(targetGroup)) {
      slotRecord.groups.push(targetGroup);
    }

    targetGroup.program = cleanSelectValue(sourceGroup.program);
    targetGroup.room = cleanSelectValue(sourceGroup.room);
    targetGroup.users = normalizeUserList(sourceGroup.users);
    setGroupTeachers(targetGroup, groupTeacherList(sourceGroup));

    state.dailySchedules[dailyDate][nextSlot] = sanitizeScheduleSlot(slotRecord, nextSlot);
    saveState("선택한 옵션을 다음 시간대에 복사했습니다.");
    renderDaily();
  }

  function copyMonthlyProgramToDate(programId, targetDate, targetService) {
    const source = state.monthlyPrograms.find((program) => program.id === programId);
    if (!source || !targetDate || isClosedDate(targetDate)) return;
    const service = normalizeServiceName(targetService || source.service);
    const targetCalendar = serviceCalendarForService(service);

    if (!targetCalendar.allowedDays.includes(parseIsoDate(targetDate).getDay())) {
      setSyncStatus("해당 달력에서 사용할 수 없는 요일입니다.");
      return;
    }

    if (source.date === targetDate && normalizeServiceName(source.service) === service) {
      setSyncStatus("같은 날짜에는 이미 해당 프로그램이 있습니다.");
      return;
    }

    state.monthlyPrograms.push(
      normalizeProgram({
        ...source,
        id: uid("program"),
        date: targetDate,
        service,
        group: service === "주간" ? normalizeProgramGroup(source.group) : "all"
      })
    );
    saveState("월간 프로그램을 다른 날짜로 복사했습니다.");
    renderMonthly();
  }

  function transportTypesForCopy(filter = transportCopyFilter) {
    if (filter === "all") return MOVE_TYPE_LABELS;
    return MOVE_TYPE_LABELS.includes(filter) ? [filter] : MOVE_TYPE_LABELS;
  }

  function copyTransportDate(date) {
    const types = transportTypesForCopy();
    const typeSet = new Set(types);
    const entries = movesForDate(date).filter((entry) => typeSet.has(normalizeMoveType(entry)));

    if (!entries.length) {
      setSyncStatus("선택한 범위에 복사할 항목이 없습니다.");
      return;
    }

    transportClipboard = {
      filter: transportCopyFilter,
      types,
      entries: entries.map((entry) => normalizeMove(entry))
    };
    setSyncStatus(`${formatShortDate(date)} 정보를 복사했습니다.`);
    renderVacation();
  }

  function pasteTransportDate(date) {
    if (!transportClipboard?.entries?.length || isClosedDate(date)) {
      setSyncStatus("먼저 복사할 항목을 선택해주세요.");
      return;
    }

    const typeSet = new Set(transportClipboard.types || transportTypesForCopy(transportClipboard.filter));
    state.vacationTransport = state.vacationTransport.filter((entry) => entry.date !== date || !typeSet.has(normalizeMoveType(entry)));
    state.vacationTransport.push(
      ...transportClipboard.entries.map((entry) =>
        normalizeMove({
          ...entry,
          id: uid("move"),
          date
        })
      )
    );

    saveState("복사한 휴가·송영 정보를 붙여넣었습니다.");
    renderVacation();
  }

  function clearTransportDate(date) {
    const before = state.vacationTransport.length;
    state.vacationTransport = state.vacationTransport.filter((entry) => entry.date !== date);

    if (state.vacationTransport.length === before) {
      setSyncStatus("삭제할 휴가·송영 정보가 없습니다.");
      return;
    }

    saveState("해당 날짜의 휴가·송영 정보를 삭제했습니다.");
    renderVacation();
  }

  function copyTransportDateToDate(sourceDate, targetDate) {
    if (!sourceDate || !targetDate || sourceDate === targetDate || isClosedDate(targetDate)) return;

    const types = transportTypesForCopy();
    const typeSet = new Set(types);
    const entries = movesForDate(sourceDate).filter((entry) => typeSet.has(normalizeMoveType(entry)));

    if (!entries.length) {
      setSyncStatus("선택한 범위에 복사할 항목이 없습니다.");
      return;
    }

    state.vacationTransport = state.vacationTransport.filter((entry) => entry.date !== targetDate || !typeSet.has(normalizeMoveType(entry)));
    state.vacationTransport.push(
      ...entries.map((entry) =>
        normalizeMove({
          ...entry,
          id: uid("move"),
          date: targetDate
        })
      )
    );

    saveState("휴가·송영 정보를 다른 날짜로 복사했습니다.");
    renderVacation();
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

  function addScheduleTimeSlot(afterSlot) {
    const slots = state.settings.timeSlots || [];
    const index = slots.indexOf(afterSlot);
    if (index < 0) return;

    const nextSlot = suggestTimeSlotAfter(afterSlot, slots);
    if (!nextSlot) {
      setSyncStatus("추가할 수 있는 시간대를 찾지 못했습니다.");
      return;
    }

    slots.splice(index + 1, 0, nextSlot);
    state.settings.timeSlots = slots;
    saveState("시간대가 추가되었습니다. 필요한 시간으로 바로 수정할 수 있습니다.");
    renderDaily();
  }

  function removeScheduleTimeSlot(slot) {
    const slots = state.settings.timeSlots || [];
    if (slots.length <= 1) {
      setSyncStatus("시간대는 최소 1개가 필요합니다.");
      return;
    }

    if (!slots.includes(slot)) return;
    state.settings.timeSlots = slots.filter((item) => item !== slot);
    deleteScheduleSlotData(slot);
    saveState("시간대가 삭제되었습니다.");
    renderDaily();
  }

  function deleteScheduleSlotData(slot) {
    Object.values(state.dailySchedules || {}).forEach((daySchedule) => {
      if (!daySchedule || typeof daySchedule !== "object") return;
      Object.keys(daySchedule)
        .filter((key) => key === slot || key.startsWith(`${slot}||`))
        .forEach((key) => {
          delete daySchedule[key];
        });
    });
  }

  function suggestTimeSlotAfter(slot, slots) {
    const [, end] = splitSlotTime(slot);
    const startMinutes = end ? timeToMinutes(end) : slotStartMinutes(slot) + 30;

    for (const duration of [30, 20, 10, 40, 50, 60]) {
      const endMinutes = Math.min(startMinutes + duration, 23 * 60 + 59);
      if (endMinutes <= startMinutes) continue;
      const candidate = `${formatMinutesAsTime(startMinutes)}~${formatMinutesAsTime(endMinutes)}`;
      if (!slots.includes(candidate)) return candidate;
    }

    for (let minutes = startMinutes; minutes <= 23 * 60; minutes += 30) {
      const candidate = `${formatMinutesAsTime(minutes)}~${formatMinutesAsTime(Math.min(minutes + 30, 23 * 60 + 59))}`;
      if (!slots.includes(candidate)) return candidate;
    }

    return "";
  }

  function normalizeSlotInput(value) {
    const text = cleanSelectValue(value).replace(/[–—-]/g, "~").replace(/\s+/g, "");
    if (!text.includes("~")) return "";

    const [rawStart, rawEnd = ""] = text.split("~");
    const start = normalizeTimeInput(rawStart);
    const end = rawEnd ? normalizeTimeInput(rawEnd) : "";
    if (!start || (rawEnd && !end)) return "";
    return `${start}~${end}`;
  }

  function updateScheduleSlotTime(target) {
    const wrapper = target.closest("[data-slot-time-editor]");
    const oldSlot = wrapper?.dataset.slot || "";
    const slots = state.settings.timeSlots || [];
    const index = slots.indexOf(oldSlot);
    if (!wrapper || index < 0) return;

    const start = normalizeTimeInput(wrapper.querySelector('[data-slot-time-field="start"]')?.value);
    const end = normalizeTimeInput(wrapper.querySelector('[data-slot-time-field="end"]')?.value);
    if (!start) {
      setSyncStatus("시작 시간을 입력해주세요.");
      renderDaily();
      return;
    }

    if (end && timeToMinutes(end) <= timeToMinutes(start)) {
      setSyncStatus("종료 시간은 시작 시간보다 늦어야 합니다.");
      renderDaily();
      return;
    }

    const nextSlot = `${start}~${end}`;
    if (nextSlot === oldSlot) return;

    if (slots.some((slot, slotIndex) => slotIndex !== index && slot === nextSlot)) {
      setSyncStatus("이미 같은 시간대가 있습니다.");
      renderDaily();
      return;
    }

    renameScheduleSlot(oldSlot, nextSlot);
    slots[index] = nextSlot;
    state.settings.timeSlots = slots;
    saveState("시간이 수정되었습니다.");
    renderDaily();
  }

  function renameScheduleSlot(oldSlot, nextSlot) {
    Object.values(state.dailySchedules || {}).forEach((daySchedule) => {
      if (!daySchedule || typeof daySchedule !== "object") return;

      Object.keys(daySchedule)
        .filter((key) => key === oldSlot || key.startsWith(`${oldSlot}||`))
        .forEach((key) => {
          const nextKey = key === oldSlot ? nextSlot : key.replace(oldSlot, nextSlot);
          daySchedule[nextKey] = daySchedule[nextKey] ? mergeScheduleSlotRecords(daySchedule[nextKey], daySchedule[key]) : daySchedule[key];
          delete daySchedule[key];
        });
    });
  }

  function updateScheduleGroupField(target) {
    const slot = target.dataset.slot;
    const groupId = target.dataset.groupId;
    const field = target.dataset.scheduleGroupField;
    const group = findScheduleGroup(dailyDate, slot, groupId);

    if (!group) return;
    if (["program", "room"].includes(field) && target.dataset.mergedGroupIds) {
      const mergedIds = target.dataset.mergedGroupIds.split(",").filter(Boolean);
      mergedIds.forEach((id) => {
        const mergedGroup = findScheduleGroup(dailyDate, slot, id);
        if (mergedGroup) mergedGroup[field] = target.value;
      });
    } else if (field === "teachers") {
      setGroupTeachers(
        group,
        Array.from(target.selectedOptions || [])
          .map((option) => option.value)
          .filter(Boolean)
      );
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

  function updateUserSubstitute(target) {
    const user = cleanSelectValue(target.dataset.userSubstituteTeacher);
    const teacher = cleanSelectValue(target.value);
    if (!user) return;

    state.userSubstitutes = state.userSubstitutes || {};
    if (!state.userSubstitutes[dailyDate]) state.userSubstitutes[dailyDate] = {};
    if (teacher) {
      state.userSubstitutes[dailyDate][user] = teacher;
    } else {
      delete state.userSubstitutes[dailyDate][user];
    }
    if (!Object.keys(state.userSubstitutes[dailyDate]).length) delete state.userSubstitutes[dailyDate];
    saveState("대체 교사가 저장되었습니다.");
    renderDaily();
  }

  function updateScheduleTeachers(target) {
    const wrapper = target.closest("[data-schedule-teachers]");
    if (!wrapper) return;

    const group = findScheduleGroup(dailyDate, wrapper.dataset.slot, wrapper.dataset.groupId);
    if (!group) return;

    setGroupTeachers(
      group,
      Array.from(wrapper.querySelectorAll("[data-schedule-teacher]:checked")).map((input) => input.value)
    );
    group.paperTeachers = Array.from(wrapper.querySelectorAll("[data-schedule-paper-teacher]:checked"))
      .map((input) => input.value)
      .filter((teacher) => groupTeacherList(group).includes(teacher));
    state.dailySchedules[dailyDate][wrapper.dataset.slot] = sanitizeScheduleSlot(getScheduleSlot(dailyDate, wrapper.dataset.slot), wrapper.dataset.slot);
    saveState("시간표가 저장되었습니다.");
    renderDaily();
  }

  function updateSchedulePaperTeachers(target) {
    const wrapper = target.closest("[data-schedule-teachers]");
    if (!wrapper) return;

    const group = findScheduleGroup(dailyDate, wrapper.dataset.slot, wrapper.dataset.groupId);
    if (!group) return;

    const teachers = groupTeacherList(group);
    group.paperTeachers = Array.from(wrapper.querySelectorAll("[data-schedule-paper-teacher]:checked"))
      .map((input) => input.value)
      .filter((teacher) => teachers.includes(teacher))
      .filter(unique);
    state.dailySchedules[dailyDate][wrapper.dataset.slot] = sanitizeScheduleSlot(getScheduleSlot(dailyDate, wrapper.dataset.slot), wrapper.dataset.slot);
    saveState("서류 담당 교사가 저장되었습니다.");
    renderDaily();
  }

  function updateScheduleSupport(target) {
    const wrapper = target.closest("[data-schedule-support-picker]");
    if (!wrapper) return;
    const slot = wrapper.dataset.slot;
    const field = wrapper.dataset.supportField;
    const slotRecord = getScheduleSlot(dailyDate, slot);

    slotRecord[field] = Array.from(wrapper.querySelectorAll("[data-schedule-support-field]:checked")).map((input) => input.value);
    state.dailySchedules[dailyDate][slot] = sanitizeScheduleSlot(slotRecord, slot);
    saveState("시간표가 저장되었습니다.");
    renderDaily();
  }

  function updateScheduleSupportNote(target) {
    const slot = target.dataset.slot;
    const field = target.dataset.scheduleSupportNoteField;
    const teacher = target.dataset.supportNoteTeacher;
    const slotRecord = getScheduleSlot(dailyDate, slot);
    if (!["docs", "desk"].includes(field) || !teacher || !supportTeacherList(slotRecord, field).includes(teacher)) return;

    slotRecord.supportNotes = normalizeSupportNotes(slotRecord.supportNotes);
    const note = cleanSelectValue(target.value);
    const fieldNotes = { ...(slotRecord.supportNotes[field] || {}) };
    if (note) {
      fieldNotes[teacher] = note;
    } else {
      delete fieldNotes[teacher];
    }
    if (Object.keys(fieldNotes).length) slotRecord.supportNotes[field] = fieldNotes;
    else delete slotRecord.supportNotes[field];

    state.dailySchedules[dailyDate][slot] = sanitizeScheduleSlot(slotRecord, slot);
    saveState("시간표 메모가 저장되었습니다.");
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
    const users = Array.from(wrapper.querySelectorAll("[data-aftercare-draft-user]:checked")).map((input) => cleanSelectValue(input.value)).filter(Boolean).filter(unique);
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
    const itemIds = String(itemId || "").split(",").map(cleanSelectValue).filter(Boolean);
    info.items = info.items.filter((item) => !itemIds.includes(item.id));
    setAftercareInfo(dailyDate, info);
    saveState("등하원 정보가 삭제되었습니다.");
    renderDaily();
  }

  function updateScheduleSlotMemo(target) {
    const slot = target.dataset.slot;
    if (!slot) return;
    const slotRecord = getScheduleSlot(dailyDate, slot);
    slotRecord.memo = target.value;
    state.dailySchedules[dailyDate][slot] = sanitizeScheduleSlot(slotRecord, slot);
    saveState("비고가 저장되었습니다.");
  }

  function addRemarkTeacherNote(button) {
    const wrapper = button.closest("[data-remark-note-editor]");
    const slot = wrapper?.dataset.slot;
    if (!wrapper || !slot) return;

    const teacher = cleanSelectValue(wrapper.querySelector("[data-remark-note-teacher]")?.value);
    const text = cleanSelectValue(wrapper.querySelector("[data-remark-note-text]")?.value);
    if (!teacher) {
      setSyncStatus("교사를 선택해주세요.");
      return;
    }
    if (!text) {
      setSyncStatus("업무 또는 전달사항을 입력해주세요.");
      return;
    }

    const slotRecord = getScheduleSlot(dailyDate, slot);
    slotRecord.teacherNotes = normalizeScheduleTeacherNotes(slotRecord.teacherNotes);
    slotRecord.teacherNotes.push({
      id: uid("remark"),
      teacher,
      text
    });
    state.dailySchedules[dailyDate][slot] = sanitizeScheduleSlot(slotRecord, slot);
    saveState("교사별 비고가 저장되었습니다.");
    renderDaily();
  }

  function removeRemarkTeacherNote(button) {
    const slot = button.dataset.slot;
    const noteId = button.dataset.removeRemarkNote;
    if (!slot || !noteId) return;

    const slotRecord = getScheduleSlot(dailyDate, slot);
    slotRecord.teacherNotes = normalizeScheduleTeacherNotes(slotRecord.teacherNotes).filter((note) => note.id !== noteId);
    state.dailySchedules[dailyDate][slot] = sanitizeScheduleSlot(slotRecord, slot);
    saveState("교사별 비고가 삭제되었습니다.");
    renderDaily();
  }

  function scheduleInfoForScope(scope) {
    return scope === "aftercare" ? getAftercareInfo(dailyDate) : getDayInfo(dailyDate);
  }

  function setScheduleInfoForScope(scope, info) {
    if (scope === "aftercare") {
      setAftercareInfo(dailyDate, info);
    } else {
      setDayInfo(dailyDate, info);
    }
  }

  function updateAbsentUsers(target) {
    const scope = target.dataset.absentUser || "day";
    const wrapper = target.closest(`[data-absent-picker="${scope}"]`);
    if (!wrapper) return;

    if (scope === "aftercare") aftercareAbsentPickerOpen = true;
    else dayAbsentPickerOpen = true;
    const selectedUsers = Array.from(wrapper.querySelectorAll(`[data-absent-user="${scope}"]:checked`))
      .map((input) => cleanSelectValue(input.value))
      .filter(Boolean)
      .filter(unique);
    const info = scheduleInfoForScope(scope);
    const existingIds = new Map(info.items.filter((item) => item.type === INFO_ABSENT).map((item) => [item.user, item.id]));

    info.items = [
      ...info.items.filter((item) => item.type !== INFO_ABSENT),
      ...selectedUsers.map((user) => ({
        id: existingIds.get(user) || uid("aftercare"),
        type: INFO_ABSENT,
        user,
        time: ""
      }))
    ];

    setScheduleInfoForScope(scope, info);
    saveState(scope === "aftercare" ? "방과후 결석 이용인이 저장되었습니다." : "주간 결석 이용인이 저장되었습니다.");
    renderDaily();
  }

  function addCommuteItem(button) {
    const scope = button.dataset.addCommuteItem || "day";
    const wrapper = button.closest(`[data-commute-picker="${scope}"]`);
    if (!wrapper) return;

    const type = cleanSelectValue(wrapper.querySelector('[data-commute-draft="type"]')?.value) || INFO_ARRIVAL;
    const time = cleanSelectValue(wrapper.querySelector('[data-commute-draft="time"]')?.value);
    const users = Array.from(wrapper.querySelectorAll("[data-commute-draft-user]:checked"))
      .map((input) => cleanSelectValue(input.value))
      .filter(Boolean)
      .filter(unique);

    if (!time) {
      setSyncStatus("시간을 선택해주세요.");
      return;
    }
    if (!users.length) {
      setSyncStatus("이용인을 선택해주세요.");
      return;
    }

    const info = scheduleInfoForScope(scope);
    users.forEach((user) => {
      info.items.push({
        id: uid("commute"),
        type,
        user,
        time
      });
    });
    commutePickerOpen = scope;
    setScheduleInfoForScope(scope, info);
    saveState("개별 등하원 시간이 저장되었습니다.");
    renderDaily();
  }

  function removeCommuteItem(button) {
    const scope = button.dataset.removeCommuteItem || "day";
    const ids = String(button.dataset.commuteItemIds || "").split(",").map(cleanSelectValue).filter(Boolean);
    if (!ids.length) return;
    const info = scheduleInfoForScope(scope);
    info.items = info.items.filter((item) => !ids.includes(item.id));
    commutePickerOpen = scope;
    setScheduleInfoForScope(scope, info);
    saveState("개별 등하원 시간이 삭제되었습니다.");
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
    const printTarget = document.getElementById("monthly-print-target")?.value || SERVICE_CALENDARS[0].key;
    document.body.dataset.monthlyPrintTarget = printTarget;
    document.body.classList.add("printing-monthly");
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => {
        document.body.classList.remove("printing-monthly");
        delete document.body.dataset.monthlyPrintTarget;
      }, 300);
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
      .sort((a, b) => programSortKey(a).localeCompare(programSortKey(b)));
  }

  function programSortKey(program) {
    const service = normalizeServiceName(program.service);
    const serviceIndex = SERVICE_CALENDARS.findIndex((calendar) => calendar.service === service);
    const period = normalizeProgramPeriod(program.period) || Number.MAX_SAFE_INTEGER;
    return [
      String(serviceIndex < 0 ? 99 : serviceIndex).padStart(2, "0"),
      String(period).padStart(3, "0"),
      String(programGroupOrder(program)).padStart(2, "0"),
      program.time || "99:99"
    ].join("|");
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

  function moveEntriesForType(date, type) {
    return movesForDate(date).filter((entry) => normalizeMoveType(entry) === type);
  }

  function vacationTeachersForDate(date) {
    const fullDayLeaveTypes = new Set(["휴가", "생일 휴가", "경조사 휴가"]);
    return new Set(
      movesForDate(date)
        .filter((entry) => fullDayLeaveTypes.has(normalizeMoveType(entry)))
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
      let filledExtra = SUPPORT_FIELDS.filter((field) => supportTeacherList(slotRecord, field).length).length;
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
      memo: "",
      teacherNotes: [],
      supportNotes: {},
      dayInfo: normalizeAfterInfo(),
      afterInfo: normalizeAfterInfo()
    };

    if (!input || typeof input !== "object") return slotRecord;

    slotRecord.rest = normalizeTeacherList(input.rest);
    slotRecord.memo = cleanSelectValue(input.memo || input.note);
    slotRecord.teacherNotes = normalizeScheduleTeacherNotes(input.teacherNotes || input.remarkNotes);
    slotRecord.supportNotes = normalizeSupportNotes(input.supportNotes);
    slotRecord.dayInfo = normalizeAfterInfo(input.dayInfo);
    slotRecord.afterInfo = normalizeAfterInfo(input.afterInfo);
    const legacyDocs = normalizeTeacherList(input.docs);

    if (Array.isArray(input.groups)) {
      slotRecord.groups = input.groups.map(normalizeScheduleGroup);
    } else if (scheduleGroupHasContent(input)) {
      slotRecord.groups = [normalizeScheduleGroup(input)];
    }

    if (legacyDocs.length) {
      slotRecord.groups.forEach((group) => {
        group.paperTeachers = groupTeacherList(group).filter((teacher) => legacyDocs.includes(teacher)).filter(unique);
      });
    }

    return slotRecord;
  }

  function normalizeScheduleGroup(input = {}) {
    const teachers = normalizeTeacherList(input.teachers && input.teachers.length ? input.teachers : input.teacher);
    const paperTeachers = normalizeTeacherList(input.paperTeachers || input.docsTeachers || input.docs).filter((teacher) => teachers.includes(teacher));

    return {
      id: input.id || uid("group"),
      program: cleanSelectValue(input.program),
      room: cleanSelectValue(input.room),
      teacher: teachers[0] || "",
      teachers,
      paperTeachers,
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
          items.push(normalizeAftercareItem({ type: INFO_ABSENT, user }));
        });

      const arrival = cleanSelectValue(input.arrival);
      if (arrival) items.push(normalizeAftercareItem({ type: INFO_ARRIVAL, user: arrival.replace(/\d{1,2}:\d{2}/, "").trim() || arrival, time: extractTimeValue(arrival) }));

      const departure = cleanSelectValue(input.departure);
      if (departure) items.push(normalizeAftercareItem({ type: INFO_DEPARTURE, user: departure.replace(/\d{1,2}:\d{2}/, "").trim() || departure, time: extractTimeValue(departure) }));
    }

    return {
      items: items.filter((item, index, array) => array.findIndex((target) => target.type === item.type && target.user === item.user && target.time === item.time) === index),
      memo: cleanSelectValue(input.memo)
    };
  }

  function normalizeAftercareItem(input = {}) {
    const rawType = cleanSelectValue(input.type);
    const type = AFTERCARE_INFO_TYPES.includes(rawType)
      ? rawType
      : rawType.includes(INFO_ARRIVAL)
        ? INFO_ARRIVAL
        : rawType.includes(INFO_DEPARTURE)
          ? INFO_DEPARTURE
          : INFO_ABSENT;
    return {
      id: input.id || uid("aftercare"),
      type,
      user: cleanSelectValue(input.user || input.person),
      time: type === INFO_ABSENT ? "" : cleanSelectValue(input.time)
    };
  }

  function normalizeScheduleTeacherNotes(input = []) {
    const rawItems = Array.isArray(input)
      ? input
      : input && typeof input === "object"
        ? Object.entries(input).map(([teacher, text]) => ({ teacher, text }))
        : [];

    return rawItems
      .map((item) => ({
        id: item.id || uid("remark"),
        teacher: cleanSelectValue(item.teacher || item.name),
        text: cleanSelectValue(item.text || item.memo || item.note)
      }))
      .filter((item) => item.teacher && item.text);
  }

  function normalizeSupportNotes(input = {}) {
    const notes = {};
    if (!input || typeof input !== "object") return notes;

    SUPPORT_FIELDS.forEach((field) => {
      const raw = input[field];
      if (typeof raw === "string") {
        const note = cleanSelectValue(raw);
        if (note) notes[field] = { __legacy: note };
        return;
      }

      if (!raw || typeof raw !== "object") return;
      const fieldNotes = {};
      Object.entries(raw).forEach(([teacher, note]) => {
        const key = cleanSelectValue(teacher);
        const value = cleanSelectValue(note);
        if (key && value) fieldNotes[key] = value;
      });
      if (Object.keys(fieldNotes).length) notes[field] = fieldNotes;
    });

    return notes;
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
      teachers: [],
      paperTeachers: [],
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

      const teachers = groupTeacherList(normalized).filter((teacher) => {
        if (usedTeachers.has(teacher)) return false;
        usedTeachers.add(teacher);
        return true;
      });
      setGroupTeachers(normalized, teachers);
      normalized.paperTeachers = normalizeTeacherList(normalized.paperTeachers).filter((teacher) => teachers.includes(teacher));

      if (isDayDismissalSlot(slot)) {
        normalized.program = dayDismissalProgram(normalized);
        if (normalized.program === DEFAULT_DAY_DISMISSAL_PROGRAM) {
          normalized.room = DAY_DISMISSAL_ROOM;
        } else if (normalized.room === DAY_DISMISSAL_ROOM) {
          normalized.room = "";
        }
      }

      return normalized;
    });

    slotRecord.afterInfo = normalizeAfterInfo(slotRecord.afterInfo);
    slotRecord.dayInfo = normalizeAfterInfo(slotRecord.dayInfo);
    slotRecord.memo = cleanSelectValue(slotRecord.memo);
    slotRecord.teacherNotes = normalizeScheduleTeacherNotes(slotRecord.teacherNotes);

    if (aftercare) {
      SUPPORT_FIELDS.forEach((field) => {
        slotRecord[field] = "";
      });
      slotRecord.supportNotes = {};
      if (!slotRecord.groups.length) slotRecord.groups = [blankScheduleGroup()];
      return slotRecord;
    }

    const supportUsed = new Set();
    slotRecord.supportNotes = normalizeSupportNotes(slotRecord.supportNotes);
    SUPPORT_FIELDS.forEach((field) => {
      const teachers = supportTeacherList(slotRecord, field).filter((teacher) => {
        if (usedTeachers.has(teacher) || supportUsed.has(teacher)) return false;
        supportUsed.add(teacher);
        return true;
      });

      if (!teachers.length) {
        slotRecord[field] = [];
        delete slotRecord.supportNotes[field];
        return;
      }

      const notes = {};
      teachers.forEach((teacher) => {
        const note = supportNoteValue(slotRecord, field, teacher);
        if (note) notes[teacher] = note;
      });
      slotRecord[field] = teachers;
      if (Object.keys(notes).length) {
        slotRecord.supportNotes[field] = notes;
      } else {
        delete slotRecord.supportNotes[field];
      }
    });

    if (!slotRecord.groups.length) slotRecord.groups = [blankScheduleGroup()];
    return slotRecord;
  }

  function scheduleGroupHasContent(group = {}) {
    return Boolean(
      group.program ||
        group.teacher ||
        groupTeacherList(group).length ||
        normalizeTeacherList(group.paperTeachers).length ||
        group.room ||
        group.rest ||
        group.docs ||
        group.desk ||
        (Array.isArray(group.users) ? group.users.length : String(group.users || "").trim()) ||
        group.memo
    );
  }

  function supportValues(slotRecord) {
    return SUPPORT_FIELDS.flatMap((field) => supportTeacherList(slotRecord, field));
  }

  function supportTeacherList(slotRecord = {}, field) {
    return normalizeTeacherList(slotRecord?.[field]);
  }

  function supportNoteValue(slotRecord = {}, field, teacher) {
    const notes = normalizeSupportNotes(slotRecord.supportNotes);
    const fieldNotes = notes[field] || {};
    return cleanSelectValue(fieldNotes[teacher] || fieldNotes.__legacy);
  }

  function groupTeacherList(group = {}) {
    return normalizeTeacherList(group.teachers && group.teachers.length ? group.teachers : group.teacher);
  }

  function setGroupTeachers(group, teachers) {
    const list = normalizeTeacherList(teachers);
    group.teachers = list;
    group.teacher = list[0] || "";
    group.paperTeachers = normalizeTeacherList(group.paperTeachers).filter((teacher) => list.includes(teacher));
    return group;
  }

  function normalizeTeacherList(value) {
    if (Array.isArray(value)) {
      return value.map(cleanSelectValue).filter(Boolean).filter(unique);
    }

    return String(value || "")
      .split(/[,/|\n]+/)
      .map(cleanSelectValue)
      .filter(Boolean)
      .filter(unique);
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

  function normalizeHighlightTerms(value) {
    const source = Array.isArray(value) ? value : String(value || "").split(/[,/|\n]+/);
    return source.map(cleanSelectValue).filter(Boolean).filter(unique);
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
    if (start >= 16 * 60) return AFTERCARE_USER_GROUP_KEYS;
    return DAY_USER_GROUP_KEYS;
  }

  function isAftercareSlot(slot) {
    return slotStartMinutes(slot) >= 16 * 60;
  }

  function isDayDismissalSlot(slot) {
    const slots = state.settings.timeSlots || [];
    const index = slots.indexOf(slot);
    const firstAftercareIndex = slots.findIndex(isAftercareSlot);
    return firstAftercareIndex > 0 && index === firstAftercareIndex - 1;
  }

  function isDismissalSlot(slot) {
    const [, end] = String(slot || "").split("~");
    return isAftercareSlot(slot) && !cleanSelectValue(end);
  }

  function isAftercareInfoSlot(slot) {
    return isAftercareSlot(slot) && !isDismissalSlot(slot);
  }

  function firstAftercareSlot() {
    return (state.settings.timeSlots || []).find(isAftercareSlot) || "";
  }

  function firstDaySlot() {
    return (state.settings.timeSlots || []).find((slot) => !isAftercareSlot(slot)) || "";
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
    (state.settings.timeSlots || []).forEach((slot) => {
      const slotRecord = getScheduleSlot(date, slot);
      slotRecord.afterInfo = normalized;
      state.dailySchedules[date][slot] = sanitizeScheduleSlot(slotRecord, slot);
    });
    removeAftercareAbsentUsers(date);
  }

  function getDayInfo(date) {
    const slot = firstDaySlot();
    if (!slot) return normalizeAfterInfo();
    return normalizeAfterInfo(getScheduleSlot(date, slot).dayInfo);
  }

  function setDayInfo(date, info) {
    const normalized = normalizeAfterInfo(info);
    (state.settings.timeSlots || []).filter((slot) => !isAftercareSlot(slot)).forEach((slot) => {
      const slotRecord = getScheduleSlot(date, slot);
      slotRecord.dayInfo = normalized;
      state.dailySchedules[date][slot] = sanitizeScheduleSlot(slotRecord, slot);
    });
    removeDayAbsentUsers(date);
  }

  function allowedUsersForSlot(slot) {
    return allowedUserGroupsForSlot(slot).flatMap((key) => state.settings.userGroups?.[key] || []).filter(unique);
  }

  function absentDayUsers(date) {
    return new Set(getDayInfo(date).items.filter((item) => item.type === INFO_ABSENT).map((item) => item.user).filter(Boolean));
  }

  function absentAftercareUsers(date) {
    return new Set(getAftercareInfo(date).items.filter((item) => item.type === INFO_ABSENT).map((item) => item.user).filter(Boolean));
  }

  function removeDayAbsentUsers(date) {
    const absentUsers = absentDayUsers(date);
    if (!absentUsers.size) return false;

    let changed = false;
    (state.settings.timeSlots || []).filter((slot) => !isAftercareSlot(slot)).forEach((slot) => {
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

  function commuteTimeOptions(scope = "day") {
    const slots = (state.settings.timeSlots || []).filter((slot) => (scope === "aftercare" ? isAftercareInfoSlot(slot) : !isAftercareSlot(slot)));
    if (!slots.length) return aftercareTimeOptions();
    const start = slotStartMinutes(slots[0]);
    const lastSlot = slots[slots.length - 1];
    const [, rawEnd] = splitSlotTime(lastSlot);
    const end = rawEnd ? timeToMinutes(rawEnd) : slotStartMinutes(lastSlot) + 40;
    const options = [];
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

  function assignedTeacherForUser(user, assignments = state.settings.userAssignments) {
    const name = cleanSelectValue(user);
    return cleanSelectValue(assignments?.[name]);
  }

  function substituteTeacherForUser(date, user) {
    const iso = normalizeDateInput(date);
    const name = cleanSelectValue(user);
    return cleanSelectValue(iso ? state.userSubstitutes?.[iso]?.[name] : "");
  }

  function effectiveTeacherForUser(user, date = "") {
    return substituteTeacherForUser(date, user) || assignedTeacherForUser(user);
  }

  function renderUserNameBadge(user, date = "", suffix = "") {
    const name = cleanSelectValue(user);
    const teacher = effectiveTeacherForUser(name, date);
    const style = teacher ? ` style="--user-teacher-color: ${h(teacherColor(teacher))}"` : "";
    const title = teacher ? ` title="${h(teacher)}"` : "";
    return `<span class="user-name-badge ${teacher ? "has-teacher" : ""}"${style}${title}>${h(name)}${h(suffix)}</span>`;
  }

  function renderUserNameList(users, date = "") {
    return normalizeUserList(users).map((user) => renderUserNameBadge(user, date)).join(" ");
  }

  function teacherBadge(name, fallback = "담당자 미정") {
    const teacher = cleanSelectValue(name);
    if (!teacher) return h(fallback);
    if (!state.settings.teachers.includes(teacher)) return h(teacher);
    return `<span class="teacher-name" style="--teacher-color: ${h(teacherColor(teacher))}">${h(teacher)}</span>`;
  }

  function teacherBadgeList(value, fallback = "") {
    const teachers = normalizeTeacherList(value);
    if (!teachers.length) return h(fallback);
    return `<span class="teacher-badge-list">${teachers.map((teacher) => teacherBadge(teacher, teacher)).join("")}</span>`;
  }

  function teacherBadgeListForGroup(group, fallback = "") {
    const teachers = groupTeacherList(group);
    const paperSet = new Set(normalizeTeacherList(group.paperTeachers));
    if (!teachers.length) return h(fallback);
    return `<span class="teacher-badge-list">${teachers.map((teacher) => `<span class="teacher-name" style="--teacher-color: ${h(teacherColor(teacher))}">${paperSet.has(teacher) ? "*" : ""}${h(teacher)}</span>`).join("")}</span>`;
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
    const aftercareStart = firstAftercareSlot().split("~")[0] || "16:00";
    return `${first} ~ ${aftercareStart}`;
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

  function splitSlotTime(slot) {
    const [start = "", end = ""] = String(slot || "").split("~");
    return [cleanSelectValue(start), cleanSelectValue(end)];
  }

  function formatSlotText(slot) {
    const [start, end] = splitSlotTime(slot);
    return end ? `${start} ~ ${end}` : start || "";
  }

  function dayDismissalProgram(group = {}) {
    return cleanSelectValue(group.program) || DEFAULT_DAY_DISMISSAL_PROGRAM;
  }

  function scheduleKey(slot, service) {
    return `${slot}||${service}`;
  }

  function categoryName(id) {
    return categorySeed.find((category) => category.id === id)?.name || "학습형";
  }

  function shortProgramLabel(program) {
    const major = cleanSelectValue(program.major) || "프로그램";
    const topic = cleanSelectValue(program.topic);
    const topicList = Array.isArray(program.topicList) ? program.topicList.filter(Boolean) : [];
    const topicText = topicList.length ? topicList.join(", ") : topic;
    const group = programGroupMeta(program);
    return `${major}${group ? ` (${group})` : ""}${topicText ? ` · ${topicText}` : ""}${programSessionSuffix(program)}`;
  }

  function programSessionSuffix(program) {
    const session = Number(program.session) || 1;
    return session > 1 ? ` (${session}차시)` : "";
  }

  function renderProgramChip(program, attributes = "", options = {}) {
    const session = normalizeProgramDuration(program.session);
    const span = Math.max(1, options.duration || session);
    const period = normalizeProgramPeriod(options.period);
    const major = cleanSelectValue(program.major) || "프로그램";
    const topic = cleanSelectValue(program.topic);
    const topicList = Array.isArray(program.topicList) ? program.topicList.filter(Boolean) : [];
    const suffix = programSessionSuffix(program).trim();
    const secondLine = topicList.length ? "" : [`${topic ? `(${topic})` : ""}`, suffix].filter(Boolean).join(" ");
    const group = normalizeProgramGroup(program.group);
    const groupClass = group === "A" ? "group-a" : group === "B" ? "group-b" : "group-all";
    const groupText = programGroupMeta(program);
    const topicListClass = topicList.length ? "topic-list-program-chip" : "";
    const majorLetterSpacing = normalizeProgramLetterSpacing(program.majorLetterSpacing);
    const topicLetterSpacing = normalizeProgramLetterSpacing(program.topicLetterSpacing);
    const letterSpacingStyle = `--program-major-letter-spacing: ${majorLetterSpacing}em; --program-topic-letter-spacing: ${topicLetterSpacing}em;`;
    const gridStyle = period ? `grid-row: ${period} / span ${span}; grid-column: ${programGridColumn(program, options.splitGroups)};` : "";
    return `
      <span class="chip program-chip category-${h(program.category)} session-${span} ${groupClass} ${topicListClass}" style="--session-span: ${span}; ${letterSpacingStyle} ${gridStyle}" title="${h(shortProgramLabel(program))}" ${attributes}>
        <span class="program-chip-major">${h(`${major}${groupText ? ` (${groupText})` : ""}`)}</span>
        ${
          topicList.length
            ? `<span class="program-chip-topic-list">${topicList.map((item) => `<span>-${h(item)}</span>`).join("")}</span>`
            : secondLine
              ? `<span class="program-chip-topic">${h(secondLine)}</span>`
              : ""
        }
      </span>
    `;
  }

  function renderCommuteInfoPicker(scope, date, label, userGroupKeys, info) {
    const value = normalizeAfterInfo(info);
    const open = commutePickerOpen === scope;
    const users = userGroupKeys.flatMap((key) => state.settings.userGroups?.[key] || []).filter(unique);
    const commuteItems = value.items.filter((item) => item.type !== INFO_ABSENT);
    const selectedLabel = commuteItems.length ? `${commuteItems.length}건 등록` : "선택";

    return `
      <span class="service-band-summary-item has-picker commute-summary-item">
        <b>${h(label)}</b>
        <span class="service-band-summary-value">
          <span class="service-band-user-select ${open ? "open" : ""}" data-commute-picker-shell="${h(scope)}">
            <button class="service-band-picker-button" data-toggle-commute-picker="${h(scope)}" type="button" aria-expanded="${open ? "true" : "false"}">
              <span>${h(selectedLabel)}</span>
              <span aria-hidden="true">▾</span>
            </button>
            ${
              open
                ? `
                  <span class="service-band-commute-picker" data-commute-picker="${h(scope)}" role="group" aria-label="${h(label)}">
                    <span class="commute-add-row">
                      <select data-commute-draft="type" aria-label="등하원 구분">
                        ${COMMUTE_INFO_TYPES.map((type) => `<option value="${h(type)}">${h(type)}</option>`).join("")}
                      </select>
                      <select data-commute-draft="time" aria-label="시간 선택">
                        <option value="">시간 선택</option>
                        ${commuteTimeOptions(scope).map((time) => `<option value="${h(time)}">${h(time)}</option>`).join("")}
                      </select>
                      <button class="mini-button" data-add-commute-item="${h(scope)}" type="button">추가</button>
                    </span>
                    <span class="service-band-user-picker commute-user-picker" role="group" aria-label="이용인 선택">
                      ${
                        users.length
                          ? users
                              .map(
                                (user) => `
                                  <label class="check-row">
                                    <input data-commute-draft-user type="checkbox" value="${h(user)}" />
                                    ${renderUserNameBadge(user, date)}
                                  </label>
                                `
                              )
                              .join("")
                          : `<span class="muted">등록된 이용인 없음</span>`
                      }
                    </span>
                    <span class="commute-entry-list">
                      ${
                        groupAftercareItems(commuteItems).length
                          ? groupAftercareItems(commuteItems)
                              .map(
                                (group) => `
                                  <span class="commute-entry">
                                    <span><b>${h(group.label)}</b> ${renderUserNameList(group.users, date)}</span>
                                    <button class="mini-button danger-mini" data-remove-commute-item="${h(scope)}" data-commute-item-ids="${h(group.ids.join(","))}" type="button">삭제</button>
                                  </span>
                                `
                              )
                              .join("")
                          : `<span class="empty compact">등록된 등하원 정보가 없습니다.</span>`
                      }
                    </span>
                  </span>
                `
                : ""
            }
          </span>
        </span>
      </span>
    `;
  }

  function commuteSummaryText(items = []) {
    return groupAftercareItems(items)
      .map((group) => `${group.label.replace(/:$/, "")} ${group.users.join(", ")}`)
      .join(" / ");
  }

  function programTopicListFromForm(data, major) {
    if (!isClubProgramMajor(major)) return [];
    return Array.from({ length: CLUB_TOPIC_COUNT }, (_, index) => data.get(`clubTopic${index + 1}`)).map(cleanSelectValue).filter(Boolean);
  }

  function updateProgramSpecialFields(form) {
    const major = cleanSelectValue(form.elements.major?.value);
    const isClub = isClubProgramMajor(major);
    const topicInput = form.elements.topic;
    const sessionInput = form.querySelector("[data-program-session-input]");

    form.classList.toggle("club-program-mode", isClub);
    if (topicInput) topicInput.required = false;
    if (sessionInput && isClub) sessionInput.value = "2";

    form.querySelectorAll("[data-club-topic-field]").forEach((field) => {
      const input = field.querySelector("input");
      if (input) input.required = isClub;
    });

  }

  function programDraftFromForm(form) {
    const data = new FormData(form);
    const major = String(data.get("major") || "").trim() || "대주제";
    const topicList = programTopicListFromForm(data, major);
    const topic = isClubProgramMajor(major) ? topicList[0] || "" : String(data.get("topic") || "").trim();
    const service = normalizeServiceName(data.get("service") || SERVICE_CALENDARS[0].service);
    const isDayService = service === SERVICE_CALENDARS[0].service;
    return normalizeProgram({
      id: "preview",
      date: data.get("date") || toIsoDate(selectedMonth),
      category: categoryForMajorTheme(major, topicList.join(" ") || topic),
      major,
      topic,
      topicList,
      period: Number(data.get("period") || 1),
      session: isClubProgramMajor(major) ? 2 : Number(data.get("session") || 1),
      majorLetterSpacing: data.get("majorLetterSpacing"),
      topicLetterSpacing: data.get("topicLetterSpacing"),
      service,
      group: isDayService ? data.get("group") : "all",
      time: "",
      teacher: "",
      room: ""
    });
  }

  function updateProgramSpacingPreview(form) {
    updateProgramSpecialFields(form);
    const preview = form.querySelector("[data-program-spacing-preview]");
    if (!preview) return;
    preview.innerHTML = renderProgramChip(programDraftFromForm(form));
  }

  function updateProgramSpacingPreviews(root = document) {
    root.querySelectorAll("form#program-form, form[data-program-update-form]").forEach(updateProgramSpacingPreview);
  }

  function programGridColumn(program, splitGroups = false) {
    if (!splitGroups) return "1 / -1";
    const group = normalizeProgramGroup(program.group);
    if (group === "A") return "1 / 2";
    if (group === "B") return "2 / 3";
    return "1 / -1";
  }

  function shortMoveLabel(item) {
    return `${item.type} ${item.person || ""}`.trim();
  }

  function programOptionLabel(program) {
    const group = programGroupMeta(program);
    const topicList = normalizeClubTopicList(program.topicList);
    const topic = topicList.length ? topicList.join(", ") : program.topic;
    return `${program.major}${group ? ` (${group})` : ""}${topic ? ` - ${topic}` : ""}${Number(program.session) > 1 ? ` (${program.session}차시)` : ""}`;
  }

  function programMetaLabel(program, options = {}) {
    return [categoryName(program.category), programPeriodMeta(program), programGroupMeta(program), Number(program.session) > 1 ? `${program.session}차시` : "", options.service ? program.service || "구분 없음" : ""]
      .filter(Boolean)
      .join(" / ");
  }

  function programPeriodMeta(program) {
    const period = normalizeProgramPeriod(program.period);
    return period ? `${period}교시` : "";
  }

  function programGroupMeta(program) {
    if (normalizeServiceName(program.service) !== "주간") return "";
    const group = normalizeProgramGroup(program.group);
    return group === "all" ? "" : programGroupLabel(group);
  }

  function addMonths(date, amount) {
    const next = new Date(date);
    next.setMonth(next.getMonth() + amount);
    return startOfMonth(next);
  }

  function addYears(date, amount) {
    const next = new Date(date);
    next.setFullYear(next.getFullYear() + amount);
    return next;
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

    const openDailyDateButton = event.target.closest("[data-open-daily-date]");
    if (openDailyDateButton) {
      dailyDate = normalizeDateInput(openDailyDateButton.dataset.openDailyDate) || todayIso;
      currentView = "daily";
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

    const vacationPanelButton = event.target.closest("[data-vacation-panel]");
    if (vacationPanelButton) {
      vacationPanel = vacationPanelButton.dataset.vacationPanel || "schedule";
      localStorage.setItem(VACATION_PANEL_KEY, vacationPanel);
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

    const clearTransportButton = event.target.closest("[data-clear-transport-date]");
    if (clearTransportButton) {
      const ok = window.confirm("이 날짜의 휴가·송영 정보를 모두 삭제할까요?");
      if (!ok) return;
      clearTransportDate(clearTransportButton.dataset.clearTransportDate);
      return;
    }

    const moveTypeButton = event.target.closest("[data-move-type-panel]");
    if (moveTypeButton) {
      openMoveModal(moveTypeButton.dataset.moveDate, moveTypeButton.dataset.moveTypePanel);
      return;
    }

    if (event.target.closest("[data-reset-daily-schedule]")) {
      const ok = window.confirm("해당 날짜의 시간표를 초기화할까요? 월간 프로그램이 있으면 기본 시간표로 다시 불러옵니다.");
      if (!ok) return;
      resetDailySchedule(dailyDate);
      return;
    }

    const absentPickerButton = event.target.closest("[data-toggle-absent-picker]");
    if (absentPickerButton) {
      const scope = absentPickerButton.dataset.toggleAbsentPicker;
      if (scope === "aftercare") {
        aftercareAbsentPickerOpen = !aftercareAbsentPickerOpen;
      } else {
        dayAbsentPickerOpen = !dayAbsentPickerOpen;
      }
      renderDaily();
      return;
    }

    const commutePickerButton = event.target.closest("[data-toggle-commute-picker]");
    if (commutePickerButton) {
      const scope = commutePickerButton.dataset.toggleCommutePicker || "day";
      commutePickerOpen = commutePickerOpen === scope ? "" : scope;
      renderDaily();
      return;
    }

    const todayTeacherButton = event.target.closest("[data-select-today-teacher]");
    if (todayTeacherButton) {
      selectedTodayTeacher = todayTeacherButton.dataset.selectTodayTeacher || "";
      renderHome();
      return;
    }

    if (event.target.closest("[data-save-daily-schedule]")) {
      ensureDailySchedule(dailyDate);
      saveState("일일 시간표가 저장되었습니다.");
      renderDaily();
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

    const copyGroupNextButton = event.target.closest("[data-copy-group-next]");
    if (copyGroupNextButton) {
      copyScheduleGroupToNextSlot(copyGroupNextButton.dataset.slot, copyGroupNextButton.dataset.copyGroupNext);
      return;
    }

    const addTimeSlotButton = event.target.closest("[data-add-time-slot-after]");
    if (addTimeSlotButton) {
      addScheduleTimeSlot(addTimeSlotButton.dataset.addTimeSlotAfter);
      return;
    }

    const removeTimeSlotButton = event.target.closest("[data-remove-time-slot]");
    if (removeTimeSlotButton) {
      const ok = window.confirm("이 시간대를 삭제할까요? 해당 시간대에 입력된 내용도 함께 삭제됩니다.");
      if (!ok) return;
      removeScheduleTimeSlot(removeTimeSlotButton.dataset.removeTimeSlot);
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

    if (event.target.closest("[data-save-program-updates]")) {
      handleProgramUpdateBatch();
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

    const supportNoteButton = event.target.closest("[data-open-support-note]");
    if (supportNoteButton) {
      const nextEditor = {
        slot: supportNoteButton.dataset.slot,
        field: supportNoteButton.dataset.supportField,
        teacher: supportNoteButton.dataset.supportNoteTeacher
      };
      const alreadyOpen =
        supportNoteEditor?.slot === nextEditor.slot &&
        supportNoteEditor?.field === nextEditor.field &&
        supportNoteEditor?.teacher === nextEditor.teacher;
      supportNoteEditor = alreadyOpen ? null : nextEditor;
      renderDaily();
      return;
    }

    const copyTransportButton = event.target.closest("[data-copy-transport-date]");
    if (copyTransportButton) {
      copyTransportDate(copyTransportButton.dataset.copyTransportDate);
      return;
    }

    const pasteTransportButton = event.target.closest("[data-paste-transport-date]");
    if (pasteTransportButton) {
      pasteTransportDate(pasteTransportButton.dataset.pasteTransportDate);
      return;
    }

    const addAftercareButton = event.target.closest("[data-add-aftercare-item]");
    if (addAftercareButton) {
      addAftercareItem(addAftercareButton);
      return;
    }

    const addCommuteButton = event.target.closest("[data-add-commute-item]");
    if (addCommuteButton) {
      addCommuteItem(addCommuteButton);
      return;
    }

    const removeCommuteButton = event.target.closest("[data-remove-commute-item]");
    if (removeCommuteButton) {
      removeCommuteItem(removeCommuteButton);
      return;
    }

    const addRemarkNoteButton = event.target.closest("[data-add-remark-note]");
    if (addRemarkNoteButton) {
      addRemarkTeacherNote(addRemarkNoteButton);
      return;
    }

    const removeRemarkNoteButton = event.target.closest("[data-remove-remark-note]");
    if (removeRemarkNoteButton) {
      removeRemarkTeacherNote(removeRemarkNoteButton);
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

    const deleteMajorThemeButton = event.target.closest("[data-delete-major-theme]");
    if (deleteMajorThemeButton) {
      const ok = window.confirm("이 대주제를 삭제할까요? 이미 등록된 프로그램은 그대로 유지됩니다.");
      if (!ok) return;
      deleteMajorTheme(deleteMajorThemeButton.dataset.deleteMajorTheme, deleteMajorThemeButton.dataset.programDate, deleteMajorThemeButton.dataset.programService);
      return;
    }

    const updateUserButton = event.target.closest("[data-update-user]");
    if (updateUserButton) {
      updateUser(updateUserButton);
      return;
    }

    if (event.target.closest("[data-edit-people]")) {
      editPeople(event.target.closest("[data-edit-people]").dataset.editPeople);
      return;
    }

    if (event.target.closest("[data-save-people]")) {
      savePeople(event.target.closest("[data-save-people]").dataset.savePeople);
      return;
    }

    if (event.target.closest("[data-edit-assignments]")) {
      editAssignments();
      return;
    }

    if (event.target.closest("[data-save-assignments]")) {
      saveAssignments();
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
      openProgramModal(deleteProgram.dataset.programDate, deleteProgram.dataset.programService);
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

    const editObservationButton = event.target.closest("[data-edit-observation]");
    if (editObservationButton) {
      editObservation(editObservationButton.dataset.editObservation);
      return;
    }

    if (event.target.closest("[data-apply-observation-highlight]")) {
      addSelectedObservationHighlight();
      return;
    }

    const removeHighlightButton = event.target.closest("[data-remove-observation-highlight]");
    if (removeHighlightButton) {
      removeObservationHighlight(removeHighlightButton.dataset.removeObservationHighlight);
      return;
    }

    if (event.target.closest("[data-cancel-observation-edit]")) {
      cancelObservationEdit();
      return;
    }

    if (currentView === "observations" && !event.target.closest("[data-observation-highlight-menu]") && !event.target.closest("[data-observation-summary]")) {
      hideObservationHighlightMenu();
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

    if (form.matches("[data-program-topic-form]")) {
      updateProgramTopic(form);
      return;
    }

    if (form.matches("[data-program-update-form]")) {
      handleProgramUpdateBatch();
      return;
    }

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

    if (target instanceof Element) {
      const previewForm = target.closest("form#program-form, form[data-program-update-form]");
      if (previewForm) updateProgramSpacingPreview(previewForm);
    }

    if (target.id === "daily-date") {
      dailyDate = target.value || todayIso;
      dayAbsentPickerOpen = false;
      aftercareAbsentPickerOpen = false;
      commutePickerOpen = "";
      renderDaily();
      return;
    }

    if (target.matches("[data-home-schedule-date]")) {
      homeScheduleDate = normalizeDateInput(target.value) || todayIso;
      selectedTodayTeacher = "";
      renderHome();
      return;
    }

    if (target.matches("[data-observation-date]")) {
      observationFormDate = normalizeDateInput(target.value) || todayIso;
      const datalist = document.getElementById("observation-time-options");
      if (datalist) {
        datalist.innerHTML = observationTimeOptionsForDate(observationFormDate).map((slot) => `<option value="${h(slot)}"></option>`).join("");
      }
      return;
    }

    if (target.matches("[data-transport-copy-filter]")) {
      transportCopyFilter = target.value || "all";
      renderVacation();
      return;
    }

    if (target.matches("[data-observation-user-filter]")) {
      observationUserFilter = target.value || "";
      renderObservations();
      return;
    }

    if (target.matches("[data-assignment-teacher-select]")) {
      updateAssignmentTeacher(target);
      return;
    }

    if (target.matches("[data-user-assignment]")) {
      updateUserAssignment(target);
      return;
    }

    if (target.matches("[data-user-substitute-teacher]")) {
      updateUserSubstitute(target);
      return;
    }

    if (target.matches("[data-major-theme-category]")) {
      updateMajorThemeCategory(target);
      return;
    }

    if (target.matches("[data-slot-time-field]")) {
      updateScheduleSlotTime(target);
      return;
    }

    if (target.matches("[data-schedule-group-field]")) {
      updateScheduleGroupField(target);
      return;
    }

    if (target.matches("[data-schedule-teacher]")) {
      updateScheduleTeachers(target);
      return;
    }

    if (target.matches("[data-schedule-paper-teacher]")) {
      updateSchedulePaperTeachers(target);
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

    if (target.matches("[data-absent-user]")) {
      updateAbsentUsers(target);
      return;
    }
  });

  document.addEventListener("mouseup", (event) => {
    if (event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("[data-observation-summary]")) {
      window.setTimeout(() => showObservationHighlightMenu(event), 0);
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-observation-summary]")) {
      window.setTimeout(() => showObservationHighlightMenu(event), 0);
    }
  });

  document.addEventListener("contextmenu", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-observation-summary]")) {
      event.preventDefault();
      hideObservationHighlightMenu();
    }
  });

  document.addEventListener("paste", (event) => {
    const editor = event.target instanceof Element ? event.target.closest("[data-observation-summary]") : null;
    if (!editor) return;
    event.preventDefault();
    document.execCommand("insertText", false, event.clipboardData?.getData("text/plain") || "");
    syncObservationEditorValue(editor);
  });

  document.addEventListener("input", (event) => {
    const target = event.target;

    if (target instanceof Element) {
      const previewForm = target.closest("form#program-form, form[data-program-update-form]");
      if (previewForm) updateProgramSpacingPreview(previewForm);
    }

    const observationEditor = target instanceof Element ? target.closest("[data-observation-summary]") : null;
    if (observationEditor) {
      syncObservationEditorValue(observationEditor);
      return;
    }

    if (target.matches("[data-report-field]")) {
      updateTeacherReport(target);
      return;
    }

    if (target.matches("[data-aftercare-field]")) {
      updateScheduleAftercare(target);
      return;
    }

    if (target.matches("[data-schedule-slot-memo]")) {
      updateScheduleSlotMemo(target);
      return;
    }

    if (target.matches("[data-schedule-support-note-field]")) {
      updateScheduleSupportNote(target);
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

  document.addEventListener("dragstart", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const transportChip = target?.closest("[data-transport-drag-date]");
    if (transportChip) {
      transportDragDate = transportChip.dataset.transportDragDate || "";
      event.dataTransfer?.setData("text/plain", transportDragDate);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
      return;
    }

    const chip = target?.closest("[data-program-drag-id]");
    if (!chip) return;

    programDragId = chip.dataset.programDragId || "";
    event.dataTransfer?.setData("text/plain", programDragId);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
  });

  document.addEventListener("dragover", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const transportDropTarget = target?.closest("[data-transport-drop-date]");
    if (transportDropTarget && transportDragDate) {
      event.preventDefault();
      transportDropTarget.classList.add("drag-over");
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      return;
    }

    const dropTarget = target?.closest("[data-program-drop-date]");
    if (!dropTarget || !programDragId) return;

    event.preventDefault();
    dropTarget.classList.add("drag-over");
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  });

  document.addEventListener("dragleave", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const transportDropTarget = target?.closest("[data-transport-drop-date]");
    const relatedTransport = event.relatedTarget instanceof Node ? event.relatedTarget : null;
    if (transportDropTarget && (!relatedTransport || !transportDropTarget.contains(relatedTransport))) {
      transportDropTarget.classList.remove("drag-over");
      return;
    }

    const dropTarget = target?.closest("[data-program-drop-date]");
    const related = event.relatedTarget instanceof Node ? event.relatedTarget : null;
    if (!dropTarget || (related && dropTarget.contains(related))) return;
    dropTarget.classList.remove("drag-over");
  });

  document.addEventListener("drop", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const transportDropTarget = target?.closest("[data-transport-drop-date]");
    if (transportDropTarget && transportDragDate) {
      event.preventDefault();
      transportDropTarget.classList.remove("drag-over");
      copyTransportDateToDate(transportDragDate, transportDropTarget.dataset.transportDropDate);
      transportDragDate = "";
      return;
    }

    const dropTarget = target?.closest("[data-program-drop-date]");
    if (!dropTarget) return;

    const programId = event.dataTransfer?.getData("text/plain") || programDragId;
    if (!programId) return;

    event.preventDefault();
    dropTarget.classList.remove("drag-over");
    copyMonthlyProgramToDate(programId, dropTarget.dataset.programDropDate, dropTarget.dataset.programDropService);
    programDragId = "";
  });

  document.addEventListener("dragend", () => {
    programDragId = "";
    transportDragDate = "";
    document.querySelectorAll(".program-day.drag-over").forEach((cell) => cell.classList.remove("drag-over"));
    document.querySelectorAll("[data-transport-drop-date].drag-over").forEach((cell) => cell.classList.remove("drag-over"));
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
