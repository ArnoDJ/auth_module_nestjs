import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity"
import { ApiProperty } from "@nestjs/swagger"

@Entity("email_verification_tokens")
export class EmailVerificationToken {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @ApiProperty()
  @Column({ unique: true })
  token: string

  @ApiProperty()
  @Column({ name: "valid_until", type: "timestamp" })
  validUntil: Date

  @ApiProperty()
  @Column({ name: "user_id", type: "uuid" })
  userId: string

  @ApiProperty()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "userId" })
  user: User
}
