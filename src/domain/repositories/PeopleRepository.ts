import type { Person } from '../entities/Person';

export interface PeopleRepository {
  getPeople(): Promise<Person[]>;
}
