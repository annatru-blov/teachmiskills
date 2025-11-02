import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LOGGER_OPTIONS, LoggerModuleOptions } from './logger.constants';
import { ConfigModule } from 'src/config/config.module';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: LOGGER_OPTIONS,
          useValue: options,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
