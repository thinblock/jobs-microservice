
import * as mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { config } from './env';

async function initDb() {
  const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
  };
  try {
    await mongoose.connect(config.db, options);
    logger.info('DB Connected');
  } catch (e) {
    logger.error('Unable to connect to the database:', e);
  }
}

initDb();