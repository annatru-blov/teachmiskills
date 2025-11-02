import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [UsersModule, LoggerModule.forRoot('info'), ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
