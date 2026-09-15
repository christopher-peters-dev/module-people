import { inject, injectable } from 'tsyringe';
import { PeopleApi } from '../api/PeopleApi';
import type { Person } from '../../domain/entities/Person';
import type { PeopleRepository } from '../../domain/repositories/PeopleRepository';

@injectable()
export class PeopleRepositoryImpl implements PeopleRepository {
  constructor(@inject(PeopleApi) private readonly peopleApi: PeopleApi) {}

  async getPeople(): Promise<Person[]> {
    const people = await this.peopleApi.getPeople();

    return people.map((person) => ({
      id: person.id,
      name: `${person.firstName} ${person.lastName}`,
      email: person.email,
    }));
  }
}
