/* ============================================================================
   DONNÉES DU SITE — modifiez uniquement ce fichier pour mettre à jour le site.
   ----------------------------------------------------------------------------
   - SITE  : coordonnées, nom du magasin, réseaux sociaux, horaires.
   - MOTOS : le catalogue. Ajoutez / supprimez des objets dans le tableau.

   ⚠️  Les PRIX ci-dessous sont INDICATIFS (marché marocain, à confirmer).
       Mettez à jour le champ "prix" (en dirhams) ou passez-le à null pour
       afficher « Prix sur demande ».
   ============================================================================ */

window.SITE = {
  nom: "MOTOS GAZ",
  slogan: "Vente de scooters & motos neufs à Casablanca",
  descriptionCourte:
    "Concessionnaire multimarque à Casablanca : scooters et motos neufs, " +
    "pièces et accessoires, réparation et entretien. Livraison partout au Maroc.",
  telephone: "05 22 67 24 43",
  telephoneLien: "+212522672443",
  telephone2: "06 60 40 02 82",
  telephone2Lien: "+212660400282",
  whatsapp: "+212660400282",
  email: "contact@motosgaz.com",
  ville: "Casablanca",
  adresse: "Casablanca, Maroc",
  adresseMapsQuery: "MOTOS GAZ Casablanca",
  mapsUrl: "https://maps.app.goo.gl/R2ATADYZjZnWiPax9",
  reseaux: {
    facebook: "https://www.facebook.com/motosgaz7/",
    instagram: "https://www.instagram.com/motos_gaz/"
  },
  horaires: [
    { jour: "Lundi – Samedi", h: "9 h 00 – 13 h 00 · 15 h 00 – 19 h 30" },
    { jour: "Dimanche", h: "Fermé" }
  ],
  /* Vidéos Facebook affichées dans la galerie.
     Mettez l'identifiant du reel/de la vidéo (le nombre dans l'URL Facebook,
     ex. facebook.com/reel/1077956424669574  ->  "1077956424669574"). */
  facebookVideos: [
    "1077956424669574",
    "1584318776648029",
    "858460577147314",
    "1725463868502601"
  ],
  services: [
    {
      titre: "Vente neuf multimarque",
      texte: "Scooters et motos neufs VOGE, QJMOTOR, SYM et TVS, livrés préparés et garantis constructeur."
    },
    {
      titre: "Réparation & entretien",
      texte: "Atelier mécanique équipé : révisions, pneumatiques, diagnostic et réparation toutes cylindrées."
    },
    {
      titre: "Pièces & accessoires",
      texte: "Pièces d'origine, consommables et équipement du pilote (casques, gants, top-cases…)."
    },
    {
      titre: "Livraison partout au Maroc",
      texte: "Votre deux-roues livré dans toute les villes du Royaume, ou retrait directement en magasin."
    }
  ]
};

/* Marques distribuées — bandeau logos + filtre catalogue. */
window.MARQUES = ["VOGE", "QJMOTOR", "SYM", "TVS"];

/* ---------------------------------------------------------------------------
   Galerie photos (gérée par le magasin).
   Exportez vos photos depuis Facebook / Instagram, placez-les dans
   assets/img/galerie/ puis listez-les ici. Visuel générique si absente.
   --------------------------------------------------------------------------- */
window.GALERIE = [
  { image: "galerie-01.jpg", legende: "Showroom Motos Gaz" },
  { image: "galerie-02.jpg", legende: "Livraison client" },
  { image: "galerie-03.jpg", legende: "Atelier entretien" },
  { image: "galerie-04.jpg", legende: "Nouveautés VOGE" },
  { image: "galerie-05.jpg", legende: "Gamme scooters SYM" },
  { image: "galerie-06.jpg", legende: "Essai QJMOTOR" },
  { image: "galerie-07.jpg", legende: "Équipement pilote" },
  { image: "galerie-08.jpg", legende: "En magasin" }
];

/* ---------------------------------------------------------------------------
   Catalogue.
   Champs : id, marque, modele, type ("Scooter" | "Moto"), categorie,
            prix (DH — nombre, ou null pour « Prix sur demande »),
            cylindree (cc), puissance (ch), permis ("A1" ≤125 cm³ | "A"),
            annee, couleurs [ ], nouveaute (bool), description, image,
            specs { } : fiche technique détaillée (paires libellé → valeur,
                        affichées dans l'ordre sur la page du modèle).
   image : placez vos photos dans assets/img/motos/.
           Si le fichier n'existe pas, un visuel générique s'affiche.

   Sources fiches techniques : vogemorocco.com (prix Maroc TTC) et
   qjmotor.fr (QJMOTOR — prix Maroc à confirmer, laissés sur demande).
   --------------------------------------------------------------------------- */
window.MOTOS = [
  /* ---------------------------- VOGE ---------------------------- */
  {
    id: "voge-300ds",
    marque: "VOGE",
    modele: "300 DS",
    type: "Moto",
    categorie: "Trail",
    prix: 44900,
    cylindree: 292,
    puissance: 26,
    permis: "A",
    annee: 2025,
    couleurs: ["Gris", "Noir"],
    nouveaute: false,
    description:
      "Trail routier polyvalent et léger. Monocylindre 292 cm³ souple et franc, châssis équilibré, freins à disque ABS. Bien équipé de série (bulle réglable, crash-bar, porte-paquet, sabot) : à l'aise en ville comme sur les sorties week-end.",
    image: "voge-300ds.png",
    specs: {
      "Moteur": "Monocylindre 4T, refroidissement liquide, double ACT, 4 soupapes",
      "Alésage × course": "78 × 61,2 mm",
      "Cylindrée": "292,4 cm³",
      "Puissance": "19 kW (25,8 ch) à 8 500 tr/min",
      "Puissance fiscale": "4 CV",
      "Couple": "25 Nm à 7 000 tr/min",
      "Alimentation": "Injection électronique",
      "Transmission": "6 rapports, chaîne",
      "Cadre": "Treillis en acier",
      "Suspension avant": "Fourche inversée Ø 35 mm, débattement 134 mm",
      "Suspension arrière": "Mono-amortisseur réglable",
      "Freinage": "ABS",
      "Frein avant": "Disque Ø 300 mm",
      "Frein arrière": "Disque Ø 220 mm",
      "Pneus": "110/80-17 av. · 150/60-17 ar.",
      "Poids": "159 kg",
      "Hauteur de selle": "810 mm",
      "Réservoir": "16 L",
      "Équipement": "Compteur LCD, bulle réglable, prise USB, crash-bar, porte-paquet, sabot moteur"
    }
  },
  {
    id: "voge-300-rally",
    marque: "VOGE",
    modele: "300 Rally",
    type: "Moto",
    categorie: "Trail",
    prix: 49900,
    cylindree: 292,
    puissance: 26,
    permis: "A",
    annee: 2025,
    couleurs: ["Gris", "Noir"],
    nouveaute: true,
    description:
      "Trail baroudeur inspiré des motos du Dakar. Roue avant de 21\", fourche inversée 41 mm à grand débattement (240 mm), garde au sol généreuse et look néo-rétro. Léger (158 kg) et taillé pour quitter le bitume.",
    image: "voge-300-rally.png",
    specs: {
      "Moteur": "Monocylindre 4T, refroidissement liquide, double ACT, 4 soupapes",
      "Cylindrée": "292,4 cm³",
      "Puissance": "19 kW (25,8 ch) à 8 500 tr/min",
      "Couple": "25 Nm à 7 000 tr/min",
      "Puissance fiscale": "4 CV",
      "Transmission": "6 rapports, chaîne",
      "Cadre": "Multitubulaire en acier",
      "Suspension avant": "Fourche inversée Ø 41 mm, débattement 240 mm",
      "Suspension arrière": "Mono-amortisseur, débattement 240 mm",
      "Freinage": "ABS",
      "Frein avant": "Disque Ø 265 mm",
      "Frein arrière": "Disque Ø 220 mm",
      "Roue avant": "3.00-21 (jante à rayons)",
      "Poids": "158 kg",
      "Hauteur de selle": "915 mm",
      "Empattement": "1 430 mm",
      "Réservoir": "11 L"
    }
  },
  {
    id: "voge-525-dsx",
    marque: "VOGE",
    modele: "525 DSX",
    type: "Moto",
    categorie: "Trail",
    prix: 76000,
    cylindree: 494,
    puissance: 48,
    permis: "A",
    annee: 2025,
    couleurs: ["Gris", "Bleu"],
    nouveaute: true,
    description:
      "Trail adventure milieu de gamme. Bicylindre 494 cm³, roues à rayons 19\"/17\" en pneus Metzeler, suspensions KYB, freinage Nissin avec ABS Bosch déconnectable. Écran 7\", Bluetooth et navigation, antipatinage et 2 modes de conduite.",
    image: "voge-525-dsx.png",
    specs: {
      "Moteur": "Bicylindre en ligne 4T, refroidissement liquide, double ACT, 4 soupapes/cyl., balancier d'équilibrage",
      "Alésage × course": "68 × 68 mm",
      "Cylindrée": "494 cm³",
      "Puissance": "35 kW (47,6 ch) à 8 500 tr/min",
      "Puissance fiscale": "6 CV",
      "Couple": "42,5 Nm à 7 000 tr/min",
      "Transmission": "6 rapports, chaîne",
      "Cadre": "Treillis en acier",
      "Suspension avant": "Fourche inversée KYB Ø 41 mm",
      "Suspension arrière": "Mono-amortisseur KYB réglable en précharge",
      "Freinage": "ABS Bosch double canal, déconnectable",
      "Frein avant": "2 disques flottants Ø 298 mm, étriers Nissin",
      "Frein arrière": "Disque Ø 240 mm, étrier Nissin",
      "Roues": "Jantes à rayons 19\" av. / 17\" ar.",
      "Pneus": "110/80 R19 · 150/70 R17 Metzeler Tourance",
      "Poids": "190 kg à vide",
      "Hauteur de selle": "810 mm",
      "Empattement": "1 360 mm",
      "Réservoir": "16,5 L",
      "Équipement": "Écran LCD 7\", Bluetooth + navigation, TCS déconnectable, 2 modes, full LED + phares auxiliaires, protège-mains, pare-brise réglable"
    }
  },
  {
    id: "voge-900-dsx",
    marque: "VOGE",
    modele: "900 DSX",
    type: "Moto",
    categorie: "Trail",
    prix: 128000,
    cylindree: 895,
    puissance: 96,
    permis: "A",
    annee: 2025,
    couleurs: ["Gris", "Rouge"],
    nouveaute: false,
    description:
      "La première grosse cylindrée VOGE. Bicylindre parallèle 895 cm³ Euro 5 de 96,5 ch, ride-by-wire, quickshifter bidirectionnel, freinage Brembo et amortisseur de direction réglable. Réservoir 20 L pour le grand voyage.",
    image: "voge-900-dsx.png",
    specs: {
      "Moteur": "Bicylindre en ligne 4T, refroidissement liquide, double ACT, Euro 5",
      "Cylindrée": "895 cm³",
      "Puissance": "72 kW (96,5 ch) à 8 250 tr/min",
      "Couple": "91 Nm à 6 250 tr/min",
      "Alimentation": "Injection électronique, Ride-by-Wire",
      "Embrayage": "Multidisque en bain d'huile, anti-dribble",
      "Transmission": "6 rapports, quickshifter bidirectionnel",
      "Cadre": "Périmétrique en acier, sous-châssis acier",
      "Suspension avant": "Fourche inversée réglable + amortisseur de direction",
      "Suspension arrière": "Bras oscillant aluminium, amortisseur central réglable",
      "Freinage": "Brembo, double disque avant",
      "Poids": "220 kg à sec",
      "Hauteur de selle": "825 mm",
      "Garde au sol": "190 mm",
      "Dimensions": "L 2 314 · l 873 · empattement 1 580 mm",
      "Réservoir": "20 L",
      "Équipement": "Modes de conduite, bulle réglable, full LED, prises USB + 12 V"
    }
  },

  /* -------------------------- QJMOTOR -------------------------- */
  {
    id: "qjmotor-srk-125",
    marque: "QJMOTOR",
    modele: "SRK 125 S",
    type: "Moto",
    categorie: "Roadster",
    prix: null,
    cylindree: 125,
    puissance: 15,
    permis: "A1",
    annee: 2025,
    couleurs: ["Gris"],
    nouveaute: false,
    description:
      "Roadster 125 au look de grande sœur : monocylindre liquide 4 soupapes de 15 ch, fourche inversée, freinage à disque ABS, éclairage full LED et écran TFT 5\". Idéal permis A1.",
    image: "qjmotor-srk-125.png",
    specs: {
      "Moteur": "Monocylindre 125 cm³, refroidissement liquide, 4 soupapes, injection",
      "Puissance": "11 kW (15 ch) à 9 500 tr/min",
      "Couple": "12 Nm à 7 000 tr/min",
      "Transmission": "6 rapports, chaîne",
      "Suspension avant": "Fourche inversée",
      "Suspension arrière": "Mono-amortisseur hydraulique",
      "Freinage": "Disque Ø 260 mm, ABS",
      "Éclairage": "Full LED",
      "Instrumentation": "Écran TFT 5\"",
      "Poids": "143 kg tous pleins faits"
    }
  },
  {
    id: "qjmotor-srk-600",
    marque: "QJMOTOR",
    modele: "SRK 600",
    type: "Moto",
    categorie: "Roadster",
    prix: null,
    cylindree: 554,
    puissance: 56,
    permis: "A",
    annee: 2025,
    couleurs: ["Rouge", "Noir"],
    nouveaute: true,
    description:
      "Roadster naked bicylindre 554 cm³ de 56 ch, homologué et bridable A2. Suspensions réglables Marzocchi, freinage Brembo double disque Ø 320 mm, contrôle de traction et 2 modes de conduite, écran TFT 5\".",
    image: "qjmotor-srk-600.png",
    specs: {
      "Moteur": "Bicylindre en ligne 554 cm³ — compatible A2",
      "Puissance": "41,2 kW (56 ch) à 8 250 tr/min",
      "Couple": "54 Nm à 5 500 tr/min",
      "Transmission": "6 rapports, chaîne",
      "Électronique": "Contrôle de traction, 2 modes de conduite",
      "Suspension avant": "Fourche inversée réglable Marzocchi",
      "Freinage": "Brembo, double disque Ø 320 mm, étriers radiaux",
      "Éclairage": "Full LED",
      "Instrumentation": "Écran TFT 5\"",
      "Poids": "176 kg tous pleins faits"
    }
  },
  {
    id: "qjmotor-srt-600-sx",
    marque: "QJMOTOR",
    modele: "SRT 600 SX",
    type: "Moto",
    categorie: "Trail",
    prix: null,
    cylindree: 554,
    puissance: 56,
    permis: "A",
    annee: 2025,
    couleurs: ["Rouge"],
    nouveaute: false,
    description:
      "Trail routier « Touring » très équipé de série : poignées et selle chauffantes, bagagerie aluminium, crash-bar et sabot, pneus Metzeler, écran TFT 7\". Bicylindre 554 cm³ de 56 ch, bridable A2.",
    image: "qjmotor-srt-600-sx.png",
    specs: {
      "Moteur": "Bicylindre en ligne 554 cm³ — compatible A2",
      "Puissance": "41,2 kW (56 ch) à 8 250 tr/min",
      "Couple": "54 Nm à 5 500 tr/min",
      "Transmission": "6 rapports, chaîne",
      "Suspension avant": "Fourche inversée réglable Marzocchi",
      "Suspension arrière": "Mono-amortisseur hydraulique",
      "Freinage": "Brembo, double disque Ø 320 mm, étriers radiaux",
      "Pneus": "Metzeler",
      "Poids": "220 kg tous pleins faits",
      "Équipement": "Poignées et selle chauffantes, bagagerie aluminium de série, crash-bar et sabot, full LED, écran TFT 7\""
    }
  },
  {
    id: "qjmotor-srk-921",
    marque: "QJMOTOR",
    modele: "SRK 921",
    type: "Moto",
    categorie: "Roadster",
    prix: null,
    cylindree: 921,
    puissance: 128,
    permis: "A",
    annee: 2025,
    couleurs: ["Rouge"],
    nouveaute: false,
    description:
      "Le roadster sportif haut de gamme : 4 cylindres en ligne 921 cm³ de 128 ch, suspensions Marzocchi Ø 50 mm, freinage Brembo Stylema, quickshifter montée/descente, ride-by-wire, régulateur de vitesse et écran TFT 5\" connecté.",
    image: "qjmotor-srk-921.png",
    specs: {
      "Moteur": "4 cylindres en ligne 921 cm³",
      "Puissance": "94 kW (127,9 ch) à 10 000 tr/min",
      "Couple": "93 Nm à 8 000 tr/min",
      "Alimentation": "Injection, Ride-by-Wire",
      "Embrayage": "Anti-dribble",
      "Transmission": "6 rapports, quickshifter montée/descente",
      "Cadre": "Treillis acier, boucle arrière aluminium",
      "Suspension avant": "Fourche inversée Marzocchi Ø 50 mm réglable",
      "Suspension arrière": "Amortisseur Marzocchi réglable + amortisseur de direction",
      "Freinage": "Brembo Stylema, double disque Ø 320 mm, ABS",
      "Électronique": "Contrôle de traction, régulateur de vitesse",
      "Instrumentation": "Écran TFT 5\" connecté, full LED",
      "Poids": "217 kg tous pleins faits"
    }
  },

  /* ----------------------------- SYM ----------------------------- */
  {
    id: "sym-orbit-125",
    marque: "SYM",
    modele: "Orbit III 125",
    type: "Scooter",
    categorie: "Scooter urbain",
    prix: 15900,
    cylindree: 125,
    puissance: 9,
    permis: "A1",
    annee: 2025,
    couleurs: ["Noir", "Blanc", "Gris"],
    nouveaute: false,
    description:
      "Le scooter urbain d'entrée de gamme, fiable et économique. Faible poids, selle basse, entretien simple : la valeur sûre pour circuler en ville.",
    image: "sym-orbit-125.jpg"
  },
  {
    id: "sym-symphony-st-125",
    marque: "SYM",
    modele: "Symphony ST 125",
    type: "Scooter",
    categorie: "Scooter urbain",
    prix: 19900,
    cylindree: 125,
    puissance: 11,
    permis: "A1",
    annee: 2025,
    couleurs: ["Gris mat", "Blanc nacré", "Noir"],
    nouveaute: true,
    description:
      "Scooter urbain haut de gamme : grandes roues 13\", freinage combiné, éclairage LED, large coffre. Confortable et rassurant sur route dégradée.",
    image: "sym-symphony-st-125.jpg"
  },
  {
    id: "sym-jet-x-125",
    marque: "SYM",
    modele: "Jet X 125",
    type: "Scooter",
    categorie: "Scooter sportif",
    prix: 21900,
    cylindree: 125,
    puissance: 12,
    permis: "A1",
    annee: 2025,
    couleurs: ["Noir/Or", "Gris/Rouge"],
    nouveaute: false,
    description:
      "Le scooter sportif compact de SYM. Look racing, moteur vif, tenue de route incisive : pensé pour les trajets urbains dynamiques.",
    image: "sym-jet-x-125.jpg"
  },
  {
    id: "sym-cruisym-300",
    marque: "SYM",
    modele: "Cruisym 300",
    type: "Scooter",
    categorie: "Maxi-scooter",
    prix: 46900,
    cylindree: 278,
    puissance: 27,
    permis: "A",
    annee: 2025,
    couleurs: ["Gris", "Noir", "Bordeaux"],
    nouveaute: false,
    description:
      "Maxi-scooter GT confortable : protection généreuse, grande selle, coffre 2 casques, ABS. Idéal pour les longs trajets périurbains et l'autoroute.",
    image: "sym-cruisym-300.jpg"
  },

  /* ----------------------------- TVS ----------------------------- */
  {
    id: "tvs-ntorq-125",
    marque: "TVS",
    modele: "NTorq 125",
    type: "Scooter",
    categorie: "Scooter sportif",
    prix: 18900,
    cylindree: 125,
    puissance: 9.4,
    permis: "A1",
    annee: 2025,
    couleurs: ["Rouge course", "Noir mat", "Jaune"],
    nouveaute: false,
    description:
      "Scooter connecté à l'esprit sportif : tableau de bord Bluetooth (appels, navigation), coffre éclairé, moteur 3 soupapes. Le préféré des jeunes citadins.",
    image: "tvs-ntorq-125.jpg"
  },
  {
    id: "tvs-apache-rtr-160-4v",
    marque: "TVS",
    modele: "Apache RTR 160 4V",
    type: "Moto",
    categorie: "Roadster",
    prix: 24900,
    cylindree: 160,
    puissance: 17.6,
    permis: "A",
    annee: 2025,
    couleurs: ["Noir", "Rouge", "Bleu"],
    nouveaute: false,
    description:
      "Roadster sportif 160 cm³ au tempérament vif, issu de l'expérience course de TVS. Freinage à disques, modes de conduite, position engagée. Fun et abordable.",
    image: "tvs-apache-rtr-160-4v.jpg"
  },
  {
    id: "tvs-apache-rtr-200-4v",
    marque: "TVS",
    modele: "Apache RTR 200 4V",
    type: "Moto",
    categorie: "Roadster",
    prix: 29900,
    cylindree: 197,
    puissance: 20.8,
    permis: "A",
    annee: 2025,
    couleurs: ["Noir mat", "Rouge", "Gris"],
    nouveaute: true,
    description:
      "La sportive légère de référence : 197 cm³, écran TFT connecté SmartXonnect, ABS mono-canal, embrayage anti-dribble. Vive en ville, à l'aise sur route.",
    image: "tvs-apache-rtr-200-4v.jpg"
  },
  {
    id: "tvs-raider-125",
    marque: "TVS",
    modele: "Raider 125",
    type: "Moto",
    categorie: "Roadster",
    prix: 16900,
    cylindree: 125,
    puissance: 11.2,
    permis: "A1",
    annee: 2025,
    couleurs: ["Rouge", "Noir", "Jaune"],
    nouveaute: false,
    description:
      "Petite 125 au style moderne et au meilleur rendement de sa catégorie. Écran LCD (ou TFT selon finition), éclairage LED, faible consommation. Parfaite première moto.",
    image: "tvs-raider-125.jpg"
  }
];
