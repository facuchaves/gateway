import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CreateEntityRequestDto } from './create-entity-request.dto';

export class EntityDto extends CreateEntityRequestDto {
  @ApiProperty({
    description: 'Id for an generic entity',
    type: Number,
    required: false,
  })
  @IsInt()
  id?: number;
}
