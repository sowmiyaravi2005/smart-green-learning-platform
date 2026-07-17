const profileBtn = document.getElementById("profileBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const courseList = document.getElementById("courseList");
const enrolledList = document.getElementById("enrolledList");
const progressSummary = document.getElementById("progressSummary");
const searchInput = document.getElementById("searchInput");
const durationFilter = document.getElementById("durationFilter");

const STORAGE_KEYS = {
  userName: "userName",
  userEmail: "userEmail",
  enrolledCourses: "enrolledCoursesData",
  enrolledCount: "enrolledCount",
  completedCount: "completedCount",
};

const FLASK_CHATBOT_URL = window.APP_ROUTES?.chat || "/chat";

let userData = {
  name: localStorage.getItem(STORAGE_KEYS.userName) || "Swetha",
  email: localStorage.getItem(STORAGE_KEYS.userEmail) || "swetha@gmail.com",
  enrolledCourses: parseInt(localStorage.getItem(STORAGE_KEYS.enrolledCount), 10) || 0,
  completedCourses: parseInt(localStorage.getItem(STORAGE_KEYS.completedCount), 10) || 0,
};

const courses = [
  { title: "Sustainable Living Basics", desc: "Learn eco-friendly habits to reduce waste and energy use.", duration: "2 hrs", img: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
  { title: "Clean Water and Sanitation", desc: "Understand water conservation and safe sanitation systems.", duration: "2.5 hrs", img: "https://cdn-icons-png.flaticon.com/512/6265/6265335.png" },
  { title: "Renewable Energy", desc: "Discover solar, wind, and hydro technologies for a clean future.", duration: "3 hrs", img: "https://cdn-icons-png.flaticon.com/512/8724/8724839.png" },
  { title: "Sustainable Agriculture", desc: "Explore organic farming and smart irrigation practices.", duration: "2 hrs", img: "https://cdn-icons-png.flaticon.com/512/13518/13518370.png" },
  { title: "Smart Cities and Communities", desc: "Learn how cities can become more eco-efficient and livable.", duration: "3 hrs", img: "https://cdn-icons-png.flaticon.com/512/8001/8001987.png" },
  { title: "Climate Action Awareness", desc: "Understand global warming, its effects, and how to act locally.", duration: "3 hrs", img: "https://cdn-icons-png.flaticon.com/512/2072/2072130.png" },
  { title: "Green Entrepreneurship", desc: "Build eco-based business ideas that promote sustainability.", duration: "2 hrs", img: "https://cdn-icons-png.flaticon.com/512/4472/4472974.png" },
  { title: "Waste Management", desc: "Learn how to recycle, upcycle, and manage e-waste effectively.", duration: "1.5 hrs", img: "https://cdn-icons-png.flaticon.com/512/857/857681.png" },
  { title: "Biodiversity and Ecosystems", desc: "Protect nature and understand ecosystem balance.", duration: "2 hrs", img: "https://cdn-icons-png.flaticon.com/512/2913/2913692.png" },
  { title: "Life Below Water", desc: "Learn ocean conservation and marine ecosystem protection.", duration: "2 hrs", img: "https://cdn-icons-png.flaticon.com/512/2098/2098315.png" },
  { title: "Life on Land", desc: "Explore forest preservation and wildlife protection methods.", duration: "2 hrs", img: "https://cdn-icons-png.flaticon.com/512/4350/4350287.png" },
  { title: "Peace, Justice and Institutions", desc: "Learn about fairness, equality, and sustainable governance.", duration: "2 hrs", img: "https://cdn-icons-png.flaticon.com/512/1038/1038152.png" },
  { title: "Green Technology Innovation", desc: "Discover new tools that support clean and smart environments.", duration: "3 hrs", img: "https://cdn-icons-png.flaticon.com/512/3601/3601641.png" },
  { title: "Quality Education for All", desc: "Understand how education drives sustainable societies.", duration: "2 hrs", img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
  { title: "Affordable and Clean Energy", desc: "Learn how energy access and efficiency support development.", duration: "2 hrs", img: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { title: "Green Transportation", desc: "Explore electric mobility and smart transport systems.", duration: "1.5 hrs", img: "https://cdn-icons-png.flaticon.com/512/2620/2620424.png" },
  { title: "Partnerships for Goals", desc: "Collaborate globally for a sustainable planet.", duration: "1.5 hrs", img: "https://cdn-icons-png.flaticon.com/512/2382/2382538.png" },
];

let enrolledCoursesData = loadEnrolledCourses();

function loadEnrolledCourses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.enrolledCourses);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEnrolledCourses() {
  localStorage.setItem(STORAGE_KEYS.enrolledCourses, JSON.stringify(enrolledCoursesData));
}

function updateProfileData() {
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  userData.enrolledCourses = enrolledCoursesData.length;
  userData.completedCourses = enrolledCoursesData.filter((course) => course.progress >= 100).length;

  setText("pName", userData.name);
  setText("pEmail", userData.email);
  setText("pEnroll", userData.enrolledCourses);
  setText("pComplete", userData.completedCourses);

  localStorage.setItem(STORAGE_KEYS.userName, userData.name);
  localStorage.setItem(STORAGE_KEYS.userEmail, userData.email);
  localStorage.setItem(STORAGE_KEYS.enrolledCount, String(userData.enrolledCourses));
  localStorage.setItem(STORAGE_KEYS.completedCount, String(userData.completedCourses));
}

function parseHours(durationText) {
  const hours = parseFloat(String(durationText).replace(/[^0-9.]/g, ""));
  return Number.isFinite(hours) ? hours : 0;
}

function matchesDuration(course, filterValue) {
  const hours = parseHours(course.duration);
  if (filterValue === "short") return hours <= 2;
  if (filterValue === "medium") return hours > 2 && hours <= 3;
  if (filterValue === "long") return hours > 3;
  return true;
}

function isEnrolled(courseTitle) {
  return enrolledCoursesData.some((course) => course.title === courseTitle);
}

function renderCourses() {
  const query = searchInput.value.trim().toLowerCase();
  const filter = durationFilter.value;

  const filtered = courses.filter((course) => {
    const textMatch =
      course.title.toLowerCase().includes(query) ||
      course.desc.toLowerCase().includes(query);
    return textMatch && matchesDuration(course, filter);
  });

  courseList.innerHTML = "";

  if (!filtered.length) {
    courseList.innerHTML = "<p>No courses found for this filter.</p>";
    return;
  }

  filtered.forEach((course) => {
    const div = document.createElement("div");
    div.className = "course-card";

    const enrolled = isEnrolled(course.title);

    div.innerHTML = `
      <img src="${course.img}" alt="${course.title}">
      <h3>${course.title}</h3>
      <p>${course.desc}</p>
      <p><small>Duration: ${course.duration}</small></p>
      <button class="enroll-btn" data-title="${course.title}">${enrolled ? "Enrolled" : "Enroll"}</button>
    `;

    const enrollBtn = div.querySelector(".enroll-btn");
    enrollBtn.disabled = enrolled;
    enrollBtn.addEventListener("click", () => enrollCourse(course));

    courseList.appendChild(div);
  });
}

function renderEnrolledCourses() {
  enrolledList.innerHTML = "";

  if (!enrolledCoursesData.length) {
    enrolledList.innerHTML = "<p>You have not enrolled in any course yet.</p>";
    progressSummary.textContent = "No enrolled courses yet.";
    return;
  }

  const avgProgress = Math.round(
    enrolledCoursesData.reduce((sum, course) => sum + course.progress, 0) / enrolledCoursesData.length
  );

  progressSummary.textContent = `Total: ${enrolledCoursesData.length} | Completed: ${enrolledCoursesData.filter((c) => c.progress >= 100).length} | Avg progress: ${avgProgress}%`;

  enrolledCoursesData.forEach((course) => {
    const card = document.createElement("div");
    card.className = "course-card";

    const completedPill = course.progress >= 100 ? '<div class="complete-pill">Completed</div>' : "";

    card.innerHTML = `
      <img src="${course.img}" alt="${course.title}">
      <h3>${course.title}</h3>
      <button class="start-btn" data-action="start">Start Learning</button>
      <button class="progress-btn" data-action="progress">Mark +25% Progress</button>
      <button class="unenroll-btn" data-action="unenroll">Unenroll</button>
      <div class="progress-wrap">
        <div class="progress-bar"><div class="progress-fill" style="width:${course.progress}%"></div></div>
        <div class="progress-label">Progress: ${course.progress}%</div>
      </div>
      ${completedPill}
    `;

    const startBtn = card.querySelector('[data-action="start"]');
    const progressBtn = card.querySelector('[data-action="progress"]');
    const unenrollBtn = card.querySelector('[data-action="unenroll"]');

    startBtn.addEventListener("click", () => redirectToChatbot(course.title));
    progressBtn.addEventListener("click", () => updateCourseProgress(course.title, 25));
    unenrollBtn.addEventListener("click", () => unenrollCourse(course.title));

    enrolledList.appendChild(card);
  });
}

function enrollCourse(course) {
  if (isEnrolled(course.title)) return;

  enrolledCoursesData.push({
    title: course.title,
    img: course.img,
    progress: 0,
  });

  saveEnrolledCourses();
  updateProfileData();
  renderCourses();
  renderEnrolledCourses();
}

function unenrollCourse(courseTitle) {
  enrolledCoursesData = enrolledCoursesData.filter((course) => course.title !== courseTitle);
  saveEnrolledCourses();
  updateProfileData();
  renderCourses();
  renderEnrolledCourses();
}

function updateCourseProgress(courseTitle, increment) {
  enrolledCoursesData = enrolledCoursesData.map((course) => {
    if (course.title !== courseTitle) return course;
    return {
      ...course,
      progress: Math.min(100, course.progress + increment),
    };
  });

  saveEnrolledCourses();
  updateProfileData();
  renderEnrolledCourses();
}

function redirectToChatbot(courseTitle) {
  const chatbotBaseUrl = FLASK_CHATBOT_URL.replace(/\/+$/, "");

  if (courseTitle) {
    window.location.href = `${chatbotBaseUrl}?course=${encodeURIComponent(courseTitle)}`;
    return;
  }

  window.location.href = chatbotBaseUrl;
}

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => section.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
}

profileBtn.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});

window.addEventListener("click", (event) => {
  if (!event.target.closest(".profile-menu")) dropdownMenu.classList.remove("show");
});

searchInput.addEventListener("input", renderCourses);
durationFilter.addEventListener("change", renderCourses);

renderCourses();
renderEnrolledCourses();
updateProfileData();
