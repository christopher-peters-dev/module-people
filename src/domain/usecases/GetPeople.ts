import { inject, injectable } from 'tsyringe';
import type { Person } from '../entities/Person';
import type { PeopleRepository } from '../repositories/PeopleRepository';
import { peopleTokens } from '../../di/tokens';

@injectable()
export class GetPeople {
  constructor(
    @inject(peopleTokens.repository)
    private readonly repository: PeopleRepository
  ) {}

  execute(): Promise<Person[]> {
    return this.repository.getPeople();
  }
}
