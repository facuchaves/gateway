import { ApiProperty } from '@nestjs/swagger';

export class DeleteGenericEntityResponseDto {
  @ApiProperty({
    description: 'true if entity was deleted',
    type: Boolean,
  })
  deleted: boolean;
}
