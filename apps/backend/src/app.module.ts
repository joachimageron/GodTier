import { Module } from '@nestjs/common';
import { TierListController } from './infrastructure/controllers/tier-list.controller';
import { HealthController } from './infrastructure/controllers/health.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { S3Service } from './infrastructure/s3/s3.service';

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [TierListController, HealthController],
    providers: [S3Service],
})
export class AppModule { }
