import { Module } from '@nestjs/common';
import { TierListController } from './infrastructure/controllers/tier-list.controller';
import { HealthController } from './infrastructure/controllers/health.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { S3Service } from './infrastructure/s3/s3.service';

@Module({
    imports: [DatabaseModule],
    controllers: [TierListController, HealthController],
    providers: [S3Service],
})
export class AppModule { }
