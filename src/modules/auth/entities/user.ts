import { ApiProperty } from "@nestjs/swagger"
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { SessionState } from "./sessionState"
import { EmailVerificationToken } from "./emailVerificationToken"

@Entity("users")
@Index("ux_users_email", ["email"], { unique: true })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ApiProperty()
  @Column({ name: "first_name", type: "text", nullable: false })
  public firstName: string

  @ApiProperty()
  @Column({ name: "last_name", type: "text", nullable: false })
  public lastName: string

  @ApiProperty({
    description: "Unique email address used for login",
  })
  @Column({ name: "email", type: "text", nullable: false })
  public email: string

  @ApiProperty({
    description: "BCrypt hashed password",
  })
  @Column({ name: "password_hash", type: "text", nullable: false })
  public password: string

  @ApiProperty()
  @Column({ name: "admin", type: "boolean", default: false })
  public admin: boolean

  @ApiProperty({
    description: "Number of consecutive failed login attempts",
  })
  @Column({
    name: "failed_login_attempts",
    type: "int",
    default: 0,
    nullable: false,
  })
  public failedLoginAttempts: number

  @ApiProperty({
    description: "Account locked until this timestamp (null = not locked)",
    nullable: true,
  })
  @Column({
    name: "locked_until",
    type: "timestamp with time zone",
    nullable: true,
  })
  public lockedUntil: Date | null

  @ApiProperty({
    description: "Timestamp of the last failed login attempt",
    nullable: true,
  })
  @Column({
    name: "last_failed_login_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  public lastFailedLoginAt: Date | null


  @ApiProperty({
    description: "Timestamp when the email was verified",
    nullable: true,
  })
  @Column({ name: "email_verified_at", type: "timestamp", nullable: true })
  emailVerifiedAt: Date | null


  @ApiProperty()
  @CreateDateColumn({
    name: "created_at",
    type: "timestamp with time zone",
  })
  public createdAt: Date

  @ApiProperty()
  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp with time zone",
  })
  public updatedAt: Date

  @OneToMany(
    () => EmailVerificationToken,
    (token) => token.user,
  )
  emailVerificationTokens: EmailVerificationToken[]

  @OneToMany(() => SessionState, (sessionStates) => sessionStates.user)
  public sessionStates: SessionState[]
}
