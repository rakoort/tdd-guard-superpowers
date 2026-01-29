import { GuardManager } from '../guard/GuardManager'
import { ValidationResult } from '../contracts/types/ValidationResult'

export class UserPromptHandler {
  private readonly guardManager: GuardManager
  private readonly ON_COMMANDS = ['tdd-guard-superpowers on', 'tdd-guard on'] as const
  private readonly OFF_COMMANDS = ['tdd-guard-superpowers off', 'tdd-guard off'] as const

  constructor(guardManager?: GuardManager) {
    this.guardManager = guardManager ?? new GuardManager()
  }

  async processUserCommand(hookData: string): Promise<ValidationResult | undefined> {
    const data = JSON.parse(hookData)

    // Only process UserPromptSubmit events
    if (data.hook_event_name !== 'UserPromptSubmit') {
      return undefined
    }

    const command = data.prompt?.toLowerCase()

    if (this.ON_COMMANDS.includes(command)) {
      await this.guardManager.enable()
      return this.createBlockResult('TDD Guard enabled')
    }

    if (this.OFF_COMMANDS.includes(command)) {
      await this.guardManager.disable()
      return this.createBlockResult('TDD Guard disabled')
    }

    return undefined
  }

  private createBlockResult(message: string): ValidationResult {
    return {
      decision: undefined,
      reason: message,
      continue: false,
      stopReason: message
    }
  }

  async getDisabledResult(): Promise<ValidationResult | undefined> {
    const isEnabled = await this.guardManager.isEnabled()
    if (!isEnabled) {
      return { decision: undefined, reason: '' }
    }
    return undefined
  }
}