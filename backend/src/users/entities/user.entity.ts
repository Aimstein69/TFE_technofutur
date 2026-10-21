import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
  })
  email: string | null;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @Column({
    name: 'avatar_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  avatarUrl: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'offline',
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'fr',
  })
  language: string;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;

  
@Column({
  name: 'failed_login_attempts',
  type: 'integer',
  default: 0,
})
failedLoginAttempts: number;

@Column({
  name: 'locked_until',
  type: 'timestamptz',
  nullable: true,
})
lockedUntil: Date | null;


  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @Column({
    name: 'last_seen',
    type: 'timestamptz',
    nullable: true,
  })
  lastSeen: Date | null;

  @Column({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date | null;
}