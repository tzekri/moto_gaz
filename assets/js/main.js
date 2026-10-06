/* ===========================================================================
   MOTOS GAZ — script principal
   Dépend de data/motos.js (window.SITE, window.MOTOS, window.MARQUES)
   =========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var MOTOS = window.MOTOS || [];
  var MARQUES = window.MARQUES || [];

  /* ---------- Helpers ------------------------------------------------------ */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* 44900 -> « 44.900 MAD » */
  function formatPrix(n) {
    if (n == null || n === "" || isNaN(n)) return "Prix sur demande";
    return String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " MAD";
  }

  function permisLabel(p) {
    return p === "A1" ? "Permis A1 (≤125)" : "Permis A";
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  /* Familles de catégories (onglets du catalogue) */
  var FAMILLES = ["Scooters & Cyclomoteurs", "Routières", "Roadsters", "Trail & Aventure", "Sportives", "Customs"];

  function famille(m) {
    if (m._fam) return m._fam;
    var c = norm(m.categorie || "");
    var f = "Roadsters";
    if (m.type === "Scooter" || /scooter/.test(c)) f = "Scooters & Cyclomoteurs";
    else if (/trail|aventure|adventure/.test(c)) f = "Trail & Aventure";
    else if (/sport/.test(c)) f = "Sportives";
    else if (/custom|cafe/.test(c)) f = "Customs";
    else if (/routi|touring|\bgt\b/.test(c)) f = "Routières";
    m._fam = f;
    return f;
  }

  var CC_RANGES = [
    { id: "le125",   label: "125 cm³ et moins", test: function (c) { return c <= 125; } },
    { id: "126-400", label: "126–400 cm³",      test: function (c) { return c > 125 && c <= 400; } },
    { id: "401-700", label: "401–700 cm³",      test: function (c) { return c > 400 && c <= 700; } },
    { id: "gt700",   label: "Plus de 700 cm³",  test: function (c) { return c > 700; } }
  ];

  function selle(m) {
    return m.specs && m.specs["Hauteur de selle"] ? m.specs["Hauteur de selle"] : "";
  }

  var HEART_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>';

  var WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2m0 2a8 8 0 0 1 6.7 12.4l-.3.4.7 2.6-2.7-.7-.4.2A8 8 0 1 1 12 4m-3 3.5c-.2 0-.5 0-.7.4-.3.4-1 1-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.2 2.4 1 2.9.8 3.4.8s1.7-.7 2-1.4c.2-.7.2-1.2.2-1.4l-1-.4c-.7-.3-1.5-.6-1.7-.7-.2 0-.4-.1-.6.2l-.8 1c-.1.2-.3.2-.5.1s-1-.4-1.9-1.2c-.7-.6-1.2-1.4-1.3-1.6s0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.2-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4z"/></svg>';

  /* ---------- Favoris (localStorage) ------------------------------------ */

  var FAV_KEY = "mg_favs";
  var favs = (function () {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]") || []; } catch (e) { return []; }
  })();

  function isFav(id) { return favs.indexOf(id) !== -1; }

  function toggleFav(id) {
    var i = favs.indexOf(id);
    if (i === -1) favs.push(id); else favs.splice(i, 1);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) { /* stockage indisponible */ }
    refreshFavUI();
    document.dispatchEvent(new CustomEvent("favs:changed"));
  }

  function refreshFavUI() {
    $all(".fav-btn[data-fav]").forEach(function (b) {
      var on = isFav(b.getAttribute("data-fav"));
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    $all("[data-fav-count]").forEach(function (el) {
      el.textContent = favs.length;
      el.hidden = favs.length === 0;
    });
  }

  function initFavs() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".fav-btn") : null;
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      toggleFav(b.getAttribute("data-fav"));
    });
    refreshFavUI();
  }

  /* ---------- Visuel de secours (photo manquante) ------------------------- */

  function placeholder(caption) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="550" viewBox="0 0 800 550">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#fbfbfb"/><stop offset="1" stop-color="#eeeeef"/></linearGradient></defs>' +
      '<rect width="800" height="550" fill="url(#g)"/>' +
      '<ellipse cx="400" cy="462" rx="280" ry="14" fill="#000" opacity=".06"/>' +
      '<g fill="none" stroke="#8d939c" stroke-width="16" stroke-linecap="round">' +
        '<path d="M205 375 L350 352"/><path d="M505 250 L595 375"/></g>' +
      '<path d="M338 372 L190 398" stroke="#b7bbc2" stroke-width="16" stroke-linecap="round" fill="none"/>' +
      '<g fill="#fff" stroke="#2c2f35" stroke-width="24"><circle cx="205" cy="375" r="84"/><circle cx="595" cy="375" r="84"/></g>' +
      '<g fill="none" stroke="#a9adb4" stroke-width="10"><circle cx="205" cy="375" r="30"/><circle cx="595" cy="375" r="30"/></g>' +
      '<path d="M335 300 L470 300 L488 372 L346 384 Z" fill="#4a4f58"/>' +
      '<path d="M322 262 Q405 208 500 246 L510 296 Q420 322 330 304 Z" fill="#e10600"/>' +
      '<path d="M160 270 Q240 236 332 262 L330 296 L168 304 Z" fill="#2c2f35"/>' +
      '<path d="M490 232 L528 214 L556 220" stroke="#2c2f35" stroke-width="12" stroke-linecap="round" fill="none"/>' +
      '<circle cx="520" cy="262" r="20" fill="#d9dce1" stroke="#8d939c" stroke-width="6"/>' +
      '<text x="400" y="520" text-anchor="middle" fill="#9aa0aa" font-family="Segoe UI,Arial,sans-serif" font-size="22">' +
        esc(caption) + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg).replace(/'/g, "%27");
  }

  function motoImg(m) {
    var fallback = placeholder("Photo bientôt disponible");
    return '<img loading="lazy" alt="' + esc(m.marque + " " + m.modele) + '"' +
      ' src="assets/img/motos/' + esc(m.image) + '"' +
      " onerror=\"this.onerror=null;this.src='" + fallback + "'\">";
  }

  /* ---------- Carte moto -------------------------------------------------- */

  function motoCard(m) {
    var href = "moto.html?id=" + encodeURIComponent(m.id);
    var meta = [m.cylindree + " cm³", m.puissance + " ch"];
    var s = selle(m);
    if (s) meta.push("selle " + s);
    var fav = isFav(m.id);

    return '' +
      '<article class="moto-card">' +
        '<button type="button" class="fav-btn' + (fav ? " is-on" : "") + '" data-fav="' + esc(m.id) + '"' +
          ' aria-pressed="' + fav + '" aria-label="Sauvegarder la moto">' + HEART_SVG + '</button>' +
        '<a class="moto-card__link" href="' + href + '">' +
          '<div class="moto-card__media">' + motoImg(m) +
            '<span class="moto-card__brand">' + esc(m.marque) + '</span>' +
            (m.nouveaute ? '<span class="moto-card__tag">Nouveaut&eacute;</span>' : '') +
          '</div>' +
          '<div class="moto-card__body">' +
            '<h3 class="moto-card__modele">' + esc(m.marque + " " + m.modele) + '</h3>' +
            '<div class="moto-card__specs"><span class="chip">' + esc(famille(m)) + '</span></div>' +
            '<p class="moto-card__meta">' + esc(meta.join(" · ")) + '</p>' +
            '<p class="moto-card__year">' + esc(m.annee) + '</p>' +
            '<div class="moto-card__foot">' +
              '<p class="price' + (m.prix == null ? " price--ask" : "") + '">' + formatPrix(m.prix) + '</p>' +
              '<span class="btn">Voir la moto</span>' +
            '</div>' +
          '</div>' +
        '</a>' +
      '</article>';
  }

  /* ---------- Coordonnées du site --------------------------------------- */

  function hydrateSite() {
    $all("[data-site]").forEach(function (el) {
      var key = el.getAttribute("data-site");
      if (SITE[key] != null) el.textContent = SITE[key];
    });
    $all("[data-site-href]").forEach(function (el) {
      var kind = el.getAttribute("data-site-href");
      if (kind === "tel") el.href = "tel:" + (SITE.telephoneLien || "");
      if (kind === "tel2") el.href = "tel:" + (SITE.telephone2Lien || "");
      if (kind === "mail") el.href = "mailto:" + (SITE.email || "");
      if (kind === "whatsapp") {
        el.href = "https://wa.me/" + String(SITE.whatsapp || "").replace(/[^0-9]/g, "");
        el.target = "_blank"; el.rel = "noopener";
      }
      if (kind === "maps") {
        el.href = SITE.mapsUrl || ("https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent(SITE.adresseMapsQuery || SITE.adresse || ""));
        el.target = "_blank"; el.rel = "noopener";
      }
    });
    $all("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
    if (SITE.reseaux) {
      $all("[data-social]").forEach(function (el) {
        var k = el.getAttribute("data-social");
        if (SITE.reseaux[k]) el.href = SITE.reseaux[k];
      });
    }
    var mapFrame = $("[data-map]");
    if (mapFrame) {
      mapFrame.src = "https://maps.google.com/maps?q=" +
        encodeURIComponent(SITE.adresseMapsQuery || SITE.adresse || "") +
        "&output=embed";
    }
  }

  /* Bouton WhatsApp flottant (toutes les pages) */
  function initFloatingWhatsApp() {
    if ($(".wa-float")) return;
    var a = document.createElement("a");
    a.className = "wa-float";
    a.setAttribute("data-site-href", "whatsapp");
    a.setAttribute("aria-label", "Discuter sur WhatsApp");
    a.href = "#";
    a.innerHTML = WA_SVG;
    document.body.appendChild(a);
  }

  /* ---------- Horaires ------------------------------------------------- */

  function renderHours() {
    var host = $("[data-hours]");
    if (!host || !SITE.horaires) return;
    host.innerHTML = SITE.horaires.map(function (h) {
      return '<li><span>' + h.jour + '</span><span>' + h.h + '</span></li>';
    }).join("");
  }

  /* ---------- Navigation ------------------------------------------------- */

  function initNav() {
    var toggle = $(".nav-toggle");
    var nav = $("#nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") nav.classList.remove("is-open");
      });
    }
    var here = window.location.pathname.split("/").pop() || "index.html";
    if (here === "moto.html") here = "catalogue.html";
    $all("#nav a[href]").forEach(function (a) {
      var target = a.getAttribute("href").split("?")[0];
      if (target === here) a.classList.add("is-active");
    });
  }

  /* ---------- Bandeau marques ------------------------------------------- */

  function renderMarques() {
    var host = $("[data-brands]");
    if (!host) return;

    var list = (window.MARQUES_VISUELS && window.MARQUES_VISUELS.length)
      ? window.MARQUES_VISUELS
      : MARQUES.map(function (n) { return { nom: n }; });

    var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

    host.innerHTML = list.map(function (b) {
      var n = MOTOS.filter(function (m) { return m.marque === b.nom; }).length;
      return '<a class="brand-card" href="catalogue.html?marque=' + encodeURIComponent(b.nom) + '"' +
          (b.fond ? ' style="--card-bg:' + esc(b.fond) + '"' : '') + '>' +
        '<div class="brand-card__info">' +
          '<span class="brand-card__name">' + esc(b.nom) + '</span>' +
          (b.slogan ? '<span class="brand-card__slogan">' + esc(b.slogan) + '</span>' : '') +
          '<span class="brand-card__count">' + n + ' mod&egrave;le' + (n > 1 ? 's' : '') + '</span>' +
          '<span class="brand-card__cta">Voir la gamme ' + arrow + '</span>' +
        '</div>' +
        (b.image
          ? '<img class="brand-card__img" loading="lazy" alt="' + esc(b.nom) + '" src="assets/img/motos/' + esc(b.image) + '">'
          : '') +
      '</a>';
    }).join("");

    function step(dir) {
      var card = $(".brand-card", host);
      var w = card ? card.getBoundingClientRect().width + 20 : 320;
      host.scrollBy({ left: dir * w, behavior: "smooth" });
    }
    var prev = $("[data-brands-prev]");
    var next = $("[data-brands-next]");
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });

    function updateNav() {
      var max = host.scrollWidth - host.clientWidth - 2;
      if (prev) prev.disabled = host.scrollLeft <= 2;
      if (next) next.disabled = host.scrollLeft >= max;
    }
    host.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    updateNav();
  }

  /* ---------- Services (accueil) ------------------------------------- */

  function renderServices() {
    var host = $("[data-services]");
    if (!host || !SITE.services) return;
    var icons = [
      '<path d="M3 13l2-5a3 3 0 0 1 3-2h8a3 3 0 0 1 3 2l2 5M5 17h14M7 17v2M17 17v2"/><circle cx="7.5" cy="13.5" r="1.5"/><circle cx="16.5" cy="13.5" r="1.5"/>',
      '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 2 2 6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-1.4-1.4z"/>',
      '<path d="M20 7 12 3 4 7v10l8 4 8-4z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
      '<path d="M3 7h13l3 4v5h-3M3 7v9h2M8 16h6"/><circle cx="6.5" cy="16.5" r="2"/><circle cx="17.5" cy="16.5" r="2"/>'
    ];
    host.innerHTML = SITE.services.map(function (s, i) {
      return '<div class="card">' +
        '<div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
          'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
          (icons[i % icons.length]) + '</svg></div>' +
        '<h3>' + s.titre + '</h3><p>' + s.texte + '</p></div>';
    }).join("");
  }

  /* ---------- Sélection vedette (accueil) ------------------------------ */

  function renderFeatured() {
    var host = $("[data-featured]");
    if (!host) return;
    var limit = parseInt(host.getAttribute("data-featured") || "6", 10);
    var list = MOTOS.filter(function (m) { return m.nouveaute; });
    MOTOS.forEach(function (m) {
      if (list.length < limit && list.indexOf(m) === -1) list.push(m);
    });
    host.innerHTML = list.slice(0, limit).map(motoCard).join("");
  }

  /* ---------- Galerie (photos + vidéos Facebook) -------------------- */

  function renderGalerie() {
    var vHost = $("[data-fb-videos]");
    if (vHost && SITE.facebookVideos && SITE.facebookVideos.length) {
      vHost.innerHTML = SITE.facebookVideos.map(function (id) {
        var href = encodeURIComponent("https://www.facebook.com/reel/" + id);
        return '<div class="video-embed"><iframe loading="lazy" ' +
          'src="https://www.facebook.com/plugins/video.php?href=' + href +
          '&show_text=false&width=360&height=640" ' +
          'style="border:none;overflow:hidden" scrolling="no" frameborder="0" ' +
          'allowfullscreen="true" ' +
          'allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" ' +
          'title="Vidéo Facebook Motos Gaz"></iframe></div>';
      }).join("");
    } else if (vHost) {
      var blk = vHost.closest("[data-fb-videos-block]");
      if (blk) blk.remove();
    }

    var gHost = $("[data-galerie]");
    if (gHost && window.GALERIE && window.GALERIE.length) {
      gHost.innerHTML = window.GALERIE.map(function (g) {
        var ph = placeholder(g.legende || "Motos Gaz");
        return '<figure class="galerie-item">' +
          '<img loading="lazy" alt="' + esc(g.legende || "Motos Gaz") + '" ' +
          'src="assets/img/galerie/' + esc(g.image) + '" ' +
          "onerror=\"this.onerror=null;this.src='" + ph + "'\">" +
          (g.legende ? '<figcaption>' + esc(g.legende) + '</figcaption>' : '') +
          '</figure>';
      }).join("");
    }
  }

  /* ---------- Catalogue : onglets, filtres, recherche, tri, pagination -- */

  function renderCatalogue() {
    var host = $("[data-catalogue]");
    if (!host) return;

    var PAGE_SIZE = 9;
    var grid = $("[data-catalogue-grid]", host);
    var tabsHost = $("[data-cat-tabs]");
    var asideEl = $("[data-cat-filters]");
    var ccHost = $("[data-facet-cc]");
    var marqueHost = $("[data-facet-marque]");
    var favBtn = $("[data-set='fav']");
    var countHost = $("[data-catalogue-count]");
    var pagerHost = $("[data-pager]");
    var qInput = $("[data-q]");
    var sortSel = $("[data-sort]");
    var pminInput = $("[data-pmin]");
    var pmaxInput = $("[data-pmax]");
    var resetBtn = $("[data-reset]");
    var statsHost = $("[data-cat-stats]");

    var famsPresent = FAMILLES.filter(function (f) {
      return MOTOS.some(function (m) { return famille(m) === f; });
    });
    var marquesList = MOTOS.map(function (m) { return m.marque; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; })
      .sort();

    if (statsHost) {
      statsHost.innerHTML =
        '<div><strong>' + MOTOS.length + '</strong><span>Mod&egrave;les au catalogue</span></div>' +
        '<div><strong>' + marquesList.length + '</strong><span>Marques</span></div>' +
        '<div><strong>' + famsPresent.length + '</strong><span>Cat&eacute;gories</span></div>';
    }

    function readState() {
      var s = {
        fam: getParam("cat") || "all",
        marque: getParam("marque") || "all",
        cc: getParam("cc") || "all",
        q: getParam("q") || "",
        sort: getParam("sort") || "recent",
        pmin: getParam("pmin") || "",
        pmax: getParam("pmax") || "",
        page: parseInt(getParam("page") || "1", 10) || 1,
        fav: getParam("fav") === "1"
      };
      if (famsPresent.indexOf(s.fam) === -1) s.fam = "all";
      if (marquesList.indexOf(s.marque) === -1) s.marque = "all";
      if (!CC_RANGES.some(function (r) { return r.id === s.cc; })) s.cc = "all";
      return s;
    }
    var state = readState();

    function ccId(c) {
      for (var i = 0; i < CC_RANGES.length; i++) if (CC_RANGES[i].test(c)) return CC_RANGES[i].id;
      return "";
    }

    function matches(m, skip) {
      skip = skip || {};
      if (!skip.fam && state.fam !== "all" && famille(m) !== state.fam) return false;
      if (!skip.marque && state.marque !== "all" && m.marque !== state.marque) return false;
      if (!skip.cc && state.cc !== "all" && ccId(m.cylindree) !== state.cc) return false;
      if (!skip.fav && state.fav && !isFav(m.id)) return false;
      if (!skip.price && (state.pmin !== "" || state.pmax !== "")) {
        if (m.prix == null) return false;
        if (state.pmin !== "" && m.prix < Number(state.pmin)) return false;
        if (state.pmax !== "" && m.prix > Number(state.pmax)) return false;
      }
      if (!skip.q && state.q) {
        var hay = norm([m.marque, m.modele, m.categorie, famille(m), m.type].join(" "));
        var ok = norm(state.q).split(/\s+/).every(function (t) { return !t || hay.indexOf(t) !== -1; });
        if (!ok) return false;
      }
      return true;
    }

    function sortList(list) {
      var inf = Infinity;
      var keyed = list.map(function (m, i) { return { m: m, i: i }; });
      var cmp = {
        recent: function (a, b) {
          var sa = (a.m.nouveaute ? 1000 : 0) + (a.m.annee || 0);
          var sb = (b.m.nouveaute ? 1000 : 0) + (b.m.annee || 0);
          return sb - sa;
        },
        "prix-asc": function (a, b) { return (a.m.prix == null ? inf : a.m.prix) - (b.m.prix == null ? inf : b.m.prix); },
        "prix-desc": function (a, b) {
          var pa = a.m.prix == null ? -1 : a.m.prix, pb = b.m.prix == null ? -1 : b.m.prix;
          return pb - pa;
        },
        "cc-asc": function (a, b) { return a.m.cylindree - b.m.cylindree; },
        "cc-desc": function (a, b) { return b.m.cylindree - a.m.cylindree; },
        az: function (a, b) {
          return (a.m.marque + " " + a.m.modele).localeCompare(b.m.marque + " " + b.m.modele, "fr");
        }
      }[state.sort] || null;
      keyed.sort(function (a, b) { return (cmp ? cmp(a, b) : 0) || a.i - b.i; });
      return keyed.map(function (k) { return k.m; });
    }

    function count(skip) {
      return MOTOS.filter(function (m) { return matches(m, skip); }).length;
    }

    function syncUrl() {
      var p = new URLSearchParams();
      if (state.fam !== "all") p.set("cat", state.fam);
      if (state.marque !== "all") p.set("marque", state.marque);
      if (state.cc !== "all") p.set("cc", state.cc);
      if (state.q) p.set("q", state.q);
      if (state.sort !== "recent") p.set("sort", state.sort);
      if (state.pmin !== "") p.set("pmin", state.pmin);
      if (state.pmax !== "") p.set("pmax", state.pmax);
      if (state.fav) p.set("fav", "1");
      if (state.page > 1) p.set("page", state.page);
      var qs = p.toString();
      try { history.replaceState(null, "", qs ? "?" + qs : window.location.pathname); } catch (e) { /* file:// */ }
    }

    function facetBtn(set, value, label, n, active, disabled) {
      return '<button type="button" class="facet__btn' + (active ? " is-active" : "") + '"' +
        ' data-set="' + set + '" data-value="' + esc(value) + '"' + (disabled ? " disabled" : "") + '>' +
        '<span>' + esc(label) + '</span>' + (n == null ? "" : '<small>' + n + '</small>') + '</button>';
    }

    function drawTabs() {
      if (!tabsHost) return;
      var total = count({ fam: true });
      tabsHost.innerHTML =
        '<button type="button" class="cat-tab' + (state.fam === "all" ? " is-active" : "") +
          '" data-set="fam" data-value="all">Tous types<span>' + total + '</span></button>' +
        famsPresent.map(function (f) {
          var n = MOTOS.filter(function (m) { return famille(m) === f && matches(m, { fam: true }); }).length;
          return '<button type="button" class="cat-tab' + (state.fam === f ? " is-active" : "") +
            '" data-set="fam" data-value="' + esc(f) + '">' + esc(f) + '<span>' + n + '</span></button>';
        }).join("");
    }

    function drawFacets() {
      if (ccHost) {
        ccHost.innerHTML = facetBtn("cc", "all", "Toutes cylindrées", null, state.cc === "all") +
          CC_RANGES.map(function (r) {
            var n = MOTOS.filter(function (m) { return r.test(m.cylindree) && matches(m, { cc: true }); }).length;
            return facetBtn("cc", r.id, r.label, n, state.cc === r.id, n === 0 && state.cc !== r.id);
          }).join("");
      }
      if (marqueHost) {
        marqueHost.innerHTML = facetBtn("marque", "all", "Toutes marques", null, state.marque === "all") +
          marquesList.map(function (b) {
            var n = MOTOS.filter(function (m) { return m.marque === b && matches(m, { marque: true }); }).length;
            return facetBtn("marque", b, b, n, state.marque === b, n === 0 && state.marque !== b);
          }).join("");
      }
      if (favBtn) {
        favBtn.classList.toggle("is-active", state.fav);
        favBtn.innerHTML = '<span>Mes favoris</span><small>' + favs.length + '</small>';
      }
    }

    function hasActiveFilters() {
      return state.fam !== "all" || state.marque !== "all" || state.cc !== "all" || state.q ||
        state.pmin !== "" || state.pmax !== "" || state.fav;
    }

    function draw() {
      var list = sortList(MOTOS.filter(function (m) { return matches(m); }));
      var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      if (state.page > pages) state.page = pages;
      if (state.page < 1) state.page = 1;
      var slice = list.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

      grid.innerHTML = slice.length
        ? slice.map(motoCard).join("")
        : '<p class="empty">' + (state.fav && !favs.length
            ? "Vous n’avez pas encore de favoris : cliquez sur le cœur d’une moto pour la sauvegarder."
            : "Aucune moto ne correspond à ces critères.") +
          ' <button type="button" class="link" data-reset>Réinitialiser les filtres</button></p>';

      if (countHost) {
        countHost.textContent = list.length + (list.length > 1 ? " résultats" : " résultat");
      }
      if (pagerHost) {
        pagerHost.innerHTML = pages > 1
          ? '<button type="button" data-page="' + (state.page - 1) + '"' + (state.page <= 1 ? " disabled" : "") + '>Précédent</button>' +
            '<span>Page ' + state.page + ' sur ' + pages + '</span>' +
            '<button type="button" data-page="' + (state.page + 1) + '"' + (state.page >= pages ? " disabled" : "") + '>Suivant</button>'
          : "";
      }
      if (resetBtn) resetBtn.hidden = !hasActiveFilters();

      drawTabs();
      drawFacets();
      syncUrl();
    }

    function setInputsFromState() {
      if (qInput) qInput.value = state.q;
      if (sortSel) sortSel.value = state.sort;
      if (pminInput) pminInput.value = state.pmin;
      if (pmaxInput) pmaxInput.value = state.pmax;
    }

    function resetAll() {
      state = { fam: "all", marque: "all", cc: "all", q: "", sort: "recent", pmin: "", pmax: "", page: 1, fav: false };
      setInputsFromState();
      draw();
    }

    /* Événements */
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-set],[data-page],[data-reset],[data-filters-toggle]") : null;
      if (!t) return;
      if (t.hasAttribute("data-reset")) { resetAll(); return; }
      if (t.hasAttribute("data-filters-toggle")) {
        if (asideEl) asideEl.classList.toggle("is-open");
        return;
      }
      if (t.hasAttribute("data-page")) {
        state.page = parseInt(t.getAttribute("data-page"), 10) || 1;
        draw();
        host.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      var name = t.getAttribute("data-set");
      var value = t.getAttribute("data-value");
      if (name === "fav") state.fav = !state.fav;
      else state[name] = (state[name] === value && name !== "fam") ? "all" : value;
      state.page = 1;
      draw();
    });

    var qTimer;
    if (qInput) qInput.addEventListener("input", function () {
      clearTimeout(qTimer);
      qTimer = setTimeout(function () { state.q = qInput.value.trim(); state.page = 1; draw(); }, 150);
    });
    if (sortSel) sortSel.addEventListener("change", function () { state.sort = sortSel.value; state.page = 1; draw(); });
    [pminInput, pmaxInput].forEach(function (inp) {
      if (!inp) return;
      inp.addEventListener("change", function () {
        state.pmin = pminInput.value.trim();
        state.pmax = pmaxInput.value.trim();
        state.page = 1;
        draw();
      });
    });
    document.addEventListener("favs:changed", function () {
      if (state.fav) draw(); else drawFacets();
    });

    setInputsFromState();
    draw();
  }

  /* ---------- Fiche moto (mise en page détail) ---------------------------- */

  var COLOR_HEX = {
    noir: "#111111", gris: "#8a8f98", rouge: "#d71920", bleu: "#1e50d6", blanc: "#f4f4f4",
    vert: "#2a9d5c", jaune: "#f2c200", orange: "#ee7a13", argent: "#c0c4ca", sable: "#c9b48a",
    titane: "#6d717a", marron: "#6b4a2f"
  };

  function colorDot(name) {
    var n = norm(name), hex = "#9aa0aa";
    Object.keys(COLOR_HEX).some(function (k) {
      if (n.indexOf(k) !== -1) { hex = COLOR_HEX[k]; return true; }
      return false;
    });
    return hex;
  }

  var SPEC_GROUPS = [
    { titre: "Moteur", keys: ["Moteur", "Alésage × course", "Cylindrée", "Puissance", "Puissance fiscale", "Couple", "Alimentation", "Embrayage"] },
    { titre: "Transmission", keys: ["Transmission"] },
    { titre: "Partie cycle", keys: ["Cadre", "Suspension avant", "Suspension arrière", "Freinage", "Frein avant", "Frein arrière", "Roues", "Roue avant", "Pneus"] },
    { titre: "Pratique", keys: ["Poids", "Hauteur de selle", "Garde au sol", "Empattement", "Dimensions", "Électronique", "Instrumentation", "Éclairage", "Équipement"] },
    { titre: "Contenances", keys: ["Réservoir"] }
  ];

  function ico(path, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + '>' + path + '</svg>';
  }
  var ICO = {
    truck: '<path d="M10 17h4V5H2v12h3"/><path d="M14 8h4l4 4v5h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1.2.4 2.4.8 3.5a2 2 0 0 1-.5 2.1L8.1 10.5a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1.1.4 2.3.7 3.5.8a2 2 0 0 1 1.7 2z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    box: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'
  };

  function renderDetail() {
    var host = $("[data-moto-detail]");
    if (!host) return;

    var m = MOTOS.filter(function (x) { return x.id === getParam("id"); })[0];

    if (!m) {
      host.innerHTML =
        '<div class="container section">' +
          '<p class="empty">Ce modèle est introuvable. ' +
          '<a href="catalogue.html">Retour au catalogue</a>.</p>' +
        '</div>';
      return;
    }

    var nomComplet = m.marque + " " + m.modele;
    var prixTxt = formatPrix(m.prix);
    document.title = nomComplet + " — Prix Maroc : " + prixTxt + " | " + (SITE.nom || "Motos Gaz");
    var metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", nomComplet + " neuve à Casablanca : " + prixTxt +
      ". Fiche technique complète, livraison partout au Maroc.");

    var fam = famille(m);
    var sameBrand = MOTOS.filter(function (x) { return x.id !== m.id && x.marque === m.marque; });
    var aside = MOTOS.filter(function (x) { return x.marque !== m.marque && famille(x) === fam; });
    MOTOS.forEach(function (x) {
      if (x.marque !== m.marque && aside.indexOf(x) === -1) aside.push(x);
    });
    aside = aside.slice(0, 4);

    /* Lien WhatsApp pré-rempli */
    var num = String(SITE.whatsapp || "").replace(/[^0-9]/g, "");
    function waLink(couleur) {
      var t = "Bonjour Motos Gaz, je suis intéressé(e) par la " + nomComplet +
        (couleur ? " en coloris " + couleur : "") +
        (m.prix != null ? " (" + prixTxt + ")" : "") + ". Est-elle disponible ? Quel délai de livraison ?";
      return "https://wa.me/" + num + "?text=" + encodeURIComponent(t);
    }
    var couleurs = m.couleurs || [];
    var waHref = waLink(couleurs[0]);

    /* Coloris (sélecteur de variante) */
    var colors = couleurs.map(function (c, i) {
      return '<button type="button" class="pd-color' + (i === 0 ? ' is-on' : '') + '" role="radio" ' +
        'aria-checked="' + (i === 0) + '" data-color="' + esc(c) + '">' +
        '<i style="background:' + colorDot(c) + '"></i>' + esc(c) + '</button>';
    }).join("");

    /* Fiche technique : cartes par groupe */
    function card(titre, rows) {
      if (!rows.length) return "";
      return '<details class="pd-card" open><summary>' + esc(titre) + '</summary><dl class="pd-rows">' +
        rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join("") +
        '</dl></details>';
    }
    var cards = card("Général", [
      ["Type", m.type], ["Catégorie", fam], ["Permis requis", permisLabel(m.permis)], ["Année modèle", m.annee]
    ]);
    if (m.specs) {
      var used = {};
      SPEC_GROUPS.forEach(function (g) {
        var rows = [];
        g.keys.forEach(function (k) { if (m.specs[k] != null) { rows.push([k, m.specs[k]]); used[k] = 1; } });
        if (g.titre === "Pratique") {
          Object.keys(m.specs).forEach(function (k) { if (!used[k]) { rows.push([k, m.specs[k]]); used[k] = 1; } });
        }
        cards += card(g.titre, rows);
      });
    } else {
      cards += card("Moteur", [["Cylindrée", m.cylindree + " cm³"], ["Puissance", m.puissance + " ch"]]);
    }

    function mini(x) {
      return '<a class="pd-mini" href="moto.html?id=' + encodeURIComponent(x.id) + '">' +
        '<span class="pd-mini__img">' + motoImg(x) + '</span>' +
        '<span class="pd-mini__name">' + esc(x.marque + " " + x.modele) + '</span>' +
        '<span class="pd-mini__price">' + formatPrix(x.prix) + '</span></a>';
    }

    host.innerHTML =
      '<div class="pd-banner">' + ico(ICO.truck) + 'Livraison partout au Maroc</div>' +
      '<div class="pd-crumb"><div class="container pd-crumb__inner">' +
        '<a href="catalogue.html?marque=' + encodeURIComponent(m.marque) + '">' + ico(ICO.back) + esc(m.marque) + '</a>' +
        '<b>' + esc(nomComplet) + '</b>' +
      '</div></div>' +

      '<div class="container pd">' +
        '<div class="pd__grid">' +

          '<div class="pd-gallery">' + motoImg(m) +
            '<button type="button" class="pd-gallery__expand" data-expand aria-label="Agrandir la photo">' + ico(ICO.expand) + '</button>' +
            (couleurs.length
              ? '<span class="pd-gallery__chip"><i style="background:' + colorDot(couleurs[0]) + '"></i>' +
                '<span data-color-chip>' + esc(couleurs[0]) + '</span></span>' : '') +
          '</div>' +

          '<div class="pd-info">' +
            '<div class="pd-brand">' + esc(m.marque) + (m.nouveaute ? ' · Nouveauté ' + esc(m.annee) : '') + '</div>' +
            '<h1 class="pd-title">' + esc(nomComplet) + '</h1>' +
            (colors
              ? '<div class="pd-label">Choisissez votre couleur<span>— <b data-color-label>' + esc(couleurs[0]) + '</b></span></div>' +
                '<div class="pd-colors" role="radiogroup" aria-label="Coloris">' + colors + '</div>'
              : '') +
            '<div class="pd-label pd-label--bar">Prix</div>' +
            '<p class="pd-price' + (m.prix == null ? ' pd-price--ask' : '') + '">' + prixTxt + '</p>' +
            '<p class="pd-price-note">' + (m.prix == null
              ? 'Contactez-nous pour un devis personnalisé.'
              : 'Prix neuf indicatif, hors options et promotions en cours.') + '</p>' +
            '<div class="pd-status">' + ico(ICO.check) + 'Moto neuve — disponibilité confirmée sur WhatsApp</div>' +
            '<div class="pd-cta">' +
              '<a class="btn" href="' + waHref + '" target="_blank" rel="noopener">' + WA_SVG + 'Réserver sur WhatsApp</a>' +
              '<a class="btn btn--ghost" data-site-href="tel" href="#">' + ico(ICO.phone) + 'Appeler</a>' +
            '</div>' +
            '<a class="pd-quote" href="contact.html?moto=' + encodeURIComponent(nomComplet) + '">ou demander un devis par formulaire →</a>' +
            '<ul class="pd-trust">' +
              '<li>' + ico(ICO.shield) + 'Garantie constructeur</li>' +
              '<li>' + ico(ICO.truck) + 'Livraison nationale</li>' +
              '<li>' + ico(ICO.box) + 'Retrait en magasin</li>' +
              '<li>' + ico(ICO.pin) + 'Showroom ' + esc(SITE.ville || "Casablanca") + '</li>' +
            '</ul>' +
            '<div class="pd-about"><div class="pd-label pd-label--bar">Aperçu</div><p>' + esc(m.description) + '</p></div>' +
          '</div>' +

          (aside.length
            ? '<aside class="pd-aside"><p class="pd-aside__title">Vous aimerez aussi</p>' +
              '<div class="pd-aside__list">' + aside.map(mini).join("") + '</div></aside>'
            : '') +
        '</div>' +

        '<section class="pd-spec"><h2 class="pd-spec__title">Fiche technique</h2>' +
          '<div class="pd-spec__cols">' + cards + '</div></section>' +

        (sameBrand.length
          ? '<section class="pd-more"><h2>Plus de ' + esc(m.marque) + '</h2>' +
            '<div class="moto-grid">' + sameBrand.map(motoCard).join("") + '</div></section>'
          : '') +
      '</div>' +

      '<div class="pd-buybar"><div class="pd-buybar__price"><small>' + esc(nomComplet) + '</small>' + prixTxt + '</div>' +
        '<a class="btn" href="' + waHref + '" target="_blank" rel="noopener">' + WA_SVG + 'WhatsApp</a></div>';

    document.body.classList.add("has-buybar");

    /* Sélection d'un coloris : libellé, pastille de la photo et liens WhatsApp */
    $all(".pd-color", host).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var c = btn.getAttribute("data-color");
        $all(".pd-color", host).forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-on", on);
          b.setAttribute("aria-checked", on ? "true" : "false");
        });
        var lab = $("[data-color-label]", host); if (lab) lab.textContent = c;
        var chip = $("[data-color-chip]", host); if (chip) chip.textContent = c;
        var chipDot = $(".pd-gallery__chip i", host); if (chipDot) chipDot.style.background = colorDot(c);
        var href = waLink(c);
        $all(".pd-cta .btn:first-child, .pd-buybar .btn", host).forEach(function (a) { a.href = href; });
      });
    });

    /* Visionneuse plein écran */
    var expand = $("[data-expand]", host);
    if (expand) expand.addEventListener("click", function () {
      var src = $(".pd-gallery > img", host).currentSrc || $(".pd-gallery > img", host).src;
      var box = document.createElement("div");
      box.className = "lightbox";
      box.innerHTML = '<img alt="' + esc(nomComplet) + '" src="' + src + '"><button type="button" aria-label="Fermer">&times;</button>';
      function close() { box.remove(); document.removeEventListener("keydown", onKey); }
      function onKey(e) { if (e.key === "Escape") close(); }
      box.addEventListener("click", function (e) { if (e.target !== $("img", box)) close(); });
      document.addEventListener("keydown", onKey);
      document.body.appendChild(box);
    });

    hydrateSite();
    refreshFavUI();
  }

  /* ---------- Formulaire de contact -------------------------------- */

  function initContactForm() {
    var form = $("[data-contact-form]");
    if (!form) return;

    var moto = getParam("moto");
    if (moto) {
      var msg = $("#message", form);
      var sujet = $("#sujet", form);
      if (sujet) sujet.value = "devis";
      if (msg && !msg.value) {
        msg.value = "Bonjour, je souhaite un devis pour la " + moto +
          " (disponibilité, prix, délai de livraison). Merci de me recontacter.";
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var val = function (id) {
        var el = $("#" + id, form);
        return el ? String(el.value).trim() : "";
      };
      var sujetEl = $("#sujet", form);
      var sujetLabel = sujetEl && sujetEl.options[sujetEl.selectedIndex]
        ? sujetEl.options[sujetEl.selectedIndex].text : "";

      var texte =
        "Bonjour Motos Gaz, demande depuis le site :\n" +
        "• Nom : " + (val("nom") || "—") + "\n" +
        "• Téléphone : " + (val("tel") || "—") + "\n" +
        "• E-mail : " + (val("email") || "—") + "\n" +
        "• Sujet : " + (sujetLabel || "—") + "\n\n" +
        (val("message") || "");

      var num = String(SITE.whatsapp || "").replace(/[^0-9]/g, "");
      var waUrl = "https://wa.me/" + num + "?text=" + encodeURIComponent(texte);

      window.open(waUrl, "_blank", "noopener");

      form.hidden = true;
      var ok = $("[data-contact-success]");
      if (ok) {
        var fb = $("[data-wa-fallback]", ok);
        if (fb) { fb.href = waUrl; }
        ok.style.display = "block";
        ok.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  /* ---------- Init ------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    initFloatingWhatsApp();
    hydrateSite();
    initNav();
    initFavs();
    renderMarques();
    renderServices();
    renderHours();
    renderGalerie();
    renderFeatured();
    renderCatalogue();
    renderDetail();
    initContactForm();
    refreshFavUI();
  });
})();
