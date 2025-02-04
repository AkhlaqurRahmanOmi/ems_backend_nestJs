import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // Fetch the user and include their role
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { roles: true }, // Include the user's role
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user; // This populates `req.user` with the user and their role
  }
}
