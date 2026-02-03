import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogoController } from '../controllers/logo.controller';
import { LogoEntity } from '../database/entities/logo.entity';
import { TypeOrmLogoRepository } from '../database/repositories/logo.repository';
import { CreateLogoUseCase } from '../../application/use-cases/logo/create-logo.use-case';
import { GetAllLogosUseCase } from '../../application/use-cases/logo/get-all-logos.use-case';
import { GetLogoUseCase } from '../../application/use-cases/logo/get-logo.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([LogoEntity])],
    controllers: [LogoController],
    providers: [
        {
            provide: 'LogoRepository',
            useClass: TypeOrmLogoRepository,
        },
        CreateLogoUseCase,
        GetAllLogosUseCase,
        GetLogoUseCase,
    ],
    exports: [],
})
export class LogoModule {}
