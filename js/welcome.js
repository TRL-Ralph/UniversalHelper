(function () {
  "use strict";

  const SEEN_KEY = "unihelper.welcomeSeen";

  function alreadySeen() {
    try {
      return sessionStorage.getItem(SEEN_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markSeen() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch (e) {}
  }

  if (alreadySeen()) return;

  const STEPS = [
    {
      bubble: "Nice to meet you!",
      eyebrow: "WELCOME",
      title: "Hi, I'm Umi!",
      html: `<p class="welcome-lead noselect">I'll be your guide around <strong>UniHelper</strong>, a friendly corner of the internet made for university students.</p>
         <p class="noselect">Give me a minute and I'll show you what this place is all about. It's quick, I promise.</p>`,
    },
    {
      bubble: "Let me explain!",
      eyebrow: "ABOUT THE WEBSITE",
      title: "What is UniHelper?",
      html: `<p>UniHelper is a mental wellness website for students. It's a safe, judgment-free space where you can read, reflect, connect with other students, and find support whenever school life feels heavy.</p>
         <p>Stressed about deadlines? Feeling low? Just curious about taking better care of yourself? You're in the right place.</p>
         <div class="welcome-pills">
           <span class="welcome-pill welcome-pill--a noselect">Judgment-free</span>
           <span class="welcome-pill welcome-pill--b noselect">Made for university students</span>
           <span class="welcome-pill welcome-pill--c noselect">Gentle &amp; supportive</span>
         </div>`,
    },
    {
      bubble: "Take a look around!",
      eyebrow: "WHAT'S INSIDE",
      title: "Four ways we can help",
      html: `<div class="welcome-tiles">
           <div class="welcome-tile welcome-tile--community noselect"><img class="noselect" src="assets/icons/community.svg" alt=""><div><strong>Community</strong><span>Share your story and read what other students are going through.</span></div></div>
           <div class="welcome-tile welcome-tile--learn noselect"><img class="noselect" src="assets/icons/learn.svg" alt=""><div><strong>Learn</strong><span>Easy articles on stress, self-esteem, relationships and wellness.</span></div></div>
           <div class="welcome-tile welcome-tile--help noselect"><img class="noselect" src="assets/icons/get-help.svg" alt=""><div><strong>Get Help</strong><span>Reach peer support or trusted professional support.</span></div></div>
           <div class="welcome-tile welcome-tile--care noselect"><img class="noselect" src="assets/icons/mental-wellness.svg" alt=""><div><strong>Mental Wellness</strong><span>Guided exercises and a private journal to reset your mind.</span></div></div>
         </div>`,
    },
    {
      bubble: "I'm rooting for you!",
      eyebrow: "BEFORE YOU GO",
      title: "Because you matter.",
      html: `<p>On the Home page, tell me how you're feeling today and I'll point you to something that might help.</p>
         <p class="welcome-careful">UniHelper is a support space, not a replacement for professional care. If things feel too heavy, please reach out to the Guidance Office or someone you trust.</p>
         <p class="welcome-proto">This is a prototype, so a few features are still under construction.</p>`,
    },
  ];

  const overlay = document.createElement("div");
  overlay.className = "welcome-backdrop";
  overlay.id = "welcomeModal";
  overlay.innerHTML = `<div class="welcome-box noselect" role="dialog" aria-modal="true" aria-labelledby="welcomeTitle">
       <aside class="welcome-side" aria-hidden="true">
         <span class="welcome-orb welcome-orb--1 noselect"></span>
         <span class="welcome-orb welcome-orb--2 noselect"></span>
         <span class="welcome-orb welcome-orb--3 noselect"></span>
         <span class="welcome-spark welcome-spark--1 noselect"></span>
         <span class="welcome-spark welcome-spark--2 noselect"></span>
         <span class="welcome-spark welcome-spark--3 noselect"></span>
         <div class="welcome-bubble" id="welcomeBubble"></div>
         <img class="welcome-umi noselect" src="assets/images/umi-banner.png" alt="">
       </aside>
       <section class="welcome-main">
         <button class="welcome-close" type="button" aria-label="Close">&times;</button>
         <div class="welcome-step" id="welcomeStep" aria-live="polite">
           <p class="welcome-eyebrow" id="welcomeEyebrow"></p>
           <h2 id="welcomeTitle"></h2>
           <div class="welcome-body" id="welcomeBody"></div>
         </div>
         <footer class="welcome-foot">
           <div class="welcome-dots" id="welcomeDots"></div>
           <div class="welcome-nav">
             <button class="welcome-btn welcome-btn--ghost" id="welcomeBack" type="button">Back</button>
             <button class="welcome-btn welcome-btn--main" id="welcomeNext" type="button">Next</button>
           </div>
         </footer>
       </section>
     </div>`;

  const box = overlay.querySelector(".welcome-box");
  const stepEl = overlay.querySelector("#welcomeStep");
  const eyebrowEl = overlay.querySelector("#welcomeEyebrow");
  const titleEl = overlay.querySelector("#welcomeTitle");
  const bodyEl = overlay.querySelector("#welcomeBody");
  const bubbleEl = overlay.querySelector("#welcomeBubble");
  const dotsEl = overlay.querySelector("#welcomeDots");
  const backBtn = overlay.querySelector("#welcomeBack");
  const nextBtn = overlay.querySelector("#welcomeNext");
  const closeBtn = overlay.querySelector(".welcome-close");
  let current = 0;
  let previousOverflow = "";

  STEPS.forEach(function (step, index) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "welcome-dot";
    dot.setAttribute(
      "aria-label",
      "Go to step " + (index + 1) + " of " + STEPS.length,
    );
    dot.addEventListener("click", function () {
      show(index);
    });
    dotsEl.appendChild(dot);
  });

  function show(index) {
    let direction = index >= current ? "welcome-from-right" : "welcome-from-left";
    current = index;
    const step = STEPS[index];

    eyebrowEl.textContent = step.eyebrow;
    titleEl.textContent = step.title;
    bodyEl.innerHTML = step.html;
    bubbleEl.textContent = step.bubble;

    stepEl.classList.remove("welcome-from-right", "welcome-from-left");
    void stepEl.offsetWidth;
    stepEl.classList.add(direction);

    bubbleEl.classList.remove("pop");
    void bubbleEl.offsetWidth;
    bubbleEl.classList.add("pop");

    Array.prototype.forEach.call(dotsEl.children, function (dot, i) {
      dot.classList.toggle("active", i === index);
      dot.classList.toggle("done", i < index);
      if (i === index) dot.setAttribute("aria-current", "step");
      else dot.removeAttribute("aria-current");
    });

    backBtn.style.visibility = index === 0 ? "hidden" : "visible";
    nextBtn.textContent = index === STEPS.length - 1 ? "Let's go!" : "Next";
  }

  function next() {
    if (current < STEPS.length - 1) show(current + 1);
    else close();
  }

  function back() {
    if (current > 0) show(current - 1);
  }

  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = previousOverflow;
    markSeen();
    document.removeEventListener("keydown", onKey, true);
  }

  function onKey(event) {
    if (event.key === "Escape") {
      event.stopPropagation(); // Escape must not dismiss the welcome popup
    } else if (event.key === "ArrowRight") {
      next();
    } else if (event.key === "ArrowLeft") {
      back();
    } else if (event.key === "Tab") {
      const focusable = Array.prototype.filter.call(
        box.querySelectorAll("button"),
        function (el) {
          return el.style.visibility !== "hidden";
        },
      );
      const index = focusable.indexOf(document.activeElement);
      let target = event.shiftKey ? index - 1 : index + 1;
      if (target < 0) target = focusable.length - 1;
      if (target >= focusable.length) target = 0;
      event.preventDefault();
      focusable[target].focus();
    }
  }

  nextBtn.addEventListener("click", next);
  backBtn.addEventListener("click", back);
  closeBtn.addEventListener("click", close);
  document.body.appendChild(overlay);
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  show(0);
  overlay.classList.add("open");
  nextBtn.focus();
  document.addEventListener("keydown", onKey, true);
})();

