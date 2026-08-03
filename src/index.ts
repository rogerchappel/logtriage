export type TriageSummary = {
  totalLines: number;
  errorLines: string[];
  warningLines: string[];
  exitCodeHints: string[];
};

const errorPattern = /\b(error|failed|failure|exception|fatal)\b/i;
const warningPattern = /\b(warn|warnings?|deprecated)\b/i;
const exitPattern = /\b(exit code|exited with|status)\s*[:=]?\s*(\d+)/i;
const zeroErrorPattern = /\b(?:0\s+(?:tests?\s+)?(?:errors?|failed|failures?)|(?:errors?|failures?)\s*[:=]\s*0)\b/gi;
const zeroWarningPattern = /\b(?:0\s+warnings?|warnings?\s*[:=]\s*0)\b/gi;

function hasPositiveDiagnostic(line: string, pattern: RegExp, zeroPattern: RegExp): boolean {
  return pattern.test(line.replace(zeroPattern, ''));
}

export function triageLog(input: string): TriageSummary {
  const lines = input.split(/\r?\n/).filter((line) => line.length > 0);
  const errorLines = lines.filter((line) => hasPositiveDiagnostic(line, errorPattern, zeroErrorPattern));
  const warningLines = lines.filter((line) => hasPositiveDiagnostic(line, warningPattern, zeroWarningPattern));
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
