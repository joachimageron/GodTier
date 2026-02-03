import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogoRepository } from '../../../application/ports/logo.repository';
import { Logo } from '../../../domain/logo';
import { LogoEntity } from '../entities/logo.entity';

@Injectable()
export class TypeOrmLogoRepository implements LogoRepository {
    constructor(
        @InjectRepository(LogoEntity)
        private readonly repository: Repository<LogoEntity>,
    ) {}

    async create(logo: Logo): Promise<Logo> {
        const entity = this.toEntity(logo);
        await this.repository.save(entity);
        return logo;
    }

    async findAll(): Promise<Logo[]> {
        const entities = await this.repository.find();
        return entities.map(this.toDomain);
    }

    async findById(id: string): Promise<Logo | null> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) return null;
        return this.toDomain(entity);
    }

    private toDomain(entity: LogoEntity): Logo {
        return new Logo(
            entity.id,
            entity.name,
            entity.imageUrl,
            entity.createdAt
        );
    }

    private toEntity(domain: Logo): LogoEntity {
        const entity = new LogoEntity();
        entity.id = domain.id;
        entity.name = domain.name;
        entity.imageUrl = domain.imageUrl;
        entity.createdAt = domain.createdAt;
        return entity;
    }
}
