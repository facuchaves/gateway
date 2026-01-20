import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateGenericEntityDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @Max(100)
  score: number;
}
