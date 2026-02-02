import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserEntity } from '../entities/user.entity';
import { User } from '../../../domain/user';
import { UserRepository as UserRepositoryPort } from '../../../application/ports/user.repository';

@Injectable()
export class UserRepository implements UserRepositoryPort {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
    ) {}

    private toDomain(entity: UserEntity): User {
        return new User(entity.id, entity.email, entity.name, entity.password);
    }

    async findAll(): Promise<User[]> {
        const entities = await this.repository.find();
        return entities.map(e => this.toDomain(e));
    }

    async findById(id: number): Promise<User | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const entity = await this.repository.findOne({ where: { email } });
        return entity ? this.toDomain(entity) : null;
    }

    async create(user: Omit<User, 'id'>): Promise<User> {
        if (!user.password) {
            throw new Error('Password is required to create a user');
        }
        const entity = this.repository.create({
            email: user.email,
            name: user.name,
            password: user.password
        });
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        await this.repository.update(id, {
            ...(user.email && { email: user.email }),
            ...(user.name && { name: user.name }),
            ...(user.password && { password: user.password }),
        });
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        
        return (result.affected ?? 0) > 0;
    }
}
