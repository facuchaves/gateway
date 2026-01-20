import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FilterInputDto } from 'src/entity/dtos/filter-input.dto';
import { FilterOutputDto } from 'src/entity/dtos/filter-output.dto';

@Injectable()
export class FilterPipe
  implements PipeTransform<FilterInputDto, FilterOutputDto> {
  transform(value: FilterInputDto): FilterOutputDto {
    if (value.minAge > value.maxAge) {
      throw new BadRequestException('Max age must be greater than min age.');
    }

    return {
      ...value,
      isAdult: value.minAge >= 18,
    };
  }
}
