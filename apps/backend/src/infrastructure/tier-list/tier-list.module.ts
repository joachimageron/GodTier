import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TierListController } from '../controllers/tier-list.controller';
import { TierListEntity } from '../database/entities/tier-list.entity';
import { TypeOrmTierListRepository } from '../database/repositories/tier-list.repository';
import { CreateTierListUseCase } from '../../application/use-cases/tier-list/create-tier-list.use-case';
import { GetTierListUseCase } from '../../application/use-cases/tier-list/get-tier-list.use-case';
import { AddLogoUseCase } from '../../application/use-cases/tier-list/add-logo.use-case';
import { MoveLogoUseCase } from '../../application/use-cases/tier-list/move-logo.use-case';
import { GetUserTierListsUseCase } from '../../application/use-cases/tier-list/get-user-tier-lists.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([TierListEntity])],
  controllers: [TierListController],
  providers: [
    {
      provide: 'TierListRepository',
      useClass: TypeOrmTierListRepository,
    },
    CreateTierListUseCase,
    GetTierListUseCase,
    AddLogoUseCase,
    MoveLogoUseCase,
    GetUserTierListsUseCase,
  ],
  exports: [],
})
export class TierListModule {}
