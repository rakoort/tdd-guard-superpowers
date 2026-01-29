import {
  LintResult,
  LintIssue,
  BiomeDiagnostic,
} from '../../contracts/schemas/lintSchemas'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { Linter } from '../Linter'

const execFileAsync = promisify(execFile)

export class Biome implements Linter {
  async lint(filePaths: string[], configPath?: string): Promise<LintResult> {
    const timestamp = new Date().toISOString()
    const args = buildArgs(filePaths, configPath)
    const execOptions = buildExecOptions(configPath)

    try {
      await execFileAsync('npx', args, execOptions)
      return createLintData(timestamp, filePaths, [])
    } catch (error) {
      if (!isExecError(error)) throw error

      const diagnostics = parseDiagnostics(error.stdout)
      return createLintData(timestamp, filePaths, diagnostics)
    }
  }
}

// Helper functions
const buildArgs = (files: string[], configPath?: string): string[] => {
  const args = ['@biomejs/biome', 'lint', '--reporter=json', ...files]
  if (configPath) {
    args.push('--config-path', configPath)
  }
  return args
}

const buildExecOptions = (
  configPath?: string
): { shell: boolean; cwd?: string } => {
  const options: { shell: boolean; cwd?: string } = {
    shell: process.platform === 'win32',
  }
  if (configPath) {
    options.cwd = configPath
  }
  return options
}

const isExecError = (error: unknown): error is Error & { stdout?: string } =>
  error !== null && typeof error === 'object' && 'stdout' in error

const parseDiagnostics = (stdout?: string): BiomeDiagnostic[] => {
  try {
    const result = JSON.parse(stdout ?? '{"diagnostics":[]}')
    return result.diagnostics ?? []
  } catch {
    return []
  }
}

const createLintData = (
  timestamp: string,
  files: string[],
  diagnostics: BiomeDiagnostic[]
): LintResult => {
  const issues = extractIssues(diagnostics)
  return {
    timestamp,
    files,
    issues,
    errorCount: countBySeverity(issues, 'error'),
    warningCount: countBySeverity(issues, 'warning'),
  }
}

const extractIssues = (diagnostics: BiomeDiagnostic[]): LintIssue[] =>
  diagnostics.filter(isLintDiagnostic).map(toIssue)

const isLintDiagnostic = (diagnostic: BiomeDiagnostic): boolean =>
  !diagnostic.category?.startsWith('internalError/')

const toIssue = (diagnostic: BiomeDiagnostic): LintIssue => ({
  file: diagnostic.location?.path?.file ?? 'unknown',
  line: 0,
  column: 0,
  severity: mapSeverity(diagnostic.severity),
  message:
    diagnostic.description ??
    diagnostic.message?.map((m) => m.content).join('') ??
    'unknown issue',
  rule: diagnostic.category,
})

const mapSeverity = (severity: string): 'error' | 'warning' =>
  severity === 'error' ? 'error' : 'warning'

const countBySeverity = (
  issues: LintIssue[],
  severity: 'error' | 'warning'
): number => issues.filter((i) => i.severity === severity).length
