// Cycle de vie POST-publication d'une fiche (cf. docs/ARCHITECTURE.md §5,
// intake/pilotage.md §3.D). L'état bascule sur des FAITS, jamais sur un vote.
// « brouillon / en revue » = avant publication = géré par le workflow Git/PR.
export type Statut = 'publie' | 'a_reviser' | 'abouti' | 'en_sommeil' | 'archive';

export interface StatutInfo {
  /** Libellé court (pastille accueil, bandeau). */
  label: string;
  /** Classe de ton CSS (= variantes de couleur). 'neutre' = rien à signaler. */
  ton: 'neutre' | 'abouti' | 'reviser' | 'sommeil' | 'archive';
  /** Message de bandeau sur la fiche (absent pour `publie`). */
  banner?: string;
}

const MAP: Record<Statut, StatutInfo> = {
  publie: { label: 'Publié', ton: 'neutre' },
  a_reviser: {
    label: 'À réviser',
    ton: 'reviser',
    banner:
      'Un benchmark de référence a évolué : cette fiche est en cours de révision.',
  },
  abouti: {
    label: 'Abouti',
    ton: 'abouti',
    banner:
      'Sujet abouti : une décision a été prise sur cette mesure. La fiche et la conversation restent consultables.',
  },
  en_sommeil: {
    label: 'En sommeil',
    ton: 'sommeil',
    banner: 'Sujet en sommeil, faute d’activité récente. Toujours consultable.',
  },
  archive: {
    label: 'Archivé',
    ton: 'archive',
    banner: 'Fiche archivée, en lecture seule. Les résultats restent visibles.',
  },
};

export function statutInfo(statut: Statut): StatutInfo {
  return MAP[statut] ?? MAP.publie;
}
