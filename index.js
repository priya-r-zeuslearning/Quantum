var _a;
fetch("data/courses.json")
    .then(function (response) {
    if (!response.ok) {
        throw new Error("HTTP error! Status: ".concat(response.status));
    }
    return response.json();
})
    .then(function (data) {
    // Normalize data to always be an array
    var courses = Array.isArray(data) ? data : [data];
    renderCourses(courses);
})
    .catch(function (error) {
    console.error("Failed to fetch courses:", error);
});
function renderCourses(courses) {
    var container = document.querySelector(".card-container");
    if (!container)
        return;
    container.innerHTML = "";
    courses.forEach(function (course, index) {
        var _a;
        // Use <article> for each course card for semantics
        var card = document.createElement("div");
        ;
        card.classList.add("card");
        card.setAttribute("tabindex", "0"); // Make card focusable
        card.setAttribute("aria-label", "Course: ".concat(course.title, ", Subject: ").concat(course.subject, ", Grade: ").concat(course.grade).concat(course.addgrade ? ", " + course.addgrade : ""));
        if (course.expired) {
            var expiredTag = document.createElement("div");
            expiredTag.classList.add("card-expired");
            expiredTag.setAttribute("role", "status");
            expiredTag.textContent = "Expired";
            card.appendChild(expiredTag);
        }
        // Favorite icon with aria-label for screen readers
        var favorite = course.favorite
            ? "<img src=\"images/favourite.svg\" alt=\"Marked as Favorite\" role=\"img\" tabindex=0/>"
            : "<img src=\"images/favourite.svg\" alt=\"Not marked as Favorite\" role=\"img\" id=\"not-active\" tabindex=0 />";
        // Make sure select IDs are unique (avoid duplicate IDs)
        var selectId = "class-select";
        var classOptions = course.classes
            .map(function (cls) { return "<option>".concat(cls, "</option>"); })
            .join("");
        var selectHTML = course.classes.indexOf("No Classes") != -1
            ? "<select id=\"".concat(selectId, "\" disabled  aria-label=\"Class selection disabled\">").concat(classOptions, "</select>")
            : "\n         <select id=\"".concat(selectId, "\" tabindex=0 aria-label=\"Select class\">").concat(classOptions, "</select>");
        // Icons as buttons for keyboard accessibility with aria-labels
        var icons = "\n      <button type=\"button\" aria-label=\"Preview course\"><img src=\"images/preview.svg\" alt=\"\" /></button>\n      <button type=\"button\" aria-label=\"Manage course\" ".concat(!course.activeIcons ? 'disabled aria-disabled="true"' : "", ">\n        <img src=\"images/manage course.svg\" alt=\"\" ").concat(!course.activeIcons ? 'id="not-active-icon"' : "", " />\n      </button>\n      <button type=\"button\" aria-label=\"Grade submissions\" ").concat(!course.activeIcons ? 'disabled aria-disabled="true"' : "", ">\n        <img src=\"images/grade submissions.svg\" alt=\"\" ").concat(!course.activeIcons ? 'id="not-active-icon"' : "", " />\n      </button>\n      <button type=\"button\" aria-label=\"View reports\"><img src=\"images/reports.svg\" alt=\"\" /></button>\n    ");
        card.innerHTML += "\n      <div class=\"card-content\">\n        <div class=\"card-image\">\n          <img src=\"".concat(course.image, "\" alt=\"").concat(course.title, " image\" />\n        </div>\n        <div class=\"card-text\">\n          <header class=\"card-heading\">\n            <h2 class=\"heading-text\">").concat(course.title, "</h2>\n            <div class=\"favorite\">").concat(favorite, "</div>\n          </header>\n          <section class=\"subject-details\" aria-label=\"Subject and grade\">\n            <span class=\"subject\">").concat(course.subject, "</span>\n            <span aria-hidden=\"true\">|</span>\n            <span class=\"grade\">Grade <span class=\"gradenum\">").concat(course.grade, " <span class=\"addgrade\">").concat((_a = course.addgrade) !== null && _a !== void 0 ? _a : "", "</span></span></span>\n          </section>\n          <section class=\"topic-details\" aria-label=\"Course content details\">\n            <div class=\"text-details\">\n              ").concat(course.units != null ? "<div class=\"units\">".concat(course.units, "<span>Units</span></div>") : "", "\n              ").concat(course.lessons != null ? "<div class=\"lessons\">".concat(course.lessons, "<span>Lessons</span></div>") : "", "\n              ").concat(course.topics != null ? "<div class=\"topics\">".concat(course.topics, "<span>Topics</span></div>") : "", "\n            </div>\n            ").concat(selectHTML, "\n          </section>\n          <section class=\"details\" aria-label=\"Student and date information\">\n            ").concat(course.students != null ? "<div class=\"students\">".concat(course.students, " students</div>") : "", "\n            ").concat(course.dates ? "<span aria-hidden=\"true\">|</span><div class=\"dates\"><div class=\"start\">".concat(course.dates, "</div></div>") : "", "\n          </section>\n        </div>\n      </div>\n      <div class=\"card-icons\" role=\"group\" aria-label=\"Course action buttons\">\n        ").concat(icons, "\n      </div>\n    ");
        container.appendChild(card);
    });
}
var hamburgerBtn = document.getElementById("hamburger-btn");
var hamburgerMenu = document.getElementById("hamburger-menu");
if (hamburgerBtn && hamburgerMenu) {
    var showMenu = function () {
        hamburgerMenu.classList.add("show");
        hamburgerMenu.setAttribute("aria-hidden", "false");
        hamburgerBtn.setAttribute("aria-expanded", "true");
    };
    var hideMenu = function () {
        hamburgerMenu.classList.remove("show");
        hamburgerMenu.setAttribute("aria-hidden", "true");
        hamburgerBtn.setAttribute("aria-expanded", "false");
    };
    hamburgerBtn.addEventListener("focus", showMenu);
    hamburgerBtn.addEventListener("blur", hideMenu);
    (_a = hamburgerBtn.querySelector("img")) === null || _a === void 0 ? void 0 : _a.addEventListener("focus", showMenu);
}
var wrappers = document.querySelectorAll(".alert-wrapper, .announcement-wrapper, .hamburger-wrapper");
wrappers.forEach(function (wrapper) {
    var preview = wrapper.querySelector(".alert-preview, .announcement-preview, .ham-menu");
    var baseIcons = wrapper.querySelectorAll(".base1, .base2, .hamburger-menu");
    var alertBubbles = wrapper.querySelectorAll(".alert");
    var showPreview = function () {
        if (preview) {
            preview.classList.add("show");
            preview.setAttribute("aria-hidden", "false");
        }
        wrapper.setAttribute("aria-expanded", "true");
        baseIcons.forEach(function (icon) { return icon.classList.add("white-icon"); });
        alertBubbles.forEach(function (bubble) { return (bubble.style.display = "none"); });
    };
    var hidePreview = function () {
        if (preview) {
            preview.classList.remove("show");
            preview.setAttribute("aria-hidden", "true");
        }
        wrapper.setAttribute("aria-expanded", "false");
        baseIcons.forEach(function (icon) { return icon.classList.remove("white-icon"); });
        alertBubbles.forEach(function (bubble) { return (bubble.style.display = "flex"); });
    };
    wrapper.addEventListener("mouseenter", showPreview);
    wrapper.addEventListener("mouseleave", hidePreview);
    wrapper.addEventListener("focus", showPreview);
    wrapper.addEventListener("blur", hidePreview);
    // Toggle on Enter or Space
    wrapper.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!preview)
                return;
            var isExpanded = preview.classList.contains("show");
            if (isExpanded) {
                hidePreview();
            }
            else {
                showPreview();
            }
        }
    });
});
