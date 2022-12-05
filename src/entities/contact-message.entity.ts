import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_name' })
  name: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'subject' })
  subject: string;

  @Column({ name: 'message' })
  message: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
