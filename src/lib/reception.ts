import type { ReceptionData } from '../components/fiche/Reception.astro';

// Charge au BUILD les exports de réception générés par scripts/fetch-polis.mjs.
// Fichiers nommés par conversationId. Vide au départ -> indicateur « en attente ».
interface ReceptionFile {
  conversationId: string;
  generatedAt: string;
  seuil: number;
  mesures: Record<string, ReceptionData>;
}

const files = import.meta.glob<ReceptionFile>('../data/polis/*.json', {
  eager: true,
  import: 'default',
});

function fileFor(conversationId: string): ReceptionFile | undefined {
  return files[`../data/polis/${conversationId}.json`];
}

/** Réception d'une mesure (par commentId Pol.is), ou undefined si pas de données. */
export function getReception(
  conversationId: string,
  commentId: number | undefined,
): ReceptionData | undefined {
  if (commentId == null) return undefined;
  return fileFor(conversationId)?.mesures?.[String(commentId)];
}

/** Horodatage de fraîcheur de l'export (à afficher, jamais « temps réel »). */
export function getFreshness(conversationId: string): string | undefined {
  return fileFor(conversationId)?.generatedAt;
}
