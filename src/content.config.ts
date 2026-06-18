import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { MINISTERES } from './lib/taxonomie';

// Une fiche-benchmark = un fichier MDX. On la modélise en CHAMPS (pas un blob HTML) :
// son anatomie est stricte (keyfact, comparatif, mesures, sources). Le corps MDX
// porte la prose « approfondie ». Voir docs/ARCHITECTURE.md §3.
const fiches = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/fiches' }),
  schema: z.object({
    titre: z.string(), // <h1>
    chapo: z.string(),
    fil: z.object({
      ministere: z.enum(MINISTERES), // vocabulaire contrôlé figé (cf. lib/taxonomie.ts)
      theme: reference('themes'), // vocabulaire extensible (collection themes)
      sousTheme: reference('sousThemes'), // vocabulaire extensible (collection sousThemes)
    }),
    tags: z.array(z.string()), // navigation transversale
    // États POST-publication uniquement : « pas encore publié » est géré par le
    // workflow Git/PR (Sveltia), pas par le frontmatter. Voir docs/ARCHITECTURE.md §5.
    statut: z.enum(['publie', 'a_reviser', 'abouti', 'en_sommeil', 'archive']),
    origine: z.object({
      elaboreeAvec: z.string().optional(),
      revueCharte: z.boolean(),
    }),
    keyfact: z.object({
      chiffre: z.string(),
      texte: z.string(),
      source: z.number().optional(), // index dans `sources`
    }),
    comparatif: z.array(
      z.object({
        pays: z.string(),
        sousTitre: z.string().optional(), // ex. « Vision Zero »
        tuesParM: z.string(), // « 20 », « — », « 48 »
        levier: z.string(),
        sources: z.array(z.number()).default([]), // renvois en exposant
        role: z.enum(['france', 'reference', 'autre']),
      }),
    ),
    // Les mesures DEVIENNENT les seeds Pol.is : c'est le lien fiche <-> vote.
    mesures: z.array(
      z.object({
        id: z.string(), // « A », « B », « C »
        texte: z.string(),
        preuve: z.enum(['eprouve', 'emergent']),
        polisCommentId: z.number().optional(), // rempli APRÈS seeding
      }),
    ),
    sources: z.array(
      z.object({
        n: z.number(),
        texte: z.string(),
        // Le CMS écrit '' pour un champ vide -> on tolère URL valide | '' | absent.
        url: z.string().url().or(z.literal('')).optional(),
      }),
    ),
    polis: z.object({
      conversationId: z.string(), // REQUIS pour l'embed + condition de publication
      reportId: z.string().optional(), // export public reportExport (compteurs/réception)
      pageId: z.string().optional(),
    }),
  }),
});

// Vocabulaires EXTENSIBLES : chaque terme = une entrée éditable dans le CMS.
// reference() valide au build que la fiche pointe vers un terme existant
// (intégrité référentielle) tout en restant extensible sans toucher au code.
const themes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/themes' }),
  schema: z.object({ nom: z.string() }),
});

const sousThemes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sous-themes' }),
  schema: z.object({ nom: z.string() }),
});

export const collections = { fiches, themes, sousThemes };
