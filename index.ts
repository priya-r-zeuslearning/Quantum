interface Course {
  expired?: boolean;
  favorite?: boolean;
  classes: string[];
  activeIcons?: boolean;
  image: string;
  title: string;
  subject: string;
  grade: number | string;
  addgrade?: string;
  units?: number | null;
  lessons?: number | null;
  topics?: number | null;
  students?: number | null;
  dates?: string | null;
}
fetch("data/courses.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data: Course | Course[]) => {
    // Normalize data to always be an array
    const courses: Course[] = Array.isArray(data) ? data : [data];
    renderCourses(courses);
  })
  .catch((error) => {
    console.error("Failed to fetch courses:", error);
  });

function renderCourses(courses: Course[]) {
  const container = document.querySelector(".card-container");
  if (!container) return;

  container.innerHTML = "";

  courses.forEach((course, index) => {
    // Use <article> for each course card for semantics
    const card = document.createElement("div");;
    card.classList.add("card");
    card.setAttribute("tabindex", "0"); // Make card focusable
    card.setAttribute("aria-label", `Course: ${course.title}, Subject: ${course.subject}, Grade: ${course.grade}${course.addgrade ? ", " + course.addgrade : ""}`);

    if (course.expired) {
      const expiredTag = document.createElement("div");
      expiredTag.classList.add("card-expired");
      expiredTag.setAttribute("role", "status");
      expiredTag.textContent = "Expired";
      card.appendChild(expiredTag);
    }

    // Favorite icon with aria-label for screen readers
    const favorite = course.favorite
      ? `<img src="images/favourite.svg" alt="Marked as Favorite" role="img" tabindex=0/>`
      : `<img src="images/favourite.svg" alt="Not marked as Favorite" role="img" id="not-active" tabindex=0 />`;

    // Make sure select IDs are unique (avoid duplicate IDs)
    const selectId = `class-select`;
    const classOptions = course.classes
      .map((cls) => `<option>${cls}</option>`)
      .join("");

    const selectHTML = course.classes.indexOf("No Classes") != -1
      ? `<select id="${selectId}" disabled  aria-label="Class selection disabled">${classOptions}</select>`
      : `
         <select id="${selectId}" tabindex=0 aria-label="Select class">${classOptions}</select>`;

    // Icons as buttons for keyboard accessibility with aria-labels
    const icons = `
      <button type="button" aria-label="Preview course"><img src="images/preview.svg" alt="" /></button>
      <button type="button" aria-label="Manage course" ${!course.activeIcons ? 'disabled aria-disabled="true"' : ""}>
        <img src="images/manage course.svg" alt="" ${!course.activeIcons ? 'id="not-active-icon"' : ""} />
      </button>
      <button type="button" aria-label="Grade submissions" ${!course.activeIcons ? 'disabled aria-disabled="true"' : ""}>
        <img src="images/grade submissions.svg" alt="" ${!course.activeIcons ? 'id="not-active-icon"' : ""} />
      </button>
      <button type="button" aria-label="View reports"><img src="images/reports.svg" alt="" /></button>
    `;

    card.innerHTML += `
      <div class="card-content">
        <div class="card-image">
          <img src="${course.image}" alt="${course.title} image" />
        </div>
        <div class="card-text">
          <header class="card-heading">
            <h2 class="heading-text">${course.title}</h2>
            <div class="favorite">${favorite}</div>
          </header>
          <section class="subject-details" aria-label="Subject and grade">
            <span class="subject">${course.subject}</span>
            <span aria-hidden="true">|</span>
            <span class="grade">Grade <span class="gradenum">${course.grade} <span class="addgrade">${course.addgrade ?? ""}</span></span></span>
          </section>
          <section class="topic-details" aria-label="Course content details">
            <div class="text-details">
              ${course.units != null ? `<div class="units">${course.units}<span>Units</span></div>` : ""}
              ${course.lessons != null ? `<div class="lessons">${course.lessons}<span>Lessons</span></div>` : ""}
              ${course.topics != null ? `<div class="topics">${course.topics}<span>Topics</span></div>` : ""}
            </div>
            ${selectHTML}
          </section>
          <section class="details" aria-label="Student and date information">
            ${course.students != null ? `<div class="students">${course.students} students</div>` : ""}
            ${course.dates ? `<span aria-hidden="true">|</span><div class="dates"><div class="start">${course.dates}</div></div>` : ""}
          </section>
        </div>
      </div>
      <div class="card-icons" role="group" aria-label="Course action buttons">
        ${icons}
      </div>
    `;

    container.appendChild(card);
  });
}
const hamburgerBtn = document.getElementById("hamburger-btn") as HTMLElement;
const hamburgerMenu = document.getElementById("hamburger-menu") as HTMLElement;

if (hamburgerBtn && hamburgerMenu) {
  const showMenu = () => {
    hamburgerMenu.classList.add("show");
    hamburgerMenu.setAttribute("aria-hidden", "false");
    hamburgerBtn.setAttribute("aria-expanded", "true");
  };

  const hideMenu = () => {
    hamburgerMenu.classList.remove("show");
    hamburgerMenu.setAttribute("aria-hidden", "true");
    hamburgerBtn.setAttribute("aria-expanded", "false");
  };

  hamburgerBtn.addEventListener("focus", showMenu);
  hamburgerBtn.addEventListener("blur", hideMenu);


  hamburgerBtn.querySelector("img")?.addEventListener("focus", showMenu);
}

const wrappers = document.querySelectorAll<HTMLElement>(".alert-wrapper, .announcement-wrapper, .hamburger-wrapper");

wrappers.forEach((wrapper) => {
  const preview = wrapper.querySelector<HTMLElement>(
    ".alert-preview, .announcement-preview, .ham-menu"
  );

  const baseIcons = wrapper.querySelectorAll<HTMLElement>(".base1, .base2, .hamburger-menu");
  const alertBubbles = wrapper.querySelectorAll<HTMLElement>(".alert");

  const showPreview = () => {
    if (preview) {
      preview.classList.add("show");
      preview.setAttribute("aria-hidden", "false");
    }
    wrapper.setAttribute("aria-expanded", "true");

    baseIcons.forEach((icon) => icon.classList.add("white-icon"));
    alertBubbles.forEach((bubble) => (bubble.style.display = "none"));
  };

  const hidePreview = () => {
    if (preview) {
      preview.classList.remove("show");
      preview.setAttribute("aria-hidden", "true");
    }
    wrapper.setAttribute("aria-expanded", "false");

    baseIcons.forEach((icon) => icon.classList.remove("white-icon"));
    alertBubbles.forEach((bubble) => (bubble.style.display = "flex"));
  };

  wrapper.addEventListener("mouseenter", showPreview);
  wrapper.addEventListener("mouseleave", hidePreview);


  wrapper.addEventListener("focus", showPreview);
  wrapper.addEventListener("blur", hidePreview);

  // Toggle on Enter or Space
  wrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!preview) return;

      const isExpanded = preview.classList.contains("show");
      if (isExpanded) {
        hidePreview();
      } else {
        showPreview();
      }
    }
  });
});

