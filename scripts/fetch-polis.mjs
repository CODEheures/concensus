// @ts-check
/**
 * Pipeline compteurs / réception Pol.is (cf. docs/ARCHITECTURE.md §7).
 *
 * Pour chaque fiche : lit polis.reportId dans le frontmatter, télécharge les
 * exports CSV PUBLICS du report (reportExport — vérifié sans auth), calcule par
 * mesure la position « divise <-> rassemble » À TRAVERS LES GROUPES d'opinion,
 * et écrit src/data/polis/<conversationId>.json (+ horodatage de fraîcheur).
 *
 * Lancé en CI (cron) ; commit du JSON => rebuild Cloudflare Pages.
 * Aucune dépendance runtime côté site : ce n'est qu'un fichier de données.
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FICHES_DIR = join(ROOT, 'src', 'content', 'fiches');
const OUT_DIR = join(ROOT, 'src', 'data', 'polis');

// Seuil de significativité : pas de verdict sous ce nombre de votes (garde-fou).
const SEUIL_VOTES = 7;
const REPORT_BASE = 'https://pol.is/api/v3/reportExport';

/** Parseur CSV minimal mais correct (RFC 4180 : guillemets, virgules et
 *  retours-ligne dans les champs). */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\r') {
      // ignore
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

async function fetchCSV(reportId, file) {
  const url = `${REPORT_BASE}/${reportId}/${file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${file} -> HTTP ${res.status}`);
  return parseCSV(await res.text());
}

/** Position cross-groupes 0 (divise) .. 100 (rassemble) pour une affirmation.
 *  Esprit Pol.is : une mesure « rassemble » seulement si MÊME le groupe le moins
 *  d'accord est d'accord -> on prend le min des taux d'accord par groupe. */
function receptionFromRow(headers, row) {
  const col = (name) => {
    const idx = headers.indexOf(name);
    return idx === -1 ? 0 : Number(row[idx]) || 0;
  };
  const totalVotes = col('total-votes');

  // Détecte les groupes présents (group-a-*, group-b-*, ...).
  const groups = headers
    .map((h) => /^group-([a-z]+)-votes$/.exec(h)?.[1])
    .filter((g, i, a) => g && a.indexOf(g) === i);

  const rates = [];
  for (const g of groups) {
    const a = col(`group-${g}-agrees`);
    const d = col(`group-${g}-disagrees`);
    if (a + d > 0) rates.push(a / (a + d));
  }
  // Repli si aucune ventilation par groupe : accord global.
  if (rates.length === 0) {
    const a = col('total-agrees');
    const d = col('total-disagrees');
    if (a + d > 0) rates.push(a / (a + d));
  }

  const consensus = rates.length ? Math.min(...rates) : 0;
  const position = Math.round(consensus * 100);
  const aboveThreshold = totalVotes >= SEUIL_VOTES && rates.length > 0;

  let label;
  if (position >= 66)
    label = '<strong>Rassemble largement</strong> les différents groupes.';
  else if (position <= 40)
    label =
      '<strong>Divise</strong> les groupes d’opinion : pas de position commune à ce stade.';
  else label = '<strong>Réception partagée</strong> entre les groupes.';

  return { votes: totalVotes, position, label, aboveThreshold };
}

async function processFiche(file) {
  const raw = await readFile(join(FICHES_DIR, file), 'utf8');
  const { data } = matter(raw);
  const polis = data.polis ?? {};
  const slug = file.replace(/\.mdx?$/, '');
  if (!polis.conversationId || !polis.reportId) {
    console.log(`- ${slug} : pas de reportId, ignoré.`);
    return null;
  }

  const groupsCsv = await fetchCSV(polis.reportId, 'comment-groups.csv');
  const headers = groupsCsv[0];
  const cidIdx = headers.indexOf('comment-id');
  const byCid = new Map();
  for (const row of groupsCsv.slice(1)) {
    if (row.length <= cidIdx) continue;
    byCid.set(Number(row[cidIdx]), row);
  }

  const mesures = {};
  for (const m of data.mesures ?? []) {
    if (m.polisCommentId == null) continue;
    const row = byCid.get(Number(m.polisCommentId));
    mesures[m.polisCommentId] = row
      ? receptionFromRow(headers, row)
      : { votes: 0, position: 0, label: '', aboveThreshold: false };
  }

  return {
    slug,
    conversationId: polis.conversationId,
    reportId: polis.reportId,
    generatedAt: new Date().toISOString(),
    seuil: SEUIL_VOTES,
    mesures,
  };
}

async function main() {
  let files = [];
  try {
    files = (await readdir(FICHES_DIR)).filter((f) => /\.mdx?$/.test(f));
  } catch {
    console.error(`Dossier introuvable : ${FICHES_DIR}`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  let ok = 0;
  for (const file of files) {
    try {
      const result = await processFiche(file);
      if (!result) continue;
      const out = join(OUT_DIR, `${result.conversationId}.json`);
      await writeFile(out, JSON.stringify(result, null, 2) + '\n', 'utf8');
      const n = Object.values(result.mesures).filter((m) => m.aboveThreshold).length;
      console.log(
        `✓ ${result.slug} -> ${result.conversationId}.json (${n}/${Object.keys(result.mesures).length} mesures au-dessus du seuil)`,
      );
      ok++;
    } catch (err) {
      console.error(`✗ ${file} : ${err.message}`);
      process.exitCode = 1;
    }
  }
  console.log(`Terminé : ${ok} fiche(s) traitée(s).`);
}

main();
