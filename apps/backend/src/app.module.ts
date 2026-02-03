import { Module } from '@nestjs/common';
import { HealthController } from './infrastructure/controllers/health.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { S3Service } from './infrastructure/s3/s3.service';
import { TierListModule } from './infrastructure/tier-list/tier-list.module';

@Module({
    imports: [DatabaseModule, AuthModule, TierListModule],
    controllers: [HealthController],
    providers: [S3Service],
})
export class AppModule { }
