import { mkdir, writeFile } from 'node:fs/promises';
import { createHighlighter } from 'shiki';

const snippets = {
  local: { lang: 'bash', code: `# Clone, install, and run locally.\ngit clone https://github.com/acoyfellow/argus\ncd argus\nbun install\n\n# Full local run through Wrangler. Real Workflows + Workers AI.\nbun run dev   # then open http://localhost:4173\n` },
  deploy: { lang: 'bash', code: `# Type-check, build, and deploy a single Worker.\nbun run check\nbun run build\nwrangler deploy\n` },
  loop: { lang: 'ts', code: `// Weak evidence creates the next search.\nconst board = await buildEvidenceBoard(question);\nconst gaps = board.facets.filter((facet) => facet.coverage === 'thin');\n\nfor (const gap of gaps) {\n  const evidence = await search(gap.followUpQuery);\n  board.attach(gap.id, evidence);\n}\n\nreturn synthesize(board);\n` }
};
const outDir = new URL('../static/docs/', import.meta.url);
await mkdir(outDir, { recursive: true });
const highlighter = await createHighlighter({ themes: ['github-dark'], langs: ['bash', 'ts'] });
for (const [name, snippet] of Object.entries(snippets)) {
  const html = highlighter.codeToHtml(snippet.code, { lang: snippet.lang, theme: 'github-dark' });
  await writeFile(new URL(`${name}.html`, outDir), html);
}
