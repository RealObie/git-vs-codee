// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ---------- Theme (dark / light) ----------
const root = document.documentElement;
try {
  const saved = localStorage.getItem("mb-theme");
  if (saved) root.dataset.theme = saved;
} catch (e) {}
$("#themeBtn").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("mb-theme", next); } catch (e) {}
});

// ---------- Mobile menu & dropdowns ----------
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
$$(".dropdown-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dd = btn.parentElement;
    const open = dd.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
});
$$(".nav-links a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ---------- Hero carousel ----------
const slides = $$(".slide");
const dotsBox = $("#dots");
let current = 0;
let timer;

slides.forEach((_, i) => {
  const d = document.createElement("button");
  d.className = "dot" + (i === 0 ? " active" : "");
  d.setAttribute("aria-label", "Go to slide " + (i + 1));
  d.addEventListener("click", () => { show(i); restart(); });
  dotsBox.appendChild(d);
});
const dots = $$(".dot");

function show(n) {
  current = (n + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
  dots.forEach((d, i) => d.classList.toggle("active", i === current));
}
function restart() {
  clearInterval(timer);
  timer = setInterval(() => show(current + 1), 5500);
}
$("#nextBtn").addEventListener("click", () => { show(current + 1); restart(); });
$("#prevBtn").addEventListener("click", () => { show(current - 1); restart(); });
$("#home").addEventListener("mouseenter", () => clearInterval(timer));
$("#home").addEventListener("mouseleave", restart);
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { show(current + 1); restart(); }
  if (e.key === "ArrowLeft") { show(current - 1); restart(); }
});
restart();

// ---------- Count-up statistics ----------
const counters = $$("[data-count]");
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach((c) => countObserver.observe(c));

// ---------- Search + category filter ----------
const cards = $$(".card");
const emptyMsg = $("#emptyMsg");
let category = "all";

function applyFilters() {
  const q = $("#searchInput").value.trim().toLowerCase();
  let shown = 0;
  cards.forEach((card) => {
    const matchCat = category === "all" || card.dataset.cat === category;
    const matchText = !q || card.textContent.toLowerCase().includes(q);
    card.hidden = !(matchCat && matchText);
    if (!card.hidden) shown++;
  });
  emptyMsg.hidden = shown > 0;
  $("#searchResult").textContent = q ? shown + " result" + (shown === 1 ? "" : "s") + ' for "' + q + '"' : "";
}
$$(".chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    $$(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    category = chip.dataset.filter;
    applyFilters();
  })
);
$("#searchBtn").addEventListener("click", () => {
  const panel = $("#searchPanel");
  const open = panel.classList.toggle("open");
  if (open) $("#searchInput").focus();
});
$("#searchInput").addEventListener("input", () => {
  applyFilters();
  if ($("#searchInput").value) $("#services").scrollIntoView({ behavior: "smooth" });
});

// ---------- Language button (demo) ----------
let lang = "EN";
$("#langBtn").addEventListener("click", () => {
  lang = lang === "EN" ? "SW" : "EN";
  $("#langBtn").setAttribute("title", "Language: " + lang);
  alert(lang === "SW" ? "Karibu MediBloom! (demo: Swahili selected)" : "Welcome to MediBloom! (English selected)");
});

// ---------- Copy promo code ----------
$("#copyCode").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  try { await navigator.clipboard.writeText("BLOOM15"); btn.textContent = "Copied!"; }
  catch (err) { btn.textContent = "Code: BLOOM15"; }
  setTimeout(() => (btn.textContent = "Copy code"), 2000);
});

// ---------- Contact form validation ----------
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [$("#name"), $("#email"), $("#message")];
  const msg = $("#formMsg");
  let ok = true;
  fields.forEach((f) => {
    const valid = f.value.trim() !== "" && (f.type !== "email" || /^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  msg.className = "form-msg " + (ok ? "ok" : "err");
  msg.textContent = ok
    ? "Thank you, " + $("#name").value.trim() + ". We will reply within one working day."
    : "Please fill in your name, a valid email and a message.";
  if (ok) e.target.reset();
});

// ---------- Highlight active nav link while scrolling ----------
const sections = ["home", "services", "contact"].map((id) => document.getElementById(id));
window.addEventListener("scroll", () => {
  const y = window.scrollY + 160;
  let activeId = "home";
  sections.forEach((s) => { if (s && s.offsetTop <= y) activeId = s.id; });
  $$(".nav-links > a").forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + activeId)
  );
}, { passive: true });

console.log("MediBloom Pharmacy website loaded successfully.");