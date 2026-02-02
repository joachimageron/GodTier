import { User } from '../../domain/user';

export interface UserRepository {
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: Omit<User, 'id'>): Promise<User>;
    update(id: number, user: Partial<User>): Promise<User | null>;
    delete(id: number): Promise<boolean>;
}
