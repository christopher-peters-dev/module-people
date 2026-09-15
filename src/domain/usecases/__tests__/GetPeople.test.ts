import { describe, expect, it, jest } from '@jest/globals';
import type { Person } from '../../entities/Person';
import type { PeopleRepository } from '../../repositories/PeopleRepository';
import { GetPeople } from '../GetPeople';

describe('GetPeople', () => {
  it('returns people from the repository', async () => {
    const people: Person[] = [
      { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
    ];
    const repository: PeopleRepository = {
      getPeople: jest.fn(async () => people),
    };
    const getPeople = new GetPeople(repository);

    await expect(getPeople.execute()).resolves.toEqual(people);
    expect(repository.getPeople).toHaveBeenCalledTimes(1);
  });
});
