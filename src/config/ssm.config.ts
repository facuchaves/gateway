import { registerAs } from '@nestjs/config';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { Logger } from '@nestjs/common';

const logger = new Logger('SSMConfig');

async function getSsmParameter(
  client: SSMClient,
  name: string,
  withDecryption: boolean = false,
): Promise<string | undefined> {
  try {
    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: withDecryption,
    });
    const response = await client.send(command);
    return response.Parameter?.Value;
  } catch (error) {
    logger.error(`Failed to fetch parameter ${name}:`, error);
    return undefined;
  }
}

export default registerAs('ssm', async () => {
  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod';

  if (!isProduction) {
    // Return empty config, so fallback to local .env will work naturally.
    return {};
  }

  logger.log('Fetching configuration from AWS SSM...');

  const client = new SSMClient({
    region:
      process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'us-east-2',
  });

  logger.log(
    `process.env.AWS_REGION: ${process.env.AWS_REGION} process.env.AWS_DEFAULT_REGION : ${process.env.AWS_DEFAULT_REGION} `,
  );

  const paramPrefix = '/prod/microservice/';

  const [dbType, dbHost, dbUsername, dbPassword, dbDatabase] =
    await Promise.all([
      getSsmParameter(client, `${paramPrefix}DDBB_TYPE`),
      getSsmParameter(client, `${paramPrefix}DDBB_HOST`),
      getSsmParameter(client, `${paramPrefix}DDBB_USERNAME`),
      getSsmParameter(client, `${paramPrefix}DDBB_PASSWORD`, true),
      getSsmParameter(client, `${paramPrefix}DDBB_DATABASE`),
    ]);

  return {
    DDBB_TYPE: dbType,
    DDBB_HOST: dbHost,
    DDBB_USERNAME: dbUsername,
    DDBB_PASSWORD: dbPassword,
    DDBB_DATABASE: dbDatabase,
  };
});
