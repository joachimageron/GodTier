import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TierListRepository } from '../../../application/ports/tier-list.repository';
import { TierList } from '../../../domain/tier-list';
import { TierListEntity } from '../entities/tier-list.entity';

@Injectable()
export class TypeOrmTierListRepository implements TierListRepository {
  constructor(
    @InjectRepository(TierListEntity)
    private readonly repository: Repository<TierListEntity>,
  ) {}

  async findAll(): Promise<TierList[]> {
    const entities = await this.repository.find();
    return entities.map(this.toDomain);
  }

  async findById(id: string): Promise<TierList | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findByOwnerId(ownerId: number): Promise<TierList[]> {
    const entities = await this.repository.find({ where: { ownerId } });
    return entities.map(this.toDomain);
  }

  async save(tierList: TierList): Promise<void> {
    const entity = this.toEntity(tierList);
    await this.repository.save(entity);
  }

  private toDomain(entity: TierListEntity): TierList {
    return new TierList(
      entity.id,
      entity.title,
      entity.description || undefined,
      entity.ownerId,
      entity.items,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toEntity(domain: TierList): TierListEntity {
    const entity = new TierListEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description || '';
    entity.ownerId = domain.ownerId;
    entity.items = domain.items as any; // Cast to satisfy simple-json expectation
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
