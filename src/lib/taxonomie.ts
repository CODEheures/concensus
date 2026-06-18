// Vocabulaire contrôlé des ministères (≈ grands domaines de politique publique).
// Liste CANONIQUE : référencée par le schéma Zod (validation au build) ET mirroir
// dans public/admin/config.yml (menu déroulant du CMS) — garder les deux en phase.
//
// Évolutif par accrétion : pour ajouter un domaine, ajouter une ligne ICI *et*
// la même dans config.yml. Labels volontairement larges et durables (pas les
// intitulés exacts d'un gouvernement, qui changent à chaque remaniement).
export const MINISTERES = [
  'Mobilité & Transports',
  'Intérieur & Sécurité',
  'Justice',
  'Santé & Solidarités',
  'Éducation & Jeunesse',
  'Enseignement supérieur & Recherche',
  'Travail & Emploi',
  'Économie & Finances',
  'Transition écologique & Énergie',
  'Agriculture & Alimentation',
  'Culture',
  'Logement & Aménagement',
  'Affaires étrangères',
  'Armées & Défense',
  'Outre-mer',
  'Sports',
] as const;

export type Ministere = (typeof MINISTERES)[number];
