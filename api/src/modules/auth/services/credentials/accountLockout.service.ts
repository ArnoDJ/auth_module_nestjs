/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "../../entities/user.entity"
import { LoginAttemptResultEnum } from "../../enums/loginAttempResult.enum"

const LOCKOUT_START_ATTEMPT = 5
const MAX_LOCKOUT_MINUTES = 24 * 60
const SUCCESS_DECREMENT = 2
const JITTER_PERCENT = 0.1


@Injectable()
export class AccountLockoutService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async execute(
    user: User,
    result: LoginAttemptResultEnum,
  ): Promise<void> {
    this.assertNotLocked(user)
    if (result === LoginAttemptResultEnum.FAILURE) {
      await this.recordFailure(user)
      return
    }
    await this.recordSuccess(user)
  }

  private assertNotLocked(user: User): void {
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error("ACCOUNT_LOCKED")
    }
  }

  private async recordFailure(user: User): Promise<void> {
    const failedAttempts = user.failedLoginAttempts + 1
    const now = new Date()
    const lockoutMinutes = this.calculateLockoutMinutes(failedAttempts)

    await this.userRepository.update(user.id, {
      failedLoginAttempts: failedAttempts,
      lastFailedLoginAt: now,
      lockedUntil:
        lockoutMinutes > 0
          ? new Date(now.getTime() + lockoutMinutes * 60_000)
          : null,
    })
  }

  private async recordSuccess(user: User): Promise<void> {
    const reducedAttempts = Math.max(
      user.failedLoginAttempts - SUCCESS_DECREMENT,
      0,
    )
    await this.userRepository.update(user.id, {
      failedLoginAttempts: reducedAttempts,
      lockedUntil: null,
      lastFailedLoginAt: null,
    })
  }

  private calculateLockoutMinutes(failedAttempts: number): number {
    if (failedAttempts < LOCKOUT_START_ATTEMPT) {
      return 0
    }
    const exponent = failedAttempts - LOCKOUT_START_ATTEMPT
    const baseMinutes = Math.pow(3, exponent)
    const cappedMinutes = Math.min(baseMinutes, MAX_LOCKOUT_MINUTES)
    return this.applyJitter(cappedMinutes)
  }

  private applyJitter(minutes: number): number {
    const jitter = minutes * JITTER_PERCENT
    const offset = (Math.random() * 2 - 1) * jitter
    return Math.max(1, Math.round(minutes + offset))
  }
}
