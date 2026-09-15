import { PeopleApi } from '../api/PeopleApi';
import type { Person } from '../../domain/entities/Person';
import type { PeopleRepository } from '../../domain/repositories/PeopleRepository';

export class PeopleRepositoryImpl implements PeopleRepository {
  constructor(private readonly peopleApi: PeopleApi) {}

  async getPeople(): Promise<Person[]> {
    const people = await this.peopleApi.getPeople();

    return people.map((person) => ({
      id: person.id,
      name: `${person.firstName} ${person.lastName}`,
      email: person.email,
    }));
  }
}
