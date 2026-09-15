import { describe, expect, it, jest } from '@jest/globals';
import { PeopleApi } from '../../api/PeopleApi';
import { PeopleRepositoryImpl } from '../PeopleRepositoryImpl';

describe('PeopleRepositoryImpl', () => {
  it('maps people DTOs into domain people', async () => {
    const peopleApi = new PeopleApi();
    const getPeople = jest.spyOn(peopleApi, 'getPeople').mockResolvedValue([
      {
        id: 1,
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      },
    ]);
    const repository = new PeopleRepositoryImpl(peopleApi);

    await expect(repository.getPeople()).resolves.toEqual([
      { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
    ]);
    expect(getPeople).toHaveBeenCalledTimes(1);
  });
});
