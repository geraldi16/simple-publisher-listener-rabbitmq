import { Injectable } from '@nestjs/common';
import * as config from 'config';

export interface ConfigInterface {
  get<T extends any>(key: string, defaultValue?: T): T;
}

@Injectable()
export class Config implements ConfigInterface {
  /**
   * Get a configuration value based on a configuration key. It is able to access
   * a deep nested value, by using dot notation for the configuration key.
   */
  get<T = any>(key: string, defaultValue: T = null): T {
    if (config.has(key)) {
      return config.get(key);
    }

    return defaultValue;
  }
}
