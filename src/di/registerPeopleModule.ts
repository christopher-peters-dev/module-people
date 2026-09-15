import { Lifecycle } from 'tsyringe';
import type { DependencyContainer } from 'tsyringe';
import { PeopleApi } from '../data/api/PeopleApi';
import { PeopleRepositoryImpl } from '../data/repositories/PeopleRepositoryImpl';
import { GetPeople } from '../domain/usecases/GetPeople';
import { peopleTokens } from './tokens';

export function registerPeopleModule(container: DependencyContainer): void {
  container.register(
    PeopleApi,
    { useClass: PeopleApi },
    { lifecycle: Lifecycle.Transient }
  );
  container.register(
    peopleTokens.repository,
    { useClass: PeopleRepositoryImpl },
    { lifecycle: Lifecycle.Transient }
  );
  container.register(
    GetPeople,
    { useClass: GetPeople },
    { lifecycle: Lifecycle.Transient }
  );
}
