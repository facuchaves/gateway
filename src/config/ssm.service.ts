import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';
import { Injectable, Logger } from '@nestjs/common';

const logger = new Logger('SSMService');

@Injectable()
export class SSMService {
  private client = new SSMClient({
    region:
      process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'us-east-2',
  });

  async getParams(paths: string[]): Promise<Record<string, string>> {
    const command = new GetParametersCommand({
      Names: paths,
      WithDecryption: true,
    });

    const { Parameters, InvalidParameters } = await this.client.send(command);

    if (InvalidParameters?.length) {
      logger.error(
        `Error fetching SSM params : ${paths} cause : ${InvalidParameters.join(', ')}`,
      );
      throw new Error(`SSM params not found: ${InvalidParameters.join(', ')}`);
    }

    return Parameters.reduce(
      (acc, param) => {
        const key = param.Name.split('/').pop();
        acc[key] = param.Value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }
}
