import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_OPTIONS, type LoggerModuleOptions } from './logger.constants';
import { APP_CONFIG, type AppConfig } from 'src/config/config.constants';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(LOGGER_OPTIONS) private readonly options: LoggerModuleOptions,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  debug(message: string) {
    if (!this.config.debug) return;
    if (['debug'].includes(this.options)) {
      console.log(`[debug]${message}`);
    }
  }

  info(message: string) {
    if (!this.config.debug) return;
    if (['debug', 'info'].includes(this.options)) {
      console.log(`[info]${message}`);
    }
  }

  warn(message: string) {
    if (!this.config.debug) return;
    if (['debug', 'info', 'warn'].includes(this.options)) {
      console.log(`[warn]${message}`);
    }
  }
}
