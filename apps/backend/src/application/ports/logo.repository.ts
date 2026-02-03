import { Logo } from '../../domain/logo';

export interface LogoRepository {
    create(logo: Logo): Promise<Logo>;
    findAll(): Promise<Logo[]>;
    findById(id: string): Promise<Logo | null>;
}
