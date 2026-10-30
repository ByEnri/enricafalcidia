/* Enrica Falcidia — site behaviour. Content lives in content.js */
(function () {
  const S = window.SITE, Z = window.SIZES || {};
  const page = document.body.dataset.page || (document.querySelector("main") || {}).dataset?.page;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");
  // cursor from the library (hotspot = the point that clicks)
  const CUR = { "freccia-1": [4, 2], "freccia-2": [5, 3], "fiore": [16, 16], "dischetto": [16, 16], "stella": [9, 4], "brillo": [16, 16] };
  const cname = CUR[S.cursor] ? S.cursor : "freccia-2", [hx, hy] = CUR[cname];
  const cbase = new URL(`img/cursors/${cname}/cursor`, document.baseURI).href;
  document.documentElement.style.setProperty("--cur",
    `image-set(url("${cbase}.png") 1x, url("${cbase}@2x.png") 2x) ${hx} ${hy}`);
  // fairy-dust trail: a soft streak of light that follows the mouse, with fine glitter, fading away
  if (S.trail !== false && !reduce && matchMedia("(pointer: fine)").matches) {
    const cv = document.createElement("canvas"); cv.className = "sparkle-trail"; cv.setAttribute("aria-hidden", "true");
    document.body.appendChild(cv);
    const cx = cv.getContext("2d"), dpr = 1;
    const fit = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    fit(); addEventListener("resize", fit);
    const LIFE = 150, tints = ["255,255,255", "240,242,250", "255,230,246", "226,242,255", "236,255,244"];
    let pts = [], dust = [], running = false;
    const tick = () => {
      const now = performance.now();
      cx.clearRect(0, 0, innerWidth, innerHeight);
      pts = pts.filter((p) => now - p.t < LIFE);
      // the streak: tapered, glowing, fading toward the tail
      cx.lineCap = "round"; cx.lineJoin = "round";
      cx.globalCompositeOperation = "lighter";
      for (let pass = 0; pass < 2; pass++) {   // soft halo, then bright core
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i], k = 1 - (now - b.t) / LIFE;
          cx.strokeStyle = pass ? `rgba(255,255,255,${0.55 * k * k})` : `rgba(215,225,255,${0.14 * k * k})`;
          cx.lineWidth = pass ? 0.5 + 1.6 * k : 2 + 6 * k;
          cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
        }
      }
      cx.globalCompositeOperation = "source-over";
      cx.shadowBlur = 0;
      // glitter: tiny specks that twinkle and drift down
      dust = dust.filter((d) => (d.life -= d.decay) > 0);
      dust.forEach((d) => {
        d.x += d.vx; d.y += d.vy;
        const tw = 0.55 + 0.45 * Math.sin(d.life * 40 + d.ph);
        cx.fillStyle = `rgba(${d.c},${d.life * tw})`;
        cx.beginPath(); cx.arc(d.x, d.y, d.r * (0.5 + d.life * 0.5), 0, Math.PI * 2); cx.fill();
      });
      if (pts.length || dust.length) requestAnimationFrame(tick); else running = false;
    };
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const x = e.clientX, y = e.clientY, last = pts[pts.length - 1];
      pts.push({ x, y, t: performance.now() });
      const dist = last ? Math.hypot(x - last.x, y - last.y) : 0;
      const n = Math.min(6, Math.round(dist / 6) + (Math.random() < 0.4 ? 1 : 0));
      for (let i = 0; i < n; i++) {
        const f = Math.random();
        dust.push({ x: (last ? last.x + (x - last.x) * f : x) + (Math.random() - 0.5) * 7, y: (last ? last.y + (y - last.y) * f : y) + (Math.random() - 0.5) * 7,
          vx: (Math.random() - 0.5) * 0.35, vy: Math.random() * 0.35 + 0.08, r: Math.random() * 1.1 + 0.45,
          life: 1, decay: Math.random() * 0.02 + 0.022, ph: Math.random() * 6, c: tints[(Math.random() * tints.length) | 0] });
      }
      if (dust.length > 90) dust.splice(0, dust.length - 90);
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
  }
  if (!CSS.supports("cursor", `image-set(url("${cbase}.png") 1x) 1 1, auto`))
    document.documentElement.style.setProperty("--cur", `url("${cbase}.png") ${hx} ${hy}`);
  // always open a page at the top (unless a #section was asked for)
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const toTop = () => { if (!location.hash) window.scrollTo(0, 0); };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const img = (key, alt = "", sizes = "100vw", cls = "", eager = false) => {
    const [w, h] = Z[key] || [1600, 1000];
    return `<img src="img/${key}.webp" srcset="img/${key}-s.webp 800w, img/${key}.webp 1800w" sizes="${sizes}"
      width="${w}" height="${h}" alt="${esc(alt)}" class="${cls}" ${eager ? "" : 'loading="lazy"'} decoding="async">`;
  };
  const contacts = (noMail) => `<div class="contacts">${S.contacts.filter((c) => !(noMail && c.href.startsWith("mailto"))).map((c) =>
    `<a href="${esc(c.href)}" ${c.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(c.label)}</a>`).join("")}</div>`;

  // click a photo to see it big, in full quality (only on click); arrows/swipe go through the others on the page
  const zoomable = (pics) => {
    if (!pics.length) return;
    {
      const lb = document.createElement("div");
      lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo viewer");
      lb.innerHTML = `<div class="bar"><span class="count"></span><button class="lb-close">close</button></div><figure><img alt=""></figure>
        <div class="arrows"><button data-d="-1" aria-label="Previous photo">\u2190</button><button data-d="1" aria-label="Next photo">\u2192</button></div>`;
      document.body.appendChild(lb);
      const big = lb.querySelector("img"), cnt = lb.querySelector(".count");
      const full = (el) => (el.getAttribute("src") || "").replace(/-s\.webp$/, ".webp");
      let at = 0, last = null;
      const render = () => { big.src = full(pics[at]); big.alt = pics[at].alt; cnt.textContent = `${at + 1}/${pics.length}`; };
      const open = (i) => { at = i; render(); lb.classList.add("open"); document.body.style.overflow = "hidden"; lb.querySelector(".lb-close").focus(); };
      const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; last && last.focus(); };
      const go = (d) => { at = (at + d + pics.length) % pics.length; render(); };
      pics.forEach((el, i) => { el.classList.add("zoomable"); el.tabIndex = 0;
        el.addEventListener("click", () => { last = el; open(i); });
        el.addEventListener("keydown", (e) => { if (e.key === "Enter") { last = el; open(i); } }); });
      lb.querySelector(".lb-close").onclick = close;
      lb.querySelectorAll(".arrows button").forEach((b) => (b.onclick = () => go(+b.dataset.d)));
      lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "FIGURE") close(); });
      document.addEventListener("keydown", (e) => { if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") close(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); });
      let x0 = null;
      lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
      lb.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); x0 = null; });
    }
  };

  /* ---------- header, mobile menu, footer ---------- */
  const links = [["work.html", "work", "work"], ["photo.html", "photo & video", "photo"], ["visuals.html", "visuals", "visuals"], ["about.html", "about", "about"]];
  const navHtml = links.map(([href, label, id]) => `<a href="${href}" ${id === page ? 'aria-current="page"' : ""}>${label}</a>`).join("");
  document.body.insertAdjacentHTML("afterbegin", `
    <header class="site-header">
      <a class="wordmark" href="index.html">${esc(S.name)}</a>
      <nav class="nav" aria-label="Main">${navHtml}</nav>
      <button class="menu-btn" aria-expanded="false" aria-controls="mmenu">menu</button>
    </header>
    <div class="mobile-menu" id="mmenu" aria-hidden="true">
      <button class="close">close</button>
      <a href="index.html">home</a>${navHtml}
      ${contacts()}
    </div>`);
  const mm = document.getElementById("mmenu"), mb = document.querySelector(".menu-btn");
  const setMenu = (open) => { mm.classList.toggle("open", open); mb.setAttribute("aria-expanded", open); mm.setAttribute("aria-hidden", !open); document.body.style.overflow = open ? "hidden" : ""; };
  mb.onclick = () => setMenu(true);
  mm.querySelector(".close").onclick = () => setMenu(false);
  mm.querySelectorAll("a").forEach((a) => (a.onclick = () => setMenu(false)));

  const footer = () => `
    <footer class="site-footer">
      <div class="row"><a class="footer-mail" href="mailto:${esc(S.email)}">${esc(S.email)}</a>${contacts(true)}<small>© ${new Date().getFullYear()} ${esc(S.name)}, Madrid</small></div>
    </footer>`;

  const main = document.querySelector("main");

  /* ---------- HOME: one screen, no scroll ----------
     SITE.home = "torch" (full-screen photo in the dark, the mouse is a light, the name in negative)
               | "classic" (the first version: photo in the middle that flashes behind the name) */
  if (page === "home") {
    document.body.classList.add("is-home");
    const torch = S.home !== "classic";
    const label = (k) => {
      const p = S.projects.find((p) => p.cover === k || p.hero === k || p.blocks.some((b) => b.img === k || (b.imgs || []).includes(k)));
      if (p) return p.title;
      const v = S.visuals.find((v) => v.img === k || (v.imgs || []).includes(k)); if (v) return v.title;
      const ph = S.photo.find((s) => (s.chapters || []).some((c) => c.imgs.includes(k)) || (s.imgs || []).includes(k)); return ph ? ph.title : "";
    };
    main.innerHTML = torch ? `
      <section class="hero hero-torch" aria-label="Intro">
        <div class="flash-stage full" aria-hidden="true">${S.flash.map((k, i) => {
          const [w, h] = Z[k] || [3000, 2000];
          return `<img src="img/${k}-xl.webp" srcset="img/${k}.webp 1800w, img/${k}-xl.webp ${w > 2800 ? 2800 : w}w" sizes="100vw"
            alt="" width="${w}" height="${h}" ${i < 2 ? "" : 'loading="lazy"'} decoding="async">`; }).join("")}</div>
        <div class="torch-dark" aria-hidden="true"></div>
        <div class="flash-burst" aria-hidden="true"></div>
        <h1 class="display hero-name">Enrica<br>Falcidia</h1>
        <div class="hero-foot"><p>${esc(S.tagline)}</p>${contacts()}</div>
      </section>` : `
      <section class="hero" aria-label="Intro">
        <div class="flash-stage" aria-hidden="true">${S.flash.map((k, i) => img(k, "", "70vw", "", i < 2)).join("")}</div>
        <h1 class="display hero-name">Enrica<br>Falcidia</h1>
        <div class="hero-foot"><p>${esc(S.tagline)}</p>${contacts()}</div>
      </section>`;

    const frames = [...document.querySelectorAll(".flash-stage img")];
    const hero = document.querySelector(".hero"), cap = document.querySelector(".hero-cap");
    const burst = document.querySelector(".flash-burst");
    let i = 0;
    const show = () => {
      const n = i % frames.length;
      frames.forEach((f, j) => f.classList.toggle("on", j === n));
      if (cap) cap.textContent = `${String(n + 1).padStart(2, "0")} — ${label(S.flash[n])}`;
      if (torch) { hero.classList.remove("lit"); void hero.offsetWidth; hero.classList.add("lit");
        burst.classList.remove("go"); void burst.offsetWidth; burst.classList.add("go"); }
      i++;
    };
    if (reduce) { frames[0].classList.add("on"); if (torch) hero.classList.add("still"); if (cap) cap.textContent = `01 — ${label(S.flash[0])}`; }
    else { show(); setInterval(show, torch ? 4200 : 2300); }

    // the light follows the mouse; on touch screens it drifts on its own
    if (torch) {
      let tx = innerWidth * 0.5, ty = innerHeight * 0.45, x = tx, y = ty, moved = false;
      addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") { tx = e.clientX; ty = e.clientY; moved = true; } }, { passive: true });
      const loop = (ts) => {
        if (!moved) { tx = innerWidth * (0.5 + 0.28 * Math.sin(ts / 2600)); ty = innerHeight * (0.48 + 0.2 * Math.sin(ts / 1900)); }
        x += (tx - x) * 0.16; y += (ty - y) * 0.16;
        hero.style.setProperty("--mx", `${x}px`); hero.style.setProperty("--my", `${y}px`);
        requestAnimationFrame(loop);
      };
      if (!reduce) requestAnimationFrame(loop);
    }
  }

  /* ---------- WORK (project index) ---------- */
  if (page === "work") {
    main.innerHTML = `
      <section class="work" aria-labelledby="work-t">
        <div class="work-bg" aria-hidden="true">${S.projects.filter((p) => p.cover).map((p) => img(p.cover, "", "100vw")).join("")}</div>
        <h1 class="display dvd work-title" id="work-t">Work</h1>
        <ul class="work-list">${S.projects.map((p) => `
          <li><a class="work-row" href="project.html?p=${p.slug}" data-cover="${p.cover || ""}">
            ${p.cover ? img(p.cover, p.title, "100vw", "thumb") : ""}
            <span class="display">${esc(p.title)}</span>
            <span class="kind">${esc(p.kind)}</span>
          </a></li>`).join("")}
        </ul>
      </section>${footer()}`;

    // hover covers behind the list (desktop)
    const bgs = [...document.querySelectorAll(".work-bg img")];
    const covers = S.projects.filter((p) => p.cover).map((p) => p.cover);
    document.querySelectorAll(".work-row").forEach((row) => {
      const on = () => bgs.forEach((b, j) => b.classList.toggle("on", covers[j] === row.dataset.cover));
      row.addEventListener("mouseenter", on); row.addEventListener("focus", on);
      row.addEventListener("mouseleave", () => bgs.forEach((b) => b.classList.remove("on")));
    });
  }

  /* ---------- PROJECT ---------- */
  if (page === "project") {
    const slug = new URLSearchParams(location.search).get("p") || S.projects[0].slug;
    const idx = Math.max(0, S.projects.findIndex((p) => p.slug === slug));
    const p = S.projects[idx], nxt = S.projects[(idx + 1) % S.projects.length];
    document.title = `${p.title} — ${S.name}`;
    const prose = (arr) => `<div class="prose">${arr.map((t) => `<p>${esc(t)}</p>`).join("")}</div>`;
    const block = (b) => {
      if (b.type === "pair") return `<section class="block block-pair ${b.side === "left" ? "left" : ""}"><figure>${img(b.img, p.title, "(max-width:860px) 100vw, 42vw")}</figure>${prose(b.text)}</section>`;
      if (b.type === "split") return `<section class="block block-split ${b.side === "left" ? "left" : ""}"><figure>${img(b.img, p.title, "(max-width:860px) 100vw, 55vw")}</figure>${prose(b.text)}</section>`;
      if (b.type === "quote") return `<section class="block block-quote"><p class="display dvd">${esc(b.text)}</p></section>`;
      if (b.type === "full") return `<section class="block block-full">${img(b.img, p.title, "100vw")}</section>`;
      if (b.type === "columns") return `<section class="block block-columns">${b.text.map((t) => prose([t])).join("")}</section>`;
      if (b.type === "text") return `<section class="block block-text">${prose(b.text)}</section>`;
      if (b.type === "strip") return `<section class="block block-strip">
          <div class="strip-head"><span class="kind">${esc(b.caption || "")}</span>
          <div class="strip-nav"><button data-dir="-1" aria-label="Previous">←</button><button data-dir="1" aria-label="Next">→</button></div></div>
          <div class="strip" tabindex="0">${b.imgs.map((k) => img(k, p.title, "80vw")).join("")}</div></section>`;
      if (b.type === "duo") return `<section class="block block-duo">${b.imgs.map((k) => `<figure>${img(k, p.title, "(max-width:860px) 100vw, 45vw")}</figure>`).join("")}</section>`;
      if (b.type === "frames") return `<section class="block block-sequence">${b.imgs.map((k) => `<figure class="frame">${img(k, p.title, "(max-width:1180px) 100vw, 1180px")}</figure>`).join("")}</section>`;
      if (b.type === "sequence") return `<section class="block block-sequence">${b.imgs.map((k, i) =>
          `<figure class="frame">${img(k, `${p.title}, frame ${i + 1}`, "(max-width:1180px) 100vw, 1180px")}<figcaption>${i + 1}/${b.imgs.length}</figcaption></figure>`).join("")}</section>`;
      return "";
    };
    const hero = p.hero || p.cover;
    main.innerHTML = `
      <header class="p-hero${p.heroFit === "contain" ? " contain" : ""}">
        ${hero ? img(hero, p.title, p.heroFit === "contain" ? "60vw" : "100vw", "p-hero-img", true).replace("<img ", `<img style="object-position:${p.heroPos || "50% 50%"}" `) : ""}
        <div class="p-hero-text"><span class="kind">${esc(p.kind)}</span><h1 class="display dvd">${esc(p.title)}</h1></div>
      </header>
      ${p.intro ? `<section class="block p-intro"><p>${esc(p.intro)}</p></section>` : ""}
      ${p.blocks.map(block).join("")}
      <a class="next-project" href="project.html?p=${nxt.slug}">
        ${nxt.cover ? img(nxt.hero || nxt.cover, "", "100vw", "next-img").replace("<img ", `<img style="object-position:${nxt.heroPos || "50% 50%"}" `) : ""}
        <span class="next-text"><span class="kind">Next project</span><span class="display dvd">${esc(nxt.title)}</span></span>
      </a>
      ${footer()}`;

    document.querySelectorAll(".block-strip").forEach((s) => {
      const strip = s.querySelector(".strip");
      s.querySelectorAll(".strip-nav button").forEach((b) => (b.onclick = () =>
        strip.scrollBy({ left: +b.dataset.dir * strip.clientWidth * 0.7, behavior: reduce ? "auto" : "smooth" })));
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("lit"), io.unobserve(e.target))), { rootMargin: "0px 0px -30% 0px" });
    document.querySelectorAll(".frame").forEach((f) => io.observe(f));

    zoomable([...main.querySelectorAll(".block img")]);
  }

  /* ---------- VISUALS ---------- */
  if (page === "visuals") {
    const cap = (v) => `<figcaption><strong>${esc(v.title)}</strong><span class="kind">${esc(v.kind)}</span></figcaption>`;
    main.innerHTML = `
      <header class="page-head"><h1 class="display dvd">Visuals</h1></header>
      <div class="visuals-grid">${S.visuals.map((v) => v.imgs ? `
        <figure class="visual v-strip">
          <div class="strip-head">${cap(v)}<div class="strip-nav"><button data-dir="-1" aria-label="Previous">\u2190</button><button data-dir="1" aria-label="Next">\u2192</button></div></div>
          <div class="strip" tabindex="0">${v.imgs.map((k) => img(k, v.title, "70vw")).join("")}</div>
        </figure>` : `
        <figure class="visual v-${v.size || "wide"}">${v.img ? img(v.img, v.title, "(max-width:760px) 100vw, 60vw") : `<div class="placeholder">Image coming soon</div>`}${cap(v)}</figure>`).join("")}
      </div>${footer()}`;
    document.querySelectorAll(".v-strip").forEach((s) => {
      const strip = s.querySelector(".strip");
      s.querySelectorAll(".strip-nav button").forEach((b) => (b.onclick = () =>
        strip.scrollBy({ left: +b.dataset.dir * strip.clientWidth * 0.7, behavior: reduce ? "auto" : "smooth" })));
    });
    zoomable([...main.querySelectorAll(".visual img")]);
  }

  /* ---------- PHOTO & VIDEO ---------- */
  if (page === "photo") {
    S.photo.forEach((s) => { if (s.chapters) s.imgs = s.chapters.flatMap((c) => c.imgs); if (s.countries) s.imgs = s.countries.flatMap((c) => c.rows.flat()); if (s.collage) s.imgs = s.collage.flatMap((r) => r.place ? [] : r.row || (r.cols ? r.cols.flat() : [r.mosaic, ...r.stack])); });
    const C = window.COLORS || {};
    const thumb = (s, k, i) => `<button class="${s.layout === "palette" ? "jr-item" : ""}" data-sec="${s.slug}" data-i="${i}" data-k="${k}" aria-label="Open photo ${i + 1}" style="--c:${C[k] || "#333"}">${img(k, `${s.title} photo ${i + 1}`, s.layout === "palette" ? "(max-width:760px) 60vw, 30vw" : "(max-width:760px) 50vw, 26vw")}</button>`;
    const gallery = (s) => {
      if (!s.imgs.length && s.layout !== "tv") return `<div class="empty">This section is being filled. Photos coming soon.</div>`;
      if (s.layout === "tv") {
        // photo of three stacked CRTs (screens cut out); each video sits behind its glass, reflections on top
        const screens = [{"l": 12.179, "t": 4.099, "w": 75.897, "h": 21.441}, {"l": 17.051, "t": 39.054, "w": 66.154, "h": 18.063}, {"l": 11.41, "t": 69.64, "w": 77.179, "h": 20.676}]; // top, middle, bottom
        return `<div class="tv-wrap">
          <div class="crt-stage">
            ${s.channels.map((c, i) => { const r = screens[i]; return `
              <span class="crt-screen" style="left:${r.l}%;top:${r.t}%;width:${r.w}%;height:${r.h}%">
                <video muted loop playsinline preload="metadata" ${c.poster ? `poster="${c.poster}"` : ""} data-src="${c.loop || c.src}"></video>
                <span class="crt-osd"><span>CH ${i + 1}</span><span class="tc">\u25B6 00:00:00</span></span>
                <span class="crt-glass"></span>
              </span>
              <button class="crt" data-ch="${i}" style="left:${r.l}%;top:${r.t}%;width:${r.w}%;height:${r.h}%" aria-label="Play ${esc(c.title)} with sound"></button>`; }).join("")}
            <img class="crt-body" src="img/tv-real.webp" alt="" width="780" height="2220" loading="lazy">
            <img class="crt-shine" src="img/tv-shine.webp" alt="" width="780" height="2220" loading="lazy">
          </div>
          <div class="tv-info">
            <ol class="tv-channels">${s.channels.map((c, i) => `<li><button data-ch="${i}"><b>CH ${i + 1}</b> <span>${esc(c.title)}</span><em>${esc(c.kind)}</em></button></li>`).join("")}</ol>
            <p class="tv-hint"><b>Click a screen</b> to watch the full video with sound</p>
          </div>
          <div class="tv-big" role="dialog" aria-modal="true" aria-label="Video player" hidden>
            <div class="bar"><span class="tv-big-title"></span><button class="tv-big-close">close</button></div>
            <video controls playsinline preload="none"></video>
          </div>
        </div>`;
      }
      if (s.layout === "countries") {
        let n = 0;
        const item = (k, one) => { const i = n++; return `<button class="ed-item" data-sec="${s.slug}" data-i="${i}" data-k="${k}" aria-label="Open photo ${i + 1}">${img(k, `${s.title} photo ${i + 1}`, one ? "(max-width:760px) 100vw, 75vw" : "(max-width:760px) 50vw, 40vw", "", i < 2)}</button>`; };
        return `<header class="sec-head">
            ${s.intro ? `<p class="note">${esc(s.intro)}</p>` : ""}
          </header>` + s.countries.map((c, ci) => `<div class="collage gallery country" data-country="${ci}">
            ${c.rows.map((r) => `<div class="c-row">${r.map((k) => item(k, r.length === 1)).join("")}</div>`).join("")}
            <p class="c-place"><em>${esc(c.name)}</em>${c.place ? ` \u00B7 ${esc(c.place)}` : ""}</p></div>`).join("");
      }
      if (s.layout === "collage") {
        let n = 0;
        const item = (k) => { const i = n++; return `<button class="ed-item" data-sec="${s.slug}" data-i="${i}" data-k="${k}" aria-label="Open photo ${i + 1}">${img(k, `${s.title} photo ${i + 1}`, "(max-width:760px) 100vw, 60vw", "", i < 3)}</button>`; };
        return `<div class="collage">${s.collage.map((r) => r.place
          ? `<p class="c-place">${esc(r.place)}</p>`
          : r.cols
          ? `<div class="c-bento">${r.cols.map((c) => `<div class="c-col">${c.map(item).join("")}</div>`).join("")}</div>`
          : r.row
          ? `<div class="c-row${r.narrow ? " narrow" : ""}">${r.row.map(item).join("")}</div>`
          : `<div class="c-mosaic ${r.side === "right" ? "right" : ""}">${item(r.mosaic)}<div class="c-stack">${r.stack.map(item).join("")}</div></div>`).join("")}</div>`;
      }
      if (s.layout === "editorial") {
        const rows = s.rows || [], used = rows.flat(), f = used.length ? Math.max(...used) + 1 : 0;
        return `<div class="editorial">${rows.map((r) => `<div class="ed-row">${r.map((i) =>
            `<button class="ed-item" data-sec="${s.slug}" data-i="${i}" data-k="${s.imgs[i]}" aria-label="Open photo ${i + 1}">${img(s.imgs[i], `${s.title} photo ${i + 1}`, r.length === 1 ? "100vw" : "(max-width:760px) 100vw, 55vw", "", i === 0)}</button>`).join("")}</div>`).join("")}</div>
          <div class="jr ed-rest">${s.imgs.slice(f).map((k, j) => thumb({ ...s, layout: "palette" }, k, f + j)).join("")}</div>`;
      }
      if (s.layout !== "palette") return `<div class="masonry">${s.imgs.map((k, i) => thumb(s, k, i)).join("")}</div>`;
      let n = 0;
      return `
        <div class="palette-bar" role="navigation" aria-label="Jump by colour">${s.imgs.map((k, i) =>
          `<button style="background:${C[k] || "#333"}" data-jump="${i}" aria-label="Photo ${i + 1}"></button>`).join("")}</div>
        ${s.chapters.map((c) => `
          <div class="chapter" style="--c:${C[c.imgs[0]] || "#333"}">
            <h2 class="chapter-title"><span class="dot"></span>${esc(c.title)}<small>${c.imgs.length}</small></h2>
            <div class="jr">${c.imgs.map((k) => thumb(s, k, n++)).join("")}</div>
          </div>`).join("")}`;
    };
    main.innerHTML = `
      <div class="photo-layout">
        <aside class="photo-menu"><h1 class="display dvd">Photo &amp; video</h1>
          <ul>${S.photo.map((s) => `<li><a href="#${s.slug}">${esc(s.title)}</a></li>`).join("")}</ul></aside>
        <div class="photo-main">${S.photo.map((s) => `
          <section class="photo-section" id="sec-${s.slug}" hidden aria-label="${esc(s.title)}">
            <p class="note">${esc(s.note)}</p>
            ${gallery(s)}
          </section>`).join("")}</div>
      </div>
      <div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
        <div class="bar"><span class="count"></span><button class="lb-close">close</button></div>
        <figure><img alt=""></figure>
        <div class="arrows"><button data-d="-1" aria-label="Previous photo">\u2190</button><button data-d="1" aria-label="Next photo">\u2192</button></div>
      </div>${footer()}`;

    // justified rows: every row fills the width, photos keep their proportions
    const justify = () => {
      document.querySelectorAll(".photo-section:not([hidden]) .jr").forEach((box) => {
        const W = box.clientWidth; if (!W) return;
        const gap = parseFloat(getComputedStyle(box).columnGap) || 10, target = (innerWidth < 760 ? 150 : Math.max(220, Math.min(340, innerHeight * 0.36))) * (box.classList.contains("ed-rest") ? 1.25 : 1);
        const items = [...box.children];
        let row = [], sum = 0;
        const place = (r, h) => r.forEach(({ el, ar }) => { el.style.width = `${ar * h}px`; el.style.height = `${h}px`; });
        items.forEach((el) => {
          const [w, h] = Z[el.dataset.k] || [3, 2];
          row.push({ el, ar: w / h }); sum += w / h;
          const rowH = (W - gap * (row.length - 1)) / sum;
          if (rowH <= target) { place(row, rowH); row = []; sum = 0; }
        });
        if (row.length) place(row, Math.min(target, (W - gap * (row.length - 1)) / sum));
      });
    };
    const justifyRows = () => document.querySelectorAll(".photo-section:not([hidden]) .ed-row").forEach((row) => {
      const W = row.clientWidth; if (!W) return;
      const gap = parseFloat(getComputedStyle(row).columnGap) || 12, kids = [...row.children];
      const ars = kids.map((el) => { const [w, h] = Z[el.dataset.k] || [3, 2]; return w / h; });
      const h = Math.min(innerHeight - 110, (W - gap * (kids.length - 1)) / ars.reduce((a, b) => a + b, 0));
      kids.forEach((el, i) => { el.style.width = `${ars[i] * h}px`; el.style.height = `${h}px`; });
    });
    const ar = (el) => { const [w, h] = Z[el.dataset.k] || [3, 2]; return w / h; };
    // no photo may be taller than the screen (minus the header): you always see it whole
    const hdr = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header")) || 70;
    const maxH = () => Math.max(200, innerHeight - hdr() - 40);
    const sz = (el, w, h) => { el.style.width = `${w}px`; el.style.height = `${h}px`; };
    const layoutCollage = () => document.querySelectorAll(".photo-section:not([hidden]) .collage").forEach((c) => {
      const W = c.clientWidth; if (!W) return;
      const g = parseFloat(getComputedStyle(c).rowGap) || 12, narrow = W < 600;
      c.querySelectorAll(".c-row").forEach((row) => {
        const RW = row.classList.contains("narrow") && !narrow ? W * 0.66 : W;
        const kids = [...row.children], h = Math.min(maxH(), (RW - g * (kids.length - 1)) / kids.reduce((s, el) => s + ar(el), 0));
        kids.forEach((el) => sz(el, ar(el) * h, h));
      });
      // bento block: every column ends at the same height, nothing cropped
      c.querySelectorAll(".c-bento").forEach((b) => {
        const cols = [...b.children];
        b.classList.toggle("narrow", narrow);
        if (narrow) {  // phone: a single photo goes full width, a stack becomes a row
          cols.forEach((col) => { const kids = [...col.children], h = (W - g * (kids.length - 1)) / kids.reduce((s, el) => s + ar(el), 0);
            col.style.width = `${W}px`; kids.forEach((el) => sz(el, ar(el) * h, h)); });
          return;
        }
        const ks = cols.map((col) => [...col.children].reduce((s, el) => s + 1 / ar(el), 0));
        const H = (W - g * (cols.length - 1) + g * cols.reduce((s, col, i) => s + (col.children.length - 1) / ks[i], 0)) / ks.reduce((s, k) => s + 1 / k, 0);
        cols.forEach((col, i) => { const w = (H - g * (col.children.length - 1)) / ks[i]; col.style.width = `${w}px`; [...col.children].forEach((el) => sz(el, w, w / ar(el))); });
      });
      c.querySelectorAll(".c-mosaic").forEach((m) => {
        const big = m.children[0], stack = m.children[1], [s1, s2] = stack.children;
        m.classList.toggle("narrow", narrow);
        if (narrow) {  // phone: big on top, the two side by side under it
          sz(big, W, W / ar(big)); stack.style.width = `${W}px`;
          const h = (W - g) / (ar(s1) + ar(s2)); sz(s1, ar(s1) * h, h); sz(s2, ar(s2) * h, h); return;
        }
        const a = ar(big), k = 1 / ar(s1) + 1 / ar(s2);
        const wr = (W - g - a * g) / (a * k + 1), H = wr * k + g;
        sz(big, a * H, H); stack.style.width = `${wr}px`; sz(s1, wr, wr / ar(s1)); sz(s2, wr, wr / ar(s2));
      });
    });
    document.querySelectorAll("[data-goto]").forEach((a) => (a.onclick = (e) => {
      e.preventDefault();
      const g = a.closest(".photo-section").querySelector(`.country[data-country="${a.dataset.goto}"]`);
      scrollTo({ top: g.getBoundingClientRect().top + scrollY - 90, behavior: reduce ? "auto" : "smooth" });
    }));
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { justify(); justifyRows(); layoutCollage(); }, 120); });

    // palette bar: jump to a photo, mark the one you're looking at
    document.querySelectorAll("[data-jump]").forEach((b) => (b.onclick = () => {
      const sec = b.closest(".photo-section");
      const target = sec.querySelector(`.jr-item[data-i="${b.dataset.jump}"]`);
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      target.classList.remove("pulse"); void target.offsetWidth; target.classList.add("pulse");
    }));
    const seen = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const bar = e.target.closest(".photo-section").querySelector(".palette-bar");
      bar && bar.querySelectorAll("button").forEach((x) => x.classList.toggle("here", x.dataset.jump === e.target.dataset.i));
    }), { rootMargin: "-45% 0px -45% 0px" });
    document.querySelectorAll(".jr-item").forEach((el) => seen.observe(el));

    const show = () => {
      const want = location.hash.slice(1);
      const cur = S.photo.find((s) => s.slug === want) || S.photo[0];
      S.photo.forEach((s) => (document.getElementById("sec-" + s.slug).hidden = s !== cur));
      document.querySelectorAll(".photo-menu a").forEach((a) => a.setAttribute("aria-current", a.hash === "#" + cur.slug));
      justify(); justifyRows(); layoutCollage();
    };
    // ---------- the TV stack ----------
    const tvSec = S.photo.find((s) => s.layout === "tv"), stage = document.querySelector(".crt-stage");
    if (stage && tvSec) {
      const vids = [...stage.querySelectorAll("video")];
      const tc = (v) => { const s = Math.floor(v.currentTime || 0); return `▶ 00:${String((s / 60) | 0).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
      let tick = null;
      const playAll = () => { vids.forEach((v) => { if (!v.src && v.dataset.src) v.src = v.dataset.src; v.play().catch(() => {}); });
        clearInterval(tick); tick = setInterval(() => vids.forEach((v) => (v.parentElement.querySelector(".tc").textContent = tc(v))), 500); };
      const pauseAll = () => { vids.forEach((v) => v.pause()); clearInterval(tick); };
      new IntersectionObserver(([e]) => (e.isIntersecting && !reduce ? playAll() : pauseAll()), { threshold: 0.15 }).observe(stage);

      const big = document.querySelector(".tv-big"), bigV = big.querySelector("video");
      const openBig = (i) => {
        const c = tvSec.channels[i], small = vids[i];
        big.querySelector(".tv-big-title").textContent = `CH ${i + 1} · ${c.title}`;
        bigV.src = c.src; bigV.poster = c.poster || ""; bigV.currentTime = 0;   // always from the very first frame
        big.hidden = false; document.body.style.overflow = "hidden"; pauseAll();
        bigV.muted = false; bigV.play().catch(() => {}); big.querySelector(".tv-big-close").focus();
      };
      const closeBig = () => { bigV.pause(); big.hidden = true; document.body.style.overflow = ""; if (!reduce) playAll(); };
      document.querySelectorAll(".crt, .tv-channels button").forEach((b) => (b.onclick = () => openBig(+b.dataset.ch)));
      big.querySelector(".tv-big-close").onclick = closeBig;
      big.addEventListener("click", (e) => { if (e.target === big) closeBig(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !big.hidden) closeBig(); });
    }
    window.addEventListener("hashchange", () => { show(); window.scrollTo(0, 0); });
    show();

    // lightbox
    const lb = document.querySelector(".lightbox"), lbImg = lb.querySelector("img"), cnt = lb.querySelector(".count");
    let list = [], at = 0, last = null;
    const render = () => { lbImg.src = `img/${list[at]}.webp`; cnt.textContent = `${at + 1}/${list.length}`; };
    const open = (sec, i) => { list = S.photo.find((s) => s.slug === sec).imgs; at = i; render(); lb.classList.add("open"); document.body.style.overflow = "hidden"; lb.querySelector(".lb-close").focus(); };
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; last && last.focus(); };
    const go = (d) => { at = (at + d + list.length) % list.length; render(); };
    document.querySelectorAll(".masonry button, .jr-item, .ed-item").forEach((b) => (b.onclick = () => { last = b; open(b.dataset.sec, +b.dataset.i); }));
    lb.querySelector(".lb-close").onclick = close;
    lb.querySelectorAll(".arrows button").forEach((b) => (b.onclick = () => go(+b.dataset.d)));
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1);
    });
    let x0 = null;
    lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); x0 = null; });
  }

  /* ---------- ABOUT + digital camera with backstage photos ---------- */
  if (page === "about") {
    const shots = S.backstage || [];
    const camMenu = [
      { label: "Normal", fx: "normal" },
      { label: "Night vision", fx: "night" },
      { label: "Xerox", fx: "xerox" },
      { label: "Thermal", fx: "thermal" },
      { label: "VHS", fx: "vhs" },
      { label: "Solarize", fx: "solar" },
      { label: "DVD", fx: "dvd" },
    ];
    main.innerHTML = `
      <section class="about">
        <h1 class="about-title"><span class="display dvd hi">Hi, I'm Enrica.</span><span class="display neg-fill"${shots.length ? ` style="--neg:url(${new URL(`img/${shots[0]}-neg.webp`, document.baseURI).href});--pos:${(S.backstageFocus || {})[shots[0]] || "50% 50%"}"` : ""}>Concepts<br>into<br>visuals.</span></h1>
        <div class="about-text">
          <div class="prose">${S.about.map((t, i) => `<p${i === 0 ? ' class="lead"' : ""}>${esc(t)}</p>`).join("")}</div>
          <div class="side"><p>Italian, based in Madrid.<br>Creative direction, branding, photography.</p>${contacts()}</div>
        </div>
        ${shots.length ? `
        <figure class="digicam-wrap">
          <figcaption class="cam-hint"><b><span class="dot" aria-hidden="true"></span>Play with it: use the buttons</b><span>◀ ▶ browse the backstage · MENU/OK for modes and a photoshoot game · print button to shoot</span></figcaption>
          <div class="digicam" role="group" aria-label="Digital camera: backstage photos, photo modes and a photoshoot game" tabindex="0">
            <img class="cam-body" src="img/cam-dvd.webp" alt="" width="1536" height="1180" draggable="false">
            <div class="cam-screen" data-disp="info" data-fx="normal">
                ${shots.map((k, i) => img(k, `Backstage photo ${i + 1}`, "(max-width:860px) 60vw, 300px", i === 0 ? "on" : "", i < 2).replace("<img ", `<img style="object-position:${(S.backstageFocus || {})[k] || "50% 50%"}" `)).join("")}
                <span class="fx-overlay" aria-hidden="true"></span>
                <span class="cam-grid" aria-hidden="true"></span>
                <span class="cam-hud"><span class="cam-state">&#9654;</span><span class="cam-count">1/${shots.length}</span></span>
                <span class="cam-mode">NORMAL</span>
                <canvas class="cam-game" hidden aria-label="Photoshoot game"></canvas>
                <div class="cam-menu" hidden>
                  <p class="cam-menu-title"><span class="t"></span><span class="pos"></span></p>
                  <span class="cue up" aria-hidden="true">&#9650;</span>
                  <ul></ul>
                  <span class="cue down" aria-hidden="true">&#9660; more</span>
                </div>
                <span class="cam-toast" aria-live="polite"></span>
                <span class="cam-blink" aria-hidden="true"></span>
            </div>
            <span class="cam-brand" aria-hidden="true">ENRI</span>
            <button class="hb cam-shutter" data-k="shutter" style="left:18%;top:2%;width:20%;height:7%" aria-label="Shutter: take a picture and print it"></button>
            <button class="hb round" data-k="shutter" style="left:79.56%;top:36.44%;width:8.1%" aria-label="Print"></button>
            <button class="hb round" data-k="set" style="left:79.56%;top:47.88%;width:8.1%" aria-label="Play or pause"></button>
            <button class="hb round" data-k="back" style="left:79.56%;top:60.17%;width:8.1%" aria-label="Back"></button>
            <div class="cam-ring" style="left:79.43%;top:76.53%;width:13.6%">
              <button class="hb up" data-k="up" aria-label="Up"></button>
              <button class="hb down" data-k="down" aria-label="Down"></button>
              <button class="hb prev" data-k="left" aria-label="Left, previous photo"></button>
              <button class="hb next" data-k="right" aria-label="Right, next photo"></button>
              <button class="hb ok" data-k="ok" aria-label="Menu / OK"></button>
            </div>
            <button class="hb slider" data-k="disp" style="left:11.2%;top:59.24%;width:4.2%;height:10%" aria-label="Change display"></button>
          </div>
          <div class="prints" aria-label="Your prints"></div>
          <svg width="0" height="0" style="position:absolute" aria-hidden="true">
            <filter id="fx-thermal" color-interpolation-filters="sRGB">
              <feColorMatrix type="matrix" values=".33 .33 .33 0 0  .33 .33 .33 0 0  .33 .33 .33 0 0  0 0 0 1 0"/>
              <feComponentTransfer><feFuncR type="table" tableValues="0 .1 .55 1 1 1"/><feFuncG type="table" tableValues="0 0 0 .25 .8 1"/><feFuncB type="table" tableValues=".15 .7 .65 .1 0 .7"/></feComponentTransfer>
            </filter>
            <filter id="fx-vhs" color-interpolation-filters="sRGB" x="-5%" y="0" width="110%" height="100%">
              <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/><feOffset in="r" dx="4" result="r2"/>
              <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>
              <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/><feOffset in="b" dx="-4" result="b2"/>
              <feBlend in="r2" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b2" mode="screen"/>
            </filter>
            <filter id="fx-solar" color-interpolation-filters="sRGB">
              <feComponentTransfer><feFuncR type="table" tableValues="0 1 0"/><feFuncG type="table" tableValues="0 1 0"/><feFuncB type="table" tableValues="0 1 0"/></feComponentTransfer>
            </filter>
          </svg>
        </figure>` : ""}
      </section>${footer()}`;

    if (shots.length) {
      const cam = document.querySelector(".digicam");
      const screen = cam.querySelector(".cam-screen");
      const pics = [...screen.querySelectorAll("img")];
      const count = cam.querySelector(".cam-count"), blink = cam.querySelector(".cam-blink"), state = cam.querySelector(".cam-state");
      const menu = cam.querySelector(".cam-menu"), mTitle = menu.querySelector(".cam-menu-title .t"), mPos = menu.querySelector(".cam-menu-title .pos"), mList = menu.querySelector("ul");
      const cues = () => { menu.classList.toggle("can-up", mList.scrollTop > 2); menu.classList.toggle("can-down", mList.scrollTop + mList.clientHeight < mList.scrollHeight - 2); };
      mList.addEventListener("scroll", cues, { passive: true });
      const toast = cam.querySelector(".cam-toast"), modeLabel = cam.querySelector(".cam-mode"), canvas = cam.querySelector(".cam-game");
      const store = { get: (k, d) => { try { const v = localStorage.getItem("cam-" + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
                      set: (k, v) => { try { localStorage.setItem("cam-" + k, JSON.stringify(v)); } catch {} } };
      const cfg = { speed: store.get("speed", 2600), flash: store.get("flash", true), timer: store.get("timer", 0) };
      let at = 0, auto = null, paused = false, toastT, view = "photo";

      const say = (txt) => { toast.textContent = txt; toast.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove("on"), 1100); };
      cam.addEventListener("pointermove", (e) => {
        const r = cam.getBoundingClientRect();
        cam.style.setProperty("--lx", `${((e.clientX - r.left) / r.width) * 100}%`);
        cam.style.setProperty("--ly", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
      // the big title shows the camera's current photo, in negative, like the home
      const negEl = document.querySelector(".neg-fill");
      const pre = (k) => { const i = new Image(); i.src = `img/${k}-neg.webp`; }; pre(shots[1 % shots.length]);
      const setNeg = () => { const k = shots[at];
        negEl.style.setProperty("--neg", `url(${new URL(`img/${k}-neg.webp`, document.baseURI).href})`); negEl.style.setProperty("--pos", (S.backstageFocus || {})[k] || "50% 50%");
        pre(shots[(at + 1) % shots.length]); pre(shots[(at - 1 + shots.length) % shots.length]);
        if (!reduce) { negEl.classList.remove("pop"); void negEl.offsetWidth; negEl.classList.add("pop"); } };
      const flash = () => { if (!reduce && cfg.flash) { blink.classList.remove("go"); void blink.offsetWidth; blink.classList.add("go"); } };
      const show = (d) => {
        pics[at].classList.remove("on");
        at = (at + d + pics.length) % pics.length;
        pics[at].classList.add("on");
        count.textContent = `${at + 1}/${pics.length}`;
        flash(); setNeg();
      };
      const stopAuto = () => { clearInterval(auto); auto = null; };
      const startAuto = () => { if (!reduce && !auto && !paused && view === "photo") auto = setInterval(() => show(1), cfg.speed); };
      const setPaused = (p) => { paused = p; state.innerHTML = p ? "&#10074;&#10074;" : "&#9654;"; p ? stopAuto() : startAuto(); say(p ? "PAUSE" : "PLAY"); };
      const setFx = (fx, label) => { screen.dataset.fx = fx; modeLabel.textContent = label.toUpperCase(); };
      const setDisp = (d) => { screen.dataset.disp = d; };

      // ---------- prints ----------
      const tray = document.querySelector(".prints");
      let z = 1;
      const print = () => {
        const src = pics[at], p = document.createElement("div");
        p.className = "print"; p.dataset.fx = screen.dataset.fx;
        p.style.setProperty("--r", `${(Math.random() * 16 - 8).toFixed(1)}deg`); p.style.setProperty("--px", `${(Math.random() * 80 + 10) | 0}%`);
        p.style.left = `${8 + Math.random() * 52}%`; p.style.top = `${10 + Math.random() * 30}px`; p.style.zIndex = ++z;
        p.innerHTML = `<div class="print-img"><img src="${src.currentSrc || src.src}" style="${src.getAttribute("style") || ""}" alt=""><span class="fx-overlay"></span></div>`;
        tray.appendChild(p);
        while (tray.children.length > 6) tray.firstElementChild.remove();
        let sx, sy, ox, oy;
        p.addEventListener("pointerdown", (e) => { p.setPointerCapture(e.pointerId); p.style.zIndex = ++z; p.classList.add("held"); sx = e.clientX; sy = e.clientY; ox = p.offsetLeft; oy = p.offsetTop; });
        p.addEventListener("pointermove", (e) => { if (!p.classList.contains("held")) return; p.style.left = `${ox + e.clientX - sx}px`; p.style.top = `${oy + e.clientY - sy}px`; });
        const drop = () => p.classList.remove("held");
        p.addEventListener("pointerup", drop); p.addEventListener("pointercancel", drop);
      };
      const shoot = () => {
        stopAuto();
        const fire = () => { document.body.classList.remove("page-flash"); void document.body.offsetWidth; if (!reduce && cfg.flash) document.body.classList.add("page-flash"); print(); show(1); };
        if (!cfg.timer) return fire();
        let n = cfg.timer; say(String(n));
        const tick = setInterval(() => { n--; if (n > 0) say(String(n)); else { clearInterval(tick); fire(); } }, 1000);
      };

      // ---------- menu ----------
      const modes = [["normal", "Normal"], ["night", "Night vision"], ["xerox", "Xerox"], ["thermal", "Thermal"], ["vhs", "VHS"], ["solar", "Solarize"], ["dvd", "DVD"]];
      const dot = (on) => (on ? "● " : "○ ");
      const tree = () => ({
        title: "MENU", items: [
          { label: "Playback", act: () => closeMenu() },
          { label: "Mode", value: modeLabel.textContent, sub: () => ({ title: "MODE", items: modes.map(([fx, l]) => ({ label: dot(screen.dataset.fx === fx) + l, act: () => { setFx(fx, l); closeMenu(); flash(); say(l.toUpperCase()); } })) }) },
          { label: "Slideshow", sub: () => ({ title: "SLIDESHOW", items: [
            { label: paused ? "Play" : "Pause", act: () => { closeMenu(); setPaused(!paused); } },
            ...[[4200, "Slow"], [2600, "Normal"], [1300, "Fast"]].map(([ms, l]) => ({ label: dot(cfg.speed === ms) + "Speed: " + l, act: () => { cfg.speed = ms; store.set("speed", ms); stopAuto(); back(); say(l.toUpperCase()); } })),
          ] }) },
          { label: "Display", sub: () => ({ title: "DISPLAY", items: [["info", "Info"], ["clean", "Clean"], ["grid", "Grid"]].map(([d, l]) => ({ label: dot(screen.dataset.disp === d) + l, act: () => { setDisp(d); closeMenu(); say(l.toUpperCase()); } })) }) },
          { label: "Games", sub: () => ({ title: "GAMES", items: [{ label: "The Shoot", value: `HI ${store.get("shoot", 0)}`, act: () => startGame() }] }) },
          { label: "Settings", sub: () => ({ title: "SETTINGS", items: [
            { label: "Flash", value: cfg.flash ? "ON" : "OFF", act: () => { cfg.flash = !cfg.flash; store.set("flash", cfg.flash); } },
            { label: "Self-timer", value: cfg.timer ? `${cfg.timer}s` : "OFF", act: () => { cfg.timer = cfg.timer === 0 ? 3 : cfg.timer === 3 ? 10 : 0; store.set("timer", cfg.timer); } },
            { label: "Clear prints", act: () => { tray.innerHTML = ""; closeMenu(); say("CLEARED"); } },
          ] }) },
          { label: "Info", sub: () => ({ title: "INFO", items: [
            { label: "ENRI DC-2000", value: "v1.0" }, { label: "Backstage", value: `${pics.length} photos` },
            { label: "Modes", value: String(modes.length) }, { label: "Made in", value: "Madrid" },
          ] }) },
        ] });
      let stack = [], sel = 0;
      const render = () => {
        const m = stack[stack.length - 1];
        mTitle.textContent = stack.map((s) => s.title).join(" › ");
        mList.innerHTML = m.items.map((it, i) => `<li><button data-i="${i}" class="${i === sel ? "sel" : ""}${it.act || it.sub ? "" : " ro"}"><span>${esc(it.label)}</span><span class="v">${esc(it.value || "")}${it.sub ? " ▸" : ""}</span></button></li>`).join("");
        mList.querySelectorAll("button").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); sel = +b.dataset.i; ok(); }));
        const cur = mList.querySelector(".sel"); cur && cur.scrollIntoView({ block: "nearest" });
        mPos.textContent = `${sel + 1}/${m.items.length}`; cues();
      };
      const frame = (gen) => ({ ...gen(), gen });
      const refresh = () => { const top = stack[stack.length - 1]; stack[stack.length - 1] = frame(top.gen); render(); };
      const openMenu = () => { view = "menu"; stopAuto(); stack = [frame(tree)]; sel = 0; menu.hidden = false; render(); };
      const closeMenu = () => { menu.hidden = true; view = "photo"; startAuto(); };
      const back = () => { if (stack.length > 1) { stack.pop(); sel = 0; refresh(); } else closeMenu(); };
      const ok = () => {
        const it = stack[stack.length - 1].items[sel]; if (!it) return;
        if (it.sub) { stack.push(frame(it.sub)); sel = 0; render(); }
        else if (it.act) { it.act(); if (!menu.hidden && view === "menu") refresh(); }
      };
      const move = (d) => { const n = stack[stack.length - 1].items.length; sel = (sel + d + n) % n; render(); };

      // ---------- Photoshoot game ----------
      // A model moves on a dark studio set and strikes poses. Keep her in the viewfinder
      // and shoot while she holds a pose. 12 exposures per roll, then a contact sheet.
      const ctx = canvas.getContext("2d");
      const ROLL = 12;
      let gstate = "title", raf = 0, last = 0, cw = 0, ch = 0, dpr = 1;  // title | run | sheet
      let model, fx, shots_, score, hiFlash = 0, flashA = 0, msg = null, grain = null;
      const sizeCanvas = () => {
        const r = screen.getBoundingClientRect(); dpr = Math.min(1.5, devicePixelRatio || 1);
        canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr));
        cw = canvas.width; ch = canvas.height; grain = null;
      };
      // poses: joints relative to the hip, in body heights (y up is negative)
      // [neck, head, lElbow, lHand, rElbow, rHand, lKnee, lFoot, rKnee, rFoot]
      const P = {
        walkA: [[0, -.42], [0, -.55], [-.1, -.27], [-.12, -.1], [.1, -.27], [.13, -.12], [-.06, .22], [-.1, .45], [.07, .22], [.12, .45]],
        walkB: [[0, -.42], [0, -.55], [-.1, -.27], [-.06, -.1], [.1, -.27], [.08, -.1], [.06, .22], [.1, .45], [-.05, .22], [-.08, .45]],
        arms:  [[0, -.42], [0, -.56], [-.14, -.55], [-.1, -.74], [.14, -.55], [.1, -.75], [-.06, .22], [-.12, .45], [.06, .22], [.12, .45]],
        hip:   [[.02, -.42], [.04, -.55], [-.15, -.3], [-.07, -.08], [.16, -.28], [.13, -.06], [-.02, .22], [-.04, .45], [.12, .2], [.2, .44]],
        lean:  [[-.16, -.36], [-.27, -.44], [-.3, -.25], [-.38, -.1], [-.02, -.18], [.06, -.02], [.08, .2], [.04, .45], [.18, .18], [.16, .45]],
        crouch:[[.02, -.3], [.03, -.43], [-.12, -.16], [-.02, .02], [.14, -.14], [.18, .04], [-.14, .1], [-.12, .3], [.16, .06], [.2, .3]],
        kick:  [[-.03, -.42], [-.04, -.55], [-.16, -.36], [-.24, -.5], [.12, -.3], [.2, -.4], [-.02, .22], [-.02, .45], [.2, .05], [.36, -.02]],
      };
      const POSES = ["arms", "hip", "lean", "crouch", "kick"];
      const GELS = [["#ff3b2f", "#541510"], ["#ffb02e", "#45300f"], ["#5b78ff", "#16204f"], ["#e6e6ea", "#2c2c31"]];
      const resetRoll = () => {
        model = { x: .5, tx: .5, speed: .22, t: 0, pose: null, poseT: 0, nextPose: 1.2, from: P.walkA, cur: P.walkA, gel: 0 };
        fx = .5; shots_ = []; score = 0; msg = null;
      };
      const lerpPose = (a, b, k) => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * k, p[1] + (b[i][1] - p[1]) * k]);
      const makeGrain = () => {
        const g = document.createElement("canvas"); g.width = g.height = 96; const c = g.getContext("2d"), d = c.createImageData(96, 96);
        for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 22; }
        c.putImageData(d, 0, 0); grain = ctx.createPattern(g, "repeat");
      };
      const scene = (now) => {
        const W = cw, H = ch, gel = GELS[model.gel];
        // backdrop: dark paper sweep lit by a coloured gel
        const bg = ctx.createRadialGradient(W * .5, H * .35, 0, W * .5, H * .4, W * .8);
        bg.addColorStop(0, gel[1]); bg.addColorStop(1, "#050505"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        const floor = H * .82; ctx.fillStyle = "rgba(255,255,255,.035)"; ctx.fillRect(0, floor, W, H - floor);
        const spill = ctx.createRadialGradient(W * model.x, floor, 0, W * model.x, floor, W * .35); spill.addColorStop(0, gel[0] + "55"); spill.addColorStop(1, gel[0] + "00");
        ctx.fillStyle = spill; ctx.fillRect(0, floor - H * .1, W, H * .3);
        // light stands
        ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = Math.max(1, W / 260);
        [[.06, .42], [.94, .38]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(W * x, floor); ctx.lineTo(W * x, H * y); ctx.stroke();
          ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.beginPath(); ctx.ellipse(W * x, H * y, W * .035, H * .05, 0, 0, 7); ctx.fill(); });
        // the model
        const k = model.pose ? Math.min(1, model.poseT * 7) : Math.min(1, model.poseT * 6);
        const target = model.pose ? P[model.pose] : (Math.sin(model.t * 9) > 0 ? P.walkA : P.walkB);
        model.cur = lerpPose(model.from, target, model.pose ? k : .35);
        const h = H * .62, hx = W * model.x, hy = floor - h * .45, J = model.cur.map(([x, y]) => [hx + x * h, hy + y * h]);
        const lw = h * .075;
        ctx.lineCap = ctx.lineJoin = "round";
        const limb = (pts, w) => { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(...pts[0]); pts.slice(1).forEach((p) => ctx.lineTo(...p)); ctx.stroke(); };
        const body = (col, grow) => {
          ctx.strokeStyle = ctx.fillStyle = col;
          limb([[hx, hy], J[6], J[7]], lw + grow); limb([[hx, hy], J[8], J[9]], lw + grow);
          limb([[hx, hy], J[0]], lw * 1.9 + grow);
          limb([J[0], J[2], J[3]], lw * .8 + grow); limb([J[0], J[4], J[5]], lw * .8 + grow);
          ctx.beginPath(); ctx.arc(J[1][0], J[1][1], h * .065 + grow / 2, 0, 7); ctx.fill();
          ctx.beginPath(); ctx.moveTo(J[1][0] - h * .06, J[1][1]); ctx.quadraticCurveTo(J[1][0] - h * .1, J[1][1] + h * .16, J[1][0] - h * .02, J[1][1] + h * .14); ctx.lineWidth = lw * .9 + grow; ctx.stroke(); // hair
        };
        const pop = model.pose && model.poseT < .5;
        body(pop ? gel[0] : "rgba(255,255,255,.22)", lw * .45);    // rim light
        body("#060606", 0);
        // shadow
        ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.beginPath(); ctx.ellipse(hx, floor + h * .02, h * .2, h * .025, 0, 0, 7); ctx.fill();
        if (model.pose) { // sparkle = she is posing, shoot now
          const s = h * .05 * (1 + .25 * Math.sin(now / 80)); ctx.fillStyle = "#fff";
          const sx = J[1][0] + h * .12, sy = J[1][1] - h * .12; ctx.beginPath();
          for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? s * .25 : s; ctx.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } ctx.fill();
        }
        // grain + vignette
        if (!grain) makeGrain(); ctx.save(); ctx.translate((now / 40 | 0) % 96, (now / 55 | 0) % 96); ctx.fillStyle = grain; ctx.fillRect(-96, -96, W + 192, H + 192); ctx.restore();
        const v = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, W * .75); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.7)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
      };
      const finder = () => {
        const W = cw, H = ch, fw = W * .3, x = W * fx - fw / 2, y = H * .1, fh = H * .78, c = Math.min(fw, fh) * .16;
        const inside = Math.abs(model.x - fx) < .3 * .34;
        ctx.strokeStyle = inside ? (model.pose ? "#ffd400" : "#fff") : "rgba(255,255,255,.45)"; ctx.lineWidth = Math.max(1.5, W / 220);
        [[x, y, 1, 1], [x + fw, y, -1, 1], [x, y + fh, 1, -1], [x + fw, y + fh, -1, -1]].forEach(([px, py, sx, sy]) => {
          ctx.beginPath(); ctx.moveTo(px, py + c * sy); ctx.lineTo(px, py); ctx.lineTo(px + c * sx, py); ctx.stroke(); });
        ctx.strokeRect(W * fx - c * .35, H * .45 - c * .35, c * .7, c * .7);
      };
      const hud = () => {
        const W = cw, H = ch, fs = Math.round(Math.min(H / 15, W / 20));
        ctx.font = `800 ${fs}px Archivo, sans-serif`; ctx.textBaseline = "top"; ctx.fillStyle = "#fff";
        ctx.textAlign = "left"; ctx.fillText(`EXP ${String(shots_.length).padStart(2, "0")}/${ROLL}`, fs * .6, fs * .5);
        ctx.textAlign = "right"; ctx.fillText(`${score} PTS`, W - fs * .6, fs * .5);
        if (msg && msg.t > 0) { ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `900 ${fs * 1.5}px Archivo, sans-serif`;
          ctx.globalAlpha = Math.min(1, msg.t * 3); ctx.fillStyle = msg.c; ctx.fillText(msg.text, W / 2, H * .9); ctx.globalAlpha = 1; }
        if (flashA > 0) { ctx.fillStyle = `rgba(255,255,255,${flashA})`; ctx.fillRect(0, 0, W, H); }
      };
      const fit = (t, x, y, size, weight) => { ctx.font = `${weight} ${size}px Archivo, sans-serif`; const w = ctx.measureText(t).width, max = cw * .9;
        if (w > max) ctx.font = `${weight} ${size * max / w}px Archivo, sans-serif`; ctx.fillText(t, x, y); };
      const titleCard = () => {
        model.t += .016; scene(performance.now());
        const W = cw, H = ch, fs = Math.round(Math.min(H / 15, W / 20));
        ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        fit("THE SHOOT", W / 2, H * .34, fs * 2.4, 900);
        fit("KEEP HER IN FRAME", W / 2, H * .52, fs * .85, 700);
        fit("SHOOT WHEN SHE POSES ✦", W / 2, H * .6, fs * .85, 700);
        ctx.fillStyle = "#ffd400"; fit(`OK START  ·  ◀ ▶ MOVE  ·  TAP = SHOOT`, W / 2, H * .74, fs * .7, 700);
        ctx.fillStyle = "rgba(255,255,255,.6)"; fit(`BACK EXIT  ·  HI ${store.get("shoot", 0)}`, W / 2, H * .82, fs * .65, 700);
      };
      const sheet = () => {
        const W = cw, H = ch, fs = Math.round(Math.min(H / 15, W / 20));
        ctx.fillStyle = "#0b0b0c"; ctx.fillRect(0, 0, W, H);
        const cols = 4, rows = 3, pad = W * .03, top = fs * 2.2, tw = (W - pad * (cols + 1)) / cols, th = (H - top - fs * 3.2 - pad * rows) / rows;
        shots_.forEach((s, i) => {
          const x = pad + (i % cols) * (tw + pad), y = top + Math.floor(i / cols) * (th + pad);
          ctx.drawImage(s.img, x, y, tw, th);
          ctx.strokeStyle = s.pts === 100 ? "#ffd400" : "rgba(255,255,255,.25)"; ctx.lineWidth = s.pts === 100 ? 2 * dpr : 1; ctx.strokeRect(x, y, tw, th);
          ctx.fillStyle = "#ff3b2f"; ctx.font = `700 ${fs * .55}px Archivo, sans-serif`; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(String(i + 1), x + 3, y + 2);
        });
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.font = `900 ${fs * 1.1}px Archivo, sans-serif`;
        const perfect = shots_.filter((s) => s.pts === 100).length;
        fit(`CONTACT SHEET · ${score} PTS`, W / 2, fs * .6, fs * 1.1, 900);
        ctx.textBaseline = "bottom";
        const verdict = perfect >= 9 ? "COVER SHOT. HIRED." : perfect >= 5 ? "THE CLIENT IS HAPPY" : perfect >= 2 ? "A FEW KEEPERS" : "RESHOOT TOMORROW";
        fit(`${perfect}/${ROLL} KEEPERS · ${verdict}`, W / 2, H - fs * 1.35, fs * .75, 800);
        ctx.fillStyle = "#ffd400"; fit("OK AGAIN  ·  BACK EXIT", W / 2, H - fs * .4, fs * .65, 700);
      };
      const tick = (now) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
        if (gstate === "title") return titleCard();
        if (gstate === "sheet") return sheet();
        // model behaviour
        model.t += dt; model.poseT += dt;
        if (model.pose) { if (model.poseT > Math.max(.55, 1.05 - shots_.length * .04)) { model.from = model.cur; model.pose = null; model.poseT = 0; model.nextPose = .8 + Math.random() * 1.4; model.tx = .15 + Math.random() * .7; } }
        else {
          const d = model.tx - model.x, sp = model.speed + shots_.length * .02;
          model.x += Math.sign(d) * Math.min(Math.abs(d), sp * dt);
          if (Math.abs(d) < .01) model.tx = .15 + Math.random() * .7;
          if (model.poseT > model.nextPose) { model.from = model.cur; model.pose = POSES[(Math.random() * POSES.length) | 0]; model.poseT = 0; model.gel = (Math.random() * GELS.length) | 0; }
        }
        if (msg) msg.t -= dt; flashA = Math.max(0, flashA - dt * 3.5);
        scene(now); finder(); hud();
      };
      const loopOn = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };
      const loopOff = () => { cancelAnimationFrame(raf); raf = 0; };
      const snap = () => {
        if (gstate !== "run") return;
        const inside = Math.abs(model.x - fx) < .3 * .34, pts = inside && model.pose ? 100 : inside ? 20 : 0;
        scene(performance.now());
        const t = document.createElement("canvas"); t.width = 160; t.height = Math.round(160 * ch / cw);
        const sw = cw * .3, sx = Math.max(0, Math.min(cw - sw, cw * fx - sw / 2)), sh = ch * .78;
        t.width = 120; t.height = Math.round(120 * sh / sw); t.getContext("2d").drawImage(canvas, sx, ch * .1, sw, sh, 0, 0, t.width, t.height);
        shots_.push({ img: t, pts }); score += pts; flashA = .9; flash();
        msg = { text: pts === 100 ? "PERFECT +100" : pts ? "SOFT +20" : "MISSED", c: pts === 100 ? "#ffd400" : pts ? "#fff" : "#ff3b2f", t: .9 };
        if (shots_.length >= ROLL) setTimeout(() => {
          gstate = "sheet"; if (score > store.get("shoot", 0)) { store.set("shoot", score); say("NEW HI"); }
        }, 650);
      };
      const startGame = () => { menu.hidden = true; view = "game"; stopAuto(); canvas.hidden = false; sizeCanvas(); resetRoll(); gstate = "title"; loopOn(); cam.focus({ preventScroll: true }); };
      const endGame = () => { loopOff(); canvas.hidden = true; view = "photo"; startAuto(); };
      const moveFinder = (d) => { fx = Math.max(.15, Math.min(.85, fx + d)); };
      addEventListener("resize", () => { if (view === "game") sizeCanvas(); });
      new IntersectionObserver(([e]) => { if (view === "game") (e.isIntersecting ? loopOn() : loopOff()); }).observe(cam);

      // ---------- buttons ----------
      const press = (key) => {
        cam.dataset.touched = "1";
        if (view === "game") {
          if (key === "left") moveFinder(-.07); if (key === "right") moveFinder(.07);
          if (key === "set" || key === "ok" || key === "shutter") {
            if (gstate === "title") gstate = "run"; else if (gstate === "sheet") { resetRoll(); gstate = "run"; } else snap();
          }
          if (key === "menu") { endGame(); openMenu(); }
          if (key === "back" || key === "disp") endGame();
          return;
        }
        if (view === "menu") {
          if (key === "up") move(-1); if (key === "down") move(1);
          if (key === "set" || key === "ok" || key === "right") ok();
          if (key === "left" || key === "back") back(); if (key === "menu") closeMenu();
          return;
        }
        if (key === "right") { stopAuto(); show(1); }
        if (key === "left" || key === "back") { stopAuto(); show(-1); }
        if (key === "set") setPaused(!paused);
        if (key === "menu" || key === "ok") openMenu();
        if (key === "disp") { const ds = ["info", "clean", "grid"]; const d = ds[(ds.indexOf(screen.dataset.disp) + 1) % 3]; setDisp(d); say(d.toUpperCase()); }
        if (key === "shutter") shoot();
      };
      cam.querySelectorAll(".hb").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); press(b.dataset.k); }));
      const gx = (e) => { const r = canvas.getBoundingClientRect(); return (e.clientX - r.left) / r.width; };
      canvas.addEventListener("pointermove", (e) => { if (view === "game" && gstate === "run" && e.pointerType === "mouse") fx = Math.max(.15, Math.min(.85, gx(e))); });
      screen.addEventListener("click", (e) => {
        if (view === "photo" && !e.target.closest(".cam-menu")) return press("right");
        if (view !== "game") return;
        if (gstate !== "run") return press("ok");
        fx = Math.max(.15, Math.min(.85, gx(e))); snap();   // tap = frame there and shoot
      });
      document.addEventListener("keydown", (e) => {
        if (view !== "game" || cam.contains(document.activeElement)) return;
        const k = { ArrowRight: "right", ArrowLeft: "left", " ": "ok", Enter: "ok", Escape: "back" }[e.key];
        if (k) { e.preventDefault(); press(k); }
      });
      cam.addEventListener("keydown", (e) => {
        const k = { ArrowRight: "right", ArrowLeft: "left", ArrowUp: "up", ArrowDown: "down", Enter: "ok", " ": view === "game" ? "ok" : "set", Escape: view === "game" ? "back" : "menu", Backspace: "back", m: "menu", d: "disp", p: "shutter" }[e.key];
        if (k && !((k === "ok" || k === "set") && e.target.tagName === "BUTTON")) { e.preventDefault(); press(k); }
      });
      let t0 = null;
      screen.addEventListener("touchstart", (e) => (t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY }), { passive: true });
      screen.addEventListener("touchend", (e) => {
        if (!t0) return; const dx = e.changedTouches[0].clientX - t0.x, dy = e.changedTouches[0].clientY - t0.y; t0 = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
        if (view === "photo" && Math.abs(dx) > Math.abs(dy)) { stopAuto(); show(dx < 0 ? 1 : -1); }
      });
      screen.addEventListener("touchmove", (e) => { if (view === "game") e.preventDefault(); }, { passive: false });
      if (!reduce) {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !cam.dataset.touched && view === "photo") startAuto(); if (!e.isIntersecting) stopAuto(); });
        io.observe(cam);
        cam.addEventListener("pointerdown", () => { if (!cam.dataset.touched) { cam.dataset.touched = "1"; stopAuto(); } });
      }
    }
  }
  const onScroll = () => document.body.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toTop();
  window.addEventListener("load", toTop);
  window.addEventListener("pageshow", toTop);
})();
