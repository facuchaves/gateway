import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateGenericEntityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  score?: number;
}
