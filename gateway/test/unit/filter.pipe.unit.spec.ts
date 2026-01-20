import { BadRequestException } from '@nestjs/common';
import { FilterPipe } from '../../src/pipes/filter.pipe';

describe('Filter pipe (Unit)', () => {
  const filterPipe: FilterPipe = new FilterPipe();
  describe('Happy paths', () => {
    it(`should fill with adult true`, async () => {
      const adultFilter = {
        minAge: 18,
        maxAge: 21,
      };

      const adultFilterTransformed = filterPipe.transform(adultFilter);

      expect(adultFilterTransformed).toEqual({
        ...adultFilter,
        isAdult: true,
      });
    });

    it(`should fill with adult false`, async () => {
      const childFilter = {
        minAge: 17,
        maxAge: 21,
      };

      const childFilterTransformed = filterPipe.transform(childFilter);

      expect(childFilterTransformed).toEqual({
        ...childFilter,
        isAdult: false,
      });
    });
  });

  describe('Error paths', () => {
    it(`should throw bad request exception on min age greater than max age`, async () => {
      const adultFilter = {
        minAge: 22,
        maxAge: 21,
      };

      expect(() => filterPipe.transform(adultFilter)).toThrow(
        BadRequestException,
      );
    });
  });
});
