import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../application/ports/token.service';

@Injectable()
export class JwtTokenService implements TokenService {
    constructor(private readonly jwtService: JwtService) {}

    generateToken(payload: any): string {
        return this.jwtService.sign(payload);
    }

    verifyToken(token: string): any {
        return this.jwtService.verify(token);
    }
}
