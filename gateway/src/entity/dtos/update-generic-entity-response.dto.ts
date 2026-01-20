import { ApiProperty } from '@nestjs/swagger';

export class UpdateGenericEntityResponseDto {
  @ApiProperty({
    description: 'true if entity was updated',
    type: Boolean,
  })
  updated: boolean;
}
