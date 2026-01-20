import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class FilterInputDto {
  @ApiProperty({
    description: 'Min age filter',
    type: Number,
    minimum: 0,
    examples: [18, 27, 53],
    example: 21,
  })
  @IsInt()
  @Min(0)
  minAge: number;

  @ApiProperty({
    description: 'Max age filter',
    type: Number,
    minimum: 0,
    examples: [19, 28, 54],
    example: 71,
  })
  @IsInt()
  @Min(0)
  maxAge: number;
}
