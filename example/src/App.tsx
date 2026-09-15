import { PeopleScreen } from '../../src';
import { PeopleApi } from '../../src/data/api/PeopleApi';
import { PeopleRepositoryImpl } from '../../src/data/repositories/PeopleRepositoryImpl';
import { GetPeople } from '../../src/domain/usecases/GetPeople';

const peopleApi = new PeopleApi();
const peopleRepository = new PeopleRepositoryImpl(peopleApi);
const getPeople = new GetPeople(peopleRepository);

export default function App() {
  return <PeopleScreen getPeople={getPeople} />;
}
