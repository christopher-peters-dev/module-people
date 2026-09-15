import { useMemo } from 'react';
import type { DependencyContainer } from 'tsyringe';
import { GetPeople } from '../domain/usecases/GetPeople';
import { PeopleScreen } from '../presentation/screens/PeopleScreen';

interface PeopleFeatureProps {
  container: DependencyContainer;
}

export function PeopleFeature({ container }: PeopleFeatureProps) {
  const getPeople = useMemo(() => container.resolve(GetPeople), [container]);

  return <PeopleScreen getPeople={getPeople} />;
}
