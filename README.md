# Site Motos Gaz

Site vitrine (statique) pour **Motos Gaz** — concessionnaire multimarque de scooters
et motos **neufs** à Casablanca (VOGE, QJMOTOR, SYM, TVS).

HTML / CSS / JavaScript purs, **aucune dépendance**, aucun build. Il suffit
d'ouvrir les fichiers ou de les héberger tels quels.

## Pages

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : hero, marques, sélection, services, à propos, contact |
| `catalogue.html` | Catalogue complet avec filtres marque / type |
| `moto.html` | Fiche d'un modèle (`moto.html?id=...`) |
| `contact.html` | Coordonnées, horaires, carte, formulaire |

## Modifier le contenu

Tout se pilote depuis **un seul fichier** : [`data/motos.js`](data/motos.js).

- `window.SITE` — nom, téléphones, e-mail, adresse, réseaux, horaires, services.
- `window.MARQUES` — liste des marques (bandeau + filtre).
- `window.MOTOS` — le catalogue. Chaque moto est un objet ; ajoutez / retirez
  des entrées dans le tableau.

### ⚠️ Prix

Les prix (`prix`, en dirhams) sont **indicatifs** et doivent être vérifiés.
Mettez `prix: null` pour afficher « Prix sur demande ».

### Photos

Placez vos images dans `assets/img/` :

- `assets/img/devanture.jpg` — photo de la devanture du magasin.
  Utilisée à **3 endroits** : fond du hero (accueil), section « À propos »
  (accueil) et page Contact. Absente = dégradé / visuel générique.
- `assets/img/hero.jpg` — grande photo d'accueil (optionnelle, ancien emplacement)
- `assets/img/motos/<nom>` — une photo par modèle, le nom doit
  correspondre au champ `image` dans `data/motos.js`

Si une image est absente, un visuel générique s'affiche automatiquement.

**Photos VOGE et QJMOTOR** : les 8 modèles VOGE / QJMOTOR utilisent les
photos officielles constructeur (fichiers `voge-*.png` et `qjmotor-*.png`),
récupérées sur `vogemorocco.com` et `qjmotor.fr`. En tant que revendeur,
vérifiez auprès de votre distributeur que vous pouvez les utiliser, ou
remplacez-les par vos propres clichés (même nom de fichier).

### Fiches techniques

Chaque modèle VOGE / QJMOTOR a un objet `specs { }` dans `data/motos.js` :
la liste libellé → valeur affichée sur la page du modèle. Sources :
`vogemorocco.com` (prix Maroc TTC) et `qjmotor.fr` (specs — **prix Maroc à
confirmer**, laissés sur « Prix sur demande » via `prix: null`).

Les modèles **SYM et TVS** n'ont pas encore de photos réelles ni de `specs`
détaillées — à compléter sur le même modèle.

## Informations reprises des réseaux (à confirmer)

Source : pages **Facebook** `facebook.com/motosgaz7` et **Instagram** `@motos_gaz`.

- Nom : Motos Gaz — concessionnaire moto, Casablanca
- Tél. : 05 22 67 24 43 / 06 60 40 02 82 (WhatsApp : 06 60 40 02 82)
- E-mail : contact@motosgaz.com
- Services : vente neuf, réparation/entretien, accessoires & pièces, livraison partout au Maroc
- Marques identifiées : VOGE, QJMOTOR, SYM, TVS
- Google Maps : https://maps.app.goo.gl/R2ATADYZjZnWiPax9

À compléter / vérifier : **adresse postale exacte**, **horaires précis**,
**liste et prix des modèles réellement en stock**.

## Mettre en ligne

N'importe quel hébergement statique : Netlify, Vercel, GitHub Pages, ou un
simple dossier sur un serveur web. Aucune configuration serveur requise.

Le formulaire de contact **ouvre WhatsApp** (`wa.me/<SITE.whatsapp>`) avec
la demande pré-remplie (nom, téléphone, e-mail, sujet, message) ; le client
n'a plus qu'à appuyer sur *Envoyer*. Aucun serveur ni compte tiers requis.
Pour recevoir plutôt les demandes par e-mail, remplacer la logique
`window.open(waUrl…)` dans `initContactForm` (`assets/js/main.js`) par un
service type Formspree / Web3Forms.
