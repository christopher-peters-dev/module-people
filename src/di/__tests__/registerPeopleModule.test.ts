import { describe, expect, it } from '@jest/globals';
import { container } from 'tsyringe';
import { PeopleRepositoryImpl } from '../../data/repositories/PeopleRepositoryImpl';
import { GetPeople } from '../../domain/usecases/GetPeople';
import { registerPeopleModule } from '../registerPeopleModule';
import { peopleTokens } from '../tokens';

describe('registerPeopleModule', () => {
  it('registers a transient people dependency graph in the supplied container only', () => {
    const firstContainer = container.createChildContainer();
    const secondContainer = container.createChildContainer();

    registerPeopleModule(firstContainer);
    registerPeopleModule(secondContainer);

    expect(firstContainer.resolve(GetPeople)).toBeInstanceOf(GetPeople);
    expect(firstContainer.resolve(peopleTokens.repository)).toBeInstanceOf(
      PeopleRepositoryImpl
    );
    expect(firstContainer.resolve(GetPeople)).not.toBe(
      secondContainer.resolve(GetPeople)
    );
    expect(container.isRegistered(peopleTokens.repository, false)).toBe(false);
  });
});
