import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity"

@Entity("refresh_tokens")
@Index("ux_session_user_device", ["userId", "userAgent"], { unique: true })
@Index("ix_session_user_revoked", ["userId", "revoked"])
export class SessionState {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "user_agent", type: "text" })
  userAgent: string

  @Column({ type: "boolean", default: false })
  revoked: boolean

  @Column({
    name: "revoked_at",
    type: "timestamptz",
    nullable: true,
  })
  revokedAt: Date | null

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date

  @Column({ name: "user_id", type: "uuid" })
  userId: string

  @ManyToOne(() => User, (user) => user.sessionStates, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user?: User
}
