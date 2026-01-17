import { ApiProperty } from "@nestjs/swagger"
import { BaseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user"

@Entity("password_reset_tokens")
export class PasswordResetToken extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ApiProperty()
  @Index()
  @Column({ name: "user_id", nullable: false })
  public userId: string

  @ManyToOne(() => User, (user: User) => user.emailVerificationTokens, {})
  @JoinColumn({ referencedColumnName: "id", name: "user_id" })
  public user: User

  @ApiProperty()
  @Column({ name: "token", nullable: false })
  public token: string

  @ApiProperty()
  @CreateDateColumn({ name: "valid_until", type: "timestamp with time zone" })
  public validUntil: Date
}
