import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hash, verify } from 'argon2';
import { Response } from 'express';

@Injectable()
export class AuthService {
  public constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: RegisterDto): Promise<{ message: string }> {
    const { email, password, firstName, lastName, age, city, university } = signUpDto;

    const storedUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (storedUser) {
      throw new BadRequestException('user already exists');
    }

    const user = await this.prisma.user.create({
      data: { email, password: await hash(password), firstName, lastName, age, city, university }
    });

    return { message: 'user was created successfully' };
  }

  async signIn(signInDto: LoginDto, res: Response,): Promise<Response<any, Record<string, any>>> {
    const { email, password } = signInDto;

    const storedUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!storedUser) {
      throw new BadRequestException('no such a user');
    }

    if (!(await verify(storedUser.password, password))) {
      throw new BadRequestException('wrong password');
    }

    const jwt_token = await this.jwtService.signAsync(
      { id: storedUser.id, email },
      { secret: process.env.JWT_SECRET },
    );

    if (!jwt_token) {
      throw new ForbiddenException();
    }

    res.cookie('jwt_token', jwt_token);

    return res.send({ message: 'you logged in successfully' });
  }

  async signOut(res: Response): Promise<Record<string, any>> {
    res.clearCookie('jwt_token');

    return res.send({ message: 'logged out successfully' });
  }
}
