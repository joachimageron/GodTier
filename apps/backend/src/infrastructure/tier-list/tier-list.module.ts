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
import { GetTierListsPdfSummaryUseCase } from '../../application/use-cases/tier-list/get-tier-lists-pdf-summary.use-case';
import { PdfKitGeneratorService } from '../pdf/pdf-generator.service';
import { S3Service } from '../s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([TierListEntity])],
  controllers: [TierListController],
  providers: [
    {
      provide: 'TierListRepository',
      useClass: TypeOrmTierListRepository,
    },
    {
      provide: 'PdfGeneratorService',
      useClass: PdfKitGeneratorService,
    },
    {
      provide: 'FileStorageService',
      useClass: S3Service,
    },
    CreateTierListUseCase,
    GetTierListUseCase,
    AddLogoUseCase,
    MoveLogoUseCase,
    GetUserTierListsUseCase,
    GetTierListsPdfSummaryUseCase,
  ],
  exports: [],
})
export class TierListModule {}
