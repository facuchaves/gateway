import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Min } from 'class-validator';

export class FilterOutputDto {
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
    examples: [18, 27, 53],
    example: 71,
  })
  @IsInt()
  @Min(0)
  maxAge: number;

  @ApiProperty({
    description: 'true if is adult',
    type: Boolean,
  })
  @IsBoolean()
  isAdult: boolean;
}
