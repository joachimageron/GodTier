import { Injectable } from '@nestjs/common';
import { PasswordService } from '../../application/ports/password.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements PasswordService {
    private readonly saltRounds = 10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
