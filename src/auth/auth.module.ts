import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [
    AuthService,
    {
      // makes the AuthGuard global. Nest will bind it to every route handler
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      global: true,
      signOptions: { expiresIn: '1hr' },
    }),
  ],
})
export class AuthModule {}
