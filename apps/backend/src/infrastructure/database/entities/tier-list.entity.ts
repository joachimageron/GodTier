import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Logo, TierCategory } from '../../../domain/tier-list';

@Entity('tier_lists')
export class TierListEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  ownerId: number;

  @Column('simple-json')
  items: Record<TierCategory, Logo[]>;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
