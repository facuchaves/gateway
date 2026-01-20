import { ApiProperty } from '@nestjs/swagger';

export class CreateGenericEntityResponseDto {
  @ApiProperty({
    description: 'Id of the created entity',
    type: Number,
    minimum: 1,
    examples: [18, 27, 53],
    example: 21,
  })
  id: number;
}
