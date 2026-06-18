# Sveltia CMS — à finir plus tard (auth OAuth)

Le back-office est déjà branché : `public/admin/index.html` + `public/admin/config.yml`.
Il ne manque que l'**authentification GitHub**, via un Cloudflare Worker. Tant que ce
n'est pas fait, `/admin/` ne pourra pas se connecter au repo (mais le **test local**
fonctionne, voir plus bas).

## 1. Créer une GitHub OAuth App
GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App** :
- **Application name** : `Consensus CMS`
- **Homepage URL** : `https://concensus-2wv.pages.dev`
- **Authorization callback URL** : `https://<ton-worker>.workers.dev/callback`
  (URL connue après l'étape 2 — revenir la coller ici)
- Register → noter le **Client ID**, générer un **Client Secret**.

## 2. Déployer le worker `sveltia-cms-auth`
- Repo : <https://github.com/sveltia/sveltia-cms-auth> (bouton *Deploy to Cloudflare*
  ou via Wrangler).
- Variables / secrets du worker :
  - `GITHUB_CLIENT_ID` = étape 1
  - `GITHUB_CLIENT_SECRET` = étape 1
  - `ALLOWED_DOMAINS` = `concensus-2wv.pages.dev` (+ `localhost` si test local)
- Récupérer l'**URL du worker** : `https://<nom>.<sous-domaine>.workers.dev`
- Revenir à l'étape 1 pour fixer le vrai **callback** = `<url-worker>/callback`.

## 3. Câbler la config
Dans `public/admin/config.yml`, remplacer :
```yaml
base_url: https://REMPLACER-PAR-TON-WORKER.workers.dev
```
par l'URL réelle du worker. Puis `git push` → `/admin/` opérationnel
(login GitHub → édition → commit / PR selon l'editorial workflow).

## Test LOCAL immédiat (sans worker)
`local_backend: true` est activé. Deux terminaux :
```
npm run dev          # Astro -> http://localhost:4321
npx decap-server     # proxy git local (port 8081)
```
Puis ouvrir <http://localhost:4321/admin/> : édition qui commite en local, sans auth.
Sert à valider l'ergonomie des champs.

## Point de vigilance
Le corps des fiches est du **MDX à composants** ; il est exposé en widget `text`
(brut) pour ne pas être corrompu par un éditeur rich-text. Au test local, vérifier
qu'éditer/sauver une fiche **ne casse pas** les composants du corps. Si ça coince,
basculer le champ `body` en `widget: hidden` (préservé, mais non éditable via le CMS).
