export interface TokenService {
    generateToken(payload: any): string;
    verifyToken(token: string): any;
}
