import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import newrelicFormatter from '@newrelic/winston-enricher';

const isProduction = process.env.NODE_ENV === 'production';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      level: isProduction ? 'info' : 'debug',
      format: isProduction
        ? winston.format.combine(
            winston.format.timestamp(),
            newrelicFormatter(winston)(),
          )
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Gateway', {
              colors: true,
              prettyPrint: true,
            }),
          ),
    }),
  ],
};
