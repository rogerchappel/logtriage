export type TriageSummary = {
  totalLines: number;
  errorLines: string[];
  warningLines: string[];
  exitCodeHints: string[];
};

const errorPattern =
  /(?:\bnpm\s+ERR!|\b[A-Za-z][A-Za-z0-9_]*Error\s*:|\b(?:errors?|failures?)(?:\s+count)?\s*[:=]?\s*\(?\s*[1-9]\d*|\b(?:error|failed|failure|exception|fatal)\b)/i;
const warningPattern = /\b(warn|warnings?|deprecated)\b/i;
const exitPattern = /\b(exit code|exited with|process status)\s*[:=]?\s*(\d+)/i;
const zeroErrorPattern =
  /\b(?:0\s+(?:tests?\s+)?(?:errors?|failed|failures?)|(?:errors?|failures?)(?:\s+count)?\s*[:=]?\s*\(?\s*0\s*\)?)/gi;
const zeroWarningPattern =
  /\b(?:0\s+warnings?|warnings?(?:\s+count)?\s*[:=]?\s*\(?\s*0\s*\)?)/gi;
const negatedDiagnosticPattern =
  /\b(?:no|without)\s+(?:errors?|warnings?)(?:\s*(?:,|and|or)\s*(?:errors?|warnings?))*\b/gi;
const ansiPattern =
  /[\u001B\u009B](?:(?:\][^\u0007\u001B]*(?:\u0007|\u001B\\))|(?:[[(\]][0-?]*[ -/]*[@-~])|(?:[PX^_].*?\u001B\\)|(?:[@-_]))/g;

function stripAnsi(line: string): string {
  return line.replace(ansiPattern, '');
}

function hasPositiveDiagnostic(line: string, pattern: RegExp, zeroPattern: RegExp): boolean {
  return pattern.test(line.replace(zeroPattern, '').replace(negatedDiagnosticPattern, ''));
}

export function triageLog(input: string): TriageSummary {
  const lines = input.split(/\r?\n/).filter((line) => line.length > 0);
  const normalizedLines = lines.map((source) => ({ source, matchable: stripAnsi(source) }));
  const errorLines = normalizedLines
    .filter(({ matchable }) => hasPositiveDiagnostic(matchable, errorPattern, zeroErrorPattern))
    .map(({ source }) => source);
  const warningLines = normalizedLines
    .filter(({ matchable }) => hasPositiveDiagnostic(matchable, warningPattern, zeroWarningPattern))
    .map(({ source }) => source);
  const exitCodeHints = normalizedLines.flatMap(({ matchable }) => {
    const match = matchable.match(exitPattern);
    return match && Number(match[2]) !== 0 ? [match[0]] : [];
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
