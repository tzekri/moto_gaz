/* ===========================================================================
   VÉLOCITÉ MOTOS — script principal
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

  function formatPrix(n) {
    if (n == null || n === "" || isNaN(n)) return "Prix sur demande";
    return Number(n).toLocaleString("fr-FR") + " DH";
  }

  function permisLabel(p) {
    return p === "A1" ? "Permis A1 (≤125)" : "Permis A";
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function slug(s) {
    return String(s).toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  /* Visuel de secours si la photo n'existe pas encore dans assets/img/motos/ */
  function placeholder(marque, modele) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="550" viewBox="0 0 800 550">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#22262f"/><stop offset="1" stop-color="#14161b"/>' +
      '</linearGradient></defs>' +
      '<rect width="800" height="550" fill="url(#g)"/>' +
      '<g fill="none" stroke="#e10600" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">' +
      '<circle cx="235" cy="370" r="88"/><circle cx="565" cy="370" r="88"/>' +
      '<path d="M235 370 L360 370 L430 285 L545 285 M565 370 L470 220 L360 220 M300 285 L360 285"/>' +
      '<path d="M470 220 q40 -35 80 -10"/></g>' +
      '<text x="400" y="120" text-anchor="middle" fill="#a6acb8" font-family="Segoe UI,Arial,sans-serif" ' +
      'font-size="34" font-weight="700" letter-spacing="3">' + String(marque).toUpperCase() + '</text>' +
      '<text x="400" y="165" text-anchor="middle" fill="#71767f" font-family="Segoe UI,Arial,sans-serif" ' +
      'font-size="22">' + String(modele) + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function motoImg(m, cls) {
    var fallback = placeholder(m.marque, m.modele);
    return '<img loading="lazy" alt="' + m.marque + " " + m.modele + '"' +
      (cls ? ' class="' + cls + '"' : "") +
      ' src="assets/img/motos/' + m.image + '"' +
      " onerror=\"this.onerror=null;this.src='" + fallback + "'\">";
  }

  function motoCard(m) {
    return '' +
      '<article class="moto-card">' +
        '<a class="moto-card__media" href="moto.html?id=' + encodeURIComponent(m.id) + '">' +
          (m.nouveaute ? '<span class="moto-card__tag">Nouveaut&eacute;</span>' : '') +
          '<span class="moto-card__permis">' + m.permis + '</span>' +
          motoImg(m) +
        '</a>' +
        '<div class="moto-card__body">' +
          '<div class="moto-card__marque">' + m.marque + ' · ' + m.type + '</div>' +
          '<h3 class="moto-card__modele">' + m.modele + '</h3>' +
          '<div class="moto-card__specs">' +
            '<span class="chip">' + m.categorie + '</span>' +
            '<span class="chip">' + m.cylindree + ' cm³</span>' +
            '<span class="chip">' + m.puissance + ' ch</span>' +
          '</div>' +
          '<div class="moto-card__foot">' +
            '<span class="price"><small>' + (m.prix == null ? '&nbsp;' : '&Agrave; partir de') +
              '</small><b>' + formatPrix(m.prix) + '</b></span>' +
            '<a class="btn btn--sm" href="moto.html?id=' + encodeURIComponent(m.id) + '">D&eacute;tails</a>' +
          '</div>' +
        '</div>' +
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
    $all("#nav a[href]").forEach(function (a) {
      var target = a.getAttribute("href").split("?")[0];
      if (target === here || (here === "" && target === "index.html")) {
        a.classList.add("is-active");
      }
    });
  }

  /* ---------- Bandeau marques ------------------------------------------- */

  function renderMarques() {
    var host = $("[data-marques]");
    if (!host) return;
    host.innerHTML =
      '<span class="marques__label">Nos marques distribuées</span>' +
      MARQUES.map(function (name) {
        return '<a class="marques__item" href="catalogue.html?marque=' +
          encodeURIComponent(name) + '">' + name + '</a>';
      }).join("");
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
      vHost.closest("[data-fb-videos-block]") && vHost.closest("[data-fb-videos-block]").remove();
    }

    var gHost = $("[data-galerie]");
    if (gHost && window.GALERIE && window.GALERIE.length) {
      gHost.innerHTML = window.GALERIE.map(function (g) {
        var ph = placeholder("Motos Gaz", g.legende || "");
        return '<figure class="galerie-item">' +
          '<img loading="lazy" alt="' + (g.legende || "Motos Gaz") + '" ' +
          'src="assets/img/galerie/' + g.image + '" ' +
          "onerror=\"this.onerror=null;this.src='" + ph + "'\">" +
          (g.legende ? '<figcaption>' + g.legende + '</figcaption>' : '') +
          '</figure>';
      }).join("");
    }
  }

  /* ---------- Catalogue + filtres ------------------------------------- */

  function renderCatalogue() {
    var host = $("[data-catalogue]");
    if (!host) return;

    var grid = $("[data-catalogue-grid]", host) || host;
    var filtersHost = $("[data-catalogue-filters]");
    var countHost = $("[data-catalogue-count]");

    var state = {
      marque: getParam("marque") || "all",
      categorie: getParam("cat") || "all"
    };

    var categories = ["all"].concat(
      MOTOS.map(function (m) { return m.categorie; })
        .filter(function (v, i, a) { return a.indexOf(v) === i; })
        .sort()
    );
    var marques = ["all"].concat(
      MOTOS.map(function (m) { return m.marque; })
        .filter(function (v, i, a) { return a.indexOf(v) === i; })
        .sort()
    );

    function label(v) { return v === "all" ? "Toutes" : v; }

    function buildFilters() {
      if (!filtersHost) return;
      filtersHost.innerHTML =
        '<div class="filters" data-group="marque">' +
          marques.map(function (v) {
            return '<button class="filter-btn' + (v === state.marque ? " is-active" : "") +
              '" data-value="' + v + '">' + label(v) + '</button>';
          }).join("") +
        '</div>' +
        '<div class="filters" data-group="categorie">' +
          categories.map(function (v) {
            return '<button class="filter-btn' + (v === state.categorie ? " is-active" : "") +
              '" data-value="' + v + '">' + (v === "all" ? "Tous types" : v) + '</button>';
          }).join("") +
        '</div>';

      $all(".filters", filtersHost).forEach(function (row) {
        var group = row.getAttribute("data-group");
        row.addEventListener("click", function (e) {
          var btn = e.target.closest(".filter-btn");
          if (!btn) return;
          state[group] = btn.getAttribute("data-value");
          $all(".filter-btn", row).forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          syncUrl();
          draw();
        });
      });
    }

    function syncUrl() {
      var p = new URLSearchParams();
      if (state.marque !== "all") p.set("marque", state.marque);
      if (state.categorie !== "all") p.set("cat", state.categorie);
      var qs = p.toString();
      history.replaceState(null, "", qs ? "?" + qs : window.location.pathname);
    }

    function draw() {
      var list = MOTOS.filter(function (m) {
        return (state.marque === "all" || m.marque === state.marque) &&
               (state.categorie === "all" || m.categorie === state.categorie);
      });
      list.sort(function (a, b) {
        return (a.prix == null ? Infinity : a.prix) - (b.prix == null ? Infinity : b.prix);
      });

      grid.innerHTML = list.length
        ? list.map(motoCard).join("")
        : '<p class="empty">Aucune moto ne correspond à ces critères. ' +
          '<a href="catalogue.html">Réinitialiser les filtres</a>.</p>';

      if (countHost) {
        countHost.textContent = list.length +
          (list.length > 1 ? " modèles" : " modèle");
      }
    }

    buildFilters();
    draw();
  }

  /* ---------- Fiche moto --------------------------------------------- */

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

    document.title = m.marque + " " + m.modele + " – " + (SITE.nom || "");

    var related = MOTOS.filter(function (x) {
      return x.id !== m.id && (x.categorie === m.categorie || x.marque === m.marque);
    }).slice(0, 3);

    host.innerHTML =
      '<div class="container moto-detail">' +
        '<nav class="breadcrumb">' +
          '<a href="index.html">Accueil</a><span>/</span>' +
          '<a href="catalogue.html">Catalogue</a><span>/</span>' +
          '<a href="catalogue.html?marque=' + encodeURIComponent(m.marque) + '">' + m.marque + '</a>' +
          '<span>/</span><span>' + m.modele + '</span>' +
        '</nav>' +
        '<div class="moto-detail__grid">' +
          '<div class="moto-detail__media">' + motoImg(m) + '</div>' +
          '<div>' +
            '<div class="moto-detail__marque">' + m.marque +
              (m.nouveaute ? ' · Nouveauté ' + m.annee : '') + '</div>' +
            '<h1>' + m.modele + '</h1>' +
            '<p>' + m.description + '</p>' +
            '<div class="moto-detail__price">' + formatPrix(m.prix) +
              (m.prix == null ? '' : ' <small>prix neuf indicatif</small>') + '</div>' +
            '<table class="spec-table">' +
              row("Type", m.type) +
              row("Catégorie", m.categorie) +
              row("Permis requis", permisLabel(m.permis)) +
              row("Année modèle", m.annee) +
            '</table>' +
            (m.specs
              ? '<h2 class="spec-title">Fiche technique</h2>' +
                '<table class="spec-table">' +
                  Object.keys(m.specs).map(function (k) { return row(k, m.specs[k]); }).join("") +
                '</table>'
              : '<table class="spec-table">' +
                  row("Cylindrée", m.cylindree + " cm³") +
                  row("Puissance", m.puissance + " ch") +
                '</table>') +
            '<div class="color-dots">' +
              m.couleurs.map(function (c) { return '<span>' + c + '</span>'; }).join("") +
            '</div>' +
            '<div class="moto-detail__actions">' +
              '<a class="btn" href="contact.html?moto=' + encodeURIComponent(m.marque + " " + m.modele) +
                '">Demander un devis</a>' +
              '<a class="btn btn--ghost" data-site-href="whatsapp" href="#">WhatsApp</a>' +
              '<a class="btn btn--ghost" data-site-href="tel" href="#">Appeler</a>' +
            '</div>' +
            '<p class="notice">Prix neuf indicatif, hors options, coloris spécifiques et ' +
              'promotions en cours. Livraison possible partout au Maroc. ' +
              'Contactez-nous pour un devis et la disponibilité.</p>' +
          '</div>' +
        '</div>' +
        (related.length
          ? '<div class="section--tight"><h2>À découvrir aussi</h2>' +
            '<div class="moto-grid">' + related.map(motoCard).join("") + '</div></div>'
          : '') +
      '</div>';

    hydrateSite();

    function row(k, v) {
      return '<tr><th>' + k + '</th><td>' + v + '</td></tr>';
    }
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
      form.hidden = true;
      var ok = $("[data-contact-success]");
      if (ok) { ok.style.display = "block"; ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
    });
  }

  /* ---------- Init ------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    hydrateSite();
    initNav();
    renderMarques();
    renderServices();
    renderHours();
    renderGalerie();
    renderFeatured();
    renderCatalogue();
    renderDetail();
    initContactForm();
  });
})();
