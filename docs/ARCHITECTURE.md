# Architecture MVP — projet « Consensus »

> Plan technique de référence. Direction retenue : **Path A — Jamstack, sans backend**.
> À tenir à jour. Voir `intake/pilotage.md` pour la vision produit.

---

## 0. Décision d'architecture

**Aucun backend runtime.** Le site public est 100 % statique, servi par CDN. Personne
ne se connecte à *notre* app : le seul lieu de données personnelles est **Pol.is**
(le vote), dont la responsabilité RGPD n'est pas la nôtre.

Conséquences :
- **RGPD côté public = néant** (0 compte, 0 cookie, 0 PII chez nous).
- **Souveraineté par absence de données** : ce ne sont que des fichiers publics ;
  l'emplacement d'hébergement n'a quasi aucun enjeu RGPD.
- **Trafic national** absorbé nativement par le cache CDN.
- Les deux besoins « dynamiques » (seeding Pol.is, compteurs) se font **au build**
  (CI), jamais via un serveur permanent.

Le contenu étant du Markdown portable, le **coût de sortie reste faible** (on
réhéberge ailleurs sans réécrire) — important pour un projet qui se réclame de la
souveraineté, alors qu'il s'appuie sur GitHub + Cloudflare (sociétés US).

---

## 1. La stack, figée

| Rôle | Choix | Pourquoi |
|---|---|---|
| Génération du site | **Astro** | HTML-first → on reprend le CSS/JS de fiche tel quel, contenu en collections typées, sortie 100 % statique. |
| Contenu | **Markdown/MDX + frontmatter structuré** (dans le repo) | Une fiche = un fichier versionné. Portable. |
| Back-office | **Sveltia CMS** (succession moderne de Decap) | UI d'édition navigateur, commit dans Git, workflow brouillon/revue, auth déléguée GitHub. Pas de serveur. |
| Hébergement | **Cloudflare Pages** | Bande passante illimitée gratuite → trafic national, 0 €. |
| Repo + CI | **GitHub** (public) + **Actions** | Actions illimitées sur repo public → pipeline Pol.is gratuit. Historique Git = sauvegarde 3-2-1. |
| Stats | **Cloudflare Web Analytics** | Sans cookie, 0 PII. |
| Vote | **iframe Pol.is hébergé** | `embed.js` + `conversation_id`. |

**Coût** : ~0 €/mois en fonctionnement. Seule dépense : le(s) nom(s) de domaine
(~10-40 €/an).

---

## 2. Arborescence du repo

```
concensus/
├─ src/
│  ├─ content/
│  │  ├─ config.ts            # schémas Zod (validation du contenu)
│  │  ├─ fiches/
│  │  │  └─ visibilite-nocturne.mdx
│  │  └─ pages/               # méthode, charte, modération, données, qui-sommes-nous
│  ├─ data/polis/             # GÉNÉRÉ par CI : <slug>.json (compteurs + réception)
│  ├─ components/
│  │  ├─ fiche/               # KeyFact, Comparatif, Mesure, Reception, Sources…
│  │  ├─ PolisEmbed.astro
│  │  └─ ReadingMode.astro    # îlot : bascule rapide/approfondi
│  ├─ layouts/Base.astro
│  ├─ lib/reception.ts        # calcul divise↔rassemble + seuil
│  └─ pages/
│     ├─ index.astro          # accueil / tendances
│     ├─ fiches/[slug].astro
│     ├─ tags/[tag].astro
│     ├─ themes/[theme].astro
│     └─ (pages annexes)
├─ public/admin/              # Sveltia : index.html + config.yml
├─ scripts/fetch-polis.mjs    # appelé par le cron
├─ .github/workflows/polis-export.yml
└─ docs/ARCHITECTURE.md
```

---

## 3. Modèle de données d'une fiche (le cœur)

La fiche a une anatomie stricte → on la modélise en **champs**, pas en blob HTML.
Schéma `src/content/config.ts` :

```ts
const fiche = z.object({
  titre: z.string(),                    // h1
  chapo: z.string(),
  fil: z.object({ ministere: z.string(), theme: z.string(), sousTheme: z.string() }),
  tags: z.array(z.string()),            // navigation transversale
  statut: z.enum(['brouillon','en_revue','publie','a_reviser','abouti','en_sommeil','archive']),
  origine: z.object({ elaboreeAvec: z.string().optional(), revueCharte: z.boolean() }),
  keyfact: z.object({ chiffre: z.string(), texte: z.string(), source: z.number() }),
  comparatif: z.array(z.object({
    pays: z.string(), tuesParM: z.string(), levier: z.string(),
    role: z.enum(['france','reference','autre']),
  })),
  mesures: z.array(z.object({
    id: z.string(),                     // "A","B","C"
    texte: z.string(),
    preuve: z.enum(['eprouve','emergent']),
    polisCommentId: z.number().optional(),  // rempli APRÈS seeding → fait le lien
  })),
  sources: z.array(z.object({ n: z.number(), texte: z.string(), url: z.string().optional() })),
  polis: z.object({ conversationId: z.string() /* REQUIS pour publier */, pageId: z.string() }),
})
```

Le corps MDX porte le contenu « approfondi » (détail du constat, caveats).
**Les `mesures` deviennent les seeds Pol.is** : c'est le lien fiche ↔ vote.

---

## 4. Rendu (réutilise le design existant)

- `fiches/[slug].astro` reprend la **structure HTML + le `<style>`** de
  `intake/fiche-visibilite-nocturne.html` quasi à l'identique ; chaque section devient
  un composant (`KeyFact`, `Comparatif`, `Mesure`+`Reception`, `Sources`).
- Bascule **Rapide/Approfondi** = îlot `ReadingMode.astro` (script vanilla actuel, à
  peine adapté).
- `PolisEmbed.astro` = `<div class="polis" data-conversation_id=…>` + `embed.js`.
  Hors iframe = notre style ; dedans = Pol.is.
- **Indicateur de réception** par mesure : lit `src/data/polis/<slug>.json` (généré) ;
  affiché **seulement au-delà du seuil de votes**, sinon l'état « pas encore assez de
  votes ».

---

## 5. Workflow éditorial (rédacteurs / valideurs)

- **Sveltia** (`/admin`) expose les champs ci-dessus. Mode *editorial workflow* =
  colonnes brouillon → en revue → prêt.
- Un **rédacteur** édite → Sveltia ouvre une **Pull Request**. Un **valideur** relit et
  merge. **Les rôles = les permissions du repo GitHub** (rédacteur = write,
  valideur = maintainer). Zéro code d'auth.
- Le champ `statut` gère le cycle *éditorial* ; les états *factuels* (`abouti`,
  `a_reviser`) se posent à la main selon des règles publiques — **jamais au vote**.
- Une seule pièce mobile : un **worker OAuth GitHub** (Cloudflare Worker gratuit,
  `sveltia-cms-auth`), sans état.

---

## 6. Intégration Pol.is — créer + seeder AVANT de publier

> ⚠️ **Contrainte résolue : la course au seeding.**
> L'embed *auto-création* (`data-page_id` / `data-site_id`) crée la conversation au
> **premier affichage** de la page → elle n'est seedable qu'**après** sa mise en ligne.
> Cela ouvre une course (déployer → afficher → courir seeder avant qu'un visiteur
> n'intervienne). **On rejette donc l'auto-création.**

**Règle : on pré-crée et on seede dans le dashboard Pol.is AVANT toute publication.**
Le `conversationId` est une **condition de publication** (champ requis) : une fiche ne
peut pas passer `publie` tant qu'elle ne pointe pas vers une conversation **déjà
seedée**. Le valideur ne merge pas sans cet ID → la garde est automatique.

Le seeding lui-même n'a **aucune contrainte de volume** : il se fait via le formulaire
*owner* « Seed Comments » du panneau admin, qui permet d'ajouter ~10-15 affirmations
d'un coup (la limite « 1 proposition par utilisateur » ne concerne que les
*participants* qui votent, pas le propriétaire).

**Checklist éditoriale à la publication** (acte humain = « validation toujours
humaine ») :
1. Créer la conversation dans le dashboard Pol.is (topic + description + modération).
2. Saisir les **seeds** (mesures A/B/C + quelques contradictoires, ~10-15) via le
   formulaire owner.
3. Reporter `conversationId` et chaque `polisCommentId` dans le frontmatter.
4. Faire relire/merger la PR → mise en ligne d'une fiche dont la conversation est
   **déjà complète**.

Le `polisCommentId` permet au pipeline d'attribuer la réception à **la bonne mesure**.

---

## 7. Pipeline compteurs/réception (automatique)

`.github/workflows/polis-export.yml` — **cron** (ex. toutes les 6 h) :
1. `scripts/fetch-polis.mjs` lit tous les `conversationId` des fiches.
2. Pour chacun : `GET pol.is/api/v3/dataExport?conversation_id=…&format=csv` → dézippe →
   parse (tables *Comments* / *Participants Votes* / *Summary*).
3. Calcule par mesure : nb de votes, ratio d'accord, position **divise↔rassemble**,
   `aboveThreshold`. Écrit `src/data/polis/<slug>.json` + un horodatage de **fraîcheur**
   (affiché, jamais présenté comme temps réel).
4. `git commit` si changé → Cloudflare Pages **rebuild auto**.

**Backup 3-2-1 gratuit** : chaque export commité = une version dans l'historique Git.

> **Calcul « divise↔rassemble »** : le vrai consensus inter-groupes de Pol.is repose sur
> leur PCA/clustering. Au MVP, on s'appuie sur les **stats déjà calculées dans
> l'export** (accord global + volume, seuillé) ; on raffine vers le consensus
> cross-groupes une fois le format réel de l'export sous les yeux. Pas de verdict sous
> le seuil de significativité.

---

## 8. Déploiement

- **Cloudflare Pages** connecté au repo : build `astro build`, sortie `dist/`,
  **déploiement auto à chaque push sur `main`**. Gratuit.
- **Domaine** via Cloudflare Registrar (~10 €/an) — seule vraie dépense.
- Page **« Données & vie privée »** : « le vote est opéré par Pol.is, voici leur
  politique » + « ce site ne dépose aucun cookie, n'a aucun compte ».

---

## 9. Faits vérifiés sur Pol.is hébergé (sources primaires)

- **Gratuit** pour entités non lucratives / d'intérêt public → viser un statut
  **association** (cohérent avec le tier gratuit ET l'argument neutralité/financement).
- **RGPD** : hébergé déclaré conforme (TOS/privacy rédigés avec juristes UE+US).
  Localisation serveurs non précisée (probablement hors UE).
- **Créer une conversation** : dashboard UI, ou embed auto-création (rejetée, cf §6).
  Pas d'API publique documentée de création programmatique.
- **Seeds** : formulaire owner du panneau admin uniquement. Pas d'API/CSV. ~10-15
  recommandés.
- **Export** : `GET pol.is/api/v3/dataExport?conversation_id=…` → CSV (zip) ou Excel,
  asynchrone, param `at-date`. **Auth non documentée** (marquée *TODO*) → hypothèse :
  export public pour conversation publique. **À tester en live.**
- **Embed** : `<div class="polis" data-conversation_id="…"></div>` +
  `<script async src="https://pol.is/embed.js">`.
- **Licence self-host** : AGPLv3, docker-compose (Phase 2/3 si souveraineté du vote).

Sources : pol.is/tos · compdemocracy.org/seed-comments · polis-documentation
(usage/SeedComments.md, data/ExportAPI.md, usage/Embedding.md) · compdemocracy.org/faq ·
github.com/compdemocracy/polis · github.com/compdemocracy/polis-embed-examples

---

## 10. Points ouverts à lever

1. **Export public ?** Tester l'URL `dataExport` sans auth sur la 1re vraie conversation
   (détermine si le cron est 100 % automatique — hypothèse : oui).
2. **Format réel de l'export** → affiner le calcul cross-groupes du §7.
3. **Statut juridique** (association) à acter, condition du Pol.is hébergé gratuit.
4. **Nom** (cf pilotage §F) — domaine à acheter en conséquence.

---

## 11. Premiers pas (Phase 0)

1. Scaffolder Astro + porter `fiche-visibilite-nocturne.html` dans `[slug].astro`
   (rendu identique, piloté par les données).
2. Écrire `visibilite-nocturne.mdx` (contenu actuel en champs).
3. Brancher Sveltia (`/admin`) + worker OAuth.
4. Déployer sur Cloudflare Pages (en ligne, gratuit).
5. Créer la vraie conversation Pol.is + seeds → reporter les IDs → vérifier l'embed.
6. Écrire le pipeline cron + **tester si l'export est public**.
