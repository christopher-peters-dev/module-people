import type { Person } from '../entities/Person';
import type { PeopleRepository } from '../repositories/PeopleRepository';

export class GetPeople {
  constructor(private readonly repository: PeopleRepository) {}

  execute(): Promise<Person[]> {
    return this.repository.getPeople();
  }
}
