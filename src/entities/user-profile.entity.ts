import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user-profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ name: 'email', default: 'cyber.admin@gmail.com' })
  email: string;

  @Column({ name: 'first_name', default: 'Cyberguard' })
  firstName: string;

  @Column({ name: 'last_name', default: 'Admin' })
  lastName: string;

  @Column({ name: 'jade', default: false })
  jade: boolean;

  @Column({ name: 'language', default: 'en' })
  language: string;

  @Column({ name: 'newsletter', default: false })
  newsletter: boolean;

  @Column({ name: 'email_notifications', default: false })
  emailNotifications: boolean;

  @Column({ name: 'theme', default: 'default' })
  theme: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
