import { Global, Module } from '@nestjs/common';
import { APP_CONFIG, AppConfig } from './config.constants';

const config: AppConfig = {
  debug: true,
};

@Global()
@Module({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: config,
    },
  ],
  exports: [APP_CONFIG],
})
export class ConfigModule {}
