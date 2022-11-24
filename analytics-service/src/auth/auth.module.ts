import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/role.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
