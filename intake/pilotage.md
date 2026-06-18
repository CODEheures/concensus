# Pilotage — projet « Consensus » (nom de travail)
 
> Document de pilotage. Objectif : garder une vue d'ensemble, distinguer ce qui
> est **tranché** de ce qui reste **ouvert**, et séquencer les chantiers pour ne
> pas se noyer. À tenir à jour au fil du projet.
 
---
 
## 1. La vision en une phrase
 
Une plateforme qui expose, par thème (≈ par ministère), **les meilleures solutions
de politique publique éprouvées ailleurs dans le monde**, documentées et sourcées,
puis les soumet à une **délibération citoyenne continue** qui fait émerger ce qui
**rassemble** plutôt que ce qui divise.
 
Principe fondateur : *une bonne idée n'a ni gauche ni droite.* La plateforme reste
factuelle, neutre, non orientée. Elle applique à elle-même le benchmark qu'elle
prône (le moteur de vote choisi, Pol.is, vient de Taïwan).
 
---
 
## 2. Ce qui est TRANCHÉ (décisions prises)
 
### Produit & contenu
- **Unité de base = la fiche-benchmark**, au grain le plus fin correspondant à une
  *mesure votable* concrète (pas un thème large).
- **Navigation par tags transversaux**, pas par arbre strict. Une fiche peut
  apparaître sous plusieurs entrées (ex. une fiche taguée à la fois `nuit`,
  `infrastructure`, `alcool`). Évite la duplication et gère la transversalité.
- **Distinction de niveau de preuve par mesure** :
  - `ÉPROUVÉ` = déployé à grande échelle ailleurs, résultats mesurés dans la durée.
  - `ÉMERGENT` = testé/prometteur, sans preuve consolidée → vote = « veut-on
    *expérimenter* / devenir pays pilote ? ». Statut affiché sans ambiguïté.
- **Double mode de lecture** : Rapide (par défaut) / Approfondi (détails repliables).
- **Rubrique méthodo permanente** sur chaque fiche : « ce que les chiffres prouvent
  et ne prouvent pas » (sépare le facteur traité des autres facteurs).
- **Indicateur de réception** par mesure : axe *divise ↔ rassemble* (pas « pour/contre »),
  même traitement visuel pour succès et rejet, **affiché seulement au-delà d'un seuil
  de votes significatif**.
### Moteur de vote
- **Pol.is** comme moteur de délibération/consensus (open source, AGPLv3, porté par
  un organisme à but non lucratif).
- **Pol.is reste le moteur principal du vote** (pas relégué derrière un vote maison).
  Choix assumé pour préserver la puissance de l'intelligence collective.
- **Mécanique de consensus** : on met en avant ce qui rassemble *à travers les
  groupes d'opinion*, pas la majorité brute. Deux classements distincts :
  « consensus » et « débats / sujets qui divisent encore ».
- **Hébergement** : commencer sur le **Pol.is hébergé** (gratuit pour secteur
  non lucratif/public, conforme RGPD). **Self-host plus tard** si besoin de
  souveraineté (nécessite ingénieurs cloud seniors).
### Positionnement projet
- **Code open source assumé** (sert la crédibilité de neutralité ; désamorce l'AGPL).
- **Pas de concurrent direct** sur le croisement précis (benchmark international +
  vote citoyen + classement par capacité à rassembler). Voisins = boussoles
  électorales, plateformes de concertation, évaluateurs publics (Cour des comptes) :
  tous sont soit des sources, soit des briques, pas des rivaux.
- **Avantage défendable = l'exécution** (qualité des fiches, crédibilité, confiance),
  pas l'idée elle-même (qui est « dans l'air »).
### Thème pilote
- **Sécurité routière → sous-thème « visibilité nocturne »** = MVP de démonstration.
  Constat France chiffré et validé (≈46 % des morts la nuit pour ≈10 % du trafic ;
  risque ×7 au crépuscule ; ~50 % des accidents la nuit par temps de pluie).
  Benchmark : Suède (Vision Zero, barrière médiane −80 %), norme EN 1436 (marquage
  visible sous la pluie), piste émergente = marquage luminescent (NL, N329 Oss).
---
 
## 3. Ce qui reste OUVERT (à mûrir avant lancement public — PAS pour le MVP)
 
### A. Identité des votants & intégrité du vote  *(priorité la plus haute)*
- **Problème** : le mode anonyme par défaut de Pol.is **n'empêche pas le double
  vote** (navigation privée, multi-appareils). Manipulation mécanique = **détectée
  a posteriori dans les données, pas prévenue**.
- **Ce qui n'est PAS un problème** : l'afflux d'opinions tranchées / d'un même camp.
  Pol.is en fait un signal utile (les « extrêmes » votent beaucoup et finissent par
  rejoindre des consensus). Ne pas modérer le *fond*.
- **Arbitrage à faire** : participation (ouvert, anonyme) ⟷ fiabilité (vérifié).
  - Pour le MVP démo : anonyme suffit.
  - Pour une version qui prétend influencer : viser **« anonyme mais vérifié »**
    (URL / jetons e-mail à usage unique) + **surveillance analytique** des données.
- **À vérifier directement à la source** : limites d'usage exactes, localisation
  serveurs, détails RGPD du service hébergé (lire TOS + privacy ; écrire à CompDem).
### B. Modèle de production des fiches  *(condition du passage à l'échelle)*
- Tension : qualité (crédibilité) ⟷ quantité (utilité). Une fiche = un vrai travail
  d'étude.
- Trajectoire retenue : **produire seul 3-5 fiches exemplaires** (assisté IA) →
  prouver le concept → **outiller la production** (pipeline IA qui pré-remplit le
  gabarit à partir de sources) → **ouvrir à la contribution encadrée**.
- ⚠️ Ne PAS construire le pipeline d'automatisation avant d'avoir prouvé la valeur
  d'une fiche faite main.
- **Règle d'or** : collecte & structuration assistables par IA ; **validation
  toujours humaine**.
### C. Gouvernance éditoriale
- **Associations d'intérêt général comme contributrices expertes** (ex. prévention
  routière sur la sécurité routière). Résout main-d'œuvre + caution.
  - ⚠️ **Risque neutralité** : une association milite. Parade = **séparer les rôles** :
    l'association *propose/alimente*, la plateforme *garde le contrôle de la conformité
    à la charte* (équilibre, objections, sources contradictoires). **Afficher
    l'origine** de chaque fiche (« élaborée avec X, revue selon la charte »).
  - Vient tard (il faut d'abord exister et être crédible).
- **Qui décide** des sujets, sources, fermetures, et **selon quelles règles écrites
  et publiques** ? → à formaliser.
### D. Cycle de vie d'une fiche (ouvrir / réviser / archiver)
- **Principe** : fermer un sujet est un **acte de pouvoir** → règles **publiques,
  objectives, uniformes**. Jamais l'appréciation au cas par cas.
- **L'état bascule sur des FAITS vérifiables**, pas sur un vote :
  - mesure adoptée/rejetée par le législateur → `ABOUTI`
  - benchmark de référence mis à jour → `À RÉVISER`
  - inactivité > X mois → `EN SOMMEIL`
- **Le consensus Pol.is ÉCLAIRE mais ne DÉCIDE pas** : un consensus fort, stable,
  durable, sur beaucoup de votes peut *déclencher une revue*, pas une clôture
  automatique. (Ne jamais poser « faut-il clore ce sujet ? » au vote → manipulable,
  = levier de censure.)
- **Archiver = figer en lecture seule avec résultats visibles**, pas supprimer.
  Les sujets aboutis = archive consultable = meilleure vitrine (« ce qui a changé »).
### E. Impact réel  *(question stratégique de fond)*
- Produire un consensus ≠ être écouté du pouvoir. vTaiwan a marché car le
  gouvernement *invitait* la démarche ; ici on part de l'extérieur.
- Pas de réponse technique. Déterminera si le projet « marque les esprits » ou
  reste un bel objet ignoré. À réfléchir, ne bloque rien aujourd'hui.
### F. Nom
- Candidat actuel : **« Consensus »** — colle parfaitement au fond.
  - ⚠️ Faiblesse : orthographe non triviale (piège du double-s) → risque sur la
    saisie, l'oral, le référencement.
  - Parades possibles : nom *évoquant* le consensus sans la difficulté ; ou achat
    des variantes de domaine mal orthographiées en redirection.
---
 
## 4. Pages & composants du SITE (au-delà de la fiche)
 
> La fiche existe (MVP). Reste la couche qui agrège/présente/organise/entretient.
 
- **Page d'accueil / tendances** :
  - compteur de votes global (⚠️ dépend du pipeline d'export ; afficher la fraîcheur,
    ne pas faire croire au temps réel).
  - rubriques : plus votés (≠ plus consensuels !), **consensus** vs **débats ouverts**
    (cadrage soigné : « sujets qui nous divisent encore », pas « les moins
    consensuels »), plus récents, **aboutis** (ce qui a eu un impact).
  - garder **volume** (popularité) et **consensus** (accord) comme deux axes séparés.
- **Taxonomie** : liste de thèmes (≈ ministères) → sous-thèmes → fiches + système de
  tags. Construire **par accrétion**, thème par thème. Commencer par sécurité
  routière comme modèle reproductible.
- **Pages annexes « qui rassurent »** (capital pour un projet dont le produit est la
  confiance) :
  - **Méthode** (choix des sujets, qualification des sources, éprouvé/émergent)
  - **Charte** de neutralité
  - **Modération** (règles ; « on modère la forme — insultes, haine —, jamais le fond »)
  - **Données & vie privée** (où sont les votes, RGPD, anonymat)
  - **Qui sommes-nous / financement** (répondre franchement à « qui paie ? quel
    agenda ? » — sera scruté).
---
 
## 5. Le « backend » à prévoir (premier vrai morceau technique)
 
- **Pipeline d'export Pol.is → stockage propre** : récupérer périodiquement les
  données de chaque conversation.
  - Sert **double usage** : (1) alimenter l'indicateur de réception + compteurs +
    classements ; (2) **sauvegarde** (ne jamais considérer l'hébergement Pol.is
    comme sa propre sauvegarde — règle 3-2-1).
- Rattachement fiche ↔ conversation Pol.is (un `conversation_id` par sous-thème).
- Pol.is embarqué via **iframe** → **on ne peut pas styler son contenu** depuis la
  page hôte (same-origin). Conséquence assumée : pas de surcouche CSS sur le vote
  (ce qui évite aussi d'orienter le vote). Tout le style « à nous » vit hors iframe.
---
 
## 6. Séquencement conseillé (pour ne pas se noyer)
 
**Phase 0 — Prouver le concept (en cours)**
1. ✅ Gabarit de fiche + fiche « visibilité nocturne » remplie et sourcée.
2. ✅ Maquette de l'interface de vote (réplique Pol.is) + indicateur de réception.
3. ⬜ Brancher un **vrai** Pol.is sur la fiche (créer la conversation, seeds A/B/C).
4. ⬜ Mettre en place l'**export** des données Pol.is (backup + lecture).
**Phase 1 — Donner du corps**
5. ⬜ 3-5 fiches exemplaires sur le thème sécurité routière (modèle reproductible).
6. ⬜ Page d'accueil minimale (compteur, quelques classements).
7. ⬜ Pages annexes essentielles (méthode, charte, modération, données, qui/financement).
 
**Phase 2 — Décisions de lancement public**
8. ⬜ Trancher l'**identité des votants** (anonyme vérifié + surveillance).
9. ⬜ Formaliser les **règles de cycle de vie** des fiches (états sur faits).
10. ⬜ Formaliser la **gouvernance** (qui décide, règles publiques).
11. ⬜ Vérifier TOS/RGPD Pol.is hébergé à la source ; décider self-host ou non.
 
**Phase 3 — Échelle**
12. ⬜ Outiller la production de fiches (pipeline IA assisté, validation humaine).
13. ⬜ Ouvrir la **contribution encadrée** (dont associations expertes, origine affichée).
14. ⬜ Travailler la question de l'**impact réel** (relais, écoute du pouvoir).
 
---
 
## 7. Garde-fous permanents (à ne jamais perdre de vue)
 
- **Neutralité** : exposer le prouvé ET ses limites ; jamais trancher à la place du
  citoyen ; même traitement pour ce qui plaît et ce qui déplaît.
- **Modérer la forme, jamais le fond.**
- **Validation humaine** sur tout contenu publié.
- **Transparence** : sources vérifiables, méthode visible, origine des fiches,
  financement, désaccords assumés.
- **Rigueur statistique** : pas de verdict sous le seuil de significativité.
- **Sauvegarde indépendante** des données de vote.
- **Ne pas tout construire d'un coup** : prouver la valeur sur un thème d'abord.
 
