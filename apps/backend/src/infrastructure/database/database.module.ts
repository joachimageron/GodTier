import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: process.env.DATABASE_URL || 'dev.db',
            entities: [User],
            synchronize: true, // Only for development! Set to false in production
            logging: process.env.NODE_ENV !== 'production',
        }),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UserRepository],
    exports: [UserRepository],
})
export class DatabaseModule {}
