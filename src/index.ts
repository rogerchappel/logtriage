export type TriageSummary = {
  totalLines: number;
  errorLines: string[];
  warningLines: string[];
  exitCodeHints: string[];
};

const errorPattern = /\b(error|failed|failure|exception|fatal)\b/i;
const warningPattern = /\b(warn|warning|deprecated)\b/i;
const exitPattern = /\b(exit code|exited with|status)\s*[:=]?\s*(\d+)/i;

export function triageLog(input: string): TriageSummary {
  const lines = input.split(/\r?\n/).filter((line) => line.length > 0);
  const errorLines = lines.filter((line) => errorPattern.test(line));
  const warningLines = lines.filter((line) => warningPattern.test(line));
  const exitCodeHints = lines.flatMap((line) => {
    const match = line.match(exitPattern);
    return match ? [match[0]] : [];
  });

  return {
    totalLines: lines.length,
    errorLines,
    warningLines,
    exitCodeHints,
  };
}

export function formatSummary(summary: TriageSummary): string {
  const rows = [
    `lines: ${summary.totalLines}`,
    `errors: ${summary.errorLines.length}`,
    `warnings: ${summary.warningLines.length}`,
  ];

  if (summary.exitCodeHints.length > 0) {
    rows.push(`exit hints: ${summary.exitCodeHints.join(', ')}`);
  }

  if (summary.errorLines[0]) {
    rows.push(`first error: ${summary.errorLines[0]}`);
  }

  return `${rows.join('\n')}\n`;
}
