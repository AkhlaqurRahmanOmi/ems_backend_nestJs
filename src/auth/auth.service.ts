import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register a new user
  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find or create the default "USER" role
    const defaultRole = await this.prisma.role.findUnique({
      where: { name: 'USER' },
    });

    if (!defaultRole) {
      throw new Error('Default role "USER" not found');
    }

    // Create the user with the default role
    // @ts-ignore
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: {
          connect: { id: defaultRole.id }, // Link the user to the "USER" role
        },
      },
    });

    return user;
  }

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Generate JWT token
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}