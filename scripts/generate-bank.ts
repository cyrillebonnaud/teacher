/**
 * Batch question bank generator.
 *
 * Usage:
 *   npx tsx scripts/generate-bank.ts                # all themes × all levels
 *   npx tsx scripts/generate-bank.ts --subject Maths # filter by subject substring
 *   npx tsx scripts/generate-bank.ts --dry-run       # just show what would be generated
 *
 * Generates 100 questions per theme × level (1-4) with hints.
 * Output: data/question-bank/{subject-slug}.csv
 *
 * Resume-safe: skips theme×level combos already at 100+ rows in existing CSV.
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { THEMES } from "../lib/themes";
import { buildFreeTopicQcmPrompt, type Question } from "../lib/prompts";
import { claudeJson } from "../lib/claude";

const QUESTIONS_PER_COMBO = 100;
const BATCH_SIZE = 20;
const LEVELS = [1, 2, 3, 4];

function slug(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeCsv(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const CSV_HEADER =
  "subject,theme,level,question,choice_a,choice_b,choice_c,choice_d,correct,explanation,hint";

function questionToCsvRow(
  subject: string,
  theme: string,
  level: number,
  q: Question
): string {
  return [
    escapeCsv(subject),
    escapeCsv(theme),
    String(level),
    escapeCsv(q.question),
    escapeCsv(q.choices[0]),
    escapeCsv(q.choices[1]),
    escapeCsv(q.choices[2]),
    escapeCsv(q.choices[3]),
    String(q.correct),
    escapeCsv(q.explanation),
    escapeCsv(q.hint ?? ""),
  ].join(",");
}

function countExisting(
  csvPath: string,
  theme: string,
  level: number
): number {
  if (!existsSync(csvPath)) return 0;
  const lines = readFileSync(csvPath, "utf-8").split("\n");
  let count = 0;
  for (const line of lines) {
    if (line.includes(escapeCsv(theme)) && line.includes(`,${level},`)) {
      count++;
    }
  }
  return count;
}

function buildSchema(questionCount: number) {
  return {
    type: "array",
    items: {
      type: "object",
      properties: {
        question: { type: "string" },
        choices: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
        correct: { type: "integer", minimum: 0, maximum: 3 },
        explanation: { type: "string" },
        hint: { type: "string" },
      },
      required: ["question", "choices", "correct", "explanation", "hint"],
      additionalProperties: false,
    },
    minItems: questionCount,
    maxItems: questionCount,
  };
}

async function generateBatch(
  subject: string,
  theme: string,
  level: number,
  previousQuestions: string[],
  batchSize: number
): Promise<Question[]> {
  const prompt = buildFreeTopicQcmPrompt(
    theme,
    level,
    previousQuestions,
    batchSize,
    true, // helpMode = always true for hints
    subject,
    theme
  );
  const schema = buildSchema(batchSize);
  return claudeJson<Question[]>(prompt, schema);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const subjectFilterIdx = args.indexOf("--subject");
  const subjectFilter = subjectFilterIdx >= 0 ? args[subjectFilterIdx + 1] : null;

  const outDir = "data/question-bank";

  let themes = THEMES;
  if (subjectFilter) {
    themes = themes.filter((t) =>
      t.subject.toLowerCase().includes(subjectFilter.toLowerCase())
    );
  }

  const combos: { subject: string; theme: string; level: number }[] = [];
  for (const t of themes) {
    for (const level of LEVELS) {
      combos.push({ subject: t.subject, theme: t.theme, level });
    }
  }

  console.log(`\n📚 Question bank generator`);
  console.log(`   ${themes.length} themes × ${LEVELS.length} levels = ${combos.length} combos`);
  console.log(`   ${QUESTIONS_PER_COMBO} questions per combo = ${combos.length * QUESTIONS_PER_COMBO} total\n`);

  if (dryRun) {
    for (const c of combos) {
      const csvPath = `${outDir}/${slug(c.subject)}.csv`;
      const existing = countExisting(csvPath, c.theme, c.level);
      const status = existing >= QUESTIONS_PER_COMBO ? "SKIP" : `NEED ${QUESTIONS_PER_COMBO - existing}`;
      console.log(`  [${status}] ${c.subject} / ${c.theme} / N${c.level}`);
    }
    return;
  }

  let totalGenerated = 0;

  for (const combo of combos) {
    const csvPath = `${outDir}/${slug(combo.subject)}.csv`;
    const existing = countExisting(csvPath, combo.theme, combo.level);

    if (existing >= QUESTIONS_PER_COMBO) {
      console.log(`⏭  ${combo.subject} / ${combo.theme} / N${combo.level} — already ${existing} questions`);
      continue;
    }

    const needed = QUESTIONS_PER_COMBO - existing;
    const batches = Math.ceil(needed / BATCH_SIZE);
    const previousQuestions: string[] = [];

    console.log(`\n🎯 ${combo.subject} / ${combo.theme} / N${combo.level} — generating ${needed} questions (${batches} batches)`);

    // Ensure CSV file exists with header
    if (!existsSync(csvPath)) {
      writeFileSync(csvPath, CSV_HEADER + "\n");
    }

    for (let b = 0; b < batches; b++) {
      const batchSize = Math.min(BATCH_SIZE, needed - b * BATCH_SIZE);
      const attempt = b + 1;

      try {
        console.log(`   batch ${attempt}/${batches} (${batchSize} questions)...`);
        const questions = await generateBatch(
          combo.subject,
          combo.theme,
          combo.level,
          previousQuestions,
          batchSize
        );

        const rows = questions.map((q) =>
          questionToCsvRow(combo.subject, combo.theme, combo.level, q)
        );

        // Append to CSV
        writeFileSync(csvPath, rows.join("\n") + "\n", { flag: "a" });

        // Track previous questions for dedup
        for (const q of questions) {
          previousQuestions.push(q.question);
        }

        totalGenerated += questions.length;
        console.log(`   ✓ ${questions.length} questions saved (total: ${totalGenerated})`);
      } catch (err) {
        console.error(`   ✗ batch ${attempt} failed:`, err instanceof Error ? err.message : err);
        // Continue to next batch — resume will pick up missing questions
      }

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`\n✅ Done! Generated ${totalGenerated} questions total.`);
  console.log(`   Output: ${outDir}/\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
