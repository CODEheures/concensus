# Consensus

> Exposer, par thème, les **meilleures politiques publiques éprouvées ailleurs dans le
> monde** — documentées et sourcées — puis les soumettre à une **délibération citoyenne
> continue** qui fait émerger ce qui **rassemble** plutôt que ce qui divise.
>
> *Une bonne idée n'a ni gauche ni droite.* La plateforme reste factuelle et neutre :
> elle expose ce que les données établissent **et** ce qu'elles ne tranchent pas.

**Statut : POC (work in progress).** Une seule fiche de démonstration — *sécurité
routière › visibilité nocturne* — branchée sur un vrai vote, déployée temporairement.

---

## Comment ça marche

- **Unité de base** = la *fiche-benchmark*, au grain d'une mesure votable concrète.
  Chaque mesure est étiquetée `ÉPROUVÉ` (déployé et mesuré ailleurs) ou `ÉMERGENT`
  (prometteur, sans preuve consolidée).
- **Le vote** est opéré par **[Pol.is](https://pol.is)** (moteur de consensus open
  source). On met en avant ce qui **rassemble à travers les groupes d'opinion**, pas la
  majorité brute — sur un axe *divise ↔ rassemble*, jamais « pour / contre ».
- **Aucun backend runtime** : le site est 100 % statique. Les seules données
  personnelles (le vote) vivent chez Pol.is, pas chez nous.

## Stack

| Rôle | Choix |
|---|---|
| Génération du site | **Astro** (sortie statique) |
| Contenu | **Markdown/MDX + frontmatter typé** (Zod) |
| Back-office | **Sveltia CMS** (édition navigateur, commits Git) |
| Hébergement | **Cloudflare Pages** |
| Vote | **iframe Pol.is** hébergé |
| Compteurs / réception | export public Pol.is (`reportExport`) agrégé en CI |

Détails techniques : [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) ·
vision produit : [`intake/pilotage.md`](intake/pilotage.md).

## Développement

```bash
npm install
npm run dev      # serveur de dev Astro
npm run build    # build statique -> dist/
```

## Licences

- **Code** : [MIT](LICENSE).
- **Contenu des fiches** (textes, analyse, curation) : *Creative Commons BY-SA 4.0*
  (à ajouter — `LICENSE-CONTENT`). Les faits et chiffres bruts ne sont pas protégeables ;
  la rédaction l'est.
- **Pol.is** reste sous sa propre licence (AGPLv3) chez ses auteurs : il est **embarqué**,
  ni modifié ni redistribué ici.
