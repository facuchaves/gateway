import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateEntityRequestDto {
  @ApiProperty({
    description: 'The name of the entity',
    type: String,
    nullable: false,
    example: 'Rebeca',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Some numeric value of an generic entity',
    type: Number,
    minimum: 0,
    maximum: 100,
    example: 67,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  score: number;
}
