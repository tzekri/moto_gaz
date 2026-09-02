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
            annee, couleurs [ ], nouveaute (bool), description, image.
   image : placez vos photos dans assets/img/motos/ (ex. "voge-ds300.jpg").
           Si le fichier n'existe pas, un visuel générique s'affiche.
   --------------------------------------------------------------------------- */
window.MOTOS = [
  /* ---------------------------- VOGE ---------------------------- */
  {
    id: "voge-ds300",
    marque: "VOGE",
    modele: "300 DS",
    type: "Moto",
    categorie: "Trail",
    prix: 42900,
    cylindree: 292,
    puissance: 29,
    permis: "A",
    annee: 2025,
    couleurs: ["Noir", "Gris", "Rouge"],
    nouveaute: false,
    description:
      "Trail routier accessible et polyvalent. Monocylindre 292 cm³ souple, position haute et confortable, ABS, réservoir grande capacité : idéal pour la ville comme pour les sorties week-end.",
    image: "voge-ds300.jpg"
  },
  {
    id: "voge-300-rally",
    marque: "VOGE",
    modele: "300 Rally",
    type: "Moto",
    categorie: "Trail",
    prix: 46900,
    cylindree: 292,
    puissance: 29,
    permis: "A",
    annee: 2025,
    couleurs: ["Sable", "Noir mat"],
    nouveaute: true,
    description:
      "Version plus baroudeuse du 300 DS : roue avant 19\", protections renforcées, suspensions à plus grand débattement. Prête à quitter le bitume.",
    image: "voge-300-rally.jpg"
  },
  {
    id: "voge-525-dsx",
    marque: "VOGE",
    modele: "525 DSX",
    type: "Moto",
    categorie: "Trail",
    prix: 66900,
    cylindree: 494,
    puissance: 47,
    permis: "A",
    annee: 2025,
    couleurs: ["Gris Aventure", "Noir"],
    nouveaute: true,
    description:
      "Le trail milieu de gamme de VOGE. Bicylindre 494 cm³, écran TFT connecté, régulateur de vitesse, contrôle de traction. Confort et équipement pour avaler les kilomètres.",
    image: "voge-525-dsx.jpg"
  },
  {
    id: "voge-900-ds",
    marque: "VOGE",
    modele: "900 DS",
    type: "Moto",
    categorie: "Trail",
    prix: 99900,
    cylindree: 895,
    puissance: 95,
    permis: "A",
    annee: 2025,
    couleurs: ["Gris", "Rouge Racing"],
    nouveaute: false,
    description:
      "Le grand trail de la gamme, taillé pour le voyage au long cours. Bicylindre 895 cm³, électronique complète, protection aérodynamique et grande autonomie.",
    image: "voge-900-ds.jpg"
  },
  {
    id: "voge-sr1-125",
    marque: "VOGE",
    modele: "SR1 125",
    type: "Scooter",
    categorie: "Scooter urbain",
    prix: 24900,
    cylindree: 125,
    puissance: 11,
    permis: "A1",
    annee: 2025,
    couleurs: ["Noir", "Blanc", "Gris"],
    nouveaute: false,
    description:
      "Scooter urbain au design moderne, éclairage full LED, coffre sous selle pour casque intégral. Agile et économique pour les trajets quotidiens en ville.",
    image: "voge-sr1-125.jpg"
  },

  /* -------------------------- QJMOTOR -------------------------- */
  {
    id: "qjmotor-src-125",
    marque: "QJMOTOR",
    modele: "SRC 125",
    type: "Moto",
    categorie: "Roadster",
    prix: 21900,
    cylindree: 125,
    puissance: 11,
    permis: "A1",
    annee: 2025,
    couleurs: ["Noir", "Rouge", "Bleu"],
    nouveaute: false,
    description:
      "Petit roadster 125 cm³ au look agressif, parfait pour le permis A1 et les débuts à moto. Léger, maniable, faible consommation.",
    image: "qjmotor-src-125.jpg"
  },
  {
    id: "qjmotor-srk-400",
    marque: "QJMOTOR",
    modele: "SRK 400",
    type: "Moto",
    categorie: "Roadster",
    prix: 46900,
    cylindree: 400,
    puissance: 40,
    permis: "A",
    annee: 2025,
    couleurs: ["Noir mat", "Blanc/Rouge"],
    nouveaute: true,
    description:
      "Roadster bicylindre 400 cm³ nerveux et bien équipé : freinage ByBre, écran TFT, fourche inversée. Un excellent rapport équipement/prix.",
    image: "qjmotor-srk-400.jpg"
  },
  {
    id: "qjmotor-srt-550x",
    marque: "QJMOTOR",
    modele: "SRT 550 X",
    type: "Moto",
    categorie: "Trail",
    prix: 74900,
    cylindree: 550,
    puissance: 52,
    permis: "A",
    annee: 2025,
    couleurs: ["Gris", "Vert Aventure"],
    nouveaute: false,
    description:
      "Trail routier bicylindre 550 cm³. Bulle réglable, protège-mains, poignées chauffantes, modes de conduite : le voyage sans se ruiner.",
    image: "qjmotor-srt-550x.jpg"
  },
  {
    id: "qjmotor-srk-921",
    marque: "QJMOTOR",
    modele: "SRK 921",
    type: "Moto",
    categorie: "Roadster",
    prix: 119900,
    cylindree: 921,
    puissance: 94,
    permis: "A",
    annee: 2025,
    couleurs: ["Noir", "Gris Titane"],
    nouveaute: false,
    description:
      "Le gros roadster de la marque. Bicylindre 921 cm³ dérivé Benelli, châssis treillis, suspensions Marzocchi, freinage Brembo. Du caractère et de la présence.",
    image: "qjmotor-srk-921.jpg"
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
